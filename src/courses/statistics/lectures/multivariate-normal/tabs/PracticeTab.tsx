import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 4 — practice. Every problem is a REAL course item with its citation:
 *   • תרגול 4 שיטוס — conditional-ρ, whitening, Y=SX, sample mean/variance
 *   • מבחן 2020 מועד א׳ — שאלה 2 (X=A·W, conditional Gaussian + MSE)
 */

const condFormulas: TFormula[] = [
  { name: 'התניה גאוסית', tex: 'E[X\\mid Y{=}y]=\\mu_X+C_{XY}C_{YY}^{-1}(y-\\mu_Y)' },
  { name: 'שונות מותנית', tex: 'C_{X\\mid Y}=C_{XX}-C_{XY}C_{YY}^{-1}C_{YX}' },
]
const condParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את התוחלת המותנית $\\mu_{X\\mid Y=y}$ (אפס-תוחלת).',
    tex: '\\mu_{X\\mid Y=y}=C_{XY}C_{YY}^{-1}y=\\rho\\sigma_x\\sigma_y\\cdot\\tfrac{1}{\\sigma_y^2}\\,y',
    res: <Tex>{'\\rho\\tfrac{\\sigma_x}{\\sigma_y}\\,y'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את השונות המותנית $C_{X\\mid Y}$.',
    tex: 'C_{X\\mid Y}=\\sigma_x^2-\\rho\\sigma_x\\sigma_y\\cdot\\tfrac{1}{\\sigma_y^2}\\cdot\\rho\\sigma_x\\sigma_y',
    res: <Tex>{'\\sigma_x^2(1-\\rho^2)'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'העריכו עבור $\\rho=0,\\ 1,\\ 0.5$.',
    answer: (
      <ul className="list-disc space-y-1 ps-5">
        <li><Tex>{'\\rho=0'}</Tex>: <Tex>{'\\mu=0,\\ C=\\sigma_x^2'}</Tex> — <b>אי-תלות</b> (Y לא עוזר).</li>
        <li><Tex>{'\\rho=1'}</Tex>: <Tex>{'\\mu=\\tfrac{\\sigma_x}{\\sigma_y}y,\\ C=0'}</Tex> — X נקבע לחלוטין מ-Y.</li>
        <li><Tex>{'\\rho=0.5'}</Tex>: <Tex>{'\\mu=0.5\\tfrac{\\sigma_x}{\\sigma_y}y,\\ C=0.75\\sigma_x^2'}</Tex>.</li>
      </ul>
    ),
  },
]

// ── תרגול 4 · הלבנה/צביעה ─────────────────────────────────────────────────────
const whitenParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מהו התנאי על $A=SU$ כך ש-$\\mathrm{Var}(AX)=I$?',
    tex: 'ACA^\\top=I\\ \\Rightarrow\\ A^\\top A=C^{-1}',
    res: <Tex>{'C^{-1}=U^\\top S^2 U'}</Tex>,
    accent: ACCENT.sky,
    note: <>זהו בדיוק הפירוק העצמי של <Tex>{'C^{-1}'}</Tex> (U אורתוגונלית, S² אלכסונית).</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $C^{-1}$ עבור $C=\\tfrac12\\begin{pmatrix}5&3\\\\3&5\\end{pmatrix}$.',
    tex: '\\det C=\\tfrac14(25-9)=4,\\quad C^{-1}=\\tfrac{1}{\\det C}\\cdot\\tfrac12\\begin{pmatrix}5&-3\\\\-3&5\\end{pmatrix}',
    res: <Tex>{'\\tfrac18\\begin{pmatrix}5&-3\\\\-3&5\\end{pmatrix}'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את $U$ ואת $S$.',
    tex: 'C^{-1}=U^\\top S^2 U',
    res: <Tex>{'U=45^\\circ,\\ S=\\mathrm{diag}(1,\\tfrac{1}{\\sqrt2})'}</Tex>,
    accent: ACCENT.emerald,
    note: <>הסיבוב ב-45° מיישר לצירים הראשיים, וה-S מנרמל כל ציר לשונות 1.</>,
  },
]

