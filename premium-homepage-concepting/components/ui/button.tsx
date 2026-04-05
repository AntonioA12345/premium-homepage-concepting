import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-[0_18px_40px_rgba(17,17,17,0.14)] hover:bg-[#222222] focus-visible:ring-ink/20",
  secondary:
    "border border-line bg-white text-ink hover:border-ink/20 hover:bg-panel focus-visible:ring-ink/10",
  ghost: "text-ink hover:bg-black/5 focus-visible:ring-ink/10"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "rounded-2xl px-4 py-2.5 text-sm",
  md: "rounded-2xl px-5 py-3 text-sm"
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-medium transition duration-150 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
