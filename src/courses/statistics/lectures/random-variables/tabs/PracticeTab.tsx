import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 1 — practice. Every problem is a REAL course item, reproduced faithfully
 * with its source citation:
 *   • תרגול 1 שיטוס — שאלות 4, 6, 7
 *   • ש.ב 1 (פתרון תרגיל 1) — שאלה 2
 *   • מבחן 2023 מועד א׳ — שאלה 1 (החלק הרלוונטי לשיעור 1)
 */

// ── תרגול 1 · שאלה 4 ──────────────────────────────────────────────────────────
const q4Parts: Part[] = [
  {
    kind: 'concept',
    prompt: 'תארו את התחום שבו $|X-Y|\\le \\tfrac14$ בתוך ריבוע היחידה.',
    answer: (
      <>
        רצועה סביב האלכסון <Tex>{'y=x'}</Tex> ברוחב <Tex>{'\\pm\\tfrac14'}</Tex>. מה שנשאר <b>מחוץ</b> לרצועה הם שני
        משולשים ישרי-זווית בפינות (מעל ומתחת לאלכסון), שכל אחד עם ניצבים באורך <Tex>{'\\tfrac34'}</Tex>.
      </>
    ),
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $\\Pr\\!\\left(|X-Y|\\le \\tfrac14\\right)$.',
    tex: '\\Pr=1-2\\cdot\\tfrac12\\left(\\tfrac34\\right)^2',
    sub: '=1-\\left(\\tfrac34\\right)^2=1-\\tfrac{9}{16}',
    res: <Tex>{'7/16'}</Tex>,
    accent: ACCENT.emerald,
    note: (
      <>
        הצפיפות אחידה (<Tex>{'f_{XY}=1'}</Tex>) ולכן הסתברות = שטח. מפחיתים משטח הריבוע (1) את שני המשולשים שמחוץ
        לרצועה.
      </>
    ),
  },
]

// ── תרגול 1 · שאלה 6 ──────────────────────────────────────────────────────────
const q6Formulas: TFormula[] = [
  { name: 'שולית מהמשותפת', tex: 'f_X(x)=\\int f_{XY}(x,y)\\,dy' },
  { name: 'מותנית', tex: 'f_{Y\\mid X}(y\\mid x)=f_{XY}(x,y)/f_X(x)' },
]
const q6Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את השולית $f_X(x)$.',
    tex: 'f_X(x)=\\frac1\\pi\\int_{-\\sqrt{1-x^2}}^{\\sqrt{1-x^2}}dy',
    res: <Tex>{'\\tfrac{2\\sqrt{1-x^2}}{\\pi}'}</Tex>,
    accent: ACCENT.sky,
    note: <>תקף ל-<Tex>{'|x|<1'}</Tex>, ואפס אחרת. שימו לב שאין לזה צורת מלבן — סימן ראשון לתלות.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו $\\Pr(X^2+Y^2\\le \\tfrac12)$.',
    tex: '\\Pr=\\frac1\\pi\\cdot(\\text{שטח עיגול ברדיוס }1/\\sqrt2)',
    sub: '=\\frac1\\pi\\cdot\\frac\\pi2',
    res: <Tex>{'1/2'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'מצאו את המותנית $f_{Y\\mid X}(y\\mid x)$.',
    answer: (
      <>
        <Tex>{'f_{Y\\mid X}=\\dfrac{f_{XY}}{f_X}=\\dfrac{1/\\pi}{2\\sqrt{1-x^2}/\\pi}=\\dfrac{1}{2\\sqrt{1-x^2}}'}</Tex>{' '}
        על <Tex>{'-\\sqrt{1-x^2}<y<\\sqrt{1-x^2}'}</Tex> — כלומר <b><Tex>{'Y\\mid X=x\\sim U(-\\sqrt{1-x^2},\\sqrt{1-x^2})'}</Tex></b>.
        התחום תלוי ב-<Tex>{'x'}</Tex> ⇐ המשתנים תלויים.
      </>
    ),
  },
]

