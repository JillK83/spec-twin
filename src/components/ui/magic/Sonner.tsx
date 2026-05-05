import React from 'react'
import { Toaster as SonnerToaster } from 'sonner'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ToasterProps {
  className?: string
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  theme?: 'light' | 'dark' | 'system'
  richColors?: boolean
  expand?: boolean
  closeButton?: boolean
}

const Toaster: React.FC<ToasterProps> = ({ theme = 'light', ...props }) => {
  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster as Sonner, Toaster }
