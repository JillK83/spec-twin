// src/lib/parser.ts
// Calls Gemini API to parse raw fabric/care text into structured data.
// Swap GEMINI → Anthropic by changing the fetch URL, model string, and auth header.

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent'

export type ParsedFabricData = {
  elastane_pct: number | null
  poly_pct: number | null   // null = absent from label, NOT zero percent
  rayon_pct: number | null  // null = absent from label, NOT zero percent
  closure_type: 'zipper' | 'button_fly' | 'elastic' | 'drawstring' | 'none'
  parser_confidence: number // 0.0 – 1.0
}

export type ParseResult =
  | { success: true; data: ParsedFabricData }
  | { success: false; parser_error: string }

const SYSTEM_PROMPT = `You are a garment fabric parser. Extract structured data from raw fabric and care label text.

Return ONLY valid JSON with no preamble, no markdown, no backticks.

Rules:
- elastane_pct: extract as a number representing the stretch fiber percentage. If the composition string is readable and NO stretch fiber is listed, return 0 — confirmed absent means zero percent. Return null ONLY if the entire composition string is unreadable or unparseable. Normalize ALL stretch fiber synonyms to this field: elastane, spandex, lycra, elaspan, creora, ROICA, dorlastan, linel, ESPA. If a stretch fiber is listed without a percentage, infer a typical percentage for that fiber in that blend context and reduce parser_confidence by 0.2. Do not return null unless the entire input is unreadable.
- poly_pct: extract as a number if polyester is present. If polyester is NOT mentioned, return null — never return 0 or empty string for an absent field. null means data unavailable, not zero percent.
- rayon_pct: extract as a number if any rayon-family fiber is present. Normalize ALL rayon synonyms to this field: rayon, viscose, lyocell, modal, tencel. If none are present, return null — never return 0 or empty string. null means data unavailable, not zero percent.
- closure_type: one of "zipper", "button_fly", "elastic", "drawstring", "none". Infer from context if not explicit. Default to "zipper" for denim if no closure mentioned.
- parser_confidence: float 0.0–1.0. 1.0 = all fields cleanly parsed. Reduce by 0.2 for each field that required inference. Reduce by 0.3 if input is vague or incomplete.

Output format:
{
  "elastane_pct": number | null,
  "poly_pct": number | null,
  "rayon_pct": number | null,
  "closure_type": "zipper" | "button_fly" | "elastic" | "drawstring" | "none",
  "parser_confidence": number
}`

export async function parseProductDetails(rawText: string): Promise<ParseResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  console.log('API KEY:', apiKey?.slice(0, 8))
  if (!apiKey) {
    return { success: false, parser_error: 'VITE_GEMINI_API_KEY not set' }
  }

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ parts: [{ text: rawText }] }]
  }

  try {
    const delays = [2000, 4000]
    let response: Response | null = null

    for (let attempt = 0; attempt < 3; attempt++) {
      response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (response.status !== 503) break
      if (attempt < 2) await new Promise(res => setTimeout(res, delays[attempt]))
    }

    if (!response!.ok) {
      return { success: false, parser_error: `API error: ${response!.status}` }
    }

    const json = await response!.json()
    console.log('Gemini raw response:', JSON.stringify(json, null, 2))

    const raw = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    const cleaned = raw.replace(/```json\n?|```\n?/g, '').trim()

    console.log('Parser raw text from Gemini:', cleaned)
    let parsed: ParsedFabricData | null = null
    try {
      parsed = JSON.parse(cleaned)
      console.log('Parser parsed JSON:', parsed)
    } catch {
      return { success: false, parser_error: 'Malformed JSON from parser after retry' }
    }

    if (parsed === null) {
      return { success: false, parser_error: 'Null result after parse' }
    }

    return { success: true, data: parsed }

  } catch (err) {
    return { success: false, parser_error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
