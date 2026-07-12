import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 3 — practice. Every problem is a REAL course item with its citation:
 *   • תרגול 3 שיטוס — שאלות 1, 2, 3, 4
 *   • ש.ב 3 — שאלה 2 (folded normal)
 * Plus a note on where transformations show up in the finals.
 */

// ── תרגול 3 · שאלה 1 — Y=aX³+b ────────────────────────────────────────────────
const q1Formulas: TFormula[] = [
  { name: 'לינארי', tex: 'f_Y(y)=\\tfrac{1}{|a|}f_Z\\!\\big(\\tfrac{y-b}{a}\\big)' },
  { name: 'סכום על השורשים', tex: 'f_Y(y)=\\sum_i f_X(x_i)/|g\'(x_i)|' },
]
const q1Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-CDF של $Z=X^3$.',
    tex: 'F_Z(z)=\\Pr(X\\le z^{1/3})=\\int_0^{z^{1/3}}6x(1-x)\\,dx',
    res: <Tex>{'3z^{2/3}-2z'}</Tex>,
    accent: ACCENT.sky,
    note: <>תקף על <Tex>{'0\\le z\\le1'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'גזרו לקבלת $f_Z$.',
    tex: 'f_Z(z)=\\tfrac{d}{dz}\\big(3z^{2/3}-2z\\big)',
    res: <Tex>{'2z^{-1/3}-2'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'הרכיבו עם ההזזה הלינארית $Y=aZ+b$.',
    tex: 'f_Y(y)=\\tfrac{1}{|a|}f_Z\\!\\big(\\tfrac{y-b}{a}\\big)',
    res: <Tex>{'\\tfrac{1}{|a|}\\big[2\\big(\\tfrac{y-b}{a}\\big)^{-1/3}-2\\big]'}</Tex>,
    accent: ACCENT.emerald,
    note: <>תקף בין <Tex>{'b'}</Tex> ל-<Tex>{'a+b'}</Tex> (לפי סימן <Tex>{'a'}</Tex>).</>,
  },
  {
    kind: 'concept',
    prompt: 'הראו שנוסחת סכום-השורשים נותנת אותו דבר.',
    answer: (
      <>
        עם <Tex>{'g(x)=ax^3+b'}</Tex>, <Tex>{'g\'(x)=3ax^2'}</Tex>, ולכן{' '}
        <Tex>{'f_Y=\\dfrac{6x(1-x)}{|3ax^2|}=\\dfrac{2(1-x)}{|a|x}'}</Tex> עם <Tex>{'x=\\big(\\tfrac{y-b}{a}\\big)^{1/3}'}</Tex> — זהה.
      </>
    ),
  },
]

// ── תרגול 3 · שאלה 2 — convolution of exponentials ───────────────────────────
const q2Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את $F_Y(y)$ עבור $Y=X_1+X_2$.',
    tex: 'F_Y(y)=\\int_0^y\\!\\int_0^{y-x_2} 2e^{-x_1-2x_2}\\,dx_1\\,dx_2',
    res: <Tex>{'e^{-2y}-2e^{-y}+1'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'גזרו לקבלת $f_Y(y)$.',
    tex: 'f_Y(y)=\\tfrac{d}{dy}F_Y(y)',
    res: <Tex>{'2e^{-y}-2e^{-2y}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>עבור <Tex>{'y\\ge0'}</Tex>; זו הקונבולוציה של שתי המעריכיות (קצבים 1 ו-2).</>,
  },
]

// ── תרגול 3 · שאלה 3 — inverse-transform sampling ────────────────────────────
const q3Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את $F_Y^{-1}$ עבור $f_Y(y)=e^{1-y}$, $y\\ge1$.',
    tex: 'F_Y(y)=1-e^{1-y}\\;\\Rightarrow\\; u=1-e^{1-y}',
    res: <Tex>{'F_Y^{-1}(u)=1-\\ln(1-u)'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'בנו את הגנרטור המורכב מ-$X\\sim N(5,4)$.',
    tex: 'g(X)=F_Y^{-1}\\big(F_X(X)\\big),\\quad F_X(X)=\\tfrac12+\\tfrac12\\mathrm{erf}\\!\\big(\\tfrac{X-5}{2}\\big)',
    res: <Tex>{'1-\\ln\\!\\big(\\tfrac12-\\tfrac12\\mathrm{erf}(\\tfrac{X-5}{2})\\big)'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'למה $F_X(X)\\sim U[0,1]$?',
    answer: (
      <>
        טרנספורם אינטגרל ההסתברות (משפט 3.6): <Tex>{'\\Pr(F_X(X)\\le u)=\\Pr(X\\le F_X^{-1}(u))=F_X(F_X^{-1}(u))=u'}</Tex> —
        בדיוק ה-CDF של אחיד.
      </>
    ),
  },
]

