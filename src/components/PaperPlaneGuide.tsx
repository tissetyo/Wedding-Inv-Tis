"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Send } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
}

export default function PaperPlaneGuide() {
  const container = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [docHeight, setDocHeight] = useState(6000); // Guessed height, will be updated natively

  useGSAP(
    () => {
      // 1.5s delay to ensure robust layout calculations after the splash screen fully un-mounts
      const timer = setTimeout(() => {
        if (!planeRef.current || !pathRef.current) return;

        const sections = gsap.utils.toArray("section");
        const w = window.innerWidth;
        const totalHeight = document.documentElement.scrollHeight;
        setDocHeight(totalHeight);
        
        let pathCoords: {x: number, y: number}[] = [
          { x: w * 0.5, y: -100 } // Start slightly above viewport securely hidden
        ];

        sections.forEach((sec: any, i: number) => {
          const rect = sec.getBoundingClientRect();
          const st = window.scrollY; // 0 because we execute this right as splash opens
          
          // Wide vintage zig zag sweeping across polaroids and tickets
          const x = i % 2 === 0 ? w * 0.8 : w * 0.2;
          const y = rect.top + st + (rect.height / 2);
          
          pathCoords.push({ x, y });
        });

        // Send gracefully into the footer
        pathCoords.push({ x: w * 0.5, y: totalHeight + 100 });

        // Generate the strict SVG Bezier path so it perfectly fits device height seamlessly
        const rawPath = MotionPathPlugin.arrayToRawPath(pathCoords, { curviness: 1.2 });
        const svgD = MotionPathPlugin.rawPathToString(rawPath);
        pathRef.current.setAttribute("d", svgD);

        // Bind the plane to safely ride the raw SVG path tied linearly to your document scroll!
        gsap.to(planeRef.current, {
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
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
    <div ref={container} className="absolute inset-x-0 top-0 pointer-events-none z-[60]" style={{ height: docHeight }}>
      
      {/* Extremely cool visible dotted line path stretching throughout your whole webpage! */}
      <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-10 shadow-lg">
        <path 
          ref={pathRef}
          d="" 
          stroke="#bfae91" 
          strokeWidth="1.5" 
          strokeDasharray="6, 12" 
          fill="none" 
          opacity={0.4} 
          strokeLinecap="round"
        />
      </svg>
      
      {/* Plane Container. It points straight (0deg) naturally so GSAP autoRotate maps seamlessly to the path trajectory! */}
      <div 
        ref={planeRef} 
        className="absolute top-0 left-0 w-10 h-10 text-[#f4f1ea] drop-shadow-[0_5px_15px_rgba(244,241,234,0.6)] z-20 flex justify-center items-center"
      >
        <div className="rotate-45 translate-x-1 -translate-y-1">
          <Send className="w-full h-full" strokeWidth={1.5} fill="#f4f1ea" />
        </div>
      </div>

    </div>
  );
}
