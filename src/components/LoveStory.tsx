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
    <section ref={container} className="h-screen w-full relative bg-[#151210] overflow-hidden flex flex-col justify-center">
      
      <div className="absolute top-24 left-0 w-full text-center z-10">
        <h2 className="font-serif text-3xl text-[#EAE0C8] mb-2 tracking-widest">Cerita Cinta</h2>
        <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto rounded-full" />
      </div>

      {/* The Horizontal Film Reel */}
      <div 
        ref={slider} 
        className="flex h-full items-center mt-8 w-[300vw] bg-[#111]"
      >
        {/* Film Top Holes - continuous across track */}
        <div 
          className="absolute top-[20%] left-0 w-[400vw] h-[20px] z-20"
          style={{ 
            backgroundImage: "radial-gradient(circle, #EAE0C8 6px, transparent 6px)", 
            backgroundSize: "30px 20px", 
            backgroundPosition: "center top",
            backgroundRepeat: "repeat-x" 
          }} 
        />

        {story.map((item, idx) => (
          <div 
            key={idx} 
            className="story-frame w-screen h-[60%] flex items-center justify-center px-8 relative border-r-4 border-l-4 border-dashed border-[#EAE0C8]/20"
          >
            {/* The individual vintage frame */}
            <div className="bg-[#f4f1ea] p-4 relative shadow-[0_0_30px_rgba(0,0,0,0.9)] w-[85%] max-w-sm aspect-video flex items-center justify-center -rotate-2">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
              
              <div className="border border-black/20 w-full h-full p-6 flex flex-col justify-center text-center bg-[#EAE0C8]">
                 <span className="text-[#655215] font-bold text-sm tracking-widest mb-1 font-serif">{item.year}</span>
                 <h3 className="font-serif text-2xl text-[#1a1714] mb-3 italic">{item.title}</h3>
                 <p className="text-[#1a1714]/70 text-xs leading-relaxed font-sans">{item.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Film Bottom Holes - continuous across track */}
        <div 
          className="absolute bottom-[20%] left-0 w-[400vw] h-[20px] z-20"
          style={{ 
            backgroundImage: "radial-gradient(circle, #EAE0C8 6px, transparent 6px)", 
            backgroundSize: "30px 20px", 
            backgroundPosition: "center bottom",
            backgroundRepeat: "repeat-x" 
          }} 
        />
      </div>

      <div className="absolute bottom-6 left-0 w-full text-center z-10 animate-pulse">
        <p className="text-[10px] tracking-widest uppercase text-[#D4AF37]">Geser untuk memutar rol film</p>
      </div>
    </section>
  );
}
