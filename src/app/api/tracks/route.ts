import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import ffprobe from "@ffprobe-installer/ffprobe";

const exec = promisify(execFile);

interface FfprobeStream {
  index: number;
  codec_name: string;
  tags?: { language?: string; title?: string };
}

export async function GET() {
  const file = path.join(process.cwd(), "public", "video.mkv");

  try {
    const { stdout } = await exec(ffprobe.path, [
      "-v", "quiet",
      "-print_format", "json",
      "-show_streams",
      "-select_streams", "a",
      file,
    ]);

    const { streams } = JSON.parse(stdout) as { streams: FfprobeStream[] };

    const tracks = streams.map((s, i) => ({
      audioIndex: i,
      language: s.tags?.language ?? "und",
      title: s.tags?.title ?? s.tags?.language ?? `Track ${i + 1}`,
      codec: s.codec_name,
    }));

    return NextResponse.json({ tracks });
  } catch (err) {
    console.error("[/api/tracks]", err);
    return NextResponse.json({ tracks: [], error: "Could not probe video" }, { status: 500 });
  }
}
