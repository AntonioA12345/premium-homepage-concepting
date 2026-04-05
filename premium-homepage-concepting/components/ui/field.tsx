import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface FieldWrapperProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, hint, children }: FieldWrapperProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition placeholder:text-[#8c877f] focus:border-ink focus:bg-white",
        props.className
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-2xl border border-line bg-panel px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-[#8c877f] focus:border-ink focus:bg-white",
        props.className
      )}
    />
  );
}
