import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Tex from '@/components/Tex'
import ComplexityProofButton from '@/components/ComplexityProofButton'
import type { AlgorithmSpec } from '@/engine/types'
import Panel from '../components/Panel'
import { countingSortSpec } from '../algorithms/countingSort'
import { radixSortSpec } from '../algorithms/radixSort'
import { bucketSortSpec } from '../algorithms/bucketSort'

interface Row {
  spec: AlgorithmSpec
  icon: string
  iconBg: string
  pill: string
  assume: ReactNode
  time: string
  noteHe?: string
  stable: boolean
  inPlace: boolean
  when: ReactNode
}

const ROWS: Row[] = [
  {
    spec: countingSortSpec,
    icon: '🔢',
    iconBg: 'bg-violet-100',
    pill: 'bg-violet-50 text-violet-700',
    assume: (
      <>
        שלמים ב-<Tex>{'1..k'}</Tex>
      </>
    ),
    time: 'O(n + k)',
    stable: true,
    inPlace: false,
    when: (
      <>
        טווח ערכים קטן (<Tex>{'k = O(n)'}</Tex>). ללא השוואות.
      </>
    ),
  },
  {
    spec: radixSortSpec,
    icon: '🔟',
    iconBg: 'bg-sky-100',
    pill: 'bg-sky-50 text-sky-700',
    assume: (
      <>
        <Tex>d</Tex> ספרות
      </>
    ),
    time: 'O(d(n + k))',
    stable: true,
    inPlace: false,
    when: (
      <>
        מספרים/מחרוזות באורך קבוע (<Tex>d</Tex> קבוע).
      </>
    ),
  },
  {
    spec: bucketSortSpec,
    icon: '🪣',
    iconBg: 'bg-emerald-100',
    pill: 'bg-emerald-50 text-emerald-700',
    assume: (
      <>
        אחיד ב-<Tex>{'[0,1)'}</Tex>
      </>
    ),
    time: 'O(n)',
    noteHe: 'תוחלת',
    stable: true,
    inPlace: false,
    when: (
      <>
        קלט פרוש אחיד; גרוע <Tex>{'O(n^2)'}</Tex>.
      </>
    ),
  },
]

interface SortItem {
  he: string
  en: string
  icon: string
  idea: string
  cx: string
  iconBg: string
  pill: string
}
const LINEAR: SortItem[] = [
  {
    he: 'מיון מנייה',
    en: 'Counting',
    icon: '🔢',
    idea: 'סופר כמה פעמים מופיע כל ערך, וממקם לפי סכומי-רישא.',
    cx: 'O(n + k)',
    iconBg: 'bg-violet-100',
    pill: 'bg-violet-50 text-violet-700',
  },
  {
    he: 'מיון בסיס',
    en: 'Radix',
    icon: '🔟',
    idea: 'ממיין ספרה-אחר-ספרה (מהפחותה), עם מיון יציב בכל מעבר.',
    cx: 'O(d(n+k))',
    iconBg: 'bg-sky-100',
    pill: 'bg-sky-50 text-sky-700',
  },
  {
    he: 'מיון דלי',
    en: 'Bucket',
    icon: '🪣',
    idea: 'מפזר ל-n דליים לפי הערך, ממיין כל דלי ומשרשר.',
    cx: 'O(n)^{*}',
    iconBg: 'bg-emerald-100',
    pill: 'bg-emerald-50 text-emerald-700',
  },
]

interface Mistake {
  wrong: ReactNode
  right: ReactNode
}
const MISTAKES: Mistake[] = [
  {
    wrong: (
      <>
        מיון מנייה "מנצח" את חסם ה-<Tex>{'\\Omega(n\\log n)'}</Tex>.
      </>
    ),
    right: 'אין סתירה: החסם תקף רק למיוני השוואה, ומיון מנייה אינו כזה.',
  },
  {
    wrong: 'מיון בסיס ממיין מהספרה המשמעותית ביותר.',
    right: 'דווקא מהפחות-משמעותית (LSD), עם מיון יציב בכל מעבר.',
  },
  {
    wrong: (
      <>
        מיון דלי הוא תמיד <Tex>O(n)</Tex>.
      </>
    ),
    right: (
      <>
        רק בתוחלת ובהתפלגות אחידה; אם הכול נופל לדלי אחד — <Tex>{'O(n^2)'}</Tex>.
      </>
    ),
  },
  {
    wrong: 'אפשר למיין מספרים שלמים בני 32 ביט במיון מנייה.',
    right: (
      <>
        לא — <Tex>{'k = 2^{32}'}</Tex> ענק מדי. כאן מיון בסיס על ספרות הוא הפתרון.
      </>
    ),
  },
]

