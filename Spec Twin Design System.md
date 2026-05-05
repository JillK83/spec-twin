Aesthetic
Y2K Nostalgia / Neo-Retro — High-contrast, energetic, tactile. Thick borders, hard drop shadows, chunky rounded corners, dotted grid background.
________________


Color Palette
Token
	Value
	Usage
	Paper (Background)
	oklch(0.96 0.01 85) ~#F5F0E8
	Page & body background
	Card
	oklch(0.98 0.01 85)
	Form card surface, input backgrounds
	Ink (Foreground)
	oklch(0.2 0 0) ~#1A1A1A
	All text, borders, shadows
	Amber (Primary)
	oklch(0.82 0.18 85) ~#FFBF00
	Header block, Save button, validation error borders & toast
	Electric Lime (Secondary)
	oklch(0.88 0.2 130) ~#BFFF00
	Success toast background
	Vibrant Teal
	oklch(0.75 0.15 200) ~#00BCD4
	Tooltip sticker chips, input focus ring
	Muted
	oklch(0.92 0.01 85)
	Toggle group backgrounds, footer
	Muted Foreground
	oklch(0.4 0 0)
	Helper text, optional labels
	________________


Typography
Role
	Font
	Weight
	Notes
	Headings / Labels
	Geist (font-heading)
	700–900 (Bold/Black)
	All labels use text-lg font-bold
	Form Title
	Geist
	900 (Black)
	text-4xl uppercase tracking-tight
	Body / Inputs
	Geist
	400
	text-base for inputs
	Monospace
	Geist Mono (font-mono)
	400
	Material Composition placeholder only (placeholder:font-mono)
	________________


Layout
* Desktop-first, responsive to tablet via sm: breakpoints
* Max width: max-w-2xl (672px), centered
* Card with border-4 border-border rounded-2xl
* Content padding: p-6 sm:p-8
* Field spacing: space-y-8
* Brand & Category: grid grid-cols-1 sm:grid-cols-2 gap-6
* Gender & Fit Allowance: same grid layout
* Background: dotted grid pattern (radial-gradient, 24px spacing)
________________


Components & Fields
1. Header
* Amber (bg-primary) block with border-b-4
* Dotted pattern overlay at 10% opacity
* Title: "NEW ANCHOR" (no versioning)
* Subtitle: "Drop a new garment into the system."
* Tag icon in a rotated circle badge (desktop only)
2. Garment Name (Required)
* Component: Input
* Placeholder: e.g. Levi's dark blue low rise denim.
* Tooltip: Teal sticker — "Be specific! e.g. 'Vintage 1990s Levi's 501'"
* autoComplete="off"
3. Brand (Required)
* Component: Input (write-in text field, NOT a dropdown)
* Helper text: e.g. Levi's (shown below field when no error)
* autoComplete="off"
4. Category (Required)
* Component: Select
* Default: denim (Denim)
* Disabled options: Woven Tops, Knit Tops, Jackets, Coats, Trousers, Dresses, Skirts — each with "(coming soon)" suffix
5. Gender (Required)
* Component: ToggleGroup (single select)
* Order: Women | Unisex | Men
* Default: unisex
* Styled: bg-muted p-1 rounded-xl border-2 border-border
* Active state: bg-background shadow-sm border-2 border-border
6. Fit Allowance (Optional)
* Component: ToggleGroup (single select)
* Options: Strict | Moderate | Forgiving
* Default: moderate
* Label: "Fit Allowance (Optional)"
* Tooltip: Teal sticker — "Strict: Snug, no-stretch feel. / Forgiving: Easy fit that moves with you."
7. Material Composition (Required)
* Component: Textarea (rows=2, resize-none, maxLength=68)
* Placeholder: e.g. 98% Cotton... in monospace font
* Tooltip: Teal sticker — "Refer to carelabel for exact percentages and type what you see, we'll handle the formatting."
* autoComplete="off"
8. User Notes (Optional)
* Component: Input (maxLength=68)
* Placeholder: e.g. Leave any special details about how the item fits...
* Not validated — never blocks submission
* autoComplete="off"
________________


Shared Input Styling (.input-retro)
border-2 border-border rounded-xl
shadow: 2px 2px 0px 0px var(--border)
bg-card
Focus: border-teal, ring-3px teal at 30% opacity, shadow grows to 4px, translates -2px/-2px
Blur: returns to ink-black border, no ring
________________


Tooltip Stickers (.sticker-teal)
bg: var(--accent-teal)
text: var(--accent-teal-foreground)
border-2 border-border
shadow-hard (4px 4px 0px)
font-bold, px-4 py-2, rounded-lg
max-w-xs (wraps naturally)
Slight rotation: rotate(-2deg), hover: rotate(0)
Shape: Rectangular with rounded corners (NOT circular pills)
________________


Buttons
Button
	Style
	Save Anchor
	bg-primary text-primary-foreground border-2 font-black py-6 px-8 + shadow-hard with hover lift and active press effects
	Cancel
	variant="outline" border-2 font-bold py-6 px-8 + subtle hard shadow, hover lift
	________________


States & Feedback
Validation (on Save click)
* Required fields: Garment Name, Brand, Category, Gender, Material Composition
* Optional fields (never block): Fit Allowance, User Notes
* Error toast (Amber): "Missing Data — Please address required fields." — bg-primary, dark text, hard shadow, AlertTriangle icon, top-right position
* Inline errors: Required. text in amber below each missing field. Input borders change to amber with amber shadow.
Success (on valid Save)
* Toast (Electric Lime): "Anchor Saved — [Garment Name]" — bg-secondary, dark text, hard shadow, Sparkles icon
Anti-Hallucination
* useEffect on mount resets all fields to clean defaults
* All text inputs use autoComplete="off" to suppress browser autofill
________________


Accessibility (WCAG 2AA)
* All color pairings meet 4.5:1 contrast minimum (ink on paper, ink on amber, ink on lime, ink on teal)
* Semantic HTML: <form>, <label> with htmlFor, proper heading hierarchy
* Keyboard navigation: ToggleGroups are keyboard-accessible, focus-visible states on all interactive elements
* ARIA: Tooltip triggers use asChild pattern, disabled select items properly marked
* Focus ring: Teal ring visible only during keyboard/focus interaction, removed on blur