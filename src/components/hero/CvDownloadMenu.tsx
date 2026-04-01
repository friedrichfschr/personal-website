import { Button } from "@heroui/react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import type { CVLanguage } from "../../utils/cvDownload";
import type { DropdownPosition } from "../../constants/ui";

type CvDownloadMenuProps = {
  showCVOptions: boolean;
  dropdownPosition: DropdownPosition | null;
  cvDropdownRef: RefObject<HTMLDivElement | null>;
  onHover: () => void;
  onLeave: (event: ReactMouseEvent<HTMLElement>) => void;
  onDownload: (language: CVLanguage) => void;
};

export function CvDownloadMenu({
  showCVOptions,
  dropdownPosition,
  cvDropdownRef,
  onHover,
  onLeave,
  onDownload,
}: CvDownloadMenuProps) {
  const { t } = useTranslation();

  if (!showCVOptions || !dropdownPosition) {
    return null;
  }

  return (
    <div
      ref={cvDropdownRef}
      className="hand-drawn-dropdown-menu cv-portal-dropdown"
      aria-label={t("cv.label")}
      role="menu"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: `${dropdownPosition.width}px`,
        "--dropdown-arrow-left": `${dropdownPosition.arrowLeft}px`,
      } as CSSProperties}
    >
      <div className="hand-drawn-dropdown-arrow"></div>
      <span className="hand-drawn-dropdown-label">{t("cv.availableLabel")}</span>
      <div className="cv-dropdown-actions">
        <Button
          size="sm"
          className="hand-drawn-button-secondary cv-option-button"
          onPress={() => onDownload("en")}
        >
          {t("cv.languages.en")}
        </Button>
        <Button
          size="sm"
          className="hand-drawn-button-secondary cv-option-button"
          onPress={() => onDownload("de")}
        >
          {t("cv.languages.de")}
        </Button>
      </div>
    </div>
  );
}
