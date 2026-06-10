import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const FORMULAS: { name: string; tex: string }[] = [
  { name: 'מתח-צביטה', tex: '|V_P|=\\dfrac{q\\,N_D\\,a^2}{2\\varepsilon_s}' },
  { name: 'מתח רוויה', tex: 'V_{Dsat}=|V_P|-|V_{GS}|' },
  { name: 'אופיין-העברה (חוק ריבועי)', tex: 'I_D=I_{DSS}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)^2' },
  { name: 'מוליכות-מעבר', tex: 'g_m=\\dfrac{2I_{DSS}}{|V_P|}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)' },
  { name: 'הגבר מקור-משותף', tex: 'A_v=-g_m(r_o\\parallel R_D)' },
]

const STATES: [string, React.ReactNode, React.ReactNode][] = [
  ['קטעון', <><Tex>{'|V_{GS}|\\ge|V_P|'}</Tex></>, <>התעלה סגורה — <Tex>{'I_D=0'}</Tex></>],
  ['אוהמי (VCR)', <><Tex>{'V_{DS}<V_{Dsat}'}</Tex></>, <>נגד נשלט-מתח, <Tex>{'I_D\\propto V_{DS}'}</Tex></>],
  ['רוויה', <><Tex>{'V_{DS}\\ge V_{Dsat}'}</Tex></>, <>מקור-זרם, <Tex>{'I_D=I_{DSS}(1-V_{GS}/V_P)^2'}</Tex></>],
]

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'השער מושך זרם כדי לשלוט בתעלה (כמו בסיס ב-BJT).', right: 'לא — צומת השער מוטה אחורה, ולכן הכניסה כמעט ללא זרם (התנגדות-כניסה עצומה). השליטה היא ב$מתח$.' },
  { wrong: 'אופיין-ההעברה לינארי.', right: 'הוא $ריבועי$: $I_D=I_{DSS}(1-V_{GS}/V_P)^2$. רק $g_m$ (השיפוע) משתנה לינארית עם $V_{GS}$.' },
  { wrong: 'ברוויה התעלה נסגרת לגמרי והזרם מתאפס.', right: 'התעלה נצבטת רק בקצה הניקוז; הזרם ממשיך לזרום ומגיע לערך כמעט קבוע — לא אפס.' },
  { wrong: '$I_{DSS}$ הוא זרם בקטעון.', right: '$I_{DSS}$ הוא הזרם ה$מרבי$, ברוויה ב-$V_{GS}=0$.' },
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'jfet', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תקציר">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li><b>מבנה:</b> תעלת <Tex>{'n'}</Tex> בין מקור לניקוז, שני שערי <Tex>{'p^+'}</Tex>. שליטת-<b>מתח</b>, כניסה כמעט ללא זרם.</li>
          <li><b>שליטת השער:</b> <Tex>{'V_{GS}<0'}</Tex> מרחיב את אזור-המחסור ומצר את התעלה; ב-<Tex>{'|V_P|'}</Tex> נסגרת (קטעון).</li>
          <li><b>צביטה ע״י <Tex>{'V_{DS}'}</Tex>:</b> התעלה מתחדדת לכיוון הניקוז ונצבטת שם ב-<Tex>{'V_{Dsat}'}</Tex> — מעבר מאוהמי לרוויה.</li>
          <li><b>אופיינים:</b> מוצא <Tex>{'I_D(V_{DS})'}</Tex> (אוהמי→רוויה); העברה <Tex>{'I_D=I_{DSS}(1-V_{GS}/V_P)^2'}</Tex>.</li>
          <li><b>אות-קטן:</b> <Tex>{'g_m'}</Tex> = שיפוע אופיין-ההעברה; הגבר מקור-משותף <Tex>{'A_v=-g_m(r_o\\parallel R_D)'}</Tex>.</li>
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
      </Panel>

      <Panel title="שלושת מצבי-הפעולה">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">מצב</th>
                <th className="py-2.5 px-3 font-semibold">תנאי</th>
                <th className="py-2.5 px-3 font-semibold">התנהגות</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {STATES.map((row) => (
                <tr key={row[0]} className="border-t border-slate-100">
                  <td className="py-2.5 px-3 font-medium text-slate-700">{row[0]}</td>
                  <td className="py-2.5 px-3">{row[1]}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="operation">שליטת השער וצביטה (אינטראקטיב)</DeepLink>
          <DeepLink tab="output">אופייני-מוצא</DeepLink>
          <DeepLink tab="transfer">אופיין-העברה ואות-קטן</DeepLink>
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
