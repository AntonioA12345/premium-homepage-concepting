import { ProjectForm } from "@/components/forms/project-form";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Panel className="mb-8 overflow-hidden p-0">
        <div className="border-b border-line bg-panel/70 px-8 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted">New project</Badge>
            <Badge tone="default">Generation starts immediately</Badge>
          </div>
        </div>
        <div className="p-8">
          <SectionHeading
            eyebrow="Create a homepage concept project"
            title="Set the brief, pick the direction, and open directly into the workspace."
            description="Focused on premium homepage direction for service businesses only. The first version is generated immediately so the workspace opens with a live preview and export draft."
          />
        </div>
      </Panel>

      <ProjectForm />
    </main>
  );
}
