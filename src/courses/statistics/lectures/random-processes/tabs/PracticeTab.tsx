import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 10 — practice. Every problem is a REAL course item with its citation:
 *   • מבחן 2022 מועד ג׳ — שאלה 3 (MA process: mean/autocorr/SSS/LMMSE/MMSE)
 *   • תרגול 11 — דוגמה 2 (e^{-At}), דוגמה 3 (X[n-1]+X[n])
 *   • ש.ב 11 — שאלות 1–4 (transformation stationarity, random cosine, MA/AR memory)
 */

const rpFormulas: TFormula[] = [
  { name: 'פונקציית התוחלת', tex: 'm_X(t)=E[X(t)]' },
  { name: 'אוטו-קורלציה', tex: 'R_X(t_1,t_2)=E[X(t_1)X(t_2)]' },
  { name: 'סטציונרי (WSS)', tex: 'm_X\\ \\text{const},\\ R_X(t_1,t_2)=r_X(t_2-t_1)' },
  { name: 'LMMSE (שיעור 9)', tex: '\\hat x=m_X+\\tfrac{r_X(1)}{r_X(0)}(x[n-1]-m_X)' },
]

const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את התוחלת של $x[n]=w[n]+w[n-1]$ ($w=\\pm1$ בהסת\' שווה).',
    tex: 'E[x[n]]=E[w[n]]+E[w[n-1]]',
    res: <Tex>{'E[x[n]]=0'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את האוטו-קורלציה $R_x(k)$.',
    tex: 'R_x(k)=E[(w[n]+w[n-1])(w[n+k]+w[n+k-1])],\\ R_w(0)=1',
    res: <Tex>{'R_x(k)=\\{2:k{=}0,\\ 1:|k|{=}1,\\ 0:\\text{else}\\}'}</Tex>,
    accent: ACCENT.sky,
    note: <>המכפלה מותירה רק איברים עם אינדקסים משותפים ב-<Tex>{'w'}</Tex>.</>,
  },
  {
    kind: 'concept',
    prompt: 'האם התהליך סטציונרי?',
    answer: (
      <>
        כן. התוחלת קבועה (0) והאוטו-קורלציה תלויה רק ב<b>הפרש</b> <Tex>{'k'}</Tex> — כי <Tex>{'w'}</Tex> הוא i.i.d (ולכן סטציונרי).
      </>
    ),
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-LMMSE של $x[n]$ מתוך $x[n-1]$.',
    tex: '\\hat x_{LMMSE}=E[x[n]]+\\tfrac{R_x(1)}{R_x(0)}(x[n-1]-E[x[n-1]])',
    res: <Tex>{'\\hat x_{LMMSE}=\\tfrac12\\,x[n-1]'}</Tex>,
    accent: ACCENT.violet,
    note: <><Tex>{'R_x(1)/R_x(0)=1/2'}</Tex> — קישור ישיר לשיעור 9.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-MMSE של $x[n]$ מתוך $x[n-1]$.',
    tex: '\\hat x_{MMSE}=E[x[n]\\mid x[n-1]]',
    res: <Tex>{'\\pm2\\to\\pm1,\\quad 0\\to 0'}</Tex>,
    accent: ACCENT.emerald,
    note: <>אם <Tex>{'x[n-1]=\\pm2'}</Tex> אז <Tex>{'w[n-2]'}</Tex> ידוע ⇒ אמד <Tex>{'\\pm1'}</Tex>; אם 0 — שני ערכים שקולים ⇒ 0. אמד <b>לא-לינארי</b>.</>,
  },
]

const expParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את פונקציית התוחלת של $X(t)=e^{-At}$, $A\\sim U(0,1)$.',
    tex: 'm_X(t)=E[e^{-At}]=\\int_0^1 e^{-at}\\,da',
    res: <Tex>{'m_X(t)=\\dfrac{1-e^{-t}}{t}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>הצפיפות: <Tex>{'f_{X(t)}(x)=1/(tx)'}</Tex> על <Tex>{'[e^{-t},1]'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את האוטו-קורלציה $R_X(t_1,t_2)$.',
    tex: 'R_X(t_1,t_2)=E[e^{-A(t_1+t_2)}]=\\int_0^1 e^{-a(t_1+t_2)}da',
    res: <Tex>{'R_X(t_1,t_2)=\\dfrac{1-e^{-(t_1+t_2)}}{t_1+t_2}'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'concept',
    prompt: 'האם $X(t)$ סטציונרי? ומה לגבי $Y(t)=-\\ln X(t)/t$?',
    answer: (
      <>
        <Tex>{'X(t)'}</Tex> <b>לא</b> סטציונרי — <Tex>{'m_X(t)'}</Tex> תלוי ב-<Tex>{'t'}</Tex>, ו-<Tex>{'R_X'}</Tex> תלוי ב-
        <Tex>{'t_1+t_2'}</Tex> ולא בהפרש. אבל <Tex>{'Y(t)=A'}</Tex> קבוע בזמן: <Tex>{'m_Y=\\tfrac12'}</Tex>, <Tex>{'R_Y=\\tfrac13'}</Tex> ⇒ <b>סטציונרי</b>.
      </>
    ),
  },
]

const sumParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'נתון $m_X=0$, $R_X=\\{2,1,0\\}$. חשבו $R_Y$ עבור $Y[n]=X[n-1]+X[n]$.',
    tex: 'R_Y=R_X(n_1{-}1,n_2{-}1)+R_X(n_1,n_2{-}1)+R_X(n_1{-}1,n_2)+R_X(n_1,n_2)',
    res: <Tex>{'R_Y=\\{6:0,\\ 4:1,\\ 1:2,\\ 0:\\text{else}\\}'}</Tex>,
    accent: ACCENT.violet,
    note: <><Tex>{'E[Y]=0'}</Tex>; תלוי רק בהפרש ⇒ <Tex>{'Y'}</Tex> סטציונרי.</>,
  },
  {
    kind: 'concept',
    prompt: 'למה לא ניתן לחשב את $R_Z$ עבור $Z[n]=X[n]^2$?',
    answer: (
      <>
        <Tex>{'E[Z[n]]=R_X(0)=2'}</Tex>, אבל <Tex>{'R_Z=E[X[n_1]^2 X[n_2]^2]'}</Tex> דורש מומנטים מ<b>סדר רביעי</b> — מידע
        שאינו כלול באוטו-קורלציה (סדר שני) בלבד.
      </>
    ),
  },
]

