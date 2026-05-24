import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export function VenueSection() {
  const { t } = useTranslation();

  return (
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
  );
}
