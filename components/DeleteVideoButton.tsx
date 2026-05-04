"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteVideo } from "@/app/problems/[lcNumber]/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteVideoButton({
  lcNumber,
  videoId,
}: {
  lcNumber: number;
  videoId: string;
}) {
  const [pending, start] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          disabled={pending}
          onClick={() => {
            const fd = new FormData();
            fd.set("lcNumber", String(lcNumber));
            fd.set("videoId", videoId);
            start(async () => {
              const res = await deleteVideo(fd);
              if (!res.ok) toast.error(res.error ?? "Failed to remove video");
              else setConfirming(false);
            });
          }}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          {pending ? "Removing…" : "Confirm"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      aria-label="Remove video"
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}
