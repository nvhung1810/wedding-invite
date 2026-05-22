import {
  useCallback,
  useState,
  type ImgHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ─── URL cache ────────────────────────────────────────────────────────────────
// Persists across mounts so images that were already loaded in this session
// skip the skeleton entirely when the component re-mounts (e.g. after scroll).
const loadedUrls = new Set<string>();

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageWithSkeletonProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Extra classes applied to the skeleton overlay element */
  skeletonClassName?: string;
  /** Extra classes applied to the outer wrapper div */
  wrapperClassName?: string;
  /**
   * true  → image fills the wrapper absolutely (use when wrapper has a fixed
   *          size / aspect-ratio, e.g. inside a grid cell).
   * false → image is intrinsic (block, w-full, h-auto); wrapper sizes to image.
   * @default true
   */
  fill?: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ImageWithSkeleton({
  src,
  alt,
  className,
  skeletonClassName,
  wrapperClassName,
  fill = true,
  onLoad,
  onError,
  children,
  ...props
}: ImageWithSkeletonProps) {
  // Start as "loaded" if we already saw this URL in the current session.
  const [loaded, setLoaded] = useState(
    () => typeof src === "string" && loadedUrls.has(src),
  );

  const markLoaded = useCallback(() => {
    if (typeof src === "string") loadedUrls.add(src);
    setLoaded(true);
  }, [src]);

  // ── Detect images that are already decoded in the browser cache ─────────────
  // When React attaches the <img> node, if the browser already has the image
  // in cache, `complete` is true and `onLoad` never fires → we check here.
  const imgRef = useCallback(
    (node: HTMLImageElement | null) => {
      if (node?.complete && node.naturalWidth > 0) markLoaded();
    },
    [markLoaded],
  );

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      markLoaded();
      onLoad?.(e);
    },
    [markLoaded, onLoad],
  );

  // On error we still hide the skeleton so it doesn't linger on broken images.
  const handleError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      markLoaded();
      onError?.(e);
    },
    [markLoaded, onError],
  );

  return (
    <div
      className={cn(
        // BUG FIX: fill=false wrapper had no height when image hasn't loaded
        // yet, so the absolute-positioned skeleton would collapse to 0.
        // min-h ensures the skeleton is always visible while loading.
        fill
          ? "relative h-full w-full min-h-[80px]"
          : "relative w-full min-h-[120px]",
        wrapperClassName,
      )}
    >
      {/* Skeleton — unmounts after load to remove it from the DOM entirely */}
      {!loaded && (
        <div
          // BUG FIX: bg-[#85491c]/12 is not a valid Tailwind opacity modifier
          // (only multiples of 5 and a few extras like /15 are generated).
          // Changed to /10 which is always safe.
          className={cn(
            "absolute inset-0 z-[1] animate-pulse bg-[#85491c]/10",
            skeletonClassName,
          )}
          aria-hidden
        />
      )}

      <img
        {...props}
        ref={imgRef}
        src={src}
        alt={alt}
        // BUG FIX: was building className via template literals which can
        // produce duplicate/conflicting classes. cn() merges cleanly.
        className={cn(
          "transition-opacity duration-300",
          fill
            ? "absolute inset-0 z-[2] h-full w-full object-cover"
            : "block h-auto w-full align-middle",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={handleLoad}
        onError={handleError}
      />

      {children}
    </div>
  );
}