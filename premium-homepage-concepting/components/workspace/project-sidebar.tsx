"use client";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { TextArea } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { HOMEPAGE_SECTION_OPTIONS, STYLE_PRESET_NAMES } from "@/lib/constants";
import { createVersion, updateProject } from "@/lib/mock-data/storage";
import { HomepageSectionType, Project } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface ProjectSidebarProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
  onVersionCreated: () => void;
}

export function ProjectSidebar({ project, onProjectUpdate, onVersionCreated }: ProjectSidebarProps) {
  const [refinement, setRefinement] = useState("");
  const [isSavingVersion, setIsSavingVersion] = useState(false);

  async function toggleSection(section: HomepageSectionType) {
    const nextProject = await updateProject(project.id, {
      desiredSections: project.desiredSections.includes(section)
        ? project.desiredSections.filter((item) => item !== section)
        : [...project.desiredSections, section]
    });

    if (nextProject) {
      onProjectUpdate(nextProject);
    }
  }

  return (
    <aside className="space-y-5">
      <Panel className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Project settings</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Project brief</h2>
          </div>
          <Badge tone="muted">{project.stylePreset}</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          Keep the project strategy visible while you iterate the concept.
        </p>
        <div className="mt-6 grid gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Project</p>
            <p className="mt-1 text-base font-medium text-ink">{project.title}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Business type</p>
            <p className="mt-1 text-sm leading-6 text-ink">{project.businessType}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Audience</p>
            <p className="mt-1 text-sm leading-6 text-ink">{project.audience}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Page goal</p>
            <p className="mt-1 text-sm leading-6 text-ink">{project.pageGoal}</p>
          </div>
        </div>
      </Panel>

      <Panel className="p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Style preset</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Visual direction</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-2.5">
          {STYLE_PRESET_NAMES.map((preset) => (
            <button
              key={preset}
              onClick={async () => {
                const nextProject = await updateProject(project.id, { stylePreset: preset });
                if (nextProject) onProjectUpdate(nextProject);
              }}
              className={cn(
                "rounded-[24px] border px-4 py-3.5 text-left text-sm transition",
                project.stylePreset === preset
                  ? "border-ink bg-ink text-white shadow-[0_16px_32px_rgba(17,17,17,0.12)]"
                  : "border-line bg-panel hover:border-ink/20 hover:bg-white"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Sections</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Page structure</h2>
          </div>
          <div className="rounded-[20px] border border-line bg-panel px-3 py-2 text-right">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Count</p>
            <p className="text-base font-semibold text-ink">{project.desiredSections.length}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-2.5">
          {HOMEPAGE_SECTION_OPTIONS.map((section) => (
            <button
              key={section}
            onClick={() => toggleSection(section)}
              className={cn(
                "rounded-[24px] border px-4 py-3.5 text-left text-sm transition",
                project.desiredSections.includes(section)
                  ? "border-ink bg-panel text-ink shadow-[inset_0_0_0_1px_rgba(17,17,17,0.06)]"
                  : "border-line bg-white text-muted hover:border-ink/20"
              )}
            >
              {section}
            </button>
          ))}
        </div>
      </Panel>

      <Panel className="overflow-hidden p-0">
        <div className="border-b border-line bg-panel/80 px-6 py-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Refinement input</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Iterate the concept</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Use one or two direct instructions. Focus on hierarchy, tone, proof, or section flow.
          </p>
        </div>
        <div className="p-6">
        <TextArea
          rows={7}
          value={refinement}
          onChange={(event) => setRefinement(event.target.value)}
          className="bg-white"
          placeholder="Make the hero feel more authoritative, tighten the proof strip, and lean further into premium advisory cues."
        />
        <div className="mt-4 rounded-[22px] border border-line bg-panel px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Best use</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Ask for sharper positioning, stronger proof, cleaner spacing, calmer luxury cues, or more direct conversion structure.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <Button
            className="w-full"
            disabled={isSavingVersion}
            onClick={async () => {
              try {
                setIsSavingVersion(true);
                await createVersion(project.id, project, refinement || undefined);
                setRefinement("");
                onVersionCreated();
              } finally {
                setIsSavingVersion(false);
              }
            }}
          >
            {isSavingVersion ? "Saving version..." : "Refine concept"}
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            disabled={isSavingVersion}
            onClick={async () => {
              try {
                setIsSavingVersion(true);
                await createVersion(project.id, project);
                onVersionCreated();
              } finally {
                setIsSavingVersion(false);
              }
            }}
          >
            Regenerate
          </Button>
        </div>
        </div>
      </Panel>
    </aside>
  );
}
