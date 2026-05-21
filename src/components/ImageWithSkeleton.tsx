import { useCallback, useState, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Cache URL ảnh đã load – cuộn lại sẽ hiển thị luôn, không load lại */
const loadedImageUrls = new Set<string>();

type ImageWithSkeletonProps = ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string;
  wrapperClassName?: string;
  /** true = fill container (absolute), false = intrinsic size (block w-full h-auto). Default true */
  fill?: boolean;
};

export function ImageWithSkeleton({
  src,
  alt,
  className = "",
  skeletonClassName = "",
  wrapperClassName = "",
  fill = true,
  onLoad,
  ...props
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(() =>
    typeof src === "string" ? loadedImageUrls.has(src) : false
  );

  const scheduleMarkLoaded = useCallback(() => {
    queueMicrotask(() => {
      setLoaded((prev) => {
        if (prev) return prev;
        if (typeof src === "string") loadedImageUrls.add(src);
        return true;
      });
    });
  }, [src]);

  const handleImgRef = (node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth > 0) {
      scheduleMarkLoaded();
    }
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    scheduleMarkLoaded();
    onLoad?.(e);
  };

  const handleError = () => {
    scheduleMarkLoaded();
  };

  return (
    <div
      className={cn(
        fill
          ? "relative h-full w-full min-h-[80px]"
          : "relative w-full min-h-[120px]",
        wrapperClassName
      )}
    >
      {!loaded && (
        <div
          className={cn(
            "absolute inset-0 z-[1] bg-[#85491c]/12 animate-pulse",
            skeletonClassName
          )}
          aria-hidden
        />
      )}
      <img
        {...props}
        ref={handleImgRef}
        src={src}
        alt={alt}
        className={
          fill
            ? `absolute inset-0 z-[2] h-full w-full object-cover transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              } ${className}`
            : `block w-full h-auto align-middle transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              } ${className}`
        }
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
