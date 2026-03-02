import { useState, type ImgHTMLAttributes } from "react";

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
  const [loaded, setLoaded] = useState(() =>
    typeof src === "string" ? loadedImageUrls.has(src) : false
  );

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (typeof src === "string") loadedImageUrls.add(src);
    setLoaded(true);
    onLoad?.(e);
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
        {...props}
      />
    </div>
  );
}
