import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from './ui/magic/Input'
import { Label } from './ui/magic/Label'
import { Textarea } from './ui/magic/Textarea'
import { Button } from './ui/magic/Button'
import { ToggleGroup, ToggleGroupItem } from './ui/magic/ToggleGroup'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/magic/Card'
import { AnchorReferenceBar } from './AnchorReferenceBar'
import { AuditLoadingState } from './AuditLoadingState'
import { toast } from 'sonner'
import { Search, AlertTriangle } from 'lucide-react'

export function AuditNewItemForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawScenario = searchParams.get('scenario')
  const scenario =
    rawScenario === '1' || rawScenario === '2' || rawScenario === '3'
      ? rawScenario
      : '1'

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    brand: '',
    styleName: '',
    size: '',
    rise: '',
    details: '',
    url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData({ brand: '', styleName: '', size: '', rise: '', details: '', url: '' })
    setErrors({})
  }, [])

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setIsLoading(true)
    }
  }, [searchParams])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.brand.trim()) newErrors.brand = 'Required.'
    if (!formData.size.trim()) newErrors.size = 'Required.'
    if (!formData.rise.trim()) newErrors.rise = 'Required.'
    if (!formData.details.trim()) newErrors.details = 'Required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsLoading(true)
    } else {
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
    }
  }

  const errorClass =
    'border-[var(--primary)] shadow-[2px_2px_0px_0px_var(--primary)] focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] focus-visible:border-[var(--primary)]'

  if (isLoading) {
    return <AuditLoadingState onComplete={() => navigate(`/verdict/${scenario}`)} />
  }

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
      <Card className="w-full max-w-lg mx-auto border-2 border-border shadow-hard bg-card rounded-2xl overflow-hidden">
      {/* Amber Header */}
      <div className="bg-primary border-b-2 border-border p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(var(--foreground) 2px, transparent 2px)', backgroundSize: '16px 16px' }}
        />
        <CardHeader className="relative z-10 p-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
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

      <CardContent className="p-4 sm:p-6 space-y-5">
        {/* Anchor Reference Bar */}
        <div className="space-y-2">
          <Label className="text-base font-bold block">Your reference item</Label>
          <AnchorReferenceBar anchorLabel="Madewell Perfect Vintage Straight, Size 27x29" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand" className="text-base font-bold">Brand</Label>
            <Input
              id="brand"
              placeholder="e.g. AGOLDE"
              autoComplete="off"
              className={`input-retro text-base py-3 ${errors.brand ? errorClass : ''}`}
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
            />
            {errors.brand && <p className="text-[var(--primary)] font-bold text-sm">{errors.brand}</p>}
          </div>

          {/* Style / Model Name */}
          <div className="space-y-2">
            <Label htmlFor="styleName" className="text-base font-bold">
              Style / Model Name{' '}
              <span className="text-muted-foreground font-normal text-sm ml-1">(Optional)</span>
            </Label>
            <Input
              id="styleName"
              placeholder="e.g. 90s Cheeky, 501 Original"
              autoComplete="off"
              className="input-retro text-base py-3"
              value={formData.styleName}
              onChange={(e) => handleChange('styleName', e.target.value)}
            />
          </div>

          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size" className="text-base font-bold">Size</Label>
            <Input
              id="size"
              placeholder="e.g. 27 or M, L — waist size or numeric size"
              autoComplete="off"
              className={`input-retro text-base py-3 ${errors.size ? errorClass : ''}`}
              value={formData.size}
              onChange={(e) => handleChange('size', e.target.value)}
            />
            {errors.size && <p className="text-[var(--primary)] font-bold text-sm">{errors.size}</p>}
          </div>

          {/* Rise */}
          <div className="space-y-3">
            <Label className="text-base font-bold block">Rise</Label>
            <ToggleGroup
              type="single"
              value={formData.rise}
              onValueChange={(v) => v && handleChange('rise', String(v))}
              className={`justify-start bg-muted p-1 rounded-xl border-2 ${errors.rise ? 'border-[var(--primary)] shadow-[2px_2px_0px_0px_var(--primary)]' : 'border-border'}`}
            >
              <ToggleGroupItem value="high" className="rounded-lg font-bold px-4 data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">High</ToggleGroupItem>
              <ToggleGroupItem value="mid" className="rounded-lg font-bold px-4 data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Mid</ToggleGroupItem>
              <ToggleGroupItem value="low" className="rounded-lg font-bold px-4 data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Low</ToggleGroupItem>
            </ToggleGroup>
            {errors.rise && <p className="text-[var(--primary)] font-bold text-sm">{errors.rise}</p>}
          </div>

          {/* Fabric & Care Details */}
          <div className="space-y-2">
            <Label htmlFor="details" className="text-base font-bold">
              Paste or enter fabric and care details
            </Label>
            <Textarea
              id="details"
              rows={2}
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

          {/* Product URL */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-base font-bold">
              Product URL{' '}
              <span className="text-muted-foreground font-normal text-sm ml-1">(Optional)</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="e.g. https://www.everlane.com/products/..."
              autoComplete="off"
              className="input-retro py-3 text-base font-mono placeholder:font-mono"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
            />
            <p className="text-muted-foreground font-normal text-base">
              Stored for reference only — no scraping.
            </p>
          </div>
        </form>
      </CardContent>

      <CardFooter className="bg-muted p-4 sm:p-6 border-t-2 border-border flex flex-col sm:flex-row justify-end gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto border-2 border-border font-bold text-base py-3 px-6 hover:bg-background shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-all"
          onClick={() => {
            setFormData({ brand: '', styleName: '', size: '', rise: '', details: '', url: '' })
            setErrors({})
          }}
        >
          Cancel
        </Button>
        <Button
          className="w-full sm:w-auto bg-primary text-primary-foreground border-2 border-border font-black text-base py-3 px-6 uppercase tracking-wide shadow-hard shadow-hard-hover shadow-hard-active transition-all"
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
