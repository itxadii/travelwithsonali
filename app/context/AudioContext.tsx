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

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pathname = usePathname();

  // Music only ever starts from the play button; the file is fetched on first play
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

  const playMusic = useCallback(() => {
    getAudio()
      .play()
      .then(() => setIsPlaying(true))
      .catch(console.error);
  }, [getAudio]);

  const stopMusic = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (pathname && SILENT_ROUTE_PREFIXES.some((p) => pathname.startsWith(p)) && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [pathname]);

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
