export const nowEntries = [
  {
    id: 'mock-piano-room',
    date: '2026-06-15',
    accent: '#bd8b35',
    imageStyle: 'default',
    content: {
      default: {
        title: 'Building a Night Piano Room',
        blocks: [
          {
            type: 'paragraph',
            spans: [
              { text: 'A small test post for shaping the new blog section around the 3D piano scene.', italic: true },
            ],
          },
          {
            type: 'paragraph',
            spans: [
              { text: 'The current homepage experiments with a playable Three.js piano, a warm desk lamp, a plant, sheet music, and a subtle song player. The goal is to make the interface feel like a quiet musical workspace rather than a loud portfolio page.' },
            ],
          },
        ],
        expandable: {
          summary: 'Read more',
          blocks: [
            {
              type: 'paragraph',
              spans: [
                { text: 'This mock post exists only as local fallback data. Once the API is reachable from the browser, live posts can replace it automatically.' },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: 'mock-song-sync',
    date: '2026-06-10',
    accent: '#d7d893',
    imageStyle: 'default',
    content: {
      default: {
        title: 'Syncing Audio and MIDI',
        blocks: [
          {
            type: 'paragraph',
            spans: [
              { text: 'The best-feeling piano playback separates high-quality audio from animation timing.' },
            ],
          },
          {
            type: 'unordered-list',
            items: [
              [{ text: 'MP3 or OGG handles the actual sound.' }],
              [{ text: 'MIDI drives the visual key presses.' }],
              [{ text: 'The audio clock keeps everything aligned.' }],
            ],
          },
        ],
        expandable: {
          summary: 'Read more',
          blocks: [
            {
              type: 'paragraph',
              spans: [
                { text: 'This keeps the musical quality high while still making the 3D scene respond with convincing motion.' },
              ],
            },
          ],
        },
      },
    },
  },
  {
    id: 'mock-exchange-year',
    date: '2025-06-13',
    accent: '#93a8d8',
    imageStyle: 'default',
    content: {
      default: {
        title: 'Notes From an Exchange Year',
        blocks: [
          {
            type: 'paragraph',
            spans: [
              { text: 'A placeholder entry for testing longer personal writing inside the copied carousel layout.' },
            ],
          },
          {
            type: 'paragraph',
            spans: [
              { text: 'The card should scroll, expand, close with Escape, and keep the same interaction behavior as the original Personal Website blog section.' },
            ],
          },
        ],
      },
    },
  },
];

export const mapNowEntriesForLocale = (entries) => (
  entries
    .map((entry) => {
      const localizedContent =
        entry.content?.en ??
        entry.content?.default ??
        Object.values(entry.content ?? {}).find(Boolean);

      if (!localizedContent) {
        return null;
      }

      return {
        id: entry.id,
        date: entry.date,
        accent: entry.accent,
        imageStyle: entry.imageStyle ?? 'default',
        ...localizedContent,
      };
    })
    .filter(Boolean)
);

export const getNowEntriesForLocale = () => mapNowEntriesForLocale(nowEntries);
