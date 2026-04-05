"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Wish { id: string; name: string; attendance: string; message: string; date: string; }

export default function RSVP() {
  const container = useRef<HTMLDivElement>(null);
  
  const [wishes, setWishes] = useState<Wish[]>([
    { id: "1", name: "Budi Santoso", attendance: "hadir", message: "Selamat menempuh hidup baru!", date: "2 jam lalu" },
  ]);

  const [formData, setFormData] = useState({ name: "", attendance: "hadir", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useGSAP(
    () => {
      gsap.from(".rsvp-anim", {
        scrollTrigger: { trigger: ".rsvp-anim", start: "top 85%" },
        y: 20, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power2.out"
      });
    },
    { scope: container }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWish: Wish = { id: Date.now().toString(), ...formData, date: "Baru saja" };
    setWishes([newWish, ...wishes]);
    setIsSubmitted(true);
    setFormData({ name: "", attendance: "hadir", message: "" });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section ref={container} className="py-32 px-6 bg-[#1a1714]">
      <div className="mb-20 text-center rsvp-anim">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#f4f1ea]/60 mb-4">Kehadiran</h2>
        <div className="h-[1px] w-8 bg-[#f4f1ea]/20 mx-auto" />
      </div>

      <div className="rsvp-anim mb-20 max-h-64 overflow-y-auto space-y-6 max-w-sm mx-auto">
        {wishes.map((wish) => (
          <div key={wish.id} className="border-b border-[#f4f1ea]/5 pb-4">
            <div className="flex justify-between items-end mb-2">
              <h4 className="font-serif text-lg text-[#f4f1ea]">{wish.name}</h4>
              <span className="text-[8px] uppercase tracking-widest text-[#f4f1ea]/30">{wish.date}</span>
            </div>
            <p className="text-sm text-[#f4f1ea]/60 font-sans mb-3">{wish.message}</p>
          </div>
        ))}
      </div>

      <div className="rsvp-anim w-full max-w-sm mx-auto">
        {isSubmitted ? (
          <div className="text-center py-12 border border-[#f4f1ea]/10">
            <h3 className="font-serif text-2xl text-[#f4f1ea] mb-2">Terima Kasih</h3>
            <p className="text-[#f4f1ea]/50 text-xs">Pesan Anda telah dikirim.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-[#f4f1ea]">
            <input 
              required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent border-b border-[#f4f1ea]/20 py-2 outline-none focus:border-[#bfae91] font-sans text-sm" placeholder="Nama" 
            />
            <select 
              value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})}
              className="w-full bg-transparent border-b border-[#f4f1ea]/20 py-2 outline-none focus:border-[#bfae91] font-sans text-sm appearance-none rounded-none"
            >
              <option value="hadir" className="bg-[#1a1714]">Hadir</option>
              <option value="tidak-hadir" className="bg-[#1a1714]">Tidak Hadir</option>
            </select>
            <textarea 
              required rows={2} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-transparent border-b border-[#f4f1ea]/20 py-2 outline-none focus:border-[#bfae91] resize-none font-sans text-sm" placeholder="Pesan" 
            />
            <button type="submit" className="mt-4 border border-[#f4f1ea]/20 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#f4f1ea]/5 transition-colors">
              Kirim
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
