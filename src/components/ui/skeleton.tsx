
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Return a div that just passes through the className and props
  // completely removing any loading or animation behavior
  return (
    <div
      className={cn("rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
