"use client";

import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { approveVersion } from "@/lib/mock-data/storage";
import { Version } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface VersionHistoryProps {
  projectId: string;
  versions: Version[];
  currentVersionId?: string;
  onSelectVersion: (versionId: string) => void;
  onApprovalChange: () => void;
}

export function VersionHistory({
  projectId,
  versions,
  currentVersionId,
  onSelectVersion,
  onApprovalChange
}: VersionHistoryProps) {
  const [isApprovingId, setIsApprovingId] = useState<string | null>(null);
  return (
    <Panel className="p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Version history</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Review iterations</h2>
        </div>
        <div className="rounded-[20px] border border-line bg-panel px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Saved</p>
          <p className="text-base font-semibold text-ink">{versions.length}</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {versions.map((version) => (
          <div
            key={version.id}
            className={cn(
              "rounded-[26px] border p-4 transition",
              currentVersionId === version.id
                ? "border-ink bg-ink text-white shadow-[0_24px_50px_rgba(17,17,17,0.16)]"
                : version.isApproved
                  ? "border-emerald-200 bg-emerald-50/70"
                  : "border-line bg-panel hover:border-ink/20 hover:bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <button className="block flex-1 text-left" onClick={() => onSelectVersion(version.id)}>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold tracking-tight">Version {version.versionNumber}</p>
                  {currentVersionId === version.id ? (
                    <Badge tone="dark">Selected</Badge>
                  ) : null}
                </div>
                <div className={cn("mt-3 flex flex-wrap items-center gap-2 text-xs", currentVersionId === version.id ? "text-white/70" : "text-muted")}>
                  <span>Score {version.scorecard.average}/10</span>
                  <span className="opacity-50">•</span>
                  <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                </div>
                {version.refinementInstruction ? (
                  <p className={cn("mt-3 text-sm leading-6", currentVersionId === version.id ? "text-white/82" : "text-muted")}>
                    {version.refinementInstruction}
                  </p>
                ) : (
                  <p className={cn("mt-3 text-sm leading-6", currentVersionId === version.id ? "text-white/65" : "text-muted")}>
                    Initial concept generation from the project brief.
                  </p>
                )}
              </button>
              <Badge tone={version.isApproved ? "success" : currentVersionId === version.id ? "dark" : "muted"}>
                {version.isApproved ? "Approved" : "Draft"}
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-current/10 pt-4">
              <div className={cn("text-xs uppercase tracking-[0.18em]", currentVersionId === version.id ? "text-white/55" : "text-muted")}>
                {version.isApproved ? "Selected for handoff" : "Available for review"}
              </div>
              {!version.isApproved ? (
                <button
                  onClick={async () => {
                    try {
                      setIsApprovingId(version.id);
                      await approveVersion(projectId, version.id);
                      onApprovalChange();
                    } finally {
                      setIsApprovingId(null);
                    }
                  }}
                  className={cn(
                    "inline-flex rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                    currentVersionId === version.id
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-line text-ink hover:bg-white"
                  )}
                  disabled={isApprovingId === version.id}
                >
                  {isApprovingId === version.id ? "Approving..." : "Mark approved"}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
