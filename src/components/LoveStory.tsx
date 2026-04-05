"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function LoveStory({ story }: { story: ContentData["loveStory"] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".story-header", {
        scrollTrigger: {
          trigger: ".story-header",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
      });

      const lines = gsap.utils.toArray(".timeline-line");
      lines.forEach((line: any) => {
         gsap.from(line, {
            scrollTrigger: {
              trigger: line,
              start: "top 60%",
            },
            height: 0,
            duration: 1,
            ease: "power2.out"
         });
      });

      const cards = gsap.utils.toArray(".story-card");
      cards.forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
          x: -30,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.2)"
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-24 px-6 relative bg-zinc-950">
      <div className="story-header text-center mb-16">
        <h2 className="font-serif text-3xl text-white mb-2">Cerita Cinta Kami</h2>
        <div className="h-0.5 w-12 bg-pink-300 mx-auto rounded-full" />
      </div>

      <div className="relative pl-6 border-l border-white/20 ml-2 space-y-12">
        {story.map((item, idx) => (
          <div key={idx} className="story-card relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-pink-300 shadow-[0_0_10px_rgba(244,114,182,0.5)] border-4 border-zinc-950" />
            
            <span className="text-pink-300 font-bold text-sm tracking-widest">{item.year}</span>
            <h3 className="font-serif text-xl text-white mt-1 mb-2">{item.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
