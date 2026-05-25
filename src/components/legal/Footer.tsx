import type { MouseEvent } from "react";

type FooterProps = {
  onNavigate: (path: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Footer">
      <nav className="site-footer-links" aria-label="Legal links">
        <a href="/privacy" onClick={onNavigate("/privacy")}>Privacy Policy</a>
        <a href="/impressum" onClick={onNavigate("/impressum")}>Impressum</a>
      </nav>
      <p className="site-footer-credit">© {currentYear} | Friedrich Fischer</p>
    </footer>
  );
}
