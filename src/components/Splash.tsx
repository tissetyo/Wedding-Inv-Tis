"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MailOpen } from "lucide-react";
import { HeroConfig } from "@/types";

gsap.registerPlugin(useGSAP);

export default function Splash({
  hero,
  onOpen,
}: {
  hero: HeroConfig;
  onOpen: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useGSAP(
    () => {
      // Reveal animation on mount
      gsap.from(".splash-text", {
        y: 20,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2,
      });

      if (isOpen) {
        gsap.to(container.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            onOpen();
            if (container.current) container.current.style.display = "none";
          },
        });
      }
    },
    { dependencies: [isOpen], scope: container }
  );

  return (
    <div
      ref={container}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-cover bg-center text-white origin-bottom"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4)), url(${hero.backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <p className="splash-text text-sm uppercase tracking-[0.3em] text-white/70 mb-4">
          {hero.title}
        </p>
        <h1 className="splash-text font-serif text-5xl mb-6">
          {hero.groomName} <span className="font-sans text-3xl font-light italic text-pink-300">&</span> {hero.brideName}
        </h1>
        
        <button
          onClick={() => setIsOpen(true)}
          className="splash-text mt-8 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm backdrop-blur-md transition-colors hover:bg-white/20"
        >
          <MailOpen size={16} />
          Buka Undangan
        </button>
      </div>
    </div>
  );
}
