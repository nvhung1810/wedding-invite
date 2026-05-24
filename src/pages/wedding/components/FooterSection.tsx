import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { useTranslation } from "react-i18next";
import { BASE } from "../constants";

export function FooterSection() {
  const { t } = useTranslation();

  return (
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
  );
}
