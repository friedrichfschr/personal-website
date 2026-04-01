import { Button } from "@heroui/react";
import type { MouseEvent as ReactMouseEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SocialLinks } from "./SocialLinks";
import type { UiLanguage } from "../../constants/ui";

const BIRTH_DATE = {
  year: 2009,
  monthIndex: 1,
  day: 3,
} as const;

function getCurrentAge() {
  const today = new Date();
  let age = today.getFullYear() - BIRTH_DATE.year;
  const hasHadBirthdayThisYear =
    today.getMonth() > BIRTH_DATE.monthIndex ||
    (today.getMonth() === BIRTH_DATE.monthIndex && today.getDate() >= BIRTH_DATE.day);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

type HeroSectionProps = {
  currentLanguage: string;
  showCVOptions: boolean;
  cvTriggerRef: RefObject<HTMLButtonElement | null>;
  onChangeLanguage: (language: UiLanguage) => void;
  onCVHover: () => void;
  onCVLeave: (event: ReactMouseEvent<HTMLElement>) => void;
  onCVClick: () => void;
};

export function HeroSection({
  currentLanguage,
  showCVOptions,
  cvTriggerRef,
  onChangeLanguage,
  onCVHover,
  onCVLeave,
  onCVClick,
}: HeroSectionProps) {
  const { t } = useTranslation();
  const age = getCurrentAge();

  return (
    <section className="intro-section">
      <div className="top-toolbar">
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          onChange={onChangeLanguage}
        />
      </div>

      <div className="hero-shell">
        <div className="hero-copy-block">
          <h1 className="hand-drawn-title hero-title">{t("hero.title")}</h1>
          <p className="hand-drawn-subtitle hero-subtitle">{t("hero.subtitle")}</p>
        </div>

        <div className="hero-spotlight-card hand-drawn-card">
          <div className="hero-profile-row">
            <div className="hero-portrait-stack">
              <span className="hero-orbit hero-orbit-one" aria-hidden="true"></span>
              <span className="hero-orbit hero-orbit-two" aria-hidden="true"></span>
              <div className="hero-portrait-frame">
                <img
                  draggable={false}
                  style={{ userSelect: "none" }}
                  src="/Portrait.png"
                  alt={t("accessibility.portraitAlt")}
                  className="hand-drawn-portrait hero-portrait-image"
                />
              </div>
            </div>

            <div className="hero-profile-details">
              <p className="hero-profile-age">{t("hero.profile.ageValue", { age })}</p>

              <div className="hero-profile-interests">
                <p className="hero-profile-list-label">{t("hero.profile.interestsLabel")}:</p>
                <ul className="hero-profile-list" aria-label={t("hero.profile.interestsLabel")}>
                  <li>{t("hero.profile.interests.computerScience")}</li>
                  <li>{t("hero.profile.interests.music")}</li>
                  <li>{t("hero.profile.interests.traveling")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="hero-side-panel">
            <div className="social-links-block">
              <h3 className="hero-panel-label">{t("social.label")}</h3>
              <SocialLinks />
            </div>

            <div
              className="cv-dropdown-wrap"
              onMouseEnter={onCVHover}
              onMouseLeave={onCVLeave}
            >
              <Button
                ref={cvTriggerRef}
                className="hand-drawn-button cv-trigger-button"
                onPress={onCVClick}
                aria-haspopup="menu"
                aria-expanded={showCVOptions}
              >
                <span>{t("cv.button")}</span>
                <span
                  className={`cv-trigger-chevron ${showCVOptions ? "is-open" : ""}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
