import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import SchottkyIVCurve from '../components/SchottkyIVCurve'
import { MATERIALS, METALS } from '../../../lib/junction'

const Si = MATERIALS.Si
const W = METALS.W

const ROWS: { k: string; sch: React.ReactNode; pn: React.ReactNode }[] = [
  { k: 'נושאי הזרם', sch: <>נושאי <b>רוב</b> (תרמיוני)</>, pn: <>נושאי <b>מיעוט</b> (דיפוזיה)</> },
  { k: 'זרם רוויה', sch: <><Tex>{'J_{ST}=A^{*}T^2e^{-\\varphi_B/V_T}'}</Tex> — גדול</>, pn: <><Tex>{'J_S\\propto n_i^2'}</Tex> — זעיר</> },
  { k: 'מתח הצתה', sch: <><b>נמוך</b> (~0.2–0.3V)</>, pn: <>גבוה (~0.6–0.7V)</> },
  { k: 'דליפה אחורית', sch: <><b>גבוהה</b> יחסית</>, pn: <>זעירה</> },
  { k: 'מהירות מיתוג', sch: <><b>מהירה מאוד</b> (אין אגירת מיעוט)</>, pn: <>אטית (reverse-recovery)</> },
]

/**
 * Lecture 2ג — Schottky vs PN. One semilog plot overlays both characteristics
 * (the ~10⁶ J_ST/J_S gap → turn-on shift), a side-by-side table contrasts the
 * devices, and a StepFlow explains the fast-switching advantage.
 */
export default function VsPnTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אותה צורה — מחסום אחר">
        <p className="leading-relaxed text-slate-600">
          לשתי הדיודות אותו אופיין שוקלי <Tex>{'J=J_0(e^{V_A/V_T}-1)'}</Tex>, אבל הקדם שונה בסדרי-גודל:{' '}
          <Tex>{'J_{ST}\\gg J_S'}</Tex>. על ציר חצי-לוגריתמי זה נראה כ<b>הסטה שמאלה</b> של עקומת השוטקי — אותה
          מדרגה, אבל מתחילה במתח נמוך יותר.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">אופיין I–V · זרם–מתח</span> — שוטקי (W/Si, סגול) מול PN (אפור), היסט ההצתה
          </p>
          <SchottkyIVCurve metal={W} mat={Si} Va={0.25} mode="log" comparePN={{ Na: 1e16, Nd: 1e17 }} showTurnOn />
        </div>
      </Panel>

      <Panel title="טבלת השוואה">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-center text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-start font-semibold text-slate-400">מאפיין</th>
                <th className="border-b-2 border-violet-200 bg-violet-50/60 px-3 py-2 font-bold text-violet-700">דיודת שוטקי</th>
                <th className="border-b-2 border-sky-200 bg-sky-50/60 px-3 py-2 font-bold text-sky-700">דיודת PN</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50/40' : ''}>
                  <td className="border-b border-slate-100 px-3 py-2 text-start font-semibold text-slate-700">{r.k}</td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{r.sch}</td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{r.pn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="למה שוטקי מהירה כל-כך?">
        <p className="leading-relaxed text-slate-600">
          בדיודת PN, מתח קדמי <b>מזריק ואוגר</b> נושאי מיעוט באזורים הניטרליים. כשמכבים, צריך קודם <b>לפנות</b> את
          המטען האגור — וזהו ה-reverse-recovery האטי. בשוטקי הזרם הוא נושאי-רוב ו<b>אין מטען מיעוט אגור</b>:
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>זרם נושאי-<b>רוב</b></>, body: <>אין הזרקת מיעוט אל הבולק.</> },
            { title: <><b>אין מטען אגור</b></>, body: <>אין נושאי מיעוט שצריך לפנות.</> },
            { title: <>כיבוי <b>כמעט מיידי</b></>, body: <>אין השהיית reverse-recovery.</> },
          ]}
          outcome={{ label: 'מיתוג מהיר — לתדרים גבוהים והספק', sub: <>יתרון הליבה של דיודת שוטקי</> }}
        />
      </Panel>
    </div>
  )
}
