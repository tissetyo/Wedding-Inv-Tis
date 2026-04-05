"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Couple({ couple }: { couple: ContentData["couple"] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray(".reveal-couple");
      elements.forEach((el: any) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative py-24 px-6 text-center">
      <div className="reveal-couple mb-16">
        <h2 className="font-serif text-3xl text-white mb-2">Mempelai</h2>
        <div className="h-0.5 w-12 bg-pink-300 mx-auto rounded-full" />
      </div>

      <div className="flex flex-col gap-16">
        {/* Groom */}
        <div className="reveal-couple flex flex-col items-center">
          <div className="w-48 h-48 rounded-t-full overflow-hidden mb-6 border border-white/10 shadow-lg relative">
            <img 
              src={couple.groom.photo} 
              alt={couple.groom.fullName} 
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-serif text-2xl text-white">{couple.groom.fullName}</h3>
          <p className="text-white/60 text-sm mt-2 leading-relaxed">
            Putra dari<br />
            {couple.groom.father} & {couple.groom.mother}
          </p>
          <a href="#" className="mt-3 text-pink-300 text-sm">{couple.groom.instagram}</a>
        </div>

        <div className="reveal-couple font-serif text-4xl italic text-white/30">&</div>

        {/* Bride */}
        <div className="reveal-couple flex flex-col items-center">
          <div className="w-48 h-48 rounded-t-full overflow-hidden mb-6 border border-white/10 shadow-lg relative">
            <img 
              src={couple.bride.photo} 
              alt={couple.bride.fullName} 
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          <h3 className="font-serif text-2xl text-white">{couple.bride.fullName}</h3>
          <p className="text-white/60 text-sm mt-2 leading-relaxed">
            Putri dari<br />
            {couple.bride.father} & {couple.bride.mother}
          </p>
          <a href="#" className="mt-3 text-pink-300 text-sm">{couple.bride.instagram}</a>
        </div>
      </div>
    </section>
  );
}
