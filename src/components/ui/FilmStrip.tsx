import { ReactNode } from "react";

interface FilmStripProps {
  children: ReactNode;
  className?: string;
}

export function FilmStrip({ children, className }: FilmStripProps) {
  return (
    <div className={`w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${className || ""}`}>
      {/* Top Sprocket Holes */}
      <div 
        className="w-full h-[15px] bg-[#111]" 
        style={{ 
          backgroundImage: "radial-gradient(circle, #EAE0C8 4px, transparent 4px)", 
          backgroundSize: "20px 15px", 
          backgroundPosition: "center top",
          backgroundRepeat: "repeat-x" 
        }} 
      />
      
      {/* Content Area */}
      <div className="w-full bg-[#111] p-2 overflow-hidden border-t-2 border-b-2 border-[#111]">
        {children}
      </div>

      {/* Bottom Sprocket Holes */}
      <div 
        className="w-full h-[15px] bg-[#111]" 
        style={{ 
          backgroundImage: "radial-gradient(circle, #EAE0C8 4px, transparent 4px)", 
          backgroundSize: "20px 15px", 
          backgroundPosition: "center bottom",
          backgroundRepeat: "repeat-x" 
        }} 
      />
    </div>
  );
}
