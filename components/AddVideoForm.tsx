"use client";

import { useState, useTransition } from "react";
import { addVideo } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

export function AddVideoForm({ lcNumber }: { lcNumber: number }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-3 w-3" /> Add video
      </Button>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        start(async () => {
          const res = await addVideo(formData);
          if (!res.ok) {
            setError(res.error ?? "Failed");
            return;
          }
          setOpen(false);
        });
      }}
      className="space-y-3 rounded-md border bg-muted/30 p-4"
    >
      <input type="hidden" name="lcNumber" value={lcNumber} />
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-xs uppercase tracking-wider">title</Label>
        <Input id="title" name="title" required placeholder="Two Sum walkthrough" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="youtubeUrl" className="text-xs uppercase tracking-wider">youtube url</Label>
        <Input id="youtubeUrl" name="youtubeUrl" required type="url" placeholder="https://youtu.be/..." />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="type" className="text-xs uppercase tracking-wider">type</Label>
        <Select name="type" defaultValue="explainer">
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="explainer">Explainer</SelectItem>
            <SelectItem value="speed">Speed run</SelectItem>
            <SelectItem value="alternate">Alternate approach</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
