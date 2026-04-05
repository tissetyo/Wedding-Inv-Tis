import { ReactNode } from "react";

interface FilmStripProps {
  children: ReactNode;
  className?: string;
}

export function FilmStrip({ children, className }: FilmStripProps) {
  return (
    <div className={`w-full relative ${className || ""}`}>
      {/* Top Sprocket Holes - Minimal */}
      <div 
        className="w-full h-[12px] bg-[#1a1714]" 
        style={{ 
          backgroundImage: "radial-gradient(circle, #f4f1ea 3px, transparent 3px)", 
          backgroundSize: "20px 12px", 
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-x" 
        }} 
      />
      
      <div className="w-full bg-[#1a1714] overflow-hidden">
        {children}
      </div>

      {/* Bottom Sprocket Holes - Minimal */}
      <div 
        className="w-full h-[12px] bg-[#1a1714]" 
        style={{ 
          backgroundImage: "radial-gradient(circle, #f4f1ea 3px, transparent 3px)", 
          backgroundSize: "20px 12px", 
          backgroundPosition: "center bottom",
          backgroundRepeat: "repeat-x" 
        }} 
      />
    </div>
  );
}
