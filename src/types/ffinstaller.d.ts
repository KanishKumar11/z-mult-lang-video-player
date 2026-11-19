declare module "@ffprobe-installer/ffprobe" {
  const installer: { path: string; version: string; url: string };
  export = installer;
}

declare module "@ffmpeg-installer/ffmpeg" {
  const installer: { path: string; version: string; url: string };
  export = installer;
}
