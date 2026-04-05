import { NextRequest, NextResponse } from "next/server";
import {
  createProjectWithInitialVersion,
  listProjectsForUser
} from "@/lib/supabase/project-repository";
import { AppUser, ProjectInput } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    const projects = await listProjectsForUser(userId);
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
    const { user, input } = (await request.json()) as {
      user?: AppUser;
      input?: ProjectInput;
    };

    if (!user || !input) {
      return NextResponse.json({ error: "Missing project payload." }, { status: 400 });
    }

    const project = await createProjectWithInitialVersion(user, input);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create project." },
      { status: 500 }
    );
  }
}