// ── תרגול 1 · שאלה 7 ──────────────────────────────────────────────────────────
const q7Parts: Part[] = [
  {
    kind: 'concept',
    prompt: 'למה ל-$F_Y$ צפויה מדרגה (קפיצה)?',
    answer: (
      <>
        כי <Tex>{'X_2'}</Tex> <b>בדיד</b>: בהסתברות <Tex>{'\\tfrac23'}</Tex> הוא 0 ובהסתברות <Tex>{'\\tfrac13'}</Tex> הוא
        1. הרכיב הבדיד מוסיף "משקל" נקודתי שגורם לקפיצה ב-<Tex>{'F_Y'}</Tex>.
      </>
    ),
  },
  {
    kind: 'numeric',
    prompt: 'כתבו את $F_Y(t)$ בקטעים $0\\le t\\le1$ ו-$1<t\\le2$.',
    tex: 'F_Y(t)=\\Pr(X_2{=}0)\\Pr(X_1\\le t)+\\Pr(X_2{=}1)\\Pr(X_1\\le t{-}1)',
    res: <Tex>{'\\tfrac23 t\\;;\\;\\; \\tfrac{t+1}{3}'}</Tex>,
    accent: ACCENT.amber,
    note: (
      <>
        הצפיפות היוצאת: <Tex>{'f_Y=\\tfrac23'}</Tex> על <Tex>{'(0,1]'}</Tex> ו-<Tex>{'\\tfrac13'}</Tex> על{' '}
        <Tex>{'(1,2]'}</Tex> — תערובת של רציף (מ-<Tex>{'X_1'}</Tex>) ובדיד (מ-<Tex>{'X_2'}</Tex>).
      </>
    ),
  },
]

// ── ש.ב 1 · שאלה 2 ────────────────────────────────────────────────────────────
const hw2Formulas: TFormula[] = [
  { name: 'הצפיפות הנתונה', tex: 'f_{XY}(x,y)=\\tfrac1y e^{-y-x/y},\\;\\; x,y>0' },
  { name: 'שולית', tex: 'f_Y(y)=\\int_0^\\infty f_{XY}\\,dx' },
]
const hw2Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את השולית $f_Y(y)$.',
    tex: 'f_Y(y)=\\int_0^\\infty \\tfrac1y e^{-y-x/y}\\,dx',
    sub: '=e^{-y}\\int_0^\\infty \\tfrac1y e^{-x/y}\\,dx=e^{-y}\\cdot 1',
    res: <Tex>{'e^{-y}'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'הראו ש-$X\\mid Y=y \\sim \\mathrm{Exp}(1/y)$.',
    tex: 'f_{X\\mid Y}(x\\mid y)=\\dfrac{f_{XY}}{f_Y}=\\dfrac{\\tfrac1y e^{-y-x/y}}{e^{-y}}',
    res: <Tex>{'\\tfrac1y e^{-x/y}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>זו בדיוק צפיפות מעריכית עם קצב <Tex>{'1/y'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו $\\Pr(X>1\\mid Y=y)$.',
    tex: '\\Pr(X>1\\mid Y{=}y)=\\int_1^\\infty \\tfrac1y e^{-x/y}\\,dx',
    res: <Tex>{'e^{-1/y}'}</Tex>,
    accent: ACCENT.emerald,
  },
]

