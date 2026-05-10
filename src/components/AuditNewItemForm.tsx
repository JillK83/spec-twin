import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { runAudit } from '../lib/audit'
import { Input } from './ui/magic/Input'
import { Label } from './ui/magic/Label'
import { Textarea } from './ui/magic/Textarea'
import { Button } from './ui/magic/Button'
import { ToggleGroup, ToggleGroupItem } from './ui/magic/ToggleGroup'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/magic/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/magic/Select'
import { AuditLoadingState } from './AuditLoadingState'
import { toast } from 'sonner'
import { Search, AlertTriangle } from 'lucide-react'
import type { Rise } from '../lib/engine/types'
import type { UserAnchor } from '../lib/database.types'

export function AuditNewItemForm() {
  const navigate = useNavigate()

  const [allAnchors, setAllAnchors] = useState<UserAnchor[]>([])
  const [anchor, setAnchor] = useState<UserAnchor | null>(null)
  const [anchorLoading, setAnchorLoading] = useState(true)
  const [profileRise, setProfileRise] = useState<Rise | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const auditPromiseRef = useRef<ReturnType<typeof runAudit> | null>(null)
  const [formData, setFormData] = useState({
    brand: '',
    styleName: '',
    size: '',
    rise: '' as Rise | '',
    silhouette: '',
    details: '',
    url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadAnchorAndProfile() {
      const { data: anchorRows } = await supabase
        .from('user_anchors')
        .select('*')
        .order('created_at', { ascending: false })

      const fetched = (anchorRows ?? []) as unknown as UserAnchor[]
      setAllAnchors(fetched)
      setAnchor(fetched[0] ?? null)

      // reads rise_primary written by onboarding Screen 1; falls back to 'high' if onboarding not completed
      const profile = JSON.parse(localStorage.getItem('spec_twin_profile') ?? '{}')
      setProfileRise((profile.rise_primary as Rise) ?? 'high')

      setAnchorLoading(false)
    }
    loadAnchorAndProfile()
  }, [])

  useEffect(() => {
    setFormData({ brand: '', styleName: '', size: '', rise: '', silhouette: '', details: '', url: '' })
    setErrors({})
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.brand.trim()) newErrors.brand = 'Required.'
    if (!formData.size.trim()) newErrors.size = 'Required.'
    if (!formData.rise) newErrors.rise = 'Required.'
    if (!formData.silhouette) newErrors.silhouette = 'Required.'
    if (!formData.details.trim()) newErrors.details = 'Required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!anchor) return

    if (!validate()) {
      toast.error('Missing Data — Please address required fields.', {
        style: {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: '2px solid var(--border)',
          boxShadow: '4px 4px 0px 0px var(--border)',
          fontWeight: 'bold',
          borderRadius: '0.75rem',
        },
        icon: <AlertTriangle className="w-5 h-5" />,
      })
      return
    }

    const userPrimaryRise: Rise = profileRise ?? (formData.rise as Rise)

    auditPromiseRef.current = runAudit({
      anchorId: anchor.id,
      targetBrand: formData.brand.trim(),
      targetModel: formData.styleName.trim() || undefined,
      targetSize: formData.size.trim(),
      targetSilhouette: formData.silhouette,
      targetFiberText: formData.details.trim(),
      targetRise: formData.rise as Rise,
      targetUrl: formData.url.trim() || undefined,
      userPrimaryRise,
    })

    setIsLoading(true)
  }

  const handleLoadingComplete = async () => {
    if (!anchor || !auditPromiseRef.current) return

    const result = await auditPromiseRef.current

    if ('error' in result) {
      setIsLoading(false)
      toast.error(`Audit failed: ${result.error}`, {
        style: {
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: '2px solid var(--border)',
          boxShadow: '4px 4px 0px 0px var(--border)',
          fontWeight: 'bold',
          borderRadius: '0.75rem',
        },
        icon: <AlertTriangle className="w-5 h-5" />,
      })
      return
    }

    navigate('/verdict/open', {
      state: {
        auditOutput: result,
        targetBrand: formData.brand.trim(),
        targetModel: formData.styleName.trim() || undefined,
        anchorLabel: anchor ? `${anchor.brand_model}, Size ${anchor.size}` : 'Your anchor',
      },
    })
  }

  const errorClass =
    'border-[var(--primary)] shadow-[2px_2px_0px_0px_var(--primary)] focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] focus-visible:border-[var(--primary)]'

  if (isLoading) {
    return <AuditLoadingState onComplete={handleLoadingComplete} />
  }

  if (!anchorLoading && !anchor) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl mx-auto border-4 border-border shadow-hard bg-card rounded-2xl overflow-hidden">
          <div className="bg-primary border-b-4 border-border p-6">
            <CardTitle className="text-2xl font-black uppercase">No Anchor Found</CardTitle>
          </div>
          <CardContent className="p-6 sm:p-8 space-y-4">
            <p className="text-lg font-bold">You need to save an anchor garment before running an audit.</p>
            <p className="text-muted-foreground">Head to <strong>New Anchor</strong> to drop your first reference item into the system.</p>
          </CardContent>
          <CardFooter className="bg-muted p-6 border-t-4 border-border">
            <Button
              className="bg-primary text-primary-foreground border-2 border-border font-black text-base py-6 px-8 uppercase tracking-wide shadow-hard"
              onClick={() => navigate('/anchor/new')}
            >
              Add Your First Anchor
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <Card className="w-full max-w-2xl mx-auto border-4 border-border shadow-hard bg-card rounded-2xl overflow-hidden">
          <div className="bg-primary border-b-4 border-border p-6 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(var(--foreground) 2px, transparent 2px)', backgroundSize: '16px 16px' }}
            />
            <CardHeader className="relative z-10 p-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-4xl font-black tracking-tight uppercase flex items-center gap-3">
                    Audit New Item
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 font-bold mt-2 text-lg">
                    Run a spec-twin fit audit before you buy.
                  </CardDescription>
                </div>
                <div className="hidden sm:flex h-16 w-16 bg-background border-4 border-border rounded-full items-center justify-center shadow-hard rotate-12">
                  <Search className="w-8 h-8" />
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-8">
            <div className="space-y-2">
              <Label className="text-lg font-bold block">Compare against</Label>
              <Select
                value={anchor ? `${anchor.brand_model}, Size ${anchor.size}` : ''}
                onValueChange={(v) =>
                  setAnchor(
                    allAnchors.find((a) => `${a.brand_model}, Size ${a.size}` === v) ?? null
                  )
                }
              >
                <SelectTrigger className="w-full input-retro py-6 text-base h-auto">
                  <SelectValue placeholder="Select an anchor..." />
                </SelectTrigger>
                <SelectContent>
                  {allAnchors.map((a) => (
                    <SelectItem
                      key={a.id}
                      value={`${a.brand_model}, Size ${a.size}`}
                      className="font-bold"
                    >
                      {a.brand_model}, Size {a.size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-lg font-bold">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g. AGOLDE"
                    autoComplete="off"
                    className={`input-retro text-lg py-6 ${errors.brand ? errorClass : ''}`}
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                  />
                  {errors.brand && <p className="text-[var(--primary)] font-bold text-sm">{errors.brand}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="styleName" className="text-lg font-bold">
                    Style / Model{' '}
                    <span className="text-muted-foreground font-normal text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="styleName"
                    placeholder="e.g. 90s Cheeky"
                    autoComplete="off"
                    className="input-retro text-lg py-6"
                    value={formData.styleName}
                    onChange={(e) => handleChange('styleName', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-lg font-bold">Size</Label>
                <Input
                  id="size"
                  placeholder="e.g. 27 or M, L — waist size or numeric size"
                  autoComplete="off"
                  className={`input-retro text-lg py-6 ${errors.size ? errorClass : ''}`}
                  value={formData.size}
                  onChange={(e) => handleChange('size', e.target.value)}
                />
                {errors.size && <p className="text-[var(--primary)] font-bold text-sm">{errors.size}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-lg font-bold block">This item's rise</Label>
                  <ToggleGroup
                    type="single"
                    value={formData.rise}
                    onValueChange={(v) => v && handleChange('rise', String(v))}
                    className={`justify-start bg-muted p-1 rounded-xl border-2 ${errors.rise ? 'border-[var(--primary)] shadow-[2px_2px_0px_0px_var(--primary)]' : 'border-border'}`}
                  >
                    <ToggleGroupItem value="high" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">High</ToggleGroupItem>
                    <ToggleGroupItem value="mid" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Mid</ToggleGroupItem>
                    <ToggleGroupItem value="low" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Low</ToggleGroupItem>
                  </ToggleGroup>
                  {errors.rise && <p className="text-[var(--primary)] font-bold text-sm">{errors.rise}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="silhouette" className="text-lg font-bold">This item's leg shape</Label>
                  <Select value={formData.silhouette} onValueChange={(v) => handleChange('silhouette', v)}>
                    <SelectTrigger className={`w-full input-retro py-6 text-base h-auto ${errors.silhouette ? errorClass : ''}`}>
                      <SelectValue placeholder="Select leg shape..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skinny" className="font-bold">Skinny</SelectItem>
                      <SelectItem value="straight" className="font-bold">Straight</SelectItem>
                      <SelectItem value="relaxed_loose" className="font-bold">Relaxed / Loose</SelectItem>
                      <SelectItem value="bootcut_flare" className="font-bold">Bootcut / Flare</SelectItem>
                      <SelectItem value="wide_leg" className="font-bold">Wide Leg</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.silhouette && <p className="text-[var(--primary)] font-bold text-sm">{errors.silhouette}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-lg font-bold">
                  Paste or enter fabric and care details
                </Label>
                <Textarea
                  id="details"
                  rows={6}
                  placeholder="e.g. 98% Cotton, 2% Elastane — zipper fly"
                  autoComplete="off"
                  className={`input-retro py-3 font-mono placeholder:font-mono text-base resize-none ${errors.details ? errorClass : ''}`}
                  value={formData.details}
                  onChange={(e) => handleChange('details', e.target.value)}
                />
                {errors.details ? (
                  <p className="text-[var(--primary)] font-bold text-sm">{errors.details}</p>
                ) : (
                  <p className="text-muted-foreground font-normal text-base">
                    Include material percentages for the most accurate audit.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url" className="text-lg font-bold">
                  Product URL{' '}
                  <span className="text-muted-foreground font-normal text-sm ml-1">(Optional)</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="e.g. https://www.everlane.com/products/..."
                  autoComplete="off"
                  className="input-retro py-6 text-base font-mono placeholder:font-mono"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                />
                <p className="text-muted-foreground font-normal text-base">
                  Save the link to revisit this item later.
                </p>
              </div>
            </form>
          </CardContent>

          <CardFooter className="bg-muted p-6 sm:p-8 border-t-4 border-border flex flex-col sm:flex-row justify-end gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-border font-bold text-base py-6 px-8 hover:bg-background shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-all"
              onClick={() => {
                setFormData({ brand: '', styleName: '', size: '', rise: '', silhouette: '', details: '', url: '' })
                setErrors({})
              }}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto bg-primary text-primary-foreground border-2 border-border font-black text-base py-6 px-8 uppercase tracking-wide shadow-hard shadow-hard-hover shadow-hard-active transition-all"
              disabled={anchorLoading || !anchor}
              onClick={handleSubmit}
            >
              Run Audit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
