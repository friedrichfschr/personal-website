import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type MouseEvent as ReactDomMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./App.css";
import { Button, Link } from "@heroui/react";
import { useTranslation } from "react-i18next";
import {
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./icons";
import { siteConfig } from "../site";
import { downloadCV, type CVLanguage } from "./utils/cvDownload";
import { nowEntries, type NowEntry, type NowRichTextSpan } from "./nowEntries";

const uiLanguages = ["en", "de", "fr", "zh"] as const;
type UiLanguage = (typeof uiLanguages)[number];

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  arrowLeft: number;
};

type ExpandedCardState = {
  entryId: string;
  sourceRect: DOMRect;
  sourceTransform: string;
  phase: "entering" | "open" | "closing";
};

const spanToStyle = (span: NowRichTextSpan) => ({
  fontWeight: span.bold ? 700 : undefined,
  fontStyle: span.italic ? "italic" : undefined,
  textDecoration: span.underline ? "underline" : undefined,
});

const renderRichSpan = (span: NowRichTextSpan, index: number) => {
  const style = spanToStyle(span);

  if (span.href) {
    return (
      <a
        key={`${span.text}-${index}`}
        href={span.href}
        target={span.href.startsWith("http") ? "_blank" : undefined}
        rel={span.href.startsWith("http") ? "noreferrer" : undefined}
        className="now-card-link"
        style={style}
      >
        {span.text}
      </a>
    );
  }

  return (
    <span key={`${span.text}-${index}`} style={style}>
      {span.text}
    </span>
  );
};

const renderRichBlocks = (entry: NowEntry, className = "now-card-body") => (
  <div className={className}>
    {entry.blocks.map((block, blockIndex) => (
      <p
        key={`${entry.id}-${blockIndex}`}
        className={`now-card-text ${block.type === "quote" ? "is-quote" : ""}`}
      >
        {block.spans.map(renderRichSpan)}
      </p>
    ))}
  </div>
);

