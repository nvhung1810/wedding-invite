import { useTranslation } from "react-i18next";
import { buildCalendarDays } from "../calendar";
import { COLOR_BROWN } from "../constants";

const HIGHLIGHT_DAY = 6;
const HEART_BG_URL =
  'center center / cover no-repeat scroll content-box border-box url("https://content.pancake.vn/1/s489x489/fwebp/9f/06/d9/3a/4f89683f3c43ed295fd5da05de67d0db47eb178a7d68b96e19166749.png")';

export function SaveTheDateSection() {
  const { t } = useTranslation();
  const calendarDays = buildCalendarDays(2026, 6);
  const weekdays = t("saveTheDate.weekdays", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="content-visibility-section mx-6 mt-6 rounded-2xl border border-solid border-[#85491c]/15 bg-[#fefcf6] px-4 py-6 shadow-sm">
      <p
        className="text-center text-3xl font-medium tracking-wide font-['Allura',cursive]"
        style={{ color: COLOR_BROWN }}
      >
        {t("saveTheDate.title")}
      </p>
      <p className="mt-1 text-center text-base" style={{ color: COLOR_BROWN }}>
        {t("saveTheDate.monthYear")}
      </p>

      <div className="mt-4 overflow-hidden rounded-lg">
        <div
          className="grid grid-cols-7 text-center text-xs font-medium text-[#fefcf6]"
          style={{ background: COLOR_BROWN }}
        >
          {weekdays.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 border border-t-0 border-[#85491c]/15 bg-[#fefcf6]">
          {calendarDays.map((day, i) => {
            const col = i % 7;
            const isSunday = col === 6;
            const isHighlight = day === HIGHLIGHT_DAY;

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
                          background: HEART_BG_URL,
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
  );
}
