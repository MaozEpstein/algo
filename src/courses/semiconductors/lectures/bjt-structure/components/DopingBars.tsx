import { useState } from 'react'
import Tex from '@/core/components/Tex'

/**
 * Interactive doping comparison for E / B / C. Three bars whose heights track the
 * doping magnitude (log scale) — N_E ≫ N_B > N_C — clickable to reveal WHY each
 * region is doped the way it is. Updates the dopant type (donors/acceptors) with the
 * npn/pnp choice.
 */
interface Props {
  kind: 'npn' | 'pnp'
}

const REGIONS = [
  {
    key: 'E',
    name: 'פולט',
    exp: 19,
    col: '#0ea5e9',
    barCls: 'bg-sky-400',
    selCls: 'border-sky-400 bg-sky-50',
    why: (
      <>
        <b>מסומם בכבדות</b> בכוונה: כך כמעט כל הזרם בצומת ה-BE הוא <b>הזרקת-מיעוט מהפולט</b> (ולא הזרקה-נגדית מהבסיס) —
        כלומר נצילות-הזרקה <Tex>{'\\gamma\\to1'}</Tex>.
      </>
    ),
  },
  {
    key: 'B',
    name: 'בסיס',
    exp: 17,
    col: '#f43f5e',
    barCls: 'bg-rose-400',
    selCls: 'border-rose-400 bg-rose-50',
    why: (
      <>
        <b>קל ודק</b> בכוונה: קל-סימום כדי שההזרקה-הנגדית תהיה זניחה, ו<b>דק</b> (<Tex>{'W_B\\ll L_B'}</Tex>) כדי שהמטען
        יחצה אותו בדיפוזיה <b>לפני שייעלם ברקומבינציה</b> — מקדם-מעבר <Tex>{'b\\to1'}</Tex>.
      </>
    ),
  },
  {
    key: 'C',
    name: 'קולט',
    exp: 16,
    col: '#38bdf8',
    barCls: 'bg-sky-300',
    selCls: 'border-sky-300 bg-sky-50',
    why: (
      <>
        <b>בינוני/קל ורחב</b>: סימום נמוך פורש <b>אזור-מחסור רחב</b> בצומת ה-CB, כדי שההתקן יעמוד ב<b>מתח-האחורי</b>
        הגדול שמופעל שם.
      </>
    ),
  },
]

export default function DopingBars({ kind }: Props) {
  const [sel, setSel] = useState(0)
  const npn = kind === 'npn'
  // npn: E donors, B acceptors, C donors  →  pnp inverts
  const dopant = (k: string) => {
    const donor = (k === 'B') === !npn // E,C are majority-type of the device; B is opposite
    return donor ? 'תורמים (n)' : 'מקבלים (p)'
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="leading-relaxed text-slate-700">
        שלוש האזורים נבדלים לא רק בסוג הסימום אלא ב<b>עוצמתו</b>, וזה לא מקרי — כל רמת-סימום נבחרה כדי לבצע תפקיד.
        הקישו על אזור כדי לראות <b>מדוע</b> הוא מסומם כך:
      </p>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* bars */}
        <div className="ltr flex items-end justify-center gap-3" dir="ltr" style={{ height: 150 }}>
          {REGIONS.map((r, i) => (
            <button
              key={r.key}
              onClick={() => setSel(i)}
              aria-pressed={sel === i}
              className="flex h-full w-20 flex-col items-center justify-end gap-1"
            >
              <span className="text-[11px] font-mono font-semibold text-slate-500" dir="ltr">10<sup>{r.exp}</sup></span>
              <span
                className={`w-full rounded-t-lg ${r.barCls} transition ${sel === i ? 'opacity-100 ring-2 ring-offset-1' : 'opacity-55'}`}
                style={{ height: (r.exp - 13) * 20 }}
              />
              <span
                className={`flex w-full flex-col items-center gap-0.5 rounded-lg border px-1 py-1 transition ${
                  sel === i ? r.selCls : 'border-slate-200 bg-white'
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[11px] font-extrabold text-white" dir="ltr">{r.key}</span>
                <span className="text-xs font-bold text-slate-700">{r.name}</span>
              </span>
            </button>
          ))}
        </div>

        {/* detail */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-extrabold text-white" dir="ltr">{REGIONS[sel].key}</span>
            <span className="font-bold text-slate-800">{REGIONS[sel].name}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200" dir="ltr">~10<sup>{REGIONS[sel].exp}</sup> cm⁻³ · {dopant(REGIONS[sel].key)}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{REGIONS[sel].why}</p>
        </div>
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        סדר-העוצמה <Tex>{'N_E\\gg N_B>N_C'}</Tex> זהה בשני הסוגים; ההבדל בין <b>npn</b> ל-<b>pnp</b> הוא רק{' '}
        <b>היפוך סוגי הנושאים</b> (תורמים↔מקבלים), ואיתו מתהפכים גם המתחים והזרמים.
      </p>
    </div>
  )
}
