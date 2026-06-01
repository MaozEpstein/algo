import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { AlgorithmSpec } from '@/engine/types'
import Tex from '@/components/Tex'
import ComplexityProofButton from '@/components/ComplexityProofButton'
import ComplexityPill from '@/components/ComplexityPill'
import CollapsibleSection from '@/components/CollapsibleSection'
import { factorialSpec } from '../algorithms/factorial'
import { powerSpec } from '../algorithms/power'
import { multSpec } from '../algorithms/mult'
import { sumSpec } from '../algorithms/sum'
import { countDownSpec } from '../algorithms/countDown'
import { listLenSpec } from '../algorithms/listLen'

const ALGOS: AlgorithmSpec[] = [factorialSpec, powerSpec, multSpec, sumSpec, countDownSpec, listLenSpec]

const TABLE: { spec: AlgorithmSpec; baseHe: string; generalHe: string }[] = [
  { spec: factorialSpec, baseHe: 'factorial(1) = 1', generalHe: 'n · factorial(n-1)' },
  { spec: powerSpec, baseHe: 'power(b,0) = 1', generalHe: 'b · power(b,n-1)' },
  { spec: multSpec, baseHe: 'mult(a,0) = 0', generalHe: 'a + mult(a,b-1)' },
  { spec: sumSpec, baseHe: 'sum(0) = 0', generalHe: 'n + sum(n-1)' },
  { spec: countDownSpec, baseHe: 'n = 0 (עוצר)', generalHe: 'print(n); count_down(n-1)' },
  { spec: listLenSpec, baseHe: 'listLen([]) = 0', generalHe: '1 + listLen(lst[1:])' },
]

const MISTAKES: { wrong: string; right: string }[] = [
  {
    wrong: 'אפשר לכתוב פונקציה רקורסיבית בלי מקרה בסיס.',
    right: 'בלי תנאי עצירה הרקורסיה אינסופית — המחסנית מתמלאת עד שגיאת "Stack Overflow" (כמו addx/subx בשיעור).',
  },
  {
    wrong: 'הקריאה הרקורסיבית לבדה מספיקה.',
    right: 'צריך גם להחזיר/לשלב את התוצאה: `return n * factorial(n-1)` — לא רק לקרוא ל-factorial(n-1).',
  },
  {
    wrong: 'כל קריאה רקורסיבית חייבת להתקרב לבסיס באותו אופן.',
    right: 'העיקר שהקלט "קטֵן" בכל קריאה (n-1, או הרשימה בלי איבר) כך שמגיעים לבסיס. אחרת — רקורסיה אינסופית.',
  },
  {
    wrong: 'רקורסיה תמיד עדיפה על לולאה.',
    right: 'לבעיות הפשוטות כאן הרקורסיה בזבזנית בזיכרון (מחסנית בגודל O(n)). היתרון האמיתי שלה בא בבעיות שבהן הפתרון הרקורסיבי טבעי בהרבה (שיעור 3).',
  },
]

const SECTION_IDS = ['overview', 'def', 'stack', 'table', 'mistakes', 'see'] as const
type SectionId = (typeof SECTION_IDS)[number]

function DeepLink({ algo, children }: { algo: string; children: React.ReactNode }) {
  return (
    <Link
      to={`/lecture/recursion/guided?algo=${algo}`}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
    >
      🎬 {children}
    </Link>
  )
}

