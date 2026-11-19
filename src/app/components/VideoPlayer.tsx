"use client";

import { useEffect, useRef, useState } from "react";

const IN = "🇮🇳";

const FLAGS: Record<string, string> = {
  // Global
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ar: "🇸🇦",
  pt: "🇧🇷",
  ru: "🇷🇺",
  ko: "🇰🇷",
  it: "🇮🇹",
  nl: "🇳🇱",
  tr: "🇹🇷",
  pl: "🇵🇱",
  // Indian — ISO 639-1 (2-letter)
  hi: IN,
  bn: IN,
  te: IN,
  mr: IN,
  ta: IN,
  ur: IN,
  gu: IN,
  kn: IN,
  ml: IN,
  pa: IN,
  or: IN,
  as: IN,
  mai: IN,
  sa: IN,
  kok: IN,
  ne: IN,
  sd: IN,
  ks: IN,
  // Indian — ISO 639-2 (3-letter, used by MKV/Matroska)
  hin: IN,
  ben: IN,
  tel: IN,
  mar: IN,
  tam: IN,
  urd: IN,
  guj: IN,
  kan: IN,
  mal: IN,
  pan: IN,
  ori: IN,
  asm: IN,
  mai2: IN,
  san: IN,
  kok2: IN,
  nep: IN,
  snd: IN,
  kas: IN,
  mni: IN,
  brx: IN,
  doi: IN,
  sat: IN,
};

const NAMES: Record<string, string> = {
  // Global
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  zh: "中文",
  ar: "العربية",
  pt: "Português",
  ru: "Русский",
  ko: "한국어",
  it: "Italiano",
  nl: "Nederlands",
  tr: "Türkçe",
  pl: "Polski",
  // Indian — ISO 639-1 (2-letter)
  hi: "हिन्दी",
  bn: "বাংলা",
  te: "తెలుగు",
  mr: "मराठी",
  ta: "தமிழ்",
  ur: "اردو",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  pa: "ਪੰਜਾਬੀ",
  or: "ଓଡ଼ିଆ",
  as: "অসমীয়া",
  mai: "मैथिली",
  sa: "संस्कृतम्",
  kok: "कोंकणी",
  ne: "नेपाली",
  sd: "سنڌي",
  ks: "کٲشُر",
  // Indian — ISO 639-2 (3-letter, used by MKV/Matroska)
  hin: "हिन्दी",
  ben: "বাংলা",
  tel: "తెలుగు",
  mar: "मराठी",
  tam: "தமிழ்",
  urd: "اردو",
  guj: "ગુજરાતી",
  kan: "ಕನ್ನಡ",
  mal: "മലയാളം",
  pan: "ਪੰਜਾਬੀ",
  ori: "ଓଡ଼ିଆ",
  asm: "অসমীয়া",
  san: "संस्कृतम्",
  nep: "नेपाली",
  snd: "سنڌي",
  kas: "کٲشُر",
  mni: "মৈতৈলোন্",
  brx: "बड़ो",
  doi: "डोगरी",
  sat: "ᱥᱟᱱᱛᱟᱲᱤ",
};

interface ApiTrack {
  audioIndex: number;
  language: string;
  title: string;
  codec: string;
}

interface Track {
  audioIndex: number;
  label: string;
  language: string;
  flag: string;
}

/* ─────────────── language modal ─────────────── */
function LanguageModal({
  tracks,
  onSelect,
}: {
  tracks: Track[];
  onSelect: (t: Track) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)" }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/20 text-2xl">
          🌐
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Select Language
        </h2>
        <p className="mt-1 mb-6 text-sm text-zinc-400">
          Choose your preferred audio track to start watching.
        </p>
        <ul className="space-y-2">
          {tracks.length === 0 ? (
            <li className="flex items-center justify-center gap-3 py-8 text-zinc-400">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-indigo-500" />
              Loading languages…
            </li>
          ) : (
            tracks.map((t) => (
              <li key={t.audioIndex}>
                <button
                  type="button"
                  onClick={() => onSelect(t)}
                  className="group flex w-full items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-3.5 text-left text-white transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-600"
                >
                  <span className="text-2xl leading-none">{t.flag}</span>
                  <div className="flex-1">
                    <p className="font-semibold leading-tight">{t.label}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-widest text-zinc-400 group-hover:text-indigo-200">
                      {t.language}
                    </p>
                  </div>
                  <span className="text-xl text-zinc-500 transition-colors group-hover:text-white">
                    ›
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────── main player ─────────────── */
export function VideoPlayer({ src: _src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showModal, setShowModal] = useState(true);
  const [activeLang, setActiveLang] = useState<Track | null>(null);
  const [videoSrc, setVideoSrc] = useState("");

  // Fetch real track list from ffprobe API on mount
  useEffect(() => {
    fetch("/api/tracks")
      .then((r) => r.json())
      .then(({ tracks: raw }: { tracks: ApiTrack[] }) => {
        setTracks(
          raw.map((t) => ({
            audioIndex: t.audioIndex,
            label: t.title || NAMES[t.language] || t.language,
            language: t.language,
            flag: FLAGS[t.language] ?? "🎵",
          })),
        );
      })
      .catch(console.error);
  }, []);

  const handleSelect = (track: Track) => {
    setActiveLang(track);
    setVideoSrc(`/api/video?audio=${track.audioIndex}`);
    setShowModal(false);
  };

  return (
    <div className="relative w-full">
      {showModal && <LanguageModal tracks={tracks} onSelect={handleSelect} />}

      {/* Active language badge + change button */}
      {activeLang && !showModal && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm border border-white/10">
            <span>{activeLang.flag}</span>
            <span>{activeLang.label}</span>
          </span>
          {tracks.length > 1 && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm border border-white/10 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              Change
            </button>
          )}
        </div>
      )}

      {/* Native video — src is the ffmpeg streaming endpoint */}
      <video
        ref={videoRef}
        src={videoSrc || undefined}
        controls={!showModal}
        autoPlay={!!videoSrc}
        playsInline
        className="w-full rounded-2xl bg-black aspect-video"
      />
    </div>
  );
}
