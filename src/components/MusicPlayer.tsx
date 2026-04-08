"use client";

import { useRef, useState, useEffect } from "react";
import { Disc3 } from "lucide-react";

export default function MusicPlayer({ src, play }: { src: string; play?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    if (play && audioRef.current && src) {
      // If the source just arrived or we are instructed to play
      if (audioRef.current.src !== src) {
        audioRef.current.load();
      }
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        hasAutoPlayed.current = true;
      }).catch((err) => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    }
  }, [play, src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Do NOT return null here, the audio element must persist for the gesture to work
  const showButton = !!src;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      {showButton && (
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
            className="inline-block"
            style={isPlaying ? { animation: "spin 3s linear infinite" } : {}}
          >
            <Disc3 className="w-6 h-6" strokeWidth={1} />
          </span>
        </button>
      )}
    </>
  );
}
