import React from 'react'

interface AnchorReferenceBarProps {
  anchorLabel: string
}

export function AnchorReferenceBar({ anchorLabel }: AnchorReferenceBarProps) {
  return (
    <div className="bg-muted border-2 border-border rounded-xl px-4 py-3">
      <span className="font-bold text-base text-foreground">{anchorLabel}</span>
    </div>
  )
}
