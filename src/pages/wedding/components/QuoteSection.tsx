import { useTranslation } from "react-i18next";
import { COLOR_BROWN } from "../constants";

export function QuoteSection() {
  const { t } = useTranslation();

  return (
    <div className="py-4">
      <div
        className="whitespace-pre-line text-center text-xl font-medium font-['Great_Vibes',cursive]"
        style={{ color: COLOR_BROWN }}
      >
        &ldquo;{t("quote")}&rdquo;
      </div>
    </div>
  );
}
