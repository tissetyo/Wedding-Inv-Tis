"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData, HeroConfig } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero({ data, theme }: { data: ContentData; theme: any }) {
  const container = useRef<HTMLElement>(null);
  const heroData = data.hero as HeroConfig;

  useGSAP(
    () => {
      if (!container.current) return;
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
    <section 
      ref={container} 
      className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center px-12 text-[var(--color-text)]"
      style={{ backgroundColor: theme?.backgroundColor || "var(--color-bg)" }}
    >
      {/* Background Section Override */}
      {theme?.backgroundType === "image" && (theme?.backgroundImage || data.hero.backgroundImage) ? (
        <div 
          className="hero-bg absolute inset-0 bg-cover bg-center grayscale contrast-125 sepia-[0.2]"
          style={{ backgroundImage: `url('${theme.backgroundImage || data.hero.backgroundImage}')` }}
        />
      ) : null}
      
      {/* Cinematic vignettes & noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-bg)_100%)] z-10 opacity-90" />
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay z-20 bg-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-screen z-20 bg-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/grunge-wall.png')" }} />
      
      <div className="hero-content relative z-30 flex flex-col items-center text-center">
        <p className="text-[var(--color-accent)]/80 font-sans tracking-[0.5em] uppercase text-[9px] mb-8">
          Presenting
        </p>
        
        {/* Artistic Script Font */}
        <h1 className="relative font-script text-7xl text-current leading-[1.2] mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] flex flex-col items-center" style={{ fontFamily: "var(--font-script)" }}>
          <span className="z-10">{data.hero.groomName}</span>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-6xl text-[var(--color-accent)] opacity-80 z-0 pointer-events-none" style={{ fontFamily: "var(--font-serif)" }}>&</span>
          <span className="z-10 mt-2">{data.hero.brideName}</span>
        </h1>
        
        <div className="w-[1px] h-12 bg-[var(--color-text)]/20 mb-8 mx-auto" />
        
        <p className="font-serif text-xs tracking-[0.3em] uppercase text-[var(--color-text)]/50">
          {(() => {
            const d = new Date(data.hero.date);
            return isNaN(d.getTime()) ? '' : d.toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });
          })()}
        </p>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center z-30 animate-pulse">
        <p className="font-sans text-[8px] tracking-[0.4em] uppercase text-[var(--color-text)]/40">Scroll Down</p>
      </div>
    </section>
  );
}
