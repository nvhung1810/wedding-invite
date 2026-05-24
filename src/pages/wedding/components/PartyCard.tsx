import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
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
import { useTranslation } from "react-i18next";
import { BASE } from "../constants";

type PartySide = "groom" | "bride";

type PartyCardProps = {
  side: PartySide;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartMusic: () => void;
  className?: string;
};

const PARTY_CONFIG: Record<
  PartySide,
  {
    titleKey: "party.groom.title" | "party.bride.title";
    dateKey: "party.groom.date" | "party.bride.date";
    timeKey: "party.groom.time" | "party.bride.time";
    lunarKey: "party.groom.lunarDate" | "party.bride.lunarDate";
    venueKey: "party.groom.venue" | "party.bride.venue";
    ctaKey: "party.groom.cta" | "party.bride.cta";
    qrSrc: string;
    qrAlt: string;
    bankInfoKey: "gift.bankInfoGroom" | "gift.bankInfoBride";
  }
> = {
  groom: {
    titleKey: "party.groom.title",
    dateKey: "party.groom.date",
    timeKey: "party.groom.time",
    lunarKey: "party.groom.lunarDate",
    venueKey: "party.groom.venue",
    ctaKey: "party.groom.cta",
    qrSrc: `${BASE}qr-chure.jpg`,
    qrAlt: "QR chuyển khoản chú rể",
    bankInfoKey: "gift.bankInfoGroom",
  },
  bride: {
    titleKey: "party.bride.title",
    dateKey: "party.bride.date",
    timeKey: "party.bride.time",
    lunarKey: "party.bride.lunarDate",
    venueKey: "party.bride.venue",
    ctaKey: "party.bride.cta",
    qrSrc: `${BASE}qr-codau.jpg`,
    qrAlt: "QR chuyển khoản cô dâu",
    bankInfoKey: "gift.bankInfoBride",
  },
};

export function PartyCard({
  side,
  open,
  onOpenChange,
  onStartMusic,
  className = "",
}: PartyCardProps) {
  const { t } = useTranslation();
  const config = PARTY_CONFIG[side];

  return (
    <Card
      className={`content-visibility-section rounded-2xl border border-solid border-[#85491c]/15 bg-[#fefcf6] shadow-sm mx-6 ${className}`}
    >
      <CardHeader className="gap-0 text-center">
        <CardTitle className="text-lg tracking-wide text-[#85491c]">
          {t(config.titleKey)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-center text-sm">
        <p className="text-2xl font-semibold text-[#85491c]">
          {t(config.dateKey)}
        </p>
        <p className="font-medium text-[#85491c]/90">{t(config.timeKey)}</p>
        <p className="text-xs text-[#85491c]/75">({t(config.lunarKey)})</p>
        <p className="text-[#85491c]/90">{t(config.venueKey)}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="bg-[#85491c] hover:bg-[#85491c]/85"
              onClick={onStartMusic}
            >
              {t(config.ctaKey)}
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl bg-[#fefcf6] shadow-lg sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center font-['Allura',cursive] text-4xl text-[#85491c]">
                {t("gift.modalTitle")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="relative aspect-square w-[min(240px,calc(100vw-4rem))] border-4 border-[#85491c] bg-[#fefcf6] p-1">
                <ImageWithSkeleton
                  src={config.qrSrc}
                  alt={config.qrAlt}
                  className="object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="text-center text-base font-medium text-[#85491c]/90">
                {t(config.bankInfoKey)}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export type { PartySide };
