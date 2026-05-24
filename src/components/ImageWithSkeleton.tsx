import { useState, type ImgHTMLAttributes } from "react"
import { Skeleton } from "./ui/skeleton"
import { cn } from "@/lib/utils"

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  skeletonClassName?: string
  wrapperClassName?: string
  fill?: boolean
}

export function ImageWithSkeleton({
  src, alt, className, skeletonClassName, wrapperClassName,
  fill = true, onLoad, onError, children, ...props
}: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn(
      fill ? "relative h-full w-full min-h-[80px]" : "relative w-full min-h-[120px]",
      wrapperClassName
    )}>
      {!loaded && (
        <Skeleton
          className={cn("absolute inset-0 z-[1] rounded-none bg-[#85491c]/10", skeletonClassName)}
          aria-hidden
        />
      )}
      <img
        {...props}
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          fill ? "absolute inset-0 z-[2] h-full w-full object-cover" : "block h-auto w-full align-middle",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(e) => { setLoaded(true); onLoad?.(e) }}
        onError={(e) => { setLoaded(true); onError?.(e) }}
      />
      {children}
    </div>
  )
}