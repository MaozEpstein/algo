import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const FORMULAS: { he: string; tex: string }[] = [
  { he: 'אנרגיית מנהור', tex: 'E_{00}=1.857\\times10^{-11}\\sqrt{N_D/(\\varepsilon_r m_r)}' },
  { he: 'רוחב מחסום', tex: 'W=\\sqrt{2\\varepsilon_s V_{bi}/(qN_D)}\\propto 1/\\sqrt{N_D}' },
  { he: 'אנרגיית מעבר', tex: 'E_0=E_{00}\\coth(E_{00}/kT)' },
  { he: 'התנגדות מגע סגולית', tex: '\\rho_c=\\rho_0\\,e^{\\varphi_B/E_0}' },
  { he: 'אופיין אוהמי', tex: 'V=I\\,\\rho_c\\quad(\\text{ליניארי})' },
  { he: 'קריטריון צבירה', tex: '\\varphi_m<\\varphi_s=\\chi+\\xi' },
]

const REGIMES: { he: string; tex: string; note: string; accent: string }[] = [
  { he: 'TE — תרמיוני', tex: 'E_{00}<0.5kT', note: 'סימום נמוך · מיישר', accent: 'border-amber-200 bg-amber-50' },
  { he: 'TFE — תרמיוני-שדה', tex: '0.5kT\\le E_{00}\\le 5kT', note: 'תחום ביניים', accent: 'border-sky-200 bg-sky-50' },
  { he: 'FE — מנהור', tex: 'E_{00}>5kT', note: 'n⁺ · אוהמי', accent: 'border-emerald-200 bg-emerald-50' },
]

const MISTAKES: { wrong: ReactNode; right: ReactNode }[] = [
  {
    wrong: <>כדי לקבל מגע אוהמי צריך מתכת מיוחדת עם <Tex>{'\\varphi_m'}</Tex> קטן.</>,
    right: <>בפועל (על Si) <b>קיבוע-פרמי</b> חוסם זאת — מסממים <b>n⁺</b> ונשענים על <b>מנהור</b>, שעובד עם כל מתכת.</>,
  },
  {
    wrong: <>במגע אוהמי גובה המחסום <Tex>{'\\varphi_B'}</Tex> הוא אפס.</>,
    right: <>המחסום עדיין קיים — אבל <b>דק כל-כך</b> (<Tex>{'W\\sim'}</Tex> ננומטרים) שאלקטרונים <b>מנהרים</b> דרכו ברמת פרמי.</>,
  },
  {
    wrong: <>סימום כבד מוריד את <Tex>{'\\varphi_B'}</Tex> ולכן מקטין את ההתנגדות.</>,
    right: <>הסימום מצמצם את <Tex>{'W'}</Tex>, לא את <Tex>{'\\varphi_B'}</Tex>. הקריסה ב-<Tex>{'\\rho_c'}</Tex> נובעת מ-<Tex>{'E_0\\to E_{00}\\propto\\sqrt{N_D}'}</Tex>.</>,
  },
  {
    wrong: <>מגע אוהמי הוא פשוט "חוט" בלי כל התנגדות.</>,
    right: <>יש לו התנגדות סגולית <Tex>{'\\rho_c'}</Tex> סופית (~<Tex>{'10^{-6}\\,\\Omega\\,\\mathrm{cm^2}'}</Tex> ב-n⁺) — קטנה, אך לא אפס.</>,
  },
]

