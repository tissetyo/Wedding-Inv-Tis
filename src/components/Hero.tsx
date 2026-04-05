"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero({ data }: { data: ContentData }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Parallax background
      gsap.to(".hero-bg", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Staggered text fade in
      gsap.from(".hero-content", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 60%",
          toggleActions: "play none none reverse", // Ensures it reverses when scrolling up
        },
        scale: 1.1,
        opacity: 0,
        filter: "blur(5px)",
        duration: 2,
        ease: "power2.out",
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#111] px-12">
      {/* Background movie still */}
      <div 
        className="hero-bg absolute inset-0 opacity-50 bg-cover bg-center grayscale contrast-125 sepia-[0.2]"
        style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
      />
      
      {/* Cinematic vignettes & noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-10 opacity-90" />
      <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay z-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
      
      <div className="hero-content relative z-30 flex flex-col items-center text-center">
        <p className="text-[#bfae91]/60 font-sans tracking-[0.5em] uppercase text-[9px] mb-8">
          Presenting
        </p>
        
        {/* Artistic Script Font */}
        <h1 className="font-script text-7xl text-white leading-none mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ fontFamily: "var(--font-script)" }}>
          {data.hero.groomName} <br/> 
          <span className="text-3xl">&</span> <br/>
          {data.hero.brideName}
        </h1>
        
        <div className="w-[1px] h-12 bg-white/20 mb-8 mx-auto" />
        
        <p className="font-serif text-xs tracking-[0.3em] uppercase text-white/50">
          {new Date(data.hero.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center z-30 animate-pulse">
        <p className="font-sans text-[8px] tracking-[0.4em] uppercase text-white/30">Scroll Down</p>
      </div>
    </section>
  );
}
