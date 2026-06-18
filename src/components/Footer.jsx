export function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5 text-[0.84rem] leading-normal text-paper/45 max-md:flex-col max-md:items-start"
      aria-label="Footer"
    >
      <nav className="flex flex-wrap gap-[0.9rem]" aria-label="Legal links">
        <a
          className="text-paper/60 no-underline transition hover:text-paper focus-visible:text-paper"
          href="/privacy"
          onClick={onNavigate('/privacy')}
        >
          Privacy Policy
        </a>
        <a
          className="text-paper/60 no-underline transition hover:text-paper focus-visible:text-paper"
          href="/impressum"
          onClick={onNavigate('/impressum')}
        >
          Impressum
        </a>
      </nav>
      <p className="m-0 text-right max-md:text-left">© {currentYear} | Friedrich Fischer</p>
    </footer>
  );
}
