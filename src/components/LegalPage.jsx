const email = 'friedrich.riesel@outlook.de';

const privacySections = [
  {
    title: 'Controller',
    paragraphs: ['Friedrich Fischer', `Email: ${email}`],
  },
  {
    title: 'Data processed',
    paragraphs: [
      'When this website is visited, technically necessary access data may be processed, such as IP address, date and time of access, browser type, operating system and the requested page.',
      'The website may retrieve blog posts through the API at api.friedrich-fischer.de.',
      'If you use a CV access code, the code is checked by the API. When a CV PDF is downloaded, the download may be logged with the CV code used, selected CV language, document identifier, IP address, browser or user-agent, referrer URL, date and time.',
      'If you request CV access by email, the email address entered in the form is stored together with technical request metadata such as IP address, browser or user-agent, referrer URL, date and time. The request may be kept with a status such as pending, approved or denied.',
    ],
  },
  {
    title: 'Purposes of processing',
    paragraphs: [
      'Processing is used to operate the website securely and reliably, to display blog posts, and to provide gated CV downloads.',
      'CV request and download data is processed to verify access codes, respond to email-based CV requests, send approved CV documents, and understand whether CV downloads were accessed successfully.',
    ],
  },
  {
    title: 'External services',
    paragraphs: [
      'This website links to external social platforms and may load public assets, audio files, 3D models, or API data needed for the interactive experience.',
      'When you follow external links, the privacy policies of the respective providers apply.',
    ],
  },
  {
    title: 'Rights of data subjects',
    paragraphs: [
      'Data subjects may request access, rectification, erasure, restriction of processing and data portability, and may object to processing where the legal requirements are met.',
    ],
  },
  {
    title: 'Status',
    paragraphs: ['June 2026'],
  },
];

const impressumSections = [
  {
    title: 'Information according to section 5 DDG',
    paragraphs: ['Friedrich Fischer'],
  },
  {
    title: 'Contact',
    paragraphs: [`Email: ${email}`],
  },
  {
    title: 'Responsibility for content',
    paragraphs: [
      'As a service provider, I am responsible for my own content on these pages under the general laws. However, there is no obligation to constantly monitor transmitted or stored third-party information or to actively search for circumstances indicating unlawful activity.',
      'Obligations to remove or block the use of information under the general laws remain unaffected. Liability in this respect is only possible from the time of awareness of a specific legal infringement.',
    ],
  },
  {
    title: 'Responsibility for links',
    paragraphs: [
      'This website contains links to external third-party websites over whose content I have no influence. The respective provider or operator of the linked pages is responsible for their content.',
      'If I become aware of legal violations, I will remove such links as soon as reasonably possible.',
    ],
  },
  {
    title: 'Copyright',
    paragraphs: [
      'The content and works created by the site operator on this website are subject to German copyright law. Reproduction, editing, distribution or other use outside the limits of copyright law requires prior written consent where applicable.',
      'Where content on this site was not created by the operator, third-party copyrights are respected. If you become aware of a copyright infringement, please notify me.',
    ],
  },
];

function renderParagraph(text, index) {
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

export function LegalPage({ page, onNavigate }) {
  const isPrivacy = page === 'privacy';
  const sections = isPrivacy ? privacySections : impressumSections;

  return (
    <main className="site-shell legal-shell min-h-screen text-paper">
      <section className="legal-page mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <a className="legal-back-link" href="/" onClick={onNavigate('/')}>
          Back to home
        </a>
        <article className="legal-card" aria-labelledby="legal-title">
          <p className="legal-kicker">{isPrivacy ? 'Privacy Policy' : 'Legal Notice'}</p>
          <h1 id="legal-title">{isPrivacy ? 'Privacy Policy' : 'Impressum'}</h1>
          {isPrivacy ? (
            <p className="legal-note">
              This page is a practical draft based on the existing website text. Please review it
              before treating it as final legal advice.
            </p>
          ) : null}
          {sections.map((section) => (
            <section className="legal-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map(renderParagraph)}
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
