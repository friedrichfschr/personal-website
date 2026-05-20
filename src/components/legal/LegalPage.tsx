import type { MouseEvent } from "react";
import type { UiLanguage } from "../../constants/ui";

type LegalPageProps = {
  page: "privacy" | "impressum";
  locale: UiLanguage;
  onNavigate: (path: string) => (event: MouseEvent<HTMLAnchorElement>) => void;
};

type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalCopy = {
  back: string;
  privacy: {
    kicker: string;
    title: string;
    note: string;
    sections: LegalSection[];
  };
  impressum: {
    kicker: string;
    title: string;
    sections: LegalSection[];
  };
};

const email = "friedrich.riesel@outlook.de";

const legalCopy: Record<UiLanguage, LegalCopy> = {
  en: {
    back: "Back to home",
    privacy: {
      kicker: "Privacy Policy",
      title: "Privacy Policy",
      note: "Mock data for review. Please replace or review this text before relying on it as a final legal document.",
      sections: [
        {
          title: "Controller",
          paragraphs: ["Friedrich Fischer", `Email: ${email}`],
        },
        {
          title: "Data processed",
          paragraphs: [
            "When this website is visited, technically necessary access data may be processed, such as IP address, date and time of access, browser type, operating system and the requested page.",
            "The website retrieves blog posts through the API at api.friedrich-fischer.de. The selected language may also be stored locally in the browser so the website can open in the same language on the next visit.",
          ],
        },
        {
          title: "Purposes of processing",
          paragraphs: [
            "Processing is used to operate the website securely, reliably and conveniently, to display blog posts and to provide CV downloads.",
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
      ],
    },
    impressum: {
      kicker: "Legal Notice",
      title: "Impressum",
      sections: [
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
      ],
    },
  },
  de: {
    back: "Zurueck zur Startseite",
    privacy: {
      kicker: "Datenschutz",
      title: "Datenschutzerklaerung",
      note: "Mock-Daten zur Pruefung. Bitte ersetze oder pruefe diesen Text, bevor er als finales Rechtsdokument verwendet wird.",
      sections: [
        { title: "Verantwortlicher", paragraphs: ["Friedrich Fischer", `E-Mail: ${email}`] },
        {
          title: "Welche Daten verarbeitet werden",
          paragraphs: [
            "Beim Besuch dieser Website koennen technisch notwendige Zugriffsdaten verarbeitet werden, zum Beispiel IP-Adresse, Datum und Uhrzeit des Abrufs, Browsertyp, Betriebssystem und die angefragte Seite.",
            "Die Website ruft Blogbeitraege ueber die API unter api.friedrich-fischer.de ab. Ausserdem kann die ausgewaehlte Sprache lokal im Browser gespeichert werden, damit die Website beim naechsten Besuch in derselben Sprache erscheint.",
          ],
        },
        {
          title: "Zwecke der Verarbeitung",
          paragraphs: [
            "Die Verarbeitung dient dem sicheren, stabilen und nutzerfreundlichen Betrieb der Website, der Darstellung von Blogbeitraegen und der Bereitstellung von CV-Downloads.",
          ],
        },
        {
          title: "Externe Dienste",
          paragraphs: [
            "Diese Website bindet Schriftarten von Google Fonts ein. Dabei kann eine Verbindung zu Servern von Google aufgebaut werden. Falls die Schriftarten lokal gehostet werden sollen, sollte dieser Abschnitt angepasst werden.",
          ],
        },
        {
          title: "Betroffenenrechte",
          paragraphs: [
            "Betroffene Personen koennen Auskunft, Berichtigung, Loeschung, Einschraenkung der Verarbeitung und Datenuebertragbarkeit verlangen sowie einer Verarbeitung widersprechen, soweit die gesetzlichen Voraussetzungen vorliegen.",
          ],
        },
        { title: "Stand", paragraphs: ["Mai 2026"] },
      ],
    },
    impressum: {
      kicker: "Impressum",
      title: "Impressum",
      sections: [
        { title: "Angaben gemaess Paragraf 5 DDG", paragraphs: ["Friedrich Fischer"] },
        { title: "Kontakt", paragraphs: [`E-Mail: ${email}`] },
        {
          title: "Verantwortung fuer Inhalte",
          paragraphs: [
            "Als Diensteanbieter sind wir gemaess Paragraf 7 Abs. 1 TMG fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach Paragrafen 8 bis 10 TMG besteht jedoch keine Verpflichtung, uebermittelte oder gespeicherte fremde Informationen staendig zu ueberwachen oder aktiv nach Umstaenden zu suchen, die auf eine rechtswidrige Taetigkeit hinweisen.",
            "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberuehrt. Eine Haftung hierfuer ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung moeglich. Sobald uns entsprechende Rechtsverletzungen bekannt werden, entfernen wir diese Inhalte unverzueglich.",
          ],
        },
        {
          title: "Verantwortung fuer Links",
          paragraphs: [
            "Unser Internetangebot enthaelt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Daher uebernehmen wir fuer diese fremden Inhalte keine Gewaehr. Fuer den Inhalt der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung haben wir die Seiten auf moegliche Rechtsverstoesse ueberprueft; rechtswidrige Inhalte waren dabei nicht erkennbar.",
            "Eine dauerhafte inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Hinweise auf eine Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverstoessen entfernen wir derartige Links umgehend.",
          ],
        },
        {
          title: "Urheberrecht",
          paragraphs: [
            "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen Urheberrecht. Jegliche Vervielfaeltigung, Bearbeitung, Verbreitung oder sonstige Nutzung ausserhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung des jeweiligen Autors oder Erstellers. Downloads und Kopien dieser Seite sind nur fuer den privaten, nicht kommerziellen Gebrauch erlaubt.",
            "Soweit Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet und entsprechend gekennzeichnet. Solltest Du trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen Hinweis. Bei Bekanntwerden entsprechender Rechtsverletzungen werden wir die betroffenen Inhalte unverzueglich entfernen.",
          ],
        },
      ],
    },
  },
  fr: {
    back: "Retour a l'accueil",
    privacy: {
      kicker: "Confidentialite",
      title: "Politique de confidentialite",
      note: "Donnees fictives pour relecture. Veuillez remplacer ou verifier ce texte avant de l'utiliser comme document juridique final.",
      sections: [
        { title: "Responsable du traitement", paragraphs: ["Friedrich Fischer", `E-mail : ${email}`] },
        {
          title: "Donnees traitees",
          paragraphs: [
            "Lors de la visite de ce site, des donnees d'acces techniquement necessaires peuvent etre traitees, par exemple l'adresse IP, la date et l'heure de l'appel, le type de navigateur, le systeme d'exploitation et la page demandee.",
            "Le site recupere les articles de blog via l'API api.friedrich-fischer.de. La langue selectionnee peut aussi etre enregistree localement dans le navigateur afin que le site s'ouvre dans la meme langue lors de la prochaine visite.",
          ],
        },
        {
          title: "Finalites du traitement",
          paragraphs: [
            "Le traitement sert a exploiter le site de maniere sure, stable et conviviale, a afficher les articles de blog et a fournir les telechargements de CV.",
          ],
        },
        {
          title: "Services externes",
          paragraphs: [
            "Ce site integre des polices de Google Fonts. Une connexion aux serveurs de Google peut alors etre etablie. Si les polices sont hebergees localement plus tard, cette section devra etre adaptee.",
          ],
        },
        {
          title: "Droits des personnes concernees",
          paragraphs: [
            "Les personnes concernees peuvent demander l'acces, la rectification, l'effacement, la limitation du traitement et la portabilite des donnees, et peuvent s'opposer au traitement lorsque les conditions legales sont reunies.",
          ],
        },
        { title: "Date", paragraphs: ["Mai 2026"] },
      ],
    },
    impressum: {
      kicker: "Mentions legales",
      title: "Impressum",
      sections: [
        { title: "Informations selon l'article 5 DDG", paragraphs: ["Friedrich Fischer"] },
        { title: "Contact", paragraphs: [`E-mail : ${email}`] },
        {
          title: "Responsabilite pour les contenus",
          paragraphs: [
            "En tant que fournisseur de services, nous sommes responsables de nos propres contenus sur ces pages selon les lois generales, conformement a l'article 7 paragraphe 1 TMG. Selon les articles 8 a 10 TMG, il n'existe toutefois aucune obligation de surveiller en permanence les informations de tiers transmises ou stockees, ni de rechercher activement des circonstances indiquant une activite illicite.",
            "Les obligations de suppression ou de blocage de l'utilisation d'informations selon les lois generales restent inchangees. Une responsabilite a cet egard n'est toutefois possible qu'a partir du moment ou nous avons connaissance d'une violation concrete du droit. Des que de telles violations nous sont connues, nous supprimons immediatement ces contenus.",
          ],
        },
        {
          title: "Responsabilite pour les liens",
          paragraphs: [
            "Notre offre en ligne contient des liens vers des sites externes de tiers sur les contenus desquels nous n'avons aucune influence. Nous n'assumons donc aucune garantie pour ces contenus externes. Le fournisseur ou l'exploitant respectif des pages liees est toujours responsable de leur contenu. Au moment de la creation des liens, les pages ont ete controlees quant a d'eventuelles violations du droit ; aucun contenu illicite n'etait alors reconnaissable.",
            "Un controle permanent du contenu des pages liees n'est pas raisonnablement exigible sans indice concret d'une violation du droit. Si nous avons connaissance de violations du droit, nous supprimerons immediatement ces liens.",
          ],
        },
        {
          title: "Droit d'auteur",
          paragraphs: [
            "Les contenus et oeuvres crees par les exploitants du site sur ce site web sont soumis au droit d'auteur allemand. Toute reproduction, modification, diffusion ou autre utilisation en dehors des limites du droit d'auteur necessite l'accord ecrit prealable de l'auteur ou du createur concerne. Les telechargements et copies de cette page ne sont autorises que pour un usage prive et non commercial.",
            "Dans la mesure ou les contenus de cette page n'ont pas ete crees par l'exploitant, les droits d'auteur de tiers sont respectes et signales en consequence. Si vous constatez malgre tout une violation du droit d'auteur, nous vous prions de nous en informer. Si de telles violations nous sont connues, nous supprimerons immediatement les contenus concernes.",
          ],
        },
      ],
    },
  },
  zh: {
    back: "返回首页",
    privacy: {
      kicker: "隐私政策",
      title: "隐私政策",
      note: "以下为用于审核的模拟文本。作为最终法律文件使用前，请进行替换或审查。",
      sections: [
        { title: "负责人", paragraphs: ["Friedrich Fischer", `电子邮件：${email}`] },
        {
          title: "处理的数据",
          paragraphs: [
            "访问本网站时，可能会处理技术上必要的访问数据，例如 IP 地址、访问日期和时间、浏览器类型、操作系统以及请求的页面。",
            "本网站通过 api.friedrich-fischer.de 的 API 获取博客文章。所选择的语言也可能会存储在浏览器本地，以便下次访问时以相同语言显示。",
          ],
        },
        {
          title: "处理目的",
          paragraphs: ["数据处理用于安全、稳定且便捷地运行本网站，显示博客文章，并提供简历下载。"],
        },
        {
          title: "外部服务",
          paragraphs: [
            "本网站嵌入了 Google Fonts 字体，因此可能会与 Google 服务器建立连接。如果之后改为本地托管字体，本节应相应调整。",
          ],
        },
        {
          title: "数据主体权利",
          paragraphs: [
            "在符合法律要求的情况下，数据主体可以请求访问、更正、删除、限制处理和数据可携带权，也可以反对数据处理。",
          ],
        },
        { title: "版本日期", paragraphs: ["2026 年 5 月"] },
      ],
    },
    impressum: {
      kicker: "法律声明",
      title: "Impressum",
      sections: [
        { title: "依据 DDG 第 5 条的信息", paragraphs: ["Friedrich Fischer"] },
        { title: "联系方式", paragraphs: [`电子邮件：${email}`] },
        {
          title: "内容责任",
          paragraphs: [
            "作为服务提供者，我们根据一般法律并依照 TMG 第 7 条第 1 款，对本网站上的自有内容负责。但是，根据 TMG 第 8 至第 10 条，我们没有义务持续监控传输或存储的第三方信息，也没有义务主动寻找表明违法活动的情形。",
            "根据一般法律删除或阻止使用信息的义务不受影响。然而，相关责任只有在知悉具体违法行为之时起才可能产生。一旦我们获知相应违法行为，将立即删除这些内容。",
          ],
        },
        {
          title: "链接责任",
          paragraphs: [
            "本网站包含指向第三方外部网站的链接，我们无法影响其内容。因此，我们不对这些外部内容承担保证责任。被链接页面的相应提供者或运营者始终对其内容负责。在建立链接时，我们已检查相关页面是否存在可能的违法行为；当时未发现违法内容。",
            "在没有具体违法线索的情况下，持续检查被链接页面的内容并不合理。一旦我们获知违法行为，将立即删除此类链接。",
          ],
        },
        {
          title: "版权",
          paragraphs: [
            "本网站由网站运营者创建的内容和作品受德国版权法保护。任何超出版权法限制的复制、编辑、传播或其他使用，均需事先取得相应作者或创作者的书面同意。本网站的下载和复制仅允许用于私人、非商业用途。",
            "如果本页面的内容并非由运营者创建，我们会尊重第三方版权并作出相应标注。如果您仍然发现版权侵权，请通知我们。一旦我们获知相应侵权行为，将立即删除相关内容。",
          ],
        },
      ],
    },
  },
};

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

export function LegalPage({ page, locale, onNavigate }: LegalPageProps) {
  const copy = legalCopy[locale] ?? legalCopy.en;
  const pageCopy = copy[page];

  return (
    <main className="legal-page" aria-labelledby="legal-title">
      <a className="legal-back-link" href="/" onClick={onNavigate("/")}>{copy.back}</a>
      <section className="legal-card">
        <p className="legal-kicker">{pageCopy.kicker}</p>
        <h1 id="legal-title">{pageCopy.title}</h1>
        {"note" in pageCopy ? <p className="legal-note">{pageCopy.note}</p> : null}
        {renderSections(pageCopy.sections)}
      </section>
    </main>
  );
}
