"use client";

import { signIn } from "@/lib/mock-data/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface AuthCardProps {
  mode: "sign-in" | "sign-up";
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      await signIn(email, fullName);
      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-[32px] border border-line bg-white p-8 shadow-soft">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          {mode === "sign-in" ? "Welcome back" : "Create account"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          {mode === "sign-in" ? "Sign in to concept faster." : "Start building premium homepage directions."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          This prototype uses a cookie-backed mock session with Supabase user persistence wired for production auth next.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {mode === "sign-up" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink">Full name</span>
            <input
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none transition focus:border-ink"
              placeholder="Alex Mercer"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none transition focus:border-ink"
            placeholder="you@studio.com"
          />
        </label>

        <button
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving session..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {mode === "sign-in" ? "Need an account?" : "Already have an account?"}{" "}
        <Link className="font-medium text-ink underline-offset-4 hover:underline" href={mode === "sign-in" ? "/auth/sign-up" : "/auth/sign-in"}>
          {mode === "sign-in" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
