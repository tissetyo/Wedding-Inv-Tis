"use client";

import { useRef, useState, useEffect } from "react";

export default function MusicPlayer({ src, play }: { src: string; play?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (play && audioRef.current && src && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [play, src, isPlaying]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
        style={{
          backgroundColor: "rgba(26, 23, 20, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(191, 174, 145, 0.4)",
          color: "var(--color-accent, #bfae91)",
        }}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <span
          className="text-base select-none inline-block"
          style={isPlaying ? { animation: "spin 3s linear infinite" } : {}}
        >
          {isPlaying ? "♫" : "♪"}
        </span>
      </button>
    </>
  );
}
