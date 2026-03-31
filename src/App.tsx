import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
import { nowEntries, type NowEntry, type NowRichTextSpan } from "./nowEntries";

const uiLanguages = ["en", "de", "fr", "zh"] as const;
type UiLanguage = (typeof uiLanguages)[number];

const spanToStyle = (span: NowRichTextSpan) => ({
  fontWeight: span.bold ? 700 : undefined,
  fontStyle: span.italic ? "italic" : undefined,
  textDecoration: span.underline ? "underline" : undefined,
});

const renderRichSpan = (span: NowRichTextSpan, index: number) => {
  const style = spanToStyle(span);

  if (span.href) {
    return (
      <a
        key={`${span.text}-${index}`}
        href={span.href}
        target={span.href.startsWith("http") ? "_blank" : undefined}
        rel={span.href.startsWith("http") ? "noreferrer" : undefined}
        className="now-card-link"
        style={style}
      >
        {span.text}
      </a>
    );
  }

  return (
    <span key={`${span.text}-${index}`} style={style}>
      {span.text}
    </span>
  );
};

function NowSection() {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(nowEntries.length > 1);

  const totalCards = nowEntries.length;

  const getCardElements = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return [] as HTMLElement[];
    }

    return Array.from(carousel.querySelectorAll<HTMLElement>("[data-now-card]"));
  };

  const syncCarouselState = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const cards = getCardElements();
    const maxScrollLeft = Math.max(carousel.scrollWidth - carousel.clientWidth, 0);
    const currentScrollLeft = Math.min(Math.max(carousel.scrollLeft, 0), maxScrollLeft);
    const viewportCenter = currentScrollLeft + carousel.clientWidth / 2;

    const nearestIndex = cards.reduce((closestIndex, card, index) => {
      const closestCard = cards[closestIndex];
      const currentCardCenter = card.offsetLeft + card.clientWidth / 2;
      const closestCardCenter = closestCard.offsetLeft + closestCard.clientWidth / 2;
      const currentDistance = Math.abs(currentCardCenter - viewportCenter);
      const closestDistance = Math.abs(closestCardCenter - viewportCenter);

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nearestIndex);
    setCanScrollPrev(currentScrollLeft > 8 && nearestIndex > 0);
    setCanScrollNext(currentScrollLeft < maxScrollLeft - 8 && nearestIndex < totalCards - 1);
  }, [totalCards]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    syncCarouselState();
    carousel.addEventListener("scroll", syncCarouselState, { passive: true });
    window.addEventListener("resize", syncCarouselState);

    return () => {
      carousel.removeEventListener("scroll", syncCarouselState);
      window.removeEventListener("resize", syncCarouselState);
    };
  }, [syncCarouselState]);

  const scrollToIndex = (index: number) => {
    const carousel = carouselRef.current;
    const cards = getCardElements();
    const nextCard = cards[index];

    if (!carousel || !nextCard) {
      return;
    }

    const inlineStartPadding = Number.parseFloat(
      window.getComputedStyle(carousel).paddingInlineStart,
    ) || 0;

    carousel.scrollTo({
      left: Math.max(nextCard.offsetLeft - inlineStartPadding, 0),
      behavior: "smooth",
    });
  };

  const scrollByDirection = (direction: "prev" | "next") => {
    const nextIndex = direction === "next"
      ? Math.min(activeIndex + 1, totalCards - 1)
      : Math.max(activeIndex - 1, 0);

    scrollToIndex(nextIndex);
  };

  return (
    <section className="now-section" aria-labelledby="now-section-title">
      <div className="now-section-shell">
        <div className="now-section-header">
          <div>
            <p className="hand-drawn-label now-section-kicker">{t("now.kicker")}</p>
            <h2 id="now-section-title" className="now-section-title">
              {t("now.title")}
            </h2>
            <p className="now-section-copy">{t("now.description")}</p>
          </div>

          <div className="now-carousel-controls" aria-label={t("now.controlsLabel")}>
            <button
              type="button"
              className="now-arrow-button"
              onClick={() => scrollByDirection("prev")}
              disabled={!canScrollPrev}
              aria-label={t("now.previous")}
            >
              ←
            </button>
            <button
              type="button"
              className="now-arrow-button"
              onClick={() => scrollByDirection("next")}
              disabled={!canScrollNext}
              aria-label={t("now.next")}
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="now-carousel"
          aria-label={t("now.carouselLabel")}
          tabIndex={0}
        >
          {nowEntries.map((entry: NowEntry) => (
            <article
              key={entry.id}
              className="now-card"
              data-now-card
              style={{ "--now-accent": entry.accent } as CSSProperties}
            >
              <div className="now-card-meta-row">
                <span className="now-card-date">{entry.date}</span>
                {entry.originalLanguage && (
                  <span
                    className="now-card-language-pill"
                    aria-label={`${t("now.originalLanguage")}: ${entry.originalLanguage}`}
                    title={`${t("now.originalLanguage")}: ${entry.originalLanguage}`}
                  >
                    {entry.originalLanguage}
                  </span>
                )}
              </div>

              <h3 className="now-card-title">{entry.title}</h3>

              {entry.image && (
                <figure className="now-card-image-wrap">
                  <img
                    src={entry.image.src}
                    alt={entry.image.alt}
                    className="now-card-image"
                    draggable={false}
                  />
                  {entry.image.caption && (
                    <figcaption className="now-card-image-caption">
                      {entry.image.caption}
                    </figcaption>
                  )}
                </figure>
              )}

              <div className="now-card-body">
                {entry.blocks.map((block, blockIndex) => (
                  <p
                    key={`${entry.id}-${blockIndex}`}
                    className={`now-card-text ${block.type === "quote" ? "is-quote" : ""}`}
                  >
                    {block.spans.map(renderRichSpan)}
                  </p>
                ))}
              </div>

              {entry.expandable && (
                <div className="now-card-footer">
                  <span className="now-card-footnote">{entry.expandable.summary}</span>
                  <button
                    type="button"
                    className="now-expand-button"
                    aria-disabled="true"
                    disabled
                  >
                    {t("now.readMore")}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="now-carousel-progress" aria-hidden="true">
          {nowEntries.map((entry, index) => (
            <span
              key={entry.id}
              className={`now-progress-dot ${index === activeIndex ? "is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <div className="hand-drawn-bg page-shell min-h-screen p-4 sm:p-8">
      <div className="hand-drawn-container page-stack max-w-5xl w-full mx-auto">
        <section className="intro-section">
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

          <div className="hero-block text-center mb-10 sm:mb-12">
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
                className="cv-dropdown-wrap relative"
                ref={cvDropdownRef}
                onMouseEnter={handleCVHover}
                onMouseLeave={handleCVLeave}
              >
                <Button
                  className="hand-drawn-button cv-trigger-button"
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
        </section>

        <NowSection />
      </div>
    </div>
  );
}

export default App;
