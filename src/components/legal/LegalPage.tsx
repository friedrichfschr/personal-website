import type { MouseEvent } from "react";

type LegalPageProps = {
  page: "privacy" | "impressum";
  onNavigate: (path: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
};

type LegalSection = {
  title: string;
  paragraphs: string[];
};

const email = "friedrich.riesel@outlook.de";

const privacySections: LegalSection[] = [
  {
    title: "Controller",
    paragraphs: ["Friedrich Fischer", `Email: ${email}`],
  },
  {
    title: "Data processed",
    paragraphs: [
      "When this website is visited, technically necessary access data may be processed, such as IP address, date and time of access, browser type, operating system and the requested page.",
      "The website retrieves blog posts through the API at api.friedrich-fischer.de.",
      "If you use a CV access code, the code is checked by the API. When a CV PDF is downloaded, the download may be logged with the CV code used, selected CV language, document identifier, IP address, browser or user-agent, referrer URL, date and time.",
      "If you request CV access by email, the email address entered in the form is stored together with technical request metadata such as IP address, browser or user-agent, referrer URL, date and time. The request is kept with a status such as pending, approved or denied.",
      "The website uses first-party analytics to understand visits and page usage. For this purpose, a random visitor identifier is stored in the browser, a session identifier is stored for the current browser session, and page views may be recorded together with page path, referrer, screen and viewport size, language, timezone, IP address, browser or user-agent, date and time.",
    ],
  },
  {
    title: "Purposes of processing",
    paragraphs: [
      "Processing is used to operate the website securely, reliably and conveniently, to display blog posts and to provide gated CV downloads.",
      "CV request and download data is processed to verify access codes, respond to email-based CV requests, send approved CV documents and understand whether CV downloads were accessed successfully.",
      "Website analytics are used to understand how many different visitors use the website, which pages are viewed, which devices and browsers are used, where visitors come from and whether the website works reliably.",
    ],
  },
  {
    title: "Email communication",
    paragraphs: [
      "When a CV is requested by email, a notification may be sent to Friedrich Fischer. If the request is approved, the requested CV documents may be sent to the email address provided by the requester from info@friedrich-fischer.de.",
      "Email delivery requires processing by the configured mailbox and SMTP provider. Email contents may include the requester's email address and attached CV PDF documents.",
    ],
  },
  {
    title: "Retention",
    paragraphs: [
      "CV request records and download logs are retained only for as long as needed for access management, security, troubleshooting and basic analytics, unless legal obligations require a longer retention period.",
    ],
  },
  {
    title: "External services",
    paragraphs: [
      "This website embeds fonts from Google Fonts. This may establish a connection to Google servers. If the fonts are hosted locally later, this section should be adjusted.",
    ],
  },
  {
    title: "Rights of data subjects",
    paragraphs: [
      "Data subjects may request access, rectification, erasure, restriction of processing and data portability, and may object to processing where the legal requirements are met.",
    ],
  },
  { title: "Status", paragraphs: ["May 2026"] },
];

const impressumSections: LegalSection[] = [
  { title: "Information according to section 5 DDG", paragraphs: ["Friedrich Fischer"] },
  { title: "Contact", paragraphs: [`Email: ${email}`] },
  {
    title: "Responsibility for content",
    paragraphs: [
      "As a service provider, we are responsible for our own content on these pages under the general laws in accordance with section 7 paragraph 1 TMG. However, under sections 8 to 10 TMG, there is no obligation to constantly monitor transmitted or stored third-party information or to actively search for circumstances indicating unlawful activity.",
      "Obligations to remove or block the use of information under the general laws remain unaffected. Liability in this respect is only possible from the time we become aware of a specific legal infringement. As soon as we become aware of such legal infringements, we will remove this content immediately.",
    ],
  },
  {
    title: "Responsibility for links",
    paragraphs: [
      "Our website contains links to external third-party websites over whose content we have no influence. We therefore assume no liability for this external content. The respective provider or operator of the linked pages is always responsible for their content. At the time of linking, the pages were checked for possible legal violations; unlawful content was not apparent at that time.",
      "Continuous monitoring of the linked pages is not reasonable without concrete indications of a legal infringement. If we become aware of legal violations, we will remove such links immediately.",
    ],
  },
  {
    title: "Copyright",
    paragraphs: [
      "The content and works created by the site operators on this website are subject to German copyright law. Any reproduction, editing, distribution or other use outside the limits of copyright law requires the prior written consent of the respective author or creator. Downloads and copies of this site are permitted only for private, non-commercial use.",
      "Where content on this site was not created by the operator, third-party copyrights are respected and marked accordingly. If you nevertheless become aware of a copyright infringement, please notify us. If we become aware of corresponding legal infringements, we will remove the affected content immediately.",
    ],
  },
];

function renderParagraph(text: string, index: number) {
  const emailIndex = text.indexOf(email);

  if (emailIndex < 0) {
    return <p key={index}>{text}</p>;
  }

  return (
    <p key={index}>
      {text.slice(0, emailIndex)}
      <a href={`mailto:${email}`}>{email}</a>
      {text.slice(emailIndex + email.length)}
    </p>
  );
}

function renderSections(sections: LegalSection[]) {
  return sections.map((section) => (
    <div className="legal-section" key={section.title}>
      <h2>{section.title}</h2>
      {section.paragraphs.map(renderParagraph)}
    </div>
  ));
}

export function LegalPage({ page, onNavigate }: LegalPageProps) {
  const isPrivacy = page === "privacy";

  return (
    <main className="legal-page" aria-labelledby="legal-title">
      <a className="legal-back-link" href="/" onClick={onNavigate("/")}>Back to home</a>
      <section className="legal-card">
        <p className="legal-kicker">{isPrivacy ? "Privacy Policy" : "Legal Notice"}</p>
        <h1 id="legal-title">{isPrivacy ? "Privacy Policy" : "Impressum"}</h1>
        {isPrivacy ? (
          <p className="legal-note">
            Mock data for review. Please replace or review this text before relying on it as a
            final legal document.
          </p>
        ) : null}
        {renderSections(isPrivacy ? privacySections : impressumSections)}
      </section>
    </main>
  );
}
