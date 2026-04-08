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

export default function Couple({ couple, theme }: { couple: ContentData["couple"]; theme: any }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray(".reveal-couple");
      elements.forEach((el: any, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse", // play when scrolling down, reverse when scrolling up
          },
          x: i === 0 ? -30 : 30,
          y: 40,
          opacity: 0,
          rotation: i === 0 ? -15 : 15,
          duration: 1.5,
          ease: "back.out(1.2)",
        });
      });
    },
    { scope: container }
  );

  return (
    <section 
      ref={container} 
      className="relative py-32 px-2 text-center text-[var(--color-text)] overflow-hidden"
      style={{ backgroundColor: theme?.backgroundColor || undefined }}
    >
      {/* Background Section Override */}
      {theme?.backgroundType === "image" && theme?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale contrast-125 sepia-[0.2]"
          style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
        />
      )}

      <div className="mb-10 text-center relative z-10">
        <h2 id="mempelai-title" className="inline-block font-sans text-[10px] tracking-[0.3em] uppercase text-current/60 mb-4">Mempelai</h2>
        <div className="h-[1px] w-8 bg-current/20 mx-auto" />
      </div>

      <div className="relative flex flex-row justify-center w-full max-w-sm mx-auto items-start pb-24 z-10 mt-8 px-2">
        
        {/* Groom Polaroid (Top Layer, Left Side) */}
        <div className="reveal-couple w-[55%] relative bg-[#f4f1ea] p-2 pb-8 shadow-[10px_10px_25px_rgba(0,0,0,0.8)] -rotate-3 z-30 translate-y-4">
          <Tape className="-top-2 left-3 -rotate-3 w-10 h-3" />
          <Tape className="-bottom-2 right-3 -rotate-6 w-10 h-3" />
          
          <div className="w-full aspect-[4/5] bg-[#1a1714]/10 mb-3 overflow-hidden">
            <img 
              src={couple.groom.photo} 
              alt={couple.groom.fullName} 
              className="object-cover w-full h-full grayscale contrast-125 sepia-[0.2]"
            />
          </div>
          <h3 className="font-serif text-xl text-[#1a1714] font-bold mb-1 leading-tight">{couple.groom.fullName}</h3>
          <p className="text-[#1a1714]/60 text-[7px] tracking-widest uppercase mb-1 leading-tight">
            Putra Bpk. {couple.groom.father} <br/>& Ibu {couple.groom.mother}
          </p>
          <p className="text-[#bfae91] text-[8px] tracking-[0.2em] mt-2 truncate w-full px-1">{couple.groom.instagram}</p>
        </div>

        {/* Bride Polaroid (Bottom Layer, Pushed way down so Groom corner hits image, not text) */}
        <div className="reveal-couple w-[55%] relative bg-[#f4f1ea] p-2 pb-8 shadow-[0_15px_30px_rgba(0,0,0,0.9)] rotate-3 z-20 -ml-12 mt-40">
          <Tape className="-top-3 right-4 rotate-6 w-10 h-3" />
          
          <div className="w-full aspect-[4/5] bg-[#1a1714]/10 mb-3 overflow-hidden">
            <img 
              src={couple.bride.photo} 
              alt={couple.bride.fullName} 
              className="object-cover w-full h-full grayscale contrast-125 sepia-[0.2]"
            />
          </div>
          <h3 className="font-serif text-xl text-[#1a1714] font-bold mb-1 leading-tight">{couple.bride.fullName}</h3>
          <p className="text-[#1a1714]/60 text-[7px] tracking-widest uppercase mb-1 leading-tight">
            Putri Bpk. {couple.bride.father} <br/>& Ibu {couple.bride.mother}
          </p>
          <p className="text-[#bfae91] text-[8px] tracking-[0.2em] mt-2 truncate w-full px-1">{couple.bride.instagram}</p>
        </div>
      </div>
    </section>
  );
}
