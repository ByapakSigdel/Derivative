"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const SubtleCircuitBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#020405] -z-50" />;

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#020405] pointer-events-none select-none -z-50">
      
      {/* Abstract Circuit Traces */}
      <svg className="absolute inset-0 w-full h-full opacity-[1]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <linearGradient id="trace-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#06b6d4" /> {/* Cyan-500 */}
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* More complex, distributed paths */}
        {[
            // Horizontal flows
            "M-10,15 H20 L25,20 H45 L50,15 H110",
            "M-10,45 H35 L40,50 H70 L75,45 H110",
            "M-10,75 H15 L20,80 H55 L60,75 H110",
            "M-10,85 H30 L35,90 H80 L85,85 H110",
            
            // Vertical flows
            "M15,-10 V25 L20,30 V60 L15,65 V110",
            "M45,-10 V40 L50,45 V80 L45,85 V110",
            "M85,-10 V20 L80,25 V55 L85,60 V110",
            
            // Diagonal/Cross connections
            "M25,20 V35 L30,40 H60",
            "M75,45 V60 L70,65 H40",
            "M50,15 V30 L55,35 H80"
        ].map((path, i) => (
            <g key={i}>
                {/* Background Trace - Darker but visible */}
                <path 
                    d={path} 
                    stroke="#334155" 
                    strokeWidth="0.5" 
                    fill="none" 
                    vectorEffect="non-scaling-stroke" 
                />
                
                {/* Animated Pulse - Brighter */}
                <motion.path 
                    d={path} 
                    stroke="url(#trace-grad)" 
                    strokeWidth="1" 
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathOffset: 1, opacity: 0 }}
                    animate={{ 
                        pathOffset: [-1, 0],
                        opacity: [0, 1, 0]
                    }}
                    transition={{ 
                        duration: 8 + (i % 5) * 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        delay: i * 1.5,
                        repeatDelay: 1
                    }}
                    style={{ filter: 'url(#glow)' }}
                />
            </g>
        ))}
      </svg>

      {/* Vignette - Reduced intensity to let traces show through */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020405_100%)] opacity-80" />
    </div>
  );
};
