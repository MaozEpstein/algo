import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const FORMULAS: { name: string; tex: string }[] = [
  { name: 'מטען הערוץ', tex: 'Q_n(y)=-C_{ox}(V_{GS}-V_T-V(y))' },
  { name: 'מקדם ההולכה', tex: 'k=\\dfrac{W}{L}\\mu^*C_{ox}' },
  { name: 'טריודה', tex: 'I_{DS}=k\\left[(V_{GS}-V_T)V_{DS}-\\tfrac{V_{DS}^2}{2}\\right]' },
  { name: 'רוויה', tex: 'I_{DS}=\\tfrac{k}{2}(V_{GS}-V_T)^2' },
  { name: 'מתח-רוויה', tex: 'V_{DS,sat}=V_{GS}-V_T' },
  { name: 'מוליכות-מעבר', tex: 'g_m=k(V_{GS}-V_T)=\\sqrt{2kI_{DS}}' },
]

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'ברוויה הזרם ממשיך לגדול עם $V_{DS}$.', right: 'בהתקן האידיאלי הוא כמעט קבוע — הערוץ נצבט וה-$V$ הנוסף נופל על אזור-מחסור קצר. (הזרם עולה מעט רק בגלל התקצרות-תעלה — חלק ב׳.)' },
  { wrong: 'זרם זורם דרך השער.', right: 'לא — השער מבודד ע״י האוקסיד; הוא שולט קיבולית בלבד. אין זרם-שער ב-DC.' },
  { wrong: '$V_{DS,sat}$ קבוע.', right: 'הוא $V_{GS}-V_T$ — גדל עם מתח-השער, ולכן הברך זזה ימינה לכל עקומה.' },
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'mosfet', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

/** Lesson 7א summary — key formulas, mistakes, and the bridge to the modern MOSFET (part ב׳). */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תקציר — ה-MOSFET האידיאלי">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li><b>מבנה:</b> שער מבודד מעל ערוץ בין מקור לניקוז; 4 הדקים (S/G/D/B).</li>
          <li><b>הפעלה:</b> <Tex>{'V_{GS}>V_T'}</Tex> יוצר ערוץ; <Tex>{'V_{DS}'}</Tex> מתדקדק אותו עד <b>צביטה</b> ורוויה.</li>
          <li><b>משטרים:</b> טריודה (נגד נשלט-מתח) → רוויה (חוק ריבועי), ברך ב-<Tex>{'V_{DS,sat}=V_{GS}-V_T'}</Tex>.</li>
          <li><b>אותות-קטנים:</b> <Tex>{'g_m=k(V_{GS}-V_T)'}</Tex>, ובהתקן האידיאלי <Tex>{'r_o\\to\\infty'}</Tex>.</li>
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

      <Panel title="מההתקן האידיאלי למודרני — הצעד הבא">
        <div className="rounded-2xl border-s-4 border-indigo-500 bg-indigo-50/60 p-4 leading-relaxed text-slate-700">
          <p>
            כל מה שגזרנו כאן מניח <b>ערוץ ארוך ואידיאלי</b>. בהתקנים אמיתיים (וקטנים) מופיעות סטיות: מישור-הרוויה
            <b> עולה מעט</b> (התקצרות-תעלה), מתח-הסף <b>משתנה עם המצע</b>, יש <b>זרם תת-סף</b>, הניידות <b>יורדת</b>,
            והמהירות <b>נרווית</b>. כל אלה — ועוד טכנולוגיית <b>CMOS</b> — הם נושא <b>חלק ב׳</b>.
          </p>
          <div className="mt-3">
            <Link to={lecturePath('semiconductors', 'mosfet-nonideal')} className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
              המשך לחלק ב׳ — ההתקן המודרני →
            </Link>
          </div>
        </div>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="operation">היווצרות הערוץ וצביטה</DeepLink>
          <DeepLink tab="characteristics">אופייני-מוצא והעברה</DeepLink>
          <DeepLink tab="smallsignal">אותות-קטנים וקו-עומס</DeepLink>
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
