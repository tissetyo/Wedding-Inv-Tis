"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Events({ events }: { events: ContentData["events"] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".event-card");
      cards.forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 20,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-32 px-6 text-center bg-[#1a1714] relative">
      <div className="mb-20 text-center">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#f4f1ea]/60 mb-4">Acara Pernikahan</h2>
        <div className="h-[1px] w-8 bg-[#f4f1ea]/20 mx-auto" />
      </div>

      <div className="flex flex-col gap-12 items-center">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="event-card border border-[#f4f1ea]/10 w-full max-w-[85%] p-8"
          >
            <h3 className="font-serif text-2xl text-[#f4f1ea] mb-8">{event.title}</h3>
            
            <div className="flex flex-col gap-6 text-[#f4f1ea]/80 text-[11px] uppercase tracking-widest mb-10 w-full">
              <div>
                <p className="text-[#f4f1ea]/40 mb-1 tracking-[0.3em] text-[9px]">Date</p>
                <p>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="w-[1px] h-6 bg-[#f4f1ea]/10 mx-auto" />
              <div>
                <p className="text-[#f4f1ea]/40 mb-1 tracking-[0.3em] text-[9px]">Time</p>
                <p>{event.time}</p>
              </div>
              <div className="w-[1px] h-6 bg-[#f4f1ea]/10 mx-auto" />
              <div>
                <p className="text-[#f4f1ea]/40 mb-1 tracking-[0.3em] text-[9px]">Location</p>
                <p className="mb-1">{event.locationName}</p>
                <p className="text-[#f4f1ea]/50 text-[9px] max-w-[80%] mx-auto">{event.address}</p>
              </div>
            </div>

            <a 
              href={event.mapLink} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block border-b border-[#bfae91]/50 text-[#bfae91] pb-1 text-[9px] tracking-[0.3em] uppercase transition-colors hover:text-[#f4f1ea]"
            >
              View Map
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
