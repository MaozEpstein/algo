import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'השער יכול גם לכבות את ה-SCR.', right: 'לא ב-SCR קלאסי — השער רק מצית. כיבוי דורש הורדת זרם-האנודה מתחת לזרם-ההחזקה $I_H$.' },
  { wrong: 'ה-SCR מתנהג כמו מגבר עם אזור-עבודה לינארי.', right: 'לא — המשוב החיובי וה-NDR הופכים אותו למתג דו-מצבי (חסום/נעול), בלי נקודת-עבודה יציבה באמצע.' },
  { wrong: 'מתח-הפריצה $V_{BF}$ קבוע.', right: 'הוא יורד עם זרם-השער: יותר $I_G$ → הצתה במתח נמוך יותר, עד שה-NDR נעלם וההתקן נדלק כמו דיודה.' },
  { wrong: 'התנאי לנעילה הוא מכפלת ה-$\\alpha$-ים.', right: 'התנאי הוא הסכום $\\alpha_1+\\alpha_2\\ge1$ (לא מכפלה) — שקול ל-$\\beta_1\\beta_2\\ge1$.' },
]

const FORMULAS: { name: string; tex: string; note?: string }[] = [
  { name: 'זרם-האנודה (רגנרטיבי)', tex: 'I_A=\\dfrac{\\alpha_2 I_G+I_{leak}}{1-(\\alpha_1+\\alpha_2)}', note: 'מתפרץ כש-$\\alpha_1+\\alpha_2\\to1$' },
  { name: 'תנאי הנעילה (latch)', tex: '\\alpha_1+\\alpha_2\\ge1\\;\\Leftrightarrow\\;\\beta_1\\beta_2\\ge1' },
  { name: 'מתח-פריצה מול זרם-שער', tex: 'V_{BF}(I_G)\\;\\downarrow\\;\\text{as}\\;I_G\\uparrow' },
  { name: 'דליפת CE מול CB', tex: 'I_{CEO}=(\\beta+1)\\,I_{CBO}' },
]

