"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

interface AudioContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  playMusic: () => void;
  stopMusic: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleMusic: () => {},
  playMusic: () => {},
  stopMusic: () => {},
});

// Ambient audio belongs to the public site only
const SILENT_ROUTE_PREFIXES = ["/admin", "/portal", "/studio"];
// Remembers a visitor who switched the music off, so it doesn't start again on their next page
const PREFERENCE_KEY = "tws_music";

function isSilentRoute(pathname: string | null): boolean {
  return Boolean(pathname && SILENT_ROUTE_PREFIXES.some((p) => pathname.startsWith(p)));
}

function readPreference(): "on" | "off" {
  try {
    return localStorage.getItem(PREFERENCE_KEY) === "off" ? "off" : "on";
  } catch {
    return "on";
  }
}

function savePreference(value: "on" | "off") {
  try {
    localStorage.setItem(PREFERENCE_KEY, value);
  } catch {
    // Private mode or blocked storage: the music still works for this visit
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pathname = usePathname();
  const silent = isSilentRoute(pathname);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/birdsaudio.mp3");
      audio.loop = true;
      audio.volume = 0.35;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  /** Starts playback; resolves false when the browser blocks it (no user gesture yet). */
  const tryPlay = useCallback(async (): Promise<boolean> => {
    try {
      await getAudio().play();
      setIsPlaying(true);
      return true;
    } catch {
      return false;
    }
  }, [getAudio]);

  const playMusic = useCallback(() => {
    savePreference("on");
    tryPlay();
  }, [tryPlay]);

  const stopMusic = useCallback(() => {
    savePreference("off");
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  // Music is on by default. Browsers only allow sound after the visitor has interacted with
  // the page, so if the first attempt is blocked it starts on their first tap, click or key press.
  useEffect(() => {
    if (silent) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
    if (readPreference() === "off") return;
    if (audioRef.current && !audioRef.current.paused) return;

    let cancelled = false;
    const gestures = ["pointerdown", "keydown", "touchend"] as const;
    const onGesture = () => {
      gestures.forEach((g) => window.removeEventListener(g, onGesture));
      if (!cancelled && readPreference() !== "off") tryPlay();
    };

    tryPlay().then((started) => {
      if (!started && !cancelled) gestures.forEach((g) => window.addEventListener(g, onGesture, { passive: true }));
    });

    return () => {
      cancelled = true;
      gestures.forEach((g) => window.removeEventListener(g, onGesture));
    };
  }, [silent, tryPlay]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  }, [isPlaying, playMusic, stopMusic]);

  return (
    <AudioContext.Provider value={{ isPlaying, toggleMusic, playMusic, stopMusic }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
