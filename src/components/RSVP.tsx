"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function RSVP() {
  const container = useRef<HTMLDivElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useGSAP(
    () => {
      gsap.from(".rsvp-form", {
        scrollTrigger: {
          trigger: ".rsvp-form",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    },
    { scope: container }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section ref={container} className="py-24 px-6 relative bg-zinc-950">
      <div className="text-center mb-12">
        <h2 className="font-serif text-3xl text-white mb-2">Kehadiran & Ucapan</h2>
        <div className="h-0.5 w-12 bg-pink-300 mx-auto rounded-full" />
      </div>

      <div className="rsvp-form bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
        {isSubmitted ? (
          <div className="text-center py-12 text-white">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-500/20 text-pink-300 mb-4">
              <Send size={24} />
            </div>
            <h3 className="font-serif text-2xl mb-2">Terima Kasih!</h3>
            <p className="text-white/60 text-sm">Pesan dan konfirmasi kehadiran Anda telah kami terima.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white text-sm">
            <div>
              <label className="block text-white/70 mb-1">Nama Lengkap</label>
              <input required type="text" className="w-full bg-black/50 border border-white/20 rounded-lg p-3 outline-none focus:border-pink-300 transition" placeholder="Tulis nama Anda" />
            </div>
            
            <div>
              <label className="block text-white/70 mb-1">Konfirmasi Kehadiran</label>
              <select className="w-full bg-black/50 border border-white/20 rounded-lg p-3 outline-none focus:border-pink-300 transition appearance-none">
                <option value="hadir">Hadir</option>
                <option value="tidak-hadir">Tidak Hadir</option>
                <option value="ragu">Masih Ragu</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 mb-1">Pesan & Doa</label>
              <textarea required rows={4} className="w-full bg-black/50 border border-white/20 rounded-lg p-3 outline-none focus:border-pink-300 transition resize-none" placeholder="Berikan doa & ucapan terbaik Anda..." />
            </div>

            <button type="submit" className="mt-2 w-full py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-medium transition flex justify-center items-center gap-2">
              Kirim Pesan
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
