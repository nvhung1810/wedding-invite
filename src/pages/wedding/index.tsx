import { FallingBears } from "@/components/FallingBears";
import { OpeningOverlay } from "./components/OpeningOverlay";
import { WeddingMainContent } from "./components/WeddingMainContent";
import { BG_MUSIC_SRC, SHOW_FALLING_BEARS } from "./constants";
import { useOverlayMusic } from "./hooks/useOverlayMusic";

export function WeddingInvite() {
  const {
    audioRef,
    overlayVisible,
    overlayExiting,
    contentVisible,
    startMusic,
    handleOverlayTouchEnd,
  } = useOverlayMusic();

  return (
    <div className="relative flex h-[100dvh] max-h-[100dvh] flex-col overflow-hidden bg-white text-[#85491c]">
      <audio
        ref={audioRef}
        src={BG_MUSIC_SRC}
        loop
        playsInline
        autoPlay
        preload="auto"
      />

      {overlayVisible && (
        <OpeningOverlay
          exiting={overlayExiting}
          onOpen={startMusic}
          onTouchEnd={handleOverlayTouchEnd}
        />
      )}

      <div
        className={`flex min-h-0 flex-1 flex-col transition-all duration-700 ease-out ${
          contentVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-6 opacity-0"
        }`}
      >
        {SHOW_FALLING_BEARS && <FallingBears />}

        <main className="invite-scroll relative z-10 min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
          <WeddingMainContent onStartMusic={startMusic} />
        </main>
      </div>
    </div>
  );
}
