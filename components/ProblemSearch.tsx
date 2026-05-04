"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchAction } from "@/app/actions";

type Result = {
  lcNumber: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export function ProblemSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      start(async () => {
        const data = await searchAction(q);
        setResults(data);
        setOpen(true);
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search…"
          className="h-8 w-32 pl-8 text-sm md:w-56"
        />
      </div>
      {open && results.length > 0 ? (
        <div className="absolute right-0 mt-2 w-80 rounded-md border bg-background shadow-lg">
          <ul className="max-h-80 divide-y overflow-y-auto">
            {results.map((r) => (
              <li key={r.lcNumber}>
                <Link
                  href={`/problems/${r.lcNumber}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="font-mono text-xs text-muted-foreground">#{r.lcNumber}</span>
                  <span className="flex-1 truncate">{r.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.difficulty}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
