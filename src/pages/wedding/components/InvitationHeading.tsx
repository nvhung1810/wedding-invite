import { useTranslation } from "react-i18next";

export function InvitationHeading() {
  const { t } = useTranslation();

  return (
    <section className="content-visibility-section text-center">
      <p className="text-3xl tracking-widest text-[#85491c] font-['Allura',cursive]">
        {t("invitation.title")}
      </p>
      <h2 className="text-xs font-semibold text-[#85491c] sm:text-[0.9rem]">
        {t("invitation.subtitle")}
      </h2>
    </section>
  );
}
