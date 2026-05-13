import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Input } from './ui/magic/Input'
import { Label } from './ui/magic/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/magic/Select'
import { ToggleGroup, ToggleGroupItem } from './ui/magic/ToggleGroup'
import { Textarea } from './ui/magic/Textarea'
import { Button } from './ui/magic/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/magic/Card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/magic/Tooltip'
import { toast } from 'sonner'
import { Info, Sparkles, Tag, AlertTriangle } from 'lucide-react'

export function AddAnchorForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'denim',
    size: '',
    gender: 'unisex',
    fitAllowance: 'moderate',
    material: '',
    userNotes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      setFormData({
        name: 'Madewell Perfect Vintage Straight',
        brand: 'Madewell',
        category: 'denim',
        size: '27x29',
        gender: 'women',
        fitAllowance: 'moderate',
        material: '99% Cotton, 1% Elastane',
        userNotes: '',
      })
    } else {
      setFormData({
        name: '',
        brand: '',
        category: 'denim',
        size: '',
        gender: 'unisex',
        fitAllowance: 'moderate',
        material: '',
        userNotes: '',
      })
    }
    setErrors({})
  }, [])

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
    if (!formData.name.trim()) newErrors.name = 'Required.'
    if (!formData.brand.trim()) newErrors.brand = 'Required.'
    if (!formData.category) newErrors.category = 'Required.'
    if (!formData.size.trim()) newErrors.size = 'Required.'
    if (!formData.gender) newErrors.gender = 'Required.'
    if (!formData.material.trim()) newErrors.material = 'Required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      toast.success(`Anchor Saved — ${formData.name}`, {
        style: {
          backgroundColor: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          border: '2px solid var(--border)',
          boxShadow: '4px 4px 0px 0px var(--border)',
          fontWeight: 'bold',
          borderRadius: '0.75rem',
          textAlign: 'center' as const,
        },
        icon: <Sparkles className="w-5 h-5" />,
      })
      navigate('/vault')
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

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
      <TooltipProvider delayDuration={200}>
      <Card className="w-full max-w-lg mx-auto border-2 border-border shadow-hard bg-card rounded-2xl overflow-hidden">
        <div className="bg-primary border-b-2 border-border p-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(var(--foreground) 2px, transparent 2px)', backgroundSize: '16px 16px' }}
          />
          <CardHeader className="relative z-10 p-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                  New Anchor
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 font-bold mt-2 text-lg">
                  Add a benchmark garment to your fit vault.
                </CardDescription>
              </div>
              <div className="hidden sm:flex h-16 w-16 bg-background border-4 border-border rounded-full items-center justify-center shadow-hard rotate-12">
                <Tag className="w-8 h-8" />
              </div>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-4 sm:p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Garment Name */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="text-base font-bold">Garment Name</Label>
                <Tooltip>
                  <TooltipTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-transparent border-none shadow-none p-0">
                    <div className="sticker-teal text-sm max-w-[200px]">Be specific! e.g. 'Vintage 1990s Levi's 501'</div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="name"
                placeholder="e.g. Levi's dark blue low rise denim."
                autoComplete="off"
                className={`input-retro text-base py-3 ${errors.name ? errorClass : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <p className="text-[var(--primary)] font-bold text-sm">{errors.name}</p>}
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-base font-bold">Brand</Label>
                <Input
                  id="brand"
                  placeholder="e.g. Levi's"
                  autoComplete="off"
                  className={`input-retro text-base py-3 ${errors.brand ? errorClass : ''}`}
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                />
                {errors.brand && <p className="text-[var(--primary)] font-bold text-sm">{errors.brand}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-bold">Category</Label>
                <Select value={formData.category} onValueChange={(v) => handleChange('category', v)}>
                  <SelectTrigger className={`w-full input-retro py-3 text-base h-auto ${errors.category ? errorClass : ''}`}>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="denim" className="font-bold">Denim</SelectItem>
                    <SelectItem value="woven-tops" disabled>Woven Tops (coming soon)</SelectItem>
                    <SelectItem value="knit-tops" disabled>Knit Tops (coming soon)</SelectItem>
                    <SelectItem value="jackets" disabled>Jackets (coming soon)</SelectItem>
                    <SelectItem value="coats" disabled>Coats (coming soon)</SelectItem>
                    <SelectItem value="trousers" disabled>Trousers (coming soon)</SelectItem>
                    <SelectItem value="dresses" disabled>Dresses (coming soon)</SelectItem>
                    <SelectItem value="skirts" disabled>Skirts (coming soon)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-[var(--primary)] font-bold text-sm">{errors.category}</p>}
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <Label htmlFor="size" className="text-base font-bold">Size</Label>
              <Input
                id="size"
                placeholder="e.g. 27x30 or Size 4"
                autoComplete="off"
                className={`input-retro text-base py-3 ${errors.size ? errorClass : ''}`}
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
              />
              {errors.size ? (
                <p className="text-[var(--primary)] font-bold text-sm">{errors.size}</p>
              ) : (
                <p className="text-muted-foreground font-normal text-base">Enter waist × inseam together</p>
              )}
            </div>

            {/* Gender & Fit Allowance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-base font-bold block">Gender</Label>
                <ToggleGroup
                  type="single"
                  value={formData.gender}
                  onValueChange={(v) => v && handleChange('gender', String(v))}
                  className={`justify-start bg-muted p-1 rounded-xl border-2 ${errors.gender ? 'border-[var(--primary)] shadow-[2px_2px_0px_0px_var(--primary)]' : 'border-border'}`}
                >
                  <ToggleGroupItem value="women" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Women</ToggleGroupItem>
                  <ToggleGroupItem value="unisex" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Unisex</ToggleGroupItem>
                  <ToggleGroupItem value="men" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Men</ToggleGroupItem>
                </ToggleGroup>
                {errors.gender && <p className="text-[var(--primary)] font-bold text-sm">{errors.gender}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-bold block">
                    Fit Allowance{' '}
                    <span className="text-muted-foreground font-normal text-sm ml-1">(Optional)</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="w-4 h-4" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-transparent border-none shadow-none p-0">
                      <div className="sticker-teal text-sm max-w-[200px]">
                        Strict: Snug, no-stretch feel.<br />
                        Forgiving: Easy fit that moves with you.
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <ToggleGroup
                  type="single"
                  value={formData.fitAllowance}
                  onValueChange={(v) => v && handleChange('fitAllowance', String(v))}
                  className="justify-start bg-muted p-1 rounded-xl border-2 border-border"
                >
                  <ToggleGroupItem value="strict" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Strict</ToggleGroupItem>
                  <ToggleGroupItem value="moderate" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Moderate</ToggleGroupItem>
                  <ToggleGroupItem value="forgiving" className="rounded-lg font-bold data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:border-2 data-[state=on]:border-border">Forgiving</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Material Composition */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="material" className="text-base font-bold">Material Composition</Label>
                <Tooltip>
                  <TooltipTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-transparent border-none shadow-none p-0">
                    <div className="sticker-teal text-sm max-w-[200px]">
                      Refer to care label for exact percentages and type what you see, we'll handle the formatting.
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="material"
                maxLength={68}
                rows={2}
                placeholder="e.g. 98% Cotton, 2% Elastane"
                autoComplete="off"
                className={`input-retro py-3 font-mono placeholder:font-mono text-base resize-none ${errors.material ? errorClass : ''}`}
                value={formData.material}
                onChange={(e) => handleChange('material', e.target.value)}
              />
              {errors.material ? (
                <p className="text-[var(--primary)] font-bold text-sm">{errors.material}</p>
              ) : (
                <p className="text-muted-foreground font-normal text-base">
                  Used to model stretch and recovery for your fit predictions.
                </p>
              )}
            </div>

            {/* User Notes */}
            <div className="space-y-2">
              <Label htmlFor="userNotes" className="text-base font-bold">
                User Notes{' '}
                <span className="text-muted-foreground font-normal text-sm ml-1">(Optional)</span>
              </Label>
              <Input
                id="userNotes"
                maxLength={68}
                placeholder="e.g. Runs slightly tight at the waist"
                autoComplete="off"
                className="input-retro py-3 text-base"
                value={formData.userNotes}
                onChange={(e) => handleChange('userNotes', e.target.value)}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter className="bg-muted p-4 sm:p-6 border-t-2 border-border flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-2 border-border font-bold text-base py-3 px-6 hover:bg-background shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-y-0.5 transition-all"
            onClick={() => {
              setFormData({ name: '', brand: '', category: 'denim', size: '', gender: 'unisex', fitAllowance: 'moderate', material: '', userNotes: '' })
              setErrors({})
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto bg-primary text-primary-foreground border-2 border-border font-black text-base py-3 px-6 uppercase tracking-wide shadow-hard shadow-hard-hover shadow-hard-active transition-all"
            onClick={handleSubmit}
          >
            Lock In First Anchor
          </Button>
        </CardFooter>
      </Card>
      </TooltipProvider>
      </div>
    </div>
  )
}
