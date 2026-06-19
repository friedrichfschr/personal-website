import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { formatNowDate } from '../../utils/language';
import { renderRichBlocks } from './richText';

const labels = {
  close: 'Close entry',
};

export function NowCard({
  entry,
  isExpanded = false,
  isHidden = false,
  isRestoring = false,
  expansionState = null,
  onExpand,
  onClose,
}) {
  const isRightImageEntry = ['rechts', 'highlight'].includes(entry.imageStyle);
  const isLeftWrapImageEntry = entry.imageStyle === 'inline-flow-left';
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);
  const metaRowRef = useRef(null);
  const metaLeadingRef = useRef(null);
  const staticBodyRef = useRef(null);
  const [isStaticBodyOverflowing, setIsStaticBodyOverflowing] = useState(false);
  const [isHeaderElevated, setIsHeaderElevated] = useState(false);
  const expandableBlocks = entry.expandable?.blocks ?? [];
  const hasExpandedContent = entry.blocks.length > 0 || expandableBlocks.length > 0;
  const visibleBlocks = isExpanded ? [...entry.blocks, ...expandableBlocks] : entry.blocks;
  const shouldShowReadMore = !isExpanded && hasExpandedContent && (
    isStaticBodyOverflowing || expandableBlocks.length > 0
  );
  const isExpandableCard = !isExpanded && hasExpandedContent;
  const previewBlocks = [...entry.blocks, ...expandableBlocks];
  const expandedStyle = useMemo(() => {
    if (!isExpanded || !expansionState) {
      return undefined;
    }

    return {
      '--now-source-top': `${expansionState.sourceRect.top}px`,
      '--now-source-left': `${expansionState.sourceRect.left}px`,
      '--now-source-width': `${expansionState.sourceRect.width}px`,
      '--now-source-height': `${expansionState.sourceRect.height}px`,
      '--now-source-title-width': expansionState.sourceTitleWidth
        ? `${expansionState.sourceTitleWidth}px`
        : undefined,
      '--now-target-top': `${expansionState.targetRect.top}px`,
      '--now-target-left': `${expansionState.targetRect.left}px`,
      '--now-target-width': `${expansionState.targetRect.width}px`,
      '--now-target-height': `${expansionState.targetRect.height}px`,
      '--now-source-transform': expansionState.sourceTransform,
    };
  }, [expansionState, isExpanded]);

  useEffect(() => {
    if (isExpanded && expansionState?.phase === 'open') {
      closeButtonRef.current?.focus();
    }
  }, [expansionState?.phase, isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      setIsHeaderElevated(false);
    }
  }, [isExpanded]);

  useLayoutEffect(() => {
    if (isExpanded && expansionState?.phase === 'closing' && cardRef.current) {
      cardRef.current.scrollTop = 0;
      setIsHeaderElevated(false);
    }
  }, [expansionState?.phase, isExpanded]);

  useLayoutEffect(() => {
    const row = metaRowRef.current;
    const leading = metaLeadingRef.current;
    if (!row || !leading) return undefined;

    const updateHeaderHeight = () => {
      const styles = window.getComputedStyle(row);
      const paddingHeight = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const trailingHeight = row.querySelector('.now-card-meta-trailing')?.scrollHeight ?? 0;
      const contentHeight = Math.max(leading.scrollHeight, trailingHeight);
      row.style.minHeight = `${Math.ceil(contentHeight + paddingHeight)}px`;
    };

    updateHeaderHeight();
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(leading);
    window.addEventListener('resize', updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
      row.style.removeProperty('min-height');
    };
  }, [entry.title, isExpanded]);

  useLayoutEffect(() => {
    if (isExpanded) {
      setIsStaticBodyOverflowing(false);
      return undefined;
    }

    const body = staticBodyRef.current;
    if (!body) {
      return undefined;
    }

    const updateOverflow = () => {
      const nextIsOverflowing = body.scrollHeight - body.clientHeight > 1;
      setIsStaticBodyOverflowing((current) => (
        current === nextIsOverflowing ? current : nextIsOverflowing
      ));
    };

    updateOverflow();

    const resizeObserver = new ResizeObserver(() => {
      updateOverflow();
    });

    resizeObserver.observe(body);
    Array.from(body.querySelectorAll('img')).forEach((image) => resizeObserver.observe(image));
    window.addEventListener('resize', updateOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOverflow);
    };
  }, [entry.blocks, entry.expandable, entry.image, isExpanded]);

  return (
    <article
      ref={cardRef}
      className={[
        'now-card',
        isExpandableCard ? 'is-selectable' : '',
        isExpanded ? 'is-expanded' : '',
        isRestoring ? 'is-restoring' : '',
        expansionState ? `is-${expansionState.phase}` : '',
        isHidden ? 'is-hidden-placeholder' : '',
      ].filter(Boolean).join(' ')}
      data-now-card
      style={{ '--now-accent': entry.accent, ...expandedStyle, paddingTop: '0rem' }}
      aria-expanded={isExpanded || undefined}
      aria-hidden={isHidden || undefined}
      onScroll={(event) => {
        if (!isExpanded) return;

        const nextIsHeaderElevated = event.currentTarget.scrollTop > 2;
        setIsHeaderElevated((current) => (
          current === nextIsHeaderElevated ? current : nextIsHeaderElevated
        ));
      }}
      onClick={(event) => {
        if (
          isExpanded ||
          !hasExpandedContent ||
          (event.target instanceof Element && event.target.closest('a, button'))
        ) {
          return;
        }

        if (cardRef.current) {
          onExpand?.(entry, cardRef.current);
        }
      }}
    >
      <div
        ref={metaRowRef}
        className={[
          'now-card-meta-row',
          isExpanded ? 'is-expanded-header' : '',
          isHeaderElevated ? 'is-elevated' : '',
        ].filter(Boolean).join(' ')}
        style={{ paddingTop: '0.65rem' }}
      >
        <div ref={metaLeadingRef} className="now-card-meta-leading">
          <span className="now-card-date">{formatNowDate(entry.date)}</span>
          <h3 className="now-card-title now-card-header-title">{entry.title}</h3>
        </div>
        <div className="now-card-meta-actions"></div>
        <div className="now-card-meta-trailing">
          {isExpanded ? (
            <button
              ref={closeButtonRef}
              type="button"
              className="now-card-close"
              aria-label={labels.close}
              onClick={onClose}
            >
              x
            </button>
          ) : (
            <span className="now-card-close-placeholder" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className={`now-card-content ${isExpanded ? 'is-expanded-content' : ''}`}>
        {entry.image && !isRightImageEntry && !isLeftWrapImageEntry && (
          <figure className="now-card-image-wrap">
            <img
              src={entry.image.src}
              alt={entry.image.alt}
              className="now-card-image"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {entry.image.caption && (
              <figcaption className="now-card-image-caption">
                {entry.image.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div
          ref={staticBodyRef}
          className={`now-card-body-viewport ${shouldShowReadMore ? 'has-overflow' : ''} ${isExpanded ? 'is-expanded' : ''} ${isRightImageEntry ? 'has-inline-right-image' : ''} ${isLeftWrapImageEntry ? 'has-inline-flow-image' : ''}`}
        >
          {entry.image && isLeftWrapImageEntry && (
            <figure className={`now-card-image-wrap is-inline-flow-image is-left-image ${isExpanded ? 'is-expanded-inline' : ''}`}>
              <img
                src={entry.image.src}
                alt={entry.image.alt}
                className="now-card-image is-inline-flow"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              {entry.image.caption && (
                <figcaption className="now-card-image-caption">
                  {entry.image.caption}
                </figcaption>
              )}
            </figure>
          )}
          {entry.image && isRightImageEntry && (
            <figure className="now-card-image-wrap is-right-image">
              <img
                src={entry.image.src}
                alt={entry.image.alt}
                className="now-card-image is-right-image"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              {entry.image.caption && (
                <figcaption className="now-card-image-caption">
                  {entry.image.caption}
                </figcaption>
              )}
            </figure>
          )}
          {isExpanded ? (
            renderRichBlocks(entry, 'now-card-body', visibleBlocks)
          ) : (
            renderRichBlocks(
              entry,
              'now-card-body now-card-collapsed-preview',
              previewBlocks,
            )
          )}
        </div>

      </div>
    </article>
  );
}
