"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContentData } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Banking({ banking }: { banking: ContentData["banking"] }) {
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
    <section ref={container} className="py-32 px-6 text-center bg-[#f4f1ea]">
      <div className="mb-20 text-center">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#1a1714]/60 mb-4">Amplop Digital</h2>
        <div className="h-[1px] w-8 bg-[#1a1714]/20 mx-auto" />
      </div>

      <div className="flex flex-col gap-8 items-center">
        {banking.map((bank, idx) => (
          <div 
            key={idx} 
            className="bank-card w-full max-w-sm border-t border-b border-[#1a1714]/10 py-8 px-4 flex flex-col items-center"
          >
            <h3 className="text-[10px] font-sans text-[#1a1714]/60 tracking-[0.3em] uppercase mb-4">{bank.bank}</h3>
            <p className="font-serif text-3xl text-[#1a1714] mb-2">{bank.accountNumber}</p>
            <p className="text-[9px] text-[#1a1714]/40 uppercase tracking-widest mb-6">a.n. {bank.accountName}</p>
            
            <button 
              onClick={() => handleCopy(bank.accountNumber)}
              className="bg-transparent border-b border-[#1a1714]/20 text-[#1a1714]/80 pb-1 text-[9px] uppercase tracking-[0.3em] transition-colors hover:text-[#1a1714] hover:border-[#1a1714]"
            >
              {copied === bank.accountNumber ? "Tersalin" : "Salin Rekening"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
