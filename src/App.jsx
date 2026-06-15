import { Suspense, useRef, useState } from 'react';
import RealityPianoScene from './components/RealityPianoScene';
import SongPlayer from './components/SongPlayer';
import { NowSection } from './components/now/NowSection';
import { SocialLinks } from './components/SocialLinks';
import { PianoSceneLoader } from './components/PianoSceneLoader';
import { CvButton } from './components/CvButton';
import { AmbientParticles } from './components/AmbientParticles';

function App() {
  const songNotesRef = useRef(new Map());
  const [isPianoSceneReady, setIsPianoSceneReady] = useState(false);

  return (
    <main className="site-shell min-h-screen bg-[#070b14] text-paper">
      <AmbientParticles />
      <section className="hero-scene relative w-full overflow-hidden bg-[#070b14]">
        <div className="relative h-[clamp(340px,48vh,540px)] w-full overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[clamp(430px,68vh,820px)]">
            <Suspense fallback={<PianoSceneLoader />}>
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
        <SongPlayer activeNotesRef={songNotesRef} autoPlayWhenReady={isPianoSceneReady} />
      </section>

      <section className="intro-content mx-auto grid w-full max-w-5xl gap-8 px-5 pb-14 pt-3 text-paper/82 sm:px-8 sm:pt-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
        <p className="mt-0 max-w-3xl text-lg leading-8 text-paper/64">
          My name is Friedrich Fischer, a 17-year-old globally minded philomath
          from Germany who is enthusiastic about computers, learning languages,
          and discovering the world.
        </p>
        <div className="contact-actions grid justify-items-start gap-4 md:justify-items-end">
          <SocialLinks />
          <CvButton />
        </div>
      </section>

      <section className="now-content mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <NowSection />
      </section>
    </main>
  );
}

export default App;
