"use client";

import { useTransition } from "react";
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
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm("Remove this video?")) return;
        const fd = new FormData();
        fd.set("lcNumber", String(lcNumber));
        fd.set("videoId", videoId);
        start(() => deleteVideo(fd).then(() => undefined));
      }}
      aria-label="Remove video"
    >
      <Trash2 className="h-3 w-3" />
    </Button>
  );
}
