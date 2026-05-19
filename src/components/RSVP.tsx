"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
  const thanksCard = useRef<HTMLDivElement>(null);
  
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

  const launchButterflyBurst = useCallback((origin: DOMRect) => {
    const startX = origin.left + origin.width / 2;
    const startY = origin.top + origin.height / 2;
    const targets = Array.from({ length: 34 }, (_, index) => {
      const columns = 6;
      const column = index % columns;
      const row = Math.floor(index / columns);
      const directionSign = column < columns / 2 ? -1 : 1;
      const xSpread = window.innerWidth * (0.2 + column * 0.12);
      const x = directionSign * xSpread + ((row % 2) * 28 - 14);
      const yPattern = [-window.innerHeight * 0.72, -window.innerHeight * 0.48, -window.innerHeight * 0.25, window.innerHeight * 0.18, window.innerHeight * 0.34, -window.innerHeight * 0.62];
      const y = yPattern[index % yPattern.length] + row * 18;
      const direction = x < 0 ? "left" : "right";
      return {
        x,
        y,
        rotate: (x < 0 ? -1 : 1) * (8 + (index % 6) * 6),
        scale: 0.48 + (index % 6) * 0.08,
        delay: (index % 8) * 80 + row * 110,
        src: `/animations/butterfly-pet/fly-${direction}.gif`,
      };
    });

    targets.forEach((butterfly) => {
      const img = document.createElement("img");
      img.src = butterfly.src;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.className = "pointer-events-none fixed z-[120] h-12 w-[78px] max-w-none object-contain drop-shadow-[0_0_10px_rgba(244,241,234,0.55)]";
      img.style.left = `${startX - 45}px`;
      img.style.top = `${startY - 28}px`;
      img.style.opacity = "0";
      document.body.appendChild(img);

      img.animate(
        [
          { opacity: 0, transform: "translate3d(0, 0, 0) scale(0.25) rotate(0deg)" },
          { opacity: 0.15, transform: `translate3d(${butterfly.x * 0.08}px, ${butterfly.y * 0.08}px, 0) scale(${butterfly.scale * 0.55}) rotate(${butterfly.rotate * 0.15}deg)`, offset: 0.14 },
          { opacity: 1, transform: `translate3d(${butterfly.x * 0.28}px, ${butterfly.y * 0.28 - 18}px, 0) scale(${butterfly.scale}) rotate(${butterfly.rotate * 0.35}deg)`, offset: 0.36 },
          { opacity: 0.9, transform: `translate3d(${butterfly.x * 0.72}px, ${butterfly.y * 0.72 + 18}px, 0) scale(${butterfly.scale * 1.04}) rotate(${butterfly.rotate}deg)`, offset: 0.76 },
          { opacity: 0, transform: `translate3d(${butterfly.x}px, ${butterfly.y}px, 0) scale(${butterfly.scale * 0.9}) rotate(${butterfly.rotate * 1.25}deg)` },
        ],
        {
          duration: 4200,
          delay: butterfly.delay,
          easing: "cubic-bezier(0.16, 0.8, 0.28, 1)",
          fill: "forwards",
        }
      ).addEventListener("finish", () => img.remove(), { once: true });
    });
  }, []);

  useEffect(() => {
    if (!isSubmitted || !thanksCard.current) return;
    const timer = window.setTimeout(() => {
      if (thanksCard.current) launchButterflyBurst(thanksCard.current.getBoundingClientRect());
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isSubmitted, launchButterflyBurst]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newWish = { 
      id: Math.random().toString(), 
      ...formData, 
      created_at: new Date().toISOString() 
    };

    // Optimistically prepend to UI so user sees it instantly
    setWishes(prev => [newWish, ...prev]);
    setIsSubmitted(true);
    
    await supabase.from("wedding_wishes").insert([formData]);
    
    setFormData({ name: "", attendance: "hadir", message: "" });
    setTimeout(() => setIsSubmitted(false), 5600);
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

      <div className="rsvp-anim relative z-[130] mx-auto w-full max-w-sm">
        {isSubmitted ? (
          <div ref={thanksCard} className="relative z-[130] overflow-hidden border border-current/15 bg-[#17130f]/95 px-8 py-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-4 border border-current/10 bg-[radial-gradient(circle_at_center,rgba(244,241,234,0.08),transparent_65%)]" />
            <div className="mx-auto mb-6 h-[1px] w-16 bg-[var(--color-accent)]/50" />
            <p className="mb-3 font-sans text-[9px] uppercase tracking-[0.35em] text-[var(--color-accent)]/80">
              Pesan Terkirim
            </p>
            <h3 className="mb-4 font-script text-5xl leading-none text-current drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]" style={{ fontFamily: "var(--font-script)" }}>
              Terima Kasih
            </h3>
            <p className="mx-auto max-w-[15rem] font-serif text-sm leading-relaxed text-current/70">
              Doa dan ucapan Anda telah kami terima dengan penuh rasa syukur.
            </p>
            <div className="mx-auto mt-6 h-[1px] w-16 bg-[var(--color-accent)]/50" />
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
