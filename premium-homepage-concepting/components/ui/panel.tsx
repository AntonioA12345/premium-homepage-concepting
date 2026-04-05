import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  surface?: "default" | "soft" | "dark";
}

const surfaceClasses = {
  default: "border-line bg-white shadow-panel",
  soft: "border-line bg-panel/80 shadow-sm",
  dark: "border-white/10 bg-[#131313] text-white shadow-soft"
};

export function Panel({ className, surface = "default", ...props }: PanelProps) {
  return (
    <div
      className={cn("rounded-[30px] border", surfaceClasses[surface], className)}
      {...props}
    />
  );
}
