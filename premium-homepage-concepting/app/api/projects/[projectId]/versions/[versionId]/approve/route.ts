import { NextResponse } from "next/server";
import { approveProjectVersion } from "@/lib/supabase/project-repository";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; versionId: string }> }
) {
  try {
    const { projectId, versionId } = await params;
    const versions = await approveProjectVersion(projectId, versionId);
    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to approve version." },
      { status: 500 }
    );
  }
}
