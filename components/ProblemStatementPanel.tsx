"use client";

import { useState, useTransition } from "react";
import { updateProblemStatement } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, ExternalLink, FileText, Pencil } from "lucide-react";

export function ProblemStatementPanel({
  lcNumber,
  leetcodeUrl,
  defaultValue,
  defaultExpanded = false,
}: {
  lcNumber: number;
  leetcodeUrl: string;
  defaultValue: string | null;
  defaultExpanded?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [collapsed, setCollapsed] = useState(!defaultExpanded);
  const [value, setValue] = useState(defaultValue ?? "");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasStatement = !!defaultValue && defaultValue.trim().length > 0;

  // Empty state — no statement saved yet
  if (!hasStatement && !editing) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-serif-italic text-lg font-light">Problem statement</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste the question once, see it forever — saves you bouncing tabs while you log.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={leetcodeUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" /> LeetCode
              </a>
            </Button>
            <Button size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode
  if (editing) {
    return (
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-serif-italic text-lg font-light">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Problem statement
            </h3>
            <Button asChild variant="outline" size="sm">
              <a href={leetcodeUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" /> Open on LeetCode
              </a>
            </Button>
          </div>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={14}
            placeholder="Paste the question text from LeetCode here. Examples, constraints, edge notes — everything. Plain text, line breaks preserved."
            className="font-mono text-sm leading-relaxed"
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={pending}
              onClick={() => {
                setError(null);
                const fd = new FormData();
                fd.set("lcNumber", String(lcNumber));
                fd.set("problemStatement", value);
                start(async () => {
                  const res = await updateProblemStatement(fd);
                  if (!res.ok) {
                    setError(res.error ?? "Failed");
                    return;
                  }
                  setEditing(false);
                  setCollapsed(false);
                });
              }}
            >
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setValue(defaultValue ?? "");
                setEditing(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // View mode (statement saved)
  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-serif-italic text-lg font-light">Problem statement</h3>
            {collapsed ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <a href={leetcodeUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" /> LeetCode
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-1 h-3 w-3" /> Edit
            </Button>
          </div>
        </div>
        {!collapsed ? (
          <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-4 font-mono text-sm leading-relaxed">
            {defaultValue}
          </pre>
        ) : null}
      </CardContent>
    </Card>
  );
}
