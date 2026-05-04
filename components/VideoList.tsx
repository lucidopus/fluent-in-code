import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { AddVideoForm } from "@/components/AddVideoForm";
import { DeleteVideoButton } from "@/components/DeleteVideoButton";
import { formatRelativeTime } from "@/lib/utils";

type Video = {
  _id: string | { toString(): string };
  youtubeUrl: string;
  title: string;
  type: "explainer" | "speed" | "alternate";
  recordedAt: Date | string;
};

export function VideoList({
  lcNumber,
  videos,
}: {
  lcNumber: number;
  videos: Video[];
}) {
  return (
    <div className="space-y-6">
      {videos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No videos yet. Record a YouTube explainer and paste the URL below — teaching the
          problem aloud is the fastest way to lock it in.
        </p>
      ) : (
        videos.map((v) => (
          <div key={String(v._id)} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-medium">{v.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {v.type} · {formatRelativeTime(v.recordedAt)}
                </div>
              </div>
              <DeleteVideoButton lcNumber={lcNumber} videoId={String(v._id)} />
            </div>
            <YouTubeEmbed url={v.youtubeUrl} title={v.title} />
          </div>
        ))
      )}
      <AddVideoForm lcNumber={lcNumber} />
    </div>
  );
}
