import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FallingBears } from "@/components/FallingBears";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-lazy-load-image-component/src/effects/blur.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE = import.meta.env.BASE_URL;

const BG_MUSIC_SRC = `${BASE}bg-music.mp3`;
const COLOR_CREAM = "#fefcf6";
const COLOR_BROWN = "#85491c";

/** Set to true to re-enable the falling bears easter egg */
const SHOW_FALLING_BEARS = false;

const OVERLAY_BG = `${BASE}BeautyPlus-IMAGE-UPSCALER-1779371801363.png`;
const HERO_BG = `${BASE}hero-bg.png`;

const ALBUM_IMAGES = [
  "AN_03293_2.jpg",
  "AN_03293_5.jpg",
  "AN_03293_6.jpg",
  "AN_03293_7.jpg",
  "AN_03293_11.jpg",
  "AN_03293_8.jpg",
  "AN_03293_9.jpg",
] as const;

/**
 * Preload strategy — 3 waves fired while the overlay is visible.
 * Goal: by the time the user taps to open, every image is already
 * in the browser cache so scrolling is jank-free.
 *
 * Wave 1 (0 ms)   — overlay assets + above-the-fold hero image.
 *                   Must be in cache before the overlay even paints.
 * Wave 2 (400 ms) — images visible immediately after opening
 *                   (portraits, first album row). User is still
 *                   reading the overlay text at this point.
 * Wave 3 (900 ms) — remaining album images, QR codes, footer.
 *                   Fires well before the average user taps (~2–3 s).
 *
 * Waves are intentionally small so requests don't compete for bandwidth.
 */
const PRELOAD_WAVE_1 = [
  OVERLAY_BG,
  HERO_BG,
  `${BASE}AN_03293_10.jpg`,   // hero couple photo
];

const PRELOAD_WAVE_2 = [
  `${BASE}AN_03293.jpg`,       // groom portrait
  `${BASE}AN_03293_4.jpg`,     // bride portrait
  `${BASE}${ALBUM_IMAGES[0]}`, // album row 1
  `${BASE}${ALBUM_IMAGES[1]}`,
];

const PRELOAD_WAVE_3 = [
  `${BASE}${ALBUM_IMAGES[2]}`, // album rows 2–3
  `${BASE}${ALBUM_IMAGES[3]}`,
  `${BASE}${ALBUM_IMAGES[4]}`,
  `${BASE}${ALBUM_IMAGES[5]}`,
  `${BASE}${ALBUM_IMAGES[6]}`,
  `${BASE}qr-chure.jpg`,
  `${BASE}qr-codau.jpg`,
  `${BASE}thankyou.jpg`,
];

const OVERLAY_FADE_MS = 850;

// ─── Calendar helpers ─────────────────────────────────────────────────────────

/**
 * Builds a padded day array for a given year/month so the first cell aligns
 * with the correct weekday column (Mon = 0 … Sun = 6).
 * Returns null for empty leading/trailing cells.
 *
 * NOTE: June 2026 starts on Monday (offset = 0), so no leading nulls are
 * needed for that specific month — but keeping this generic makes it safe if
 * the month is ever changed.
 */
function buildCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sun … 6 = Sat
  // Convert Sun-based (0–6) to Mon-based (0–6)
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WeddingInvite() {
  const { t } = useTranslation();

  const [invalidCodeOpen, setInvalidCodeOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState<"trai" | "gai" | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayExiting, setOverlayExiting] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const musicStarted = useRef(false);

  // ── Image preloading — 3 waves while the overlay is visible ────────────────
  useEffect(() => {
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // Wave 1: fire immediately — overlay bg must be ready before first paint.
    PRELOAD_WAVE_1.forEach(preload);

    // Wave 2: portraits + first album row. 400 ms gives Wave 1 a head start
    // without waiting so long that the user taps before these are cached.
    const t2 = window.setTimeout(() => PRELOAD_WAVE_2.forEach(preload), 400);

    // Wave 3: rest of album + footer assets. By 900 ms the average user is
    // still on the overlay (typical dwell ~2–4 s), so these arrive in time.
    const t3 = window.setTimeout(() => PRELOAD_WAVE_3.forEach(preload), 900);

    return () => {
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  // ── Prevent document scroll (scroll happens inside .invite-scroll only) ─────
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  // ── Attempt silent autoplay on mount; dismiss overlay if it succeeds ────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play()
      .then(() => {
        musicStarted.current = true;
        setOverlayExiting(true);
      })
      .catch(() => {
        // Autoplay blocked — overlay stays visible so the user can tap to start.
      });
  }, []);

  // ── Unmount overlay node after the CSS fade-out finishes ────────────────────
  useEffect(() => {
    if (!overlayExiting) return;
    const timer = window.setTimeout(
      () => setOverlayVisible(false),
      OVERLAY_FADE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [overlayExiting]);

  // ── Start music + dismiss overlay on user gesture ──────────────────────────
  // BUG FIX: previously called by both onTouchStart AND onTouchEnd on the overlay
  // button, causing two synchronous play() attempts (guard protected, but noisy).
  // Now only onTouchEnd (+ onClick for pointer devices) is used, and
  // e.preventDefault() is called before the handler so iOS doesn't fire a
  // synthetic click after touchend.
  const startMusic = () => {
    if (musicStarted.current) return;
    const el = audioRef.current;
    if (!el) return;

    musicStarted.current = true;
    el.play().catch(() => {
      musicStarted.current = false;
    });

    // Kick off the overlay exit animation without blocking the user-gesture frame.
    setTimeout(() => setOverlayExiting(true), 0);
  };

  const handleOverlayTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent the subsequent synthetic click
    startMusic();
  };

  // ── Calendar data ───────────────────────────────────────────────────────────
  const calendarDays = buildCalendarDays(2026, 6);

  // ── Render ──────────────────────────────────────────────────────────────────
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

      {/* ── Opening overlay ─────────────────────────────────────────────────── */}
      {overlayVisible && (
        <button
          type="button"
          className={`overlay-enter-card fixed top-0 z-[200] h-[100dvh] min-h-[100dvh] w-full cursor-pointer overflow-hidden border-0 p-0 outline-none focus:ring-0 ${
            overlayExiting ? "overlay-exiting" : ""
          }`}
          style={{
            backgroundColor: COLOR_CREAM,
            fontFamily: '"Quicksand", sans-serif',
            color: COLOR_BROWN,
          }}
          onClick={startMusic}
          onTouchEnd={handleOverlayTouchEnd}
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

                <p className="animate-overlay-text text-center text-[12px] font-medium uppercase tracking-[0.22em] py-40">
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
      )}

      {/* ── Main content (fades in as overlay exits) ─────────────────────────── */}
      <div
        className={`flex min-h-0 flex-1 flex-col transition-all duration-700 ease-out ${
          overlayVisible && !overlayExiting
            ? "translate-y-6 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        {SHOW_FALLING_BEARS && <FallingBears />}

        <main className="invite-scroll relative z-10 min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto">
          <div className="min-w-0 w-full overflow-x-hidden">
            <div className="mx-auto w-full max-w-[420px]">

              {/* ── Hero ───────────────────────────────────────────────────── */}
              <section
                className="text-center"
                style={{
                  background: `${COLOR_CREAM} url("${HERO_BG}") center center / cover no-repeat`,
                  minHeight: "320px",
                  height: "700px",
                }}
              >
                <h2 className="font-blackmango pt-6 text-2xl text-[#85491c]">
                  {t("hero.saveTheDate")}
                </h2>
                <h2
                  className="mt-2 text-3xl tracking-wide font-['Great_Vibes',cursive]"
                  style={{ color: COLOR_BROWN }}
                >
                  {t("hero.coupleName")}
                </h2>
                <div
                  className="relative mx-auto mt-4 w-full max-w-[360px] overflow-hidden border-8 border-[#85491c]/20 shadow-sm aspect-[309/472] bg-[#fefcf6]"
                  style={{ borderColor: "rgba(133, 73, 28, 0.2)" }}
                >
                  <ImageWithSkeleton
                    src={`${BASE}AN_03293_10.jpg`}
                    alt={t("hero.coupleNameAria")}
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </section>

              <div style={{ background: COLOR_CREAM }}>

                {/* ── Quote ────────────────────────────────────────────────── */}
                <div className="py-4">
                  <div
                    className="whitespace-pre-line text-center text-xl font-medium font-['Great_Vibes',cursive]"
                    style={{ color: COLOR_BROWN }}
                  >
                    "{t("quote")}"
                  </div>
                </div>

                {/* ── Groom / Bride intro grid ──────────────────────────────── */}
                <section className="grid grid-cols-2 px-1 text-[#85491c]">
                  <div className="relative aspect-[3/4] overflow-hidden rounded border-2 border-[#85491c]/25 bg-[#fefcf6]">
                    <ImageWithSkeleton
                      src={`${BASE}AN_03293.jpg`}
                      alt={t("groomSide.groomAlt")}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center text-center">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest">
                        {t("groomSide.label")}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase leading-tight">
                        {t("groomSide.father")}
                      </p>
                      <p className="text-xs font-bold uppercase leading-tight">
                        {t("groomSide.mother")}
                      </p>
                    </div>
                    <div className="pt-8">
                      <p className="mt-3 text-sm font-medium">
                        {t("groomSide.role")}
                      </p>
                      <p
                        className="mt-1 pt-2 text-3xl font-normal text-[#85491c]"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {t("groomSide.name")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {t("brideSide.label")}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase leading-tight">
                      {t("brideSide.father")}
                    </p>
                    <p className="text-xs font-bold uppercase leading-tight">
                      {t("brideSide.mother")}
                    </p>
                    <div className="pt-8">
                      <p className="mt-3 text-sm font-medium">
                        {t("brideSide.role")}
                      </p>
                      <p
                        className="mt-1 pt-2 text-3xl font-normal text-[#85491c]"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {t("brideSide.name")}
                      </p>
                    </div>
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded border-2 border-[#85491c]/25 bg-[#fefcf6]">
                    <ImageWithSkeleton
                      src={`${BASE}AN_03293_4.jpg`}
                      alt={t("brideSide.brideAlt")}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                </section>

                <Separator className="my-8 bg-[#85491c]/25" />

                {/* ── Invitation heading ────────────────────────────────────── */}
                <section className="content-visibility-section text-center">
                  <p className="text-3xl tracking-widest text-[#85491c] font-['Allura',cursive]">
                    {t("invitation.title")}
                  </p>
                  <h2 className="text-xs font-semibold text-[#85491c] sm:text-[0.9rem]">
                    {t("invitation.subtitle")}
                  </h2>
                </section>

                {/* ── Party card — Groom side ───────────────────────────────── */}
                <Card className="content-visibility-section mt-8 mx-6 rounded-2xl border border-solid border-[#85491c]/15 bg-[#fefcf6] shadow-sm">
                  <CardHeader className="gap-0 text-center">
                    <CardTitle className="text-lg tracking-wide text-[#85491c]">
                      {t("party.groom.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-center text-sm">
                    <p className="text-2xl font-semibold text-[#85491c]">
                      {t("party.groom.date")}
                    </p>
                    <p className="font-medium text-[#85491c]/90">
                      {t("party.groom.time")}
                    </p>
                    <p className="text-xs text-[#85491c]/75">
                      ({t("party.groom.lunarDate")})
                    </p>
                    <p className="text-[#85491c]/90">{t("party.groom.venue")}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Dialog
                      open={rsvpOpen === "trai"}
                      onOpenChange={(open) =>
                        setRsvpOpen(open ? "trai" : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-[#85491c] hover:bg-[#85491c]/85"
                          onClick={startMusic}
                        >
                          {t("party.groom.cta")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl bg-[#fefcf6] shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="font-['Allura',cursive] text-center text-4xl text-[#85491c]">
                            {t("gift.modalTitle")}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative aspect-square w-[min(240px,calc(100vw-4rem))] border-4 border-[#85491c] bg-[#fefcf6] p-1">
                            <ImageWithSkeleton
                              src={`${BASE}qr-chure.jpg`}
                              alt="QR chuyển khoản chú rể"
                              className="object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="text-center text-base font-medium text-[#85491c]/90">
                            {t("gift.bankInfoGroom")}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>

                {/* ── Party card — Bride side ───────────────────────────────── */}
                <Card className="content-visibility-section mt-6 mx-6 rounded-2xl border border-solid border-[#85491c]/15 bg-[#fefcf6] shadow-sm">
                  <CardHeader className="gap-0 text-center">
                    <CardTitle className="text-lg tracking-wide text-[#85491c]">
                      {t("party.bride.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-center text-sm">
                    <p className="text-2xl font-semibold text-[#85491c]">
                      {t("party.bride.date")}
                    </p>
                    <p className="font-medium text-[#85491c]/90">
                      {t("party.bride.time")}
                    </p>
                    <p className="text-xs text-[#85491c]/75">
                      ({t("party.bride.lunarDate")})
                    </p>
                    <p className="text-[#85491c]/90">{t("party.bride.venue")}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Dialog
                      open={rsvpOpen === "gai"}
                      onOpenChange={(open) =>
                        setRsvpOpen(open ? "gai" : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-[#85491c] hover:bg-[#85491c]/85"
                          onClick={startMusic}
                        >
                          {t("party.bride.cta")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl bg-[#fefcf6] shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="font-['Allura',cursive] text-center text-4xl text-[#85491c]">
                            {t("gift.modalTitle")}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative aspect-square w-[min(240px,calc(100vw-4rem))] border-4 border-[#85491c] bg-[#fefcf6] p-1">
                            <ImageWithSkeleton
                              src={`${BASE}qr-codau.jpg`}
                              alt="QR chuyển khoản cô dâu"
                              className="object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="text-center text-base font-medium text-[#85491c]/90">
                            {t("gift.bankInfoBride")}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>

                {/* ── Save-the-date calendar ────────────────────────────────── */}
                <section className="content-visibility-section mx-6 mt-6 rounded-2xl border border-solid border-[#85491c]/15 bg-[#fefcf6] px-4 py-6 shadow-sm">
                  <p
                    className="text-center text-3xl font-medium tracking-wide font-['Allura',cursive]"
                    style={{ color: COLOR_BROWN }}
                  >
                    {t("saveTheDate.title")}
                  </p>
                  <p
                    className="mt-1 text-center text-base"
                    style={{ color: COLOR_BROWN }}
                  >
                    {t("saveTheDate.monthYear")}
                  </p>

                  <div className="mt-4 overflow-hidden rounded-lg">
                    {/* Weekday header */}
                    <div
                      className="grid grid-cols-7 text-center text-xs font-medium text-[#fefcf6]"
                      style={{ background: COLOR_BROWN }}
                    >
                      {(
                        t("saveTheDate.weekdays", {
                          returnObjects: true,
                        }) as string[]
                      ).map((d) => (
                        <div key={d} className="py-2">
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Day cells */}
                    <div className="grid grid-cols-7 gap-0 border border-t-0 border-[#85491c]/15 bg-[#fefcf6]">
                      {calendarDays.map((day, i) => {
                        const col = i % 7;
                        const isSunday = col === 6;
                        const isHighlight = day === 6;

                        return (
                          <div
                            key={i}
                            className="relative flex min-h-[36px] items-center justify-center border-b border-[#85491c]/15 py-1"
                            style={{ borderRightWidth: col < 6 ? 1 : 0 }}
                          >
                            {day !== null && (
                              <>
                                <span
                                  className={`text-sm tabular-nums ${isSunday ? "font-bold" : "font-normal"}`}
                                  style={{
                                    color: isSunday
                                      ? COLOR_BROWN
                                      : "rgba(133, 73, 28, 0.65)",
                                  }}
                                >
                                  {day}
                                </span>
                                {isHighlight && (
                                  <span
                                    className="pointer-events-none absolute top-1/2 block animate-heart-blink"
                                    style={{
                                      width: 89,
                                      height: 89,
                                      left: "50%",
                                      transform:
                                        "translate(calc(-50% + 0px), calc(-50% + 7px))",
                                      background:
                                        'center center / cover no-repeat scroll content-box border-box url("https://content.pancake.vn/1/s489x489/fwebp/9f/06/d9/3a/4f89683f3c43ed295fd5da05de67d0db47eb178a7d68b96e19166749.png")',
                                    }}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <svg
                      className="h-4 w-24 text-[#85491c]"
                      viewBox="0 0 96 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M0 8 Q24 2 48 8 T96 8" />
                    </svg>
                    <svg
                      className="ml-1 h-4 w-4 shrink-0 text-[#85491c]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </section>

                {/* ── Invalid-code alert (kept for future use) ──────────────── */}
                <AlertDialog
                  open={invalidCodeOpen}
                  onOpenChange={setInvalidCodeOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("alert.invalidCodeTitle")}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("alert.invalidCodeMessage")}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction
                        onClick={() => setInvalidCodeOpen(false)}
                      >
                        {t("alert.ok")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* ── Venue section ─────────────────────────────────────────── */}
                <section className="content-visibility-section mt-8 px-1">
                  <div className="overflow-hidden rounded-t-3xl bg-[#fefcf6] px-5 pb-8 pt-8 text-center">
                    <p
                      className="mb-4 text-3xl text-[#85491c]"
                      style={{ fontFamily: "'Allura', cursive" }}
                    >
                      {t("venue.title")}
                    </p>

                    <div className="flex flex-col items-center gap-0">
                      <div className="flex w-full max-w-sm flex-col items-center">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin
                            className="h-5 w-5 shrink-0 text-[#85491c]"
                            strokeWidth={2.5}
                          />
                          <span className="text-base font-bold uppercase tracking-wide text-[#85491c]">
                            {t("venue.groomLabel")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#85491c]/80">
                          {t("venue.groomAddress")}
                        </p>
                      </div>

                      <div className="my-4 h-px w-full max-w-sm bg-[#85491c]/30" />

                      <div className="flex w-full max-w-sm flex-col items-center">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin
                            className="h-5 w-5 shrink-0 text-[#85491c]"
                            strokeWidth={2.5}
                          />
                          <span className="text-base font-bold uppercase tracking-wide text-[#85491c]">
                            {t("venue.brideLabel")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#85491c]/80">
                          {t("venue.brideAddress")}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Wedding album ──────────────────────────────────────────── */}
                <section className="content-visibility-section mt-8 px-1">
                  <div className="flex items-center gap-3">
                    <p
                      className="shrink-0 text-2xl font-semibold"
                      style={{ fontFamily: "Allura, cursive", color: COLOR_BROWN }}
                    >
                      {t("album.title")}
                    </p>
                    <div className="relative flex-1 border-t border-[#85491c]/30">
                      <span className="absolute left-1/2 top-0 flex h-0 w-0 -translate-x-1/2 -translate-y-1/2 justify-center">
                        <ChevronDown
                          className="h-4 w-4 text-[#85491c]"
                          strokeWidth={2.5}
                        />
                      </span>
                    </div>
                  </div>

                  <div
                    className="album-grid mt-2 grid w-full gap-2"
                    style={{
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr 1fr",
                      aspectRatio: "378/851",
                    }}
                  >
                    {/* Row 1 */}
                    <div className="album-grid__cell">
                      <ImageWithSkeleton
                        src={`${BASE}${ALBUM_IMAGES[0]}`}
                        alt=""
                        skeletonClassName="image-skeleton-shimmer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="album-grid__cell">
                      <ImageWithSkeleton
                        src={`${BASE}${ALBUM_IMAGES[1]}`}
                        alt=""
                        skeletonClassName="image-skeleton-shimmer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* Row 2 — special layout: left full-height, right stacked 2×  */}
                    <div className="album-grid__cell">
                      <ImageWithSkeleton
                        src={`${BASE}${ALBUM_IMAGES[2]}`}
                        alt=""
                        skeletonClassName="image-skeleton-shimmer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="album-grid__stack grid h-full min-h-0 w-full grid-rows-2 gap-2">
                      <div className="album-grid__cell">
                        <ImageWithSkeleton
                          src={`${BASE}${ALBUM_IMAGES[3]}`}
                          alt=""
                          className="object-[center_28%]"
                          skeletonClassName="image-skeleton-shimmer"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="album-grid__cell">
                        <ImageWithSkeleton
                          src={`${BASE}${ALBUM_IMAGES[4]}`}
                          alt=""
                          skeletonClassName="image-skeleton-shimmer"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="album-grid__cell">
                      <ImageWithSkeleton
                        src={`${BASE}${ALBUM_IMAGES[5]}`}
                        alt=""
                        skeletonClassName="image-skeleton-shimmer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="album-grid__cell">
                      <ImageWithSkeleton
                        src={`${BASE}${ALBUM_IMAGES[6]}`}
                        alt=""
                        skeletonClassName="image-skeleton-shimmer"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                </section>

                {/* ── Footer ────────────────────────────────────────────────── */}
                <section className="mt-4 px-1 text-center">
                  <ImageWithSkeleton
                    src={`${BASE}thankyou.jpg`}
                    alt=""
                    className="pointer-events-auto relative min-h-auto"
                    fill={false}
                    loading="lazy"
                    decoding="async"
                    style={{
                      backgroundColor: "rgba(133, 73, 28, 0.25)",
                      top: "-10px",
                    }}
                  >
                    <span className="absolute bottom-8 left-1/2 w-full -translate-x-1/2 text-center text-2xl font-medium font-['Allura',cursive] text-white">
                      {t("footer.welcome")}
                    </span>
                  </ImageWithSkeleton>
                </section>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}