const TH = 'py-2.5 px-3 text-start font-semibold whitespace-nowrap'
const TD = 'py-3 px-3 align-middle'

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ההבדל הגדול: מבנה במקום השוואות">
        <p className="leading-relaxed text-slate-600">
          מיון השוואות חסום ב-<Tex>\Omega(n \log n)</Tex>. שלושת המיונים כאן <b>מוותרים על השוואות</b>{' '}
          ומנצלים מבנה בקלט (טווח, ספרות, התפלגות) — וכך יורדים לזמן <b>לינארי</b>.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">המחיר: הנחות על הקלט וזיכרון נוסף.</p>
      </Panel>

      <Panel title="שלושת המיונים — הרעיון בקצרה">
        <div className="flex flex-col gap-3">
          {LINEAR.map((s) => (
            <div
              key={s.en}
              className="flex items-center gap-4 rounded-xl border border-slate-200 bg-gradient-to-l from-slate-50 to-white p-3.5"
            >
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl ${s.iconBg}`}>
                {s.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <b className="text-slate-800">{s.he}</b>
                  <span dir="ltr" className="font-mono text-xs text-slate-400">
                    {s.en}
                  </span>
                  <span className={`ms-auto shrink-0 rounded-lg px-2.5 py-1 text-sm font-semibold ${s.pill}`}>
                    <Tex>{s.cx}</Tex>
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{s.idea}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          <Tex>{'*'}</Tex> מיון דלי — <Tex>O(n)</Tex> בתוחלת (בהתפלגות אחידה); במקרה הגרוע{' '}
          <Tex>{'O(n^2)'}</Tex>.
        </p>
      </Panel>

      <Panel title="טבלת השוואה (המיונים הלינאריים)">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className={TH}>אלגוריתם</th>
                <th className={TH}>הנחה</th>
                <th className={TH}>זמן</th>
                <th className={TH}>יציב</th>
                <th className={TH}>במקום</th>
                <th className={TH}>מתי</th>
                <th className={`${TH} text-center`}>הוכחה</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.spec.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                  <td className={`${TD} whitespace-nowrap`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-base ${r.iconBg}`}>
                        {r.icon}
                      </span>
                      <span>
                        <span dir="ltr" className="block font-mono font-semibold text-slate-800">
                          {r.spec.titleEn}
                        </span>
                        <span className="block text-xs text-slate-400">{r.spec.titleHe}</span>
                      </span>
                    </div>
                  </td>
                  <td className={`${TD} whitespace-nowrap text-slate-600`}>{r.assume}</td>
                  <td className={`${TD} whitespace-nowrap`}>
                    <span className={`inline-block rounded-lg px-2.5 py-1 font-semibold ${r.pill}`}>
                      <Tex>{r.time}</Tex>
                    </span>
                    {r.noteHe && <span className="ms-1.5 text-xs text-slate-400">{r.noteHe}</span>}
                  </td>
                  <td className={TD}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      ✓ {r.stable ? 'יציב' : 'לא'}
                    </span>
                  </td>
                  <td className={`${TD} whitespace-nowrap text-slate-500`}>{r.inPlace ? 'במקום' : 'לא במקום'}</td>
                  <td className={`${TD} leading-relaxed text-slate-600`}>{r.when}</td>
                  <td className={`${TD} text-center`}>
                    <ComplexityProofButton algo={r.spec} variant="link" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          להשוואה מלאה מול מיוני ההשוואה (מיזוג, ערימה, מהיר) — ראו את{' '}
          <Link to="/overview" className="font-semibold text-sky-600 hover:underline">
            מבט-העל
          </Link>
          .
        </p>
      </Panel>

      <Panel title="טעויות נפוצות">
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m, i) => (
            <li key={i} className="flex flex-col gap-1">
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
                <span>{m.right}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="קשור">
        <p className="leading-relaxed text-slate-600">
          רענון על <Tex>O</Tex>/<Tex>\Theta</Tex>/<Tex>\Omega</Tex> וקצב גדילה —{' '}
          <Link to="/lecture/foundations?tab=complexity" className="font-semibold text-sky-600 hover:underline">
            שיעור 1 · סיבוכיות
          </Link>
          . אופטימליות מיון הערימה —{' '}
          <Link to="/lecture/heapsort/guided" className="font-semibold text-sky-600 hover:underline">
            שיעור 4
          </Link>
          .
        </p>
      </Panel>
    </div>
  )
}
