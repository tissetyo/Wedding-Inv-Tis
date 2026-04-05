"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, MessageCircleHeart } from "lucide-react";
import { Tape } from "./ui/Tape";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Wish {
  id: string;
  name: string;
  attendance: string;
  message: string;
  date: string;
}

export default function RSVP() {
  const container = useRef<HTMLDivElement>(null);
  
  const [wishes, setWishes] = useState<Wish[]>([
    { id: "1", name: "Budi Santoso", attendance: "hadir", message: "Selamat menempuh hidup baru! Semoga samawa selalu bersama selamanya.", date: "2 jam lalu" },
    { id: "2", name: "Keluarga Handoko", attendance: "hadir", message: "Lancar sampai hari H. Doa terbaik untuk kalian berdua ya.", date: "5 jam lalu" }
  ]);

  const [formData, setFormData] = useState({ name: "", attendance: "hadir", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useGSAP(
    () => {
      gsap.from(".rsvp-anim", {
        scrollTrigger: {
          trigger: ".rsvp-anim",
          start: "top 80%",
        },
        y: 60,
        rotation: 2,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
      });
    },
    { scope: container }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWish: Wish = {
      id: Date.now().toString(),
      ...formData,
      date: "Baru saja"
    };
    setWishes([newWish, ...wishes]);
    setIsSubmitted(true);
    setFormData({ name: "", attendance: "hadir", message: "" });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section ref={container} className="py-24 px-6 relative bg-[#151210] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/dust.png')" }} />

      <div className="text-center mb-16 rsvp-anim relative z-10">
        <h2 className="font-serif text-3xl text-[#EAE0C8] mb-2 tracking-wider">Kehadiran & Ucapan</h2>
        <div className="h-0.5 w-12 bg-[#D4AF37] mx-auto rounded-full" />
      </div>

      {/* WISHES LIST (Appears above the form) */}
      <div className="rsvp-anim mb-16 max-h-96 overflow-y-auto pr-2 space-y-6 relative z-10">
        {wishes.map((wish, idx) => (
          <div key={wish.id} className={`bg-[#f4f1ea] border border-black/10 p-6 relative shadow-[0_10px_20px_rgba(0,0,0,0.4)] ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} mx-2`}>
            {/* Tapes */}
            <Tape className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[2deg] opacity-60" />
            
            <div className="flex items-center justify-between mb-3 border-b border-dashed border-[#8B7120]/30 pb-2">
              <h4 className="font-serif text-xl font-bold text-[#1a1714] flex items-center gap-2 italic">
                <MessageCircleHeart size={18} className="text-[#8B7120]" /> {wish.name}
              </h4>
              <span className="text-[10px] uppercase tracking-widest text-[#1a1714]/40 font-bold">{wish.date}</span>
            </div>
            <p className="text-sm text-[#1a1714]/80 font-serif leading-relaxed mb-4">"{wish.message}"</p>
            <div className="inline-block px-4 py-1 border border-[#8B7120] text-[10px] uppercase tracking-widest text-[#8B7120] font-bold">
              {wish.attendance === "hadir" ? "✅ Akan Hadir" : wish.attendance === "tidak-hadir" ? "❌ Tidak Hadir" : "❔ Masih Ragu"}
            </div>
          </div>
        ))}
      </div>

      {/* RSVP FORM */}
      <div className="rsvp-anim bg-[#f4f1ea] border border-black/10 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10 w-full max-w-lg mx-auto rotate-1">
        
        {/* Tapes */}
        <Tape className="-top-3 -left-3 -rotate-45" />
        <Tape className="-top-3 -right-3 rotate-45" />

        {isSubmitted ? (
          <div className="text-center py-16 text-[#1a1714] relative z-10 border border-dashed border-[#8B7120]/30">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#8B7120] text-[#8B7120] mb-4">
              <Send size={24} className="-ml-1" />
            </div>
            <h3 className="font-serif text-3xl mb-2 italic">Terima Kasih!</h3>
            <p className="text-[#1a1714]/60 text-sm font-serif">Pesan Anda telah ditambahkan ke dinding ucapan.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-[#1a1714] text-sm relative z-10">
            <div>
              <label className="block text-[#1a1714]/70 mb-2 font-serif text-xl italic">Nama Surat</label>
              <input 
                required 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[#EAE0C8] border-b-2 border-[#1a1714]/20 p-3 outline-none focus:border-[#8B7120] transition font-serif text-lg italic" 
                placeholder="Tulis nama Anda" 
              />
            </div>
            
            <div>
              <label className="block text-[#1a1714]/70 mb-2 font-serif text-xl italic">Kehadiran</label>
              <select 
                value={formData.attendance}
                onChange={e => setFormData({...formData, attendance: e.target.value})}
                className="w-full bg-[#EAE0C8] border-b-2 border-[#1a1714]/20 p-3 outline-none focus:border-[#8B7120] transition appearance-none font-serif text-lg italic"
              >
                <option value="hadir">Hadir</option>
                <option value="tidak-hadir">Tidak Hadir</option>
                <option value="ragu">Masih Ragu</option>
              </select>
            </div>

            <div>
              <label className="block text-[#1a1714]/70 mb-2 font-serif text-xl italic">Pesan & Doa</label>
              <textarea 
                required 
                rows={4} 
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[#EAE0C8] border-b-2 border-[#1a1714]/20 p-3 outline-none focus:border-[#8B7120] transition resize-none font-serif text-lg italic" 
                placeholder="Berikan doa & ucapan terbaik Anda..." 
              />
            </div>

            <button type="submit" className="mt-6 w-full py-4 border-2 border-[#1a1714] hover:bg-[#1a1714] text-[#1a1714] hover:text-[#EAE0C8] font-bold tracking-widest uppercase transition-colors flex justify-center items-center gap-2">
              Kirim Pesan
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
