"use client";

import { Button } from "@/components/ui/button";
import { FieldWrapper, TextArea, TextInput } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { HOMEPAGE_SECTION_OPTIONS, STYLE_PRESET_NAMES } from "@/lib/constants";
import { createProject, getCurrentUser } from "@/lib/mock-data/storage";
import { AppUser, HomepageSectionType, ProjectInput, StylePresetName } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const defaultInput: ProjectInput = {
  title: "",
  businessType: "",
  audience: "",
  pageGoal: "",
  stylePreset: "Editorial Premium",
  desiredSections: HOMEPAGE_SECTION_OPTIONS,
  notes: ""
};

export function ProjectForm() {
  const router = useRouter();
  const [input, setInput] = useState<ProjectInput>(defaultInput);
  const selectedSectionCount = input.desiredSections.length;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const sessionUser = await getCurrentUser().catch(() => null);
      if (isMounted) {
        setUser(sessionUser);
        setIsLoadingUser(false);
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  function toggleSection(section: HomepageSectionType) {
    setInput((current) => ({
      ...current,
      desiredSections: current.desiredSections.includes(section)
        ? current.desiredSections.filter((item) => item !== section)
        : [...current.desiredSections, section]
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoadingUser) {
      return;
    }

    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    try {
      setIsSubmitting(true);
      const project = await createProject(input);
      router.push(`/projects/${project.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Panel className="p-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FieldWrapper label="Project name">
            <TextInput
            required
            value={input.title}
            onChange={(event) => setInput((current) => ({ ...current, title: event.target.value }))}
            placeholder="Northshore Advisory Homepage"
            />
          </FieldWrapper>

          <FieldWrapper label="Business type">
            <TextInput
            required
            value={input.businessType}
            onChange={(event) => setInput((current) => ({ ...current, businessType: event.target.value }))}
            placeholder="Boutique financial advisory"
            />
          </FieldWrapper>

          <FieldWrapper label="Target audience">
            <TextInput
            required
            value={input.audience}
            onChange={(event) => setInput((current) => ({ ...current, audience: event.target.value }))}
            placeholder="High-net-worth founders and operators"
            />
          </FieldWrapper>

          <FieldWrapper label="Page goal">
            <TextInput
            required
            value={input.pageGoal}
            onChange={(event) => setInput((current) => ({ ...current, pageGoal: event.target.value }))}
            placeholder="Drive qualified consultation requests"
            />
          </FieldWrapper>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Panel className="p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Style preset</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Pick the design direction</h2>
            </div>
            <p className="max-w-52 text-right text-xs leading-5 text-muted">Each preset changes preview tone, section treatment, and export voice.</p>
          </div>
          <div className="mt-6 grid gap-3">
            {STYLE_PRESET_NAMES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setInput((current) => ({ ...current, stylePreset: preset as StylePresetName }))}
                className={cn(
                  "rounded-[24px] border px-5 py-4 text-left transition",
                  input.stylePreset === preset
                    ? "border-ink bg-ink text-white shadow-[0_18px_35px_rgba(17,17,17,0.14)]"
                    : "border-line bg-panel hover:border-ink/20 hover:bg-white"
                )}
              >
                <p className="font-medium">{preset}</p>
                <p className={cn("mt-1 text-sm", input.stylePreset === preset ? "text-white/75" : "text-muted")}>
                  Premium homepage direction tuned for service business positioning.
                </p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Desired sections</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Shape the homepage structure</h2>
            </div>
            <div className="rounded-2xl border border-line bg-panel px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Selected</p>
              <p className="mt-1 text-lg font-semibold text-ink">{selectedSectionCount} sections</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HOMEPAGE_SECTION_OPTIONS.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={cn(
                  "rounded-[22px] border px-4 py-3 text-left text-sm transition",
                  input.desiredSections.includes(section)
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-panel text-ink hover:border-ink/20 hover:bg-white"
                )}
              >
                {section}
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="p-8">
        <FieldWrapper
          label="Optional notes"
          hint="Positioning nuance, constraints, tone cues"
        >
          <TextArea
          rows={5}
          value={input.notes}
          onChange={(event) => setInput((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Mention positioning cues, offer nuance, desired emotional tone, or constraints."
          />
        </FieldWrapper>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm leading-6 text-muted">
            Project creation immediately generates the first homepage concept version so the workspace opens with a
            usable preview, scorecard, and export draft.
          </p>
          <Button type="submit" disabled={isSubmitting || isLoadingUser}>
            {isLoadingUser ? "Loading session..." : isSubmitting ? "Creating project..." : "Create project"}
          </Button>
        </div>
      </Panel>
    </form>
  );
}
