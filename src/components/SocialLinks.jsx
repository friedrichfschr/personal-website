import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from 'lucide-react';

const socialLinks = [
  {
    href: 'https://www.instagram.com/friedrich.fschr',
    label: 'Instagram',
    icon: Instagram,
  },
  {
    href: 'https://www.youtube.com/@FAF',
    label: 'Youtube',
    icon: Youtube,
  },
  {
    href: 'https://twitter.com/friedrichfschr',
    label: 'Twitter',
    icon: Twitter,
  },
  {
    href: 'https://github.com/friedrichfschr',
    label: 'GitHub',
    icon: Github,
  },
  {
    href: 'https://www.linkedin.com/in/friedrich-fischer-a51b2a333',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'mailto:friedrich.riesel@outlook.de',
    label: 'Mail',
    icon: Mail,
  },
];

export function SocialLinks() {
  return (
    <div className="w-fit max-w-full" aria-label="Open for opportunities or exchanging ideas. Contact me here:">
      <p className="mb-3 mt-0 max-w-[18rem] text-[0.78rem] leading-[1.45] text-paper/50 max-md:max-w-[9.7rem]">
        Open for opportunities or exchanging ideas. Contact me here:
      </p>
      <div className="grid w-fit max-w-full grid-cols-[repeat(6,max-content)] gap-[0.55rem] max-md:grid-cols-[repeat(3,max-content)]">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            target="_blank"
            href={href}
            rel="noreferrer"
            aria-label={label}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.04] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.035))] text-paper/75 shadow-[0_14px_44px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[18px] transition hover:-translate-y-[3px] hover:rotate-2 hover:border-[#bd8b35]/50 hover:bg-[#bd8b35]/10 hover:text-paper hover:shadow-[0_18px_54px_rgba(0,0,0,0.24),0_0_0_1px_rgba(189,139,53,0.08),inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <Icon size={21} strokeWidth={1.8} />
          </a>
        ))}
      </div>
    </div>
  );
}
