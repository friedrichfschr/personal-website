import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      hero: {
        title: "Friedrich Fischer",
        subtitle: "Ambitious, Curious & Communicative",
      },
      social: {
        label: "Connect with me",
      },
      cv: {
        button: "My CV",
        label: "Choose a version",
        availableLabel: "Available in",
        languages: {
          en: "English",
          de: "Deutsch",
        },
      },
      now: {
        kicker: "Now",
        title: "What currently has Friedrich’s attention",
        description:
          "A swipeable stream of recent thoughts, projects and in-progress notes — designed so fresh entries can be dropped in without rebuilding the page.",
        controlsLabel: "Now carousel controls",
        carouselLabel: "Now page entries",
        progressLabel: "Now carousel navigation",
        previous: "Show previous entry",
        next: "Show next entry",
        jumpTo: "Jump to entry {{index}}: {{title}}",
        originalLanguage: "Original",
        readMore: "Read more",
        close: "Close entry",
        modalKicker: "Expanded note",
      },
      languageSwitcher: {
        label: "Language selector",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
          zh: "ZH",
        },
        aria: {
          en: "Switch language to English",
          de: "Switch language to German",
          fr: "Switch language to French",
          zh: "Switch language to Mandarin Chinese",
        },
      },
      accessibility: {
        portraitAlt: "Portrait of Friedrich Fischer",
      },
    },
  },
  de: {
    translation: {
      hero: {
        title: "Friedrich Fischer",
        subtitle: "Ehrgeizig, neugierig & kommunikativ",
      },
      social: {
        label: "Kontakt",
      },
      cv: {
        button: "Mein Lebenslauf",
        label: "Version auswählen",
        availableLabel: "Verfügbar in",
        languages: {
          en: "Englisch",
          de: "Deutsch",
        },
      },
      now: {
        kicker: "Now",
        title: "Woran Friedrich gerade arbeitet und denkt",
        description:
          "Ein horizontaler Strom aus aktuellen Gedanken, Projekten und Notizen — so aufgebaut, dass neue Einträge schnell ergänzt werden können.",
        controlsLabel: "Steuerung für das Now-Karussell",
        carouselLabel: "Now-Einträge",
        progressLabel: "Navigation des Now-Karussells",
        previous: "Vorherigen Eintrag anzeigen",
        next: "Nächsten Eintrag anzeigen",
        jumpTo: "Zu Eintrag {{index}} springen: {{title}}",
        originalLanguage: "Originalsprache",
        readMore: "Mehr lesen",
        close: "Eintrag schließen",
        modalKicker: "Erweiterte Notiz",
      },
      languageSwitcher: {
        label: "Sprachauswahl",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
          zh: "ZH",
        },
        aria: {
          en: "Sprache auf Englisch umstellen",
          de: "Sprache auf Deutsch umstellen",
          fr: "Sprache auf Französisch umstellen",
          zh: "Sprache auf Mandarin-Chinesisch umstellen",
        },
      },
      accessibility: {
        portraitAlt: "Porträt von Friedrich Fischer",
      },
    },
  },
  fr: {
    translation: {
      hero: {
        title: "Friedrich Fischer",
        subtitle: "Ambitieux, curieux & communicatif",
      },
      social: {
        label: "Retrouve-moi ici",
      },
      cv: {
        button: "Mon CV",
        label: "Choisir une version",
        availableLabel: "Disponible en",
        languages: {
          en: "Anglais",
          de: "Allemand",
        },
      },
      now: {
        kicker: "Now",
        title: "Ce qui occupe Friedrich en ce moment",
        description:
          "Un flux horizontal d’idées récentes, de projets et de notes en cours — pensé pour accueillir facilement de nouvelles entrées.",
        controlsLabel: "Contrôles du carrousel Now",
        carouselLabel: "Entrées de la page Now",
        progressLabel: "Navigation du carrousel Now",
        previous: "Afficher l’entrée précédente",
        next: "Afficher l’entrée suivante",
        jumpTo: "Aller à l’entrée {{index}} : {{title}}",
        originalLanguage: "Langue d’origine",
        readMore: "Lire la suite",
        close: "Fermer l’entrée",
        modalKicker: "Note développée",
      },
      languageSwitcher: {
        label: "Sélecteur de langue",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
          zh: "ZH",
        },
        aria: {
          en: "Passer la langue en anglais",
          de: "Passer la langue en allemand",
          fr: "Passer la langue en français",
          zh: "Passer la langue en chinois mandarin",
        },
      },
      accessibility: {
        portraitAlt: "Portrait de Friedrich Fischer",
      },
    },
  },
  zh: {
    translation: {
      hero: {
        title: "Friedrich Fischer",
        subtitle: "有抱负、好奇且善于沟通",
      },
      social: {
        label: "联系我",
      },
      cv: {
        button: "我的简历",
        label: "选择版本",
        availableLabel: "可选语言",
        languages: {
          en: "英语",
          de: "德语",
        },
      },
      now: {
        kicker: "Now",
        title: "Friedrich 最近在关注什么",
        description:
          "一个可横向滑动的近况流，放最近的想法、项目和进行中的笔记，也方便之后继续补充新内容。",
        controlsLabel: "Now 轮播控制",
        carouselLabel: "Now 页面条目",
        progressLabel: "Now 轮播导航",
        previous: "显示上一条",
        next: "显示下一条",
        jumpTo: "跳转到第 {{index}} 条：{{title}}",
        originalLanguage: "原文语言",
        readMore: "阅读更多",
        close: "关闭条目",
        modalKicker: "展开笔记",
      },
      languageSwitcher: {
        label: "语言选择器",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
          zh: "ZH",
        },
        aria: {
          en: "切换语言为英语",
          de: "切换语言为德语",
          fr: "切换语言为法语",
          zh: "切换语言为普通话中文",
        },
      },
      accessibility: {
        portraitAlt: "Friedrich Fischer 的肖像",
      },
    },
  },
};

const storageKey = "preferred-language";
const supportedLanguages = ["en", "de", "fr", "zh"];

const normalizeLanguage = (language) => language?.split("-")[0];

const detectLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = normalizeLanguage(
    window.localStorage.getItem(storageKey),
  );
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguages = [
    ...(window.navigator.languages ?? []),
    window.navigator.language,
  ]
    .map(normalizeLanguage)
    .filter(Boolean);

  const preferredLanguage = browserLanguages.find((language) =>
    supportedLanguages.includes(language),
  );

  return preferredLanguage ?? "en";
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, language);
    document.documentElement.lang = language;
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;
