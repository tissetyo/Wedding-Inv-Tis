"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MailOpen } from "lucide-react";
import { HeroConfig } from "@/types";
import { FilmStrip } from "./ui/FilmStrip";

gsap.registerPlugin(useGSAP);

export default function Splash({
  hero,
  onOpen,
}: {
  hero: HeroConfig;
  onOpen: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(
    () => {
      gsap.from(".splash-text", {
        y: 20,
        opacity: 0,
        duration: 2,
        stagger: 0.3,
        ease: "power2.out",
        delay: 0.5,
      });

      if (isOpen) {
        gsap.to(container.current, {
          opacity: 0,
          scale: 1.1,
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            onOpen();
            if (container.current) container.current.style.display = "none";
          },
        });
      }
    },
    { dependencies: [isOpen], scope: container }
  );

  return (
    <div
      ref={container}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[#151210] text-[#EAE0C8]"
    >
      <FilmStrip className="opacity-70" > <div className="h-4 bg-black" /> </FilmStrip>
      
      {/* Background texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />
      <div className="absolute inset-0 bg-[#D4AF37]/5 pointer-events-none mix-blend-color" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 h-full">
        <div className="border-4 border-double border-[#D4AF37]/40 p-8 py-16 w-full max-w-sm relative">
          {/* Classic silent film intertitle look */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#151210] px-4 text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase splash-text">
            {hero.title}
          </div>
          
          <h1 className="splash-text font-serif text-5xl mb-6 leading-tight tracking-wider">
            {hero.groomName} <br/> 
            <span className="font-sans text-2xl font-light italic text-[#D4AF37] my-2 block">&</span> 
            {hero.brideName}
          </h1>
          
          <button
            onClick={() => setIsOpen(true)}
            className="splash-text mx-auto mt-12 flex items-center gap-3 border border-[#D4AF37]/50 bg-black/50 px-8 py-4 text-xs tracking-widest uppercase transition-all hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]"
          >
            <MailOpen size={14} />
            Buka Undangan
          </button>
        </div>
      </div>

      <FilmStrip className="opacity-70" > <div className="h-4 bg-black" /> </FilmStrip>
    </div>
  );
}