// ── מבחן 2023 מועד א׳ · שאלה 1 (החלק של שיעור 1) ──────────────────────────────
const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את $\\mathbb{E}[X\\mid Y=y]$.',
    tex: 'X\\mid Y=y\\sim U(-y,y)\\;\\Rightarrow\\; \\mathbb{E}[X\\mid Y{=}y]=\\tfrac{-y+y}{2}',
    res: <Tex>{'0'}</Tex>,
    accent: ACCENT.emerald,
    note: <>תוחלת של אחיד סימטרי סביב 0.</>,
  },
  {
    kind: 'numeric',
    prompt: 'בנו את המותנית ההפוכה $f_{Y\\mid X}(y\\mid x)$ בעזרת בייס.',
    tex: 'f_{Y\\mid X}=\\dfrac{f_{X\\mid Y}(x\\mid y)f_Y(y)}{\\int_{|x|}^{A} f_{X\\mid Y}(x\\mid \\hat y)f_Y(\\hat y)\\,d\\hat y}',
    sub: '\\int_{|x|}^{A}\\tfrac{1}{2\\hat y}\\,d\\hat y=\\tfrac12\\ln\\tfrac{A}{|x|}',
    res: <Tex>{'\\dfrac{1}{y\\,\\ln(A/|x|)}'}</Tex>,
    accent: ACCENT.amber,
    note: <>תקף על <Tex>{'|x|\\le y\\le A'}</Tex>. (המשך השאלה — אמידת MMSE — שייך לשיעורים הבאים.)</>,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות כאן <b>נלקחו מחומרי הקורס עצמם</b> (תרגול · ש.ב · מבחן) — התגית הכחולה מציינת את המקור המדויק.
          נסו לפתור כל סעיף לבד, ורק אז «פתרון» כדי להשוות.
        </p>
      </Panel>

      <Problem
        titleHe="תרגיל — הסתברות של רצועה (גאומטרי)"
        source="תרגול 1 · שאלה 4"
        parts={q4Parts}
      >
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X,Y\\sim U([0,1])'}</Tex></span> בלתי-תלויים (צפיפות משותפת{' '}
          <span dir="ltr"><Tex>{'f_{XY}=1'}</Tex></span> על ריבוע היחידה). חשבו את{' '}
          <span dir="ltr"><Tex>{'\\Pr(|X-Y|\\le \\tfrac14)'}</Tex></span>.
        </p>
      </Problem>

      <Problem
        titleHe="תרגיל — אחיד על עיגול היחידה"
        source="תרגול 1 · שאלה 6"
        parts={q6Parts}
        formulas={q6Formulas}
      >
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה צפיפות משותפת אחידה על עיגול היחידה:{' '}
          <span dir="ltr"><Tex>{'f_{XY}(x,y)=\\tfrac1\\pi'}</Tex></span> עבור{' '}
          <span dir="ltr"><Tex>{'x^2+y^2<1'}</Tex></span> (ואפס אחרת). מצאו את השולית, הסתברות של תת-עיגול, והמותנית.
        </p>
      </Problem>

      <Problem
        titleHe="תרגיל — סכום של רציף ובדיד"
        source="תרגול 1 · שאלה 7"
        parts={q7Parts}
      >
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X_1\\sim U([0,1])'}</Tex></span> ו-<span dir="ltr"><Tex>{'X_2\\sim \\mathrm{Ber}(\\tfrac13)'}</Tex></span>{' '}
          בלתי-תלויים, <span dir="ltr"><Tex>{'Y=X_1+X_2'}</Tex></span>. מצאו את{' '}
          <span dir="ltr"><Tex>{'F_Y(t)'}</Tex></span>.
        </p>
      </Problem>

      <Problem
        titleHe="תרגיל — התניה וחישוב הסתברות"
        source="ש.ב 1 · שאלה 2"
        parts={hw2Parts}
        formulas={hw2Formulas}
      >
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה צפיפות משותפת{' '}
          <span dir="ltr"><Tex>{'f_{XY}(x,y)=\\tfrac1y e^{-y-x/y}'}</Tex></span> עבור{' '}
          <span dir="ltr"><Tex>{'x,y>0'}</Tex></span>. חשבו את{' '}
          <span dir="ltr"><Tex>{'\\Pr(X>1\\mid Y=y)'}</Tex></span>.
        </p>
      </Problem>

      <Problem
        titleHe="שאלת מבחן — בניית מותנית עם בייס"
        source="מבחן 2023 מועד א׳ · שאלה 1"
        parts={examParts}
      >
        <p className="mt-2 leading-relaxed text-slate-700">
          יהי <span dir="ltr"><Tex>{'A>0'}</Tex></span> קבוע, <span dir="ltr"><Tex>{'Y\\sim U(0,A)'}</Tex></span>, ובהינתן{' '}
          <span dir="ltr"><Tex>{'Y'}</Tex></span> מתקיים <span dir="ltr"><Tex>{'X\\mid Y\\sim U(-Y,Y)'}</Tex></span>. בנו את
          ההתפלגויות המותנות משני הכיוונים.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · האם צפיפות $f_X(x)$ יכולה להיות גדולה מ-1?">
            כן. רק <b>השטח</b> חייב להיות 1. לדוגמה <Tex>{'U(0,\\tfrac12)'}</Tex> נותן <Tex>{'f_X=2'}</Tex>.
          </QA>
          <QA q="2 · איך מקבלים שולית מתוך צפיפות משותפת?">
            <b>אינטגרציה</b> על המשתנה השני: <Tex>{'f_X(x)=\\int f_{XY}(x,y)\\,dy'}</Tex> — "שוכחים" את <Tex>{'Y'}</Tex>.
          </QA>
          <QA q="3 · מתי $X,Y$ בלתי-תלויים?">
            כאשר <Tex>{'f_{XY}(x,y)=f_X(x)f_Y(y)'}</Tex> (שקול ל-<Tex>{'f_{X\\mid Y}=f_X'}</Tex>). אם תחום ההגדרה
            "מקשר" בין המשתנים (כמו <Tex>{'0<x<y<1'}</Tex> או עיגול) — הם <b>תלויים</b>.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
