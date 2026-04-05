import { GenerationResult, GenerationSection, StylePresetName } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";

interface HomepagePreviewProps {
  result: GenerationResult;
}

const toneClasses: Record<StylePresetName, string> = {
  "Editorial Premium": "bg-[#f6efe6] text-[#221b17]",
  "Minimal Authority": "bg-[#f5f5f2] text-[#161616]",
  "Cinematic Luxury": "bg-[#100f10] text-[#f5efe8]",
  "Bold Modern Contrast": "bg-[#f6f0e5] text-[#0f1115]",
  "Structured Professional": "bg-[#f3f6fb] text-[#142033]"
};

const previewTheme = {
  "Editorial Premium": {
    shell: "border-black/10 bg-white/55",
    accent: "bg-[#d8c1a8]",
    soft: "bg-white/45",
    heroDisplay: "font-serif",
    button: "bg-[#241d19] text-white",
    ctaSurface: "bg-[#241d19] text-white",
    secondaryButton: "border-black/10 bg-white/50",
    muted: "text-[#5e554d]"
  },
  "Minimal Authority": {
    shell: "border-black/10 bg-white/80",
    accent: "bg-[#d9dfdd]",
    soft: "bg-white/70",
    heroDisplay: "font-sans",
    button: "bg-[#171717] text-white",
    ctaSurface: "bg-[#171717] text-white",
    secondaryButton: "border-black/10 bg-white",
    muted: "text-[#636363]"
  },
  "Cinematic Luxury": {
    shell: "border-white/10 bg-white/[0.04]",
    accent: "bg-[#8f7457]",
    soft: "bg-white/[0.05]",
    heroDisplay: "font-serif",
    button: "bg-[#f5efe8] text-black",
    ctaSurface: "bg-[#f5efe8] text-black",
    secondaryButton: "border-white/15 bg-white/[0.03]",
    muted: "text-white/65"
  },
  "Bold Modern Contrast": {
    shell: "border-black/10 bg-white/65",
    accent: "bg-[#1d4ed8]",
    soft: "bg-white/50",
    heroDisplay: "font-sans",
    button: "bg-[#0e1727] text-white",
    ctaSurface: "bg-[#0e1727] text-white",
    secondaryButton: "border-black/10 bg-white/45",
    muted: "text-[#5a5a5a]"
  },
  "Structured Professional": {
    shell: "border-[#d8dee9] bg-white/75",
    accent: "bg-[#c9d7f0]",
    soft: "bg-white/65",
    heroDisplay: "font-sans",
    button: "bg-[#162235] text-white",
    ctaSurface: "bg-[#162235] text-white",
    secondaryButton: "border-[#d5dce8] bg-white/70",
    muted: "text-[#5a6678]"
  }
} as const;

function cardShell(preset: StylePresetName) {
  return previewTheme[preset].shell;
}