// ── תרגול 4 · דוגמה נגדית Y=SX ────────────────────────────────────────────────
const counterParts: Part[] = [
  {
    kind: 'concept',
    prompt: 'כיצד מתפלג $Y=SX$?',
    answer: (
      <>
        <Tex>{'Y\\sim N(0,1)'}</Tex> — כי <Tex>{'\\pm X'}</Tex> של גאוסי סימטרי הוא שוב אותו גאוסי.
      </>
    ),
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $\\mathrm{Cov}(X,Y)$.',
    tex: '\\mathrm{Cov}(X,Y)=E[XY]=E[SX^2]=E[S]\\,E[X^2]',
    res: <Tex>{'0'}</Tex>,
    accent: ACCENT.emerald,
    note: <><Tex>{'E[S]=0'}</Tex>, אז X,Y <b>לא-מתואמים</b>.</>,
  },
  {
    kind: 'concept',
    prompt: 'האם הם בלתי-תלויים? נורמליים במשותף?',
    answer: (
      <>
        <b>לא ולא.</b> תמיד <Tex>{'|Y|=|X|'}</Tex>, אז ידיעת X קובעת את <Tex>{'|Y|'}</Tex> — תלות ברורה. והענן הוא "X"
        ולא אליפסה, אז הם אינם נורמליים במשותף.
      </>
    ),
  },
]

// ── תרגול 4 · ממוצע ושונות מדגמיים ───────────────────────────────────────────
const sampleParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את $\\mathrm{Var}(m_x)$ עבור $m_x=\\tfrac1N\\sum X_i$, $X_i\\sim N(\\mu,\\sigma^2)$ i.i.d.',
    tex: '\\mathrm{Var}(m_x)=\\tfrac{1}{N^2}\\sum_i \\mathrm{Var}(X_i)=\\tfrac{1}{N^2}\\cdot N\\sigma^2',
    res: <Tex>{'\\sigma^2/N'}</Tex>,
    accent: ACCENT.emerald,
    note: <>ה"שגיאה התקנית" של הממוצע — קטֵנה כ-<Tex>{'1/\\sqrt N'}</Tex>.</>,
  },
  {
    kind: 'concept',
    prompt: 'למה הממוצע $m_x$ והשונות $S_x$ בלתי-תלויים?',
    answer: (
      <>
        מראים ש-<Tex>{'\\mathrm{Cov}(m_x,\\,X_i-m_x)=0'}</Tex>. כיוון ש-<Tex>{'(m_x, X-m_x)'}</Tex> נורמליים במשותף,
        אי-מתאם ⇐ <b>אי-תלות</b> (משפט 4.5), ולכן <Tex>{'m_x\\perp S_x'}</Tex>.
      </>
    ),
  },
]

