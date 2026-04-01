import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useTranslation } from "react-i18next";
import type { NowEntry } from "../../nowEntries";
import { getResolvedUiLanguage, formatNowDate } from "../../utils/language";
import type { ExpandedCardState } from "./types";
import { renderRichBlocks } from "./richText";

export function NowCard({
  entry,
  isExpanded = false,
  isHidden = false,
  isRestoring = false,
  expansionState = null,
  onExpand,
  onClose,
}: {
  entry: NowEntry;
  isExpanded?: boolean;
  isHidden?: boolean;
  isRestoring?: boolean;
  expansionState?: ExpandedCardState | null;
  onExpand?: (entry: NowEntry, card: HTMLElement) => void;
  onClose?: () => void;
}) {
  const isHighlightEntry = entry.id === "openclaw";
  const isLeftWrapImageEntry = entry.id === "cbyx-ppp";
  const { t, i18n } = useTranslation();
  const currentLocale = getResolvedUiLanguage(i18n.language, i18n.resolvedLanguage);
  const cardRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const staticBodyRef = useRef<HTMLDivElement | null>(null);
  const [isStaticBodyOverflowing, setIsStaticBodyOverflowing] = useState(false);
  const expandableBlocks = entry.expandable?.blocks ?? [];
  const hasExpandedContent = entry.blocks.length > 0 || expandableBlocks.length > 0;
  const visibleBlocks = isExpanded ? [...entry.blocks, ...expandableBlocks] : entry.blocks;
  const shouldShowReadMore = !isExpanded && isStaticBodyOverflowing && hasExpandedContent;
  const isExpandableCard = !isExpanded && hasExpandedContent;

  const expandedStyle = useMemo(() => {
    if (!isExpanded || !expansionState) {
      return undefined;
    }

    return {
      "--now-source-top": `${expansionState.sourceRect.top}px`,
      "--now-source-left": `${expansionState.sourceRect.left}px`,
      "--now-source-width": `${expansionState.sourceRect.width}px`,
      "--now-source-height": `${expansionState.sourceRect.height}px`,
      "--now-target-top": `${expansionState.targetRect.top}px`,
      "--now-target-left": `${expansionState.targetRect.left}px`,
      "--now-target-width": `${expansionState.targetRect.width}px`,
      "--now-target-height": `${expansionState.targetRect.height}px`,
      "--now-source-transform": expansionState.sourceTransform,
    } as CSSProperties;
  }, [expansionState, isExpanded]);

  useEffect(() => {
    if (isExpanded && expansionState?.phase === "open") {
      closeButtonRef.current?.focus();
    }
  }, [expansionState?.phase, isExpanded]);

  useLayoutEffect(() => {
    if (isExpanded) {
      setIsStaticBodyOverflowing(false);
      return;
    }

    const body = staticBodyRef.current;
    if (!body) {
      return;
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
    Array.from(body.querySelectorAll("img")).forEach((image) => resizeObserver.observe(image));
    window.addEventListener("resize", updateOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [entry.blocks, entry.image, isExpanded]);

  return (
    <article
      ref={cardRef}
      className={[
        "now-card",
        isExpandableCard ? "is-selectable" : "",
        isExpanded ? "is-expanded" : "",
        isRestoring ? "is-restoring" : "",
        expansionState ? `is-${expansionState.phase}` : "",
        isHidden ? "is-hidden-placeholder" : "",
      ].filter(Boolean).join(" ")}
      data-now-card
      style={{ "--now-accent": entry.accent, ...expandedStyle, paddingTop: "0rem" } as CSSProperties}
      aria-expanded={isExpanded || undefined}
      aria-hidden={isHidden || undefined}
      onClick={(event) => {
        if (
          isExpanded ||
          !hasExpandedContent ||
          (event.target instanceof Element && event.target.closest("a, button"))
        ) {
          return;
        }

        if (cardRef.current) {
          onExpand?.(entry, cardRef.current);
        }
      }}
    >
      <div className={`now-card-meta-row  ${isExpanded ? "is-expanded-header" : ""} `} style={{ paddingTop: "1rem" }}>
        <div className="now-card-meta-leading">
          <span className="now-card-date">{formatNowDate(entry.date, currentLocale)}</span>
        </div>
        <div className="now-card-meta-actions">
          {entry.isTranslated && (
            <span
              className="now-card-language-pill is-translation-pill"
              aria-label={t("now.automaticTranslation")}
              title={t("now.automaticTranslation")}
            >
              {t("now.automaticTranslation")}
            </span>
          )}
        </div>
        <div className="now-card-meta-trailing">
          {isExpanded ? (
            <button
              ref={closeButtonRef}
              type="button"
              className="now-card-close"
              aria-label={t("now.close")}
              onClick={onClose}
            >
              ×
            </button>
          ) : (
            <span className="now-card-close-placeholder" aria-hidden="true" />
          )}
        </div>
      </div>

      <div className={`now-card-content ${isExpanded ? "is-expanded-content" : ""}`}>
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
          className={`now-card-body-viewport ${shouldShowReadMore ? "has-overflow" : ""} ${isExpanded ? "is-expanded" : ""} ${isHighlightEntry ? "has-inline-highlight" : ""} ${isLeftWrapImageEntry ? "has-inline-flow-image" : ""}`}
        >
          {entry.image && isLeftWrapImageEntry && (
            <figure className={`now-card-image-wrap is-inline-flow-image is-left-inline-highlight ${isExpanded ? "is-expanded-inline" : ""}`}>
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
          {renderRichBlocks(entry, "now-card-body", visibleBlocks)}
        </div>

        {shouldShowReadMore && (
          <div className="now-card-actions">
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
      </div>
    </article>
  );
}