function renderSection(section: GenerationSection, preset: StylePresetName) {
  const theme = previewTheme[preset];
  switch (section.type) {
    case "Hero":
      return (
        <section className="grid gap-8 border-b border-current/10 px-8 py-10 md:grid-cols-[1.15fr_0.9fr]">
          <div>
            {section.content.eyebrow ? (
              <p className={cn("text-xs uppercase tracking-[0.24em]", theme.muted)}>{section.content.eyebrow}</p>
            ) : null}
            <h2 className={cn("mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-[3.4rem]", theme.heroDisplay)}>
              {section.content.headline}
            </h2>
            <p className={cn("mt-5 max-w-xl text-base leading-7", theme.muted)}>{section.content.supportingText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className={cn("rounded-full px-5 py-3 text-sm font-medium", theme.button)}>
                {section.content.cta}
              </button>
              <button className={cn("rounded-full border px-5 py-3 text-sm", theme.secondaryButton)}>Preview structure</button>
            </div>
          </div>

          <div className={cn("overflow-hidden rounded-[32px] border p-0", cardShell(preset))}>
            <div className={cn("px-6 py-5", theme.accent)}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-black/60">Concept frame</p>
              <p className="mt-2 text-lg font-medium text-black/85">Premium service homepage direction</p>
            </div>
            <div className="grid gap-4 p-6">
              {section.content.stats?.map((stat) => (
                <div key={stat.label} className={cn("rounded-2xl border px-4 py-4", preset === "Cinematic Luxury" ? "border-white/10" : "border-current/10")}>
                  <p className="text-xs uppercase tracking-[0.18em] opacity-60">{stat.label}</p>
                  <p className="mt-2 text-lg font-medium">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "Proof Strip":
      return (
        <section className="border-b border-current/10 px-8 py-6">
          <div className="grid gap-4 md:grid-cols-3">
            {section.content.stats?.map((stat) => (
              <div key={stat.label} className={cn("rounded-[22px] border px-4 py-4", cardShell(preset))}>
                <p className="text-xs uppercase tracking-[0.18em] opacity-60">{stat.label}</p>
                <p className="mt-2 text-lg font-medium">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "Services":
    case "Process":
    case "Testimonials":
      return (
        <section className="border-b border-current/10 px-8 py-10">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight">{section.content.headline}</h3>
            <p className={cn("mt-3 text-base leading-7", theme.muted)}>{section.content.supportingText}</p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {section.content.cards?.map((card) => (
              <article key={card.title} className={cn("rounded-[28px] border p-5", cardShell(preset))}>
                {card.meta ? <p className="text-xs uppercase tracking-[0.18em] opacity-60">{card.meta}</p> : null}
                <h4 className="mt-3 text-xl font-medium">{card.title}</h4>
                <p className={cn("mt-3 text-sm leading-6", theme.muted)}>{card.description}</p>
              </article>
            ))}
          </div>
        </section>
      );
    case "Case Study Preview":
      return (
        <section className="border-b border-current/10 px-8 py-10">
          <div className={cn("grid gap-6 rounded-[36px] border p-6 md:grid-cols-[1fr_1.1fr]", cardShell(preset))}>
            <div className={cn("rounded-[28px] p-8", theme.soft)}>
              <p className="text-xs uppercase tracking-[0.22em] opacity-60">Featured case direction</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight">{section.content.headline}</h3>
              <p className={cn("mt-4 text-sm leading-6", theme.muted)}>{section.content.supportingText}</p>
            </div>
            <div className="grid gap-4">
              {section.content.cards?.map((card) => (
                <div key={card.title} className="rounded-[24px] border border-current/10 p-5">
                  <h4 className="text-lg font-medium">{card.title}</h4>
                  <p className={cn("mt-2 text-sm leading-6", theme.muted)}>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case "Outcomes / Benefits":
      return (
        <section className="grid gap-6 border-b border-current/10 px-8 py-10 md:grid-cols-[1.2fr_0.9fr]">
          <div>
            <h3 className="text-3xl font-semibold tracking-tight">{section.content.headline}</h3>
            <p className={cn("mt-4 max-w-xl text-base leading-7", theme.muted)}>{section.content.supportingText}</p>
          </div>
          <div className={cn("rounded-[28px] border p-5", cardShell(preset))}>
            <ul className="space-y-3">
              {section.content.bullets?.map((bullet) => (
                <li key={bullet} className="rounded-2xl border border-current/10 px-4 py-3 text-sm">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    case "CTA":
      return (
        <section className="border-b border-current/10 px-8 py-10">
          <div className={cn("rounded-[32px] px-8 py-10", theme.ctaSurface)}>
            <h3 className="text-3xl font-semibold tracking-tight">{section.content.headline}</h3>
            <p className={cn("mt-4 max-w-2xl text-base leading-7", preset === "Cinematic Luxury" ? "text-black/70" : "text-white/80")}>
              {section.content.supportingText}
            </p>
            <button className="mt-7 rounded-full bg-white px-5 py-3 text-sm font-medium text-black">
              {section.content.cta}
            </button>
          </div>
        </section>
      );
    case "Footer":
      return (
        <footer className="px-8 py-8">
          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
            <div>
              <h3 className="text-xl font-semibold">{section.content.headline}</h3>
              <p className="mt-3 text-sm leading-6 opacity-75">{section.content.supportingText}</p>
            </div>
            <ul className="grid gap-3">
              {section.content.bullets?.map((bullet) => (
                <li key={bullet} className="text-sm opacity-70">
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </footer>
      );
    default:
      return null;
  }
}

export function HomepagePreview({ result }: HomepagePreviewProps) {
  const theme = previewTheme[result.visualDirection.preset];

  return (
    <div className="rounded-[42px] border border-line bg-white p-4 shadow-soft">
      <div className={cn("overflow-hidden rounded-[34px] border border-black/10 shadow-[0_28px_70px_rgba(17,17,17,0.12)]", toneClasses[result.visualDirection.preset])}>
        <div className="border-b border-current/10 px-8 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={result.visualDirection.preset === "Cinematic Luxury" ? "dark" : "default"}>
              {result.visualDirection.preset}
            </Badge>
            {result.visualDirection.palette.slice(0, 3).map((item) => (
              <Badge key={item} tone={result.visualDirection.preset === "Cinematic Luxury" ? "dark" : "muted"}>
                {item}
              </Badge>
            ))}
          </div>
          <p className={cn("mt-3 max-w-3xl text-sm leading-6", theme.muted)}>{result.visualDirection.summary}</p>
        </div>
        {result.sections.map((section) => (
          <div key={section.type}>{renderSection(section, result.visualDirection.preset)}</div>
        ))}
      </div>
    </div>
  );
}
