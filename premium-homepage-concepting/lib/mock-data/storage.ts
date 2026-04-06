"use client";

import {
  AppUser,
  Project,
  ProjectInput,
  StylePreset,
  Version
} from "@/lib/types";
import { stylePresets } from "@/lib/mock-data/style-presets";

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Request failed");
  }

  return (await response.json()) as T;
}

export function getStylePresets(): StylePreset[] {
  return stylePresets;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const payload = await requestJson<{ user: AppUser | null }>("/api/auth/session");
  return payload.user;
}

export async function signOut() {
  await requestJson<{ ok: boolean }>("/api/auth/session", {
    method: "DELETE"
  });
}

export async function signIn(email: string, fullName?: string): Promise<AppUser> {
  const payload = await requestJson<{ user: AppUser }>("/api/auth/session", {
    method: "POST",
    body: JSON.stringify({ email, fullName })
  });

  return payload.user;
}

export async function getProjects(): Promise<Project[]> {
  return requestJson<Project[]>("/api/projects");
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    return await requestJson<Project>(`/api/projects/${projectId}`);
  } catch {
    return null;
  }
}

export async function createProject(input: ProjectInput): Promise<Project> {
  return requestJson<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ input })
  });
}

export async function updateProject(projectId: string, patch: Partial<ProjectInput>): Promise<Project | null> {
  try {
    return await requestJson<Project>(`/api/projects/${projectId}`, {
      method: "PATCH",
      body: JSON.stringify({ patch })
    });
  } catch {
    return null;
  }
}

export async function getVersions(projectId: string): Promise<Version[]> {
  return requestJson<Version[]>(`/api/projects/${projectId}/versions`);
}

export async function getLatestVersion(projectId: string): Promise<Version | null> {
  const versions = await getVersions(projectId);
  return versions[0] ?? null;
}

export async function createVersion(
  projectId: string,
  projectInput: ProjectInput,
  refinementInstruction?: string
): Promise<Version> {
  return requestJson<Version>(`/api/projects/${projectId}/versions`, {
    method: "POST",
    body: JSON.stringify({ projectInput, refinementInstruction })
  });
}

export async function approveVersion(projectId: string, versionId: string): Promise<Version[]> {
  return requestJson<Version[]>(`/api/projects/${projectId}/versions/${versionId}/approve`, {
    method: "POST"
  });
}
