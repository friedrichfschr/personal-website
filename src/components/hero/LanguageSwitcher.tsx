import { useTranslation } from "react-i18next";
import { uiLanguages, type UiLanguage } from "../../constants/ui";

type LanguageSwitcherProps = {
  currentLanguage: string;
  onChange: (language: UiLanguage) => void;
};

export function LanguageSwitcher({ currentLanguage, onChange }: LanguageSwitcherProps) {
  const { t } = useTranslation();

  return (
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
              onClick={() => onChange(language)}
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
  );
}
