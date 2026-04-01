import { nowDateLocales, type UiLanguage } from "../constants/ui";

export const getResolvedUiLanguage = (language?: string, resolvedLanguage?: string): UiLanguage => (
  ((resolvedLanguage?.split("-")[0] ?? language?.split("-")[0]) || "en") as UiLanguage
);

export const formatNowDate = (date: string, locale: UiLanguage) => {
  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  if (locale === "en") {
    return new Intl.DateTimeFormat(nowDateLocales[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(parsedDate);
  }

  return new Intl.DateTimeFormat(nowDateLocales[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsedDate);
};