const STATES: [string, React.ReactNode, React.ReactNode][] = [
  ['חסימה קדמית (OFF)', <><Tex>{'V_{AK}>0'}</Tex>, ללא הצתה</>, <><Tex>{'\\alpha_1+\\alpha_2<1'}</Tex>; <Tex>{'J_2'}</Tex> חוסם, זרם-דליפה</>],
  ['הולכה (ON)', <>הוצת (שער / <Tex>{'V_{BF}'}</Tex>)</>, <><Tex>{'\\alpha_1+\\alpha_2\\ge1'}</Tex>; נעול, מתח נמוך, זרם גדול</>],
  ['חסימה הפוכה', <><Tex>{'V_{AK}<0'}</Tex></>, <><Tex>{'J_1,J_3'}</Tex> הפוכים — חוסם כמו דיודה</>],
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'scr', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תקציר">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li><b>מבנה:</b> ארבע שכבות <Tex>{'P_2N_2P_1N_1'}</Tex>, שלושה צמתים <Tex>{'J_1,J_2,J_3'}</Tex>, מסופים A/G/K. <Tex>{'J_2'}</Tex> חוסם במצב כבוי.</li>
          <li><b>מודל:</b> שני BJT מצומדים (PNP+NPN) במשוב חיובי — קולט כל אחד מזין את בסיס השני.</li>
          <li><b>נעילה:</b> <Tex>{'\\alpha_1+\\alpha_2\\ge1\\;\\Leftrightarrow\\;\\beta_1\\beta_2\\ge1'}</Tex>, כי <Tex>{'I_A=\\dfrac{\\alpha_2 I_G+I_{leak}}{1-(\\alpha_1+\\alpha_2)}'}</Tex> מתפרץ.</li>
          <li><b>אופיין:</b> חסימה קדמית → <Tex>{'V_{BF}'}</Tex> → NDR → הולכה; כיבוי מתחת ל-<Tex>{'I_H'}</Tex>; חסימה הפוכה.</li>
          <li><b>שליטה:</b> זרם-שער מקטין את <Tex>{'V_{BF}'}</Tex>; יישום מרכזי — מיישר מבוקר ובקרת הספק.</li>
        </ul>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2">
          {FORMULAS.map((f) => (
            <div key={f.name} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
              <span className="text-xs font-semibold text-slate-500">{f.name}</span>
              <Tex block>{f.tex}</Tex>
              {f.note && <span className="text-xs text-slate-400"><RichText>{f.note}</RichText></span>}
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
                <th className="py-2.5 px-3 font-semibold">מה קורה</th>
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

      <Panel title="הדלקה וכיבוי">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">פעולה</th>
                <th className="py-2.5 px-3 font-semibold">מנגנון</th>
                <th className="py-2.5 px-3 font-semibold">הערה</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {([
                [<span className="font-semibold text-emerald-700">הדלקה · שער</span>, <>פולס <Tex>{'I_G'}</Tex> לבסיס ה-NPN</>, <>הדרך הנשלטת והמקובלת</>],
                [<span className="font-semibold text-emerald-700">הדלקה · פריצה</span>, <><Tex>{'V_{AK}>V_{BF}'}</Tex></>, <>מפולת ב-<Tex>{'J_2'}</Tex> — לרוב לא רצוי</>],
                [<span className="font-semibold text-emerald-700">הדלקה · dV/dt</span>, <><Tex>{'dV/dt'}</Tex> גבוה</>, <>זרם קיבולי טפילי דרך <Tex>{'J_2'}</Tex></>],
                [<span className="font-semibold text-rose-700">כיבוי</span>, <><Tex>{'I_A<I_H'}</Tex></>, <>ניתוק / היפוך פולריות — השער חסר-אונים</>],
              ] as [React.ReactNode, React.ReactNode, React.ReactNode][]).map((row, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="py-2.5 px-3">{row[0]}</td>
                  <td className="py-2.5 px-3">{row[1]}</td>
                  <td className="py-2.5 px-3 text-slate-600">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          המשותף לכל דרכי ההדלקה: הן מעלות את <Tex>{'\\alpha_1+\\alpha_2'}</Tex> אל 1. הכיבוי היחיד הוא שבירת המשוב — הורדת הזרם מתחת ל-<Tex>{'I_H'}</Tex>.
        </p>
      </Panel>

      <Panel title="תובנות מפתח">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-600">
          <li><b>מתג, לא מגבר:</b> המשוב החיובי וה-NDR מבטלים נקודת-עבודה לינארית — ההתקן קופץ בין שני מצבים.</li>
          <li><b>נעילה = אובדן שליטת השער:</b> ברגע ש-<Tex>{'\\alpha_1+\\alpha_2\\ge1'}</Tex> המשוב מקיים את עצמו, והשער כבר לא נחוץ ולא יכול לכבות.</li>
          <li><b>למה <Tex>{'\\alpha'}</Tex> עולה עם הזרם:</b> בזרמים נמוכים מאוד הרקומבינציה שולטת ו-<Tex>{'\\alpha'}</Tex> קטן; ככל שהזרם גדל היעילות עולה — ולכן ההצתה היא תופעת-סף.</li>
          <li><b>חד-כיווני ומיישר:</b> חוסם בהפוך, ולכן מתאים לבקרת הספק AC ע״י בחירת זווית-ההצתה בכל חצי-מחזור.</li>
        </ul>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="structure">מבנה וסימול</DeepLink>
          <DeepLink tab="twotransistor">מודל שני הטרנזיסטורים</DeepLink>
          <DeepLink tab="latch">תנאי ההצתה (אינטראקטיב)</DeepLink>
          <DeepLink tab="characteristic">אופיין I-V</DeepLink>
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
