"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "@/lib/mock-data/storage";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";
import { AppUser } from "@/lib/types";

const navItems = [
  { href: "/" as Route, label: "Home" },
  { href: "/dashboard" as Route, label: "Dashboard" },
  { href: "/projects/new" as Route, label: "New Project" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsClientReady(true);

    async function loadUser() {
      const sessionUser = await getCurrentUser().catch(() => null);
      if (isMounted) {
        setUser(sessionUser);
        setIsLoadingUser(false);
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const showAuthenticatedUI = isClientReady && !isLoadingUser && Boolean(user);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white text-sm font-semibold text-ink shadow-panel">
            AC
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-muted">AI CONCEPTING</p>
            <p className="text-sm text-ink">Premium homepage direction</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-line bg-white/80 p-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-muted transition hover:text-ink",
                pathname === item.href && "bg-ink text-white hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden min-w-[12rem] text-right sm:block">
            <p className="text-sm font-medium text-ink">{showAuthenticatedUI ? user?.fullName : "Guest session"}</p>
            <p className="text-xs text-muted">{showAuthenticatedUI ? user?.email : "Loading account..."}</p>
          </div>

          <div className="flex items-center gap-2">
            {showAuthenticatedUI ? (
              <button
                className="rounded-full border border-line px-4 py-2 text-sm text-ink transition hover:bg-white"
                onClick={async () => {
                  await signOut();
                  setUser(null);
                  router.push("/auth/sign-in");
                  router.refresh();
                }}
              >
                Sign out
              </button>
            ) : (
              <>
                <Link className="rounded-full px-4 py-2 text-sm text-ink" href="/auth/sign-in">
                  Sign in
                </Link>
                <Link className="rounded-full bg-ink px-4 py-2 text-sm text-white" href="/auth/sign-up">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
