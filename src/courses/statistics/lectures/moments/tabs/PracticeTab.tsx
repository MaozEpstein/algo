import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 2 — practice. Every problem is a REAL course item with its citation:
 *   • תרגול 2 שיטוס — שאלות 1, 3, 4
 *   • ש.ב 2 — שאלה 2 (Rayleigh)
 *   • מבחן 2023 מועד א׳ — שאלה 1 (law of total variance + covariance)
 */

// ── תרגול 2 · שאלה 1 — mixed CDF ──────────────────────────────────────────────
const q1Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'גזרו את הצפיפות $f_X$ מתוך ה-CDF.',
    tex: 'f_X(x)=\\frac{dF_X}{dx}',
    res: <Tex>{'\\gamma\\,\\delta(x)+2(1-\\gamma)x'}</Tex>,
    accent: ACCENT.sky,
    note: <>הקפיצה בגובה <Tex>{'\\gamma'}</Tex> ב-0 נותנת <Tex>{'\\gamma\\delta(x)'}</Tex>; הנגזרת על <Tex>{'(0,1)'}</Tex> נותנת <Tex>{'2(1-\\gamma)x'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $E[X]$.',
    tex: 'E[X]=\\int_0^1 x\\cdot 2(1-\\gamma)x\\,dx',
    res: <Tex>{'\\tfrac23(1-\\gamma)'}</Tex>,
    accent: ACCENT.emerald,
    note: <>הרכיב <Tex>{'\\gamma\\delta(x)'}</Tex> תורם 0 לתוחלת (ממוקם ב-0).</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $E[X^2]$.',
    tex: 'E[X^2]=\\int_0^1 x^2\\cdot 2(1-\\gamma)x\\,dx',
    res: <Tex>{'\\tfrac{1-\\gamma}{2}'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $\\mathrm{Var}(X)$.',
    tex: '\\mathrm{Var}=E[X^2]-E^2[X]=\\tfrac{1-\\gamma}{2}-\\tfrac49(1-\\gamma)^2',
    res: <Tex>{'\\tfrac{-8\\gamma^2+7\\gamma+1}{18}'}</Tex>,
    accent: ACCENT.emerald,
  },
]

