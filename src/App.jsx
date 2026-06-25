import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import SongPlayer from './components/SongPlayer';
import { NowSection } from './components/now/NowSection';
import { SocialLinks } from './components/SocialLinks';
import { CvButton } from './components/CvButton';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';

const RealityPianoScene = lazy(() => import('./components/RealityPianoScene'));

function getCurrentPage() {
  if (window.location.pathname === '/privacy') return 'privacy';
  if (window.location.pathname === '/impressum') return 'impressum';
  return 'home';
}

function App() {
  const songNotesRef = useRef(new Map());
  const startTimerRef = useRef(null);
  const [isPianoSceneReady, setIsPianoSceneReady] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [page, setPage] = useState(getCurrentPage);

  useEffect(() => {
    function handlePopState() {
      setPage(getCurrentPage());
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => () => {
    if (startTimerRef.current) {
      window.clearTimeout(startTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (hasStarted) return undefined;

    const body = document.body;
    const html = document.documentElement;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousBodyOverflow;
      html.style.overflow = previousHtmlOverflow;
    };
  }, [hasStarted]);

  useEffect(() => {
    if (page !== 'home') return undefined;

    let animationFrame = 0;

    const updateSectionFocus = () => {
      animationFrame = 0;

      const nextSection = document.querySelector('[data-section-layer="projects"]');
      if (!(nextSection instanceof HTMLElement)) return;

      const rect = nextSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
      const start = viewportHeight * (isMobileViewport ? 0.62 : 0.82);
      const end = viewportHeight * (isMobileViewport ? 0.18 : 0.26);
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);

      document.documentElement.style.setProperty('--section-focus-progress', progress.toFixed(3));
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateSectionFocus);
    };

    updateSectionFocus();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      document.documentElement.style.removeProperty('--section-focus-progress');
    };
  }, [page]);

  const handleNavigate = (path) => (event) => {
    event.preventDefault();
    window.history.pushState({}, '', path);
    setPage(getCurrentPage());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStart = () => {
    if (isStarting) return;

    setIsStarting(true);
    startTimerRef.current = window.setTimeout(() => {
      setHasStarted(true);
    }, 520);
  };

  if (page === 'privacy' || page === 'impressum') {
    return (
      <LegalPage
        page={page}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <main className={`site-shell min-h-screen bg-[#070b14] text-paper ${hasStarted ? '' : 'is-entry-locked'} ${isStarting ? 'is-entering' : ''}`}>

      <section className="hero-scene relative w-full overflow-hidden bg-[#070b14]">
        <div className="hero-scene-frame relative w-full overflow-hidden">
          <div className="hero-scene-canvas absolute inset-x-0 top-0">
            <Suspense fallback={null}>
              <RealityPianoScene
                songNotesRef={songNotesRef}
                isSongPlaying={isSongPlaying}
                onSceneReady={() => setIsPianoSceneReady(true)}
              />
            </Suspense>
          </div>
        </div>

        <SongPlayer
          activeNotesRef={songNotesRef}
          autoPlayWhenReady={isPianoSceneReady && hasStarted}
          onPlaybackChange={setIsSongPlaying}
        />
      </section>

      <div className="page-scroll-panel">
        <section
          className="intro-content mx-auto grid w-full max-w-5xl gap-8 px-5 text-paper/82 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"
          data-section-layer="about"
        >
          <div className="intro-statement">
            <p className="intro-kicker">My name is</p>
            <h1 className="intro-heading">Friedrich Fischer</h1>
            <p className="intro-copy">
              I'm a 17-year-old globally minded philomath
              from Germany who is enthusiastic about computers, practical music, learning languages,
              and discovering the cultures of the world.
            </p>
          </div>
          <div className="intro-actions">
            <SocialLinks />
            <div className="intro-cv-slot">
              <CvButton />
            </div>
          </div>
        </section>

        <section className="now-content w-full px-5 pb-20 sm:px-8" data-section-layer="projects">
          <NowSection />
        </section>

        <div className="relative z-[1] mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8">
          <Footer onNavigate={handleNavigate} />
        </div>
      </div>

      {!hasStarted ? (
        <div className={`site-entry-overlay ${isStarting ? 'is-exiting' : ''}`} aria-live="polite">
          {isPianoSceneReady ? (
            <button
              type="button"
              className="site-start-button"
              disabled={isStarting}
              onClick={handleStart}
            >
              Start
            </button>
          ) : (
            <div className="site-loading-dots" role="status" aria-label="Loading">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
}

export default App;
