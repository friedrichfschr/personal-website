import { Suspense, useRef } from 'react';
import RealityPianoScene from './components/RealityPianoScene';
import SongPlayer from './components/SongPlayer';
import { NowSection } from './components/now/NowSection';

function App() {
  const songNotesRef = useRef(new Map());

  return (
    <main className="min-h-screen bg-[#070b14] text-paper">
      <section className="relative w-full overflow-hidden bg-[#070b14]">
        <div className="h-[clamp(430px,68vh,820px)] w-full">
          <Suspense
            fallback={
              <div className="grid h-full place-items-center text-sm font-semibold text-paper/70">
                Loading piano model
              </div>
            }
          >
            <RealityPianoScene songNotesRef={songNotesRef} />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute left-4 top-4 z-10 select-none sm:left-7 sm:top-6">
          <span className="font-serif text-3xl italic tracking-wide text-white/72 drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)] sm:text-5xl">
            Friedrich
          </span>
        </div>
        <SongPlayer activeNotesRef={songNotesRef} />
      </section>

      <section className="mx-auto w-full max-w-4xl px-5 py-14 text-paper/82 sm:px-8">
        <h1 className="text-5xl font-semibold leading-[0.98] tracking-normal text-paper sm:text-6xl lg:text-7xl">
          Friedrich Fischer
        </h1>
        <p className="mt-6 text-lg leading-8 text-paper/64">
          My name is Friedrich Fischer, a 17-year-old globally minded philomath
          from Germany who is enthusiastic about computers, learning languages,
          and discovering the world.
        </p>
        <p className="mt-4 text-sm font-medium leading-6 text-paper/48">
          Click or tap the piano keys to play them. You can also use your
          keyboard: Z X C V B N M and Q W E R T Y U.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
        <NowSection />
      </section>
    </main>
  );
}

export default App;
