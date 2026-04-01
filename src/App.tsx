import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import { HeroSection } from "./components/hero/HeroSection";
import { CvDownloadMenu } from "./components/hero/CvDownloadMenu";
import { NowSection } from "./components/now/NowSection";
import { type DropdownPosition, type UiLanguage } from "./constants/ui";
import { downloadCV, type CVLanguage } from "./utils/cvDownload";
import { getResolvedUiLanguage } from "./utils/language";

function App() {
  const { i18n } = useTranslation();
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(null);
  const cvDropdownRef = useRef<HTMLDivElement>(null);
  const cvTriggerRef = useRef<HTMLButtonElement | null>(null);
  const cvCloseTimeoutRef = useRef<number | null>(null);
  const currentLanguage = getResolvedUiLanguage(i18n.language, i18n.resolvedLanguage);

  const updateDropdownPosition = useCallback(() => {
    const trigger = cvTriggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
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

  const scheduleCVClose = useCallback(() => {
    if (isTouchDevice) {
      return;
    }

    clearCVCloseTimeout();
    cvCloseTimeoutRef.current = window.setTimeout(() => {
      setShowCVOptions(false);
      cvCloseTimeoutRef.current = null;
    }, 120);
  }, [clearCVCloseTimeout, isTouchDevice]);

  const isWithinCVControls = useCallback((node: EventTarget | null) => {
    if (!(node instanceof Node)) {
      return false;
    }

    return Boolean(
      cvTriggerRef.current?.contains(node) || cvDropdownRef.current?.contains(node),
    );
  }, []);

  const handleCVDownload = (language: CVLanguage) => {
    clearCVCloseTimeout();
    downloadCV(language);
    setShowCVOptions(false);
  };

  const handleCVHover = () => {
    if (!isTouchDevice) {
      clearCVCloseTimeout();
      setShowCVOptions(true);
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
    setShowCVOptions((current) => !current);
  };

  const changeLanguage = (language: UiLanguage) => {
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    const hasTouchCapability = () =>
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    setIsTouchDevice(hasTouchCapability());
  }, []);

  useLayoutEffect(() => {
    if (!showCVOptions) {
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
  }, [showCVOptions, updateDropdownPosition]);

  useEffect(() => () => {
    clearCVCloseTimeout();
  }, [clearCVCloseTimeout]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        cvDropdownRef.current?.contains(target) ||
        cvTriggerRef.current?.contains(target)
      ) {
        return;
      }

      setShowCVOptions(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowCVOptions(false);
      }
    };

    if (showCVOptions) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown, { passive: true });
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCVOptions]);

  return (
    <div className="hand-drawn-bg page-shell min-h-screen p-4 sm:p-8">
      <div className="hand-drawn-container page-stack max-w-5xl w-full mx-auto">
        <HeroSection
          currentLanguage={currentLanguage}
          showCVOptions={showCVOptions}
          cvTriggerRef={cvTriggerRef}
          onChangeLanguage={changeLanguage}
          onCVHover={handleCVHover}
          onCVLeave={handleCVLeave}
          onCVClick={handleCVClick}
        />

        <CvDownloadMenu
          showCVOptions={showCVOptions}
          dropdownPosition={dropdownPosition}
          cvDropdownRef={cvDropdownRef}
          onHover={handleCVHover}
          onLeave={handleCVLeave}
          onDownload={handleCVDownload}
        />

        <NowSection />
      </div>
    </div>
  );
}

export default App;
