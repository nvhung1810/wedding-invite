import { ImageWithSkeleton } from "@/components/ImageWithSkeleton";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ALBUM_IMAGES, BASE, COLOR_BROWN } from "../constants";

export function AlbumSection() {
  const { t } = useTranslation();

  return (
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
            <ChevronDown className="h-4 w-4 text-[#85491c]" strokeWidth={2.5} />
          </span>
        </div>
      </div>

      <div
        className="album-grid mt-2 grid w-full gap-2"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(4, 1fr)",
          aspectRatio: "378/1135",
        }}
      >
        {ALBUM_IMAGES.map((name) => (
          <div key={name} className="album-grid__cell">
            <ImageWithSkeleton
              src={`${BASE}${name}`}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
