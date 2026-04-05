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
      cards.forEach((card: any) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-24 px-6 text-center bg-zinc-950">
      <h2 className="font-serif text-3xl text-white mb-2">Acara Pernikahan</h2>
      <div className="h-0.5 w-12 bg-pink-300 mx-auto rounded-full mb-12" />

      <div className="flex flex-col gap-8">
        {events.map((event) => (
          <div 
            key={event.id} 
            className="event-card bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
            
            <h3 className="font-serif text-2xl text-pink-300 mb-6">{event.title}</h3>
            
            <div className="flex flex-col gap-4 text-white/80 text-sm mb-8 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/5"><Calendar size={18} /></div>
                <p>{new Date(event.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/5"><Clock size={18} /></div>
                <p>{event.time}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-white/5 shrink-0"><MapPin size={18} /></div>
                <div>
                  <p className="font-semibold text-white">{event.locationName}</p>
                  <p className="text-white/60 text-xs mt-1">{event.address}</p>
                </div>
              </div>
            </div>

            <a 
              href={event.mapLink} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block w-full py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition"
            >
              Lihat Peta Lokasi
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
