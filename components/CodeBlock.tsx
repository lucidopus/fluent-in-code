"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
});

export function CodeBlock({
  code,
  language = "python",
  height = "400px",
}: {
  code: string;
  language?: string;
  height?: string;
}) {
  if (!code) {
    return (
      <div className="rounded-md border bg-muted/30 p-6 text-sm text-muted-foreground">
        No code logged yet.
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-md border">
      <Monaco
        height={height}
        defaultLanguage={language}
        defaultValue={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-geist-mono), ui-monospace, Menlo, monospace",
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "none",
          lineNumbers: "on",
          scrollbar: { vertical: "auto", horizontal: "auto" },
        }}
      />
    </div>
  );
}
