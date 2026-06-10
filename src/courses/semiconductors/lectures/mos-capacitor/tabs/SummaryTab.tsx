import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const FORMULAS: { name: string; tex: string }[] = [
  { name: 'פוטנציאל פרמי', tex: '\\phi_F=\\dfrac{kT}{q}\\ln\\dfrac{N_A}{n_i}' },
  { name: 'הפרש פונקציות-עבודה', tex: '\\phi_{MS}=\\phi_M-\\left(\\chi_S+\\tfrac{E_g}{2}+q\\phi_F\\right)' },
  { name: 'מתח flat-band (אידיאלי)', tex: 'V_{FB}=\\phi_{MS}' },
  { name: 'קיבול-אוקסיד', tex: 'C_{ox}=\\dfrac{\\varepsilon_{ox}\\varepsilon_0}{t_{ox}}' },
  { name: 'רוחב דלדול', tex: 'W=\\sqrt{\\dfrac{2\\varepsilon_s\\,\\psi_s}{qN_A}}' },
  { name: 'מטען דלדול', tex: 'Q_{dep}=\\sqrt{2q\\varepsilon_sN_A\\psi_s}' },
]

const ROWS: [string, React.ReactNode, React.ReactNode, React.ReactNode][] = [
  ['הצטברות', <Tex>{'V_G<V_{FB}'}</Tex>, <>חורים (נושאי-רוב) בשפה</>, <>פסים מתכופפים מעלה</>],
  ['דלדול', <Tex>{'V_{FB}<V_G<V_T'}</Tex>, <>יוני-מקבל שליליים</>, <>כיפוף מטה, <Tex>{'W,\\psi_s'}</Tex> גדלים</>],
  ['היפוך', <Tex>{'V_G>V_T'}</Tex>, <>ערוץ אלקטרונים (מיעוט)</>, <><Tex>{'\\psi_s=2\\phi_F'}</Tex>, <Tex>{'W=W_{max}'}</Tex></>],
]

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'השער של קבל-MOS מושך זרם DC.', right: 'לא — האוקסיד מבודד; השער פועל קיבולית (שדה) בלבד, כמעט ללא זרם.' },
  { wrong: 'בהיפוך רוחב-הדלדול ממשיך לגדול עם $V_G$.', right: 'לא — הוא ננעל על $W_{max}$; תוספת המטען מאוזנת ע״י אלקטרוני-ההיפוך, ו-$\\psi_s$ נשאר $2\\phi_F$.' },
  { wrong: 'במצע p, היפוך יוצר עוד חורים בשפה.', right: 'להפך — היפוך יוצר שכבת $אלקטרונים$ (נושאי-מיעוט), ערוץ מסוג הפוך מהמצע.' },
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'mos-capacitor', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תקציר">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li><b>מבנה:</b> מתכת–אוקסיד–מוליך (M-O-S); זהו ה"קבל" שבלב ה-MOSFET. השער שולט במטען בפני-השטח דרך <b>שדה</b>, כמעט ללא זרם.</li>
          <li><b>קבל-MOS כקבל:</b> האוקסיד = מרווח עם שדה קבוע; בצד המוליך המטען מתפרש על רוחב-דלדול ולכן השדה דועך.</li>
          <li><b>פסים ו-<Tex>{'V_{FB}'}</Tex>:</b> הפרש פונקציות-העבודה <Tex>{'\\phi_{MS}'}</Tex> מכופף את הפסים; <Tex>{'V_{FB}=\\phi_{MS}'}</Tex> מיישר אותם.</li>
          <li><b>שלושה משטרים:</b> הצטברות (<Tex>{'V_G<V_{FB}'}</Tex>) · דלדול · היפוך (<Tex>{'V_G>V_T'}</Tex>). מתח-השער קובע איזה.</li>
        </ul>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FORMULAS.map((f) => (
            <div key={f.name} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
              <span className="text-xs font-semibold text-slate-500">{f.name}</span>
              <Tex block>{f.tex}</Tex>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-slate-500">(מתח-הסף <Tex>{'V_T=V_{FB}+2\\phi_F+Q_{dep,max}/C_{ox}'}</Tex> נפתח לעומק בחלק ב׳.)</p>
      </Panel>

      <Panel title="שלושת המשטרים — סיכום">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">משטר</th>
                <th className="py-2.5 px-3 font-semibold">תנאי</th>
                <th className="py-2.5 px-3 font-semibold">מטען בשפה</th>
                <th className="py-2.5 px-3 font-semibold">כיפוף הפסים</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {ROWS.map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="py-2.5 px-3 font-medium text-slate-700">{r[0]}</td>
                  <td className="py-2.5 px-3">{r[1]}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r[2]}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="תובנות מפתח">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-600">
          <li><b>זה קבל:</b> אין זרם-שער; השליטה היא במטען בפני-השטח דרך שדה — היסוד לכל ה-MOSFET.</li>
          <li><b><Tex>{'\\phi_{MS}'}</Tex> קובע נקודת-מוצא:</b> הוא הכיפוף ה"מובנה"; <Tex>{'V_{FB}'}</Tex> מבטל אותו.</li>
          <li><b>היפוך = ערוץ:</b> שכבת-ההיפוך (נושאי-מיעוט) היא בדיוק התעלה המוליכה של ה-MOSFET.</li>
        </ul>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="compare">קבל-לוחות מול MOS</DeepLink>
          <DeepLink tab="regimes">שלושת המשטרים</DeepLink>
          <DeepLink tab="sandbox">ארגז-החול האינטראקטיבי</DeepLink>
        </div>
      </Panel>

      <Panel title="טעויות נפוצות">
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m) => (
            <li key={m.wrong} className="flex flex-col gap-1">
              <span className="flex items-baseline gap-2 font-medium text-slate-700">
                <span className="text-rose-500" aria-hidden>✗</span>
                <span className="line-through decoration-rose-300"><RichText>{m.wrong}</RichText></span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>✓</span>
                <span><RichText>{m.right}</RichText></span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
