import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactDomMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { getNowEntriesForLocale, nowEntries, type NowEntry } from "../../nowEntries";
import { getResolvedUiLanguage } from "../../utils/language";
import { NowCard } from "./NowCard";
import type { ExpandedCardRect, ExpandedCardState } from "./types";

export function NowSection() {
  const { t, i18n } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    didDrag: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const openFrameRef = useRef<number | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const restoreTimeoutRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(nowEntries.length > 1);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedCard, setExpandedCard] = useState<ExpandedCardState | null>(null);
  const [restoringEntryId, setRestoringEntryId] = useState<string | null>(null);
  const currentLocale = getResolvedUiLanguage(i18n.language, i18n.resolvedLanguage);
  const localizedNowEntries = useMemo(
    () => getNowEntriesForLocale(currentLocale),
    [currentLocale],
  );

  const totalCards = localizedNowEntries.length;
  const expandedEntry = useMemo(
    () => localizedNowEntries.find((entry) => entry.id === expandedCard?.entryId) ?? null,
    [expandedCard, localizedNowEntries],
  );

  const getCardElements = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return [] as HTMLElement[];
    }

    return Array.from(carousel.querySelectorAll<HTMLElement>("[data-now-card]"));
  };

  const clearAnimationTimers = useCallback(() => {
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (restoreTimeoutRef.current !== null) {
      window.clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }
  }, []);

  const getNearestIndex = useCallback(() => {
    const carousel = carouselRef.current;
    const cards = getCardElements();

    if (!carousel || cards.length === 0) {
      return 0;
    }

    const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
    const currentScrollLeft = Math.min(Math.max(carousel.scrollLeft, 0), maxScrollLeft);
    const viewportCenter = currentScrollLeft + carousel.clientWidth / 2;

    return cards.reduce((closestIndex, card, index) => {
      const closestCard = cards[closestIndex];
      const currentCardCenter = card.offsetLeft + card.clientWidth / 2;
      const closestCardCenter = closestCard.offsetLeft + closestCard.clientWidth / 2;
      const currentDistance = Math.abs(currentCardCenter - viewportCenter);
      const closestDistance = Math.abs(closestCardCenter - viewportCenter);

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);
  }, []);

  const syncCarouselState = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
    const currentScrollLeft = Math.min(Math.max(carousel.scrollLeft, 0), maxScrollLeft);
    const nearestIndex = getNearestIndex();
    const isAtEnd = currentScrollLeft >= maxScrollLeft - 8;
    const isAtStart = currentScrollLeft <= 8;
    const resolvedActiveIndex = isAtEnd
      ? Math.max(totalCards - 1, 0)
      : isAtStart
        ? 0
        : nearestIndex;

    setActiveIndex(resolvedActiveIndex);
    setCanScrollPrev(currentScrollLeft > 8 && resolvedActiveIndex > 0);
    setCanScrollNext(currentScrollLeft < maxScrollLeft - 8 && resolvedActiveIndex < totalCards - 1);
  }, [getNearestIndex, totalCards]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    syncCarouselState();
    carousel.addEventListener("scroll", syncCarouselState, { passive: true });
    window.addEventListener("resize", syncCarouselState);

    return () => {
      carousel.removeEventListener("scroll", syncCarouselState);
      window.removeEventListener("resize", syncCarouselState);
    };
  }, [syncCarouselState]);

  useEffect(() => () => {
    clearAnimationTimers();
  }, [clearAnimationTimers]);

  useEffect(() => {
    if (!expandedCard) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedCard((current) => current
          ? {
              ...current,
              phase: current.phase === "closing" ? current.phase : "closing",
            }
          : null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [expandedCard]);

  const getExpandedTargetRect = useCallback((): ExpandedCardRect => {
    const isMobile = window.innerWidth <= 768;
    const gutter = isMobile ? 8 : 14;
    const top = isMobile ? 12 : Math.min(Math.max(window.innerHeight * 0.05, 14), 44);
    const width = Math.min(
      isMobile ? window.innerWidth - gutter * 2 : 736,
      window.innerWidth - gutter * 2,
    );
    const heightLimit = isMobile
      ? window.innerHeight - top - 12
      : Math.min(window.innerHeight * 0.84, 832);

    return {
      top,
      left: Math.max((window.innerWidth - width) / 2, gutter),
      width,
      height: Math.max(heightLimit, 320),
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const carousel = carouselRef.current;
    const cards = getCardElements();
    const nextCard = cards[index];

    if (!carousel || !nextCard) {
      return;
    }

    const inlineStartPadding = Number.parseFloat(
      window.getComputedStyle(carousel).paddingInlineStart,
    ) || 0;

    carousel.scrollTo({
      left: Math.max(nextCard.offsetLeft - inlineStartPadding, 0),
      behavior: "smooth",
    });
  };

  const scrollByDirection = (direction: "prev" | "next") => {
    const nextIndex = direction === "next"
      ? Math.min(activeIndex + 1, totalCards - 1)
      : Math.max(activeIndex - 1, 0);

    scrollToIndex(nextIndex);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;

    if (
      !carousel ||
      expandedCard ||
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      (event.target instanceof Element &&
        event.target.closest("a, button, input, textarea, select, summary"))
    ) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: carousel.scrollLeft,
      didDrag: false,
    };

    setIsDragging(true);
    carousel.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const dragState = dragStateRef.current;

    if (!carousel || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (!dragState.didDrag && Math.abs(deltaX) > 6) {
      dragState.didDrag = true;
    }

    carousel.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const finishPointerDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    const dragState = dragStateRef.current;

    if (!carousel || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
    suppressClickRef.current = dragState.didDrag;

    if (dragState.didDrag) {
      scrollToIndex(getNearestIndex());
    }
  };

  const handleClickCapture = (event: ReactDomMouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const handleExpand = (entry: NowEntry, card: HTMLElement) => {
    clearAnimationTimers();
    setRestoringEntryId(null);
    const sourceRect = card.getBoundingClientRect();
    const sourceTransform = window.getComputedStyle(card).transform;
    setExpandedCard({
      entryId: entry.id,
      sourceRect,
      targetRect: getExpandedTargetRect(),
      sourceTransform: sourceTransform === "none" ? "rotate(0deg)" : sourceTransform,
      phase: "entering",
    });
    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = window.requestAnimationFrame(() => {
        setExpandedCard((current) => (current && current.entryId === entry.id
          ? { ...current, phase: "open" }
          : current));
      });
    });
  };

  useEffect(() => {
    if (!expandedCard) {
      return;
    }

    const syncExpandedTarget = () => {
      setExpandedCard((current) => (current
        ? {
            ...current,
            targetRect: getExpandedTargetRect(),
          }
        : null));
    };

    window.addEventListener("resize", syncExpandedTarget);

    return () => {
      window.removeEventListener("resize", syncExpandedTarget);
    };
  }, [expandedCard, getExpandedTargetRect]);

  const handleCloseExpanded = useCallback(() => {
    clearAnimationTimers();
    const closingEntryId = expandedCard?.entryId ?? null;

    setExpandedCard((current) => (current ? { ...current, phase: "closing" } : null));
    closeTimeoutRef.current = window.setTimeout(() => {
      setExpandedCard(null);
      closeTimeoutRef.current = null;

      if (closingEntryId) {
        setRestoringEntryId(closingEntryId);
        restoreTimeoutRef.current = window.setTimeout(() => {
          setRestoringEntryId((current) => (
            current === closingEntryId ? null : current
          ));
          restoreTimeoutRef.current = null;
        }, 520);
      }
    }, 560);
  }, [clearAnimationTimers, expandedCard?.entryId]);

  return (
    <section className="now-section" aria-labelledby="now-section-title">
      <div className="now-section-shell">
        <div className="now-section-header">
          <p className="hand-drawn-label now-section-kicker">{t("now.kicker")}</p>

          <div className="now-section-title-row">
            <h2 id="now-section-title" className="now-section-title">
              {t("now.title")}
            </h2>

            <div className="now-carousel-controls" aria-label={t("now.controlsLabel")}>
              <button
                type="button"
                className="now-arrow-button"
                onClick={() => scrollByDirection("prev")}
                disabled={!canScrollPrev || Boolean(expandedCard)}
                aria-label={t("now.previous")}
              >
                ←
              </button>
              <button
                type="button"
                className="now-arrow-button"
                onClick={() => scrollByDirection("next")}
                disabled={!canScrollNext || Boolean(expandedCard)}
                aria-label={t("now.next")}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div
          ref={carouselRef}
          className={`now-carousel ${isDragging ? "is-dragging" : ""} ${expandedCard ? "has-expanded-card" : ""}`}
          aria-label={t("now.carouselLabel")}
          tabIndex={expandedCard ? -1 : 0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointerDrag}
          onPointerCancel={finishPointerDrag}
          onLostPointerCapture={finishPointerDrag}
          onClickCapture={handleClickCapture}
        >
          {localizedNowEntries.map((entry: NowEntry) => {
            const isExpandedEntry = expandedCard?.entryId === entry.id;
            const isRestoringEntry = restoringEntryId === entry.id;

            return (
              <NowCard
                key={entry.id}
                entry={entry}
                isHidden={isExpandedEntry}
                isRestoring={isRestoringEntry}
                onExpand={handleExpand}
              />
            );
          })}
        </div>

        <div className="now-carousel-progress" aria-label={t("now.progressLabel")}>
          {localizedNowEntries.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              className={`now-progress-dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => scrollToIndex(index)}
              aria-label={t("now.jumpTo", { index: index + 1, title: entry.title })}
              aria-pressed={index === activeIndex}
              disabled={Boolean(expandedCard)}
            />
          ))}
        </div>
      </div>

      {expandedCard && expandedEntry && (
        <>
          <button
            type="button"
            className={`now-expanded-backdrop is-${expandedCard.phase}`}
            aria-label={t("now.close")}
            onClick={handleCloseExpanded}
          />
          <div className="now-expanded-shell" aria-hidden="true">
            <NowCard
              entry={expandedEntry}
              isExpanded
              expansionState={expandedCard}
              onClose={handleCloseExpanded}
            />
          </div>
        </>
      )}
    </section>
  );
}
