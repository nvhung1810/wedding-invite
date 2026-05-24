import { useEffect, useRef, useState, type TouchEvent } from "react";
import { OVERLAY_FADE_MS } from "../constants";

export function useOverlayMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicStarted = useRef(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayExiting, setOverlayExiting] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play()
      .then(() => {
        musicStarted.current = true;
        setOverlayExiting(true);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!overlayExiting) return;
    const timer = window.setTimeout(
      () => setOverlayVisible(false),
      OVERLAY_FADE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [overlayExiting]);

  const startMusic = () => {
    if (musicStarted.current) return;
    const el = audioRef.current;
    if (!el) return;

    musicStarted.current = true;
    el.play().catch(() => {
      musicStarted.current = false;
    });
    setTimeout(() => setOverlayExiting(true), 0);
  };

  const handleOverlayTouchEnd = (e: TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startMusic();
  };

  const contentVisible = !overlayVisible || overlayExiting;

  return {
    audioRef,
    overlayVisible,
    overlayExiting,
    contentVisible,
    startMusic,
    handleOverlayTouchEnd,
  };
}
