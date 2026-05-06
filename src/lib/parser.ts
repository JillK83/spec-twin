// src/lib/parser.ts
// Calls Gemini API to parse raw fabric/care text into structured data.
// Swap GEMINI → Anthropic by changing the fetch URL, model string, and auth header.

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent'

export type ParsedFabricData = {
  elastane_pct: number
  poly_pct: number | null   // null = absent from label, NOT zero percent
  closure_type: 'zipper' | 'button_fly' | 'elastic' | 'drawstring' | 'none'
  parser_confidence: number // 0.0 – 1.0
}

export type ParseResult =
  | { success: true; data: ParsedFabricData }
  | { success: false; parser_error: string }

const SYSTEM_PROMPT = `You are a garment fabric parser. Extract structured data from raw fabric and care label text.

Return ONLY valid JSON with no preamble, no markdown, no backticks.

Rules:
- elastane_pct: extract as a number (0 if absent). Normalize ALL stretch fiber synonyms to this field: elastane, spandex, lycra, elaspan, creora, ROICA, dorlastan, linel, ESPA.
- poly_pct: extract as a number if polyester is present. If polyester is NOT mentioned, return null — never return 0 or empty string for an absent field. null means data unavailable, not zero percent.
- closure_type: one of "zipper", "button_fly", "elastic", "drawstring", "none". Infer from context if not explicit. Default to "zipper" for denim if no closure mentioned.
- parser_confidence: float 0.0–1.0. 1.0 = all fields cleanly parsed. Reduce by 0.2 for each field that required inference. Reduce by 0.3 if input is vague or incomplete.

Output format:
{
  "elastane_pct": number,
  "poly_pct": number | null,
  "closure_type": "zipper" | "button_fly" | "elastic" | "drawstring" | "none",
  "parser_confidence": number
}`

export async function parseProductDetails(rawText: string): Promise<ParseResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    return { success: false, parser_error: 'VITE_GEMINI_API_KEY not set' }
  }

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text: rawText }] }]
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return { success: false, parser_error: `API error: ${response.status}` }
    }

    const json = await response.json()
    const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    // Attempt 1: parse as-is
    // Attempt 2: strip markdown fences and retry once
    let parsed: ParsedFabricData | null = null
    try {
      parsed = JSON.parse(raw)
    } catch {
      try {
        const cleaned = raw.replace(/```json|```/g, '').trim()
        parsed = JSON.parse(cleaned)
      } catch {
        return { success: false, parser_error: 'Malformed JSON from parser after retry' }
      }
    }

    if (parsed === null) {
      return { success: false, parser_error: 'Null result after parse' }
    }

    return { success: true, data: parsed }

  } catch (err) {
    return { success: false, parser_error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
