export type SupportedNowLocale = "en" | "de" | "fr" | "zh";

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
  sourceLanguage: SupportedNowLocale;
  content: Record<SupportedNowLocale, NowEntryContent>;
};

export type NowEntry = {
  id: string;
  date: string;
  accent: string;
  sourceLanguage: SupportedNowLocale;
  isTranslated: boolean;
} & NowEntryContent;

const sharedOpenClawImage = {
  src: "/assets/now/openclaw-bot.jpg",
};

export const nowEntries: NowEntryDefinition[] = [
  {
    id: "openclaw",
    date: "31.03.2026",
    accent: "#e74c3c",
    sourceLanguage: "en",
    content: {
      en: {
        title: "OpenClaw",
        image: {
          ...sharedOpenClawImage,
          alt: "Red OpenClaw mascot illustration",
          caption: "OpenClaw",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "A few weeks ago, I setup OpenClaw. Honestly, I'm impressed." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "After configuring safe access to my calendar and email as well as notes and reminders, I had found myself with my own personal secretary at the hand of a telegram message." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "I had now remote lazy access to my computer from everywhere in the world." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Understandably, the AI hype evokes a lot of skepticism, however, seeing the potential of this, I don't believe this is a bubble." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "The groundbreaking thing with this is the ease of setting it up. You can let the robot configure itself." }],
          },
        ],
        expandable: {
          summary: "",
        },
      },
      de: {
        title: "OpenClaw",
        image: {
          ...sharedOpenClawImage,
          alt: "Rote OpenClaw-Maskottchen-Illustration",
          caption: "OpenClaw",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Vor ein paar Wochen habe ich OpenClaw eingerichtet. Ehrlich gesagt: Ich bin beeindruckt." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Nachdem ich den sicheren Zugriff auf Kalender, E-Mails, Notizen und Erinnerungen eingerichtet hatte, hatte ich plötzlich meinen eigenen persönlichen Sekretär per Telegram-Nachricht zur Hand." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Ich hatte damit von überall auf der Welt einen angenehm faulen Fernzugriff auf meinen Computer." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Klar, der KI-Hype ruft viel Skepsis hervor. Aber wenn man das Potenzial davon sieht, glaube ich nicht, dass das nur eine Blase ist." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Das wirklich Bahnbrechende daran ist, wie einfach sich das Ganze einrichten lässt. Man kann den Roboter sich praktisch selbst konfigurieren lassen." }],
          },
        ],
        expandable: {
          summary: "",
        },
      },
      fr: {
        title: "OpenClaw",
        image: {
          ...sharedOpenClawImage,
          alt: "Illustration rouge de la mascotte OpenClaw",
          caption: "OpenClaw",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Il y a quelques semaines, j’ai installé OpenClaw. Honnêtement, je suis impressionné." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Après avoir configuré un accès sécurisé à mon calendrier, à mes e-mails, ainsi qu’à mes notes et rappels, je me suis retrouvé avec mon propre secrétaire personnel au bout d’un message Telegram." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "J’avais désormais un accès distant, tranquillement paresseux, à mon ordinateur depuis n’importe où dans le monde." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "On comprend que l’engouement autour de l’IA suscite beaucoup de scepticisme. Mais en voyant son potentiel, je ne crois pas que ce soit une bulle." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Ce qui est vraiment marquant ici, c’est la facilité de mise en place. On peut laisser le robot se configurer presque tout seul." }],
          },
        ],
        expandable: {
          summary: "",
        },
      },
      zh: {
        title: "OpenClaw",
        image: {
          ...sharedOpenClawImage,
          alt: "红色 OpenClaw 吉祥物插画",
          caption: "OpenClaw",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "几周前，我把 OpenClaw 配好了。老实说，我挺惊艳的。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "把日历、邮件、笔记和提醒事项的安全访问都配置好之后，我等于通过一条 Telegram 消息就拥有了一个私人秘书。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "现在无论我人在世界哪里，都能很懒但很舒服地远程访问自己的电脑。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "可以理解，AI 热潮会让很多人保持怀疑。不过看到这种潜力之后，我不觉得这只是泡沫。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "真正有突破性的地方在于它搭起来非常容易。你甚至可以让这个机器人自己把自己配置好。" }],
          },
        ],
        expandable: {
          summary: "",
        },
      },
    },
  },
  {
    id: "studio-note",
    date: "29.03.2026",
    accent: "#2c3e50",
    sourceLanguage: "en",
    content: {
      en: {
        title: "Website rebuild",
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "I want the site to feel personal without looking sloppy. Hand-drawn energy, but still deliberate." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "The challenge is restraint: just enough motion, just enough texture, and no fake polish." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "It should be easy to feed from notes instead of turning every update into a design project." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "If the section feels too curated, it stops feeling alive. If it feels too messy, it stops feeling intentional. That balance is the whole point." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "That probably means keeping the content model brutally simple: title, date, optional image, rich text, done." }],
            },
            {
              type: "paragraph",
              spans: [{ text: "If adding a new card feels annoying, the section will die. If it feels like pasting a note and tightening a few lines, it will stay alive." }],
            },
          ],
        },
      },
      de: {
        title: "Website-Neubau",
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Die Seite soll persönlich wirken, ohne schlampig auszusehen. Handgemachte Energie, aber trotzdem bewusst gestaltet." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Die eigentliche Herausforderung ist Zurückhaltung: gerade genug Bewegung, gerade genug Textur und kein künstlicher Hochglanz." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Neue Einträge sollten sich leicht aus Notizen füttern lassen, statt jedes Update in ein kleines Designprojekt zu verwandeln." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Wenn der Bereich zu kuratiert wirkt, fühlt er sich nicht mehr lebendig an. Wenn er zu chaotisch wirkt, verliert er seine Absicht. Genau diese Balance ist der Punkt." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "Das heißt wahrscheinlich: Das Content-Modell brutal einfach halten — Titel, Datum, optionales Bild, Rich Text, fertig." }],
            },
            {
              type: "paragraph",
              spans: [{ text: "Wenn sich eine neue Karte nervig anfühlt, stirbt die Sektion. Wenn es sich wie Notiz einfügen und ein paar Zeilen schärfen anfühlt, bleibt sie lebendig." }],
            },
          ],
        },
      },
      fr: {
        title: "Refonte du site",
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Je veux que le site paraisse personnel sans avoir l’air brouillon. Une énergie dessinée à la main, mais avec une vraie intention." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Le vrai défi, c’est la retenue : juste assez de mouvement, juste assez de texture, et aucun faux vernis." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Il faut pouvoir l’alimenter facilement à partir de notes, sans transformer chaque mise à jour en projet de design." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Si la section paraît trop curée, elle cesse de sembler vivante. Si elle paraît trop désordonnée, elle cesse de sembler intentionnelle. Tout est dans cet équilibre." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "Cela veut probablement dire garder le modèle de contenu brutalement simple : titre, date, image facultative, texte riche, terminé." }],
            },
            {
              type: "paragraph",
              spans: [{ text: "Si ajouter une nouvelle carte devient agaçant, la section mourra. Si cela ressemble à coller une note puis resserrer quelques lignes, elle restera vivante." }],
            },
          ],
        },
      },
      zh: {
        title: "网站重做",
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "我希望这个网站有个人味，但又不要显得潦草。要有手绘感，但依然是经过推敲的。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "真正的挑战是克制：刚刚好的动效，刚刚好的质感，不要那种假精致。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "更新内容应该能直接从笔记里喂进去，而不是每次都变成一个设计项目。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "如果这个栏目显得过于精修，它就不再鲜活；如果太乱，又会失去刻意为之的感觉。这种平衡才是重点。" }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "这大概意味着内容模型要尽可能简单：标题、日期、可选图片、富文本，结束。" }],
            },
            {
              type: "paragraph",
              spans: [{ text: "如果新增一张卡片让人觉得麻烦，这个栏目迟早会死掉。要是感觉像贴一段笔记再顺手收紧几句，它就会一直活着。" }],
            },
          ],
        },
      },
    },
  },
  {
    id: "language-fragment",
    date: "27.03.2026",
    accent: "#8b5cf6",
    sourceLanguage: "de",
    content: {
      en: {
        title: "Language fragment",
        blocks: [
          {
            type: "quote",
            spans: [{ text: "Sometimes a short sentence says more about a week than a full summary.", italic: true }],
          },
          {
            type: "paragraph",
            spans: [{ text: "I like keeping room for fragments too — not everything needs to become a polished essay before it earns a place here." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "The useful test is whether it still feels true a few days later." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "I want the section to have room for these smaller notes too, because they often carry more mood than the bigger updates." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "That is why I want these cards to expand naturally. Short on the surface, but with enough room underneath when a thought actually deserves it." }],
            },
          ],
        },
      },
      de: {
        title: "Sprachfragment",
        blocks: [
          {
            type: "quote",
            spans: [{ text: "Manchmal sagt ein kurzer Satz mehr über eine Woche als eine ganze Zusammenfassung.", italic: true }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Ich mag es, auch Fragmenten Raum zu geben — nicht alles muss erst zu einem ausgearbeiteten Essay werden, bevor es hier seinen Platz verdient." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Der nützliche Test ist, ob es sich ein paar Tage später immer noch wahr anfühlt." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Ich will, dass dieser Bereich auch Platz für solche kleineren Notizen hat, weil sie oft mehr Stimmung tragen als die großen Updates." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "Genau deshalb sollen sich diese Karten natürlich erweitern lassen. Kurz an der Oberfläche, aber mit genug Raum darunter, wenn ein Gedanke ihn wirklich verdient." }],
            },
          ],
        },
      },
      fr: {
        title: "Fragment de langue",
        blocks: [
          {
            type: "quote",
            spans: [{ text: "Parfois, une courte phrase en dit plus sur une semaine qu’un résumé complet.", italic: true }],
          },
          {
            type: "paragraph",
            spans: [{ text: "J’aime aussi laisser de la place aux fragments — tout n’a pas besoin de devenir un essai poli avant de mériter sa place ici." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Le vrai test utile, c’est de voir si cela sonne encore juste quelques jours plus tard." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Je veux que cette section garde aussi de la place pour ces petites notes, parce qu’elles portent souvent plus d’atmosphère que les grandes mises à jour." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "C’est pour cela que je veux que ces cartes puissent s’ouvrir naturellement. Courtes en surface, mais avec assez d’espace dessous quand une idée le mérite vraiment." }],
            },
          ],
        },
      },
      zh: {
        title: "语言碎片",
        blocks: [
          {
            type: "quote",
            spans: [{ text: "有时候，一个短句比一整段总结更能说明这一周。", italic: true }],
          },
          {
            type: "paragraph",
            spans: [{ text: "我也想给这种碎片留一点空间——不是每个想法都得先变成一篇打磨好的文章，才配放在这里。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "一个有用的判断标准是：几天之后，它听起来是不是依然真实。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "我希望这个栏目也能容纳这些更小的笔记，因为它们往往比那些大更新更有情绪和味道。" }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [{ text: "所以我想让这些卡片能自然展开。表面上很短，但当一个想法真的值得时，下面要有足够的空间接住它。" }],
            },
          ],
        },
      },
    },
  },
];

export const getNowEntriesForLocale = (locale: SupportedNowLocale): NowEntry[] => (
  nowEntries.map((entry) => {
    const localizedContent = entry.content[locale] ?? entry.content[entry.sourceLanguage];

    return {
      id: entry.id,
      date: entry.date,
      accent: entry.accent,
      sourceLanguage: entry.sourceLanguage,
      isTranslated: locale !== entry.sourceLanguage,
      ...localizedContent,
    };
  })
);
