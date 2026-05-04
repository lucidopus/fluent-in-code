"use client";

import { useState, useTransition } from "react";
import { updateDiagram } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DiagramField({
  lcNumber,
  defaultValue,
}: {
  lcNumber: number;
  defaultValue: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const [pending, start] = useTransition();

  if (!editing && defaultValue) {
    return (
      <div className="space-y-2">
        <div className="overflow-hidden rounded-md border bg-muted/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={defaultValue} alt="Problem diagram" className="max-h-96 w-full object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Replace</Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => {
              const fd = new FormData();
              fd.set("lcNumber", String(lcNumber));
              fd.set("diagramUrl", "");
              start(async () => { await updateDiagram(fd); });
            }}
          >Remove</Button>
        </div>
      </div>
    );
  }

  if (!editing && !defaultValue) {
    return (
      <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
        Add diagram URL
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        type="url"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://i.imgur.com/... or excalidraw share URL"
      />
      <p className="text-xs text-muted-foreground">
        Imgur, Excalidraw exports, or any direct image URL. Useful for trees, graphs, linked lists.
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() => {
            const fd = new FormData();
            fd.set("lcNumber", String(lcNumber));
            fd.set("diagramUrl", value);
            start(async () => {
              await updateDiagram(fd);
              setEditing(false);
            });
          }}
        >Save</Button>
        <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setValue(defaultValue ?? ""); }}>Cancel</Button>
      </div>
    </div>
  );
}
