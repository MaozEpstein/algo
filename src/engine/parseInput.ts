import type { ValidateResult } from './types'

export interface ParseOptions {
  min?: number
  max?: number
  minValue?: number
  maxValue?: number
}

/**
 * Parse a raw sandbox string ("16, 4, 10 14") into a validated integer array.
 * Hebrew error messages, ready to show under the input.
 */
export function parseIntArray(
  raw: string,
  opts: ParseOptions = {},
): ValidateResult {
  const { min = 1, max = 31, minValue = 0, maxValue = 999 } = opts
  const trimmed = raw.trim()
  if (!trimmed) {
    return { ok: false, error: 'הזינו רשימת מספרים, מופרדים בפסיקים או רווחים.' }
  }
  const tokens = trimmed.split(/[\s,]+/).filter(Boolean)
  const values: number[] = []
  for (const tok of tokens) {
    if (!/^-?\d+$/.test(tok)) {
      return { ok: false, error: `"${tok}" אינו מספר שלם תקין.` }
    }
    const v = Number(tok)
    if (v < minValue || v > maxValue) {
      return {
        ok: false,
        error: `כל ערך חייב להיות בין ${minValue} ל-${maxValue} (קיבלנו ${v}).`,
      }
    }
    values.push(v)
  }
  if (values.length < min) {
    return { ok: false, error: `צריך לפחות ${min} מספרים.` }
  }
  if (values.length > max) {
    return { ok: false, error: `עד ${max} מספרים בבקשה (קיבלנו ${values.length}).` }
  }
  return { ok: true, value: { array: values } }
}
