/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  serverExternalPackages: [
    "@ffprobe-installer/ffprobe",
    "@ffmpeg-installer/ffmpeg",
    "@ffprobe-installer/win32-x64",
    "@ffmpeg-installer/win32-x64",
  ],

  async headers() {
    return [
      {
        source: "/:path*.mkv",
        headers: [
          { key: "Content-Type", value: "video/x-matroska" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
