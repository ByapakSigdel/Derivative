"use client";
import { useState, useEffect } from "react";
import NodeCanvasWrapper from "@/components/editor/NodeCanvasWrapper";
import UploadPanel from "@/components/editor/UploadPanel";
import NodePanel from "@/components/editor/NodePanel";
import CodePreview from "@/components/editor/CodePreview";
import { useTheme } from "next-themes";
import { Sun, Moon, X, Trash2 } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

export default function EditorPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { clear } = useEditorStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main 
      className="grid grid-cols-12 gap-3 p-3 h-screen bg-background transition-colors duration-300"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Left Sidebar: Node Palette */}
      <div className="col-span-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-sm">
        <div className="p-3 border-b border-border bg-muted/50">
          <h2 className="text-sm font-bold text-foreground">Blocks</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NodePanel />
        </div>
      </div>

      {/* Center: Canvas */}
      <div className={`${showSidebar ? "col-span-7" : "col-span-10"} rounded-lg border border-border bg-card overflow-hidden h-full relative transition-all duration-300 shadow-sm group`}>
        <NodeCanvasWrapper />
        
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 bg-card/80 backdrop-blur-md hover:bg-accent text-foreground border border-border rounded-lg transition-all shadow-sm hover:shadow-md"
            title="Toggle Theme"
          >
            {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
          </button>

          {/* Clear Canvas */}
          <button
            onClick={clear}
            className="p-2.5 bg-card/80 backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground text-foreground border border-border rounded-lg transition-all shadow-sm hover:shadow-md"
            title="Clear Canvas"
          >
            <Trash2 size={18} />
          </button>

          {/* Toggle Sidebar Button */}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg transition-all duration-300
              font-semibold text-xs tracking-wide
              ${showSidebar 
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border" 
                : "bg-primary text-primary-foreground hover:bg-primary/90 border border-transparent"
              }
            `}
          >
            {showSidebar ? (
              <>
                <X size={16} />
                Close Panel
              </>
            ) : (
              <>
                Generate Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Sidebar: Code & Upload */}
      {showSidebar && (
        <div className="col-span-3 flex flex-col gap-3 h-full overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Code Preview Section */}
          <div className="flex-1 rounded-lg border border-border bg-card overflow-hidden flex flex-col p-3 shadow-sm">
            <CodePreview />
          </div>
          
          {/* Upload Section */}
          <div className="shrink-0 rounded-lg border border-border bg-card p-3 shadow-sm">
            <UploadPanel />
          </div>
        </div>
      )}
    </main>
  );
}

