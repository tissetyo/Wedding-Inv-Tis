interface TapeProps {
  className?: string; // used for positioning and rotation
}

export function Tape({ className }: TapeProps) {
  return (
    <div 
      className={`absolute w-16 h-5 bg-[#e5ca93] opacity-80 shadow-md ${className || ""}`} 
      style={{ mixBlendMode: "multiply", zIndex: 10 }} 
    />
  );
}
