import { Link } from "@heroui/react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../icons";
import { siteConfig } from "../../../site";

type SocialLinkItem = {
  href: string;
  label: string;
  icon: JSX.Element;
};

const socialLinks: SocialLinkItem[] = [
  {
    href: siteConfig.links.instagram,
    label: "Instagram",
    icon: <InstagramIcon className="text-rose-600 dark:text-fuchsia-400 w-6 h-6" />,
  },
  {
    href: siteConfig.links.youtube,
    label: "Youtube",
    icon: <YoutubeIcon className="text-red-600 w-6 h-6" />,
  },
  {
    href: siteConfig.links.twitter,
    label: "Twitter",
    icon: <TwitterIcon className="dark:text-blue-500 text-blue-600 w-6 h-6" />,
  },
  {
    href: siteConfig.links.github,
    label: "GitHub",
    icon: <GithubIcon className="text-foreground w-6 h-6" />,
  },
  {
    href: siteConfig.links.linkedIn,
    label: "LinkedIn",
    icon: <LinkedInIcon className="text-blue-900 dark:text-blue-500 w-6 h-6" />,
  },
  {
    href: siteConfig.links.mail,
    label: "Mail",
    icon: <MailIcon className="text-foreground w-6 h-6" />,
  },
];

export function SocialLinks() {
  return (
    <div className="social-links-grid">
      {socialLinks.map((link) => (
        <Link
          key={link.label}
          target="_blank"
          href={link.href}
          aria-label={link.label}
          className="hand-drawn-icon-button"
        >
          {link.icon}
        </Link>
      ))}
    </div>
  );
}
