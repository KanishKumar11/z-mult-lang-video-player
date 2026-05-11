import { spawn } from "node:child_process";
import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import ffmpeg from "@ffmpeg-installer/ffmpeg";

export async function GET(request: NextRequest) {
  const audioIndex = Number(
    new URL(request.url).searchParams.get("audio") ?? "0",
  );

  // Sanitise: must be a non-negative integer
  if (!Number.isInteger(audioIndex) || audioIndex < 0) {
    return NextResponse.json({ error: "Invalid audio index" }, { status: 400 });
  }

  const file = path.join(process.cwd(), "public", "video.mkv");

  const proc = spawn(ffmpeg.path, [
    "-i",
    file,
    "-map",
    "0:v:0",
    "-map",
    `0:a:${audioIndex}`,
    "-c",
    "copy",
    "-f",
    "mp4",
    // Fragmented MP4: embeds timing info at the start so streaming + basic seek work
    "-movflags",
    "frag_keyframe+empty_moov+default_base_moof",
    "pipe:1",
  ]);

  const body = new ReadableStream<Uint8Array>({
    start(ctrl) {
      proc.stdout.on("data", (chunk: Buffer) =>
        ctrl.enqueue(new Uint8Array(chunk)),
      );
      proc.stdout.on("end", () => ctrl.close());
      proc.stdout.on("error", (e) => ctrl.error(e));
      proc.stderr.on("data", () => {}); // suppress ffmpeg log noise
    },
    cancel() {
      proc.kill("SIGTERM");
    },
  });

  return new NextResponse(body, {
    headers: {
      "Content-Type": "video/mp4",
      "Cache-Control": "no-store",
    },
  });
}