function NowCard({
  entry,
  isExpanded = false,
  isHidden = false,
  expansionState = null,
  onExpand,
  onClose,
}: {
  entry: NowEntry;
  isExpanded?: boolean;
  isHidden?: boolean;
  expansionState?: ExpandedCardState | null;
  onExpand?: (entry: NowEntry, card: HTMLElement) => void;
  onClose?: () => void;
}) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const expandableBlocks = entry.expandable?.blocks ?? [];

  const expandedStyle = useMemo(() => {
    if (!isExpanded || !expansionState) {
      return undefined;
    }

    return {
      "--now-source-top": `${expansionState.sourceRect.top}px`,
      "--now-source-left": `${expansionState.sourceRect.left}px`,
      "--now-source-width": `${expansionState.sourceRect.width}px`,
      "--now-source-height": `${expansionState.sourceRect.height}px`,
      "--now-source-transform": expansionState.sourceTransform,
    } as CSSProperties;
  }, [expansionState, isExpanded]);

  useEffect(() => {
    if (isExpanded && expansionState?.phase === "open") {
      closeButtonRef.current?.focus();
    }
  }, [expansionState?.phase, isExpanded]);

  return (
    <article
      ref={cardRef}
      className={[
        "now-card",
        entry.expandable && !isExpanded ? "is-selectable" : "",
        isExpanded ? "is-expanded" : "",
        expansionState ? `is-${expansionState.phase}` : "",
        isHidden ? "is-hidden-placeholder" : "",
      ].filter(Boolean).join(" ")}
      data-now-card
      style={{ "--now-accent": entry.accent, ...expandedStyle } as CSSProperties}
      aria-expanded={isExpanded || undefined}
      aria-hidden={isHidden || undefined}
      onClick={(event) => {
        if (
          isExpanded ||
          !entry.expandable ||
          (event.target instanceof Element && event.target.closest("a, button"))
        ) {
          return;
        }

        if (cardRef.current) {
          onExpand?.(entry, cardRef.current);
        }
      }}
    >
      <div className={`now-card-meta-row ${isExpanded ? "is-expanded-header" : ""}`}>
        {isExpanded ? (
          <>
            <button
              ref={closeButtonRef}
              type="button"
              className="now-card-close"
              aria-label={t("now.close")}
              onClick={onClose}
            >
              ×
            </button>
            <div className="now-card-meta-actions">
              <span className="now-card-date">{entry.date}</span>
              {entry.originalLanguage && (
                <span
                  className="now-card-language-pill"
                  aria-label={`${t("now.originalLanguage")}: ${entry.originalLanguage}`}
                  title={`${t("now.originalLanguage")}: ${entry.originalLanguage}`}
                >
                  {entry.originalLanguage}
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="now-card-date">{entry.date}</span>
            <div className="now-card-meta-actions">
              {entry.originalLanguage && (
                <span
                  className="now-card-language-pill"
                  aria-label={`${t("now.originalLanguage")}: ${entry.originalLanguage}`}
                  title={`${t("now.originalLanguage")}: ${entry.originalLanguage}`}
                >
                  {entry.originalLanguage}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <h3 className="now-card-title">{entry.title}</h3>

      {entry.image && (
        <figure className="now-card-image-wrap">
          <img
            src={entry.image.src}
            alt={entry.image.alt}
            className="now-card-image"
            draggable={false}
          />
          {entry.image.caption && (
            <figcaption className="now-card-image-caption">
              {entry.image.caption}
            </figcaption>
          )}
        </figure>
      )}

      {renderRichBlocks(entry)}

      {isExpanded && entry.expandable?.summary && (
        <p className="now-card-footnote now-expanded-summary">{entry.expandable.summary}</p>
      )}

      {isExpanded && expandableBlocks.length > 0 && (
        <div className="now-card-body now-expanded-body">
          {expandableBlocks.map((block, blockIndex) => (
            <p
              key={`${entry.id}-expanded-${blockIndex}`}
              className={`now-card-text ${block.type === "quote" ? "is-quote" : ""}`}
            >
              {block.spans.map(renderRichSpan)}
            </p>
          ))}
        </div>
      )}

      {!isExpanded && entry.expandable && (
        <div className="now-card-footer">
          <span className="now-card-footnote">{entry.expandable.summary}</span>
          <button
            type="button"
            className="now-expand-button"
            onClick={(event) => {
              const card = event.currentTarget.closest("[data-now-card]");
              if (card instanceof HTMLElement) {
                onExpand?.(entry, card);
              }
            }}
            aria-haspopup="dialog"
          >
            {t("now.readMore")}
          </button>
        </div>
      )}
    </article>
  );
}

function NowSection() {
  const { t } = useTranslation();
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(nowEntries.length > 1);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedCard, setExpandedCard] = useState<ExpandedCardState | null>(null);

  const totalCards = nowEntries.length;
  const expandedEntry = useMemo(
    () => nowEntries.find((entry) => entry.id === expandedCard?.entryId) ?? null,
    [expandedCard],
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

    setActiveIndex(nearestIndex);
    setCanScrollPrev(currentScrollLeft > 8 && nearestIndex > 0);
    setCanScrollNext(currentScrollLeft < maxScrollLeft - 8 && nearestIndex < totalCards - 1);
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

  useEffect(() => {
    return () => {
      clearAnimationTimers();
    };
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
    const sourceRect = card.getBoundingClientRect();
    const sourceTransform = window.getComputedStyle(card).transform;
    setExpandedCard({
      entryId: entry.id,
      sourceRect,
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

  const handleCloseExpanded = useCallback(() => {
    clearAnimationTimers();
    setExpandedCard((current) => (current ? { ...current, phase: "closing" } : null));
    closeTimeoutRef.current = window.setTimeout(() => {
      setExpandedCard(null);
      closeTimeoutRef.current = null;
    }, 560);
  }, [clearAnimationTimers]);

  return (
    <section className="now-section" aria-labelledby="now-section-title">
      <div className="now-section-shell">
        <div className="now-section-header">
          <div>
            <p className="hand-drawn-label now-section-kicker">{t("now.kicker")}</p>
            <h2 id="now-section-title" className="now-section-title">
              {t("now.title")}
            </h2>
            <p className="now-section-copy">{t("now.description")}</p>
          </div>

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
          {nowEntries.map((entry: NowEntry) => {
            const isExpandedEntry = expandedCard?.entryId === entry.id;

            return (
              <NowCard
                key={entry.id}
                entry={entry}
                isHidden={isExpandedEntry}
                onExpand={handleExpand}
              />
            );
          })}
        </div>

        <div className="now-carousel-progress" aria-label={t("now.progressLabel")}>
          {nowEntries.map((entry, index) => (
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

function App() {
  const { t, i18n } = useTranslation();
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const cvDropdownRef = useRef<HTMLDivElement>(null);
  const cvTriggerRef = useRef<HTMLButtonElement | null>(null);
  const cvCloseTimeoutRef = useRef<number | null>(null);
  const currentLanguage =
    (i18n.resolvedLanguage?.split("-")[0] ?? i18n.language.split("-")[0]) ||
    "en";

  const updateDropdownPosition = useCallback(() => {
    const trigger = cvTriggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const width = Math.min(Math.max(rect.width, 240), 320);
    const left = Math.min(
      Math.max(16, rect.left + rect.width / 2 - width / 2),
      window.innerWidth - width - 16,
    );

    setDropdownPosition({
      top: rect.bottom + 2,
      left,
      width,
      arrowLeft: rect.left + rect.width / 2 - left,
    });
  }, []);

  const clearCVCloseTimeout = useCallback(() => {
    if (cvCloseTimeoutRef.current !== null) {
      window.clearTimeout(cvCloseTimeoutRef.current);
      cvCloseTimeoutRef.current = null;
    }
  }, []);

  const scheduleCVClose = useCallback(() => {
    if (isTouchDevice) {
      return;
    }

    clearCVCloseTimeout();
    cvCloseTimeoutRef.current = window.setTimeout(() => {
      setShowCVOptions(false);
      cvCloseTimeoutRef.current = null;
    }, 120);
  }, [clearCVCloseTimeout, isTouchDevice]);

  const isWithinCVControls = useCallback((node: EventTarget | null) => {
    if (!(node instanceof Node)) {
      return false;
    }

    return Boolean(
      cvTriggerRef.current?.contains(node) || cvDropdownRef.current?.contains(node),
    );
  }, []);

  const handleCVDownload = (language: CVLanguage) => {
    clearCVCloseTimeout();
    downloadCV(language);
    setShowCVOptions(false);
  };

  const handleCVHover = () => {
    if (!isTouchDevice) {
      clearCVCloseTimeout();
      setShowCVOptions(true);
    }
  };

  const handleCVLeave = (event: ReactMouseEvent<HTMLElement>) => {
    if (isTouchDevice || isWithinCVControls(event.relatedTarget)) {
      return;
    }

    scheduleCVClose();
  };

  const handleCVClick = () => {
    clearCVCloseTimeout();
    setShowCVOptions((current) => !current);
  };

  const changeLanguage = (language: UiLanguage) => {
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const hasTouchCapability = () =>
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    setIsTouchDevice(hasTouchCapability());
  }, []);

  useLayoutEffect(() => {
    if (!showCVOptions) {
      return;
    }

    updateDropdownPosition();

    const syncPosition = () => updateDropdownPosition();

    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);

    return () => {
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [showCVOptions, updateDropdownPosition]);

  useEffect(() => {
    return () => {
      clearCVCloseTimeout();
    };
  }, [clearCVCloseTimeout]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        cvDropdownRef.current?.contains(target) ||
        cvTriggerRef.current?.contains(target)
      ) {
        return;
      }

      setShowCVOptions(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCVOptions(false);
      }
    };

    if (showCVOptions) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown, { passive: true });
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCVOptions]);

  return (
    <div className="hand-drawn-bg page-shell min-h-screen p-4 sm:p-8">
      <div className="hand-drawn-container page-stack max-w-5xl w-full mx-auto">
        <section className="intro-section">
          <div className="top-toolbar">
            <div
              className="hand-drawn-language-switcher"
              role="group"
              aria-label={t("languageSwitcher.label")}
            >
              <div className="hand-drawn-language-options">
                {uiLanguages.map((language) => {
                  const isActive = currentLanguage === language;

                  return (
                    <button
                      key={language}
                      type="button"
                      className={`hand-drawn-language-pill ${isActive ? "is-active" : ""}`}
                      onClick={() => changeLanguage(language)}
                      aria-pressed={isActive}
                      aria-label={t(`languageSwitcher.aria.${language}`)}
                      title={t(`languageSwitcher.aria.${language}`)}
                    >
                      {t(`languageSwitcher.options.${language}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hero-shell">
            <div className="hero-copy-block">
              <h1 className="hand-drawn-title hero-title">{t("hero.title")}</h1>
              <p className="hand-drawn-subtitle hero-subtitle">{t("hero.subtitle")}</p>
            </div>

            <div className="hero-spotlight-card hand-drawn-card">
              <div className="hero-portrait-stack">
                <span className="hero-orbit hero-orbit-one" aria-hidden="true"></span>
                <span className="hero-orbit hero-orbit-two" aria-hidden="true"></span>
                <div className="hero-portrait-frame">
                  <img
                    draggable={false}
                    style={{ userSelect: "none" }}
                    src="/Portrait.png"
                    alt={t("accessibility.portraitAlt")}
                    className="hand-drawn-portrait hero-portrait-image"
                  />
                </div>
              </div>

              <div className="hero-side-panel">
                <div className="social-links-block">
                  <h3 className="hand-drawn-label hero-panel-label">
                    {t("social.label")}
                  </h3>
                  <div className="social-links-grid">
                    <Link
                      target="_blank"
                      href={siteConfig.links.instagram}
                      aria-label="Instagram"
                      className="hand-drawn-icon-button"
                    >
                      <InstagramIcon className="text-rose-600 dark:text-fuchsia-400 w-6 h-6" />
                    </Link>
                    <Link
                      target="_blank"
                      href={siteConfig.links.youtube}
                      aria-label="Youtube"
                      className="hand-drawn-icon-button"
                    >
                      <YoutubeIcon className="text-red-600 w-6 h-6" />
                    </Link>
                    <Link
                      target="_blank"
                      href={siteConfig.links.twitter}
                      aria-label="Twitter"
                      className="hand-drawn-icon-button"
                    >
                      <TwitterIcon className="dark:text-blue-500 text-blue-600 w-6 h-6" />
                    </Link>
                    <Link
                      target="_blank"
                      href={siteConfig.links.github}
                      aria-label="GitHub"
                      className="hand-drawn-icon-button"
                    >
                      <GithubIcon className="text-foreground w-6 h-6" />
                    </Link>
                    <Link
                      target="_blank"
                      href={siteConfig.links.linkedIn}
                      aria-label="LinkedIn"
                      className="hand-drawn-icon-button"
                    >
                      <LinkedInIcon className="text-blue-900 dark:text-blue-500 w-6 h-6" />
                    </Link>
                    <Link
                      target="_blank"
                      href={siteConfig.links.mail}
                      aria-label="Mail"
                      className="hand-drawn-icon-button"
                    >
                      <MailIcon className="text-foreground w-6 h-6" />
                    </Link>
                  </div>
                </div>

                <div
                  className="cv-dropdown-wrap"
                  onMouseEnter={handleCVHover}
                  onMouseLeave={handleCVLeave}
                >
                  <Button
                    ref={cvTriggerRef}
                    className="hand-drawn-button cv-trigger-button"
                    onPress={handleCVClick}
                    aria-haspopup="menu"
                    aria-expanded={showCVOptions}
                  >
                    <span>{t("cv.button")}</span>
                    <span className={`cv-trigger-chevron ${showCVOptions ? "is-open" : ""}`} aria-hidden="true">
                      ▾
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showCVOptions && dropdownPosition && (
          <div
            ref={cvDropdownRef}
            className="hand-drawn-dropdown-menu cv-portal-dropdown"
            aria-label={t("cv.label")}
            role="menu"
            onMouseEnter={handleCVHover}
            onMouseLeave={handleCVLeave}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              "--dropdown-arrow-left": `${dropdownPosition.arrowLeft}px`,
            } as CSSProperties}
          >
            <div className="hand-drawn-dropdown-arrow"></div>
            <span className="hand-drawn-dropdown-label">{t("cv.availableLabel")}</span>
            <div className="cv-dropdown-actions">
              <Button
                size="sm"
                className="hand-drawn-button-secondary cv-option-button"
                onPress={() => handleCVDownload("en")}
              >
                {t("cv.languages.en")}
              </Button>
              <Button
                size="sm"
                className="hand-drawn-button-secondary cv-option-button"
                onPress={() => handleCVDownload("de")}
              >
                {t("cv.languages.de")}
              </Button>
            </div>
          </div>
        )}

        <NowSection />
      </div>
    </div>
  );
}

export default App;
