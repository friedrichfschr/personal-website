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

const sharedPppImage = {
  src: "/assets/now/ppp-stipendium.png",
};

export const nowEntries: NowEntryDefinition[] = [
  {
    id: "openclaw",
    date: "2026-03-31",
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
            spans: [{ text: "A few weeks ago, I set up OpenClaw. Honestly, I’m impressed." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "After configuring safe access to my calendar, email, notes, and reminders, I suddenly had my own personal secretary one Telegram message away." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Now I have remote, pleasantly lazy access to my computer from anywhere in the world." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Understandably, the AI hype evokes a lot of skepticism. But seeing the potential of this, I don’t believe it’s just a bubble." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "The groundbreaking thing here is how easy it is to set up. You can practically let the robot configure itself." }],
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
            spans: [{ text: "Damit habe ich von überall auf der Welt einen angenehm faulen Fernzugriff auf meinen Computer." }],
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
            spans: [{ text: "J’ai désormais un accès distant, confortablement paresseux, à mon ordinateur depuis n’importe où dans le monde." }],
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
    id: "cbyx-ppp",
    date: "2025-06-13",
    accent: "#2563eb",
    sourceLanguage: "en",
    content: {
      en: {
        title: "CBYX Program",
        image: {
          ...sharedPppImage,
          alt: "CBYX scholarship logo",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Today, a chapter of my life closed. After spending ten months in the United States as part of the CBYX Program, I returned to Germany." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "This program has shaped my life more than anything else so far. From experiencing American high school and confronting stereotypes to visiting the United Nations General Assembly and speaking with politicians on Capitol Hill, the year was full of moments that stayed with me." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "I’m deeply grateful for the opportunities and for the people I met along the way. I’ll carry this year with me for a long time." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "It’s still hard to describe what those ten months really felt like. But I know they changed me, and I’d encourage anyone who feels the pull to apply." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [
                { text: "For German students interested in studying in the U.S.: " },
                { text: "PPP scholarship page", href: "https://www.bundestag.de/europa_internationales/ppp", underline: true },
              ],
            },
            {
              type: "paragraph",
              spans: [
                { text: "For U.S. students interested in spending a year in Germany: " },
                { text: "CBYX scholarship page", href: "https://usagermanyscholarship.org", underline: true },
              ],
            },
          ],
        },
      },
      de: {
        title: "PPP-Stipendium",
        image: {
          ...sharedPppImage,
          alt: "Logo des PPP-Stipendiums",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Heute ist ein Kapitel meines Lebens zu Ende gegangen. Nach zehn Monaten in den USA im Rahmen des PPP-Stipendiums bin ich nach Deutschland zurückgekehrt." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Dieses Programm hat mein Leben bisher stärker geprägt als alles andere. Von amerikanischer Highschool-Erfahrung und dem Abbau von Stereotypen bis hin zum Besuch der Generalversammlung der Vereinten Nationen und Gesprächen mit Politikerinnen und Politikern auf dem Capitol Hill war dieses Jahr voller prägender Momente." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Ich bin sehr dankbar für die Möglichkeiten, die ich bekommen habe, und für die Menschen, die ich unterwegs kennenlernen durfte. Dieses Jahr werde ich noch lange im Herzen tragen." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Es ist immer noch schwer, wirklich zu beschreiben, wie sich diese zehn Monate angefühlt haben. Aber ich weiß, dass sie mich verändert haben, und ich würde jedem raten, sich zu bewerben, wenn es ihn oder sie dahin zieht." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [
                { text: "Für deutsche Schülerinnen und Schüler, die in den USA lernen möchten: " },
                { text: "zur PPP-Seite", href: "https://www.bundestag.de/europa_internationales/ppp", underline: true },
              ],
            },
            {
              type: "paragraph",
              spans: [
                { text: "Für US-amerikanische Schülerinnen und Schüler, die ein Jahr in Deutschland verbringen möchten: " },
                { text: "zur CBYX-Seite", href: "https://usagermanyscholarship.org", underline: true },
              ],
            },
          ],
        },
      },
      fr: {
        title: "Programme CBYX",
        image: {
          ...sharedPppImage,
          alt: "Logo du programme CBYX",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "Aujourd’hui, un chapitre de ma vie s’est refermé. Après dix mois passés aux États-Unis dans le cadre du programme CBYX, je suis rentré en Allemagne." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Ce programme a eu jusqu’ici plus d’impact sur ma vie que tout le reste. Entre l’expérience du lycée américain, la confrontation aux stéréotypes, la visite de l’Assemblée générale des Nations unies et les échanges avec des responsables politiques à Capitol Hill, cette année a été pleine de moments marquants." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Je suis profondément reconnaissant pour les opportunités reçues et pour les personnes que j’ai rencontrées en chemin. Je garderai cette année en moi pendant longtemps." }],
          },
          {
            type: "paragraph",
            spans: [{ text: "Il m’est encore difficile de décrire ce que ces dix mois ont réellement représenté. Mais je sais qu’ils m’ont transformé, et j’encouragerais toute personne qui sent cet appel à postuler." }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [
                { text: "Pour les élèves allemands intéressés par des études aux États-Unis : " },
                { text: "page de la bourse PPP", href: "https://www.bundestag.de/europa_internationales/ppp", underline: true },
              ],
            },
            {
              type: "paragraph",
              spans: [
                { text: "Pour les élèves américains souhaitant passer une année en Allemagne : " },
                { text: "page de la bourse CBYX", href: "https://usagermanyscholarship.org", underline: true },
              ],
            },
          ],
        },
      },
      zh: {
        title: "CBYX 交流项目",
        image: {
          ...sharedPppImage,
          alt: "CBYX 项目标志",
        },
        blocks: [
          {
            type: "paragraph",
            spans: [{ text: "今天，我人生中的一个篇章结束了。在作为 CBYX 项目成员于美国度过十个月后，我回到了德国。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "到目前为止，这个项目对我的人生影响比任何别的经历都更大。从亲身体验美国高中生活、直面各种刻板印象，到参观联合国大会、在国会山与政治人物交流，这一年里发生了太多难忘的事情。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "我非常感激自己得到的机会，也感激一路上遇见的人。我会把这一年一直放在心里。" }],
          },
          {
            type: "paragraph",
            spans: [{ text: "直到现在，我依然很难准确描述这十个月到底意味着什么。但我知道，它改变了我；如果你也被这样的经历吸引，我真的会鼓励你去申请。" }],
          },
        ],
        expandable: {
          summary: "",
          blocks: [
            {
              type: "paragraph",
              spans: [
                { text: "面向想去美国学习的德国学生：" },
                { text: "bundestag.de/europa_internationales/ppp", href: "https://www.bundestag.de/europa_internationales/ppp" },
              ],
            },
            {
              type: "paragraph",
              spans: [
                { text: "面向想在德国度过一学年的美国学生：" },
                { text: "usagermanyscholarship.org", href: "https://usagermanyscholarship.org" },
              ],
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
