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
    <div className="social-links-block" aria-label="Open for opportunities or exchanging ideas. Contact me here:">
      <p className="social-links-label">Open for opportunities or exchanging ideas. Contact me here:</p>
      <div className="social-links-grid">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            target="_blank"
            href={href}
            rel="noreferrer"
            aria-label={label}
            className="hand-drawn-icon-button"
          >
            <Icon size={21} strokeWidth={1.8} />
          </a>
        ))}
      </div>
    </div>
  );
}
