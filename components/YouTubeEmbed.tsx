function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/");
      const idx = parts.indexOf("embed");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

export function YouTubeEmbed({ url, title }: { url: string; title?: string }) {
  const id = extractVideoId(url);
  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        {url}
      </a>
    );
  }
  return (
    <div className="overflow-hidden rounded-md border bg-black">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
