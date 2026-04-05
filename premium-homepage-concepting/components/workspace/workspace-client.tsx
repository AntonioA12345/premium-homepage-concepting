"use client";

import { HomepagePreview } from "@/components/preview/homepage-preview";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel } from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { ExportPanel } from "@/components/workspace/export-panel";
import { ProjectSidebar } from "@/components/workspace/project-sidebar";
import { VersionHistory } from "@/components/workspace/version-history";
import { getLatestVersion, getProject, getVersions } from "@/lib/mock-data/storage";
import { Project, Version } from "@/lib/types";
import { useEffect, useState } from "react";

interface WorkspaceClientProps {
  projectId: string;
}

export function WorkspaceClient({ projectId }: WorkspaceClientProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  async function refreshData(preferredVersionId?: string) {
    try {
      setIsLoading(true);
      const [nextProject, nextVersions, fallbackVersion] = await Promise.all([
        getProject(projectId),
        getVersions(projectId),
        getLatestVersion(projectId)
      ]);

      setProject(nextProject);
      setVersions(nextVersions);
      setSelectedVersionId(preferredVersionId ?? nextProject?.currentVersionId ?? fallbackVersion?.id);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshData();
  }, [projectId]);

  const activeVersion =
    versions.find((version) => version.id === selectedVersionId) ??
    versions.find((version) => version.isApproved) ??
    versions[0];

  if (isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1.2fr)_390px]">
        <Panel className="space-y-4 p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-48 w-full" />
        </Panel>
        <div className="space-y-6">
          <Panel className="p-7">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-4 h-12 w-2/3" />
            <Skeleton className="mt-4 h-24 w-full" />
          </Panel>
          <Skeleton className="h-[980px] w-full rounded-[40px]" />
        </div>
        <div className="space-y-6">
          <Panel className="p-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-4 h-80 w-full" />
          </Panel>
          <Panel className="p-6">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-4 h-[28rem] w-full" />
          </Panel>
        </div>
      </div>
    );
  }

  if (!project || !activeVersion) {
    return (
      <EmptyState
        title="Project not found."
        description="Create a project from the dashboard to start generating concepts."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1.2fr)_390px]">
      <div className="xl:sticky xl:top-[102px] xl:self-start">
        <ProjectSidebar
          project={project}
          onProjectUpdate={(nextProject) => {
            setProject(nextProject);
            void refreshData();
          }}
          onVersionCreated={() => void refreshData()}
        />
      </div>

      <div className="space-y-6">
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-line bg-panel/70 px-7 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="muted">Workspace</Badge>
              <Badge tone="default">{project.stylePreset}</Badge>
              <Badge tone={activeVersion.isApproved ? "success" : "muted"}>
                {activeVersion.isApproved ? "Approved version" : "Draft version"}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-6 p-7 md:flex-row md:items-end md:justify-between">
            <div className="max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Signature workspace</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-[2.7rem]">{project.title}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
                Generate, preview, refine, approve, and export premium homepage direction for service businesses.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-line bg-panel px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Business</p>
                  <p className="mt-2 text-sm font-medium text-ink">{project.businessType}</p>
                </div>
                <div className="rounded-[24px] border border-line bg-panel px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Audience</p>
                  <p className="mt-2 text-sm font-medium text-ink">{project.audience}</p>
                </div>
                <div className="rounded-[24px] border border-line bg-panel px-4 py-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Goal</p>
                  <p className="mt-2 text-sm font-medium text-ink">{project.pageGoal}</p>
                </div>
              </div>
            </div>
            <div className="min-w-[255px] rounded-[28px] border border-line bg-[#171717] px-5 py-5 text-white shadow-[0_28px_60px_rgba(17,17,17,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Selected version</p>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-4xl font-semibold tracking-tight">V{activeVersion.versionNumber}</p>
                <Badge tone={activeVersion.isApproved ? "success" : "dark"}>
                  {activeVersion.isApproved ? "Approved" : "In progress"}
                </Badge>
              </div>
              <p className="mt-4 text-sm text-white/70">Score {activeVersion.scorecard.average}/10</p>
              <p className="mt-1 text-sm text-white/60">Saved {new Date(activeVersion.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </Panel>

        <HomepagePreview result={activeVersion.structuredOutput} />
      </div>

      <div className="space-y-6 xl:sticky xl:top-[102px] xl:self-start">
        <VersionHistory
          projectId={project.id}
          versions={versions}
          currentVersionId={activeVersion.id}
          onSelectVersion={setSelectedVersionId}
          onApprovalChange={() => void refreshData(activeVersion.id)}
        />
        <Panel className="p-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Scorecard</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Version assessment</h2>
          <div className="mt-5 grid gap-3">
            {Object.entries(activeVersion.scorecard).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between rounded-[24px] border border-line bg-panel px-4 py-3.5 text-sm">
                <span className="capitalize text-muted">{key.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-medium text-ink">{value}/10</span>
              </div>
            ))}
          </div>
        </Panel>
        <ExportPanel project={project} version={activeVersion} />
      </div>
    </div>
  );
}
