import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { formatNowDate } from '../../utils/language';
import { renderRichBlocks } from './richText';

const labels = {
  close: 'Close entry',
};

const blockToPlainText = (block) => {
  if (block.type === 'unordered-list' || block.type === 'ordered-list') {
    return block.items
      .map((item) => item.map((span) => span.text).join(''))
      .join(' ');
  }

  return block.spans?.map((span) => span.text).join('') ?? '';
};

const normalizePreviewText = (text) => text.replace(/\s+/g, ' ').trim();

export function NowCard({
  entry,
  isExpanded = false,
  isHidden = false,
  isRestoring = false,
  expansionState = null,
  onExpand,
  onClose,
}) {
  const isHighlightEntry = entry.imageStyle === 'highlight';
  const isLeftWrapImageEntry = entry.imageStyle === 'inline-flow-left';
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);
  const staticBodyRef = useRef(null);
  const collapsedPreviewRef = useRef(null);
  const [isStaticBodyOverflowing, setIsStaticBodyOverflowing] = useState(false);
  const [collapsedPreviewText, setCollapsedPreviewText] = useState('');
  const expandableBlocks = entry.expandable?.blocks ?? [];
  const hasExpandedContent = entry.blocks.length > 0 || expandableBlocks.length > 0;
  const visibleBlocks = isExpanded ? [...entry.blocks, ...expandableBlocks] : entry.blocks;
  const shouldShowReadMore = !isExpanded && hasExpandedContent && (
    isStaticBodyOverflowing || expandableBlocks.length > 0
  );
  const isExpandableCard = !isExpanded && hasExpandedContent;
  const collapsedFullText = useMemo(
    () => normalizePreviewText([...entry.blocks, ...expandableBlocks].map(blockToPlainText).join(' ')),
    [entry.blocks, expandableBlocks],
  );

  const expandedStyle = useMemo(() => {
    if (!isExpanded || !expansionState) {
      return undefined;
    }

    return {
      '--now-source-top': `${expansionState.sourceRect.top}px`,
      '--now-source-left': `${expansionState.sourceRect.left}px`,
      '--now-source-width': `${expansionState.sourceRect.width}px`,
      '--now-source-height': `${expansionState.sourceRect.height}px`,
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

  useLayoutEffect(() => {
    if (isExpanded) {
      setIsStaticBodyOverflowing(false);
      setCollapsedPreviewText('');
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
  }, [entry.blocks, entry.image, isExpanded]);

  useLayoutEffect(() => {
    if (isExpanded) {
      return undefined;
    }

    const viewport = staticBodyRef.current;
    const preview = collapsedPreviewRef.current;

    if (!viewport || !preview || !collapsedFullText) {
      setCollapsedPreviewText(collapsedFullText);
      return undefined;
    }

    const ellipsis = '...';

    const updatePreview = () => {
      preview.textContent = collapsedFullText;

      if (preview.scrollHeight <= viewport.clientHeight + 1) {
        setCollapsedPreviewText(collapsedFullText);
        return;
      }

      let low = 0;
      let high = collapsedFullText.length;
      let best = '';

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const candidate = `${collapsedFullText.slice(0, mid).trimEnd()}${ellipsis}`;
        preview.textContent = candidate;

        if (preview.scrollHeight <= viewport.clientHeight + 1) {
          best = candidate;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      setCollapsedPreviewText(best || ellipsis);
    };

    updatePreview();

    const resizeObserver = new ResizeObserver(updatePreview);
    resizeObserver.observe(viewport);
    resizeObserver.observe(preview);
    window.addEventListener('resize', updatePreview);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePreview);
    };
  }, [collapsedFullText, entry.image, isExpanded]);

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
      <div className={`now-card-meta-row ${isExpanded ? 'is-expanded-header' : ''}`} style={{ paddingTop: '1rem' }}>
        <div className="now-card-meta-leading">
          <span className="now-card-date">{formatNowDate(entry.date)}</span>
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
        <h3 className="now-card-title">{entry.title}</h3>

        {entry.image && !isHighlightEntry && !isLeftWrapImageEntry && (
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

        <div
          ref={staticBodyRef}
          className={`now-card-body-viewport ${shouldShowReadMore ? 'has-overflow' : ''} ${isExpanded ? 'is-expanded' : ''} ${isHighlightEntry ? 'has-inline-highlight' : ''} ${isLeftWrapImageEntry ? 'has-inline-flow-image' : ''}`}
        >
          {entry.image && isLeftWrapImageEntry && (
            <figure className={`now-card-image-wrap is-inline-flow-image is-left-inline-highlight ${isExpanded ? 'is-expanded-inline' : ''}`}>
              <img
                src={entry.image.src}
                alt={entry.image.alt}
                className="now-card-image is-inline-flow"
                draggable={false}
              />
              {entry.image.caption && (
                <figcaption className="now-card-image-caption">
                  {entry.image.caption}
                </figcaption>
              )}
            </figure>
          )}
          {entry.image && isHighlightEntry && (
            <figure className="now-card-image-wrap is-highlight is-inline-highlight">
              <img
                src={entry.image.src}
                alt={entry.image.alt}
                className="now-card-image is-highlight"
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
            <p ref={collapsedPreviewRef} className="now-card-collapsed-preview">
              {collapsedPreviewText || collapsedFullText}
            </p>
          )}
        </div>

      </div>
    </article>
  );
}
