"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero({ data }: { data: ContentData }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Background parallax effect
      gsap.to(".hero-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text fade up when not in splash
      gsap.from(".hero-content", {
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-end pb-24 px-6 text-center">
      <div 
        className="hero-bg absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.hero.backgroundImage})` }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />
      
      <div className="hero-content z-10 w-full">
        <h2 className="text-pink-300 tracking-[0.2em] uppercase text-xs mb-4">
          {data.hero.title}
        </h2>
        <h1 className="font-serif text-6xl text-white leading-tight mb-6 drop-shadow-lg">
          {data.hero.groomName}<br />
          <span className="text-3xl italic font-light font-sans text-pink-300">&</span><br />
          {data.hero.brideName}
        </h1>
        <p className="text-white/80 font-serif text-lg tracking-widest uppercase border-t border-b border-white/20 py-3 mx-auto max-w-[200px]">
          {new Date(data.hero.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </section>
  );
}
