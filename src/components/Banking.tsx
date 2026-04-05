"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Copy, CheckCircle2 } from "lucide-react";
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
          start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.5)"
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
    <section ref={container} className="py-24 px-6 text-center">
      <div className="mb-12">
        <h2 className="font-serif text-3xl text-white mb-2">Amplop Digital</h2>
        <div className="h-0.5 w-12 bg-pink-300 mx-auto rounded-full mb-4" />
        <p className="text-white/60 text-sm">Bagi keluarga dan sahabat yang ingin memberikan tanda kasih, dapat melalui rekening berikut:</p>
      </div>

      <div className="flex flex-col gap-6">
        {banking.map((bank, idx) => (
          <div key={idx} className="bank-card bg-zinc-900 border border-white/10 rounded-2xl p-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/5 rounded-bl-full" />
            <h3 className="text-lg font-semibold text-white">{bank.bank}</h3>
            <p className="font-mono text-xl text-pink-300 my-2 tracking-wider">{bank.accountNumber}</p>
            <p className="text-sm text-white/50 mb-4">a.n. {bank.accountName}</p>
            
            <button 
              onClick={() => handleCopy(bank.accountNumber)}
              className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition"
            >
              {copied === bank.accountNumber ? <CheckCircle2 size={16} className="text-pink-300" /> : <Copy size={16} />}
              {copied === bank.accountNumber ? "Tersalin!" : "Salin Rekening"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
