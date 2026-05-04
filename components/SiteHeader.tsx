import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { ProblemSearch } from "@/components/ProblemSearch";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="font-mono text-xs uppercase tracking-[0.25em] hover:text-primary">
          fluent-in-code
        </Link>
        <nav className="hidden items-center gap-5 text-xs uppercase tracking-wider text-muted-foreground md:flex">
          <Link href="/lists/blind-75" className="transition-colors hover:text-foreground">
            blind 75
          </Link>
          <Link href="/lists/neetcode-150" className="transition-colors hover:text-foreground">
            neetcode 150
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ProblemSearch />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
