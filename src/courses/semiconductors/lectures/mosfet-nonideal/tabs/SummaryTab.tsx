import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import EnrichmentBadge from '../../../components/EnrichmentBadge'

const EFFECT_ROWS: [string, React.ReactNode, React.ReactNode][] = [
  ['התקצרות תעלה', <Tex>{'I_D=\\tfrac{k}{2}(V_{GS}-V_T)^2(1+\\lambda V_{DS})'}</Tex>, <>שיפוע ברוויה, <Tex>{'r_o\\approx1/\\lambda I_D'}</Tex></>],
  ['אפקט המצע', <Tex>{'V_T=V_{T0}+\\gamma(\\sqrt{2\\phi_F+V_{SB}}-\\sqrt{2\\phi_F})'}</Tex>, <>הסף עולה עם <Tex>{'V_{SB}'}</Tex></>],
  ['תת-סף', <Tex>{'S=2.3\\,mkT/q\\approx m\\cdot60'}</Tex>, <>הולכת דיפוזיה, mV/dec</>],
  ['הדרדרות ניידות', <Tex>{'\\mu_{eff}=\\mu_0/(1+\\theta(V_{GS}-V_T))'}</Tex>, <>פיזור-שטח בתחום הלינארי</>],
  ['רוויית מהירות', <Tex>{'I_{DS,sat}\\propto W C_{ox}(V_{GS}-V_T)v_{sat}'}</Tex>, <>לינארי במקום ריבועי</>],
]

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'ברוויה הזרם קבוע לחלוטין.', right: 'רק אידיאלית — התקצרות-התעלה נותנת שיפוע חיובי קטן, ולכן $r_o$ סופי.' },
  { wrong: 'מתחת ל-$V_T$ אין בכלל זרם.', right: 'יש זרם תת-סף אקספוננציאלי (דיפוזיה). בגבול, $S\\ge60$ mV/dec.' },
  { wrong: 'רוויית-מהירות שומרת על החוק הריבועי.', right: 'לא — הזרם הופך לינארי ב-$(V_{GS}-V_T)$ כי המהירות נחסמת ב-$v_{sat}$.' },
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'mosfet-nonideal', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

/** Lesson 7ב summary — the five non-ideal effects, CMOS, mistakes, and the ballistic-transport note. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="חמשת האפקטים הלא-אידיאליים — במבט אחד">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="px-3 py-2.5 font-semibold">אפקט</th>
                <th className="px-3 py-2.5 font-semibold">נוסחה מרכזית</th>
                <th className="px-3 py-2.5 font-semibold">משמעות</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {EFFECT_ROWS.map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="px-3 py-2.5 font-medium">{r[0]}</td>
                  <td className="px-3 py-2.5"><div className="overflow-x-auto">{r[1]}</div></td>
                  <td className="px-3 py-2.5 text-slate-600">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          ועוד: <b>טכנולוגיית CMOS</b> — NMOS+PMOS משלימים, הספק-סטטי אפסי, יסוד כל האלקטרוניקה הספרתית.
        </p>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="clm">התקצרות תעלה</DeepLink>
          <DeepLink tab="body">אפקט המצע</DeepLink>
          <DeepLink tab="subthreshold">תת-סף</DeepLink>
          <DeepLink tab="mobility">הדרדרות ניידות</DeepLink>
          <DeepLink tab="velocity">רוויית מהירות</DeepLink>
          <DeepLink tab="cmos">CMOS</DeepLink>
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

      <Panel title={<span className="inline-flex items-center gap-2">אפקט חמישי — הובלה בליסטית <EnrichmentBadge /></span>}>
        <p className="leading-relaxed text-slate-700">
          Neamen מונה אפקט נוסף בתעלות תת-מיקרון: כאשר אורך-התעלה קטן מהמרחק-הממוצע בין פיזורים (<Tex>{'L<l'}</Tex>),
          חלק גדול מהנושאים חוצה מהמקור לניקוז <b>ללא אף פיזור</b> — <b>הובלה בליסטית</b>. הם נעים מהר יותר ממהירות-הרוויה,
          מה שמוביל להתקנים <b>מהירים מאוד</b>. אפקט זה קריטי ככל שהטכנולוגיה מתקרבת ל-<Tex>{'0.1\\,\\mu m'}</Tex> ומטה.
        </p>
      </Panel>
    </div>
  )
}
