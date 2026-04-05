"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";
import { Tape } from "./ui/Tape";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero({ data }: { data: ContentData }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".hero-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.from(".hero-content", {
        y: 40,
        rotation: -2,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8 text-center bg-[#151210]">
      {/* Background texture overlayed on image */}
      <div 
        className="hero-bg absolute inset-0 -z-20 bg-cover bg-center sepia-[0.3] grayscale-[0.2]"
        style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#151210] via-[#151210]/60 to-transparent" />
      
      {/* Giant Polaroid Hero */}
      <div className="hero-content relative bg-[#f4f1ea] p-4 pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-w-[90%] rotate-2 z-10 w-full mx-auto">
        <Tape className="-top-4 -right-4 rotate-[25deg]" />
        <Tape className="-bottom-3 -left-4 -rotate-[20deg]" />

        <div className="w-full aspect-square border border-black/10 overflow-hidden bg-black mb-6">
          <img 
            src={data.hero.backgroundImage} 
            className="w-full h-full object-cover sepia-[0.4] contrast-125"
          />
        </div>

        <h2 className="text-[#8B7120] font-sans tracking-[0.3em] uppercase text-[10px] mb-3">
          {data.hero.title}
        </h2>
        <h1 className="font-serif text-5xl text-black leading-none mb-4">
          {data.hero.groomName} <span className="text-2xl italic font-light font-sans text-[#D4AF37]">&</span> {data.hero.brideName}
        </h1>
        <p className="font-serif text-sm italic text-black/60">
          {new Date(data.hero.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </section>
  );
}
