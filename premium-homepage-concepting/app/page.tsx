import Link from "next/link";
import { stylePresets } from "@/lib/mock-data/style-presets";

const workflow = ["Generate", "Preview", "Refine", "Approve", "Export"];

export default function LandingPage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Premium homepage concepting</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-ink md:text-7xl">
            Generate sharper homepage direction for service businesses without slowing your studio down.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            An AI-assisted concepting workspace for freelancers, studios, and Webflow designers who need cleaner premium
            homepage direction, faster refinement loops, and better Figma/Codex/Webflow handoff.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white" href="/auth/sign-up">
              Start MVP
            </Link>
            <Link className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink" href="/dashboard">
              View dashboard
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-2">
            {workflow.map((step) => (
              <span key={step} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-muted shadow-sm">
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-line bg-white/90 p-6 shadow-soft">
          <div className="rounded-[32px] bg-[#161616] p-6 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">Workspace snapshot</p>
                <h2 className="mt-2 text-2xl font-semibold">Advisory homepage concept</h2>
              </div>
              <div className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/75">Version 3 approved</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_0.9fr]">
              <div className="rounded-[28px] bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Page strategy</p>
                <p className="mt-3 text-2xl font-medium leading-tight">
                  Position the firm as the premium low-risk choice for high-trust financial decisions.
                </p>
                <div className="mt-6 grid gap-3">
                  {["Hero with authority-driven message", "Proof strip with trust metrics", "Service cards", "Case study preview", "Conversion CTA"].map((item) => (
                    <div key={item} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/75">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[28px] bg-[#f4ece1] p-5 text-[#1b130f]">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6d5d4f]">Visual direction</p>
                  <p className="mt-3 text-xl font-semibold">Editorial Premium</p>
                  <p className="mt-3 text-sm leading-6 text-[#5f5348]">
                    Serif-led hierarchy, crisp proof bands, composed photography, and restrained premium spacing.
                  </p>
                </div>
                <div className="rounded-[28px] bg-white/5 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">Exports</p>
                  <div className="mt-3 space-y-2 text-sm text-white/75">
                    <p>Figma / Codex-ready prompt</p>
                    <p>Section blueprint</p>
                    <p>Webflow structural handoff</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line/80 bg-white/70">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-5 lg:grid-cols-5">
            {stylePresets.map((preset) => (
              <article key={preset.id} className="rounded-[28px] border border-line bg-panel p-5 shadow-sm">
                <p className="text-sm font-medium text-ink">{preset.name}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{preset.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
