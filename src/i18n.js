import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      hero: {
        title: "Friedrich Fischer",
        subtitle: "Ambitious, Curious & Communicative",
        profile: {
          bio: "I'm Friedrich Fischer, a 17-year-old globally minded philomath from Germany enthusiastic about computers, learning languages, and discovering the world.",
          bioStart: "I'm Friedrich Fischer, a 17-year-old globally minded ",
          philomath: "philomath",
          philomathAria: "Definition of philomath",
          philomathDefinition:
            "A lover of learning; a person who enjoys acquiring knowledge.",
          bioEnd:
            " from Germany enthusiastic about computers, learning languages, and discovering the world.",
        },
      },
      social: {
        label: "Open for Opportunities or exchanging ideas. Contact me here:",
      },
      cv: {
        button: "Get CV",
        label: "Choose a version",
        availableLabel: "Available in",
        languages: {
          en: "English",
          de: "Deutsch",
        },
        request: {
          emailLabel: "Get my CV sent to your Email",
          emailPlaceholder: "your.email@example.com",
          submit: "Request",
          sending: "Sending",
          codeLabel: "I have a Code",
          codeInputLabel: "CV code",
          codePlaceholder: "Enter CV code",
          unlock: "Unlock",
          checking: "Checking",
        },
      },
      now: {
        kicker: "Now",
        title: "What I'm up to right now",
        description: "",
        controlsLabel: "Now carousel controls",
        carouselLabel: "Now page entries",
        progressLabel: "Now carousel navigation",
        previous: "Show previous entry",
        next: "Show next entry",
        jumpTo: "Jump to entry {{index}}: {{title}}",
        automaticTranslation: "Auto-translated",
        readMore: "Read more",
        close: "Close entry",
        modalKicker: "Expanded note",
      },
      accessibility: {
        portraitAlt: "Portrait of Friedrich Fischer",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== "undefined") {
  document.documentElement.lang = "en";
}

export default i18n;
