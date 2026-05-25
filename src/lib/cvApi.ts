import type { CVLanguage } from "../utils/cvDownload";
import { blogApiBaseUrl } from "./blogApi";

export type CvDocument = {
  language: CVLanguage;
  fileKey: string;
  downloadName: string;
};

export type CvAccess = {
  code: string;
  label?: string;
  documents: CvDocument[];
};

export async function validateCvCode(code: string, signal?: AbortSignal): Promise<CvAccess> {
  const normalizedCode = code.trim();

  if (!blogApiBaseUrl) {
    throw new Error("The CV API is not configured.");
  }

  const response = await fetch(
    `${blogApiBaseUrl}/api/cv/access?cv=${encodeURIComponent(normalizedCode)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal,
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "This CV code is not valid.");
  }

  return {
    code: payload.code || normalizedCode,
    label: payload.label || "",
    documents: Array.isArray(payload.documents) ? payload.documents : [],
  };
}

export async function requestCvAccess(email: string): Promise<void> {
  if (!blogApiBaseUrl) {
    throw new Error("The CV API is not configured.");
  }

  const response = await fetch(`${blogApiBaseUrl}/api/cv/request`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "The CV request could not be sent.");
  }
}

export function buildCvDownloadUrl(language: CVLanguage, code: string): string {
  const normalizedCode = code.trim();

  if (!blogApiBaseUrl || !normalizedCode) {
    return "#";
  }

  return `${blogApiBaseUrl}/api/cv/download/${language}?cv=${encodeURIComponent(normalizedCode)}`;
}
