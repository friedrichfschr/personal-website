import { Button } from "@heroui/react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

type CvAccessGateProps = {
  status: "checking" | "locked" | "invalid" | "request-sent";
  message: string;
  onEmailRequest: (email: string) => Promise<void>;
  onCodeSubmit: (code: string) => Promise<void>;
};

export function CvAccessGate({
  status,
  message,
  onEmailRequest,
  onCodeSubmit,
}: CvAccessGateProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingEmail(true);

    try {
      await onEmailRequest(email);
      setEmail("");
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingCode(true);

    try {
      await onCodeSubmit(code);
    } finally {
      setIsSubmittingCode(false);
    }
  };

  return (
    <div className="cv-access-panel" aria-live="polite">
      <form className="cv-access-form" onSubmit={handleEmailSubmit}>
        <label htmlFor="cv-request-email">{t("cv.request.emailLabel")}</label>
        <div className="cv-access-row">
          <input
            id="cv-request-email"
            type="email"
            value={email}
            placeholder={t("cv.request.emailPlaceholder")}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            className="hand-drawn-button cv-access-submit"
            type="submit"
            isDisabled={isSubmittingEmail || status === "checking"}
          >
            {isSubmittingEmail ? t("cv.request.sending") : t("cv.request.submit")}
          </Button>
        </div>
      </form>

      <details className="cv-code-details">
        <summary>{t("cv.request.codeLabel")}</summary>
        <form className="cv-code-form" onSubmit={handleCodeSubmit}>
          <label htmlFor="cv-access-code">{t("cv.request.codeInputLabel")}</label>
          <div className="cv-access-row cv-code-row">
            <input
              id="cv-access-code"
              type="text"
              value={code}
              placeholder={t("cv.request.codePlaceholder")}
              onChange={(event) => setCode(event.target.value)}
            />
            <Button
              className="hand-drawn-button-secondary cv-code-submit"
              type="submit"
              isDisabled={isSubmittingCode || status === "checking"}
            >
              {isSubmittingCode ? t("cv.request.checking") : t("cv.request.unlock")}
            </Button>
          </div>
        </form>
      </details>

      {message ? <p className="cv-access-message">{message}</p> : null}
    </div>
  );
}