// ── תרגול 3 · שאלה 4 — bivariate Jacobian ────────────────────────────────────
const q4Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את $g^{-1}$ עבור $g=(x_1+x_2,\\ x_1/(x_1+x_2))$.',
    tex: 'y_1=x_1+x_2,\\ y_2=\\tfrac{x_1}{x_1+x_2}',
    res: <Tex>{'g^{-1}=(y_1 y_2,\\ y_1(1-y_2))'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את הדטרמיננטה של היעקוביאן $J_{g^{-1}}$.',
    tex: 'J_{g^{-1}}=\\begin{pmatrix}y_2 & y_1\\\\ 1-y_2 & -y_1\\end{pmatrix}',
    res: <Tex>{'|\\det J_{g^{-1}}|=y_1'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את $f_Y$ (עם $f_X=e^{-x_1-x_2}$).',
    tex: 'f_Y=f_X(g^{-1})\\cdot|\\det J_{g^{-1}}|=e^{-y_1 y_2-y_1(1-y_2)}\\cdot y_1',
    res: <Tex>{'y_1 e^{-y_1}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>על <Tex>{'y_1>0,\\ 0<y_2<1'}</Tex>.</>,
  },
  {
    kind: 'concept',
    prompt: 'מהי השולית של $Y_2$?',
    answer: (
      <>
        <Tex>{'f_{Y_2}(y_2)=\\int_0^\\infty y_1 e^{-y_1}\\,dy_1=1'}</Tex> על <Tex>{'0<y_2<1'}</Tex> — כלומר{' '}
        <b><Tex>{'Y_2\\sim U(0,1)'}</Tex></b> (ובלתי-תלוי ב-<Tex>{'Y_1'}</Tex>).
      </>
    ),
  },
]

// ── ש.ב 3 · שאלה 2 — folded normal ───────────────────────────────────────────
const hwParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את $F_Y$ עבור $Y=|X|$, $X\\sim N(0,2)$.',
    tex: 'F_Y(y)=\\Pr(-y\\le X\\le y)',
    res: <Tex>{'\\mathrm{erf}(y/2)'}</Tex>,
    accent: ACCENT.sky,
    note: <>עבור <Tex>{'y>0'}</Tex> (ואפס אחרת).</>,
  },
  {
    kind: 'numeric',
    prompt: 'גזרו לקבלת $f_Y$.',
    tex: 'f_Y(y)=\\tfrac{d}{dy}\\,\\mathrm{erf}(y/2)',
    res: <Tex>{'\\tfrac{1}{\\sqrt{\\pi}}e^{-y^2/4}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>"נורמלי מקופל" (folded) — שני הצדדים של הגאוסי מקופלים לחיובי.</>,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (תרגול · ש.ב) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="תרגיל — טרנספורם חזקה Y=aX³+b" source="תרגול 3 · שאלה 1" parts={q1Parts} formulas={q1Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה <span dir="ltr"><Tex>{'f_X(x)=6x(1-x)'}</Tex></span> על <span dir="ltr"><Tex>{'0<x<1'}</Tex></span>, ו-<span dir="ltr"><Tex>{'Y=aX^3+b'}</Tex></span>. מצאו את <span dir="ltr"><Tex>{'f_Y'}</Tex></span> בשתי דרכים.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — קונבולוציה של מעריכיים" source="תרגול 3 · שאלה 2" parts={q2Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'f_{X_1,X_2}=2e^{-x_1-2x_2}'}</Tex></span> על <span dir="ltr"><Tex>{'x_1,x_2\\ge0'}</Tex></span>, ו-<span dir="ltr"><Tex>{'Y=X_1+X_2'}</Tex></span>. מצאו את <span dir="ltr"><Tex>{'f_Y'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — דגימה בטרנספורם ההפוך" source="תרגול 3 · שאלה 3" parts={q3Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          רוצים לייצר <span dir="ltr"><Tex>{'Y'}</Tex></span> עם <span dir="ltr"><Tex>{'f_Y(y)=e^{1-y}'}</Tex></span> (<span dir="ltr"><Tex>{'y\\ge1'}</Tex></span>) מתוך <span dir="ltr"><Tex>{'X\\sim N(5,4)'}</Tex></span>. בנו את הגנרטור.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — יעקוביאן דו-ממדי" source="תרגול 3 · שאלה 4" parts={q4Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'f_X=e^{-x_1-x_2}'}</Tex></span> על <span dir="ltr"><Tex>{'x_1,x_2>0'}</Tex></span>, ו-<span dir="ltr"><Tex>{'(Y_1,Y_2)=(x_1+x_2,\\ x_1/(x_1+x_2))'}</Tex></span>. מצאו את <span dir="ltr"><Tex>{'f_Y'}</Tex></span> ואת השולית של <span dir="ltr"><Tex>{'Y_2'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — ערך מוחלט של גאוסי (folded)" source="ש.ב 3 · שאלה 2" parts={hwParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X\\sim N(0,2)'}</Tex></span> ו-<span dir="ltr"><Tex>{'Y=|X|'}</Tex></span>. מצאו את ה-CDF והצפיפות של <span dir="ltr"><Tex>{'Y'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="איפה זה מופיע במבחנים">
        <div className="flex flex-col gap-3">
          <QA q="האם יש שאלת מבחן ייעודית על טרנספורם של משתנה?">
            לא ממש — במבחני הסוף הטרנספורמים מופיעים ככלי בתוך נושאים אחרים. למשל עובדת ה-<Tex>{'\\chi^2'}</Tex>:{' '}
            <Tex>{'\\|x\\|^2=\\sum Z_i^2'}</Tex> של רעש גאוסי מופיעה ב<b>מבחן 2025 מועד א׳</b> בהקשר של גילוי, ונוסחת סכום-השורשים
            מופיעה בדף הנוסחאות של <b>מבחן 2022 מועד ב׳</b>.
          </QA>
          <QA q="מתי משתמשים בסכום-על-השורשים לעומת יעקוביאן?">
            סכום-על-השורשים — לפונקציה <b>לא-הפיכה</b> של משתנה יחיד (כמה <Tex>{'x'}</Tex>-ים לאותו <Tex>{'y'}</Tex>). יעקוביאן —
            למעבר בין <b>וקטורים</b> (מספר משתנים יחד).
          </QA>
        </div>
      </Panel>
    </div>
  )
}
