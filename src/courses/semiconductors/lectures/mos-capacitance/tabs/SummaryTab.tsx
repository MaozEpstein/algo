import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import MosfetBridge from '../components/MosfetBridge'

const FORMULAS: { name: string; tex: string }[] = [
  { name: 'הגדרת הקיבול', tex: 'C\\equiv\\dfrac{dQ_G}{dV_G}' },
  { name: 'קיבול-אוקסיד', tex: 'C_{ox}=\\dfrac{\\varepsilon_{ox}\\varepsilon_0}{t_{ox}}' },
  { name: 'קיבול-מחסור', tex: 'C_{dep}=\\dfrac{\\varepsilon_s}{W}' },
  { name: 'צירוף טורי', tex: '\\dfrac{1}{C}=\\dfrac{1}{C_{ox}}+\\dfrac{1}{C_s+C_{ss}}' },
  { name: 'קיבול-מל"מ', tex: 'C_s=-\\dfrac{dQ_s}{d\\psi_s}' },
  { name: 'רצפת היפוך (HF)', tex: 'C_{min}=C_{ox}\\,\\|\\,C_{dep,\\max}' },
]

const ROWS: [string, React.ReactNode, React.ReactNode][] = [
  ['הצטברות', <Tex>{'C\\approx C_{ox}'}</Tex>, <>בכל התדרים</>],
  ['מחסור', <Tex>{'C=C_{ox}\\,\\|\\,C_{dep}'}</Tex>, <>יורד עם <Tex>{'V_G'}</Tex></>],
  ['היפוך · LF', <Tex>{'C\\to C_{ox}'}</Tex>, <>המיעוט מספיק להגיב</>],
  ['היפוך · HF', <Tex>{'C=C_{min}'}</Tex>, <>המיעוט לא מספיק</>],
  ['דלדול-עמוק', <Tex>{'C<C_{min}'}</Tex>, <>סריקה מהירה, <Tex>{'W>W_{max}'}</Tex></>],
]

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'הקיבול בהיפוך תמיד חוזר ל-$C_{ox}$.', right: 'רק בתדר נמוך — בתדר גבוה הוא ננעל על $C_{min}$, כי נושאי-המיעוט איטיים.' },
  { wrong: '$C\\text{-}V$ נמדד ב-DC.', right: 'לא — קיבול הוא תגובת $\\Delta Q$ לאות AC קטן; ב-DC אין זרם דרך האוקסיד.' },
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'mos-capacitance', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

/** Lesson 6ג summary — capacitance / C-V, and a wrap-up of the whole MOS-capacitor lesson. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תקציר — המעבר ל-AC">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li><b>קיבול</b> = תגובת <Tex>{'\\Delta Q_G'}</Tex> לאות-קטן: <Tex>{'C=dQ_G/dV_G'}</Tex>.</li>
          <li><b>מעגל שקול:</b> <Tex>{'C_{ox}'}</Tex> בטור עם <Tex>{'C_s\\|C_{ss}'}</Tex> → <Tex>{'1/C=1/C_{ox}+1/(C_s+C_{ss})'}</Tex>.</li>
          <li><b>תלות-תדר:</b> ההבדל כולו בהיפוך, ותלוי אם נושאי-המיעוט מספיקים להגיב (LF/HF/DD).</li>
          <li><b>Varactor:</b> מתח אחורי <Tex>{'V_R'}</Tex> מזיז את האופיין — קבל מתכוונן.</li>
        </ul>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FORMULAS.map((f) => (
            <div key={f.name} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
              <span className="text-xs font-semibold text-slate-500">{f.name}</span>
              <div className="w-full overflow-x-auto"><Tex block>{f.tex}</Tex></div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={<>אופיין <Tex>{'C\\text{-}V'}</Tex> — סיכום</>}>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="px-3 py-2.5 font-semibold">משטר</th>
                <th className="px-3 py-2.5 font-semibold">קיבול</th>
                <th className="px-3 py-2.5 font-semibold">הערה</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {ROWS.map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-medium">{r[0]}</td>
                  <td className="px-3 py-2.5">{r[1]}</td>
                  <td className="px-3 py-2.5 text-slate-600">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="קבל MOS — מקצה לקצה (כל השיעור)">
        <ol className="list-inside list-decimal space-y-1.5 leading-relaxed text-slate-700">
          <li><b>חלק א׳:</b> מבנה M-O-S, <Tex>{'\\phi_{MS}'}</Tex>, ושלושת המשטרים (הצטברות/מחסור/היפוך).</li>
          <li><b>חלק ב׳:</b> מטען פני-השטח <Tex>{'Q_s(\\psi_s)'}</Tex>, מתח-הסף <Tex>{'V_T'}</Tex>, ומטעני-תחמוצת.</li>
          <li><b>חלק ג׳:</b> הקיבול, המעגל השקול, תגובת-התדר, ו-varactor — תמונת ה-AC.</li>
        </ol>
      </Panel>

      <Panel title="מקבל MOS לטרנזיסטור MOSFET — הצעד הבא">
        <div className="rounded-2xl border-s-4 border-emerald-500 bg-emerald-50/60 p-4 leading-relaxed text-slate-700">
          <p>
            כל מה שלמדנו הוא <b>חצי ההתקן</b>. ברגע ש-<Tex>{'V_G>V_T'}</Tex> נוצרת שכבת-ההיפוך — <b>ערוץ אלקטרונים מוליך</b>
            {' '}בשפת המל"מ. עכשיו מוסיפים שני אזורי <Tex>{'n^+'}</Tex> בקצוות — <b>מקור</b> ו<b>ניקוז</b> — והערוץ
            {' '}<b>מחבר ביניהם</b>:
          </p>
          <div className="my-3">
            <MosfetBridge />
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>השער שולט ב<b>מוליכות הערוץ</b> דרך אותו אפקט-שדה קיבולי שלמדנו — בלי זרם-שער.</li>
            <li>מתח-הסף <Tex>{'V_T'}</Tex> של הקבל הוא <b>מתח-הסף של ה-MOSFET</b>: מתחתיו ההתקן <b>כבוי</b>, מעליו <b>פתוח</b> וזורם זרם מקור↔ניקוז.</li>
            <li>זהו ה-<b>MOSFET</b> — ההתקן המרכזי של האלקטרוניקה הספרתית, ונושא השיעור הבא.</li>
          </ul>
        </div>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="caps">הקיבולים</DeepLink>
          <DeepLink tab="circuit">המעגל השקול</DeepLink>
          <DeepLink tab="frequency">תגובת התדר</DeepLink>
          <DeepLink tab="varactor">Varactor</DeepLink>
          <DeepLink tab="sandbox">ארגז-החול המסכם</DeepLink>
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
