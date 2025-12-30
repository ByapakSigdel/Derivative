"use client";
import { motion } from "framer-motion";

export const ArduinoPCB = () => {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#020405] pointer-events-none select-none z-0">
      {/* Dot Grid Pattern */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: `radial-gradient(#115e59 1px, transparent 1px)`,
             backgroundSize: '20px 20px'
           }}
      />
      
      {/* The Board Container - Centered and Scaled */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] opacity-100 scale-[1.5] md:scale-100 origin-center">
        <svg viewBox="0 0 600 450" className="w-full h-full drop-shadow-[0_0_50px_rgba(17,94,89,0.3)]">
            <defs>
                <filter id="glow-pcb" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="board-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#042f2e" /> {/* Darker Teal */}
                    <stop offset="100%" stopColor="#022c22" />
                </linearGradient>
                <pattern id="trace-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M0,10 L10,0" stroke="#0f766e" strokeWidth="0.5" opacity="0.2" />
                </pattern>
            </defs>

            {/* Board Outline - Arduino Uno Shape */}
            <path 
                d="M50,50 H450 A15,15 0 0 1 465,65 V100 L490,125 V350 A15,15 0 0 1 475,365 H150 L130,345 H50 A15,15 0 0 1 35,330 V65 A15,15 0 0 1 50,50 Z" 
                fill="url(#board-grad)" 
                stroke="#134e4a" 
                strokeWidth="3"
            />
            
            {/* Board Texture (Diagonal Lines) */}
            <path 
                d="M50,50 H450 A15,15 0 0 1 465,65 V100 L490,125 V350 A15,15 0 0 1 475,365 H150 L130,345 H50 A15,15 0 0 1 35,330 V65 A15,15 0 0 1 50,50 Z" 
                fill="url(#trace-pattern)" 
                stroke="none"
            />

            {/* Mounting Holes (Gold Plated) */}
            {[
                { cx: 60, cy: 80 },
                { cx: 160, cy: 340 },
                { cx: 450, cy: 80 },
                { cx: 450, cy: 340 }
            ].map((hole, i) => (
                <g key={i}>
                    <circle cx={hole.cx} cy={hole.cy} r="10" fill="none" stroke="#b45309" strokeWidth="2" opacity="0.8" />
                    <circle cx={hole.cx} cy={hole.cy} r="8" fill="#020405" />
                </g>
            ))}

            {/* USB Port (Silver) */}
            <g transform="translate(20, 90)">
                <rect x="0" y="0" width="60" height="50" rx="2" fill="#6b7280" stroke="#374151" />
                <rect x="10" y="10" width="40" height="30" fill="#4b5563" />
                <path d="M0,0 L10,10 M60,0 L50,10 M0,50 L10,40 M60,50 L50,40" stroke="#374151" strokeWidth="1" />
            </g>
            
            {/* Power Jack (Black) */}
            <g transform="translate(20, 280)">
                <rect x="0" y="0" width="70" height="60" rx="2" fill="#111" stroke="#333" />
                <circle cx="35" cy="30" r="15" fill="#222" />
                <circle cx="35" cy="30" r="5" fill="#000" />
            </g>

            {/* ATmega328P (DIP Package) */}
            <g transform="translate(320, 260) rotate(0)">
                <rect x="-60" y="-20" width="120" height="40" fill="#18181b" stroke="#27272a" rx="2" />
                <text x="0" y="5" textAnchor="middle" fill="#71717a" fontSize="8" fontFamily="monospace" letterSpacing="1">ATMEGA328P-PU</text>
                <circle cx="-50" cy="0" r="3" fill="#333" />
                {/* Legs */}
                {[...Array(14)].map((_, i) => (
                    <g key={`top-${i}`}>
                        <rect x={-55 + i * 8.5} y="-26" width="4" height="6" fill="#d1d5db" />
                        <rect x={-55 + i * 8.5} y="-26" width="4" height="2" fill="#9ca3af" />
                    </g>
                ))}
                {[...Array(14)].map((_, i) => (
                    <g key={`bot-${i}`}>
                        <rect x={-55 + i * 8.5} y="20" width="4" height="6" fill="#d1d5db" />
                        <rect x={-55 + i * 8.5} y="24" width="4" height="2" fill="#9ca3af" />
                    </g>
                ))}
            </g>

            {/* Headers (Top) */}
            <g transform="translate(180, 60)">
                <rect x="0" y="0" width="240" height="20" fill="#111" stroke="#222" />
                {[...Array(10)].map((_, i) => (
                    <g key={i}>
                        <rect x={10 + i * 24} y="5" width="4" height="10" fill="#000" />
                        <circle cx={12 + i * 24} cy="10" r="2" fill="#333" />
                    </g>
                ))}
                <text x="120" y="-10" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" opacity="0.8">DIGITAL (PWM~)</text>
            </g>

             {/* Headers (Bottom) */}
            <g transform="translate(180, 340)">
                <rect x="0" y="0" width="240" height="20" fill="#111" stroke="#222" />
                {[...Array(8)].map((_, i) => (
                    <g key={i}>
                        <rect x={13 + i * 30} y="5" width="4" height="10" fill="#000" />
                        <circle cx={15 + i * 30} cy="10" r="2" fill="#333" />
                    </g>
                ))}
                <text x="60" y="35" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" opacity="0.8">POWER</text>
                <text x="180" y="35" textAnchor="middle" fill="white" fontSize="10" fontFamily="monospace" opacity="0.8">ANALOG IN</text>
            </g>

            {/* ICSP Header */}
            <g transform="translate(450, 200)">
                <rect x="0" y="0" width="20" height="30" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                {[0, 10].map(x => [0, 10, 20].map(y => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#d1d5db" />
                )))}
            </g>

            {/* Crystal Oscillator */}
            <g transform="translate(120, 240)">
                <ellipse cx="0" cy="0" rx="15" ry="8" fill="#d1d5db" stroke="#9ca3af" />
                <text x="0" y="20" textAnchor="middle" fill="white" fontSize="6" opacity="0.7">16.000</text>
            </g>

            {/* Reset Button */}
            <g transform="translate(60, 60)">
                <rect x="0" y="0" width="15" height="15" fill="#d1d5db" />
                <circle cx="7.5" cy="7.5" r="4" fill="#ef4444" />
            </g>

            {/* Complex Traces */}
            <g opacity="0.6">
                {/* USB Data Lines */}
                <path d="M80,115 H100 L120,135 V200 L150,230 H250" stroke="#134e4a" strokeWidth="1.5" fill="none" />
                <path d="M80,120 H95 L115,140 V205 L145,235 H250" stroke="#134e4a" strokeWidth="1.5" fill="none" />
                
                {/* Chip to Digital Pins */}
                {[...Array(8)].map((_, i) => (
                    <path 
                        key={i}
                        d={`M${270 + i * 8},240 V200 L${200 + i * 20},100 V80`} 
                        stroke="#134e4a" 
                        strokeWidth="1" 
                        fill="none" 
                    />
                ))}

                {/* Chip to Analog Pins */}
                {[...Array(6)].map((_, i) => (
                    <path 
                        key={i}
                        d={`M${270 + i * 8},280 V300 L${200 + i * 25},320 V340`} 
                        stroke="#134e4a" 
                        strokeWidth="1" 
                        fill="none" 
                    />
                ))}
            </g>

            {/* Animated Data Flow */}
            {/* USB RX/TX Activity */}
             <motion.path 
                d="M80,115 H100 L120,135 V200 L150,230 H250" 
                stroke="#22d3ee" 
                strokeWidth="2" 
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 0.5, opacity: [0, 1, 0], pathOffset: [0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ filter: 'url(#glow-pcb)' }}
            />
             <motion.path 
                d="M80,120 H95 L115,140 V205 L145,235 H250" 
                stroke="#4ade80" 
                strokeWidth="2" 
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 0.5, opacity: [0, 1, 0], pathOffset: [0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                style={{ filter: 'url(#glow-pcb)' }}
            />

            {/* Logic Flow to Pins */}
            {[0, 2, 4, 6].map((i) => (
                <motion.path 
                    key={i}
                    d={`M${270 + i * 8},240 V200 L${200 + i * 20},100 V80`} 
                    stroke={i % 4 === 0 ? "#22d3ee" : "#facc15"} 
                    strokeWidth="1.5" 
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 0.6, opacity: [0, 1, 0], pathOffset: [0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                    style={{ filter: 'url(#glow-pcb)' }}
                />
            ))}

            {/* TX/RX LEDs */}
            <g transform="translate(140, 180)">
                <text x="15" y="2" fill="white" fontSize="6" fontFamily="monospace" opacity="0.8">TX</text>
                <text x="15" y="17" fill="white" fontSize="6" fontFamily="monospace" opacity="0.8">RX</text>
                
                <circle cx="0" cy="0" r="3" fill="#111" stroke="#333" />
                <motion.circle 
                    cx="0" cy="0" r="2" fill="#fbbf24" 
                    animate={{ opacity: [0.2, 1, 0.2] }} 
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() }} 
                />

                <circle cx="0" cy="15" r="3" fill="#111" stroke="#333" />
                <motion.circle 
                    cx="0" cy="15" r="2" fill="#fbbf24" 
                    animate={{ opacity: [0.2, 1, 0.2] }} 
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() }} 
                />
            </g>

            {/* Power LED */}
            <g transform="translate(430, 180)">
                <text x="10" y="2" fill="white" fontSize="6" fontFamily="monospace" opacity="0.8">ON</text>
                <circle cx="0" cy="0" r="3" fill="#111" stroke="#333" />
                <circle cx="0" cy="0" r="2" fill="#22c55e" opacity="0.8" />
            </g>

            {/* Branding */}
            <g transform="translate(260, 150) rotate(-5)">
                <text x="0" y="0" fill="white" fontSize="28" fontFamily="sans-serif" fontWeight="bold" opacity="0.9" letterSpacing="-1">ARDUINO</text>
                <text x="130" y="0" fill="white" fontSize="28" fontFamily="sans-serif" fontStyle="italic" opacity="0.9" letterSpacing="-1">UNO</text>
                <path d="M-10,-10 C10,-20 30,0 50,-10" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
                <text x="0" y="20" fill="white" fontSize="8" fontFamily="monospace" opacity="0.7">MADE IN ITALY</text>
            </g>

        </svg>
      </div>
    </div>
  )
}
