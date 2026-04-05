"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Copy, CheckCircle2 } from "lucide-react";
import { ContentData } from "@/types";
import { Tape } from "./ui/Tape";

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
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: "back.out(1.2)"
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
    <section ref={container} className="py-24 px-6 text-center bg-[#151210] relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />
      
      <div className="mb-16 relative z-10">
        <h2 className="font-serif text-3xl text-[#EAE0C8] mb-2 tracking-wider">Amplop Digital</h2>
        <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto rounded-full mb-6" />
        <p className="text-[#EAE0C8]/60 text-sm font-serif italic max-w-sm mx-auto">
          Bagi keluarga dan sahabat yang ingin memberikan tanda kasih, dapat melalui rekening berikut:
        </p>
      </div>

      <div className="flex flex-col gap-10 items-center relative z-10">
        {banking.map((bank, idx) => (
          <div 
            key={idx} 
            className={`bank-card bg-[#f4f1ea] w-[85%] max-w-sm p-8 text-center relative shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-[#1a1714]/10 ${idx % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
          >
            {/* Tapes on opposite corners */}
            {idx % 2 === 0 ? (
              <Tape className="-top-3 -left-3 -rotate-45" />
            ) : (
              <Tape className="-bottom-3 -right-3 -rotate-45" />
            )}

            <div className="border border-dashed border-[#8B7120]/40 p-4">
              <h3 className="text-xl font-bold font-serif text-[#1a1714] tracking-widest uppercase mb-1">{bank.bank}</h3>
              <p className="font-sans text-2xl text-[#8B7120] font-light tracking-widest my-2">{bank.accountNumber}</p>
              <p className="text-xs text-[#1a1714]/60 mb-6 uppercase tracking-widest font-bold">a.n. {bank.accountName}</p>
              
              <button 
                onClick={() => handleCopy(bank.accountNumber)}
                className="w-full flex items-center justify-center gap-2 text-xs bg-[#1a1714] hover:bg-[#D4AF37] text-[#EAE0C8] hover:text-[#1a1714] px-4 py-3 uppercase tracking-widest font-bold transition-colors"
              >
                {copied === bank.accountNumber ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied === bank.accountNumber ? "Tersalin!" : "Salin Rekening"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