// The four parts of lecture 2 — each a kind of junction/contact — side by side.
const JUNCTIONS: { part: string; name: string; accent: string; id: ReactNode; mech: ReactNode; iv: ReactNode; use: ReactNode }[] = [
  {
    part: '2א',
    name: 'דיודת PN אידיאלית',
    accent: 'text-sky-700',
    id: <>צומת <b>p–n</b> (שני חצאי מל"מ); המודל ה<b>אידיאלי</b> — דיפוזיית מיעוט בלבד, <Tex>{'n=1'}</Tex>.</>,
    mech: <>דיפוזיית נושאי <b>מיעוט</b> מוזרקים מעבר לצומת.</>,
    iv: <><Tex>{'I=I_S(e^{V/V_T}-1)'}</Tex> — מיישר, מעריכי.</>,
    use: <><b>יישור (AC→DC)</b> בגשרי-מתח וספקי-כוח. הבסיס התיאורטי שכל דיודה נמדדת מולו.</>,
  },
  {
    part: '2ב',
    name: 'דיודת PN לא-אידיאלית',
    accent: 'text-rose-600',
    id: <>אותו צומת <b>p–n</b>, אך עם ה<b>סטיות הממשיות</b>: רקומבינציה (<Tex>{'n\\approx2'}</Tex>), הזרקה-גבוהה, התנגדות טורית.</>,
    mech: <>מתווספים <b>רקומבינציה/גנרציה</b>, הזרקה-גבוהה והתנגדות טורית (מקדם אי-אידיאליות <Tex>{'n'}</Tex>).</>,
    iv: <>סוטה מהאידיאלי — אזורים שונים, שיפוע <Tex>{'n\\approx1\\text{–}2'}</Tex>.</>,
    use: <><b>תאים סולאריים ו-LED</b>: דווקא זרם הרקומבינציה הוא "ההתקן". וגם מידול-מעגלים מדויק.</>,
  },
  {
    part: '2ג',
    name: 'דיודת שוטקי',
    accent: 'text-violet-700',
    id: <>מגע <b>מתכת–מל"מ</b> (לא p–n) עם <Tex>{'\\varphi_m>\\varphi_s'}</Tex> (ל-n) — נוצר מחסום מיישר.</>,
    mech: <>פליטה <b>תרמיונית</b> של נושאי <b>רוב</b> מעל מחסום <Tex>{'\\varphi_B'}</Tex>.</>,
    iv: <>מיישר, אך <Tex>{'J_{ST}\\gg J_S'}</Tex> → <b>מתח-הצתה נמוך</b>.</>,
    use: <><b>מיתוג מהיר ומפל-מתח נמוך</b>: ספקי-מיתוג, RF, הגנה (clamp). אין אגירת-מיעוט → אין reverse-recovery.</>,
  },
  {
    part: '2ד',
    name: 'מגע אוהמי',
    accent: 'text-emerald-700',
    id: <>מגע <b>מתכת–מל"מ</b> עם <Tex>{'\\varphi_m<\\varphi_s'}</Tex> (ל-n), או סימום <b>n⁺</b> כבד — <b>לא</b> מיישר.</>,
    mech: <>נושאי <b>רוב</b> זורמים חופשי (צבירה / מנהור דרך מחסום דק).</>,
    iv: <><b>לא</b> מיישר — <Tex>{'V=I\\rho_c'}</Tex> ליניארי וסימטרי.</>,
    use: <><b>כל הדק של כל התקן</b> (טרנזיסטור/דיודה) — חיבור למעגל ללא דיודה טפילית והתנגדות נמוכה.</>,
  },
]

/**
 * Lecture 2ד — summary: the idea in brief, the key-formula grid, the three
 * tunneling regimes, common mistakes, the lecture-2 comparison table, and the
 * bridge to lecture 3 (the BJT).
 */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון בקצרה">
        <p className="leading-relaxed text-slate-600">
          <b>מגע אוהמי</b> הוא מגע מתכת–מל"מ <b>לא-מיישר</b>: אופיין <b>ליניארי</b> (<Tex>{'V=I\\rho_c'}</Tex>) והתנגדות
          נמוכה, הדרוש לחיבור התקן למעגל בלי דיודה טפילית. יש שני מסלולים — <b>צבירה</b> (<Tex>{'\\varphi_m<\\varphi_s'}</Tex>,
          נדיר על Si) ו<b>מנהור</b> דרך מחסום דק שנוצר ב<b>סימום n⁺</b> — המעשי. מדד-הביצועים:
        </p>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'\\rho_c=\\rho_0\\,e^{\\varphi_B/E_0},\\qquad E_0=E_{00}\\coth(E_{00}/kT)'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          ככל שמסממים כבד יותר, <Tex>{'W\\propto1/\\sqrt{N_D}'}</Tex> מצטמצם ו-<Tex>{'\\rho_c'}</Tex> <b>צונחת מעריכית</b> —
          עד כדי <Tex>{'\\sim10^{-6}\\,\\Omega\\,\\mathrm{cm^2}'}</Tex> ב-n⁺.
        </p>
      </Panel>

      <Panel title="שלושת המשטרים">
        <div className="grid gap-2 sm:grid-cols-3">
          {REGIMES.map((r, i) => (
            <div key={i} className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center ${r.accent}`}>
              <span className="text-sm font-bold text-slate-700">{r.he}</span>
              <Tex>{r.tex}</Tex>
              <span className="text-xs text-slate-500">{r.note}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2">
          {FORMULAS.map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
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

      <Panel title="ארבעת צמתי שיעור 2 — השוואה">
        <p className="leading-relaxed text-slate-600">
          כל ארבעת חלקי שיעור 2 הם <b>סוג של צומת/דיודה</b>. הנה ההבדלים — והיכן פוגשים כל אחד בעולם האמיתי:
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[52rem] border-collapse text-start text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="px-3 py-2 text-start font-semibold text-slate-400">הסוג</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-400">איך מבחינים</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-400">מנגנון הזרם</th>
                <th className="px-3 py-2 text-start font-semibold text-slate-400">אופיין <Tex>{'I\\text{–}V'}</Tex></th>
                <th className="px-3 py-2 text-start font-semibold text-slate-400">שימוש בעולם — ולמה</th>
              </tr>
            </thead>
            <tbody>
              {JUNCTIONS.map((j, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50/40' : ''}>
                  <td className="border-b border-slate-100 px-3 py-2.5 align-top">
                    <span className="block text-xs font-semibold text-slate-400">{j.part}</span>
                    <span className={`font-bold ${j.accent}`}>{j.name}</span>
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2.5 align-top leading-relaxed text-slate-600">{j.id}</td>
                  <td className="border-b border-slate-100 px-3 py-2.5 align-top leading-relaxed text-slate-600">{j.mech}</td>
                  <td className="border-b border-slate-100 px-3 py-2.5 align-top leading-relaxed text-slate-600">{j.iv}</td>
                  <td className="border-b border-slate-100 px-3 py-2.5 align-top leading-relaxed text-slate-600">{j.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-500">
          <b>החוט המקשר:</b> 2א נותן את הצורה המעריכית, 2ב מוסיף את המציאות (רקומבינציה/הזרקה-גבוהה), 2ג מחליף את מנגנון
          הזרם לפליטה תרמיונית של רוב, ו-2ד הוא המגע ה<b>לא</b>-מיישר שמחבר את כולם למעגל.
        </p>
      </Panel>

      <Panel title="מה הלאה?">
        <p className="leading-relaxed text-slate-600">
          בכך סיימנו את <b>שיעור 2 — דיודת ה-PN</b> על ארבעת חלקיו (צומת, אופיין, שוטקי, אוהמי). בשיעור הבא נחבר
          שני צמתים גב-אל-גב ונקבל את <b>הטרנזיסטור הדו-קוטבי (BJT)</b> — <b>שיעור 3</b> — שבו המגעים האוהמיים שראינו
          כאן הם הדקי האמיטר/בסיס/קולטור.
        </p>
      </Panel>
    </div>
  )
}
