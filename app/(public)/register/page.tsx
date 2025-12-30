"use client";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { SubtleCircuitBackground } from "@/components/ui/SubtleCircuitBackground";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-transparent text-white relative overflow-hidden font-sans selection:bg-cyan-500/30">
      <SubtleCircuitBackground />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 font-medium text-2xl tracking-tight mb-2 hover:opacity-80 transition-opacity">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500 blur-[8px] opacity-40 rounded-full"></div>
              <Cpu size={28} className="text-cyan-400 relative z-10" />
            </div>
            <span className="text-white/90 font-mono">DERIVATIVE</span>
          </Link>
          <p className="text-zinc-400 text-sm">Create your account to start building.</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <RegisterForm />
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

