"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Send, Leaf, Feather, Sparkles } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
}

interface GuideProps {
  icon?: string;
  customImage?: string;
  rotation?: number;
  animation?: 'breathing' | 'spinning' | 'wobbling' | 'flipping' | 'fluttering' | 'floating' | 'twinkling' | 'barrel-roll' | 'zigzag' | 'heartbeat' | 'pendulum' | 'bouncing' | string;
  speed?: 'slow' | 'normal' | 'fast' | string;
}

export default function PaperPlaneGuide({ 
  icon = 'plane', 
  customImage, 
  rotation = 0, 
  animation = 'breathing', 
  speed = 'normal' 
}: GuideProps) {
  const container = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [docHeight, setDocHeight] = useState(6000);

  useGSAP(
    () => {
      const timer = setTimeout(() => {
        if (!planeRef.current || !pathRef.current) return;

        const sections = gsap.utils.toArray("section") as HTMLElement[];
        if (sections.length < 2) return;
        
        const w = window.innerWidth;
        const totalHeight = document.documentElement.scrollHeight;
        setDocHeight(totalHeight);
        const st = window.scrollY;
        
        // ── 1. Find the Mempelai title to use as starting perch ──
        const mempelaiTitle = document.getElementById('mempelai-title');
        let perchX = w * 0.5;
        let perchY = sections[1].getBoundingClientRect().top + st + 50;
        
        if (mempelaiTitle) {
          const r = mempelaiTitle.getBoundingClientRect();
          // Center-X of the title text + offset to the right
          perchX = r.left + r.width / 2 + r.width / 2 + 25;
          perchY = r.top + st + r.height / 2;
        }
        
        // ── 2. Find the Cerita Cinta title for the second perch ──
        const lsTitle = document.getElementById('love-story-title');
        const lsSection = document.getElementById('love-story');
        let lsPerchX = w * 0.5;
        let lsPerchY = 0;
        let lsSectionTop = 0;
        let lsSectionBottom = 0;
        
        if (lsSection) {
          const lsRect = lsSection.getBoundingClientRect();
          lsSectionTop = lsRect.top + st;
          lsSectionBottom = lsRect.bottom + st;
        }
        
        if (lsTitle) {
          const r = lsTitle.getBoundingClientRect();
          lsPerchX = r.left + r.width / 2 + r.width / 2 + 25;
          lsPerchY = r.top + st + r.height / 2;
        } else if (lsSection) {
          lsPerchX = w * 0.5;
          lsPerchY = lsSectionTop + 160;
        }

        // ── 3. Build path segments ──
        // The strategy: build 3 separate paths
        //   Path A: perch → fly through sections before love-story → arrive at love-story perch
        //   Path B: (skip / invisible) love-story perch stays put, no trail
        //   Path C: love-story perch → fly through remaining sections → footer
        
        // Collect sections before, during, and after love-story
        const guideSections = sections.slice(1); // skip Hero
        const beforeLS: {x: number, y: number}[] = [];
        const afterLS: {x: number, y: number}[] = [];
        let lsIndex = -1;
        
        guideSections.forEach((sec, i) => {
          const rect = sec.getBoundingClientRect();
          if (sec.id === 'love-story') {
            lsIndex = i;
            return;
          }
          const x = i % 2 === 0 ? w * 0.8 : w * 0.2;
          const y = rect.top + st + (rect.height / 2);
          if (lsIndex === -1) {
            beforeLS.push({ x, y });
          } else {
            afterLS.push({ x, y });
          }
        });
        
        // Full path: start perch → before sections → arrive at LS perch → (stay) → leave LS perch → after sections → footer
        const allCoords: {x: number, y: number}[] = [
          { x: perchX, y: perchY },       // Start: perched on Mempelai
          ...beforeLS,                      // Fly through intermediate sections
          { x: lsPerchX, y: lsPerchY },   // Arrive at Cerita Cinta perch
          { x: lsPerchX, y: lsPerchY },   // Stay perfectly still (duplicate point = no trail drawn)
          ...afterLS,                       // Fly through remaining sections  
          { x: w * 0.5, y: totalHeight + 100 } // Exit into footer
        ];

        // ── 4. Generate SVG path ──
        const rawPath = MotionPathPlugin.arrayToRawPath(allCoords, { curviness: 1 });
        const svgD = MotionPathPlugin.rawPathToString(rawPath);
        
        pathRef.current.setAttribute("d", svgD);
        const maskLine = document.getElementById("mask-line") as unknown as SVGPathElement;
        if (maskLine) maskLine.setAttribute("d", svgD);

        // ── 5. Mask animation (reveals trail as you scroll) ──
        const pathLength = pathRef.current.getTotalLength();
        if (maskLine) {
          gsap.set(maskLine, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
          
          gsap.to(maskLine, {
            scrollTrigger: {
              trigger: sections[1],
              start: "top center",
              end: () => "+=" + (totalHeight - sections[1].offsetTop),
              scrub: 1,
            },
            strokeDashoffset: 0,
            ease: "none",
          });
        }

        // ── 6. Bind plane to motionPath ──
        gsap.to(planeRef.current, {
          scrollTrigger: {
            trigger: sections[1],
            start: "top center",
            end: () => "+=" + (totalHeight - sections[1].offsetTop),
            scrub: 1,
          },
          motionPath: {
            path: pathRef.current,
            align: pathRef.current,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          ease: "none",
        });

        // ── 7. Icon micro-animation ──
        const duration = speed === 'fast' ? 0.3 : speed === 'slow' ? 2 : 1;
        gsap.killTweensOf(innerRef.current);

        switch(animation) {
          case 'spinning':
            gsap.to(innerRef.current, { rotation: 360, repeat: -1, duration: duration * 2, ease: "linear" });
            break;
          case 'wobbling':
            gsap.to(innerRef.current, { rotation: 25, yoyo: true, repeat: -1, duration: duration, ease: "sine.inOut" });
            break;
          case 'flipping':
            gsap.to(innerRef.current, { rotateY: 180, repeat: -1, yoyo: true, duration: duration, ease: "power1.inOut" });
            break;
          case 'fluttering':
            gsap.to(innerRef.current, { scaleY: 0.3, yoyo: true, repeat: -1, duration: duration * 0.2, ease: "sine.inOut" });
            gsap.to(innerRef.current, { y: -10, yoyo: true, repeat: -1, duration: duration * 0.5, ease: "sine.inOut" });
            break;
          case 'floating':
            gsap.to(innerRef.current, { y: -15, rotation: 5, yoyo: true, repeat: -1, duration: duration * 1.5, ease: "sine.inOut" });
            break;
          case 'twinkling':
            gsap.to(innerRef.current, { opacity: 0.3, scale: 0.8, yoyo: true, repeat: -1, duration: duration * 0.4, ease: "sine.inOut" });
            break;
          case 'barrel-roll':
            gsap.to(innerRef.current, { rotateX: 360, repeat: -1, duration: duration, ease: "linear" });
            break;
          case 'zigzag':
            gsap.to(innerRef.current, { x: 10, y: -10, yoyo: true, repeat: -1, duration: duration * 0.2, ease: "steps(3)" });
            break;
          case 'heartbeat': {
            const tl = gsap.timeline({ repeat: -1 });
            tl.to(innerRef.current, { scale: 1.3, duration: duration * 0.2, ease: "power1.out" })
              .to(innerRef.current, { scale: 1, duration: duration * 0.2, ease: "power1.in" })
              .to(innerRef.current, { scale: 1.3, duration: duration * 0.2, ease: "power1.out" })
              .to(innerRef.current, { scale: 1, duration: duration * 0.8, ease: "power1.in" });
            break;
          }
          case 'pendulum':
            gsap.set(innerRef.current, { transformOrigin: "50% -100%" });
            gsap.fromTo(innerRef.current, { rotation: -30 }, { rotation: 30, yoyo: true, repeat: -1, duration: duration * 1.5, ease: "sine.inOut" });
            break;
          case 'bouncing':
            gsap.to(innerRef.current, { y: -20, scaleY: 1.05, yoyo: true, repeat: -1, duration: duration * 0.5, ease: "circ.out" });
            break;
          case 'breathing':
          default:
            gsap.to(innerRef.current, { scale: 1.2, yoyo: true, repeat: -1, duration: duration, ease: "sine.inOut" });
            break;
        }

      }, 1500);

      return () => clearTimeout(timer);
    },
    { scope: container }
  );

  return (
    <div ref={container} className="absolute inset-x-0 top-0 pointer-events-none z-10" style={{ height: docHeight }}>
      
      {/* SVG trail path */}
      <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0 shadow-lg">
        <defs>
          <mask id="line-mask">
             <path id="mask-line" d="" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
          </mask>
        </defs>
      
        <path 
          ref={pathRef}
          d="" 
          stroke="#bfae91" 
          strokeWidth="1.5" 
          strokeDasharray="6, 12" 
          fill="none" 
          opacity={0.4} 
          strokeLinecap="round"
          mask="url(#line-mask)"
        />
      </svg>
      
      {/* Flying icon */}
      <div 
        ref={planeRef} 
        className="absolute top-0 left-0 w-10 h-10 text-[#f4f1ea] drop-shadow-[0_5px_15px_rgba(244,241,234,0.6)] z-10 flex justify-center items-center"
      >
        <div ref={innerRef} className="w-full h-full">
          <div className="w-full h-full" style={{ transform: `rotate(${45 + rotation}deg) translate(2px, -2px)` }}>
            {(() => {
              if (icon === 'custom' && customImage) {
                 return <img src={customImage} alt="Guide Icon" className="w-12 h-12 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />;
              }
              const IconComponent = icon === 'leaf' ? Leaf : icon === 'feather' ? Feather : icon === 'sparkles' ? Sparkles : Send;
              return <IconComponent className="w-full h-full" strokeWidth={1.5} fill="#f4f1ea" />;
            })()}
          </div>
        </div>
      </div>

    </div>
  );
}
