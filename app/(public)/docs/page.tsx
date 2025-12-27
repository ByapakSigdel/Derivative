"use client";
import Link from "next/link";
import { ArrowLeft, Book, Code, Cpu, Layers, Zap } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 rounded bg-foreground text-background flex items-center justify-center">
                <Cpu size={14} />
              </div>
              Derivative <span className="text-muted-foreground font-normal">Docs</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/editor" className="text-sm font-medium text-primary hover:underline">
              Go to Editor
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-8 hidden md:block sticky top-24 h-fit">
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Getting Started</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-foreground font-medium border-l-2 border-primary pl-3 block">Introduction</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Installation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">First Project</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Core Concepts</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Nodes & Wires</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Variables</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Control Flow</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Hardware</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Pin Modes</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Serial Monitor</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground pl-3.5 block transition-colors">Supported Boards</a></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <div className="md:col-span-9 space-y-12">
          <section>
            <h1 className="text-4xl font-bold mb-6">Introduction to Derivative</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Derivative is a visual programming environment designed to make Arduino development accessible, fast, and error-free. Instead of writing syntax-heavy C++ code, you connect logical blocks to define your program's behavior.
            </p>
            <div className="p-6 rounded-lg border border-border bg-muted/30">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Zap size={18} className="text-yellow-500" />
                Why Visual Programming?
              </h3>
              <p className="text-sm text-muted-foreground">
                Visual programming abstracts away the complexity of syntax errors (missing semicolons, braces) and allows you to focus purely on the logic of your application. The generated code is still native C++, ensuring zero performance overhead.
              </p>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">The Node Editor</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to navigate the canvas, add nodes, and connect them to create logic flows.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Code Generation</h3>
              <p className="text-sm text-muted-foreground">
                Understand how your visual graph is translated into optimized Arduino C++ code.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Book size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Node Reference</h3>
              <p className="text-sm text-muted-foreground">
                Detailed documentation for every available node, from Digital I/O to Math operations.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Hardware Setup</h3>
              <p className="text-sm text-muted-foreground">
                Guide on connecting your Arduino board and using the WebSerial uploader.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
