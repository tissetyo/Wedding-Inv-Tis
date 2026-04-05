"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { HeroConfig } from "@/types";

gsap.registerPlugin(useGSAP);

const VerticalFilmStrip = ({ className }: { className: string }) => (
  <div className={`absolute top-0 w-12 h-[200%] bg-[#0a0a0a] border-black flex flex-col justify-start z-50 overflow-hidden opacity-90 shadow-2xl film-scroll ${className}`}>
     {Array.from({length: 40}).map((_, i) => (
       <div key={i} className="w-5 h-6 bg-[#cfc5b3] rounded-sm mx-auto my-3 opacity-80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] shrink-0" />
     ))}
  </div>
);

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
      // Need to make sure container exists because of React strict mode / hydration
      if (!container.current) return;

      // Infinite smooth film rolling
      const rollAnim = gsap.to(".film-scroll", {
        y: "-50%",
        repeat: -1,
        duration: 8,
        ease: "none"
      });
      
      gsap.from(".center-content", {
        scale: 0.9,
        opacity: 0,
        duration: 3,
        ease: "power3.out",
        delay: 0.2,
      });

      if (isOpen) {
        // Speed up the film roll dramatically
        gsap.to(rollAnim, { timeScale: 8, duration: 1 });

        // Fade out text
        gsap.to(".center-content", {
          opacity: 0,
          scale: 1.1,
          duration: 1,
          ease: "power2.in"
        });

        // Slide the film strips outwards like a curtain opening
        gsap.to(".strip-left", {
          xPercent: -100,
          duration: 1.5,
          delay: 0.5,
          ease: "power3.inOut"
        });
        
        gsap.to(".strip-right", {
          xPercent: 100,
          duration: 1.5,
          delay: 0.5,
          ease: "power3.inOut"
        });

        // Fade out entire splash overlay
        gsap.to(container.current, {
          opacity: 0,
          duration: 1.5,
          delay: 1,
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
      className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#181818] text-[#f4f1ea] overflow-hidden"
    >
      <VerticalFilmStrip className="left-0 border-r-4 strip-left" />
      <VerticalFilmStrip className="right-0 border-l-4 strip-right" />
      
      {/* Heavy vintage noise / film scratch overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay z-40 bg-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-screen z-40 bg-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/grunge-wall.png')" }} />
      
      {/* Center Artistic Layout */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center px-12 h-screen center-content w-full">
        <h2 className="text-[#bfae91]/80 font-sans tracking-[0.4em] text-[10px] uppercase mb-4 shadow-black drop-shadow-md">
          {hero.title || "The Wedding Of"}
        </h2>
        
        {/* Massive Artistic Script matching the "The End" reference */}
        <h1 className="font-script text-6xl md:text-8xl text-[#f4f1ea] mb-2 leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] whitespace-nowrap" style={{ fontFamily: "var(--font-script)" }}>
          {hero.groomName || "Andi"} <br/> 
          <span className="text-4xl px-4 text-[#bfae91]">&</span> <br/>
          {hero.brideName || "Sari"}
        </h1>
        
        <button
          onClick={() => setIsOpen(true)}
          className="mt-16 px-8 py-3 bg-[#f4f1ea]/10 text-white font-sans text-[10px] tracking-[0.3em] uppercase border border-[#f4f1ea]/20 rounded-full hover:bg-[#f4f1ea]/30 hover:border-[#f4f1ea] transition-all backdrop-blur-sm cursor-pointer relative z-50 animate-pulse"
        >
          Open Invitation
        </button>
      </div>
    </div>
  );
}
