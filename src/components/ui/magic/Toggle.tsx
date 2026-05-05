import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-muted data-[state=on]:bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 rounded-md px-1.5 text-[0.8rem]",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant = "default", size = "default", pressed, defaultPressed = false, onPressedChange, onClick, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(defaultPressed)
    const controlledPressed = pressed !== undefined ? pressed : isPressed

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !controlledPressed
      if (pressed === undefined) setIsPressed(newPressed)
      onPressedChange?.(newPressed)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        data-slot="toggle"
        aria-pressed={controlledPressed}
        data-state={controlledPressed ? "on" : "off"}
        onClick={handleClick}
        className={cn(
          toggleVariants({ variant, size }),
          controlledPressed && "bg-muted",
          className
        )}
        {...props}
      />
    )
  }
)
Toggle.displayName = "Toggle"

export type { ToggleProps }
export { Toggle }
