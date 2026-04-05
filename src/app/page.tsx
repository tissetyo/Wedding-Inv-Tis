"use client";

import { useRef, useState } from "react";
import data from "@/data/content.json";
import Splash from "@/components/Splash";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import LoveStory from "@/components/LoveStory";
import RSVP from "@/components/RSVP";
import Banking from "@/components/Banking";
import Footer from "@/components/Footer";

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
        <Events events={data.events as any} />
        <Gallery images={data.gallery as any} />
        <LoveStory story={data.loveStory as any} />
        <RSVP />
        <Banking banking={data.banking as any} />
        <Footer />
      </div>

      <audio ref={audioRef} src={data.music} loop />
    </>
  );
}
