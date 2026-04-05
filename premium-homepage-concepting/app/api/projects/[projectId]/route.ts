import { NextRequest, NextResponse } from "next/server";
import {
  getProjectById,
  updateProjectById
} from "@/lib/supabase/project-repository";
import { ProjectInput } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const project = await getProjectById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load project." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { patch } = (await request.json()) as {
      patch?: Partial<ProjectInput>;
    };

    if (!patch) {
      return NextResponse.json({ error: "Missing patch payload." }, { status: 400 });
    }

    const project = await updateProjectById(projectId, patch);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update project." },
      { status: 500 }
    );
  }
}
