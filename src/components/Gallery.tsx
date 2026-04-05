"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Gallery({ images }: { images: string[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".gallery-title", {
        scrollTrigger: {
          trigger: ".gallery-title",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 1,
      });

      const photos = gsap.utils.toArray(".gallery-photo");
      photos.forEach((photo: any, index) => {
        gsap.from(photo, {
          scrollTrigger: {
            trigger: photo,
            start: "top 90%",
          },
          scale: 0.9,
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          delay: (index % 2) * 0.2, // Stagger effect for grid
        });
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-24 px-4 text-center">
      <div className="gallery-title mb-12">
        <h2 className="font-serif text-3xl text-white mb-2">Galeri Momen</h2>
        <div className="h-0.5 w-12 bg-pink-300 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {images.map((src, idx) => (
          <div 
            key={idx} 
            className={`gallery-photo rounded-xl overflow-hidden relative ${idx % 3 === 0 ? "col-span-2 aspect-video" : "aspect-square"}`}
          >
            <img 
              src={src} 
              alt={`Gallery ${idx}`} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 grayscale hover:grayscale-0"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
