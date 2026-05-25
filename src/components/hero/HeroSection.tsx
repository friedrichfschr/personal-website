import { Button } from "@heroui/react";
import type { MouseEvent as ReactMouseEvent, ReactNode, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { SocialLinks } from "./SocialLinks";

type HeroSectionProps = {
  showCVOptions: boolean;
  cvTriggerRef: RefObject<HTMLButtonElement | null>;
  onCVHover: () => void;
  onCVLeave: (event: ReactMouseEvent<HTMLElement>) => void;
  onCVClick: () => void;
  cvDropdownContent?: ReactNode;
};

export function HeroSection({
  showCVOptions,
  cvTriggerRef,
  onCVHover,
  onCVLeave,
  onCVClick,
  cvDropdownContent,
}: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="intro-section">
      <div className="hero-shell">
        <div className="hero-copy-block">
          <h1 className="hand-drawn-title hero-title">{t("hero.title")}</h1>
          <p className="hand-drawn-subtitle hero-subtitle">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="hero-spotlight-card">
          <div className="hero-profile-row">
            <div className="hero-portrait-stack">
              <span
                className="hero-orbit hero-orbit-one"
                aria-hidden="true"
              ></span>
              <span
                className="hero-orbit hero-orbit-two"
                aria-hidden="true"
              ></span>
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
              <p className="hero-profile-bio">
                {t("hero.profile.bioStart")}
                <span className="hero-defined-term">
                  <span className="hero-defined-term-word">
                    {t("hero.profile.philomath")}
                  </span>
                  <button
                    type="button"
                    className="hero-term-info"
                    aria-label={t("hero.profile.philomathAria")}
                  >
                    i
                    <span className="hero-term-tooltip" role="tooltip">
                      {t("hero.profile.philomathDefinition")}
                    </span>
                  </button>
                </span>
                {t("hero.profile.bioEnd")}
              </p>
            </div>
          </div>

          <div className="hero-side-panel">
            <div className="hero-contact-block">
              <h3 className="hero-panel-label">{t("social.label")}</h3>
            </div>

            <div className="hero-contact-actions">
              <div className="social-links-block">
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
                  <span className="cv-trigger-label">{t("cv.button")}</span>
                  <span
                    className={`cv-trigger-chevron ${showCVOptions ? "is-open" : ""}`}
                    aria-hidden="true"
                  >
                    v
                  </span>
                </Button>
                {cvDropdownContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
