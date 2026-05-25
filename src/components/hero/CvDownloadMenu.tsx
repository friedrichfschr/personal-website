import type { CSSProperties, MouseEvent as ReactMouseEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import type { DropdownPosition } from "../../constants/ui";
import { buildCvDownloadUrl, type CvDocument } from "../../lib/cvApi";
import { cvLanguageLabels } from "../../utils/cvDownload";
import { CvAccessGate } from "./CvAccessGate";

type CvDownloadMenuProps = {
  showCVOptions: boolean;
  dropdownPosition: DropdownPosition | null;
  cvDropdownRef: RefObject<HTMLDivElement | null>;
  cvCode: string;
  documents: CvDocument[];
  cvAccessStatus: "checking" | "locked" | "invalid" | "request-sent";
  cvAccessMessage: string;
  onHover: () => void;
  onLeave: (event: ReactMouseEvent<HTMLElement>) => void;
  onDownload: () => void;
  onCvEmailRequest: (email: string) => Promise<void>;
  onCvCodeSubmit: (code: string) => Promise<void>;
  inline?: boolean;
  isClosing?: boolean;
};

export function CvDownloadMenu({
  showCVOptions,
  dropdownPosition,
  cvDropdownRef,
  cvCode,
  documents,
  cvAccessStatus,
  cvAccessMessage,
  onHover,
  onLeave,
  onDownload,
  onCvEmailRequest,
  onCvCodeSubmit,
  inline = false,
  isClosing = false,
}: CvDownloadMenuProps) {
  const { t } = useTranslation();

  if (!showCVOptions || (!inline && !dropdownPosition)) {
    return null;
  }

  const dropdownStyle = inline
    ? ({ "--dropdown-arrow-left": "50%" } as CSSProperties)
    : ({
      top: `${dropdownPosition?.top}px`,
      left: `${dropdownPosition?.left}px`,
      width: `${dropdownPosition?.width}px`,
      "--dropdown-arrow-left": `${dropdownPosition?.arrowLeft}px`,
    } as CSSProperties);

  return (
    <div
      ref={cvDropdownRef}
      className={`hand-drawn-dropdown-menu ${inline ? "cv-inline-dropdown" : "cv-portal-dropdown"} ${isClosing ? "closing" : ""}`}
      aria-label={t("cv.label")}
      role="menu"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={dropdownStyle}
    >
      <div className="hand-drawn-dropdown-arrow"></div>
      {documents.length > 0 ? (
        <>
          <span className="hand-drawn-dropdown-label">{t("cv.availableLabel")}</span>
          <div className="cv-dropdown-actions">
            {documents.map((document) => (
              <a
                key={document.language}
                href={buildCvDownloadUrl(document.language, cvCode)}
                className="hand-drawn-button-secondary cv-option-button"
                target="_blank"
                rel="noreferrer"
                onClick={onDownload}
              >
                {cvLanguageLabels[document.language] || document.language.toUpperCase()}
              </a>
            ))}
          </div>
        </>
      ) : (
        <CvAccessGate
          status={cvAccessStatus}
          message={cvAccessMessage}
          onEmailRequest={onCvEmailRequest}
          onCodeSubmit={onCvCodeSubmit}
        />
      )}
    </div>
  );
}
