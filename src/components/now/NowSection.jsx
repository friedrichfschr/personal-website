import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mapNowEntriesForLocale, nowEntries } from '../../nowEntries';
import { fetchBlogPosts } from '../../lib/blogApi';
import { NowCard } from './NowCard';

const labels = {
  kicker: 'discover my',
  title: "Projects",
  controlsLabel: 'Now carousel controls',
  carouselLabel: 'Now page entries',
  progressLabel: 'Now carousel navigation',
  previous: 'Show previous entry',
  next: 'Show next entry',
  jumpTo: ({ index, title }) => `Jump to entry ${index}: ${title}`,
  close: 'Close entry',
};

export function NowSection() {
  const carouselRef = useRef(null);
  const dragStateRef = useRef(null);
  const suppressClickRef = useRef(false);
  const openFrameRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const restoreTimeoutRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nearestIndex, setNearestIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(nowEntries.length > 1);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [restoringEntryId, setRestoringEntryId] = useState(null);
  const [entryDefinitions, setEntryDefinitions] = useState(nowEntries);
  const [loadState, setLoadState] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const localizedNowEntries = useMemo(
    () => mapNowEntriesForLocale(entryDefinitions),
    [entryDefinitions],
  );

  const totalCards = localizedNowEntries.length;
  const expandedEntry = useMemo(
    () => localizedNowEntries.find((entry) => entry.id === expandedCard?.entryId) ?? null,
    [expandedCard, localizedNowEntries],
  );

  const getCardElements = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return [];
    }

    return Array.from(carousel.querySelectorAll('[data-now-card]'));
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

  const getDisplayActiveIndex = useCallback((resolvedNearestIndex) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return resolvedNearestIndex;
    }

    const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
    const currentScrollLeft = Math.min(Math.max(carousel.scrollLeft, 0), maxScrollLeft);
    const isAtEnd = currentScrollLeft >= maxScrollLeft - 8;
    const isAtStart = currentScrollLeft <= 8;

    if (isAtEnd) {
      return Math.max(totalCards - 1, 0);
    }

    if (isAtStart) {
      return 0;
    }

    return resolvedNearestIndex;
  }, [totalCards]);

  const syncCarouselState = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
    const currentScrollLeft = Math.min(Math.max(carousel.scrollLeft, 0), maxScrollLeft);
    const resolvedNearestIndex = getNearestIndex();
    const resolvedActiveIndex = getDisplayActiveIndex(resolvedNearestIndex);

    setNearestIndex(resolvedNearestIndex);
    setActiveIndex(resolvedActiveIndex);
    setCanScrollPrev(currentScrollLeft > 8);
    setCanScrollNext(currentScrollLeft < maxScrollLeft - 8);
  }, [getDisplayActiveIndex, getNearestIndex]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoadState('loading');
        setLoadError('');
        const blogPosts = await fetchBlogPosts(controller.signal);
        if (blogPosts.length > 0) {
          setEntryDefinitions(blogPosts);
          setLoadState('ready');
        } else {
          setLoadState(nowEntries.length > 0 ? 'ready' : 'empty');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Failed to load blog posts', error);
        setLoadError(error.message || 'Unknown blog loading error');
        setLoadState(nowEntries.length > 0 ? 'ready' : 'error');
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return undefined;
    }

    syncCarouselState();
    carousel.addEventListener('scroll', syncCarouselState, { passive: true });
    window.addEventListener('resize', syncCarouselState);

    return () => {
      carousel.removeEventListener('scroll', syncCarouselState);
      window.removeEventListener('resize', syncCarouselState);
    };
  }, [syncCarouselState]);

  useEffect(() => {
    setCanScrollNext(totalCards > 1);
  }, [totalCards]);

  useEffect(() => () => {
    clearAnimationTimers();
  }, [clearAnimationTimers]);

  useEffect(() => {
    if (!expandedCard) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setExpandedCard((current) => current
          ? {
            ...current,
            phase: current.phase === 'closing' ? current.phase : 'closing',
          }
          : null);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [expandedCard]);

  const getExpandedTargetRect = useCallback(() => {
    const isMobile = window.innerWidth <= 768;
    const gutter = isMobile ? 8 : 14;
    const width = Math.min(
      isMobile ? window.innerWidth - gutter * 2 : 736,
      window.innerWidth - gutter * 2,
    );
    const height = Math.max(
      Math.min(
        isMobile ? window.innerHeight - gutter * 2 : window.innerHeight * 0.84,
        832,
      ),
      320,
    );

    return {
      top: Math.max((window.innerHeight - height) / 2, gutter),
      left: Math.max((window.innerWidth - width) / 2, gutter),
      width,
      height,
    };
  }, []);

  const scrollToIndex = (index) => {
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
      behavior: 'smooth',
    });
  };

  const scrollByDirection = (direction) => {
    const nextIndex = direction === 'next'
      ? Math.min(nearestIndex + 1, totalCards - 1)
      : Math.max(nearestIndex - 1, 0);

    scrollToIndex(nextIndex);
  };

  const handlePointerDown = (event) => {
    const carousel = carouselRef.current;

    if (
      !carousel ||
      expandedCard ||
      event.pointerType !== 'mouse' ||
      event.button !== 0 ||
      (event.target instanceof Element &&
        event.target.closest('a, button, input, textarea, select, summary'))
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

  const handlePointerMove = (event) => {
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

  const finishPointerDrag = (event) => {
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
      const snappedIndex = getNearestIndex();
      scrollToIndex(snappedIndex);
    }
  };

  const handleClickCapture = (event) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const handleExpand = (entry, card) => {
    clearAnimationTimers();
    setRestoringEntryId(null);
    const sourceRect = card.getBoundingClientRect();
    const sourceTransform = window.getComputedStyle(card).transform;
    setExpandedCard({
      entryId: entry.id,
      sourceRect,
      targetRect: getExpandedTargetRect(),
      sourceTransform: sourceTransform === 'none' ? 'rotate(0deg)' : sourceTransform,
      phase: 'entering',
    });
    openFrameRef.current = window.requestAnimationFrame(() => {
      openFrameRef.current = window.requestAnimationFrame(() => {
        setExpandedCard((current) => (current && current.entryId === entry.id
          ? { ...current, phase: 'open' }
          : current));
      });
    });
  };

  useEffect(() => {
    if (!expandedCard) {
      return undefined;
    }

    const syncExpandedTarget = () => {
      setExpandedCard((current) => (current
        ? {
          ...current,
          targetRect: getExpandedTargetRect(),
        }
        : null));
    };

    window.addEventListener('resize', syncExpandedTarget);

    return () => {
      window.removeEventListener('resize', syncExpandedTarget);
    };
  }, [expandedCard, getExpandedTargetRect]);

  const handleCloseExpanded = useCallback(() => {
    clearAnimationTimers();
    const closingEntryId = expandedCard?.entryId ?? null;

    setExpandedCard((current) => (current ? { ...current, phase: 'closing' } : null));
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

  if (localizedNowEntries.length === 0) {
    const message = loadState === 'loading'
      ? 'Loading blog posts...'
      : loadState === 'error'
        ? `Blog posts could not be loaded. ${loadError}`
        : 'No blog posts were returned by the blog API.';

    return (
      <section className="now-section" aria-labelledby="now-section-title">
        <div className="now-section-shell">
          <div className="now-section-accent" aria-hidden="true"></div>
          <div className="now-section-header">
            <p className="hand-drawn-label now-section-kicker">{labels.kicker}</p>
            <div className="now-section-title-row">
              <h2 id="now-section-title" className="now-section-title">
                {labels.title}
              </h2>
            </div>
          </div>
          <div className="now-empty-state" role={loadState === 'error' ? 'alert' : 'status'}>
            {message}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`now-section ${expandedCard ? 'has-expanded-modal' : ''}`}
      aria-labelledby="now-section-title"
    >



      <p className="hand-drawn-label now-section-kicker">{labels.kicker}</p>

      <div className="now-section-title-row">
        <h2 id="now-section-title" className="now-section-title">
          {labels.title}
        </h2>

        <div className="now-carousel-controls" aria-label={labels.controlsLabel}>
          <button
            type="button"
            className="now-arrow-button"
            onClick={() => scrollByDirection('prev')}
            disabled={!canScrollPrev || Boolean(expandedCard)}
            aria-label={labels.previous}
          >
            &larr;
          </button>
          <button
            type="button"
            className="now-arrow-button"
            onClick={() => scrollByDirection('next')}
            disabled={!canScrollNext || Boolean(expandedCard)}
            aria-label={labels.next}
          >
            &rarr;
          </button>
        </div>

      </div>

      <div
        ref={carouselRef}
        className={`now-carousel ${isDragging ? 'is-dragging' : ''} ${expandedCard ? 'has-expanded-card' : ''}`}
        aria-label={labels.carouselLabel}
        tabIndex={expandedCard ? -1 : 0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={finishPointerDrag}
        onLostPointerCapture={finishPointerDrag}
        onClickCapture={handleClickCapture}
      >
        {localizedNowEntries.map((entry) => {
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

      <div className="now-carousel-progress" aria-label={labels.progressLabel}>
        {localizedNowEntries.map((entry, index) => (
          <button
            key={entry.id}
            type="button"
            className={`now-progress-dot ${index === activeIndex ? 'is-active' : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={labels.jumpTo({ index: index + 1, title: entry.title })}
            aria-pressed={index === activeIndex}
            disabled={Boolean(expandedCard)}
          />
        ))}
      </div>


      {expandedCard && expandedEntry && (
        <>
          <button
            type="button"
            className={`now-expanded-backdrop is-${expandedCard.phase}`}
            aria-label={labels.close}
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
