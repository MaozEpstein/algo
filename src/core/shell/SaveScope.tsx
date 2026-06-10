import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useFeature } from '@/core/platform/features'
import { useSavedItems, makeId, hashText } from '@/core/platform/savedItems'

/** Clean visible text of an element (drops KaTeX's hidden MathML so notes aren't garbled). */
function cleanText(el: Element): string {
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.katex-mathml').forEach((n) => n.remove())
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim()
}

interface Bullet {
  top: number
  text: string
}

/**
 * Wraps lesson content and shows a small, faint ＋ in a right gutter next to EVERY bullet (<li>) —
 * click to add/remove that bullet to the learning list (kind 'note'). The ＋ brightens on hover and
 * turns ✓ when saved. Positions are measured from the live DOM (ResizeObserver-synced). Renders plain
 * children when the savedList feature is off.
 */
export default function SaveScope({ courseId, lectureId, tab, children }: { courseId: string; lectureId: string; tab?: string; children: ReactNode }) {
  const on = useFeature('savedList')
  const saved = useSavedItems()
  const scopeRef = useRef<HTMLDivElement>(null)
  const [bullets, setBullets] = useState<Bullet[]>([])

  useEffect(() => {
    if (!on) return
    const sc = scopeRef.current
    if (!sc) return
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const sr = sc.getBoundingClientRect()
        const next: Bullet[] = []
        sc.querySelectorAll('li').forEach((li) => {
          const r = li.getBoundingClientRect()
          const text = cleanText(li)
          if (text.length > 1) next.push({ top: r.top - sr.top + 3, text })
        })
        setBullets(next)
      })
    }
    measure()
    const t = window.setTimeout(measure, 300) // after KaTeX/layout settles
    const ro = new ResizeObserver(measure)
    ro.observe(sc)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [on, children])

  if (!on) return <>{children}</>

  return (
    <div ref={scopeRef} className="relative pe-7">
      {children}
      {bullets.map((b, i) => {
        const refId = hashText(b.text)
        const id = makeId(courseId, lectureId, 'note', refId)
        const isSaved = saved.isSaved(id)
        return (
          <button
            key={`${i}-${refId}`}
            onClick={() => saved.toggle({ id, courseId, lectureId, kind: 'note', refId, label: b.text, note: b.text, tab, addedAt: Date.now() })}
            title={isSaved ? 'נשמר ללמידה — לחצו להסרה' : 'הוסף בולט זה ללמידה'}
            aria-label="הוסף ללמידה"
            style={{ top: b.top, insetInlineEnd: 0 }}
            className={`absolute z-20 grid h-5 w-5 place-items-center rounded-full text-xs font-bold transition ${isSaved ? 'bg-amber-400 text-white opacity-100' : 'bg-amber-50 text-amber-500 opacity-40 hover:opacity-100 hover:bg-amber-100'}`}
          >
            {isSaved ? '✓' : '＋'}
          </button>
        )
      })}
    </div>
  )
}
