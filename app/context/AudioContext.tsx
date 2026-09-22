"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

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

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const manualPauseRef = useRef(false);

  useEffect(() => {
    // Singleton audio instance in root layout
    const audio = new Audio("/audio/birdsaudio.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
    audioRef.current = audio;

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

  const playMusic = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        manualPauseRef.current = false;
        localStorage.setItem("tws_audio_paused", "false");
      })
      .catch(console.error);
  }, []);

  const stopMusic = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    manualPauseRef.current = true;
    localStorage.setItem("tws_audio_paused", "true");
  }, []);

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
