export function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="flex items-center justify-between gap-4 border-t border-[#bd8b35]/20 pt-5 font-[var(--display-font)] text-[0.82rem] uppercase leading-normal tracking-[0.07em] text-paper/45 max-md:flex-col max-md:items-start"
      aria-label="Footer"
    >
      <nav className="flex flex-wrap gap-[0.9rem]" aria-label="Legal links">
        <a
          className="text-[#dfc99f]/60 no-underline transition hover:text-paper focus-visible:text-paper"
          href="/privacy"
          onClick={onNavigate('/privacy')}
        >
          Privacy Policy
        </a>
        <a
          className="text-[#dfc99f]/60 no-underline transition hover:text-paper focus-visible:text-paper"
          href="/impressum"
          onClick={onNavigate('/impressum')}
        >
          Impressum
        </a>
      </nav>
      <p className="m-0 text-right max-md:text-left">&copy; {currentYear} | Friedrich Fischer</p>
    </footer>
  );
}
