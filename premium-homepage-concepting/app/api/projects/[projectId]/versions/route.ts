import { NextRequest, NextResponse } from "next/server";
import {
  createVersionForProject,
  listVersionsForProject,
  userCanAccessProject
} from "@/lib/supabase/project-repository";
import { ProjectInput } from "@/lib/types";
import { readSessionUser } from "@/lib/auth/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const sessionUser = await readSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { projectId } = await params;
    const canAccess = await userCanAccessProject(projectId, sessionUser.id);

    if (!canAccess) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const versions = await listVersionsForProject(projectId);
    return NextResponse.json(versions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load versions." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const sessionUser = await readSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { projectId } = await params;
    const canAccess = await userCanAccessProject(projectId, sessionUser.id);

    if (!canAccess) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    const { projectInput, refinementInstruction } = (await request.json()) as {
      projectInput?: ProjectInput;
      refinementInstruction?: string;
    };

    if (!projectInput) {
      return NextResponse.json({ error: "Missing project input." }, { status: 400 });
    }

    const version = await createVersionForProject(projectId, projectInput, refinementInstruction);
    return NextResponse.json(version);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create version." },
      { status: 500 }
    );
  }
}
