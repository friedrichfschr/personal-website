export const uiLanguages = ["en", "de", "fr", "zh"] as const;
export type UiLanguage = (typeof uiLanguages)[number];

export type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  arrowLeft: number;
};

export const nowDateLocales: Record<UiLanguage, string> = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  zh: "zh-CN",
};
