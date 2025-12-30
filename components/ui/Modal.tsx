"use client";
import React from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl bg-card border border-border p-4 shadow-lg animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
          <button 
            aria-label="Close" 
            onClick={onClose} 
            className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-card-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}
