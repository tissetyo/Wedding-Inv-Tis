"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Tape } from "./ui/Tape";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Gallery({ images }: { images: string[] }) {
  const container = useRef<HTMLDivElement>(null);

  const rotations = ['-rotate-6', 'rotate-3', '-rotate-2', 'rotate-6', '-rotate-3', 'rotate-2'];

  useGSAP(
    () => {
      gsap.from(".gallery-title", {
        scrollTrigger: {
          trigger: ".gallery-title",
          start: "top 85%",
        },
        y: 20,
        opacity: 0,
        duration: 1,
      });

      const polaroids = gsap.utils.toArray(".polaroid-messy");
      polaroids.forEach((polaroid: any, index) => {
        gsap.from(polaroid, {
          scrollTrigger: {
            trigger: polaroid,
            start: "top 85%",
          },
          opacity: 0,
          y: 60,
          rotation: index % 2 === 0 ? -15 : 15,
          duration: 1.5,
          ease: "back.out(1.2)",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-32 px-4 bg-[#1a1714] relative overflow-hidden">
      {/* Background noise matching Couple dark style */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />

      <div className="gallery-title mb-16 text-center relative z-10">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#f4f1ea]/60 mb-4">Galeri Momen</h2>
        <div className="h-[1px] w-8 bg-[#f4f1ea]/20 mx-auto" />
      </div>

      {/* Untidy Overlapping Gallery Container */}
      <div className="relative flex flex-col w-full max-w-sm mx-auto pb-12 z-10 pt-4">
        {images.map((src, idx) => {
          // Dynamic styling for untidy chaos
          const rotClass = rotations[idx % rotations.length];
          const isLeft = idx % 2 === 0;
          const alignClass = isLeft ? 'self-start mr-8' : 'self-end ml-8';
          const marginClass = idx > 0 ? '-mt-24' : '';
          const tapeClass = isLeft ? '-top-3 left-4 rotate-6' : '-top-3 right-4 -rotate-6';
          
          return (
            <div 
              key={idx} 
              className={`polaroid-messy w-[80%] relative bg-[#f4f1ea] p-4 pb-16 shadow-[0_25px_50px_rgba(0,0,0,0.9)] ${alignClass} ${rotClass} ${marginClass}`}
              style={{ zIndex: 10 + idx }} // Stack them neatly higher as we go down
            >
              <Tape className={tapeClass} />
              
              <div className="w-full aspect-[4/5] bg-[#1a1714]/10 mb-4 overflow-hidden border border-[#1a1714]/5">
                <img 
                  src={src} 
                  className="w-full h-full object-cover grayscale contrast-125 sepia-[0.3]"
                  loading="lazy"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
