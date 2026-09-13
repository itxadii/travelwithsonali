"use client";

import React, { useState, useEffect, useRef } from "react";
import { Music } from "lucide-react";

/**
 * Custom MusicSlash icon matching Lucide's 24x24 stroke style.
 */
function MusicSlashIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
      <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" />
    </svg>
  );
}

export default function AmbientAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const manualPauseRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("/audio/birdsaudio.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;

    // Check localStorage preference
    const savedPaused = localStorage.getItem("tws_audio_paused");

    if (savedPaused === "true") {
      manualPauseRef.current = true;
      setIsPlaying(false);
    } else {
      // Attempt autoplay
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay blocked by browser policy; wait for first user gesture
            setIsPlaying(false);

            const handleFirstInteraction = () => {
              if (!manualPauseRef.current && audioRef.current) {
                audioRef.current
                  .play()
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch(() => {});
              }
              window.removeEventListener("click", handleFirstInteraction);
              window.removeEventListener("keydown", handleFirstInteraction);
              window.removeEventListener("touchstart", handleFirstInteraction);
            };

            window.addEventListener("click", handleFirstInteraction, { once: true });
            window.addEventListener("keydown", handleFirstInteraction, { once: true });
            window.addEventListener("touchstart", handleFirstInteraction, { once: true });
          });
      }
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      manualPauseRef.current = true;
      localStorage.setItem("tws_audio_paused", "true");
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          manualPauseRef.current = false;
          localStorage.setItem("tws_audio_paused", "false");
        })
        .catch(console.error);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 select-none">
      <button
        onClick={toggleMusic}
        type="button"
        aria-label={isPlaying ? "Stop ambient music" : "Play ambient music"}
        title={isPlaying ? "Click to stop music" : "Click to play music"}
        className={`group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer ${
          isPlaying
            ? "bg-[#FDF7F4]/95 border border-[#8EB486]/60 text-[#8EB486] shadow-[0_4px_20px_rgba(142,180,134,0.3)] hover:shadow-[0_6px_25px_rgba(142,180,134,0.45)] hover:bg-white"
            : "bg-[#FDF7F4]/90 border border-[#E8DCD5] text-stone-400 hover:text-stone-600 hover:border-stone-300 hover:bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        }`}
      >
        {/* Soft breathing halo ring when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full bg-[#8EB486]/20 animate-ping pointer-events-none opacity-40 duration-1000" />
        )}

        {/* Music icon when playing, MusicSlash icon when stopped */}
        {isPlaying ? (
          <Music className="w-5 h-5 text-[#8EB486] transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <MusicSlashIcon className="w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>
    </div>
  );
}
