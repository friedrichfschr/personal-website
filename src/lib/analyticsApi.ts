import { blogApiBaseUrl } from "./blogApi";

const visitorStorageKey = "ff_visitor_id";
const sessionStorageKey = "ff_session_id";

function createId(prefix: string) {
  const randomPart = crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
  return `${prefix}_${randomPart.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function getVisitorId() {
  const existing = window.localStorage.getItem(visitorStorageKey);
  if (existing) {
    return existing;
  }

  const visitorId = createId("visitor");
  window.localStorage.setItem(visitorStorageKey, visitorId);
  return visitorId;
}

function getSessionId() {
  const existing = window.sessionStorage.getItem(sessionStorageKey);
  if (existing) {
    return existing;
  }

  const sessionId = createId("session");
  window.sessionStorage.setItem(sessionStorageKey, sessionId);
  return sessionId;
}

export function trackPageView(path: string) {
  if (!blogApiBaseUrl) {
    return;
  }

  const payload = {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    eventType: "page_view",
    pagePath: path,
    pageTitle: document.title,
    referrerUrl: document.referrer || "",
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const body = JSON.stringify(payload);
  const url = `${blogApiBaseUrl}/api/analytics/visit`;

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
