import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import OhmicVsRectifyingIV from '../components/OhmicVsRectifyingIV'
import OhmicBandDiagram from '../components/OhmicBandDiagram'
import MetalSemiconductorBandDiagram from '../../schottky-diode/components/MetalSemiconductorBandDiagram'
import { MATERIALS, METALS } from '../../../lib/junction'

const Si = MATERIALS.Si
const Au = METALS.Au // rectifying on lightly-doped Si
const W = METALS.W

const ROWS: { k: string; ohmic: React.ReactNode; rect: React.ReactNode }[] = [
  { k: 'אופיין', ohmic: <>ליניארי דרך הראשית (<Tex>{'V=I\\rho_c'}</Tex>)</>, rect: <>מעריכי, חד-כיווני (שוטקי)</> },
  { k: 'מחסום', ohmic: <>אין / דק מספיק למנהור</>, rect: <>מחסום שוטקי <Tex>{'\\varphi_B'}</Tex> ניכר</> },
  { k: 'סימום', ohmic: <><b>כבד</b> (n⁺) — מחסום דק</>, rect: <>קל-בינוני — מחסום רחב</> },
  { k: 'התנגדות', ohmic: <><Tex>{'\\rho_c'}</Tex> <b>נמוכה</b> (~$10^{-6}$ Ω·cm²)</>, rect: <>תלוית-כיוון (מיישרת)</> },
  { k: 'שימוש', ohmic: <>חיבור הדקי ההתקן למעגל</>, rect: <>דיודה מהירה / מיישר</> },
]

/**
 * Lecture 2ד — ohmic vs rectifying. The linear-vs-exponential I–V, a side-by-side
 * band-diagram contrast (reusing the Schottky component), a comparison table, and
 * the payoff: every device terminal carries an n⁺ ohmic contact under the metal.
 */
export default function VsRectifyingTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אותו צומת — שתי התנהגויות">
        <p className="leading-relaxed text-slate-600">
          אותו מגע מתכת–מל"מ יכול להיות <b>מיישר</b> או <b>אוהמי</b> — תלוי במחסום ובסימום. ההבדל החד ביותר הוא
          באופיין: ליניארי-סימטרי מול מעריכי-חד-כיווני.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">אופיין I–V · זרם–מתח</span> — אוהמי (ירוק) מול מיישר (סגול)
          </p>
          <OhmicVsRectifyingIV />
        </div>
      </Panel>

      <Panel title="השוואת דיאגרמות פסים">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">מיישר — מחסום רחב (סימום קל)</p>
            <MetalSemiconductorBandDiagram metal={Au} mat={Si} Nd={1e17} Va={0} phase="joined" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">אוהמי — מחסום דק (n⁺, מנהור)</p>
            <OhmicBandDiagram metal={W} mat={Si} Nd={1e20} mode="tunneling" />
          </div>
        </div>
      </Panel>

      <Panel title="טבלת השוואה">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-center text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-start font-semibold text-slate-400">מאפיין</th>
                <th className="border-b-2 border-emerald-200 bg-emerald-50/60 px-3 py-2 font-bold text-emerald-700">מגע אוהמי</th>
                <th className="border-b-2 border-violet-200 bg-violet-50/60 px-3 py-2 font-bold text-violet-700">מגע מיישר (שוטקי)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50/40' : ''}>
                  <td className="border-b border-slate-100 px-3 py-2 text-start font-semibold text-slate-700">{r.k}</td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{r.ohmic}</td>
                  <td className="border-b border-slate-100 px-3 py-2 text-slate-600">{r.rect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="למה זה חשוב — n⁺ מתחת לכל מגע">
        <p className="leading-relaxed text-slate-600">
          בכל התקן ממשי (דיודה, טרנזיסטור) יש מגעי מתכת בהדקים. כדי שהם <b>לא</b> יוסיפו דיודת-שוטקי טפילית, מגדלים
          תחת המתכת <b>שכבת n⁺</b> דקה — שמדקה את המחסום ומאפשרת מנהור → מגע אוהמי בעל התנגדות נמוכה. כך הזרם נכנס
          ויוצא <b>חופשי</b>, וכל "עבודת הדיודה" קורית בצומת ה-pn הפנימי בלבד.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          זה גם סוגר מעגל עם <b>2א</b>: המגע האוהמי הוא תנאי-השפה <Tex>{'\\Delta p=0'}</Tex> בקצה האזור הניטרלי
          (שם הגדרנו את הדיודה הקצרה) — המגע "בולע" את עודף הנושאים מיד.
        </p>
      </Panel>
    </div>
  )
}
