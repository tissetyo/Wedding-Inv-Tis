"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";
import { FilmStrip } from "./ui/FilmStrip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function LoveStory({ story }: { story: ContentData["loveStory"] }) {
  const container = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      let panels = gsap.utils.toArray(".story-frame");
      
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + (slider.current?.offsetWidth || window.innerWidth * 2),
        }
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="h-screen w-full relative bg-[#1a1714] overflow-hidden flex flex-col justify-center">
      
      <div className="absolute top-32 left-0 w-full text-center z-10">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#f4f1ea]/60 mb-4">Cerita Cinta</h2>
        <div className="h-[1px] w-8 bg-[#f4f1ea]/20 mx-auto" />
      </div>

      {/* Minimalist Horizontal Film Reel */}
      <FilmStrip className="mt-8 relative z-20">
        <div ref={slider} className="flex w-[300vw]">
          {story.map((item, idx) => (
            <div 
              key={idx} 
              className="story-frame w-screen h-64 flex items-center justify-center px-8 border-r border-[#f4f1ea]/5"
            >
              <div className="text-center px-4 max-w-sm">
                 <span className="text-[#bfae91] font-sans text-[9px] tracking-[0.3em] uppercase mb-4 block">{item.year}</span>
                 <h3 className="font-serif text-2xl text-[#f4f1ea] mb-4">{item.title}</h3>
                 <p className="text-[#f4f1ea]/60 text-xs leading-relaxed font-sans">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </FilmStrip>

      <div className="absolute bottom-12 left-0 w-full text-center z-10">
        <p className="text-[9px] tracking-[0.3em] uppercase text-[#f4f1ea]/30">Scroll</p>
      </div>
    </section>
  );
}
