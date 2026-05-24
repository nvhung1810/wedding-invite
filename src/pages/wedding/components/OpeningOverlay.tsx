import { useTranslation } from "react-i18next";
import type { TouchEvent } from "react";
import { COLOR_BROWN, COLOR_CREAM, OVERLAY_BG } from "../constants";

type OpeningOverlayProps = {
  exiting: boolean;
  onOpen: () => void;
  onTouchEnd: (e: TouchEvent<HTMLButtonElement>) => void;
};

export function OpeningOverlay({
  exiting,
  onOpen,
  onTouchEnd,
}: OpeningOverlayProps) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={`overlay-enter-card fixed top-0 z-[200] h-[100dvh] min-h-[100dvh] w-full cursor-pointer overflow-hidden border-0 p-0 outline-none focus:ring-0 ${
        exiting ? "overlay-exiting" : ""
      }`}
      style={{
        backgroundColor: COLOR_CREAM,
        fontFamily: '"Quicksand", sans-serif',
        color: COLOR_BROWN,
      }}
      onClick={onOpen}
      onTouchEnd={onTouchEnd}
      aria-label={t("hero.tapToOpen")}
    >
      <div
        className="overlay-stage"
        style={{ backgroundImage: `url("${OVERLAY_BG}")` }}
      >
        <div className="overlay-layout">
          <div className="overlay-layout__cluster">
            <p className="overlay-layout__invite w-2/3 text-left text-base uppercase leading-relaxed">
              {t("hero.overlay.inviteLine")}
            </p>
            <h1 className="overlay-layout__couple text-center text-[2.3rem] min-[400px]:text-[2.5rem] uppercase leading-snug tracking-[0.04em]">
              {t("hero.coupleName")}
            </h1>

            <p className="animate-overlay-text py-40 text-center text-[12px] font-medium uppercase tracking-[0.22em]">
              {t("hero.tapToOpen")}
            </p>

            <div className="overlay-layout__datetime">
              <p className="text-[1.5rem] font-bold tracking-wide">
                {t("hero.overlay.dateTime")}
              </p>
              <p className="mt-1 text-xs font-normal tracking-wide">
                {t("hero.overlay.lunarDate")}
              </p>
            </div>

            <div
              className="overlay-layout__divider overlay-divider"
              aria-hidden
            />

            <p className="overlay-layout__presence whitespace-pre-line text-right text-xs uppercase leading-snug">
              {t("hero.overlay.presenceMessage")}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
