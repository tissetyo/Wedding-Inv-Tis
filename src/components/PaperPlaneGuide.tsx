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

export default function PaperPlaneGuide({ icon = 'plane', customImage }: { icon?: string, customImage?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [docHeight, setDocHeight] = useState(6000); // Guessed height, will be updated natively

  useGSAP(
    () => {
      // 1.5s delay to ensure robust layout calculations after the splash screen fully un-mounts
      const timer = setTimeout(() => {
        if (!planeRef.current || !pathRef.current) return;

        const sections = gsap.utils.toArray("section") as HTMLElement[];
        if(sections.length < 2) return;
        
        const w = window.innerWidth;
        const totalHeight = document.documentElement.scrollHeight;
        setDocHeight(totalHeight);
        
        // Slice out Hero (index 0) so the path physically starts exactly exclusively at Mempelai (index 1)
        const guideSections = sections.slice(1);
        
        const mempelaiRect = sections[1].getBoundingClientRect();
        let pathCoords: {x: number, y: number}[] = [
          { x: w * 0.5, y: mempelaiRect.top + window.scrollY - 100 } // Start securely hidden slightly above the polaroids
        ];

        guideSections.forEach((sec: any, i: number) => {
          const rect = sec.getBoundingClientRect();
          const st = window.scrollY;
          
          if (sec.id === 'love-story') {
            // Literal swirl / loop-de-loop
            const cy = rect.top + st + rect.height * 0.5;
            pathCoords.push({ x: w * 0.8, y: cy - 100 });
            pathCoords.push({ x: w * 0.9, y: cy });
            pathCoords.push({ x: w * 0.8, y: cy + 100 });
            pathCoords.push({ x: w * 0.3, y: cy + 100 });
            pathCoords.push({ x: w * 0.2, y: cy });
            pathCoords.push({ x: w * 0.3, y: cy - 100 });
            pathCoords.push({ x: w * 0.5, y: cy - 50 });
          } else {
            // Wide vintage zig zag sweeping physically behind the polaroids and tickets
            const x = i % 2 === 0 ? w * 0.8 : w * 0.2;
            const y = rect.top + st + (rect.height / 2);
            pathCoords.push({ x, y });
          }
        });

        // Send gracefully into the footer
        pathCoords.push({ x: w * 0.5, y: totalHeight + 100 });

        // 1. Generate the strict SVG Bezier path
        const rawPath = MotionPathPlugin.arrayToRawPath(pathCoords, { curviness: 1.2 });
        const svgD = MotionPathPlugin.rawPathToString(rawPath);
        
        // 2. Set the path data on both the visible line and the invisible mask wrapper
        pathRef.current.setAttribute("d", svgD);
        const maskLine = document.getElementById("mask-line") as unknown as SVGPathElement;
        if(maskLine) maskLine.setAttribute("d", svgD);

        // 3. Prepare the Mask Animation (reveals the dotted line natively)
        const pathLength = pathRef.current.getTotalLength();
        if(maskLine) {
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

        // 4. Bind the plane so it perfectly matches the tracing mask!
        gsap.to(planeRef.current, {
          scrollTrigger: {
            trigger: sections[1],
            start: "top center", // Only start rolling when Mempelai drops into the screen
            end: () => "+=" + (totalHeight - sections[1].offsetTop), // End perfectly at bottom of document
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

        // Breathing loop
        gsap.to(planeRef.current, {
          scale: 1.2,
          yoyo: true,
          repeat: -1,
          duration: 1,
          ease: "sine.inOut"
        });

      }, 1500);

      return () => clearTimeout(timer);
    },
    { scope: container }
  );

  return (
    <div ref={container} className="absolute inset-x-0 top-0 pointer-events-none z-10" style={{ height: docHeight }}>
      
      {/* Extremely cool visible dotted line path stretching throughout your whole webpage! */}
      <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0 shadow-lg">
        <defs>
          <mask id="line-mask">
             {/* The white mask draws itself dynamically. White = visible. */}
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
      
      {/* Plane Container. It points straight (0deg) naturally so GSAP autoRotate maps seamlessly to the path trajectory! */}
      <div 
        ref={planeRef} 
        className="absolute top-0 left-0 w-10 h-10 text-[#f4f1ea] drop-shadow-[0_5px_15px_rgba(244,241,234,0.6)] z-10 flex justify-center items-center"
      >
        <div className="rotate-45 translate-x-1 -translate-y-1">
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
  );
}