// ── תרגול 2 · שאלה 4 — law of total variance ─────────────────────────────────
const q4Formulas: TFormula[] = [
  { name: 'חוק השונות השלמה', tex: '\\mathrm{Var}(X)=E_Y[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}_Y(E[X\\mid Y])' },
]
const q4Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את $E[X]$ של התערובת.',
    tex: 'E[X]=0.7\\cdot 5+0.3\\cdot 3',
    res: <Tex>{'4.4'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את הפיזור "בתוך" הקבוצות $E_Y[\\mathrm{Var}(X\\mid Y)]$.',
    tex: '=0.7\\cdot 2+0.3\\cdot 1',
    res: <Tex>{'1.7'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את הפיזור "בין" הקבוצות $\\mathrm{Var}_Y(E[X\\mid Y])$.',
    tex: '=0.7(5-4.4)^2+0.3(3-4.4)^2',
    res: <Tex>{'0.84'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'הרכיבו את $\\mathrm{Var}(X)$.',
    tex: '\\mathrm{Var}(X)=1.7+0.84',
    res: <Tex>{'2.54'}</Tex>,
    accent: ACCENT.emerald,
  },
]

// ── תרגול 2 · שאלה 3 — binary channel covariance ─────────────────────────────
const q3Parts: Part[] = [
  {
    kind: 'concept',
    prompt: 'מהם $E[X]$, $\\mathrm{Var}(X)$ ו-$E[Y]$? ($X\\in\\{0,1\\}$, $\\Pr(X{=}1)=\\theta$, הסתברות היפוך $e$.)',
    answer: (
      <>
        <Tex>{'E[X]=\\theta'}</Tex>, <Tex>{'\\mathrm{Var}(X)=\\theta(1-\\theta)'}</Tex>, ו-<Tex>{'E[Y]=\\Pr(Y{=}1)=e+\\theta-2e\\theta'}</Tex>.
      </>
    ),
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את הקווריאנס $\\sigma_{XY}$.',
    tex: '\\sigma_{XY}=E[XY]-E[X]E[Y]=(1-e)\\theta-\\theta(e+\\theta-2e\\theta)',
    res: <Tex>{'\\theta(1-\\theta)(1-2e)'}</Tex>,
    accent: ACCENT.emerald,
    note: <><Tex>{'E[XY]=\\Pr(X{=}1,Y{=}1)=(1-e)\\theta'}</Tex> (רק כשגם X=1 וגם Y=1 המכפלה 1).</>,
  },
  {
    kind: 'concept',
    prompt: 'מתי $X$ ו-$Y$ בלתי-מתואמים?',
    answer: (
      <>
        כאשר <Tex>{'e=\\tfrac12'}</Tex>: אז <Tex>{'\\sigma_{XY}=\\theta(1-\\theta)(1-2\\cdot\\tfrac12)=0'}</Tex> — הערוץ "הורס" כל תלות בין הכניסה ליציאה.
      </>
    ),
  },
]

// ── ש.ב 2 · שאלה 2 — Rayleigh ────────────────────────────────────────────────
const rayParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את השכיח (mode) של $f(r)=r\\,e^{-r^2/2}$.',
    tex: "f'(r)=e^{-r^2/2}(1-r^2)=0",
    res: <Tex>{'r=1'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $E[r]$.',
    tex: 'E[r]=\\int_0^\\infty r\\cdot r\\,e^{-r^2/2}\\,dr',
    res: <Tex>{'\\sqrt{\\pi/2}\\approx 1.253'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $E[r^2]$ ואת $\\mathrm{Var}(r)$.',
    tex: 'E[r^2]=\\int_0^\\infty r^3 e^{-r^2/2}\\,dr=2',
    res: <Tex>{'\\mathrm{Var}=2-\\tfrac{\\pi}{2}'}</Tex>,
    accent: ACCENT.emerald,
  },
]

// ── מבחן 2023 מועד א׳ · שאלה 1 — total variance + covariance ─────────────────
const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את $E[X]$ (נזכיר: $X\\mid Y\\sim U(-Y,Y)$).',
    tex: 'E[X\\mid Y]=0\\;\\Rightarrow\\; E[X]=E_Y[0]',
    res: <Tex>{'0'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $\\mathrm{Var}(X)$ בעזרת חוק השונות השלמה.',
    tex: '\\mathrm{Var}(X\\mid Y)=\\tfrac{(2Y)^2}{12}=\\tfrac{Y^2}{3},\\quad \\mathrm{Var}(X)=E_Y\\!\\big[\\tfrac{Y^2}{3}\\big]=\\tfrac13\\cdot\\tfrac{A^2}{3}',
    res: <Tex>{'A^2/9'}</Tex>,
    accent: ACCENT.emerald,
    note: <>הרכיב "בין הקבוצות" מתאפס כי <Tex>{'E[X\\mid Y]=0'}</Tex> קבוע, ו-<Tex>{'E_Y[Y^2]=A^2/3'}</Tex> עבור <Tex>{'Y\\sim U(0,A)'}</Tex>.</>,
  },
  {
    kind: 'concept',
    prompt: 'מהו $\\mathrm{Cov}(X,Y)$?',
    answer: (
      <>
        <Tex>{'\\mathrm{Cov}(X,Y)=E[XY]-0=E_Y\\big[Y\\,E[X\\mid Y]\\big]=E_Y[Y\\cdot 0]=0'}</Tex> — למרות ש-<Tex>{'X'}</Tex> ו-<Tex>{'Y'}</Tex> תלויים!
        עוד המחשה לכך שאי-מתאם חלש מאי-תלות.
      </>
    ),
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס עצמם</b> (תרגול · ש.ב · מבחן) — התגית הכחולה מציינת את המקור. נסו כל סעיף
          לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="תרגיל — CDF מעורב: תוחלת ושונות" source="תרגול 2 · שאלה 1" parts={q1Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה <span dir="ltr"><Tex>{'F_X(x)=\\gamma+(1-\\gamma)x^2'}</Tex></span> על <span dir="ltr"><Tex>{'0<x<1'}</Tex></span>,
          עם קפיצה בגובה <span dir="ltr"><Tex>{'\\gamma'}</Tex></span> ב-0 (ו-<span dir="ltr"><Tex>{'0\\le\\gamma\\le1'}</Tex></span>). מצאו צפיפות, תוחלת ושונות.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — חוק השונות השלמה (מודל תערובת)" source="תרגול 2 · שאלה 4" parts={q4Parts} formulas={q4Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X'}</Tex></span> נדגם מתערובת: בהסתברות 0.7 מרכיב <span dir="ltr"><Tex>{'N(5,2)'}</Tex></span> ובהסתברות 0.3
          מרכיב <span dir="ltr"><Tex>{'N(3,1)'}</Tex></span> (הערכים 2 ו-1 הם השונויות). חשבו את <span dir="ltr"><Tex>{'\\mathrm{Var}(X)'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — ערוץ בינארי: קווריאנס" source="תרגול 2 · שאלה 3" parts={q3Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          משדרים <span dir="ltr"><Tex>{'X\\in\\{0,1\\}'}</Tex></span> עם <span dir="ltr"><Tex>{'\\Pr(X{=}1)=\\theta'}</Tex></span> דרך ערוץ עם
          הסתברות היפוך <span dir="ltr"><Tex>{'e'}</Tex></span>, ומקבלים <span dir="ltr"><Tex>{'Y'}</Tex></span>. מצאו את הקווריאנס.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — התפלגות ריילי: תוחלת, שכיח ושונות" source="ש.ב 2 · שאלה 2" parts={rayParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה <span dir="ltr"><Tex>{'f(r)=r\\,e^{-r^2/2}'}</Tex></span> עבור <span dir="ltr"><Tex>{'r\\ge0'}</Tex></span>. מצאו את השכיח,
          התוחלת והשונות.
        </p>
      </Problem>

      <Problem titleHe="שאלת מבחן — שונות שלמה וקווריאנס" source="מבחן 2023 מועד א׳ · שאלה 1" parts={examParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'Y\\sim U(0,A)'}</Tex></span>, ובהינתן <span dir="ltr"><Tex>{'Y'}</Tex></span> מתקיים{' '}
          <span dir="ltr"><Tex>{'X\\mid Y\\sim U(-Y,Y)'}</Tex></span>. חשבו תוחלת, שונות (דרך חוק השונות השלמה) וקווריאנס.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · האם $\rho=0$ אומר ש-$X,Y$ בלתי-תלויים?">
            לא בהכרח. <Tex>{'\\rho=0'}</Tex> אומר <b>אי-מתאם לינארי</b> בלבד; ייתכן קשר לא-לינארי חזק (למשל{' '}
            <Tex>{'Y=X^2'}</Tex>). אי-תלות ⇐ אי-מתאם, אך לא להפך (למעט במקרה הגאוסי המשותף).
          </QA>
          <QA q="2 · למה מוסיפים ריבוע ב-$\mathrm{Var}(aX)=a^2\mathrm{Var}(X)$?">
            כי השונות נמדדת ב<b>ריבוע</b> היחידות; מתיחה פי <Tex>{'a'}</Tex> מותחת את הסטיות פי <Tex>{'a'}</Tex>, ואת ריבועיהן פי{' '}
            <Tex>{'a^2'}</Tex>.
          </QA>
          <QA q="3 · מה היתרון של הפונקציה האופיינית על ה-CDF?">
            היא <b>תמיד קיימת</b> (<Tex>{'|e^{jwX}|=1'}</Tex>), הופכת קונבולוציות למכפלות, וממנה שולפים את כל המומנטים בגזירה
            פשוטה באפס.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
