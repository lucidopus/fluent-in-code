"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { searchAction } from "@/app/actions";
import { cn } from "@/lib/utils";

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
  const [highlight, setHighlight] = useState(0);
  const [, start] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    function onKey(e: KeyboardEvent) {
      if (!((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) return;
      const t = e.target as HTMLElement | null;
      // Don't yank focus away from prose-writing surfaces (Deep Log textareas).
      if (t && (t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (t === inputRef.current) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setHighlight(0);
      return;
    }
    const timer = setTimeout(() => {
      start(async () => {
        const data = await searchAction(q);
        setResults(data);
        setHighlight(0);
        setOpen(true);
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [query]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[highlight];
      if (r) {
        setOpen(false);
        setQuery("");
        router.push(`/problems/${r.lcNumber}`);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={onInputKey}
          placeholder="Search…"
          className="h-8 w-32 pl-8 pr-12 text-sm md:w-56"
          aria-label="Search problems"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:flex">
          <kbd className="rounded border bg-muted/50 px-1 leading-snug">⌘</kbd>
          <kbd className="rounded border bg-muted/50 px-1 leading-snug">K</kbd>
        </span>
      </div>
      {open && results.length > 0 ? (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-80 rounded-md border bg-popover shadow-lg"
        >
          <ul className="max-h-80 divide-y overflow-y-auto">
            {results.map((r, i) => (
              <li key={r.lcNumber}>
                <Link
                  href={`/problems/${r.lcNumber}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={() => setHighlight(i)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm",
                    i === highlight && "bg-muted",
                  )}
                  role="option"
                  aria-selected={i === highlight}
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
          <div className="flex items-center justify-between border-t px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>
              <kbd className="rounded border bg-muted/50 px-1">↑</kbd>
              <kbd className="ml-1 rounded border bg-muted/50 px-1">↓</kbd>
              <span className="ml-2">navigate</span>
            </span>
            <span>
              <kbd className="rounded border bg-muted/50 px-1">↵</kbd>
              <span className="ml-2">open</span>
            </span>
            <span>
              <kbd className="rounded border bg-muted/50 px-1">esc</kbd>
              <span className="ml-2">close</span>
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
