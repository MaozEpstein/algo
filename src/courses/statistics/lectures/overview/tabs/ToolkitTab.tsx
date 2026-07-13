import { Link } from 'react-router-dom'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { lecturePath } from '@/core/platform/links'

/**
 * Overview · "which tool when" — a usage-lens map of the course. Given the kind of
 * problem, which estimator/decision rule applies, and which lesson teaches it.
 * Complements the course map (which is topic-ordered) with a decision-ordered view.
 */

type Tool = { whenHe: string; ruleHe: string; tex: string; lessonHe: string; lectureId: string }

const TOOLS: Tool[] = [
  { whenHe: 'הכרעה בין שתי השערות', ruleHe: 'מבחן יחס הנראות / ניימן-פירסון', tex: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\gtrless\\eta', lessonHe: 'שיעור 5 · בדיקת השערות', lectureId: 'hypothesis-testing' },
  { whenHe: 'פרמטר קבוע לא-ידוע + מודל הסתברותי', ruleHe: 'נראות מרבית (ML)', tex: '\\hat\\theta_{ML}=\\arg\\max_\\theta \\log f(y;\\theta)', lessonHe: 'שיעור 6 · נראות מרבית', lectureId: 'maximum-likelihood' },
  { whenHe: 'פרמטר קבוע + מזעור שגיאה ריבועית', ruleHe: 'ריבועים פחותים (LS)', tex: '\\hat\\theta_{LS}=(H^\\top H)^{-1}H^\\top y', lessonHe: 'שיעור 7 · ריבועים פחותים', lectureId: 'least-squares' },
  { whenHe: 'פרמטר מקרי + עלות ריבועית', ruleHe: 'תוחלת מותנית (MMSE)', tex: '\\hat\\theta_{MMSE}=E[\\theta\\mid y]', lessonHe: 'שיעור 8 · סטטיסטיקה בייסיאנית', lectureId: 'bayesian-statistics' },
  { whenHe: 'פרמטר מקרי + עלות 0-1', ruleHe: 'שיא ה-posterior (MAP)', tex: '\\hat\\theta_{MAP}=\\arg\\max_\\theta f(\\theta\\mid y)', lessonHe: 'שיעור 8 · סטטיסטיקה בייסיאנית', lectureId: 'bayesian-statistics' },
  { whenHe: 'פרמטר מקרי + עלות ערך-מוחלט', ruleHe: 'חציון ה-posterior', tex: 'F_{\\theta\\mid Y}(\\hat\\theta\\mid y)=\\tfrac12', lessonHe: 'שיעור 8 · סטטיסטיקה בייסיאנית', lectureId: 'bayesian-statistics' },
  { whenHe: 'אמד לינארי מהיר (סטטיסטיקה מסדר 2)', ruleHe: 'LMMSE / BLE', tex: '\\hat x=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y)', lessonHe: 'שיעור 9 · אמידה לינארית', lectureId: 'linear-bayesian-estimation' },
  { whenHe: 'אמידה לאורך זמן / סינון אות', ruleHe: 'מסנן וינר / קלמן', tex: 'h=R_Y^{-1}r_{XY}\\,;\\ \\ K_n=\\tfrac{P_{n|n-1}}{P_{n|n-1}+\\sigma_R^2}', lessonHe: 'שיעור 12 · מסננים', lectureId: 'linear-random-processes' },
]

export default function ToolkitTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איזה כלי מתי?">
        <p className="leading-relaxed text-slate-700">
          מפת הקורס מסודרת <b>לפי נושאים</b>. הלשונית הזו מסודרת <b>לפי שימוש</b>: נתונה בעיה — איזה אמד או כלל-החלטה
          מתאים, ואיפה הוא נלמד. לחצו על שורה כדי לקפוץ לשיעור.
        </p>
      </Panel>

      <div className="hide-scrollbar overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-4 py-2.5 text-center font-bold">מתי (סוג הבעיה)</th>
              <th className="px-4 py-2.5 text-center font-bold">הכלי</th>
              <th className="px-4 py-2.5 text-center font-bold">נוסחה</th>
              <th className="px-4 py-2.5 text-center font-bold">שיעור</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((t, i) => (
              <tr key={i} className={`border-t border-slate-100 align-middle transition hover:bg-emerald-50/40 ${i % 2 ? 'bg-slate-50/40' : 'bg-white'}`}>
                <td className="px-4 py-3 text-center font-medium text-slate-700">{t.whenHe}</td>
                <td className="px-4 py-3 text-center font-bold text-emerald-700">{t.ruleHe}</td>
                <td className="px-4 py-3 text-center" dir="ltr"><Tex>{t.tex}</Tex></td>
                <td className="whitespace-nowrap px-4 py-3 text-center">
                  <Link to={lecturePath('statistics', t.lectureId)} className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200 transition hover:bg-sky-100">
                    {t.lessonHe} <span aria-hidden>←</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Panel title="הקו המנחה">
        <p className="leading-relaxed text-slate-600">
          שתי שאלות קובעות את הכל: (1) האם הפרמטר <b>קבוע</b> (ML/LS) או <b>מקרי</b> עם prior (בייסיאני)? ו-(2) מהי
          <b> פונקציית העלות</b> — ריבועית (תוחלת), 0-1 (שיא), או ערך-מוחלט (חציון). כל השאר הוא פירוט.
        </p>
      </Panel>
    </div>
  )
}
