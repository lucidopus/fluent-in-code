"use client";

import { useState, useTransition } from "react";
import { updateNotes } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function NotesEditor({
  lcNumber,
  defaultValue,
}: {
  lcNumber: number;
  defaultValue: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const dirty = value !== (defaultValue ?? "");

  if (!editing) {
    return (
      <div className="space-y-2">
        {defaultValue ? (
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
            {defaultValue}
          </pre>
        ) : (
          <p className="text-sm text-muted-foreground">No notes.</p>
        )}
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          {defaultValue ? "Edit" : "Add"} notes
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={6}
        placeholder="Pattern signal, gotchas, things you keep forgetting…"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          disabled={!dirty || pending}
          onClick={() => {
            const fd = new FormData();
            fd.set("lcNumber", String(lcNumber));
            fd.set("notes", value);
            start(async () => {
              await updateNotes(fd);
              setEditing(false);
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
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
