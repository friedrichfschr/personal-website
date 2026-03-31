export type NowRichTextSpan = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  href?: string;
};

export type NowRichTextBlock = {
  type: "paragraph" | "quote";
  spans: NowRichTextSpan[];
};

export type NowEntry = {
  id: string;
  title: string;
  date: string;
  originalLanguage?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
  accent: string;
  blocks: NowRichTextBlock[];
  expandable?: {
    summary: string;
  };
};

export const nowEntries: NowEntry[] = [
  {
    id: "placeholder-studio-note",
    title: "Placeholder: studio note / current focus",
    date: "31 Mar 2026",
    originalLanguage: "EN",
    accent: "#2c3e50",
    image: {
      src: "/sun.png",
      alt: "A small sketched sun icon",
      caption: "optional visual accent",
    },
    blocks: [
      {
        type: "paragraph",
        spans: [
          { text: "Use this card for a short snapshot of what Friedrich is building, exploring or refining right now. Keep it personal, specific and not too polished. " },
          { text: "Bold details", bold: true },
          { text: ", " },
          { text: "soft emphasis", italic: true },
          { text: ", and " },
          { text: "underlined highlights", underline: true },
          { text: " already work here." },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "The layout is meant for quick copy-paste from notes first, then light cleanup later." },
        ],
      },
    ],
    expandable: {
      summary: "Reserved for future modal expansion or a longer journal-style continuation.",
    },
  },
  {
    id: "placeholder-language-note",
    title: "Placeholder: language, travel or thought fragment",
    date: "28 Mar 2026",
    originalLanguage: "DE",
    accent: "#8b5cf6",
    blocks: [
      {
        type: "quote",
        spans: [
          { text: "Insert one original-language sentence here to set the mood of the entry.", italic: true },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "This version is good for a quote, an observation, a translation note or a small cultural detail that says something about Friedrich’s perspective." },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "Links can be embedded inline too — for example " },
          { text: "send an email", href: "mailto:friedrich.riesel@outlook.de", underline: true },
          { text: " or point to a project later." },
        ],
      },
    ],
    expandable: {
      summary: "Structured so this can later open into translations, notes or extra media.",
    },
  },
  {
    id: "placeholder-garden-note",
    title: "Placeholder: project fragment / digital garden entry",
    date: "24 Mar 2026",
    originalLanguage: "FR",
    accent: "#e67e22",
    blocks: [
      {
        type: "paragraph",
        spans: [
          { text: "Use the final card for something looser: a project fragment, a mood, a reading note, a half-formed idea, or a tiny update with more atmosphere than explanation." },
        ],
      },
      {
        type: "paragraph",
        spans: [
          { text: "The important part is that the content model stays simple: title, date, optional image, original-language marker, and rich text with just the formatting you actually need." },
        ],
      },
      {
        type: "paragraph",
        spans: [{ text: "That keeps the section easy to feed from Joplin or anywhere else." }],
      },
    ],
    expandable: {
      summary: "Ready for a future ‘read more’ interaction without changing the card schema.",
    },
  },
];
