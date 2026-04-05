import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { ProjectList } from "@/components/dashboard/project-list";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Panel className="overflow-hidden p-0">
        <div className="border-b border-line bg-panel/70 px-8 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted">Dashboard</Badge>
            <Badge tone="default">Service-business homepages only</Badge>
          </div>
        </div>
        <div className="p-8">
          <SectionHeading
            eyebrow="Homepage concept workspace"
            title="Create direction that feels premium before design even starts."
            description="Create projects, iterate on structured homepage concepts, approve the best version, and export cleaner direction for design and build handoff."
            action={
              <Link href="/projects/new" className={buttonStyles({})}>
                New project
              </Link>
            }
          />
        </div>
      </Panel>

      <section className="mt-8">
        <ProjectList />
      </section>
    </main>
  );
}
