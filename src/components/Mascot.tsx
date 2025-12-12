import { useState, useEffect, useRef } from "react";

interface MascotProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  onWave?: () => void;
}

const Mascot = ({ size = "md", className = "", onWave }: MascotProps) => {
  const [isWaving, setIsWaving] = useState(false);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-56 h-56",
  };

  const handleClick = () => {
    setIsWaving(true);
    onWave?.();
    setTimeout(() => setIsWaving(false), 500);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;
      const rect = mascotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const x = Math.max(-5, Math.min(5, (e.clientX - centerX) / 50));
      const y = Math.max(-5, Math.min(5, (e.clientY - centerY) / 50));
      
      setEyePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={mascotRef}
      className={`relative cursor-pointer select-none ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
    >
      {/* Face Only */}
      <div className="absolute inset-0 animate-float">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Head Circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="hsl(51, 100%, 50%)"
            className="drop-shadow-lg"
          />
          
          {/* Left Eye */}
          <g className="animate-blink" style={{ transformOrigin: "70px 85px" }}>
            <ellipse cx="70" cy="85" rx="15" ry="18" fill="white" />
            <circle
              cx={70 + eyePosition.x}
              cy={85 + eyePosition.y}
              r="8"
              fill="black"
            />
            <circle
              cx={67 + eyePosition.x}
              cy={82 + eyePosition.y}
              r="3"
              fill="white"
            />
          </g>
          
          {/* Right Eye */}
          <g className="animate-blink" style={{ transformOrigin: "130px 85px" }}>
            <ellipse cx="130" cy="85" rx="15" ry="18" fill="white" />
            <circle
              cx={130 + eyePosition.x}
              cy={85 + eyePosition.y}
              r="8"
              fill="black"
            />
            <circle
              cx={127 + eyePosition.x}
              cy={82 + eyePosition.y}
              r="3"
              fill="white"
            />
          </g>
          
          {/* Smile */}
          <path
            d="M 65 120 Q 100 150 135 120"
            stroke="black"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Wave Text */}
      {isWaving && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold animate-fade-in-up">
          Hi! 👋
        </div>
      )}
    </div>
  );
};

export default Mascot;
