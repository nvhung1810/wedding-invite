import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { useTranslation } from "react-i18next";
import { BASE } from "../constants";

export function CoupleIntroSection() {
  const { t } = useTranslation();

  return (
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
          <p className="mt-3 text-sm font-medium">{t("groomSide.role")}</p>
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
          <p className="mt-3 text-sm font-medium">{t("brideSide.role")}</p>
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
  );
}
