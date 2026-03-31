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
        button: "Get my CV",
        label: "Choose a version",
        availableLabel: "Available in",
        languages: {
          en: "English",
          de: "Deutsch",
        },
      },
      languageSwitcher: {
        label: "Language",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
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
        label: "Vernetze dich mit mir",
      },
      cv: {
        button: "Meinen Lebenslauf holen",
        label: "Version auswählen",
        availableLabel: "Verfügbar in",
        languages: {
          en: "Englisch",
          de: "Deutsch",
        },
      },
      languageSwitcher: {
        label: "Sprache",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
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
        button: "Télécharger mon CV",
        label: "Choisir une version",
        availableLabel: "Disponible en",
        languages: {
          en: "Anglais",
          de: "Allemand",
        },
      },
      languageSwitcher: {
        label: "Langue",
        options: {
          en: "EN",
          de: "DE",
          fr: "FR",
        },
      },
      accessibility: {
        portraitAlt: "Portrait de Friedrich Fischer",
      },
    },
  },
};

const storageKey = "preferred-language";
const supportedLanguages = ["en", "de", "fr"];

const detectLanguage = () => {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(storageKey);
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language?.split("-")[0];
  if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
    return browserLanguage;
  }

  return "en";
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
