export function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Footer">
      <nav className="site-footer-links" aria-label="Legal links">
        <a href="/privacy" onClick={onNavigate('/privacy')}>
          Privacy Policy
        </a>
        <a href="/impressum" onClick={onNavigate('/impressum')}>
          Impressum
        </a>
      </nav>
      <p className="site-footer-credit">Copyright {currentYear} | Friedrich Fischer</p>
    </footer>
  );
}
