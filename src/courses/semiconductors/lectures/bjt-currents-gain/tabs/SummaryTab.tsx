import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const FORMULAS = [
  { tex: '\\gamma=\\dfrac{1}{1+\\frac{N_B D_E W_B}{N_E D_B W_E}}', note: 'נצילות הזרקה (→1 כש-N_E≫N_B)' },
  { tex: 'b=\\dfrac{1}{\\cosh(W_B/L_B)}', note: 'מקדם מעבר (→1 בבסיס דק)' },
  { tex: '\\alpha=\\gamma\\,b', note: 'הגבר בסיס-משותף (≈1)' },
  { tex: '\\beta=\\dfrac{\\alpha}{1-\\alpha}', note: 'הגבר פולט-משותף (≫1)' },
]

/** Lecture 3ב — summary: core idea, cheat-sheet, pointer to 3ג. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון המרכזי">
        <p className="leading-relaxed text-slate-700">
          ההגבר נקבע ב<b>שני מקדמים</b>: נצילות-ההזרקה <Tex>{'\\gamma'}</Tex> (כמה מזרם-הפולט הוא הזרקה מועילה) ומקדם-המעבר{' '}
          <Tex>{'b'}</Tex> (כמה מההזרקה שורד לקולט). מכפלתם היא <Tex>{'\\alpha=\\gamma b\\approx1'}</Tex>, וממנה{' '}
          <Tex>{'\\beta=\\alpha/(1-\\alpha)\\gg1'}</Tex>. <b>פולט מסומם-כבד</b> ו<b>בסיס דק</b> מקרבים את <Tex>{'\\alpha'}</Tex> ל-1 — ומכאן ההגבר הגבוה.
        </p>
      </Panel>

      <Panel title="דף-עזר">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FORMULAS.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-base" dir="ltr"><Tex>{f.tex}</Tex></p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{f.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          <b>אופייני המוצא:</b> אזור פעיל <Tex>{'I_C\\approx\\beta I_B'}</Tex> (שטוח), רוויה ב-<Tex>{'V_{CE}\\lesssim0.2\\,V'}</Tex>.
          <b> Ebers-Moll:</b> <Tex>{'I_E=-I_F+\\alpha_R I_R'}</Tex>, <Tex>{'I_C=\\alpha_F I_F-I_R'}</Tex>, הדדיות <Tex>{'\\alpha_F I_{ES}=\\alpha_R I_{CS}'}</Tex>.
        </p>
      </Panel>

      <Panel title="מה בהמשך — חלק ג׳">
        <p className="leading-relaxed text-slate-700">
          ב<b>חלק ג׳</b> נעבור לאפקטים ה<b>לא-אידיאליים</b>: אפקט <b>Early</b> (אפנון רוחב-הבסיס → שיפוע באזור הפעיל),
          פריצה, <Tex>{'\\beta'}</Tex> לא-אידיאלי (עקומת <b>Gummel</b>), מודל אות-קטן (hybrid-π) ותדר-החיתוך <Tex>{'f_T'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
