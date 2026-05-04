"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { ProblemSearch } from "@/components/ProblemSearch";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/lists/blind-75", label: "blind 75" },
  { href: "/lists/neetcode-150", label: "neetcode 150" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.25em] transition-colors hover:text-primary"
        >
          fluent-in-code
        </Link>
        <nav className="hidden items-center gap-5 text-xs uppercase tracking-wider md:flex">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-1">
          <ProblemSearch />
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
