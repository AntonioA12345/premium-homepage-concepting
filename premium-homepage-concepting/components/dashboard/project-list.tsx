"use client";

import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, getProjects, getVersions } from "@/lib/mock-data/storage";
import { AppUser, Project, Version } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ProjectList() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [latestVersions, setLatestVersions] = useState<Record<string, Version | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const sessionUser = await getCurrentUser();

        if (!sessionUser) {
          if (!isMounted) return;
          setUser(null);
          setProjects([]);
          setLatestVersions({});
          return;
        }

        const nextProjects = await getProjects();
        const versionPairs = await Promise.all(
          nextProjects.map(async (project) => [project.id, (await getVersions(project.id))[0] ?? null] as const)
        );

        if (!isMounted) return;

        setUser(sessionUser);
        setProjects(nextProjects);
        setLatestVersions(Object.fromEntries(versionPairs));
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Failed to load dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((item) => (
          <Panel key={item} className="p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-4 h-10 w-3/5" />
            <Skeleton className="mt-4 h-20 w-full" />
          </Panel>
        ))}
      </div>
    );
  }


  if (loadError) {
    return (
      <EmptyState
        title="Could not load dashboard."
        description={loadError}
        action={
          <button className={buttonStyles({})} onClick={() => window.location.reload()}>
            Retry
          </button>
        }
      />
    );
  }

  if (!user) {
    return (
      <EmptyState
        title="Sign in to start creating concepts."
        description="The dashboard unlocks project creation, version history, approval flow, and export handoff views."
        action={
          <Link href="/auth/sign-in" className={buttonStyles({})}>
            Go to sign in
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet."
          description="Create your first service-business homepage concept and the app will open directly into the central workspace experience."
          action={
            <Link href="/projects/new" className={buttonStyles({})}>
              Create first project
            </Link>
          }
        />
      ) : (
        projects.map((project) => {
          const latestVersion = latestVersions[project.id];

          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block transition hover:-translate-y-0.5"
            >
              <Panel className="p-6 hover:shadow-soft">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="muted">{project.stylePreset}</Badge>
                      <Badge tone="muted">{project.businessType}</Badge>
                    </div>
                    <h3 className="mt-5 text-[1.65rem] font-semibold tracking-tight text-ink">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      Audience: {project.audience}. Goal: {project.pageGoal}.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.desiredSections.slice(0, 5).map((section) => (
                        <Badge key={section} tone="default">
                          {section}
                        </Badge>
                      ))}
                      {project.desiredSections.length > 5 ? (
                        <Badge tone="default">+{project.desiredSections.length - 5} more</Badge>
                      ) : null}
                    </div>
                  </div>

                  <div className="min-w-56 rounded-[26px] border border-line bg-panel p-5">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Latest version</p>
                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-3xl font-semibold tracking-tight text-ink">V{latestVersion?.versionNumber ?? 0}</p>
                      <Badge tone={latestVersion?.isApproved ? "success" : "muted"}>
                        {latestVersion?.isApproved ? "Approved" : "In review"}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted">Score {latestVersion?.scorecard.average ?? 0}/10</p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {latestVersion?.isApproved ? "Approved direction selected" : "Open to review, refine, and approve"}
                    </p>
                  </div>
                </div>
              </Panel>
            </Link>
          );
        })
      )}
    </div>
  );
}
