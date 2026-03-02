import { useMemo } from "react";

const BEAR_COUNT = 16;
const FALL_DURATION_MIN = 10;
const FALL_DURATION_MAX = 16;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function FallingBears({ src = "/gaucute.png" }: { src?: string }) {
  const bears = useMemo(() => {
    const half = Math.floor(BEAR_COUNT / 2);
    // eslint-disable-next-line react-hooks/purity
    const leftPositions = Array.from({ length: half }, () => Math.random() * 42 + 4);
    // eslint-disable-next-line react-hooks/purity
    const rightPositions = Array.from({ length: BEAR_COUNT - half }, () => Math.random() * 42 + 54);
    const positions = shuffle([...leftPositions, ...rightPositions]);

    return positions.map((leftVal, i) => ({
      id: i,
      left: `${leftVal}%`,
      duration: FALL_DURATION_MIN + (i % (FALL_DURATION_MAX - FALL_DURATION_MIN + 1)),
      delay: -(i * 3) % 18,
      size: 40 + (i % 3) * 6,
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: "layout style paint" }}
      aria-hidden
    >
      {bears.map(({ id, left, duration, delay, size }) => (
        <div
          key={id}
          className="falling-bear absolute -top-20"
          style={{
            left,
            width: size,
            height: size,
            transform: "translateZ(0)",
            animation: `falling-bear ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
          }}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain drop-shadow-md"
          />
        </div>
      ))}
    </div>
  );
}
