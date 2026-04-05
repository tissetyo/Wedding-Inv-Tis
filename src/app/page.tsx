"use client";

import { useRef, useState } from "react";
import data from "@/data/content.json";
import Splash from "@/components/Splash";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOpen = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio play blocked by browser", e));
    }
  };

  return (
    <>
      <Splash hero={data.hero as any} onOpen={handleOpen} />
      
      {/* The main content that's hidden behind the splash until opened */}
      <div className={`relative ${isOpened ? "overflow-y-auto" : "overflow-hidden h-screen"}`}>
        <Hero data={data as any} />
        <Couple couple={data.couple as any} />
        
        {/* Simple placeholder for bottom spacing */}
        <div className="h-48 flex items-center justify-center text-white/30 text-sm">
          More sections continuing...
        </div>
      </div>

      <audio ref={audioRef} src={data.music} loop />
    </>
  );
}