// ── מבחן 2020 מועד א׳ · שאלה 2 ────────────────────────────────────────────────
const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את $f_{X\\mid A}(x\\mid A=a)$ עבור $X=A\\cdot W$, $W\\sim N(0,I)$.',
    tex: 'm_{X\\mid A=a}=a\\,E[W]=0,\\quad C_{X\\mid A=a}=a^2 E[WW^\\top]=a^2 I',
    res: <Tex>{'X\\mid A{=}a\\sim N(0,\\,a^2 I)'}</Tex>,
    accent: ACCENT.sky,
    note: <>טרנספורם לינארי של גאוסי (בהינתן a) — לכן שוב גאוסי.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את השגיאה $\\mathrm{MSE}=E[(\\hat X_1^2-X_1^2)^2]$ עם $\\hat X_1^2=A^2$.',
    tex: '=E[A^4]-2E[A^2X_1^2]+E[X_1^4],\\quad E[X_1^4\\mid A]=3A^4',
    res: <Tex>{'2E[A^4]=6\\sigma^4=24'}</Tex>,
    accent: ACCENT.emerald,
    note: <>עם <Tex>{'A\\sim N(0,\\sigma^2),\\ \\sigma^2=2'}</Tex>: <Tex>{'E[A^4]=3\\sigma^4=12'}</Tex>, ולכן <Tex>{'\\mathrm{MSE}=24'}</Tex>.</>,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (תרגול · מבחן) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="תרגיל — התניה גאוסית עם מתאם ρ" source="תרגול 4 · התניה" parts={condParts} formulas={condFormulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X,Y'}</Tex></span> גאוסיים במשותף, אפס-תוחלת, עם{' '}
          <span dir="ltr"><Tex>{'C=\\begin{pmatrix}\\sigma_x^2 & \\rho\\sigma_x\\sigma_y\\\\ \\rho\\sigma_x\\sigma_y & \\sigma_y^2\\end{pmatrix}'}</Tex></span>. מצאו את{' '}
          <span dir="ltr"><Tex>{'X\\mid Y=y'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — הלבנה וצביעה" source="תרגול 4 · הלבנה" parts={whitenParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתון <span dir="ltr"><Tex>{'X\\sim N\\big(0,\\tfrac12\\begin{pmatrix}5&3\\\\3&5\\end{pmatrix}\\big)'}</Tex></span>. מצאו טרנספורם{' '}
          <span dir="ltr"><Tex>{'Y=SUX'}</Tex></span> (סיבוב + מתיחה) כך ש-<span dir="ltr"><Tex>{'\\mathrm{Var}(Y)=I'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — הדוגמה הנגדית Y=SX" source="תרגול 4 · דוגמה נגדית" parts={counterParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X\\sim N(0,1)'}</Tex></span>, <span dir="ltr"><Tex>{'S=\\pm1'}</Tex></span> בהסתברות שווה ובלתי-תלוי, ו-<span dir="ltr"><Tex>{'Y=SX'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — ממוצע ושונות מדגמיים" source="תרגול 4 · ממוצע/שונות" parts={sampleParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X_i\\sim N(\\mu,\\sigma^2)'}</Tex></span> בלתי-תלויים. חשבו את פיזור הממוצע, והראו שהממוצע והשונות המדגמית בלתי-תלויים.
        </p>
      </Problem>

      <Problem titleHe="שאלת מבחן — X=A·W: התניה גאוסית ושגיאה" source="מבחן 2020 מועד א׳ · שאלה 2" parts={examParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'W\\sim N(0,I)'}</Tex></span> דו-ממדי, <span dir="ltr"><Tex>{'A\\sim N(0,2)'}</Tex></span> סקלר בלתי-תלוי, ו-<span dir="ltr"><Tex>{'X=A\\,W'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="מה קובע את צורת האליפסה של גאוסי דו-ממדי?">
            <b>מטריצת הקווריאנס</b> <Tex>{'C'}</Tex>: הווקטורים העצמיים שלה נותנים את כיווני הצירים הראשיים, והערכים העצמיים
            (בשורש) את אורכי חצאי-הצירים. <Tex>{'\\rho=0'}</Tex> ⇒ אליפסה מיושרת-צירים.
          </QA>
          <QA q="למה בגאוסי אי-מתאם שקול לאי-תלות, אבל לא בכללי?">
            כי בגאוסי הצפיפות תלויה ב-<Tex>{'C'}</Tex> רק דרך <Tex>{'C^{-1}'}</Tex> במעריך; <Tex>{'C'}</Tex> אלכסונית ⇒ המעריך מתפרק
            ⇒ מכפלת שוליים. ב-<Tex>{'Y=SX'}</Tex> אין מתאם אך יש תלות — כי ההתפלגות אינה גאוסית משותפת.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
