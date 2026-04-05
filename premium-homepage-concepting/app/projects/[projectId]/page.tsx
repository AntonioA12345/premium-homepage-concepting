import { WorkspaceClient } from "@/components/workspace/workspace-client";

export default async function ProjectWorkspacePage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <main className="mx-auto max-w-[1600px] px-6 py-12">
      <WorkspaceClient projectId={projectId} />
    </main>
  );
}
