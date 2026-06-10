import type { LectureModule } from '@/core/engine/types'

/**
 * Course-wide quick-search index over the three STRUCTURED sources of every lecture:
 * formulas (נוסחאות), glossary concepts (מושגים) and symbols/variables (משתנים).
 * Not a free-text search over prose — only these. Powers the Ctrl+Shift+F modal.
 */

export type HitKind = 'formula' | 'concept' | 'symbol'

export interface SearchHit {
  kind: HitKind
  lectureId: string
  lectureTitle: string
  /** Hebrew label: formula name / concept term / symbol description. */
  label: string
  /** LaTeX to render: formula/concept tex, or the symbol itself. */
  tex?: string
  /** Secondary line: concept definition / symbol unit / formula note. */
  note?: string
  /** Normalized searchable text (all fields joined). */
  haystack: string
}

/**
 * Greek-letter glyphs → the LaTeX command stem they reduce to in the index (e.g. `\phi_F` → `phif`,
 * so the canonical token `phi` is a substring). Applied to BOTH the query and the indexed text, so a
 * raw `φ` and the data's `\phi` collapse to the same token. Substring-safe (glyphs don't occur in
 * ordinary Hebrew/Latin words). Greek uppercase is handled by the prior `toLowerCase()`.
 */
const GLYPH_ALIASES: [string, string][] = [
  ['φ', 'phi'], ['ϕ', 'phi'], ['ψ', 'psi'], ['ρ', 'rho'], ['χ', 'chi'],
  ['ε', 'epsilon'], ['β', 'beta'], ['μ', 'mu'], ['λ', 'lambda'], ['σ', 'sigma'],
  ['δ', 'delta'], ['α', 'alpha'], ['ω', 'omega'], ['τ', 'tau'], ['θ', 'theta'],
  ['γ', 'gamma'], ['κ', 'kappa'], ['η', 'eta'],
]

/**
 * WHOLE-query spellings (Latin loose + Hebrew phonetic) → canonical token. Matched only when the
 * entire trimmed query equals the key, so legitimate Hebrew/Latin queries (e.g. "רוחב", "field")
 * are never corrupted. This is what lets a user without a Greek keyboard type `fi` / `פיי` for φ.
 */
const EXACT_ALIASES: Record<string, string> = {
  fi: 'phi', phi: 'phi', psi: 'psi', rho: 'rho', chi: 'chi', eps: 'epsilon', epsilon: 'epsilon',
  beta: 'beta', mu: 'mu', lambda: 'lambda', sigma: 'sigma', delta: 'delta', alpha: 'alpha',
  פיי: 'phi', פאי: 'phi', פסי: 'psi', רו: 'rho', רהו: 'rho', אפסילון: 'epsilon', אפסילן: 'epsilon',
  ביתא: 'beta', בטא: 'beta', מיו: 'mu', למבדה: 'lambda', למדא: 'lambda', סיגמא: 'sigma',
  סיגמה: 'sigma', דלתא: 'delta', דלתה: 'delta', אלפא: 'alpha',
}

const stripLatex = (s: string) => s.replace(/[\\${}\s_,()|]/g, '')
const applyGlyphs = (s: string) => GLYPH_ALIASES.reduce((t, [g, tok]) => (t.includes(g) ? t.split(g).join(tok) : t), s)

/**
 * Normalize INDEXED text: lowercase, fold Greek glyphs, strip LaTeX punctuation/underscores —
 * so `V_T`, `V_{T}`, `vt` all collapse to `vt`. Hebrew passes through unchanged.
 */
export function normalize(s: string): string {
  return stripLatex(applyGlyphs(s.toLowerCase()))
}

/** Normalize a QUERY: like `normalize`, plus whole-query Latin/Hebrew aliases for Greek letters. */
export function normalizeQuery(raw: string): string {
  const t = raw.trim().toLowerCase()
  const aliased = Object.prototype.hasOwnProperty.call(EXACT_ALIASES, t) ? EXACT_ALIASES[t] : t
  return stripLatex(applyGlyphs(aliased))
}

const KIND_RANK: Record<HitKind, number> = { formula: 0, concept: 1, symbol: 2 }

/** Flatten every lecture's formulas/glossary/symbols into one searchable index. */
export function buildIndex(lectures: LectureModule[]): SearchHit[] {
  const hits: SearchHit[] = []
  for (const lec of lectures) {
    const base = { lectureId: lec.id, lectureTitle: lec.titleHe }
    for (const f of lec.formulas ?? []) {
      hits.push({ ...base, kind: 'formula', label: f.name, tex: f.tex, note: f.note, haystack: normalize(`${f.name} ${f.tex} ${f.note ?? ''}`) })
    }
    for (const g of lec.glossary ?? []) {
      hits.push({ ...base, kind: 'concept', label: g.term, tex: g.tex, note: g.def, haystack: normalize(`${g.term} ${g.def} ${g.tex ?? ''}`) })
    }
    for (const s of lec.symbols ?? []) {
      hits.push({ ...base, kind: 'symbol', label: s.he, tex: s.sym, note: s.unit, haystack: normalize(`${s.sym} ${s.he} ${s.unit ?? ''}`) })
    }
  }
  return hits
}

/** Substring match on the normalized query; empty query → no hits. Capped, grouped by kind. */
export function search(index: SearchHit[], query: string, cap = 80): SearchHit[] {
  const q = normalizeQuery(query)
  if (!q) return []
  return index
    .filter((h) => h.haystack.includes(q))
    .sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind])
    .slice(0, cap)
}
