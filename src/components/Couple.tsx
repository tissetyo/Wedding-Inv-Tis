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
      elements.forEach((el: any, index) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
          y: 60,
          rotation: index % 2 === 0 ? -10 : 10,
          opacity: 0,
          duration: 1.5,
          ease: "back.out(1.2)",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative py-24 px-6 text-center overflow-hidden">
      <div className="reveal-couple mb-16 relative z-10">
        <h2 className="font-serif text-4xl text-[#EAE0C8] mb-2">Mempelai</h2>
        <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto rounded-full" />
      </div>

      <div className="flex flex-col gap-20 items-center">
        {/* Groom Polaroid */}
        <div className="reveal-couple w-[75%] relative bg-[#f4f1ea] p-3 pb-16 shadow-[0_20px_40px_rgba(0,0,0,0.8)] -rotate-3">
          <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-[5deg]" />
          
          <div className="w-full aspect-[3/4] border border-black/10 overflow-hidden bg-black mb-6">
            <img 
              src={couple.groom.photo} 
              alt={couple.groom.fullName} 
              className="object-cover w-full h-full sepia-[0.3] contrast-125 grayscale-[0.2]"
            />
          </div>
          <h3 className="font-serif text-3xl text-[#1a1714] font-bold">{couple.groom.fullName}</h3>
          <p className="text-[#1a1714]/70 text-xs mt-2 font-serif italic">
            Putra dari<br />
            {couple.groom.father} & {couple.groom.mother}
          </p>
          <p className="mt-3 text-[#AA8C2C] text-[10px] uppercase tracking-widest font-bold">{couple.groom.instagram}</p>
        </div>

        <div className="reveal-couple font-serif text-6xl text-[#D4AF37]/50 italic">&</div>

        {/* Bride Polaroid */}
        <div className="reveal-couple w-[75%] relative bg-[#f4f1ea] p-3 pb-16 shadow-[0_20px_40px_rgba(0,0,0,0.8)] rotate-2">
          <Tape className="-top-3 -right-2 rotate-[45deg]" />
          <Tape className="-bottom-3 -left-2 rotate-[25deg]" />

          <div className="w-full aspect-[3/4] border border-black/10 overflow-hidden bg-black mb-6">
            <img 
              src={couple.bride.photo} 
              alt={couple.bride.fullName} 
              className="object-cover w-full h-full sepia-[0.3] contrast-125 grayscale-[0.2]"
            />
          </div>
          <h3 className="font-serif text-3xl text-[#1a1714] font-bold">{couple.bride.fullName}</h3>
          <p className="text-[#1a1714]/70 text-xs mt-2 font-serif italic">
            Putri dari<br />
            {couple.bride.father} & {couple.bride.mother}
          </p>
          <p className="mt-3 text-[#AA8C2C] text-[10px] uppercase tracking-widest font-bold">{couple.bride.instagram}</p>
        </div>
      </div>
    </section>
  );
}
