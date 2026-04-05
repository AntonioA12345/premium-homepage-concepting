import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "muted" | "success" | "dark";
}

const toneClasses = {
  default: "border-line bg-white/80 text-ink",
  muted: "border-line bg-panel text-muted",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  dark: "border-white/10 bg-white/10 text-white/80"
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.16em] uppercase",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
