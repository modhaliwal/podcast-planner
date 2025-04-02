
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Return a simple div without animation
  // We're removing the skeleton loading behavior per requirements
  return (
    <div
      className={cn("rounded-md bg-transparent", className)}
      {...props}
    />
  )
}

export { Skeleton }
