import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export default function Button({ children, type = "button", onClick, disabled, variant = "primary", className }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors px-4 py-2";
  const variants: Record<string, string> = {
    primary: "bg-black text-white hover:bg-gray-800",
    secondary: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={[base, variants[variant], disabled ? "opacity-50" : "", className ?? ""].join(" ")}>
      {children}
    </button>
  );
}
