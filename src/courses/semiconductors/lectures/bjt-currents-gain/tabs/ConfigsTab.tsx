import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import ConfigSchematic from '../components/ConfigSchematic'
import ConfigEbersMoll from '../components/ConfigEbersMoll'

/** Lecture 3ב — the two amplifier configurations: Common-Base (CB) and Common-Emitter (CE). */
export default function ConfigsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון: מהי תצורה (configuration)?">
        <p className="leading-relaxed text-slate-700">
          לטרנזיסטור שלושה מסופים, אך למגבר יש <b>כניסה</b> ו<b>מוצא</b> — כלומר ארבע נקודות-חיבור. לכן מסוף אחד
          חייב להיות <b>משותף</b> ללולאת-הכניסה וללולאת-המוצא. המסוף המשותף נותן את שם התצורה:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>בסיס משותף (CB):</b> כניסה = פולט <Tex>E</Tex>, משותף = בסיס <Tex>B</Tex>, מוצא = קולט <Tex>C</Tex>.</li>
          <li><b>פולט משותף (CE):</b> כניסה = בסיס <Tex>B</Tex>, משותף = פולט <Tex>E</Tex>, מוצא = קולט <Tex>C</Tex>.</li>
        </ul>
        <p className="mt-2 leading-relaxed text-slate-600">
          לכל תצורה מציגים שני שרטוטים: <b>מעגל המגבר</b> (איזה מסוף לאן) וה<b>מעגל השקול</b> (Ebers-Moll —
          דיודת-כניסה + מקור-זרם תלוי במוצא). אותו התקן — שתי "זוויות הסתכלות".
        </p>
      </Panel>

      <Panel title="בסיס משותף — Common-Base (CB)">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-500">① מעגל המגבר</p>
            <ConfigSchematic config="CB" />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-500">② מעגל שקול (Ebers-Moll)</p>
            <ConfigEbersMoll config="CB" />
          </div>
        </div>
        <div className="mt-3 rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
          הכניסה (פולט) מזריקה זרם גדול <Tex>{'I_E'}</Tex>; הקולט אוסף <Tex>{'I_C=\\alpha I_E'}</Tex> עם{' '}
          <Tex>{'\\alpha\\approx1'}</Tex> — כלומר <b>הגבר-זרם ≈ 1</b> (אין הגבר זרם), אך <b>הגבר-מתח גבוה</b> ו<b>ללא היפוך</b>.
          התנגדות הכניסה <b>נמוכה</b> (<Tex>{'r_e=1/g_m'}</Tex>) והמוצא <b>גבוהה</b>. שימוש: תדרים גבוהים, מתאם-עכבות.
        </div>
      </Panel>

      <Panel title="פולט משותף — Common-Emitter (CE)">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-500">① מעגל המגבר</p>
            <ConfigSchematic config="CE" />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-500">② מעגל שקול (Ebers-Moll)</p>
            <ConfigEbersMoll config="CE" />
          </div>
        </div>
        <div className="mt-3 rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700">
          זרם-בסיס זעיר <Tex>{'I_B'}</Tex> שולט בזרם-קולט גדול <Tex>{'I_C=\\beta I_B'}</Tex> עם <Tex>{'\\beta\\gg1'}</Tex> —
          <b> הגבר-זרם וגם הגבר-מתח גבוהים</b>, אך <b>עם היפוך פאזה</b> (<Tex>{'A_v<0'}</Tex>). זו התצורה ה"סוס-עבודה"
          של מגברים. התנגדות כניסה בינונית (<Tex>{'r_\\pi'}</Tex>).
        </div>
      </Panel>

      <Panel title="השוואה: CB מול CE">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">תכונה</th>
                <th className="py-2.5 px-3 font-semibold text-sky-700">בסיס משותף (CB)</th>
                <th className="py-2.5 px-3 font-semibold text-rose-700">פולט משותף (CE)</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {([
                ['כניסה / משותף / מוצא', <span dir="ltr">E / B / C</span>, <span dir="ltr">B / E / C</span>],
                ['הגבר זרם', <Tex>{'\\alpha\\approx1\\;(<1)'}</Tex>, <Tex>{'\\beta\\gg1'}</Tex>],
                ['הגבר מתח', <>גבוה</>, <>גבוה</>],
                ['היפוך פאזה', <>לא (חיובי)</>, <>כן (שלילי)</>],
                ['התנגדות כניסה', <>נמוכה <Tex>{'(r_e=1/g_m)'}</Tex></>, <>בינונית <Tex>{'(r_\\pi)'}</Tex></>],
                ['התנגדות מוצא', <>גבוהה</>, <>גבוהה <Tex>{'(r_o)'}</Tex></>],
                ['שימוש אופייני', <>תדר גבוה, מתאם-עכבות</>, <>מגבר כללי</>],
              ] as [string, React.ReactNode, React.ReactNode][]).map((row) => (
                <tr key={row[0]} className="border-t border-slate-100">
                  <td className="py-2.5 px-3 font-medium text-slate-600">{row[0]}</td>
                  <td className="py-2.5 px-3">{row[1]}</td>
                  <td className="py-2.5 px-3">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <span>💡 את ההגבר הכמותי של כל תצורה (אות-קטן) רואים במודל ה-hybrid-π.</span>
          <Link to={lecturePath('semiconductors', 'bjt-nonideal', { tab: 'hybridpi' })} className="shrink-0 rounded-lg border border-violet-300 bg-white px-3 py-1.5 font-semibold text-violet-700 transition hover:bg-violet-100">
            ↪ מודל אות-קטן (3ג)
          </Link>
        </div>
      </Panel>
    </div>
  )
}
