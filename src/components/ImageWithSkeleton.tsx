import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

/** Cache URL ảnh đã load – cuộn lại sẽ hiển thị luôn, không load lại */
const loadedImageUrls = new Set<string>();

type ImageWithSkeletonProps = ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string;
  /** true = fill container (absolute), false = intrinsic size (block w-full h-auto). Default true */
  fill?: boolean;
};

export function ImageWithSkeleton({
  src,
  alt,
  className = "",
  skeletonClassName = "",
  fill = true,
  onLoad,
  ...props
}: ImageWithSkeletonProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(() =>
    typeof src === "string" ? loadedImageUrls.has(src) : false
  );

  const markLoaded = () => {
    if (typeof src === "string") loadedImageUrls.add(src);
    setLoaded(true);
  };

  /** Ảnh từ cache đôi khi không fire onLoad — kiểm tra complete khi mount/đổi src */
  useEffect(() => {
    if (!src || typeof src !== "string" || loaded) return;
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) {
      markLoaded();
      return;
    }
    const probe = new Image();
    probe.src = src;
    if (probe.complete && probe.naturalWidth > 0) markLoaded();
  }, [src, loaded]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    markLoaded();
    onLoad?.(e);
  };

  const handleError = () => {
    markLoaded();
  };

  return (
    <div
      className={
        fill
          ? "relative w-full h-full min-h-[80px]"
          : "relative w-full min-h-[120px]"
      }
    >
      {!loaded && (
        <div
          className={`absolute inset-0 bg-gray-200/80 animate-pulse ${skeletonClassName}`}
          aria-hidden
        />
      )}
      <img
        {...props}
        ref={imgRef}
        src={src}
        alt={alt}
        className={
          fill
            ? `absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
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
