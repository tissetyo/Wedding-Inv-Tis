interface TapeProps {
  className?: string;
}

export function Tape({ className }: TapeProps) {
  return (
    <div 
      className={`absolute w-12 h-4 bg-[#c8beaa] ${className || ""}`} 
      style={{ zIndex: 10 }} 
    />
  );
}
