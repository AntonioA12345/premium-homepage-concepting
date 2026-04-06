import { cookies } from "next/headers";
import { AppUser } from "@/lib/types";

export const SESSION_COOKIE_NAME = "premium_homepage_session";

export function makeStableUserId(email: string) {
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

function serializeSession(user: AppUser) {
  const payload = JSON.stringify(user);
  return Buffer.from(payload, "utf8").toString("base64url");
}

function deserializeSession(value: string): AppUser | null {
  try {
    const payload = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(payload) as AppUser;

    if (!parsed?.id || !parsed?.email || !parsed?.fullName || !parsed?.createdAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function readSessionUser(): Promise<AppUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) return null;
  return deserializeSession(raw);
}

export async function writeSessionUser(user: AppUser) {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, serializeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearSessionUser() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}
