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
