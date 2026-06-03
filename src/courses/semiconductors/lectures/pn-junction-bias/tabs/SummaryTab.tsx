import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const FORMULAS: { he: string; tex: string }[] = [
  { he: 'מחסום תחת ממתח', tex: 'q(V_{bi}-V_A)' },
  { he: 'רוחב המחסור', tex: 'd(V_A)=\\sqrt{\\tfrac{2\\varepsilon_s}{q}(V_{bi}-V_A)\\tfrac{N_A+N_D}{N_A N_D}}' },
  { he: 'שדה מרבי', tex: 'E_{max}=\\tfrac{2(V_{bi}-V_A)}{d}' },
  { he: 'קיבול הצומת', tex: 'C_j/A=\\varepsilon_s/d' },
  { he: 'חילוץ מקיבול', tex: '1/C_j^2 \\propto (V_{bi}-V_A)' },
  { he: 'חוק הצומת', tex: 'n_p(0)=n_{p0}\\,e^{V_A/V_T}' },
]

// forward vs equilibrium vs reverse — the comparison at a glance
const ROWS: { label: string; fwd: string; eq: string; rev: string }[] = [
  { label: 'מחסום הפוטנציאל', fwd: 'יורד ↓', eq: '$qV_{bi}$', rev: 'עולה ↑' },
  { label: 'רוחב המחסור $d$', fwd: 'צר ↓', eq: 'בינוני', rev: 'רחב ↑' },
  { label: 'שדה מרבי $E_{max}$', fwd: 'נחלש ↓', eq: 'בינוני', rev: 'מתחזק ↑' },
  { label: 'קיבול הצומת $C_j$', fwd: 'גדל ↑', eq: 'בינוני', rev: 'קטֵן ↓' },
  { label: 'הזרקת מיעוט', fwd: 'מעריכית ↑', eq: 'אין עודף', rev: 'שאיבה ↓' },
  { label: 'זרם', fwd: 'גדל מעריכית', eq: 'אפס נטו', rev: 'דליפה זעיר (רווי)' },
]

const MISTAKES: { wrong: ReactNode; right: ReactNode }[] = [
  {
    wrong: <>המתח החיצוני מתחלק שווה על כל ההתקן.</>,
    right: <>כמעט כולו נופל על אזור המחסור (התנגדות גבוהה); הבולק הניטרלי כמעט-מוליך.</>,
  },
  {
    wrong: <>בממתח קדמי אזור המחסור מתרחב.</>,
    right: <>להפך: ממתח קדמי <b>מצמצם</b> את אזור המחסור (המחסום יורד); ממתח אחורי מרחיב אותו.</>,
  },
  {
    wrong: <>בממתח אחורי לא זורם שום זרם.</>,
    right: <>זורם זרם <b>מיעוט</b> זעיר ורווי; הוא קטן אך לא אפס (ובמתח גבוה מאוד — פריצה).</>,
  },
  {
    wrong: <>קיבול הצומת קבוע.</>,
    right: (
      <>
        הוא תלוי-מתח: <Tex>{'C_j/A=\\varepsilon_s/d'}</Tex> גדל בממתח קדמי וקטֵן בממתח אחורי, ו-<Tex>{'1/C_j^2'}</Tex> ליניארי ב-<Tex>{'V_A'}</Tex>.
      </>
    ),
  },
  {
    wrong: (
      <>
        תחת ממתח רמת פרמי <Tex>{'E_F'}</Tex> נשארת אחת ואחידה.
      </>
    ),
    right: (
      <>
        מחוץ לשיווי משקל היא מתפצלת ל-<Tex>{'E_{Fn}'}</Tex> ו-<Tex>{'E_{Fp}'}</Tex>, מופרדות ב-<Tex>{'qV_A'}</Tex>.
      </>
    ),
  },
]

