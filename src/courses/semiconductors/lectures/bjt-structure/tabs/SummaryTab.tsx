import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import BjtOperationFlow from '../components/BjtOperationFlow'

const FORMULAS = [
  { tex: 'I_E=I_C+I_B', note: 'שימור זרם (KCL)' },
  { tex: 'b=\\dfrac{1}{\\cosh(W_B/L_B)}', note: 'מקדם מעבר — בסיס דק ⇐ b→1' },
  { tex: '\\alpha=b\\,\\gamma\\approx1', note: 'הגבר בבסיס משותף' },
  { tex: '\\beta=\\dfrac{\\alpha}{1-\\alpha}\\gg1', note: 'הגבר בפולט משותף' },
]

const MODES = [
  { be: 'אחורי', cb: 'אחורי', mode: 'קטעון', use: 'מפסק פתוח' },
  { be: 'קדמי', cb: 'אחורי', mode: 'פעיל-קדמי', use: 'מגבר ליניארי' },
  { be: 'קדמי', cb: 'קדמי', mode: 'רוויה', use: 'מפסק סגור' },
  { be: 'אחורי', cb: 'קדמי', mode: 'פעיל-הפוך', use: 'הגבר נמוך מאוד' },
]

/** Lecture 3א — summary: the core idea (sharpened), a one-glance recap, a formula
 *  cheat-sheet, the four-mode table, and pointers to 3ב / 3ג. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון המרכזי">
        <p className="leading-relaxed text-slate-700">
          הטרנזיסטור הדו-קוטבי הוא <b>מגבר-זרם</b>: זרם-בסיס זעיר <Tex>{'I_B'}</Tex> שולט בזרם-קולט גדול פי-<Tex>{'\\beta'}</Tex>.
          הסוד הוא <b>בסיס דק</b> בין שני צמתים — הפולט <b>מזריק</b> נושאי-מיעוט, הם <b>חוצים</b> את הבסיס הדק כמעט במלואם
          (אובדן הרקומבינציה זניח), והקולט <b>קולט</b> אותם. לכן <Tex>{'I_C\\approx I_E'}</Tex>, וההפרש — זרם-הבסיס —
          קטן מאוד, כך ש-<Tex>{'\\beta=I_C/I_B\\gg1'}</Tex>.
        </p>
      </Panel>

      <Panel title="הטרנזיסטור במבט אחד">
        <BjtOperationFlow />
      </Panel>

      <Panel title="דף-עזר — היחסים המרכזיים">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FORMULAS.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-lg" dir="ltr"><Tex>{f.tex}</Tex></p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{f.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          תנאי <b>פעיל-קדמי</b> (מצב ההגבר): <Tex>{'V_{BE}>0'}</Tex> (B-E קדמי) ו-<Tex>{'V_{BC}<0'}</Tex> (C-B אחורי).
          הזרם הוא זרם-דיפוזיה, ולכן פרופורציוני לשיפוע: <Tex>{'I_C\\propto \\Delta n(0)/W_B'}</Tex>.
        </p>
      </Panel>

      <Panel title="ארבעת מצבי-הפעולה">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600">
                <th className="px-3 py-2 font-semibold">צומת B-E</th>
                <th className="px-3 py-2 font-semibold">צומת C-B</th>
                <th className="px-3 py-2 font-semibold">מצב</th>
                <th className="px-3 py-2 font-semibold">שימוש</th>
              </tr>
            </thead>
            <tbody>
              {MODES.map((r, i) => {
                const active = r.mode === 'פעיל-קדמי'
                return (
                  <tr key={i} className={`border-t border-slate-100 ${active ? 'bg-violet-50' : 'bg-white'}`}>
                    <td className="px-3 py-2 text-blue-700">{r.be}</td>
                    <td className="px-3 py-2 text-blue-700">{r.cb}</td>
                    <td className={`px-3 py-2 font-bold ${active ? 'text-violet-800' : 'text-slate-700'}`}>{r.mode}</td>
                    <td className="px-3 py-2 text-slate-600">{r.use}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="מה בהמשך">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-violet-700">חלק ב׳ · זרמים והגבר</b><br />
            גזירה כמותית של רכיבי-הזרם מהפרופילים, <Tex>{'\\gamma'}</Tex> (נצילות הזרקה), <Tex>{'b'}</Tex> (מקדם מעבר),{' '}
            <Tex>{'\\alpha,\\beta'}</Tex>, אופייני המוצא ומודל Ebers-Moll.
          </div>
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">חלק ג׳ · אפקטים לא-אידיאליים</b><br />
            אפקט Early, פריצה, <Tex>{'\\beta'}</Tex> לא-אידיאלי (עקומת Gummel), מודל אות-קטן ותדר-חיתוך <Tex>{'f_T'}</Tex>.
          </div>
        </div>
      </Panel>
    </div>
  )
}
