export type SupportedNowLocale = "en" | "de" | "fr" | "zh";

export type NowRichTextSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  highlight?: boolean;
  code?: boolean;
  href?: string;
};

export type NowRichTextBlock =
  | {
    type: "paragraph" | "quote";
    spans: NowRichTextSpan[];
  }
  | {
    type: "heading";
    level?: 2 | 3 | 4;
    spans: NowRichTextSpan[];
  }
  | {
    type: "unordered-list" | "ordered-list";
    items: NowRichTextSpan[][];
  };

export type NowEntryContent = {
  title: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  blocks: NowRichTextBlock[];
  expandable?: {
    summary: string;
    blocks?: NowRichTextBlock[];
  };
};

export type NowEntryDefinition = {
  id: string;
  date: string;
  accent: string;
  imageStyle?: "default" | "highlight" | "inline-flow-left";
  content: Partial<Record<SupportedNowLocale | "default", NowEntryContent>>;
};

export type NowEntry = {
  id: string;
  date: string;
  accent: string;
  imageStyle: "default" | "highlight" | "inline-flow-left";
} & NowEntryContent;

export const nowEntries: NowEntryDefinition[] = [];

export const mapNowEntriesForLocale = (
  entries: NowEntryDefinition[],
  locale: SupportedNowLocale,
): NowEntry[] => (
  entries
    .map((entry) => {
      const localizedContent =
        entry.content[locale]
        ?? entry.content.default
        ?? entry.content.en
        ?? Object.values(entry.content).find(Boolean);

      if (!localizedContent) {
        return null;
      }

      return {
        id: entry.id,
        date: entry.date,
        accent: entry.accent,
        imageStyle: entry.imageStyle ?? "default",
        ...localizedContent,
      };
    })
    .filter(Boolean) as NowEntry[]
);

export const getNowEntriesForLocale = (locale: SupportedNowLocale): NowEntry[] => (
  mapNowEntriesForLocale(nowEntries, locale)
);
