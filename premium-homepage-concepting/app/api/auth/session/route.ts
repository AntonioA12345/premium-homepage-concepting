import { NextRequest, NextResponse } from "next/server";
import { clearSessionUser, makeStableUserId, readSessionUser, writeSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AppUser } from "@/lib/types";

export async function GET() {
  try {
    const user = await readSessionUser();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load session." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, fullName } = (await request.json()) as {
      email?: string;
      fullName?: string;
    };

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user: AppUser = {
      id: makeStableUserId(normalizedEmail),
      email: normalizedEmail,
      fullName: fullName?.trim() || normalizedEmail.split("@")[0],
      createdAt: new Date().toISOString()
    };

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("users").upsert(
      {
        id: user.id,
        email: user.email,
        full_name: user.fullName
      },
      { onConflict: "id" }
    );

    if (error) {
      throw new Error(error.message);
    }

    await writeSessionUser(user);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create session." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearSessionUser();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to clear session." },
      { status: 500 }
    );
  }
}
