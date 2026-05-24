import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { useTranslation } from "react-i18next";
import { BASE, COLOR_BROWN, COLOR_CREAM, HERO_BG } from "../constants";

export function HeroSection() {
  const { t } = useTranslation();

  return (
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
        className="relative mx-auto mt-4 aspect-[309/472] w-full max-w-[360px] overflow-hidden border-8 border-[#85491c]/20 bg-[#fefcf6] shadow-sm"
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
  );
}
