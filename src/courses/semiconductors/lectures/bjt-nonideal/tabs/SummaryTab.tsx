import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import EnrichmentBadge from '../../../components/EnrichmentBadge'

// אידיאלי ↔ אמיתי: כל אפקט, מה שהמודל האידיאלי הניח, מה קורה באמת, ומתי זה חשוב בתכן.
const COMPARE = [
  {
    effect: 'אפקט Early',
    ideal: 'אזור-פעיל שטוח לחלוטין, $r_o=\\infty$',
    real: '$I_C$ עולה עם $V_{CE}$ (אפנון רוחב-הבסיס) → $r_o=V_A/I_C$ סופי',
    when: 'מגברים אנלוגיים — קובע את עכבת-המוצא ואת הגבר-המתח המרבי $\\,-V_A/V_T$',
    cls: 'bg-violet-50/40',
  },
  {
    effect: 'פריצה',
    ideal: 'אין גבול עליון למתח $V_{CE}$',
    real: 'מפולת/punch-through; $BV_{CEO}=BV_{CBO}/\\beta^{1/n}<BV_{CBO}$',
    when: 'תכן הספק ומיתוג מתח-גבוה — קובע את מתח-העבודה המרבי',
    cls: 'bg-rose-50/40',
  },
  {
    effect: '$\\beta$ תלוי-זרם (Gummel)',
    ideal: '$\\beta$ קבוע בכל זרם',
    real: 'נופל בזרם-נמוך (רקומבינציה $n=2$) ובזרם-גבוה (הזרקה-חזקה); מוגבל ע"י צמצום-פער בפולט',
    when: 'בחירת נקודת-עבודה — דיוק ההגבר נשמר רק בטווח-הזרמים האמצעי',
    cls: 'bg-amber-50/40',
  },
  {
    effect: 'תדר וקיבולים',
    ideal: 'הגבר-זרם עד תדר אינסופי',
    real: '$|\\beta(f)|$ נופל מעל $f_\\beta$; $f_T=g_m/2\\pi(C_\\pi+C_\\mu)$',
    when: 'RF ומיתוג מהיר — קובע את רוחב-הסרט וזמן-ההחלפה (מטען-בסיס אגור)',
    cls: 'bg-sky-50/40',
  },
]

const FORMULAS = [
  { tex: 'r_o=\\dfrac{V_A}{I_C}', note: 'Early — התנגדות-מוצא' },
  { tex: 'BV_{CEO}=\\dfrac{BV_{CBO}}{\\beta^{1/n}}', note: 'פריצה (CE < CB)' },
  { tex: 'g_m=\\dfrac{I_C}{V_T},\\,r_\\pi=\\dfrac{\\beta}{g_m}', note: 'hybrid-π' },
  { tex: 'f_T=\\dfrac{g_m}{2\\pi(C_\\pi+C_\\mu)}', note: 'תדר-חיתוך' },
]

const CHAPTER = [
  { n: '3א', t: 'מבנה ופעולה', d: 'npn/pnp, פעיל-קדמי, למה מגביר (איכותי)', cls: 'border-sky-300 bg-sky-50/50 text-sky-700' },
  { n: '3ב', t: 'זרמים והגבר', d: 'γ, b, α=γb, β; אופייני-מוצא; Ebers-Moll', cls: 'border-emerald-300 bg-emerald-50/50 text-emerald-700' },
  { n: '3ג', t: 'אפקטים ומודלים', d: 'Early, פריצה, β/Gummel, hybrid-π, fₜ', cls: 'border-violet-300 bg-violet-50/50 text-violet-700' },
]

/** Lecture 3ג — summary + BJT-chapter capstone + pointer to switching devices. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון המרכזי">
        <p className="leading-relaxed text-slate-700">
          המכשיר האמיתי סוטה מהאידיאל בארבע דרכים: <b>אפקט Early</b> (אזור-פעיל לא שטוח → <Tex>{'r_o'}</Tex> סופי),
          <b> פריצה</b> (<Tex>{'BV_{CEO}<BV_{CBO}'}</Tex>), <b>β תלוי-זרם</b> (Gummel) ומוגבל ע"י צמצום-פער, ול<b>תכן מעגלים</b>
          משתמשים במודל <b>hybrid-π</b> ובתדר-החיתוך <Tex>{'f_T'}</Tex>.
        </p>
      </Panel>

      <Panel title="מהאידיאלי לאמיתי — טבלת השוואה">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500">
                <th className="px-3 py-2 font-bold">אפקט</th>
                <th className="px-3 py-2 font-bold">במודל האידיאלי</th>
                <th className="px-3 py-2 font-bold">במכשיר האמיתי</th>
                <th className="px-3 py-2 font-bold">מתי האפקט חשוב</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((r, i) => (
                <tr key={i} className={`border-b border-slate-100 ${r.cls}`}>
                  <td className="px-3 py-2.5 font-bold text-slate-800"><RichText>{r.effect}</RichText></td>
                  <td className="px-3 py-2.5 leading-relaxed text-slate-500"><RichText>{r.ideal}</RichText></td>
                  <td className="px-3 py-2.5 leading-relaxed text-slate-700"><RichText>{r.real}</RichText></td>
                  <td className="px-3 py-2.5 leading-relaxed text-slate-700"><RichText>{r.when}</RichText></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="דף-עזר — אפקטים ומודלים">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FORMULAS.map((f, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="text-base" dir="ltr"><Tex>{f.tex}</Tex></p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{f.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="סוף פרק ה-BJT — התמונה המלאה">
        <div className="grid gap-3 sm:grid-cols-3">
          {CHAPTER.map((c, i) => (
            <div key={i} className={`rounded-xl border-s-4 p-3 text-sm leading-relaxed ${c.cls}`}>
              <p className="font-bold">{c.n} · {c.t}</p>
              <p className="mt-1 text-slate-700">{c.d}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="מעבר לסילבוס — התקני-מיתוג">
        <EnrichmentBadge />
        <p className="mt-2 leading-relaxed text-slate-600">
          אותם רעיונות (צמתי-PN מצומדים, הגבר, פריצה) מובילים ל<b>התקני-הספק ומיתוג</b>: ה<b>תיריסטור (SCR)</b> — מבנה
          ארבע-שכבתי <span dir="ltr">pnpn</span> שמתנהג כשני טרנזיסטורים מצומדים ו"ננעל" במצב-הולכה (<Tex>{'V_{BF}'}</Tex>);
          ודיודות בעלות <b>התנגדות-שלילית</b> (NDR) — דיודת <b>Gunn</b> ודיודת-מנהור. (מעבר לליבת-הקורס.)
        </p>
      </Panel>
    </div>
  )
}
