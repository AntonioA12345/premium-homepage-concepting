import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { Project, Version } from "@/lib/types";

interface ExportPanelProps {
  project: Project;
  version: Version;
}

export function ExportPanel({ project, version }: ExportPanelProps) {
  const result = version.structuredOutput;

  return (
    <Panel className="overflow-hidden p-0">
      <div className="border-b border-line bg-panel/80 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Export handoff</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">Ship cleaner direction</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Structured output for Figma, Codex, and Webflow handoff without extra cleanup.
            </p>
          </div>
          <Badge tone={version.isApproved ? "success" : "muted"}>
            {version.isApproved ? "Approved" : "Draft"}
          </Badge>
        </div>
      </div>

      <div className="space-y-6 p-6 text-sm text-ink">
        <section className="rounded-[24px] border border-line bg-panel p-4">
          <h3 className="font-medium">Project summary</h3>
          <p className="mt-2 leading-6 text-muted">{result.projectSummary}</p>
        </section>

        <section className="rounded-[24px] border border-line bg-panel p-4">
          <h3 className="font-medium">Style preset summary</h3>
          <p className="mt-2 leading-6 text-muted">{result.visualDirection.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.visualDirection.moodKeywords.map((keyword) => (
              <Badge key={keyword} tone="default">
                {keyword}
              </Badge>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-line bg-panel p-4">
          <h3 className="font-medium">Section order</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {result.sections.map((section) => (
              <Badge key={section.type} tone="default">
                {section.type}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-medium">Section blueprint</h3>
          <div className="mt-3 space-y-3">
            {result.sections.map((section) => (
              <div key={section.type} className="rounded-[24px] border border-line bg-panel p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{section.type}</p>
                  <Badge tone="default">{section.variant}</Badge>
                </div>
                <p className="mt-2 leading-6 text-muted">{section.purpose}</p>
                <div className="mt-4 space-y-2 border-t border-line pt-4">
                  <p className="text-muted">Layout: {section.layoutNotes}</p>
                  <p className="text-muted">Visual notes: {section.visualNotes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-line bg-panel p-4">
          <h3 className="font-medium">Image direction</h3>
          <ul className="mt-3 space-y-3 text-muted">
            {result.exportNotes.imageDirection.map((note) => (
              <li key={note} className="leading-6">{note}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-medium">Figma / Codex-ready prompt</h3>
          <div className="mt-3 rounded-[24px] border border-line bg-[#111111] p-4 font-mono text-xs leading-6 text-white/80">
            {version.exportPrompt}
          </div>
        </section>

        <section className="rounded-[24px] border border-line bg-panel p-4">
          <h3 className="font-medium">Webflow-friendly notes</h3>
          <ul className="mt-3 space-y-3 text-muted">
            {result.exportNotes.webflowNotes.map((note) => (
              <li key={note} className="leading-6">{note}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] border border-line bg-panel p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Current approval state</p>
          <p className="mt-2 font-medium leading-6 text-ink">
            {version.isApproved ? `Approved version selected for ${project.title}` : "Version not yet approved"}
          </p>
        </section>
      </div>
    </Panel>
  );
}
