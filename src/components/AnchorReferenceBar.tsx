interface AnchorReferenceBarProps {
  anchorLabel: string
}

export function AnchorReferenceBar({ anchorLabel }: AnchorReferenceBarProps) {
  return (
    <div className="bg-muted border-2 border-border rounded-xl px-4 py-3 shadow-[2px_2px_0px_0px_var(--border)] flex items-center gap-2 text-sm font-mono text-foreground">
      <span className="text-muted-foreground">Comparing against:</span>
      <span className="font-bold">{anchorLabel}</span>
    </div>
  )
}
