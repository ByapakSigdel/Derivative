"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Zap, Code2, Share2, Layers, Terminal, BookOpen, Play, Settings, Database, Box, Workflow, Gauge } from "lucide-react";
import { SubtleCircuitBackground } from "@/components/ui/SubtleCircuitBackground";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-transparent text-white overflow-hidden selection:bg-cyan-500/30 font-sans relative">
      <SubtleCircuitBackground />

      {/* Navbar - Glassmorphism */}

      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 font-medium text-sm tracking-wide">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500 blur-[8px] opacity-40 rounded-full"></div>
              <Cpu size={20} className="text-cyan-400 relative z-10" />
            </div>
            <span className="text-white/90">Derivative</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
              Documentation
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-3 py-1.5 rounded-full bg-white text-black text-xs font-medium hover:bg-zinc-200 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Minimalist Typography */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-zinc-300 uppercase tracking-widest mb-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              System Status: In Development
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]"
            >
              Visual Logic for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600">Embedded Systems</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              A professional-grade node editor for Arduino. 
              Design logic visually, inspect generated C++, and flash firmware directly from the browser.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link 
                href="/editor" 
                className="h-11 px-6 rounded-full bg-white text-black text-sm font-medium flex items-center gap-2 hover:bg-zinc-200 transition-all"
              >
                Launch Editor
                <ArrowRight size={16} />
              </Link>
              <Link 
                href="/docs" 
                className="h-11 px-6 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium flex items-center gap-2 hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                <BookOpen size={16} className="text-zinc-400" />
                Read Documentation
              </Link>
            </motion.div>
          </div>

          {/* Right Column: The "Perfect" Animation (Untouched) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:block h-[500px] w-full"
          >
            {/* Abstract Node Editor Mockup */}
            <div className="absolute inset-0 bg-zinc-900/30 rounded-2xl border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl">
              {/* Grid inside mockup */}
              <div className="absolute inset-0 opacity-10" 
                style={{ 
                  backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, 
                  backgroundSize: '20px 20px' 
                }} 
              />
              
              {/* Floating Nodes */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-20 w-48 bg-[#0a0a0a] border border-emerald-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
              >
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 tracking-wider"><Play size={10} /> START</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-2/3 bg-zinc-800 rounded-full"></div>
                  <div className="h-1 w-1/2 bg-zinc-800 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-40 left-80 w-48 bg-[#0a0a0a] border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.05)]"
              >
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1 tracking-wider">LOGIC <Settings size={10} /></span>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] text-zinc-600 uppercase tracking-wider">
                    <span>Input A</span>
                    <span>Output</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full"></div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-80 left-52 w-48 bg-[#0a0a0a] border border-amber-500/30 rounded-xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.05)]"
              >
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 tracking-wider">OUTPUT <Database size={10} /></span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-1 w-3/4 bg-zinc-800 rounded-full"></div>
                </div>
              </motion.div>

              {/* Connecting Wires (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path 
                  d="M 190 140 C 250 140, 250 220, 320 220" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.path 
                  d="M 400 220 C 450 220, 450 360, 300 360" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Apple Style Bento */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 tracking-tight">Engineered for Performance</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light">
              Built with modern web technologies to deliver a native-like experience directly in your browser.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Gauge size={24} />,
                title: "Zero Latency",
                desc: "Optimized React Flow engine handles complex graphs with 60fps performance.",
                gradient: "from-zinc-800 to-zinc-900"
              },
              {
                icon: <Workflow size={24} />,
                title: "Native C++",
                desc: "Generates clean, human-readable Arduino code compatible with any board.",
                gradient: "from-zinc-800 to-zinc-900"
              },
              {
                icon: <Box size={24} />,
                title: "Type Safe",
                desc: "Intelligent connection validation prevents logical errors before they happen.",
                gradient: "from-zinc-800 to-zinc-900"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
              >
                {/* Subtle Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