const hwParts: Part[] = [
  {
    kind: 'concept',
    prompt: '$X[n]$ סטציונרי. האם $Y[n]=X[an+b]$ סטציונרי? ומה לגבי $Y[n]=X[n^2]$?',
    answer: (
      <>
        <b><Tex>{'X[an+b]'}</Tex>:</b> כן — <Tex>{'R_Y=r_X(a(n_2-n_1))'}</Tex> תלוי רק בהפרש. <b><Tex>{'X[n^2]'}</Tex>:</b> לא —
        <Tex>{'R_Y=r_X((n_2-n_1)(n_1+n_2))'}</Tex> תלוי ב-<Tex>{'n_1+n_2'}</Tex>. <b><Tex>{'X[n]^2'}</Tex>:</b> לא ניתן לקבוע (סדר גבוה).
      </>
    ),
  },
  {
    kind: 'numeric',
    prompt: 'עבור $X(t)=A\\cos(\\omega t+\\Theta)$ ($A=\\pm1$, $\\Theta\\in\\{0,\\pi/2\\}$ שווה, בת"ל) — מצאו $R_X$.',
    tex: 'R_X=E[A^2]\\,E[\\cos(\\omega t_1+\\Theta)\\cos(\\omega t_2+\\Theta)],\\ E[A^2]=1',
    res: <Tex>{'R_X(t_1,t_2)=\\tfrac12\\cos(\\omega(t_1-t_2))'}</Tex>,
    accent: ACCENT.sky,
    note: <>האיבר <Tex>{'E[\\cos(\\omega t_1+\\omega t_2+2\\Theta)]=0'}</Tex> (מתאפס על פני <Tex>{'\\Theta'}</Tex>).</>,
  },
  {
    kind: 'concept',
    prompt: 'האם $X(t)$ סטציונרי במובן הצר?',
    answer: (
      <>
        <b>לא.</b> אמנם <Tex>{'m_X=0'}</Tex> ו-<Tex>{'R_X'}</Tex> תלוי בהפרש (סטציונרי במובן הרחב), אבל{' '}
        <Tex>{'E[X^4(t)]'}</Tex> <b>תלוי ב-t</b> — ולכן התהליך אינו SSS. סדר שני לא מספיק כדי לקבוע SSS.
      </>
    ),
  },
  {
    kind: 'concept',
    prompt: 'MA מול AR — מי בעל זיכרון סופי?',
    answer: (
      <>
        <b>MA</b> (<Tex>{'X[n]=w[n]+w[n-1]'}</Tex>): זיכרון <b>סופי</b> — <Tex>{'X[n]\\perp X[n-2]'}</Tex> (אין <Tex>{'w'}</Tex> משותף).
        <b> AR</b> (<Tex>{'Y[n]=aY[n-1]+w[n]'}</Tex>): זיכרון <b>אינסופי</b> — <Tex>{'Y[n]=\\sum_{k\\ge0}a^k w[n-k]'}</Tex>, תלוי בכל העבר.
      </>
    ),
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (מבחן · תרגול · ש.ב) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
          חלק מהשאלות משתמשות ב<b>אוטו-קורלציה</b> <span dir="ltr"><Tex>{'R_X(t_1,t_2)=E[X(t_1)X(t_2)]'}</Tex></span> — נפתח אותה לעומק בשיעור 11.
        </p>
      </Panel>

      <Problem titleHe="שאלת מבחן — תהליך MA: תוחלת, אוטו-קורלציה, אמידה" source="מבחן 2022 מועד ג׳ · שאלה 3" parts={examParts} formulas={rpFormulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'w[n]'}</Tex></span> i.i.d עם <span dir="ltr"><Tex>{'w=\\pm1'}</Tex></span> בהסתברות שווה, ו-
          <span dir="ltr"><Tex>{'x[n]=w[n]+w[n-1]'}</Tex></span>. חשבו תוחלת, אוטו-קורלציה, סטציונריות, ואמדי LMMSE/MMSE של{' '}
          <span dir="ltr"><Tex>{'x[n]'}</Tex></span> מ-<span dir="ltr"><Tex>{'x[n-1]'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — התהליך e^{-At}" source="תרגול 11 · דוגמה 2" parts={expParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X(t)=e^{-At}'}</Tex></span>, <span dir="ltr"><Tex>{'A\\sim U(0,1)'}</Tex></span>, <span dir="ltr"><Tex>{'t>0'}</Tex></span>.
          מצאו את פונקציית התוחלת, האוטו-קורלציה, וקבעו סטציונריות.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — סכום דגימות שכנות" source="תרגול 11 · דוגמה 3" parts={sumParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          תהליך עם <span dir="ltr"><Tex>{'m_X=0'}</Tex></span> ו-<span dir="ltr"><Tex>{'R_X(k)=\\{2,1,0\\}'}</Tex></span>. חשבו את המומנטים של{' '}
          <span dir="ltr"><Tex>{'Y[n]=X[n-1]+X[n]'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="שיעורי בית — סטציונריות של טרנספורמציות" source="ש.ב 11 · שאלות 1–4" parts={hwParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          קבעו סטציונריות של טרנספורמציות של תהליך סטציונרי, נתחו את הקוסינוס האקראי <span dir="ltr"><Tex>{'A\\cos(\\omega t+\\Theta)'}</Tex></span>,
          והשוו זיכרון של MA מול AR.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="למה תהליך המונה (counting) אינו i.i.d, למרות שהוא בנוי מ-i.i.d?">
            כי דגימות עוקבות <b>תלויות</b>: <Tex>{'X_n=X_{n-1}+W_n'}</Tex>. גם השולית משתנה — <Tex>{'\\mathrm{Var}(X_n)=np(1-p)'}</Tex> גדל עם n.
          </QA>
          <QA q="מה ההבדל בין SSS לסטציונריות אסימפטוטית?">
            <b>SSS</b> דורש שההתפלגות המשותפת תהיה <b>קבועה</b> תחת כל הזזה. <b>אסימפטוטית</b> דורש רק ש<b>תתכנס</b> כאשר
            <Tex>{'T\\to\\infty'}</Tex>. XOR עם <Tex>{'p\\ne\\tfrac12'}</Tex> הוא אסימפטוטי אך לא SSS.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