export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון בקצרה">
        <p className="leading-relaxed text-slate-600">
          מתח חיצוני <Tex>{'V_A'}</Tex> מחליף את מפל הפוטנציאל על הצומת מ-<Tex>{'V_{bi}'}</Tex> ל-
          <Tex>{'(V_{bi}-V_A)'}</Tex>, וכל שאר הגדלים נגררים אחריו. <b>ממתח קדמי</b>: מחסום יורד, מחסור
          מצטמצם, השדה נחלש, ונושאי מיעוט מוזרקים. <b>ממתח אחורי</b>: מחסום עולה, מחסור מתרחב, וזורם רק זרם
          דליפה זעיר.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          ריכוז המיעוט בקצה אזור המחסור עולה מעריכית לפי <b>חוק הצומת</b> <Tex>{'n_p(0)=n_{p0}e^{V_A/V_T}'}</Tex> —
          וזה הגשר אל זרם הדיודה.
        </p>
      </Panel>

      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-l from-emerald-50 to-white p-4 shadow-card">
        <p className="flex items-center gap-2 text-base font-bold text-emerald-800">
          <span aria-hidden>🔌</span> השורה התחתונה — מיישר (Rectifier)
        </p>
        <p className="mt-1.5 leading-relaxed text-slate-700">
          מכיוון שהצומת <b>מוליך היטב</b> בממתח קדמי ו<b>כמעט חוסם</b> בממתח אחורי, הוא מתנהג כ<b>שסתום
          חד-כיווני</b> לזרם — וזו בדיוק ה<b>דיודה</b>. כל ההתנהגות נובעת ממחסום אחד, <Tex>{'q(V_{bi}-V_A)'}</Tex>,
          שיורד בקדמי (פותח) ועולה באחורי (חוסם).
        </p>
      </div>

      <Panel title="ממתח קדמי מול אחורי — מבט-על">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-center text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-start font-semibold text-slate-400">גודל</th>
                <th className="border-b-2 border-amber-200 bg-amber-50/60 px-3 py-2 font-bold text-amber-700">ממתח קדמי · <Tex>{'V_A>0'}</Tex></th>
                <th className="border-b-2 border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-600">שיווי משקל</th>
                <th className="border-b-2 border-sky-200 bg-sky-50/60 px-3 py-2 font-bold text-sky-700">ממתח אחורי · <Tex>{'V_A<0'}</Tex></th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50/40' : ''}>
                  <td className="border-b border-slate-100 px-3 py-2 text-start font-semibold text-slate-700">
                    <RichText>{r.label}</RichText>
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 text-amber-700"><RichText>{r.fwd}</RichText></td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-500"><RichText>{r.eq}</RichText></td>
                  <td className="border-b border-slate-100 px-3 py-2 text-sky-700"><RichText>{r.rev}</RichText></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          הכול נובע מסימן אחד: המפל הפעיל <Tex>{'(V_{bi}-V_A)'}</Tex>. ממתח קדמי מקטין אותו (וכל הגדלים
          "נרגעים"); ממתח אחורי מגדיל אותו (וכל הגדלים מתחזקים) — חוץ מהקיבול, שמתנהג <b>הפוך</b> לרוחב.
        </p>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2">
          {FORMULAS.map((f) => (
            <div key={f.he} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-xs font-medium text-slate-400">{f.he}</span>
              <Tex block>{f.tex}</Tex>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="טעויות נפוצות">
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m, i) => (
            <li key={i} className="flex flex-col gap-1">
              <span className="flex items-baseline gap-2 font-medium text-slate-700">
                <span className="text-rose-500" aria-hidden>✗</span>
                <span className="line-through decoration-rose-300">{m.wrong}</span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>✓</span>
                <span>{m.right}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="מה הלאה?">
        <p className="leading-relaxed text-slate-600">
          בכך השלמנו את <b>שיעור 1 — צומת PN</b>. ב<b>שיעור 2 — דיודת PN</b> (החל מהדיודה האידיאלית) נהפוך את
          סיפור ההזרקה ל<b>זרם</b>: נגזור את זרם הרוויה <Tex>{'I_S'}</Tex> ואת האופיין המעריכי המלא{' '}
          <Tex>{'I=I_S\\left(e^{V_A/V_T}-1\\right)'}</Tex>.
          <span className="text-slate-400"> (בקרוב)</span>
        </p>
      </Panel>
    </div>
  )
}
