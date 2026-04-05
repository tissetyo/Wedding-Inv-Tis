"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";
import { MapPin, Calendar, Clock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Events({ events }: { events: ContentData["events"] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".event-card");
      cards.forEach((card: any, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          x: index % 2 === 0 ? -50 : 50,
          opacity: 0,
          rotation: index % 2 === 0 ? -5 : 5,
          duration: 1,
          ease: "power3.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-24 px-6 text-center bg-[#151210] relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />
      
      <h2 className="font-serif text-4xl text-[#EAE0C8] mb-2 relative z-10">Acara Pernikahan</h2>
      <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto rounded-full mb-12 relative z-10" />

      <div className="flex flex-col gap-12 relative z-10 items-center">
        {events.map((event, index) => (
          <div 
            key={event.id} 
            className={`event-card bg-[#e6dbcc] w-full max-w-[90%] p-1 relative shadow-[0_15px_30px_rgba(0,0,0,0.8)] ${index % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]'}`}
          >
            {/* Ticket jagged edge styling simulation using radial gradients */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-[#151210] rounded-full" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-[#151210] rounded-full" />

            <div className="border border-dashed border-[#8B7120]/50 p-6 flex flex-col items-center">
              <span className="text-[#8B7120] font-sans tracking-[0.3em] uppercase text-[10px] mb-2 font-bold top-2">
                Admit One
              </span>
              
              <h3 className="font-serif text-3xl text-[#1a1714] font-bold mb-6 italic">{event.title}</h3>
              
              <div className="flex flex-col gap-4 text-[#1a1714]/80 text-sm mb-8 w-full border-t border-b border-dashed border-[#8B7120]/30 py-4">
                <div className="flex items-center justify-center gap-3 w-full">
                  <Calendar size={16} className="text-[#8B7120]" />
                  <p className="font-serif font-bold">{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center justify-center gap-3 w-full">
                  <Clock size={16} className="text-[#8B7120]" />
                  <p className="font-serif font-bold">{event.time}</p>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 w-full mt-2">
                  <MapPin size={16} className="text-[#8B7120] mb-1" />
                  <p className="font-bold font-serif text-[#1a1714] text-center">{event.locationName}</p>
                  <p className="text-[#1a1714]/60 text-[10px] uppercase tracking-widest text-center mt-1 max-w-[80%]">{event.address}</p>
                </div>
              </div>

              {/* Barcode simulation */}
              <div className="w-full h-8 mb-4 opacity-40 flex justify-center overflow-hidden" style={{ backgroundImage: "repeating-linear-gradient(to right, #000 0, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 5px, transparent 5px, transparent 8px)" }} />

              <a 
                href={event.mapLink} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-3 rounded border border-[#8B7120] text-[#8B7120] font-bold text-xs uppercase tracking-widest hover:bg-[#8B7120] hover:text-[#e6dbcc] transition-colors"
              >
                Cek Peta Lokasi
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
