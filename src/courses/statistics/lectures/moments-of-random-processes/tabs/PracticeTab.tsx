import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 11 — practice. Moment-centric, and deliberately DISTINCT from lesson 10
 * (which already used 2022 Final C Q3 / recitation 11 examples / homework 11):
 *   • מבחן 2023 מועד ב׳ — שאלה 3 (mixture z[n]: mean + autocorrelation)
 *   • סיכום · דוגמה 44 (AR(1) autocorrelation recursion)
 *   • סיכום · דוגמה 43 (random walk R_X = σ²·min)
 *   • תרגול 11 · §1.4 (LTI output moments)
 */

const momentFormulas: TFormula[] = [
  { name: 'אוטו-קורלציה', tex: 'R_X(t_1,t_2)=E[X(t_1)X(t_2)]' },
  { name: 'WSS', tex: '\\mu_X\\ \\text{const},\\ R_X(t_1,t_2)=R_X(\\tau)' },
  { name: 'AR(1)', tex: 'R(0)=\\tfrac{\\sigma^2}{1-\\alpha^2},\\ R(k)=\\alpha R(k-1)' },
  { name: 'יציאת LTI', tex: 'R_Y(\\tau)=\\textstyle\\sum_i\\sum_j h[i]h[j]r_X(\\tau+i-j)' },
]

const mixParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את התוחלת $E[z[n]]$ עבור $z[n]=Bx[n]+(1-B)y[n]$, $B\\sim\\mathrm{Ber}(\\tfrac12)$.',
    tex: 'E[z[n]]=\\tfrac12 E[x[n]]+\\tfrac12 E[y[n]],\\ x=\\cos(\\omega n)+e_x,\\ y=\\sin(\\omega n)+e_y',
    res: <Tex>{'E[z[n]]=\\tfrac12\\big(\\cos(\\omega n)+\\sin(\\omega n)\\big)'}</Tex>,
    accent: ACCENT.sky,
    note: <>הרעשים <Tex>{'e_x,e_y'}</Tex> מרכזיים, אז נשארת רק התרומה הדטרמיניסטית.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את האוטו-קורלציה $R_z(n_1,n_2)$.',
    tex: 'R_z=\\tfrac12 R_x+\\tfrac12 R_y,\\ R_x=\\cos(\\omega n_1)\\cos(\\omega n_2)+\\delta,\\ R_y=\\sin\\cdot\\sin+\\delta',
    res: <Tex>{'R_z=\\tfrac12\\cos(\\omega n_1)\\cos(\\omega n_2)+\\tfrac12\\sin(\\omega n_1)\\sin(\\omega n_2)+\\delta_{n_1 n_2}'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'האם $z[n]$ הוא WSS?',
    answer: (
      <>
        <b>לא.</b> התוחלת <Tex>{'E[z[n]]=\\tfrac12(\\cos+\\sin)'}</Tex> <b>תלויה ב-n</b> — התנאי הראשון של WSS נכשל (התנאי הראשון
        לבדו כבר שולל).
      </>
    ),
  },
]

const arParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ההספק $R(0)$ של $X[n]=\\alpha X[n-1]+W[n]$ ($W\\sim N(0,\\sigma^2)$, $|\\alpha|<1$).',
    tex: 'E[X^2[n]]=\\alpha^2 E[X^2[n-1]]+\\sigma^2\\ \\Rightarrow\\ R(0)=\\alpha^2R(0)+\\sigma^2',
    res: <Tex>{'R(0)=\\dfrac{\\sigma^2}{1-\\alpha^2}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>ב-WSS <Tex>{'E[X^2[n]]'}</Tex> קבוע — מכאן פותרים ל-R(0).</>,
  },
  {
    kind: 'numeric',
    prompt: 'כתבו את נסיגת האוטו-קורלציה ופתרו אותה.',
    tex: 'E[X[n]X[n-k]]=\\alpha E[X[n-1]X[n-k]]\\ \\Rightarrow\\ R(k)=\\alpha R(k-1)',
    res: <Tex>{'R(k)=\\dfrac{\\sigma^2}{1-\\alpha^2}\\,\\alpha^{|k|}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>דעיכה גאומטרית — זיכרון שמתכווץ בגורם <Tex>{'\\alpha'}</Tex> בכל צעד.</>,
  },
  {
    kind: 'concept',
    prompt: 'מה קורה כאשר $|\\alpha|\\ge1$?',
    answer: (
      <>
        התהליך <b>אינו WSS</b> — <Tex>{'R(0)=\\sigma^2/(1-\\alpha^2)'}</Tex> אינו סופי/חיובי, והשונות מתפוצצת. יציבות דורשת <Tex>{'|\\alpha|<1'}</Tex>.
      </>
    ),
  },
]

const rwParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את האוטו-קורלציה של המהלך המקרי $X[n]=\\sum_{i=1}^{n}W[i]$ ($W\\sim N(0,\\sigma^2)$ i.i.d).',
    tex: 'R_X(n,m)=E\\Big[\\sum_i W[i]\\sum_j W[j]\\Big]=\\sum_{i\\le\\min(n,m)}\\sigma^2',
    res: <Tex>{'R_X(n,m)=\\sigma^2\\min(n,m)'}</Tex>,
    accent: ACCENT.violet,
    note: <>רק אינדקסים משותפים תורמים, כי <Tex>{'E[W_iW_j]=\\sigma^2\\delta_{ij}'}</Tex>.</>,
  },
  {
    kind: 'concept',
    prompt: 'למה המהלך המקרי אינו WSS?',
    answer: (
      <>
        <Tex>{'R_X'}</Tex> תלוי ב<b>שני</b> הזמנים (דרך <Tex>{'\\min'}</Tex>), לא רק בפיגור, וגם <Tex>{'\\mathrm{Var}(X[n])=\\sigma^2 n'}</Tex>{' '}
        <b>גדל</b> עם הזמן — שני התנאים נכשלים.
      </>
    ),
  },
]

const ltiParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'כניסת $X$ היא WSS. מצאו את תוחלת היציאה של $Y[n]=\\sum_i h[i]X[n-i]$.',
    tex: 'E[Y[n]]=\\sum_i h[i]E[X[n-i]]=\\Big(\\sum_i h[i]\\Big)m_X',
    res: <Tex>{'E[Y[n]]=\\big(\\textstyle\\sum_i h[i]\\big)m_X'}</Tex>,
    accent: ACCENT.emerald,
    note: <>אינה תלויה ב-n ⇒ תוחלת קבועה.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את האוטו-קורלציה של היציאה, ופרטו עבור $Y[n]=\\tfrac12X[n]+\\tfrac12X[n-1]$.',
    tex: 'R_Y(\\tau)=\\sum_i\\sum_j h[i]h[j]\\,r_X(\\tau+i-j)',
    res: <Tex>{'R_Y(\\tau)=\\tfrac12 r_X(\\tau)+\\tfrac14 r_X(\\tau-1)+\\tfrac14 r_X(\\tau+1)'}</Tex>,
    accent: ACCENT.violet,
    note: <>תלויה רק בפיגור <Tex>{'\\tau'}</Tex> ⇒ היציאה WSS.</>,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (מבחן · סיכום · תרגול) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="שאלת מבחן — תוחלת ואוטו-קורלציה של תערובת" source="מבחן 2023 מועד ב׳ · שאלה 3" parts={mixParts} formulas={momentFormulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'x[n]=\\cos(\\omega n)+e_x[n]'}</Tex></span>, <span dir="ltr"><Tex>{'y[n]=\\sin(\\omega n)+e_y[n]'}</Tex></span>, ותערובת{' '}
          <span dir="ltr"><Tex>{'z[n]=Bx[n]+(1-B)y[n]'}</Tex></span> עם <span dir="ltr"><Tex>{'B\\sim\\mathrm{Ber}(\\tfrac12)'}</Tex></span>. חשבו תוחלת, אוטו-קורלציה, וקבעו WSS.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — אוטו-קורלציה של AR(1)" source="סיכום · דוגמה 44" parts={arParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          תהליך אוטו-רגרסיבי <span dir="ltr"><Tex>{'X[n]=\\alpha X[n-1]+W[n]'}</Tex></span> עם רעש לבן. מצאו את ההספק, את נסיגת האוטו-קורלציה ואת פתרונה.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — מהלך מקרי" source="סיכום · דוגמה 43" parts={rwParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X[n]=\\sum_{i=1}^{n}W[i]'}</Tex></span>, <span dir="ltr"><Tex>{'W\\sim N(0,\\sigma^2)'}</Tex></span> i.i.d. חשבו את האוטו-קורלציה וקבעו WSS.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — מומנטי היציאה של מערכת LTI" source="תרגול 11 · §1.4" parts={ltiParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          כניסת <span dir="ltr"><Tex>{'X'}</Tex></span> היא WSS ועוברת דרך מערכת LTI יציבה{' '}
          <span dir="ltr"><Tex>{'Y[n]=\\sum_i h[i]X[n-i]'}</Tex></span>. מצאו את תוחלת ואוטו-קורלציית היציאה.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="למה WSS קל יותר לבדיקה מ-SSS?">
            SSS דורש ש<b>כל</b> ההתפלגויות הסוף-ממדיות יהיו אינווריאנטיות להזזה — קשה מאוד. WSS דורש רק <b>שני מומנטים</b>:
            תוחלת קבועה ואוטו-קורלציה תלוית-פיגור. בתהליך <b>גאוסי</b> WSS אף שקול ל-SSS.
          </QA>
          <QA q="למה השיא של האוטו-קורלציה תמיד בפיגור אפס?">
            כי <Tex>{'|R_X(\\tau)|\\le R_X(0)'}</Tex> (מ-<Tex>{'E[(X(t)\\pm X(0))^2]\\ge0'}</Tex>). <Tex>{'R_X(0)=E[X^2]'}</Tex> הוא ההספק —
            אף פיגור לא "מתואם" חזק יותר מהדגימה עם עצמה.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
