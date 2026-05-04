"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});

export function CodeEditor({
  name,
  defaultValue = "",
  language = "python",
  height = "320px",
}: {
  name: string;
  defaultValue?: string;
  language?: string;
  height?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="overflow-hidden rounded-md border">
      <input type="hidden" name={name} value={value} />
      <Monaco
        height={height}
        language={language}
        value={value}
        onChange={(v) => setValue(v ?? "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-geist-mono), ui-monospace, Menlo, monospace",
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          tabSize: 4,
          insertSpaces: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
}
