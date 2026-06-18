import { Suspense, useEffect, useRef, useState } from 'react';
import RealityPianoScene from './components/RealityPianoScene';
import SongPlayer from './components/SongPlayer';
import { NowSection } from './components/now/NowSection';
import { SocialLinks } from './components/SocialLinks';
import { CvButton } from './components/CvButton';
import { AmbientParticles } from './components/AmbientParticles';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPage';

function getCurrentPage() {
  if (window.location.pathname === '/privacy') return 'privacy';
  if (window.location.pathname === '/impressum') return 'impressum';
  return 'home';
}

function App() {
  const songNotesRef = useRef(new Map());
  const startTimerRef = useRef(null);
  const [isPianoSceneReady, setIsPianoSceneReady] = useState(false);
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
      <AmbientParticles />
      <section className="hero-scene relative w-full overflow-hidden bg-[#070b14]">
        <div className="relative h-[clamp(340px,48vh,540px)] w-full overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[clamp(430px,68vh,820px)]">
            <Suspense fallback={null}>
              <RealityPianoScene
                songNotesRef={songNotesRef}
                onSceneReady={() => setIsPianoSceneReady(true)}
              />
            </Suspense>
          </div>
        </div>
        <AmbientParticles className="hero-particles" />
        <div className="site-wordmark pointer-events-none absolute left-4 top-4 z-10 select-none sm:left-7 sm:top-6">
          <span className="font-serif text-3xl italic tracking-wide text-white/72 drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] sm:text-5xl">
            Friedrich
          </span>
        </div>
        <SongPlayer activeNotesRef={songNotesRef} autoPlayWhenReady={isPianoSceneReady && hasStarted} />
      </section>

      <div className="page-scroll-panel">
        <section className="intro-content mx-auto grid w-full max-w-5xl gap-8 px-5 pb-14 pt-8 text-paper/82 sm:px-8 sm:pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <p className="mt-0 max-w-3xl text-lg leading-8 text-paper/64">
            My name is Friedrich Fischer, a 17-year-old globally minded philomath
            from Germany who is enthusiastic about computers, learning languages,
            and discovering the world.
          </p>
          <div className="grid w-full grid-cols-[max-content_minmax(0,1fr)] items-end gap-x-3 gap-y-4 md:w-auto md:grid-cols-1 md:justify-items-end">
            <SocialLinks />
            <CvButton />
          </div>
        </section>

        <section className="now-content mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
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
