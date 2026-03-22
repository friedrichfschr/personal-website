import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Button, Link } from "@heroui/react";
import {
  DiscordIcon,
  GithubIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  TwitterIcon,
  YoutubeIcon,
} from "./icons";
import { siteConfig } from "../site";
import { downloadCV } from "./utils/cvDownload";

function App() {
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cvDropdownRef = useRef<HTMLDivElement>(null);

  const handleCVDownload = (language: "en" | "de") => {
    downloadCV(language);
    setShowCVOptions(false);
  };

  const handleCVHover = () => {
    // Only open on hover if not a touch device
    if (!isTouchDevice) {
      setShowCVOptions(true);
    }
  };

  const handleCVLeave = () => {
    // Only close on leave if not a touch device
    if (!isTouchDevice) {
      setShowCVOptions(false);
    }
  };

  const handleCVClick = () => {
    // On touch devices, toggle immediately
    if (isTouchDevice) {
      setShowCVOptions(!showCVOptions);
    }
  };

  // Detect touch device on mount
  useEffect(() => {
    const hasTouchCapability = () =>
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    setIsTouchDevice(hasTouchCapability());
  }, []);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cvDropdownRef.current &&
        !cvDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCVOptions(false);
      }
    };

    if (showCVOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCVOptions]);

  return (
    <div className="hand-drawn-bg min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="hand-drawn-container max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="hand-drawn-title text-6xl sm:text-7xl font-bold mb-2">
            Friedrich Fischer
          </h1>
          <p className="hand-drawn-subtitle text-lg sm:text-xl text-neutral-700 dark:text-neutral-300">
            Ambitious, Curious & Communicative
          </p>
        </div>

        {/* Main Content */}
        <div className="hand-drawn-card flex flex-col sm:flex-row items-center gap-8 sm:gap-12 p-8 sm:p-10">
          {/* Portrait */}
          <div className="w-48 h-48 sm:w-56 sm:h-56">
            <img
              src="/PortraitNoBackground.PNG"
              alt="Portrait of Friedrich Fischer"
              className="hand-drawn-portrait w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-3xl absolute"
            />
            <img
              src="/PortraitPencil.png"
              style={{
                filter: "opacity(0.88)",
              }}
              alt="Portrait of Friedrich Fischer"
              className="hand-drawn-portrait w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-3xl absolute"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-8">
            {/* Social Links */}
            <div>
              <h3 className="hand-drawn-label text-sm font-semibold mb-4 text-neutral-600 dark:text-neutral-400">
                Connect with me
              </h3>
              <div className="social-links-grid">
                <Link
                  target="_blank"
                  href={siteConfig.links.instagram}
                  aria-label="Instagram"
                  className="hand-drawn-icon-button"
                >
                  <InstagramIcon className="text-rose-600 dark:text-fuchsia-400 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.youtube}
                  aria-label="Youtube"
                  className="hand-drawn-icon-button"
                >
                  <YoutubeIcon className="text-red-600 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.twitter}
                  aria-label="Twitter"
                  className="hand-drawn-icon-button"
                >
                  <TwitterIcon className="dark:text-blue-500 text-blue-600 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.github}
                  aria-label="GitHub"
                  className="hand-drawn-icon-button"
                >
                  <GithubIcon className="text-foreground w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.linkedIn}
                  aria-label="LinkedIn"
                  className="hand-drawn-icon-button"
                >
                  <LinkedInIcon className="text-blue-900 dark:text-blue-500 w-6 h-6" />
                </Link>
                <Link
                  target="_blank"
                  href={siteConfig.links.mail}
                  aria-label="Mail"
                  className="hand-drawn-icon-button"
                >
                  <MailIcon className="text-foreground w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* CV Download */}
            <div
              className="relative"
              ref={cvDropdownRef}
              onMouseEnter={handleCVHover}
              onMouseLeave={handleCVLeave}
            >
              <Button
                className="hand-drawn-button w-full sm:w-auto"
                onPress={handleCVClick}
              >
                Get my CV
              </Button>

              {showCVOptions && (
                <div className="hand-drawn-dropdown-menu">
                  <div className="hand-drawn-dropdown-arrow"></div>
                  <Button
                    size="sm"
                    className="hand-drawn-button-secondary"
                    onPress={() => handleCVDownload("en")}
                  >
                    English
                  </Button>
                  <Button
                    size="sm"
                    className="hand-drawn-button-secondary"
                    onPress={() => handleCVDownload("de")}
                  >
                    Deutsch
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
