import type { MouseEvent } from "react";
import type { UiLanguage } from "../../constants/ui";

type FooterProps = {
  locale: UiLanguage;
  onNavigate: (path: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
};

const footerLabels: Record<UiLanguage, { privacy: string; impressum: string; aria: string }> = {
  en: { privacy: "Privacy Policy", impressum: "Impressum", aria: "Legal links" },
  de: { privacy: "Datenschutz", impressum: "Impressum", aria: "Rechtliche Links" },
  fr: { privacy: "Confidentialite", impressum: "Mentions legales", aria: "Liens juridiques" },
  zh: { privacy: "隐私政策", impressum: "法律声明", aria: "法律链接" },
};

export function Footer({ locale, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const labels = footerLabels[locale] ?? footerLabels.en;

  return (
    <footer className="site-footer" aria-label="Footer">
      <nav className="site-footer-links" aria-label={labels.aria}>
        <a href="/privacy" onClick={onNavigate("/privacy")}>{labels.privacy}</a>
        <a href="/impressum" onClick={onNavigate("/impressum")}>{labels.impressum}</a>
      </nav>
      <p className="site-footer-credit">© {currentYear} | Friedrich Fischer</p>
    </footer>
  );
}
