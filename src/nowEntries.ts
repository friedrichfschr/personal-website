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
    blocks?: NowRichTextBlock[];
  };
};

export const nowEntries: NowEntry[] = [
  {
    id: "openclaw",
    title: "OpenClaw",
    date: "31.03.2026",
    accent: "#e74c3c",
    image: {
      src: "/assets/now/openclaw-bot.jpg",
      alt: "Red OpenClaw mascot illustration",
      caption: "OpenClaw",
    },
    blocks: [
      {
        type: "paragraph",
        spans: [
          {
            text: "A few weeks ago, I setup OpenClaw. Honestly, I'm impressed.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "After configuring safe access to my calendar and email as well as notes and reminders, I had found myself with my own personal secretary at the hand of a telegram message.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "I had now remote lazy access to my computer from everywhere in the world.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "Understandably, the AI hype evokes a lot of skepticism, however, seeing the potential of this, I don't believe this is a bubble.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The groundbreaking thing with this is the ease of setting it up. You can let the robot configure itself.",
          },
        ],
      },
    ],
    expandable: {
      summary: "",
    },
  },
  {
    id: "studio-note",
    title: "Website rebuild",
    date: "29.03.2026",
    originalLanguage: "EN",
    accent: "#2c3e50",
    blocks: [
      {
        type: "paragraph",
        spans: [
          {
            text: "I want the site to feel personal without looking sloppy. Hand-drawn energy, but still deliberate.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The challenge is restraint: just enough motion, just enough texture, and no fake polish.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "It should be easy to feed from notes instead of turning every update into a design project.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "If the section feels too curated, it stops feeling alive. If it feels too messy, it stops feeling intentional. That balance is the whole point.",
          },
        ],
      },
    ],
    expandable: {
      summary: "",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "That probably means keeping the content model brutally simple: title, date, optional image, rich text, done.",
            },
          ],
        },
        {
          type: "paragraph",
          spans: [
            {
              text: "If adding a new card feels annoying, the section will die. If it feels like pasting a note and tightening a few lines, it will stay alive.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "language-fragment",
    title: "Language fragment",
    date: "27.03.2026",
    originalLanguage: "DE",
    accent: "#8b5cf6",
    blocks: [
      {
        type: "quote",
        spans: [
          {
            text: "Sometimes a short sentence says more about a week than a full summary.",
            italic: true,
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "I like keeping room for fragments too — not everything needs to become a polished essay before it earns a place here.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "The useful test is whether it still feels true a few days later.",
          },
        ],
      },
      {
        type: "paragraph",
        spans: [
          {
            text: "I want the section to have room for these smaller notes too, because they often carry more mood than the bigger updates.",
          },
        ],
      },
    ],
    expandable: {
      summary: "",
      blocks: [
        {
          type: "paragraph",
          spans: [
            {
              text: "That is why I want these cards to expand naturally. Short on the surface, but with enough room underneath when a thought actually deserves it.",
            },
          ],
        },
      ],
    },
  },
];
