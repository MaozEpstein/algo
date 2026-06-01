import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import type { AlgorithmSpec } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import RoutineBadge from '@/core/components/RoutineBadge'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import ComplexityPill from '@/core/components/ComplexityPill'
import CollapsibleSection from '@/core/components/CollapsibleSection'
import { mergeSortSpec } from '../algorithms/mergeSort'
import { mergeSpec } from '../algorithms/merge'
import { hanoiSpec } from '../algorithms/hanoi'

const ALGOS: AlgorithmSpec[] = [mergeSortSpec, mergeSpec, hanoiSpec]

const TABLE: { spec: AlgorithmSpec; descHe: string; noteHe: string }[] = [
  { spec: mergeSortSpec, descHe: 'מיון מיזוג', noteHe: 'תמיד; משתמש בזיכרון עזר' },
  { spec: mergeSpec, descHe: 'מיזוג שני חצאים ממוינים', noteHe: 'מעבר לינארי אחד' },
  { spec: hanoiSpec, descHe: 'מגדלי האנוי', noteHe: 'מספר המהלכים = 2ⁿ−1' },
]

const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'גם למיון מיזוג יש "מקרה גרוע" של O(n²) כמו ל-Quicksort.',
    right: 'לא — הפיצול תמיד מאוזן בדיוק, ולכן הזמן הוא תמיד Θ(n log n), לכל קלט.',
  },
  {
    wrong: 'מיון מיזוג ממיין במקום (in-place).',
    right: 'לא — שלב המיזוג דורש מערך עזר בגודל Θ(n). זה המחיר של היציבות והזמן המובטח.',
  },
  {
    wrong: 'מיון מיזוג אינו יציב.',
    right: 'דווקא כן יציב — כשהערכים שווים, המיזוג מעדיף את האיבר מהחצי השמאלי ושומר על הסדר.',
  },
  {
    wrong: 'אפשר לפתור את מגדלי האנוי במספר מהלכים פולינומי.',
    right: 'מספר המהלכים המינימלי הוא בדיוק 2ⁿ−1 — גדילה מעריכית. אין דרך מהירה יותר.',
  },
]

const SECTION_IDS = ['overview', 'def', 'table', 'see', 'mistakes'] as const
type SectionId = (typeof SECTION_IDS)[number]

function DeepLink({ algo, children }: { algo: string; children: React.ReactNode }) {
  return (
    <Link
      to={lecturePath('algorithms', 'divide-and-conquer', { algo })}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
    >
      🎬 {children}
    </Link>
  )
}

