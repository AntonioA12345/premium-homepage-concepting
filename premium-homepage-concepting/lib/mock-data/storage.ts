"use client";

import {
  AppUser,
  Project,
  ProjectInput,
  StylePreset,
  Version
} from "@/lib/types";
import { stylePresets } from "@/lib/mock-data/style-presets";

const USERS_KEY = "premium-homepage-app-users";
const SESSION_KEY = "premium-homepage-app-session";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function makeStableUserId(email: string) {
  const normalized = email.trim().toLowerCase();
  let hashA = 0x811c9dc5;
  let hashB = 0x01000193;

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    hashA ^= code;
    hashA = Math.imul(hashA, 16777619);
    hashB ^= code;
    hashB = Math.imul(hashB, 2246822519);
  }

  const hex = [hashA >>> 0, hashB >>> 0, (hashA ^ hashB) >>> 0, (hashA + hashB) >>> 0]
    .map((value) => value.toString(16).padStart(8, "0"))
    .join("");

  const base = hex.slice(0, 32);
  return `${base.slice(0, 8)}-${base.slice(8, 12)}-4${base.slice(13, 16)}-a${base.slice(17, 20)}-${base.slice(20, 32)}`;
}

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

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

export function getCurrentUser(): AppUser | null {
  const session = safeRead<AppUser | null>(SESSION_KEY, null);

  if (!session) return null;
  const stableId = makeStableUserId(session.email);
  if (session.id === stableId || isUuid(session.id) && session.id === stableId) return session;

  const normalizedUser = {
    ...session,
    id: stableId
  };
  const users = safeRead<AppUser[]>(USERS_KEY, []).map((user) =>
    user.email.toLowerCase() === session.email.toLowerCase() ? normalizedUser : user
  );

  safeWrite(USERS_KEY, users);
  safeWrite(SESSION_KEY, normalizedUser);

  return normalizedUser;
}

export function signOut() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function signIn(email: string, fullName?: string): AppUser {
  const users = safeRead<AppUser[]>(USERS_KEY, []);
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  const stableId = makeStableUserId(email);

  if (existing) {
    const normalizedExisting = {
      ...existing,
      id: stableId
    };
    safeWrite(
      USERS_KEY,
      users.map((user) => (user.email.toLowerCase() === email.toLowerCase() ? normalizedExisting : user))
    );
    safeWrite(SESSION_KEY, normalizedExisting);
    return normalizedExisting;
  }

  const user: AppUser = {
    id: stableId,
    email,
    fullName: fullName ?? email.split("@")[0],
    createdAt: new Date().toISOString()
  };

  safeWrite(USERS_KEY, [...users, user]);
  safeWrite(SESSION_KEY, user);

  return user;
}

export async function getProjects(user?: AppUser | null): Promise<Project[]> {
  if (!user) return [];

  const query = new URLSearchParams({
    userId: user.id
  });

  return requestJson<Project[]>(`/api/projects?${query.toString()}`);
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    return await requestJson<Project>(`/api/projects/${projectId}`);
  } catch {
    return null;
  }
}

export async function createProject(user: AppUser, input: ProjectInput): Promise<Project> {
  return requestJson<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({ user, input })
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
