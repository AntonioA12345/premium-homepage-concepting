import { NextRequest, NextResponse } from "next/server";
import {
  createProjectWithInitialVersion,
  listProjectsForUser
} from "@/lib/supabase/project-repository";
import { ProjectInput } from "@/lib/types";
import { readSessionUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await readSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const projects = await listProjectsForUser(user.id);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await readSessionUser();
    const { input } = (await request.json()) as {
      input?: ProjectInput;
    };

    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!input) {
      return NextResponse.json({ error: "Missing project payload." }, { status: 400 });
    }

    const project = await createProjectWithInitialVersion(sessionUser, input);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project." },
      { status: 500 }
    );
  }
}
