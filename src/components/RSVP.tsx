"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Wish { id: string; name: string; attendance: string; message: string; created_at: string; }

export default function RSVP({ theme }: { theme: any }) {
  const container = useRef<HTMLDivElement>(null);
  
  const [wishes, setWishes] = useState<Wish[]>([]);

  const [formData, setFormData] = useState({ name: "", attendance: "hadir", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function fetchWishes() {
      const { data } = await supabase.from("wedding_wishes").select("*").order("created_at", { ascending: false });
      if (data) setWishes(data as Wish[]);
    }
    fetchWishes();

    // Set up realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wedding_wishes' }, payload => {
        setWishes(prev => [payload.new as Wish, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, []);

  useGSAP(
    () => {
      gsap.from(".rsvp-anim", {
        scrollTrigger: { 
          trigger: ".rsvp-anim", 
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        y: 20, opacity: 0, stagger: 0.1, duration: 1.2, ease: "power2.out"
      });
    },
    { scope: container }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("wedding_wishes").insert([formData]);
    setIsSubmitted(true);
    setFormData({ name: "", attendance: "hadir", message: "" });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section 
      ref={container} 
      className="relative py-32 px-6 text-[var(--color-text)] overflow-hidden"
      style={{ backgroundColor: theme?.backgroundColor || undefined }}
    >
      {/* Background Section Override */}
      {theme?.backgroundType === "image" && theme?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale contrast-125 sepia-[0.2] z-0"
          style={{ backgroundImage: `url('${theme.backgroundImage}')` }}
        />
      )}

      <div className="mb-20 text-center rsvp-anim relative z-10">
        <h2 className="font-sans text-[10px] tracking-[0.3em] uppercase text-current/60 mb-4">Kehadiran</h2>
        <div className="h-[1px] w-8 bg-current/20 mx-auto" />
      </div>

      <div className="rsvp-anim mb-20 max-h-64 overflow-y-auto space-y-6 max-w-sm mx-auto relative z-10">
        {wishes.map((wish) => (
          <div key={wish.id} className="border-b border-current/10 pb-4">
            <div className="flex justify-between items-end mb-2">
              <h4 className="font-serif text-lg text-current">{wish.name}</h4>
              <span className="text-[8px] uppercase tracking-widest text-current/50">
                 {new Date(wish.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <p className="text-sm text-current/80 font-sans mb-3">{wish.message}</p>
          </div>
        ))}
      </div>

      <div className="rsvp-anim w-full max-w-sm mx-auto relative z-10">
        {isSubmitted ? (
          <div className="text-center py-12 border border-current/20 bg-[var(--color-bg)]/50 backdrop-blur-md">
            <h3 className="font-serif text-2xl text-current mb-2">Terima Kasih</h3>
            <p className="text-current/60 text-xs">Pesan Anda telah dikirim.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-current">
            <input 
              required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-transparent border-b border-current/30 py-2 outline-none focus:border-[var(--color-accent)] font-sans text-sm" placeholder="Nama" 
            />
            <select 
              value={formData.attendance} onChange={e => setFormData({...formData, attendance: e.target.value})}
              className="w-full bg-transparent border-b border-current/30 py-2 outline-none focus:border-[var(--color-accent)] font-sans text-sm appearance-none rounded-none"
            >
              <option value="hadir" className="bg-[var(--color-bg)] text-[var(--color-text)]">Hadir</option>
              <option value="tidak-hadir" className="bg-[var(--color-bg)] text-[var(--color-text)]">Tidak Hadir</option>
            </select>
            <textarea 
              required rows={2} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-transparent border-b border-current/30 py-2 outline-none focus:border-[var(--color-accent)] resize-none font-sans text-sm" placeholder="Pesan" 
            />
            <button type="submit" className="mt-4 border border-current/30 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-current/5 transition-colors bg-[var(--color-bg)]/50 backdrop-blur-sm">
              Kirim
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
