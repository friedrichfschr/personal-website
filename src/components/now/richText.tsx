import type { CSSProperties } from "react";
import type { NowEntry, NowRichTextSpan } from "../../nowEntries";

const spanToStyle = (span: NowRichTextSpan): CSSProperties => ({
  fontWeight: span.bold ? 700 : undefined,
  fontStyle: span.italic ? "italic" : undefined,
  textDecoration: [
    span.underline ? "underline" : "",
    span.strikethrough ? "line-through" : "",
  ].filter(Boolean).join(" ") || undefined,
  background: span.highlight
    ? "rgba(255, 232, 164, 0.7)"
    : span.code
      ? "rgba(44, 62, 80, 0.08)"
      : undefined,
  borderRadius: span.highlight || span.code ? "0.25em" : undefined,
  padding: span.highlight ? "0 0.16em" : span.code ? "0.08em 0.28em" : undefined,
  fontFamily: span.code ? "ui-monospace, SFMono-Regular, Menlo, monospace" : undefined,
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
    {blocks.map((block, blockIndex) => {
      const key = `${entry.id}-${className}-${blockIndex}`;

      if (block.type === "unordered-list" || block.type === "ordered-list") {
        const ListTag = block.type === "ordered-list" ? "ol" : "ul";
        return (
          <ListTag key={key} className="now-card-list">
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-${itemIndex}`}>
                {item.map(renderRichSpan)}
              </li>
            ))}
          </ListTag>
        );
      }

      if (block.type === "heading") {
        const HeadingTag = `h${Math.min(Math.max(block.level ?? 2, 2), 4)}` as "h2" | "h3" | "h4";
        return (
          <HeadingTag key={key} className="now-card-markdown-heading">
            {block.spans.map(renderRichSpan)}
          </HeadingTag>
        );
      }

      return (
        <p
          key={key}
          className={`now-card-text ${block.type === "quote" ? "is-quote" : ""}`}
        >
          {block.spans.map(renderRichSpan)}
        </p>
      );
    })}
  </div>
);