export default function RecursionSummary() {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(
    Object.fromEntries(SECTION_IDS.map((id) => [id, true])) as Record<SectionId, boolean>,
  )
  const allOpen = SECTION_IDS.every((id) => open[id])
  const toggle = (id: SectionId) => setOpen((s) => ({ ...s, [id]: !s[id] }))
  const setAll = (v: boolean) =>
    setOpen(Object.fromEntries(SECTION_IDS.map((id) => [id, v])) as Record<SectionId, boolean>)

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

      <CollapsibleSection title="מהי רקורסיה?" open={open.def} onToggle={() => toggle('def')}>
        <p className="leading-relaxed text-slate-600">
          פונקציה <b>רקורסיבית</b> היא פונקציה שקוראת לעצמה. רקורסיה היא שיטה לפתרון בעיה ע״י פירוקה
          לבעיות קטנות יותר ויותר, עד שמגיעים לבעיה בסיסית שפתרונה מיידי.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50 px-4 py-3">
            <span className="text-sm font-semibold text-emerald-700">מקרה בסיס</span>
            <p className="mt-1 text-sm text-slate-600">
              תנאי עצירה שפתרונו ידוע ומיידי — בלעדיו הרקורסיה לא נעצרת.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50 px-4 py-3">
            <span className="text-sm font-semibold text-sky-700">מקרה כללי</span>
            <p className="mt-1 text-sm text-slate-600">
              פותר את הבעיה בעזרת קריאה לעצמה על קלט <b>קטן יותר</b> — שמתקרב אל הבסיס.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="מאחורי הקלעים — מחסנית הקריאות (Stack)"
        open={open.stack}
        onToggle={() => toggle('stack')}
      >
        <p className="leading-relaxed text-slate-600">
          כשפונקציה קוראת לעצמה, כל קריאה צריכה "לזכור" היכן היא עצרה ומה הערכים שלה. לשם כך המחשב משתמש
          במבנה נתונים בשם <b>מחסנית (Stack)</b> — ערימה של "מסגרות", מסגרת לכל קריאה פעילה.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50 px-4 py-3">
            <span className="text-sm font-semibold text-sky-700">⬇ דחיפה (Push) — בכל קריאה</span>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              נוצרת מסגרת חדשה ונדחפת לראש המחסנית, ובה הפרמטרים והשורה הנוכחית.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50 px-4 py-3">
            <span className="text-sm font-semibold text-emerald-700">⬆ שליפה (Pop) — בכל חזרה</span>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              כשמגיעים למקרה הבסיס מתחילים לחזור: המסגרת העליונה מחזירה ערך, נמחקת, והערך משולב במסגרת
              שמתחתיה.
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            <b>LIFO</b> — הנתון האחרון שנכנס הוא הראשון שיוצא: הקריאה העמוקה ביותר היא הראשונה שמסתיימת.
          </div>
          <div className="rounded-xl border-s-4 border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
            לכן <b>עומק הרקורסיה = גובה המחסנית</b>, וזה גם הזיכרון שהפונקציה צורכת —{' '}
            <Tex>{'O(n)'}</Tex>. (ראו זאת חי בלשונית "ויזואליזציה מודרכת".)
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="סקירה כללית — הפונקציות"
        open={open.overview}
        onToggle={() => toggle('overview')}
      >
        <div className="flex flex-col gap-3">
          {ALGOS.map((a) => {
            const cases = TABLE.find((t) => t.spec.id === a.id)
            // Sentences for the prose, dropping the base/general one (shown as chips below).
            const prose = a.blurbHe
              .split('. ')
              .map((s) => s.trim())
              .filter((s) => s && !s.includes('מקרה בסיס'))
              .map((s) => (/[.!?)]$/.test(s) ? s : `${s}.`))
            return (
              <div key={a.id} className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span aria-hidden>🔁</span>
                  <span className="font-semibold text-slate-800">{a.titleHe.split(' — ')[0]}</span>
                  <span dir="ltr" className="ltr rounded bg-white px-1.5 py-0.5 font-mono text-xs text-slate-500 ring-1 ring-slate-200">
                    {a.titleEn}
                  </span>
                </div>
                <div className="flex flex-col gap-1 leading-relaxed text-slate-600">
                  {prose.map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                {cases && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border-s-4 border-emerald-300 bg-emerald-50 px-3 py-1.5">
                      <span className="text-xs font-semibold text-emerald-700">מקרה בסיס</span>
                      <span dir="ltr" className="ltr font-mono text-xs text-slate-700">{cases.baseHe}</span>
                    </span>
                    <span className="text-slate-300" aria-hidden>
                      →
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border-s-4 border-sky-300 bg-sky-50 px-3 py-1.5">
                      <span className="text-xs font-semibold text-sky-700">מקרה כללי</span>
                      <span dir="ltr" className="ltr font-mono text-xs text-slate-700">{cases.generalHe}</span>
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="טבלת הפונקציות" open={open.table} onToggle={() => toggle('table')}>
        <p className="mb-3 text-sm text-slate-500">
          לכל פונקציה: <span className="font-semibold text-emerald-700">מקרה הבסיס</span> (תנאי העצירה) ו
          <span className="font-semibold text-sky-700">המקרה הכללי</span> (הקריאה לעצמה). לחצו "מדוע?"
          לראות את ניתוח הסיבוכיות.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 text-center">פונקציה</th>
                <th className="px-4 py-3 text-center">מקרה בסיס</th>
                <th className="px-4 py-3 text-center">מקרה כללי</th>
                <th className="px-4 py-3 text-center">סיבוכיות</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map(({ spec, baseHe, generalHe }, idx) => (
                <tr
                  key={spec.id}
                  className={`border-t border-slate-100 align-middle ${idx % 2 ? 'bg-slate-50/40' : ''}`}
                >
                  <td dir="ltr" className="whitespace-nowrap px-4 py-3 text-center font-mono text-sm font-bold text-slate-800">
                    {spec.titleEn}
                  </td>
                  <td dir="ltr" className="whitespace-nowrap px-4 py-3 text-center font-mono text-xs text-emerald-700">
                    {baseHe}
                  </td>
                  <td dir="ltr" className="whitespace-nowrap px-4 py-3 text-center font-mono text-xs text-sky-700">
                    {generalHe}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <ComplexityPill tex={spec.complexity} />
                      <ComplexityProofButton algo={spec} variant="link" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>

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

      <div className="no-print">
        <CollapsibleSection title="ראו בעיניים" open={open.see} onToggle={() => toggle('see')}>
          <div className="flex flex-wrap gap-2">
            <DeepLink algo="factorial">עצרת</DeepLink>
            <DeepLink algo="power">חזקה</DeepLink>
            <DeepLink algo="mult">כפל</DeepLink>
            <DeepLink algo="sum">סכום</DeepLink>
            <DeepLink algo="countDown">ספירה לאחור</DeepLink>
            <DeepLink algo="listLen">אורך רשימה</DeepLink>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  )
}
