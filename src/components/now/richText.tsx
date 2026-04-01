import type { CSSProperties } from "react";
import type { NowEntry, NowRichTextSpan } from "../../nowEntries";

const spanToStyle = (span: NowRichTextSpan): CSSProperties => ({
  fontWeight: span.bold ? 700 : undefined,
  fontStyle: span.italic ? "italic" : undefined,
  textDecoration: span.underline ? "underline" : undefined,
});

export const renderRichSpan = (span: NowRichTextSpan, index: number) => {
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

export const renderRichBlocks = (
  entry: NowEntry,
  className = "now-card-body",
  blocks = entry.blocks,
) => (
  <div className={className}>
    {blocks.map((block, blockIndex) => (
      <p
        key={`${entry.id}-${className}-${blockIndex}`}
        className={`now-card-text ${block.type === "quote" ? "is-quote" : ""}`}
      >
        {block.spans.map(renderRichSpan)}
      </p>
    ))}
  </div>
);
