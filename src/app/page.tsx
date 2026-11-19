import { VideoPlayer } from "./components/VideoPlayer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-10">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-indigo-700/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl">
        <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
          <VideoPlayer src="/video.mkv" />
        </div>
      </div>
    </main>
  );
}
