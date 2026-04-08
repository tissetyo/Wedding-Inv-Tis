"use client";

import { useState, useEffect } from "react";
import defaultData from "@/data/content.json";
import { supabase } from "@/lib/supabase";
import Splash from "@/components/Splash";
import Hero from "@/components/Hero";
import Couple from "@/components/Couple";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import LoveStory from "@/components/LoveStory";
import RSVP from "@/components/RSVP";
import Banking from "@/components/Banking";
import Footer from "@/components/Footer";
import PaperPlaneGuide from "@/components/PaperPlaneGuide";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [content, setContent] = useState<any>(defaultData);

  useEffect(() => {
    async function fetchDB() {
      const { data, error } = await supabase.from("site_settings").select("payload").eq("id", 1).single();
      if (data && data.payload) {
        setContent(data.payload);
      }
    }
    fetchDB();
  }, []);

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <>
      <Splash 
        hero={content.hero as any} 
        theme={content.theme.sections.splash} 
        onOpen={handleOpen} 
        onInteraction={() => setMusicStarted(true)}
      />
      
      {/* The MusicPlayer is now mounted early to ensure it's ready when the button is clicked */}
      <MusicPlayer src={content.music || ""} play={musicStarted} />
      
      {/* The main content that's hidden behind the splash until opened */}
      <div className={`relative ${isOpened ? "overflow-y-auto" : "overflow-hidden h-screen"}`}>
        {isOpened && <PaperPlaneGuide icon={content.theme.global.guideIcon || 'plane'} customImage={content.theme.global.guideImage} />}
        <Hero data={content as any} theme={content.theme.sections.hero} />
        <Couple couple={content.couple as any} theme={content.theme.sections.couple} />
        <Events events={content.events as any} theme={content.theme.sections.events} />
        <Gallery images={content.gallery as any} theme={content.theme.sections.gallery} />
        <LoveStory story={content.loveStory as any} theme={content.theme.sections.loveStory} />
        <RSVP theme={content.theme.sections.rsvp} />
        <Banking banking={content.banking as any} theme={content.theme.sections.banking} />
        <Footer />
      </div>
    </>
  );
}
