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

export default function Couple({ couple }: { couple: ContentData["couple"] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray(".reveal-couple");
      elements.forEach((el: any, i) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          rotation: i === 0 ? -15 : 15, // dynamically throw them in
          duration: 1.5,
          ease: "back.out(1.2)",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative py-32 px-4 text-center bg-[#1a1714]">
      <div className="mb-12 text-center relative z-10">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#f4f1ea]/60 mb-4">Mempelai</h2>
        <div className="h-[1px] w-8 bg-[#f4f1ea]/20 mx-auto" />
      </div>

      {/* Untidy Overlapping Container */}
      <div className="relative flex flex-col w-full max-w-sm mx-auto items-center pb-12 z-10 mt-8">
        
        {/* Groom Polaroid (Top Layer, so text is never covered) */}
        <div className="reveal-couple w-[85%] relative bg-[#f4f1ea] p-4 pb-12 shadow-[15px_15px_35px_rgba(0,0,0,0.9)] -rotate-3 z-30 self-start mr-8">
          <Tape className="-top-3 left-6 -rotate-2" />
          <Tape className="-bottom-3 right-6 -rotate-6" />
          
          <div className="w-full aspect-[4/5] bg-[#1a1714]/10 mb-5 overflow-hidden">
            <img 
              src={couple.groom.photo} 
              alt={couple.groom.fullName} 
              className="object-cover w-full h-full grayscale contrast-125 sepia-[0.2]"
            />
          </div>
          <h3 className="font-serif text-3xl text-[#1a1714] font-bold mb-1">{couple.groom.fullName}</h3>
          <p className="text-[#1a1714]/60 text-[9px] tracking-widest uppercase mb-1">
            Putra Bpk. {couple.groom.father} <br/>& Ibu {couple.groom.mother}
          </p>
          <p className="text-[#bfae91] text-[10px] tracking-[0.2em] mt-3">{couple.groom.instagram}</p>
        </div>

        {/* Bride Polaroid (Bottom Layer, slides UNDER the groom) */}
        <div className="reveal-couple w-[85%] relative bg-[#f4f1ea] p-4 pb-12 shadow-[0_20px_40px_rgba(0,0,0,0.9)] rotate-3 z-20 self-end ml-8 -mt-24">
          <Tape className="-top-3 right-8 rotate-6" />
          
          <div className="w-full aspect-[4/5] bg-[#1a1714]/10 mb-5 overflow-hidden">
            <img 
              src={couple.bride.photo} 
              alt={couple.bride.fullName} 
              className="object-cover w-full h-full grayscale contrast-125 sepia-[0.2]"
            />
          </div>
          <h3 className="font-serif text-3xl text-[#1a1714] font-bold mb-1">{couple.bride.fullName}</h3>
          <p className="text-[#1a1714]/60 text-[9px] tracking-widest uppercase mb-1">
            Putri Bpk. {couple.bride.father} <br/>& Ibu {couple.bride.mother}
          </p>
          <p className="text-[#bfae91] text-[10px] tracking-[0.2em] mt-3">{couple.bride.instagram}</p>
        </div>
      </div>
    </section>
  );
}
