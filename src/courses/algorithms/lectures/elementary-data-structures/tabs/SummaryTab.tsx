import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import type { AlgorithmSpec } from '@/core/engine/types'
import Panel from '../components/Panel'
import { chainingSpec, openAddressingSpec, directAddressSpec } from '../specs'

interface Row {
  spec: AlgorithmSpec
  icon: string
  iconBg: string
  pill: string
  structure: ReactNode
  time: string
  pro: ReactNode
  con: ReactNode
}

const ROWS: Row[] = [
  {
    spec: directAddressSpec,
    icon: '🎯',
    iconBg: 'bg-rose-100',
    pill: 'bg-rose-50 text-rose-700',
    structure: 'מערך לכל מפתח אפשרי',
    time: 'O(1)',
    pro: 'פשוט ומהיר ביותר',
    con: (
      <>
        זיכרון <Tex>{'\\Theta(|U|)'}</Tex>
      </>
    ),
  },
  {
    spec: chainingSpec,
    icon: '🔗',
    iconBg: 'bg-sky-100',
    pill: 'bg-sky-50 text-sky-700',
    structure: 'רשימה מקושרת לכל תא',
    time: 'O(1+\\alpha)',
    pro: (
      <>
        תומך <Tex>{'\\alpha > 1'}</Tex>; מחיקה קלה
      </>
    ),
    con: 'זיכרון נוסף למצביעים',
  },
  {
    spec: openAddressingSpec,
    icon: '📥',
    iconBg: 'bg-amber-100',
    pill: 'bg-amber-50 text-amber-700',
    structure: 'הכול בטבלה (probing)',
    time: '\\frac{1}{1-\\alpha}',
    pro: 'חוסך זיכרון; ידידותי למטמון',
    con: (
      <>
        מתדרדר כש-<Tex>{'\\alpha \\to 1'}</Tex>; מחיקה מורכבת
      </>
    ),
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
        גורם העומס <Tex>\alpha</Tex> תמיד קטן מ-1.
      </>
    ),
    right: (
      <>
        בשרשור <Tex>{'\\alpha'}</Tex> יכול לעבור 1 (שרשראות ארוכות); במיעון פתוח חובה <Tex>{'\\alpha < 1'}</Tex>.
      </>
    ),
  },
  {
    wrong: 'אפשר למחוק במיעון פתוח פשוט ע"י ריקון התא.',
    right: 'לא — זה שובר סדרות גישוש. צריך "מצבה" (tombstone).',
  },
  {
    wrong: 'פונקציית גיבוב טובה מספיקה כדי להבטיח ביצועים תמיד.',
    right: (
      <>
        יריב יכול לבחור מפתחות גרועים; <b>גיבוב אוניברסלי</b> (בחירת <Tex>h</Tex> אקראית) מבטיח ביצועים בתוחלת.
      </>
    ),
  },
  {
    wrong: (
      <>
        חיפוש בטבלת גיבוב הוא <Tex>O(1)</Tex> במקרה הגרוע.
      </>
    ),
    right: (
      <>
        רק <b>בתוחלת</b>. במקרה הגרוע (כל המפתחות לאותו תא) — <Tex>O(n)</Tex>.
      </>
    ),
  },
]

const TH = 'py-2.5 px-3 text-center font-semibold whitespace-nowrap'
const TD = 'py-3 px-3 align-middle'

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון הגדול: גיבוב במקום טווח">
        <p className="leading-relaxed text-slate-600">
          מיעון ישיר נותן <Tex>O(1)</Tex> אך דורש תא לכל מפתח אפשרי. <b>גיבוב</b> ממפה את המפתחות לטווח קטן{' '}
          <Tex>{'0..m-1'}</Tex> — וכך משיג <Tex>O(1)</Tex> <b>בתוחלת</b> עם זיכרון <Tex>O(n)</Tex>. המחיר: התנגשויות,
          שאותן פותרים בשרשור או במיעון פתוח.
        </p>
      </Panel>

      <Panel title="טבלת השוואה">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className={TH}>שיטה</th>
                <th className={TH}>מבנה</th>
                <th className={TH}>זמן חיפוש</th>
                <th className={TH}>יתרון</th>
                <th className={TH}>חיסרון</th>
                <th className={`${TH} text-center`}>הוכחה</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.spec.id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                  <td className={`${TD} whitespace-nowrap`}>
                    <div className="flex items-center justify-center gap-2.5">
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
                  <td className={`${TD} whitespace-nowrap text-slate-600`}>{r.structure}</td>
                  <td className={`${TD} whitespace-nowrap`}>
                    <span className={`inline-block rounded-lg px-2.5 py-1 font-semibold ${r.pill}`}>
                      <Tex>{r.time}</Tex>
                    </span>
                  </td>
                  <td className={`${TD} leading-relaxed text-slate-600`}>{r.pro}</td>
                  <td className={`${TD} leading-relaxed text-slate-600`}>{r.con}</td>
                  <td className={`${TD} text-center`}>
                    <ComplexityProofButton algo={r.spec} variant="link" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="גיבוב אוניברסלי">
        <p className="leading-relaxed text-slate-600">
          לכל פונקציית גיבוב <b>קבועה</b> קיים קלט "גרוע" (יריב שיודע את <Tex>h</Tex> יכול לבחור מפתחות שכולם מתנגשים,
          ואז חיפוש עולה <Tex>O(n)</Tex>). הפתרון: <b>לבחור את <Tex>h</Tex> אקראית</b> ממשפחה <Tex>H</Tex> שאינה תלויה
          במפתחות, כך שלכל זוג מפתחות שונים ההסתברות להתנגשות חסומה:
        </p>
        <div className="mt-2">
          <Tex block>{'\\Pr_{h \\in H}[\\,h(k_1) = h(k_2)\\,] \\le \\tfrac{1}{m}'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          כך מובטחים ביצועים טובים <b>בתוחלת</b>, ללא תלות בקלט — בדיוק כפי שראינו ב-Randomized-Quicksort.
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
          רעיון הרנדומיזציה נגד "יריב" הופיע כבר ב-
          <Link to={lecturePath('algorithms', 'quicksort', { mode: 'guided' })} className="font-semibold text-sky-600 hover:underline">
            שיעור 5 · Randomized-Quicksort
          </Link>
          . רענון על <Tex>O</Tex>/<Tex>\Theta</Tex> —{' '}
          <Link to={lecturePath('algorithms', 'foundations', { tab: 'complexity' })} className="font-semibold text-sky-600 hover:underline">
            שיעור 1 · סיבוכיות
          </Link>
          .
        </p>
      </Panel>
    </div>
  )
}
