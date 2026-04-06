import { NextResponse } from "next/server";
import { approveProjectVersion, userCanAccessProject } from "@/lib/supabase/project-repository";
import { readSessionUser } from "@/lib/auth/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; versionId: string }> }
) {
  try {
    const sessionUser = await readSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { projectId, versionId } = await params;
    const canAccess = await userCanAccessProject(projectId, sessionUser.id);

    if (!canAccess) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const versions = await approveProjectVersion(projectId, versionId);
    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve version." },
      { status: 500 }
    );
  }
}
