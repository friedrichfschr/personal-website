import { Midi } from '@tonejs/midi';
import { Pause, Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { pianoSceneConfig } from '../data/pianoSceneConfig';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function midiNoteToKeyName(midiNote) {
  return `_${midiNote - pianoSceneConfig.audio.baseMidiOffset}`;
}

function findFirstNoteIndexAtOrAfter(notes, time) {
  let low = 0;
  let high = notes.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);

    if (notes[mid].time < time) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

export default function SongPlayer({ activeNotesRef, autoPlayWhenReady = false }) {
  const songs = pianoSceneConfig.songs;
  const defaultSongId = songs.find((song) => song.id === 'clair-de-lune')?.id ?? songs[0]?.id;
  const [selectedSongId, setSelectedSongId] = useState(defaultSongId);
  const [notes, setNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const rafRef = useRef();
  const lastUiUpdateRef = useRef(0);
  const autoplayAttemptedRef = useRef(false);
  const noteCursorRef = useRef(0);
  const activeSongNotesRef = useRef(new Map());
  const previousSongTimeRef = useRef(0);
  const maxNoteDurationRef = useRef(0);

  const selectedSong = useMemo(
    () => songs.find((song) => song.id === selectedSongId) ?? songs[0],
    [selectedSongId, songs],
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadMidi() {
      if (!selectedSong) return;

      setNotes([]);
      activeNotesRef.current.clear();
      activeSongNotesRef.current.clear();
      noteCursorRef.current = 0;
      previousSongTimeRef.current = 0;

      const response = await fetch(selectedSong.midiUrl);
      const buffer = await response.arrayBuffer();
      const midi = new Midi(buffer);
      const parsedNotes = midi.tracks
        .flatMap((track) => track.notes)
        .map((note) => ({
          keyName: midiNoteToKeyName(note.midi),
          time: note.time,
          endTime: note.time + note.duration,
          velocity: Math.max(note.velocity, 0.35),
        }))
        .sort((a, b) => a.time - b.time);
      const maxNoteDuration = parsedNotes.reduce(
        (maxDuration, note) => Math.max(maxDuration, note.endTime - note.time),
        0,
      );

      if (isCancelled) return;

      setNotes(parsedNotes);
      noteCursorRef.current = 0;
      activeSongNotesRef.current.clear();
      previousSongTimeRef.current = 0;
      maxNoteDurationRef.current = maxNoteDuration;
    }

    loadMidi().catch(() => {
      if (isCancelled) return;
      setNotes([]);
      activeNotesRef.current.clear();
      activeSongNotesRef.current.clear();
      noteCursorRef.current = 0;
      previousSongTimeRef.current = 0;
      maxNoteDurationRef.current = 0;
    });

    return () => {
      isCancelled = true;
    };
  }, [activeNotesRef, selectedSong]);

  useEffect(() => {
    if (!selectedSong) return;

    const preloadAudio = new Audio();
    preloadAudio.preload = 'auto';
    preloadAudio.src = selectedSong.audioUrl;
    preloadAudio.load();
  }, [selectedSong]);

  useEffect(() => {
    if (!autoPlayWhenReady || !selectedSong || notes.length === 0 || autoplayAttemptedRef.current) {
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      const audio = audioRef.current;
      if (!audio) return;

      autoplayAttemptedRef.current = true;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        // Browsers may block autoplay with sound until the first user gesture.
      }
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [autoPlayWhenReady, notes.length, selectedSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    function updateActiveNotes() {
      const songTime = audio.currentTime + (selectedSong?.animationOffset ?? 0);
      const previousSongTime = previousSongTimeRef.current;

      if (songTime < previousSongTime || songTime - previousSongTime > 1.5) {
        activeSongNotesRef.current.clear();
        noteCursorRef.current = findFirstNoteIndexAtOrAfter(
          notes,
          Math.max(0, songTime - maxNoteDurationRef.current),
        );
      }

      activeNotesRef.current.clear();

      while (noteCursorRef.current < notes.length && notes[noteCursorRef.current].time <= songTime) {
        const note = notes[noteCursorRef.current];
        activeSongNotesRef.current.set(note, note);
        noteCursorRef.current += 1;
      }

      for (const note of activeSongNotesRef.current.values()) {
        if (note.endTime >= songTime) {
          activeNotesRef.current.set(note.keyName, note.velocity);
        } else {
          activeSongNotesRef.current.delete(note);
        }
      }

      previousSongTimeRef.current = songTime;

      const now = performance.now();
      if (now - lastUiUpdateRef.current > 120) {
        setCurrentTime(audio.currentTime);
        lastUiUpdateRef.current = now;
      }

      if (!audio.paused && !audio.ended) {
        rafRef.current = requestAnimationFrame(updateActiveNotes);
      }
    }

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateActiveNotes);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [activeNotesRef, isPlaying, notes, selectedSong]);

  function clearActiveNotes() {
    activeNotesRef.current.clear();
    activeSongNotesRef.current.clear();
    previousSongTimeRef.current = 0;
    setCurrentTime(audioRef.current?.currentTime ?? 0);
  }

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !selectedSong) return;

    if (audio.paused) {
      try {
        if (notes.length === 0) return;
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      clearActiveNotes();
    }
  }

  function handleSongChange(event) {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setNotes([]);
    activeNotesRef.current.clear();
    activeSongNotesRef.current.clear();
    noteCursorRef.current = 0;
    previousSongTimeRef.current = 0;
    setSelectedSongId(event.target.value);
  }

  if (!selectedSong) return null;

  return (
    <section className="absolute right-3 top-3 z-10 rounded-lg border border-white/[0.06] bg-neutral-400/[0.055] px-2 py-1.5 text-paper/78 shadow-[0_14px_44px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:right-5 sm:top-5">
      <audio
        ref={audioRef}
        key={selectedSong.id}
        src={selectedSong.audioUrl}
        preload="auto"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          setIsPlaying(false);
          clearActiveNotes();
        }}
      />

      <div className="flex items-center gap-2">
        <div className="min-w-0">
          <select
            value={selectedSong.id}
            onChange={handleSongChange}
            className="w-full max-w-[178px] truncate rounded-md bg-neutral-300/[0.08] px-2 py-1 text-xs font-medium text-paper/76 outline-none transition hover:bg-neutral-200/[0.13]"
          >
            {songs.map((song) => (
              <option key={song.id} value={song.id} className="bg-ink text-paper">
                {song.title}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="text-[11px] font-medium tabular-nums text-paper/48">
            {formatTime(currentTime)}
          </span>
          <button
            type="button"
            onClick={togglePlayback}
            className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-300/[0.09] text-paper/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:bg-neutral-200/[0.15] hover:text-paper/90"
            aria-label={isPlaying ? 'Pause song' : 'Play song'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>
    </section>
  );
}