export default function DivideConquerSummary() {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(
    Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as Record<SectionId, boolean>,
  )
  const allOpen = SECTION_IDS.every((id) => open[id])
  const toggle = (id: SectionId) => setOpen((s) => ({ ...s, [id]: !s[id] }))
  const setAll = (value: boolean) =>
    setOpen(Object.fromEntries(SECTION_IDS.map((id) => [id, value])) as Record<SectionId, boolean>)

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={() => setAll(!allOpen)}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
        >
          {allOpen ? 'כווץ הכל' : 'הרחב הכל'}
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <CollapsibleSection
          title="סקירה כללית — מה כל אלגוריתם עושה"
          open={open.overview}
          onToggle={() => toggle('overview')}
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-[auto_auto_1fr] sm:items-center">
            {ALGOS.map((a) => (
              <Fragment key={a.id}>
                <span dir="ltr" className="whitespace-nowrap font-mono text-sm font-semibold text-slate-800">
                  {a.titleEn}
                </span>
                <div className="justify-self-start">
                  <RoutineBadge kind={a.kind} size="sm" />
                </div>
                <p className="text-start leading-relaxed text-slate-600">{a.blurbHe}</p>
              </Fragment>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="חלק וכבוש (Divide & Conquer)" open={open.def} onToggle={() => toggle('def')}>
          <p className="leading-relaxed text-slate-600">
            שני האלגוריתמים כאן בנויים על אותו עיקרון — <b>"חלק וכבוש"</b>: מפצלים בעיה לתת-בעיות
            קטנות יותר, פותרים כל אחת רקורסיבית, ומשלבים את הפתרונות.
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            <b>מיון מיזוג</b> מפצל את המערך לשני חצאים, ממיין כל חצי, ו<b>ממזג</b> אותם — נוסחת הנסיגה{' '}
            <Tex>{'T(n)=2T(n/2)+\\Theta(n)'}</Tex> נותנת <Tex>{'\\Theta(n\\log n)'}</Tex>.
          </p>
          <p className="mt-2 leading-relaxed text-slate-600">
            <b>מגדלי האנוי</b> מעבירים n−1 דיסקיות הצידה, מזיזים את הגדולה, ומעבירים n−1 חזרה —{' '}
            <Tex>{'T(n)=2T(n-1)+1'}</Tex> נותנת <Tex>{'2^n-1'}</Tex>.
          </p>
          <div className="no-print mt-3 rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-3 text-sm text-violet-900">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>
                💡 רוצים לראות <b>למה</b> מיון מיזוג רץ תמיד באותו זמן? זו דוגמה למקרה 2 בשיטת האב:
              </span>
              <Link
                to={lecturePath('algorithms', 'recurrences', { tab: 'master' })}
                className="shrink-0 rounded-lg border border-violet-300 bg-white px-3 py-1.5 font-semibold text-violet-700 transition hover:bg-violet-100"
              >
                ↪ שיטת האב (שיעור 3ב)
              </Link>
            </div>
            <div dir="ltr" className="ltr mt-2 text-center">
              <Tex block>{'T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n\\log n)'}</Tex>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="טבלת סיבוכיות" open={open.table} onToggle={() => toggle('table')}>
          <p className="mb-3 text-sm text-slate-500">לחצו על "מדוע?" בכל שורה כדי לראות את הוכחת הסיבוכיות.</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-center text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500">
                  <th className="py-2.5 px-3 text-center font-semibold">אלגוריתם</th>
                  <th className="py-2.5 px-3 text-center font-semibold">סוג</th>
                  <th className="py-2.5 px-3 text-center font-semibold">תיאור</th>
                  <th className="py-2.5 px-3 text-center font-semibold">סיבוכיות</th>
                  <th className="py-2.5 px-3 text-center font-semibold">הערה</th>
                  <th className="py-2.5 px-3 text-center font-semibold">הוכחה</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(({ spec, descHe, noteHe }) => (
                  <tr key={spec.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                    <td dir="ltr" className="py-3 px-3 text-center font-mono text-sm font-semibold text-slate-800">
                      {spec.titleEn}
                    </td>
                    <td className="py-3 px-3">
                      <RoutineBadge kind={spec.kind} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-slate-600">{descHe}</td>
                    <td className="py-3 px-3">
                      <ComplexityPill tex={spec.complexity} />
                    </td>
                    <td className="py-3 px-3 text-sm text-slate-500">{noteHe}</td>
                    <td className="py-3 px-3">
                      <ComplexityProofButton algo={spec} variant="link" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        <div className="no-print">
          <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
            <div className="flex flex-wrap gap-2">
              <DeepLink algo="mergeSort">מיון מיזוג</DeepLink>
              <DeepLink algo="merge">מיזוג</DeepLink>
              <DeepLink algo="hanoi">מגדלי האנוי</DeepLink>
            </div>
          </CollapsibleSection>
        </div>

        <CollapsibleSection title="טעויות נפוצות" open={open.mistakes} onToggle={() => toggle('mistakes')}>
          <ul className="flex flex-col gap-3">
            {MISTAKES.map((m) => (
              <li key={m.wrong} className="flex flex-col gap-1">
                <span className="flex items-baseline gap-2 font-medium text-slate-700">
                  <span className="text-rose-500" aria-hidden>
                    ✗
                  </span>
                  <span className="line-through decoration-rose-300">{m.wrong}</span>
                </span>
                <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                  <span className="text-emerald-500" aria-hidden>
                    ✓
                  </span>
                  {m.right}
                </span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>
      </div>
    </div>
  )
}
