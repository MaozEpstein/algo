import { useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import RichText from '@/core/components/RichText'
import { useFeature } from '@/core/platform/features'
import { useCourse } from '@/core/platform/CourseProvider'

const STOP = new Set(['של', 'את', 'על', 'אם', 'כי', 'מה', 'זה', 'הוא', 'היא', 'גם', 'או', 'אבל', 'יש', 'אין', 'כל', 'לפי', 'בין', 'עם', 'ללא', 'אינו', 'הם', 'הן'])
const isWordChar = (ch: string) => /[֐-׿A-Za-z]/.test(ch)
/** Fold a LaTeX symbol to a comparable key (V_T, V_{T} → vt). */
const normSym = (s: string) => s.toLowerCase().replace(/[\\${}\s_,()|]/g, '')

interface Hit { term: string; def: string }

/** Resolve the word under a viewport point (text nodes only). */
function wordAt(x: number, y: number): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = document as any
  let node: Node | null = null
  let offset = 0
  if (doc.caretRangeFromPoint) {
    const r: Range | null = doc.caretRangeFromPoint(x, y)
    if (!r) return ''
    node = r.startContainer
    offset = r.startOffset
  } else if (doc.caretPositionFromPoint) {
    const c = doc.caretPositionFromPoint(x, y)
    if (!c) return ''
    node = c.offsetNode
    offset = c.offset
  }
  if (!node || node.nodeType !== 3) return ''
  const text = node.textContent ?? ''
  let s = offset
  let e = offset
  while (s > 0 && isWordChar(text[s - 1])) s--
  while (e < text.length && isWordChar(text[e])) e++
  return text.slice(s, e).toLowerCase()
}

/**
 * Hover-dictionary: after the pointer rests ~450 ms on a word that matches a course glossary term,
 * a small popover shows the term + explanation. No underline/marking. Long-press on touch. Gated by
 * the hoverDict feature (off by default). Renders children untouched when off.
 */
export default function HoverDictScope({ children }: { children: ReactNode }) {
  const on = useFeature('hoverDict')
  const { course } = useCourse()
  const scopeRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const [pop, setPop] = useState<{ x: number; y: number; hit: Hit } | null>(null)

  const index = useMemo(() => {
    const m = new Map<string, Hit>()
    if (!on) return m
    const addTokens = (text: string, hit: Hit) => {
      const plain = text.replace(/\$[^$]*\$/g, ' ').toLowerCase()
      for (const tok of plain.split(/[^֐-׿a-z]+/)) if (tok.length >= 3 && !STOP.has(tok) && !m.has(tok)) m.set(tok, hit)
    }
    // concepts first (they win on shared words), then variables — everything in "מושגי יסוד"
    for (const lec of course.LECTURE_LIST) for (const g of lec.glossary ?? []) addTokens(g.term, { term: g.term, def: g.def })
    for (const lec of course.LECTURE_LIST)
      for (const s of lec.symbols ?? []) addTokens(s.he, { term: `$${s.sym}$`, def: s.unit ? `${s.he} · [${s.unit}]` : s.he })
    return m
  }, [on, course])

  // a symbol index keyed by the normalized LaTeX, so hovering a rendered variable (KaTeX) resolves it
  const symIndex = useMemo(() => {
    const m = new Map<string, Hit>()
    if (!on) return m
    for (const lec of course.LECTURE_LIST)
      for (const s of lec.symbols ?? []) {
        const key = normSym(s.sym)
        if (key && !m.has(key)) m.set(key, { term: `$${s.sym}$`, def: s.unit ? `${s.he} · [${s.unit}]` : s.he })
      }
    return m
  }, [on, course])

  if (!on) return <>{children}</>

  const probe = (x: number, y: number) => {
    if (!scopeRef.current) return
    let hit: Hit | undefined
    // 1) a rendered variable (KaTeX) under the pointer → resolve via its LaTeX source
    const el = document.elementFromPoint(x, y) as Element | null
    const kx = el?.closest('.katex')
    if (kx) {
      const tex = kx.querySelector('annotation')?.textContent ?? ''
      hit = symIndex.get(normSym(tex))
    }
    // 2) otherwise a prose word
    if (!hit) {
      const w = wordAt(x, y)
      hit = w ? index.get(w) : undefined
    }
    if (hit) {
      const r = scopeRef.current.getBoundingClientRect()
      setPop({ x: x - r.left, y: y - r.top, hit })
    } else setPop(null)
  }

  const onMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => probe(clientX, clientY), 450)
  }
  const clear = () => {
    window.clearTimeout(timer.current)
    setPop(null)
  }
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => probe(t.clientX, t.clientY), 500)
  }

  return (
    <div ref={scopeRef} className="relative" onMouseMove={onMove} onMouseLeave={clear} onTouchStart={onTouchStart} onTouchMove={clear} onTouchEnd={clear}>
      {children}
      <AnimatePresence>
        {pop && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{ left: Math.max(8, pop.x - 130), top: pop.y + 16 }}
            className="pointer-events-none absolute z-30 w-[260px] rounded-2xl border border-violet-200 bg-white p-3 text-right shadow-xl"
            dir="rtl"
          >
            <p className="mb-1 text-sm font-bold text-violet-700"><RichText>{pop.hit.term}</RichText></p>
            <p className="text-xs leading-relaxed text-slate-600"><RichText>{pop.hit.def}</RichText></p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
