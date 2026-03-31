import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Button, Link } from "@heroui/react";
import { useTranslation } from "react-i18next";
import {
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./icons";
import { siteConfig } from "../site";
import { downloadCV, type CVLanguage } from "./utils/cvDownload";

const uiLanguages = ["en", "de", "fr"] as const;
type UiLanguage = (typeof uiLanguages)[number];

function App() {
  const { t, i18n } = useTranslation();
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cvDropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage =
    (i18n.resolvedLanguage?.split("-")[0] ?? i18n.language.split("-")[0]) ||
    "en";

  const handleCVDownload = (language: CVLanguage) => {
    downloadCV(language);
    setShowCVOptions(false);
  };

  const handleCVHover = () => {
    if (!isTouchDevice) {
      setShowCVOptions(true);
    }
  };

  const handleCVLeave = () => {
    if (!isTouchDevice) {
      setShowCVOptions(false);
    }
  };

  const handleCVClick = () => {
    if (isTouchDevice) {
      setShowCVOptions(!showCVOptions);
    }
  };

  const changeLanguage = (language: UiLanguage) => {
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const hasTouchCapability = () =>
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    setIsTouchDevice(hasTouchCapability());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cvDropdownRef.current &&
        !cvDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCVOptions(false);
      }
    };

    if (showCVOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCVOptions]);

  return (
    <div className="hand-drawn-bg min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="hand-drawn-container max-w-3xl w-full">
        <div className="top-toolbar">
          <div
            className="hand-drawn-language-switcher"
            role="group"
            aria-label={t("languageSwitcher.label")}
          >
            <div className="hand-drawn-language-options">
              {uiLanguages.map((language) => {
                const isActive = currentLanguage === language;

                return (
                  <button
                    key={language}
                    type="button"
                    className={`hand-drawn-language-pill ${isActive ? "is-active" : ""}`}
                    onClick={() => changeLanguage(language)}
                    aria-pressed={isActive}
                    aria-label={t(`languageSwitcher.aria.${language}`)}
                    title={t(`languageSwitcher.aria.${language}`)}
                  >
                    {t(`languageSwitcher.options.${language}`)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mb-10 sm:mb-12">
          <h1 className="hand-drawn-title text-6xl sm:text-7xl font-bold mb-2">
            {t("hero.title")}
          </h1>
          <p className="hand-drawn-subtitle text-lg sm:text-xl text-neutral-700 dark:text-neutral-300">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="hand-drawn-card flex flex-col sm:flex-row items-center gap-8 sm:gap-12 p-8 sm:p-10">
          <div className="w-48 h-48 sm:w-56 sm:h-56">
            <img
              draggable={false}
              style={{
                userSelect: "none",
              }}
              src="/Portrait.png"
              alt={t("accessibility.portraitAlt")}
              className="hand-drawn-portrait w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-3xl absolute"
            />
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div>
              <h3 className="hand-drawn-label text-sm font-semibold mb-4 text-neutral-600 dark:text-neutral-400">
                {t("social.label")}
              </h3>
              <div className="social-links-grid">
                <Link
                  target="_blank"
                  href={siteConfig.links.instagram}
                  aria-label="Instagram"
                  className="hand-drawn-icon-button"
                >
                  <InstagramIcon className="text-rose-600 dark:text-fuchsia-400 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.youtube}
                  aria-label="Youtube"
                  className="hand-drawn-icon-button"
                >
                  <YoutubeIcon className="text-red-600 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.twitter}
                  aria-label="Twitter"
                  className="hand-drawn-icon-button"
                >
                  <TwitterIcon className="dark:text-blue-500 text-blue-600 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.github}
                  aria-label="GitHub"
                  className="hand-drawn-icon-button"
                >
                  <GithubIcon className="text-foreground w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.linkedIn}
                  aria-label="LinkedIn"
                  className="hand-drawn-icon-button"
                >
                  <LinkedInIcon className="text-blue-900 dark:text-blue-500 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.mail}
                  aria-label="Mail"
                  className="hand-drawn-icon-button"
                >
                  <MailIcon className="text-foreground w-6 h-6" />
                </Link>
              </div>
            </div>

            <div
              className="relative"
              ref={cvDropdownRef}
              onMouseEnter={handleCVHover}
              onMouseLeave={handleCVLeave}
            >
              <Button
                className="hand-drawn-button w-full sm:w-auto"
                onPress={handleCVClick}
              >
                {t("cv.button")}
              </Button>

              {showCVOptions && (
                <div className="hand-drawn-dropdown-menu" aria-label={t("cv.label")}>
                  <div className="hand-drawn-dropdown-arrow"></div>
                  <span className="hand-drawn-dropdown-label">
                    {t("cv.availableLabel")}
                  </span>
                  <Button
                    size="sm"
                    className="hand-drawn-button-secondary"
                    onPress={() => handleCVDownload("en")}
                  >
                    {t("cv.languages.en")}
                  </Button>
                  <Button
                    size="sm"
                    className="hand-drawn-button-secondary"
                    onPress={() => handleCVDownload("de")}
                  >
                    {t("cv.languages.de")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
