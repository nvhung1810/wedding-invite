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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FallingBears } from "@/components/FallingBears";
import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { ChevronDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "react-lazy-load-image-component/src/effects/blur.css";

const BASE = import.meta.env.BASE_URL;
const BG_MUSIC_SRC = `${BASE}bg-music.mp3`;

/** Tất cả ảnh dùng trong trang – preload khi mount để cuộn tới là sẵn sàng */
const PRELOAD_IMAGES = [
  `${BASE}main-1.jpg`,
  `${BASE}3Q2A6279.JPG`,
  `${BASE}3Q2A6245.JPG`,
  `${BASE}qr-bank.png`,
  `${BASE}3Q2A6469.jpg`,
  `${BASE}3Q2A5966.jpg`,
  `${BASE}3Q2A6413.jpg`,
  `${BASE}3Q2A5863.jpg`,
  `${BASE}3Q2A6028.jpg`,
  `${BASE}3Q2A6475.jpg`,
  `${BASE}3Q2A6427.jpg`,
  `${BASE}60x90.jpg`,
  "https://content.pancake.vn/1/s840x1600/fwebp/65/3c/aa/be/35e135afc2c6420bc52abd8fb3768c346420d9efa7b879cd959ee353.png",
  "https://content.pancake.vn/1/s489x489/fwebp/9f/06/d9/3a/4f89683f3c43ed295fd5da05de67d0db47eb178a7d68b96e19166749.png",
  "https://content.pancake.vn/1/s1411x548/fwebp/cf/cf/28/5f/f9ca08165577556ed2df053b0962a0e8e670490844d7ad5e84fa48b2.png",
];

export function WeddingInvite() {
  const { t } = useTranslation();
  const [invalidCodeOpen, setInvalidCodeOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState<string | null>(null);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const startedRef = useRef(false);

  const FADE_OUT_MS = 850;

  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const startMusic = () => {
    if (startedRef.current) return;
    const el = audioRef.current;
    if (!el) return;
    startedRef.current = true;
    // Chỉ gọi play() đồng bộ trong user gesture; setState để sau (tránh re-render cắt gesture)
    el.play().catch(() => {
      startedRef.current = false;
    });
    setTimeout(() => setOverlayExiting(true), 0);
  };

  // Unmount overlay sau khi fade out xong
  useEffect(() => {
    if (!overlayExiting) return;
    const t = setTimeout(() => setOverlayVisible(false), FADE_OUT_MS);
    return () => clearTimeout(t);
  }, [overlayExiting]);

  // Thử autoplay khi mount; nếu được thì fade out overlay luôn
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.play()
      .then(() => {
        startedRef.current = true;
        setOverlayExiting(true);
      })
      .catch(() => { });
  }, []);

  // Khóa cuộn khi đang hiện overlay; chỉ mở được khi chạm, không cuộn
  useEffect(() => {
    if (!overlayVisible) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    const prevTouch = document.body.style.touchAction;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      document.body.style.touchAction = prevTouch;
    };
  }, [overlayVisible]);

  return (
    <div className="relative min-h-screen bg-[white] text-stone-800">
      <audio ref={audioRef} src={BG_MUSIC_SRC} loop playsInline autoPlay preload="auto" />
      {/* Overlay: giống ảnh – nền blur/bokeh, tên + nút Mở + Chạm để mở thiệp cưới */}
      {overlayVisible && (
        <button
          type="button"
          className={`overlay-enter-card fixed left-0 right-0 top-0 z-[200] mx-auto flex h-full min-h-[100dvh] w-full max-w-[420px] cursor-pointer flex-col items-center justify-between overflow-hidden px-2 py-12 outline-none focus:ring-0 ${overlayExiting ? "overlay-exiting" : ""
            }`}
          style={{
            minHeight: "100dvh",
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.1) 100%), linear-gradient(180deg, rgba(226,236,255,0.31) 0%, rgba(226,236,255,0.31) 100%), url("${BASE}backgound-1.jpg")`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center, center center, 20% center",
          }}
          onClick={startMusic}
          onTouchStart={() => startMusic()}
          onTouchEnd={(e) => {
            startMusic();
            e.preventDefault();
          }}
          aria-label={t("hero.tapToOpen")}
        >
          <div className="mt-20 flex flex-col items-center text-center sm:mt-40">
            <p
              className="font-['Great_Vibes',cursive] text-3xl min-[376px]:text-4xl tracking-wide"
              style={{ color: "#5e3746", textShadow: "0 1px 3px rgba(255,255,255,0.4)" }}
            >
              {t("hero.coupleName")}
            </p>
            <div
              className="my-2 h-px w-50"
              aria-hidden
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(94,55,70,0.6) 50%, transparent 100%)",
              }}
            />
            <p className="text-sm font-medium tracking-[0.2em]" style={{ color: "#6b4a52" }}>
              {t("hero.saveTheDate")}
            </p>
          </div>
          <div className="overlay-open-button relative flex flex-1 items-center justify-center">
            <span className="overlay-open-glow" aria-hidden />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-[calc(50%+4rem)] overlay-sparkle" aria-hidden style={{ animationDelay: "0s" }} />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 translate-x-[calc(-50%+3.5rem)] -translate-y-1/2 overlay-sparkle" aria-hidden style={{ animationDelay: "0.3s" }} />
            <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-[calc(50%+3rem)] -translate-y-[calc(-50%+2.5rem)] overlay-sparkle" aria-hidden style={{ animationDelay: "0.6s" }} />
            <span className="overlay-open-circle flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg sm:h-28 sm:w-28">
              <span
                className="font-['Great_Vibes',cursive] text-3xl text-[#1e3a5f] sm:text-4xl"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {t("hero.open")}
              </span>
            </span>
          </div>

          {/* Dưới: Chạm để mở thiệp cưới */}
          <p
            className="font-['Great_Vibes',cursive] text-xl tracking-wide sm:text-2xl animate-overlay-text"
            style={{ color: "#5e3746", textShadow: "0 1px 3px rgba(255,255,255,0.4)" }}
          >
            {t("hero.tapToOpen")}
          </p>
        </button>
      )}
      <div
        className={`transition-all duration-700 ease-out ${overlayVisible && !overlayExiting ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
          }`}
      >
        <FallingBears />
        <ScrollArea className="relative z-10 h-screen w-full overflow-x-hidden">
          <div className="min-w-0 w-full overflow-x-hidden">
            <div className="mx-auto w-full max-w-[420px]">
              {/* Hero */}
              <section
                className="text-center"
                style={{
                  background: `url("${BASE}backgound-bear.png") center center / cover no-repeat content-box border-box`,
                  minHeight: "320px",
                  height: "750px",
                }}
              >
                <h2 className="font-blackmango pt-6 text-3xl text-[#2f2f2f]">
                  {t("hero.saveTheDate")}
                </h2>
                <h2
                  className="mt-2 text-4xl tracking-wide font-['Great_Vibes',cursive]"
                  style={{ color: "rgb(0, 50, 99)" }}
                >
                  {t("hero.coupleName")}
                </h2>
                <div
                  className="mt-4 w-full max-w-[340px] mx-auto overflow-hidden border-8 border-sky-200 shadow-sm aspect-[309/472] bg-sky-100"
                  style={{ borderColor: "rgba(226, 236, 255, 1)" }}
                >
                  <ImageWithSkeleton
                    src={`${BASE}main-1.jpg`}
                    alt={t("hero.coupleNameAria")}
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                    fetchPriority="high"
                  />
                </div>
              </section>

              <div
                style={{
                  background: "#FAF7F5",
                }}
              >
                <div className="py-4">
                  <div
                    className="text-center text-xl font-medium font-['Great_Vibes',cursive] whitespace-pre-line"
                    style={{ color: "rgb(0, 50, 99)" }}
                  >
                    “{t("quote")}”
                  </div>
                </div>
                <section className="grid grid-cols-2 text-[#1e3a5f]">
                  <div className="aspect-[3/4] overflow-hidden rounded border-2 border-sky-200 bg-sky-50/50">
                    <ImageWithSkeleton
                      src={`${BASE}3Q2A6279.JPG`}
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
                        className="mt-1 text-3xl font-normal text-[#1e3a5f] pt-2"
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
                        className="mt-1 text-3xl font-normal text-[#1e3a5f] pt-2"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {t("brideSide.name")}
                      </p>
                    </div>
                  </div>
                  <div className="aspect-[3/4] overflow-hidden rounded border-2 border-sky-200 bg-sky-50/50">
                    <ImageWithSkeleton
                      src={`${BASE}3Q2A6245.JPG`}
                      alt={t("brideSide.brideAlt")}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                    />
                  </div>
                </section>

                <Separator className="my-8 bg-amber-200/50" />

                <section className="text-center content-visibility-section">
                  <p className="text-3xl tracking-widest text-amber-900/80 font-['Allura',cursive]">
                    {t("invitation.title")}
                  </p>
                  <h2 className="text-xs font-semibold text-stone-800 sm:text-[0.9rem]">
                    {t("invitation.subtitle")}
                  </h2>
                </section>

                {/* Tiệc cưới Nhà Trai */}
                <Card className="mt-8 mx-6 rounded-2xl border border-solid border-[rgba(229,231,235,1)] bg-[#fdede4] shadow-sm content-visibility-section">
                  <CardHeader className="text-center gap-0">
                    <CardTitle
                      className="text-lg tracking-wide text-amber-900"
                      style={{ color: "rgb(0, 50, 99)" }}
                    >
                      {t("party.groom.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-center text-sm">
                    <p className="text-2xl font-semibold text-stone-800">
                      {t("party.groom.date")}
                    </p>
                    <p className="font-medium text-stone-700">
                      {t("party.groom.time")}
                    </p>
                    <p className="text-xs text-stone-600">
                      ({t("party.groom.lunarDate")})
                    </p>
                    <p className="text-stone-700">{t("party.groom.venue")}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Dialog
                      open={rsvpOpen === "trai"}
                      onOpenChange={(o) => setRsvpOpen(o ? "trai" : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-[rgba(0,51,102,1)] hover:bg-[rgba(0,51,102,0.85)]"
                          onClick={startMusic}
                        >
                          {t("party.groom.cta")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl bg-white shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="font-['Allura',cursive] text-4xl text-stone-800 text-center">
                            {t("gift.modalTitle")}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4">
                          <div className="border-4 border-[#0a2540] p-1 bg-white w-[176px] h-[202px]">
                            <ImageWithSkeleton
                              src={`${BASE}qr-chure.jpg`}
                              alt="QR chuyển khoản chú rể"
                              fill={false}
                              className="block w-48 h-48 object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="text-base font-medium text-stone-700 text-center">
                            {t("gift.bankInfoGroom")}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>

                {/* Tiệc cưới Nhà Gái */}
                <Card className="mt-6 mx-6 rounded-2xl border border-solid border-[rgba(229,231,235,1)] bg-[#fdede4] shadow-sm content-visibility-section">
                  <CardHeader className="text-center gap-0">
                    <CardTitle
                      className="text-lg tracking-wide text-amber-900"
                      style={{ color: "rgb(0, 50, 99)" }}
                    >
                      {t("party.bride.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-center text-sm">
                    <p className="text-2xl font-semibold text-stone-800">
                      {t("party.bride.date")}
                    </p>
                    <p className="font-medium text-stone-700">
                      {t("party.bride.time")}
                    </p>
                    <p className="text-xs text-stone-600">
                      ({t("party.bride.lunarDate")})
                    </p>
                    <p className="text-stone-700">{t("party.bride.venue")}</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Dialog
                      open={rsvpOpen === "gai"}
                      onOpenChange={(o) => setRsvpOpen(o ? "gai" : null)}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="bg-[rgba(0,51,102,1)] hover:bg-[rgba(0,51,102,0.85)]"
                          onClick={startMusic}
                        >
                          {t("party.bride.cta")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-xl bg-white shadow-lg">
                        <DialogHeader>
                          <DialogTitle className="font-['Allura',cursive] text-4xl text-stone-800 text-center">
                            {t("gift.modalTitle")}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-4">
                          <div className="border-4 border-[#0a2540] p-1 bg-white w-48 h-48">
                            <ImageWithSkeleton
                              src={`${BASE}qr-codau.jpg`}
                              alt="QR chuyển khoản cô dâu"
                              fill={false}
                              className="block w-48 h-48 object-contain"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                          <p className="text-base font-medium text-stone-700 text-center">
                            {t("gift.bankInfoBride")}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>

                {/* Save The Date - Tháng 3 / 2026, highlight 21 & 22 */}
                <section className="mx-6 mt-6 rounded-2xl border border-solid border-[rgba(229,231,235,1)] bg-white/95 px-4 py-6 shadow-sm content-visibility-section">
                  <p
                    className="text-center text-3xl font-medium tracking-wide font-['Allura',cursive]"
                    style={{ color: "rgb(0, 50, 99)" }}
                  >
                    {t("saveTheDate.title")}
                  </p>
                  <p
                    className="mt-1 text-center text-base"
                    style={{ color: "rgb(0, 50, 99)" }}
                  >
                    {t("saveTheDate.monthYear")}
                  </p>
                  <div className="mt-4 overflow-hidden rounded-lg">
                    <div
                      className="grid grid-cols-7 text-center text-xs font-medium text-white"
                      style={{ background: "#3C8ED9" }}
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
                    <div className="grid grid-cols-7 gap-0 border border-t-0 border-[rgba(229,231,235,1)] bg-white">
                      {(() => {
                        // 1/3/2026 là Chủ nhật → 6 ô trống, rồi 1..31
                        const days: (number | null)[] = [];
                        for (let i = 0; i < 6; i++) days.push(null);
                        for (let d = 1; d <= 31; d++) days.push(d);
                        return days.map((d, i) => {
                          const col = i % 7;
                          const isSunday = col === 6;
                          const isHighlight = d === 21 || d === 22;
                          return (
                            <div
                              key={i}
                              className="relative flex min-h-[36px] items-center justify-center border-b border-r border-[rgba(229,231,235,0.8)] py-1 last:border-r-0"
                              style={{
                                borderRightWidth: col < 6 ? 1 : 0,
                              }}
                            >
                              {d != null ? (
                                <>
                                  <span
                                    className={`text-sm tabular-nums ${isSunday ? "font-bold" : "font-normal"
                                      }`}
                                    style={{
                                      color: isSunday
                                        ? "rgb(0, 51, 102)"
                                        : "rgb(0, 95, 188)",
                                    }}
                                  >
                                    {d}
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
                              ) : null}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <svg
                      className="h-4 w-24 text-stone-700"
                      viewBox="0 0 96 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    >
                      <path d="M0 8 Q24 2 48 8 T96 8" />
                    </svg>
                    <svg
                      className="ml-1 h-4 w-4 flex-shrink-0 text-stone-700"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </section>

                {/* AlertDialog: Expired or Invalid Code (demo) */}
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
                      <AlertDialogAction onClick={() => setInvalidCodeOpen(false)}>
                        {t("alert.ok")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Địa điểm tổ chức */}
                <section className="mt-8 content-visibility-section">
                  <div className="overflow-hidden rounded-t-3xl bg-[#E0F2F7] px-5 pb-8 pt-8 text-center">
                    <p
                      className="mb-6 text-3xl text-[#1E3A8A]"
                      style={{ fontFamily: "'Allura', cursive" }}
                    >
                      {t("venue.title")}
                    </p>

                    <div className="flex flex-col items-center gap-0">
                      <div className="flex w-full max-w-sm flex-col items-center">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin
                            className="h-5 w-5 shrink-0 text-blue-600"
                            strokeWidth={2.5}
                          />
                          <span className="text-base font-bold uppercase tracking-wide text-[#1F2937]">
                            {t("venue.groomLabel")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#4B5563]">
                          {t("venue.groomAddress")}
                        </p>
                      </div>

                      <div className="my-4 h-px w-full max-w-sm bg-[#6B7280]/60" />

                      <div className="flex w-full max-w-sm flex-col items-center">
                        <div className="flex items-center justify-center gap-2">
                          <MapPin
                            className="h-5 w-5 shrink-0 text-blue-600"
                            strokeWidth={2.5}
                          />
                          <span className="text-base font-bold uppercase tracking-wide text-[#1F2937]">
                            {t("venue.brideLabel")}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#4B5563]">
                          {t("venue.brideAddress")}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Album hình cưới - placeholder */}
                <section className="mt-8 content-visibility-section">
                  <div className="flex items-center gap-3">
                    <p
                      className="shrink-0 text-2xl font-semibold"
                      style={{
                        fontFamily: "Allura, cursive",
                        color: "rgb(0, 51, 102)",
                      }}
                    >
                      {t("album.title")}
                    </p>
                    <div className="relative flex-1 border-t border-gray-400 pt-0">
                      <span className="absolute left-1/2 top-0 flex h-0 w-0 -translate-x-1/2 -translate-y-1/2 justify-center">
                        <ChevronDown
                          className="h-4 w-4 text-black"
                          strokeWidth={2.5}
                        />
                      </span>
                    </div>
                  </div>
                  <div
                    className="mt-2 grid gap-2 w-full"
                    style={{
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr 1fr",
                      aspectRatio: "378/851",
                    }}
                  >
                    {/* HÀNG 1 */}
                    <div className="min-h-0 h-full w-full overflow-hidden bg-gray-100">
                      <ImageWithSkeleton src={`${BASE}3Q2A6469.jpg`} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="min-h-0 h-full w-full overflow-hidden bg-gray-100">
                      <ImageWithSkeleton src={`${BASE}3Q2A5966.jpg`} alt="" loading="lazy" decoding="async" />
                    </div>

                    {/* HÀNG 2: BỐ CỤC ĐẶC BIỆT */}
                    <div className="min-h-0 h-full w-full overflow-hidden bg-gray-100">
                      <ImageWithSkeleton src={`${BASE}3Q2A6413.jpg`} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="grid grid-rows-2 gap-2 min-h-0">
                      <div className="min-h-0 overflow-hidden bg-gray-100">
                        <ImageWithSkeleton src={`${BASE}3Q2A5863.jpg`} alt="" loading="lazy" decoding="async" />
                      </div>
                      <div className="min-h-0 overflow-hidden bg-gray-100">
                        <ImageWithSkeleton src={`${BASE}3Q2A6028.jpg`} alt="" loading="lazy" decoding="async" />
                      </div>
                    </div>
                    <div className="min-h-0 h-full w-full overflow-hidden bg-gray-100">
                      <ImageWithSkeleton src={`${BASE}3Q2A6475.jpg`} alt="" loading="lazy" decoding="async" />
                    </div>
                    <div className="min-h-0 h-full w-full overflow-hidden bg-gray-100">
                      <ImageWithSkeleton src={`${BASE}3Q2A6427.jpg`} alt="" loading="lazy" decoding="async" />
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <section className="mt-2 text-center content-visibility-section "

                >
                  <div className="relative w-full overflow-hidden rounded-none">
                    <ImageWithSkeleton
                      src={`${BASE}60x90.jpg`}
                      alt=""
                      fill={false}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
                      backgroundColor: 'rgba(226, 236, 255, 0.31)'
                    }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="absolute inset-0 pointer-events-none" aria-hidden />
                      <ImageWithSkeleton
                        src={`${BASE}thankyou.webp`}
                        alt=""
                        className="relative z-10 bg-contain bg-center bg-no-repeat shrink-0 pointer-events-auto object-contain"
                        fill={false}
                        loading="lazy"
                        decoding="async"
                        style={{
                          backgroundColor: 'rgba(0, 50, 99, 0.37)'
                        }}
                      />
                      <div className="absolute top-[52%] flex justify-center z-10">
                        <span className="text-white text-2xl font-medium font-['Allura',cursive] text-center">
                          {t("footer.welcome")}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
