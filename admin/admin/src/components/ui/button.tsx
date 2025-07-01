import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
            "bg-gray-700 text-gray-200 hover:bg-gray-600": variant === "secondary",
            "border border-gray-700 text-gray-300 hover:bg-gray-800": variant === "outline",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin mr-2">🌀</span>
        ) : (
          props.children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }