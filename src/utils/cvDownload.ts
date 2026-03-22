export type CVLanguage = "en" | "de";

interface CVFile {
  filename: string;
  path: string;
}

const cvFiles: Record<CVLanguage, CVFile> = {
  en: {
    filename: "Friedrich-Fischer-CV-EN.pdf",
    path: "/Friedrich Fischer CV.pdf",
  },
  de: {
    filename: "Friedrich-Fischer-Lebenslauf-DE.pdf",
    path: "/Friedrich Fischer Lebenslauf.pdf",
  },
};

export const downloadCV = (language: CVLanguage): void => {
  const cv = cvFiles[language];
  const link = document.createElement("a");
  link.href = cv.path;
  link.download = cv.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
