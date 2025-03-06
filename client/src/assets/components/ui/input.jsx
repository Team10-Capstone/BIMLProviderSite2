import * as React from "react"

import { cn } from "../../../utils/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md border border-[#ffffff10] bg-[#12151f]/50 px-4 py-2 text-gray-300 placeholder-[#4a4c52] transition-all focus:border-[#b760ea] focus:ring-2 focus:ring-[#b760ea]/10 focus:outline-none hover:border-[#ffffff20] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
