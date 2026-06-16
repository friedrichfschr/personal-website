import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  buildCvDownloadUrl,
  cvLanguageLabels,
  requestCvAccess,
  validateCvCode,
} from '../lib/cvApi';

const initialStatus = 'locked';

export function CvButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [cvCode, setCvCode] = useState('');
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        !wrapperRef.current?.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setDropdownPosition(null);
      return undefined;
    }

    const updateDropdownPosition = () => {
      const trigger = wrapperRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const gutter = 16;
      const width = Math.min(336, window.innerWidth - gutter * 2);
      const left = Math.min(
        Math.max(rect.right - width, gutter),
        window.innerWidth - width - gutter,
      );
      const top = Math.min(rect.bottom + 12, window.innerHeight - gutter);

      setDropdownPosition({
        left,
        top,
        width,
        arrowLeft: Math.min(Math.max(rect.left + rect.width / 2 - left, 22), width - 22),
      });
    };

    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const codeFromUrl = search.get('cv');

    if (!codeFromUrl) {
      return undefined;
    }

    const controller = new AbortController();
    setIsOpen(true);
    unlockCv(codeFromUrl, controller.signal);

    return () => controller.abort();
  }, []);

  const unlockCv = async (code, signal) => {
    const normalizedCode = String(code || '').trim();

    if (!normalizedCode) {
      setStatus('invalid');
      setMessage('Please enter a CV code.');
      throw new Error('Missing CV code.');
    }

    setStatus('checking');
    setMessage('');

    try {
      const access = await validateCvCode(normalizedCode, signal);
      setCvCode(access.code);
      setDocuments(access.documents);
      setStatus(access.documents.length > 0 ? 'unlocked' : 'invalid');
      setMessage(access.documents.length > 0 ? '' : 'No CV documents are attached to this code.');
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      setDocuments([]);
      setCvCode('');
      setStatus('invalid');
      setMessage(error instanceof Error ? error.message : 'This CV code is not valid.');
      throw error;
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingEmail(true);
    setMessage('');

    try {
      await requestCvAccess(email);
      setEmail('');
      setStatus('request-sent');
      setMessage('Thank you. Your CV request has been sent for review.');
    } catch (error) {
      setStatus('invalid');
      setMessage(error instanceof Error ? error.message : 'The CV request could not be sent.');
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const handleCodeSubmit = async (event) => {
    event.preventDefault();
    setIsSubmittingCode(true);

    try {
      await unlockCv(codeInput);
    } catch {
      // The visible message is set by unlockCv.
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const handleDownload = () => {
    setIsOpen(false);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete('cv');
    window.history.replaceState({}, '', nextUrl);
  };

  const dropdown = isOpen && dropdownPosition ? (
    <div
      ref={dropdownRef}
      className="cv-dropdown-menu is-portal"
      role="menu"
      aria-label="Choose a CV version"
      style={{
        left: `${dropdownPosition.left}px`,
        top: `${dropdownPosition.top}px`,
        width: `${dropdownPosition.width}px`,
        '--dropdown-arrow-left': `${dropdownPosition.arrowLeft}px`,
      }}
    >
      <div className="cv-dropdown-arrow" aria-hidden="true" />
      {documents.length > 0 ? (
        <>
          <span className="cv-dropdown-label">Available in</span>
          <div className="cv-dropdown-actions">
            {documents.map((document) => (
              <a
                key={document.language}
                href={buildCvDownloadUrl(document.language, cvCode)}
                className="cv-option-button"
                target="_blank"
                rel="noreferrer"
                onClick={handleDownload}
              >
                {cvLanguageLabels[document.language] || document.language.toUpperCase()}
              </a>
            ))}
          </div>
        </>
      ) : (
        <div className="cv-access-panel" aria-live="polite">
          <form className="cv-access-form" onSubmit={handleEmailSubmit}>
            <label htmlFor="cv-request-email">Get my CV sent to your Email</label>
            <div className="cv-access-row">
              <input
                id="cv-request-email"
                type="email"
                value={email}
                placeholder="your.email@example.com"
                required
                onChange={(event) => setEmail(event.target.value)}
              />
              <button
                className="cv-access-submit"
                type="submit"
                disabled={isSubmittingEmail || status === 'checking'}
              >
                {isSubmittingEmail ? 'Sending' : 'Request'}
              </button>
            </div>
          </form>

          <details className="cv-code-details">
            <summary>I have a Code</summary>
            <form className="cv-code-form" onSubmit={handleCodeSubmit}>
              <label htmlFor="cv-access-code">CV code</label>
              <div className="cv-access-row cv-code-row">
                <input
                  id="cv-access-code"
                  type="text"
                  value={codeInput}
                  placeholder="Enter CV code"
                  onChange={(event) => setCodeInput(event.target.value)}
                />
                <button
                  className="cv-code-submit"
                  type="submit"
                  disabled={isSubmittingCode || status === 'checking'}
                >
                  {isSubmittingCode || status === 'checking' ? 'Checking' : 'Unlock'}
                </button>
              </div>
            </form>
          </details>

          {message ? <p className="cv-access-message">{message}</p> : null}
        </div>
      )}
    </div>
  ) : null;

  return (
    <div className="cv-button-wrap" ref={wrapperRef}>
      <button
        type="button"
        className="cv-trigger-button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>Get CV</span>
        <span className={`cv-trigger-chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
          v
        </span>
      </button>

      {dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}
