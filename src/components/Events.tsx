"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData, EventConfig } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Events({ events, theme }: { events: EventConfig[]; theme: any }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray(".reveal-event");
      elements.forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-20 px-6">
      <div className="mb-20 text-center">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--color-text)]/60 mb-4">Acara Pernikahan</h2>
        <div className="h-[1px] w-8 bg-[var(--color-text)]/20 mx-auto" />
      </div>

      <div className="flex flex-col gap-12 items-center">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="reveal-event border border-[var(--color-text)]/10 w-full max-w-[85%] p-8 bg-[var(--color-bg)]/50 backdrop-blur-sm"
          >
            <h3 className="font-serif text-2xl text-[#f4f1ea] mb-8">{event.title}</h3>
            
            <div className="flex flex-col gap-6 text-[#f4f1ea]/80 text-[11px] uppercase tracking-widest mb-10 w-full">
              <div>
                <p className="text-[#f4f1ea]/40 mb-1 tracking-[0.3em] text-[9px]">Date</p>
                <p>{(() => { const d = new Date(event.date); return isNaN(d.getTime()) ? 'Segera diumumkan' : d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); })()}</p>
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

            {event.mapLink && (
              <a 
                href={event.mapLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block border-b border-[#bfae91]/50 text-[#bfae91] pb-1 text-[9px] tracking-[0.3em] uppercase transition-colors hover:text-[#f4f1ea]"
              >
                Lihat Maps →
              </a>
            )}

            {(event.locationName || event.address) && (
              <div className="mt-8 w-full overflow-hidden border border-[var(--color-text)]/10 opacity-70">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent((event.locationName || '') + ', ' + (event.address || ''))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-44 border-0 grayscale contrast-125 sepia-[0.2]"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map - ${event.title}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
