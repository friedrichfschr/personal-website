import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import "./App.css";
import { HeroSection } from "./components/hero/HeroSection";
import { CvDownloadMenu } from "./components/hero/CvDownloadMenu";
import { Footer } from "./components/legal/Footer";
import { LegalPage } from "./components/legal/LegalPage";
import { NowSection } from "./components/now/NowSection";
import { type DropdownPosition } from "./constants/ui";
import {
  requestCvAccess,
  validateCvCode,
  type CvDocument,
} from "./lib/cvApi";
import { trackPageView } from "./lib/analyticsApi";

type CvAccessStatus = "checking" | "locked" | "invalid" | "request-sent";

type AppRoute = "home" | "privacy" | "impressum";

function resolveRoute(pathname: string): AppRoute {
  if (pathname === "/privacy") {
    return "privacy";
  }

  if (pathname === "/impressum") {
    return "impressum";
  }

  return "home";
}

function App() {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute(window.location.pathname));
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [renderCVOptions, setRenderCVOptions] = useState(false);
  const [isCVClosing, setIsCVClosing] = useState(false);
  const [cvAccessStatus, setCvAccessStatus] = useState<CvAccessStatus>("checking");
  const [cvAccessMessage, setCvAccessMessage] = useState("");
  const [cvCode, setCvCode] = useState("");
  const [cvDocuments, setCvDocuments] = useState<CvDocument[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(() => window.innerWidth <= 768);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const cvDropdownRef = useRef<HTMLDivElement>(null);
  const cvTriggerRef = useRef<HTMLButtonElement | null>(null);
  const cvCloseTimeoutRef = useRef<number | null>(null);
  const cvAnimationTimeoutRef = useRef<number | null>(null);

  const updateDropdownPosition = useCallback(() => {
    const trigger = cvTriggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const isCompactViewport = window.innerWidth <= 768;

    if (isCompactViewport) {
      const width = Math.max(260, Math.min(340, window.innerWidth - 32));
      const left = Math.min(
        Math.max(16, rect.left + rect.width / 2 - width / 2),
        window.innerWidth - width - 16,
      );

      setDropdownPosition({
        top: rect.top - 16,
        left,
        width,
        arrowLeft: Math.min(Math.max(rect.left + rect.width / 2 - left, 24), width - 24),
      });
      return;
    }

    const width = Math.min(Math.max(rect.width, 240), 320);
    const left = Math.min(
      Math.max(16, rect.left + rect.width / 2 - width / 2),
      window.innerWidth - width - 16,
    );

    setDropdownPosition({
      top: rect.bottom + 2,
      left,
      width,
      arrowLeft: rect.left + rect.width / 2 - left,
    });
  }, []);

  const clearCVCloseTimeout = useCallback(() => {
    if (cvCloseTimeoutRef.current !== null) {
      window.clearTimeout(cvCloseTimeoutRef.current);
      cvCloseTimeoutRef.current = null;
    }
  }, []);

  const clearCVAnimationTimeout = useCallback(() => {
    if (cvAnimationTimeoutRef.current !== null) {
      window.clearTimeout(cvAnimationTimeoutRef.current);
      cvAnimationTimeoutRef.current = null;
    }
  }, []);

  const openCVOptions = useCallback(() => {
    clearCVCloseTimeout();
    clearCVAnimationTimeout();
    setIsCVClosing(false);
    setRenderCVOptions(true);
    setShowCVOptions(true);
  }, [clearCVAnimationTimeout, clearCVCloseTimeout]);

  const closeCVOptions = useCallback(() => {
    if (!renderCVOptions) {
      return;
    }

    clearCVCloseTimeout();
    clearCVAnimationTimeout();
    setShowCVOptions(false);
    setIsCVClosing(true);
    cvAnimationTimeoutRef.current = window.setTimeout(() => {
      setRenderCVOptions(false);
      setIsCVClosing(false);
      cvAnimationTimeoutRef.current = null;
    }, 180);
  }, [clearCVAnimationTimeout, clearCVCloseTimeout, renderCVOptions]);

  const scheduleCVClose = useCallback(() => {
    if (isTouchDevice || isCompactViewport) {
      return;
    }

    clearCVCloseTimeout();
    cvCloseTimeoutRef.current = window.setTimeout(() => {
      closeCVOptions();
      cvCloseTimeoutRef.current = null;
    }, 520);
  }, [clearCVCloseTimeout, closeCVOptions, isCompactViewport, isTouchDevice]);

  const isWithinCVControls = useCallback((node: EventTarget | null) => {
    if (!(node instanceof Node)) {
      return false;
    }

    return Boolean(
      cvTriggerRef.current?.contains(node) || cvDropdownRef.current?.contains(node),
    );
  }, []);

  const handleCVDownload = () => {
    closeCVOptions();
  };

  const unlockCvCode = useCallback(async (code: string, options?: { updateUrl?: boolean }) => {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
      setCvAccessStatus("invalid");
      setCvAccessMessage("Please enter a CV code.");
      throw new Error("Missing CV code.");
    }

    setCvAccessStatus("checking");
    setCvAccessMessage("");

    try {
      const access = await validateCvCode(normalizedCode);
      setCvCode(access.code);
      setCvDocuments(access.documents);
      setCvAccessStatus("locked");
      setCvAccessMessage("");

      if (options?.updateUrl !== false) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("cv", access.code);
        window.history.replaceState({}, "", nextUrl);
      }
    } catch (error) {
      setCvCode("");
      setCvDocuments([]);
      setCvAccessStatus("invalid");
      setCvAccessMessage(error instanceof Error ? error.message : "This CV code is not valid.");
      throw error;
    }
  }, []);

  const handleCvEmailRequest = useCallback(async (email: string) => {
    try {
      await requestCvAccess(email);
      setCvAccessStatus("request-sent");
      setCvAccessMessage("Thank you. Your CV request has been sent for review.");
    } catch (error) {
      setCvAccessStatus("invalid");
      setCvAccessMessage(error instanceof Error ? error.message : "The CV request could not be sent.");
      throw error;
    }
  }, []);

  const handleCVHover = () => {
    if (!isTouchDevice) {
      openCVOptions();
    }
  };

  const handleCVLeave = (event: ReactMouseEvent<HTMLElement>) => {
    if (isTouchDevice || isWithinCVControls(event.relatedTarget)) {
      return;
    }

    scheduleCVClose();
  };

  const handleCVClick = () => {
    clearCVCloseTimeout();
    if (renderCVOptions && !isCVClosing) {
      closeCVOptions();
      return;
    }

    openCVOptions();
  };

  const handleNavigate = useCallback((path: string) => (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    window.history.pushState({}, "", path);
    setRoute(resolveRoute(path));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    const hasTouchCapability = () =>
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    setIsTouchDevice(hasTouchCapability());
  }, []);

  useEffect(() => {
    const syncCompactViewport = () => {
      setIsCompactViewport(window.innerWidth <= 768);
    };

    syncCompactViewport();
    window.addEventListener("resize", syncCompactViewport);

    return () => {
      window.removeEventListener("resize", syncCompactViewport);
    };
  }, []);

  useEffect(() => {
    trackPageView(`${window.location.pathname}${window.location.search}`);
  }, [route]);

  useEffect(() => {
    const initialCode = new URLSearchParams(window.location.search).get("cv") || "";

    if (!initialCode.trim()) {
      setCvAccessStatus("locked");
      return;
    }

    unlockCvCode(initialCode, { updateUrl: false }).catch(() => undefined);
  }, [unlockCvCode]);

  useLayoutEffect(() => {
    if (!renderCVOptions) {
      return;
    }

    if (isTouchDevice || isCompactViewport) {
      setDropdownPosition(null);
      return;
    }

    updateDropdownPosition();

    const syncPosition = () => updateDropdownPosition();

    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);

    return () => {
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [isCompactViewport, isTouchDevice, renderCVOptions, updateDropdownPosition]);

  useEffect(() => () => {
    clearCVCloseTimeout();
    clearCVAnimationTimeout();
  }, [clearCVAnimationTimeout, clearCVCloseTimeout]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        cvDropdownRef.current?.contains(target) ||
        cvTriggerRef.current?.contains(target)
      ) {
        return;
      }

      closeCVOptions();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCVOptions();
      }
    };

    if (renderCVOptions) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown, { passive: true });
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeCVOptions, isTouchDevice, renderCVOptions]);

  const useInlineCvMenu = isTouchDevice || isCompactViewport;

  const cvMenu = (
    <CvDownloadMenu
      showCVOptions={renderCVOptions}
      dropdownPosition={dropdownPosition}
      cvDropdownRef={cvDropdownRef}
      cvCode={cvCode}
      documents={cvDocuments}
      cvAccessStatus={cvAccessStatus}
      cvAccessMessage={cvAccessMessage}
      onHover={handleCVHover}
      onLeave={handleCVLeave}
      onDownload={handleCVDownload}
      onCvEmailRequest={handleCvEmailRequest}
      onCvCodeSubmit={unlockCvCode}
      inline={useInlineCvMenu}
      isClosing={isCVClosing}
    />
  );

  return (
    <div className="hand-drawn-bg page-shell min-h-screen p-4 sm:p-8">
      <div className="hand-drawn-container page-stack max-w-5xl w-full mx-auto">
        {route === "home" ? (
          <>
            <HeroSection
              showCVOptions={showCVOptions}
              cvTriggerRef={cvTriggerRef}
              onCVHover={handleCVHover}
              onCVLeave={handleCVLeave}
              onCVClick={handleCVClick}
              cvDropdownContent={useInlineCvMenu ? cvMenu : null}
            />

            {useInlineCvMenu ? null : cvMenu}

            <NowSection />
          </>
        ) : (
          <LegalPage page={route} onNavigate={handleNavigate} />
        )}

        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default App;
