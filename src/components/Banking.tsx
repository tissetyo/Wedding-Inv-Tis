"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Banking({ banking, theme }: { banking: ContentData["banking"]; theme: any }) {
  const container = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useGSAP(
    () => {
      gsap.from(".bank-card", {
        scrollTrigger: {
          trigger: ".bank-card",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 1.2,
        ease: "power2.out"
      });
    },
    { scope: container }
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section 
      ref={container} 
      className="relative py-32 px-6 text-center text-[var(--color-text)] overflow-hidden"
      style={{ backgroundColor: theme?.backgroundColor || "var(--color-bg)" }}
    >
      {/* Background Section Override */}
      {theme?.backgroundType === "image" && theme?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale contrast-125 sepia-[0.2] z-0"
          style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
        />
      )}

      <div className="mb-20 text-center relative z-10">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-current/60 mb-4">Amplop Digital</h2>
        <div className="h-[1px] w-8 bg-current/20 mx-auto" />
      </div>

      <div className="relative z-10 flex flex-col gap-8 items-center">
        {banking.map((bank, idx) => (
          <div 
            key={idx} 
            className="bank-card w-full max-w-sm border-t border-b border-current/10 py-8 px-4 flex flex-col items-center bg-[var(--color-bg)]/20 backdrop-blur-sm"
          >
            <h3 className="text-[10px] font-sans text-current/60 tracking-[0.3em] uppercase mb-4">{bank.bank}</h3>
            <p className="font-serif text-3xl text-current mb-2">{bank.accountNumber}</p>
            <p className="text-[9px] text-current/40 uppercase tracking-widest mb-6">a.n. {bank.accountName}</p>
            
            <button 
              onClick={() => handleCopy(bank.accountNumber)}
              className="bg-transparent border-b border-current/20 text-current/80 pb-1 text-[9px] uppercase tracking-[0.3em] transition-colors hover:text-current hover:border-current"
            >
              {copied === bank.accountNumber ? "Tersalin" : "Salin Rekening"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
