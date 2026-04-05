"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Tape Component
const Tape = ({ className }: { className?: string }) => (
  <div 
    className={`absolute w-16 h-5 bg-[#e5ca93] opacity-80 shadow-md ${className}`} 
    style={{ mixBlendMode: "multiply", zIndex: 10 }} 
  />
);

export default function Gallery({ images }: { images: string[] }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Intro Text Animation
      gsap.from(".gallery-title", {
        scrollTrigger: {
          trigger: ".gallery-title",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
      });

      // Scatter Animation for Polaroids
      const polaroids = gsap.utils.toArray(".polaroid");
      polaroids.forEach((polaroid: any, index) => {
        // Randomize the initial scatter state
        const randomRotate = gsap.utils.random(-15, 15);
        const randomX = gsap.utils.random(-50, 50);
        
        gsap.fromTo(polaroid, 
          { 
            opacity: 0, 
            scale: 0.8, 
            rotation: 0,
            x: randomX,
            y: 100 
          },
          {
            scrollTrigger: {
              trigger: polaroid,
              start: "top 85%",
            },
            opacity: 1,
            scale: 1,
            rotation: randomRotate,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "back.out(1.2)",
            delay: index * 0.1,
          }
        );
      });

      // Film strip fade in
      gsap.from(".film-strip", {
        scrollTrigger: {
          trigger: ".film-strip",
          start: "top 80%",
        },
        x: -50,
        opacity: 0,
        duration: 1.2,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-24 px-4 overflow-hidden relative">
      <div className="gallery-title text-center mb-16 relative z-10">
        <h2 className="font-serif text-4xl text-white mb-2 tracking-wide">Cinematic Memories</h2>
        <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto rounded-full" />
      </div>

      <div className="flex flex-col gap-12 relative w-full items-center">
        
        {/* POLAROIDS COLLAGE */}
        <div className="w-full relative flex flex-wrap justify-center gap-6 px-4">
          {images.slice(0, 3).map((src, idx) => (
            <div 
              key={idx} 
              className="polaroid relative bg-[#f4f1ea] p-3 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[45%]"
            >
              {/* Tape variations */}
              {idx % 2 === 0 ? (
                <Tape className="-top-2 -left-2 -rotate-[20deg]" />
              ) : (
                <Tape className="-top-2 left-1/2 -translate-x-1/2 rotate-[5deg]" />
              )}
              {idx === 2 && <Tape className="-bottom-2 -right-2 -rotate-[15deg]" />}
              
              <div className="w-full aspect-[3/4] overflow-hidden border border-black/10 bg-black">
                <img 
                  src={src} 
                  alt="Memory" 
                  className="w-full h-full object-cover sepia-[0.3] contrast-125 grayscale-[0.2]"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* FILM STRIP SECTION */}
        <div className="w-[120%] -ml-[10%] film-strip my-8 shadow-2xl relative rotate-2">
          {/* Film strip holes pattern top and bottom */}
          <div 
            className="w-full h-[15px]" 
            style={{ 
              backgroundImage: "radial-gradient(circle, #f4f1ea 4px, transparent 4px)", 
              backgroundSize: "20px 15px", 
              backgroundPosition: "center top",
              backgroundRepeat: "repeat-x" 
            }} 
          />
          
          <div className="w-full bg-[#111] p-3 flex gap-4 overflow-x-hidden border-t-2 border-b-2 border-[#111]">
            {images.slice(3, 6).map((src, idx) => (
              <div key={idx} className="w-1/2 shrink-0 aspect-[4/3] bg-black">
                <img 
                  src={src} 
                  alt="Film frame" 
                  className="w-full h-full object-cover sepia-[0.5] contrast-150 grayscale-[0.3]"
                />
              </div>
            ))}
          </div>

          <div 
            className="w-full h-[15px]" 
            style={{ 
              backgroundImage: "radial-gradient(circle, #f4f1ea 4px, transparent 4px)", 
              backgroundSize: "20px 15px", 
              backgroundPosition: "center bottom",
              backgroundRepeat: "repeat-x" 
            }} 
          />
        </div>
        
        {/* Final large polaroid */}
        {images.length > 6 && (
          <div className="polaroid relative bg-[#f4f1ea] p-4 pb-16 shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-[80%] mt-8">
            <Tape className="-top-3 -right-3 rotate-[30deg]" />
            <Tape className="-bottom-3 -left-3 rotate-[45deg]" />
            <div className="w-full aspect-square overflow-hidden border border-black/10 bg-black">
              <img 
                src={images[6]} 
                alt="Memory" 
                className="w-full h-full object-cover sepia-[0.4] contrast-125"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
