// src/components/Button.tsx
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({ label, loading, fullWidth, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`button ${fullWidth ? "button-full" : ""}`}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
