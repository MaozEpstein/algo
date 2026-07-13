import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part } from '../../../components/practice'

/**
 * Lesson 9 — practice. Every problem is a REAL course item with its citation:
 *   • מבחן 2023 מועד א׳ — שאלה 1 (nested uniform, MMSE vs LMMSE both directions)
 *   • תרגול 10 — שאלה 3 (cubic Y=X³), שאלה 5 (signal+noise ±1, BLE/MAP/MMSE)
 *   • ש.ב 10 — שאלה 2 (vector X=HY+w, LMMSE → ML)
 */

const nestedParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MMSE של $X$ בהינתן $Y=y$ ($X\\mid Y{=}y\\sim U(-y,y)$).',
    tex: '\\hat X_{MMSE}(y)=E[X\\mid Y=y]=\\tfrac{-y+y}{2}',
    res: <Tex>{'\\hat X_{MMSE}(y)=0'}</Tex>,
    accent: ACCENT.emerald,
    note: <>ההתפלגות המותנית סימטרית סביב 0.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מהו ה-LMMSE של $X$ בהינתן $Y$?',
    tex: '\\hat X_{MMSE}=0\\ \\text{קבוע} \\Rightarrow \\hat X_{LMMSE}=\\hat X_{MMSE}',
    res: <Tex>{'\\hat X_{LMMSE}(y)=0'}</Tex>,
    accent: ACCENT.emerald,
    note: <>כשה-MMSE כבר קבוע, אין מה לשפר — הלינארי מתלכד איתו.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MMSE של $Y$ בהינתן $X=x$.',
    tex: '\\hat Y_{MMSE}(x)=\\int_{|x|}^{A} y\\cdot\\tfrac{1}{y(\\ln A-\\ln|x|)}\\,dy',
    res: <Tex>{'\\hat Y_{MMSE}(x)=\\dfrac{A-|x|}{\\ln A-\\ln|x|}'}</Tex>,
    accent: ACCENT.sky,
    note: <>ה-posterior של <Tex>{'Y\\mid X'}</Tex> הוא לוג-אחיד על <Tex>{'[|x|,A]'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-LMMSE של $Y$ בהינתן $X$, והשוו.',
    tex: '\\mathrm{Cov}(X,Y)=E[XY]=E_Y\\big[Y\\,E[X\\mid Y]\\big]=0',
    res: <Tex>{'\\hat Y_{LMMSE}(x)=\\mu_Y=A/2'}</Tex>,
    accent: ACCENT.rose,
    note: <>מכיוון ש-<Tex>{'\\mathrm{Cov}(X,Y)=0'}</Tex>, ה-LMMSE קורס לתוחלת המוקדמת — בעוד ה-MMSE עדיין תלוי ב-<Tex>{'x'}</Tex>. זה הלב של השאלה.</>,
  },
]

const cubicParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MMSE של $Y$ מתוך $X$ ($X\\sim N(0,\\sigma^2)$, $Y=X^3$).',
    tex: '\\hat Y_{MMSE}(x)=E[X^3\\mid X=x]',
    res: <Tex>{'\\hat Y_{MMSE}(x)=x^3'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-BLE של $Y$ מתוך $X$.',
    tex: '\\sigma_{XY}=E[X\\cdot X^3]=E[X^4]=3\\sigma^4,\\ \\ \\hat Y_{BLE}=\\tfrac{\\sigma_{XY}}{\\sigma_X^2}x',
    res: <Tex>{'\\hat Y_{BLE}(x)=3\\sigma^2 x'}</Tex>,
    accent: ACCENT.violet,
    note: <>קו ישר לעומת העקומה <Tex>{'x^3'}</Tex> — לא גאוסי משותף, ולכן <Tex>{'\\text{BLE}\\ne\\text{MMSE}'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-BLE של $X$ מתוך $Y$ (הכיוון ההפוך).',
    tex: '\\sigma_Y^2=E[X^6]=15\\sigma^6,\\ \\ \\hat X_{BLE}=\\tfrac{\\sigma_{XY}}{\\sigma_Y^2}y=\\tfrac{3\\sigma^4}{15\\sigma^6}y',
    res: <Tex>{'\\hat X_{BLE}(y)=\\dfrac{y}{5\\sigma^2}'}</Tex>,
    accent: ACCENT.violet,
    note: <>משתמשים ב-<Tex>{'E[X^{2m}]=(2m-1)!!\\,\\sigma^{2m}'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את שתי שגיאות ה-BLE.',
    tex: '\\mathrm{MSE}=\\sigma_{\\text{target}}^2-\\sigma_{XY}^2/\\sigma_{\\text{data}}^2',
    res: <Tex>{'\\mathrm{MSE}(\\hat Y_{BLE})=6\\sigma^6,\\ \\ \\mathrm{MSE}(\\hat X_{BLE})=\\tfrac{2}{5}\\sigma^2'}</Tex>,
    accent: ACCENT.emerald,
    note: <><Tex>{'15\\sigma^6-9\\sigma^8/\\sigma^2=6\\sigma^6'}</Tex>; <Tex>{'\\sigma^2-9\\sigma^8/15\\sigma^6=\\tfrac{2}{5}\\sigma^2'}</Tex>.</>,
  },
]

const signalParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-BLE של $Y\\in\\{\\pm1\\}$ מתוך $X=Y+W$, ואת שגיאתו.',
    tex: '\\mathrm{Var}(Y)=1,\\ \\mathrm{Var}(X)=1+\\sigma^2,\\ \\mathrm{Cov}=1',
    res: <Tex>{'\\hat Y_{BLE}=\\tfrac{X}{1+\\sigma^2},\\ \\ \\mathrm{MSE}=\\tfrac{\\sigma^2}{1+\\sigma^2}'}</Tex>,
    accent: ACCENT.violet,
  },
  {
    kind: 'concept',
    prompt: 'מהם ה-MAP וה-MMSE, ובמה הם נבדלים מה-BLE?',
    answer: (
      <>
        <Tex>{'\\hat Y_{MAP}=\\mathrm{sign}(X)'}</Tex> (החלטה קשה), ו-<Tex>{'\\hat Y_{MMSE}=E[Y\\mid X]=\\tanh(X/\\sigma^2)'}</Tex>{' '}
        (סיגמואיד רך). ה-BLE הוא <b>קו ישר</b> — קירוב לינארי ל-<Tex>{'\\tanh'}</Tex>. שלושתם נבדלים כי הנתונים אינם גאוסיים משותפים.
      </>
    ),
  },
]

const vectorParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'רשמו את ה-LMMSE של $Y$ במודל $X=HY+w$ ($E[Y]{=}0$, $C_Y{=}\\sigma_Y^2 I$, $w\\sim N(0,\\sigma_w^2 I)$).',
    tex: 'C_{YX}=\\sigma_Y^2 H^\\top,\\ \\ C_{XX}=\\sigma_Y^2 HH^\\top+\\sigma_w^2 I',
    res: <Tex>{'\\hat Y_{LMMSE}=\\sigma_Y^2 H^\\top(\\sigma_Y^2 HH^\\top+\\sigma_w^2 I)^{-1}X'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'הפעילו את זהות הדחיפה (push-through) לצורה השקולה.',
    tex: '(\\sigma H^\\top H+\\lambda I)^{-1}H^\\top=H^\\top(\\sigma HH^\\top+\\lambda I)^{-1}',
    res: <Tex>{'\\hat Y_{LMMSE}=\\big(H^\\top H+\\tfrac{\\sigma_w^2}{\\sigma_Y^2}I\\big)^{-1}H^\\top X'}</Tex>,
    accent: ACCENT.sky,
    note: <>זו בדיוק צורת ה-<b>Ridge</b> משיעור 7, עם <Tex>{'\\lambda=\\sigma_w^2/\\sigma_Y^2'}</Tex>.</>,
  },
  {
    kind: 'concept',
    prompt: 'לאן שואף ה-LMMSE כאשר ה-prior נחלש?',
    answer: (
      <>
        כאשר <Tex>{'\\sigma_w^2/\\sigma_Y^2\\to0'}</Tex> (prior רחב), המחובר <Tex>{'\\lambda I'}</Tex> נעלם וה-LMMSE מתלכד עם
        אמד ה-<b>נראות המרבית</b> <Tex>{'\\hat Y_{ML}=(H^\\top H)^{-1}H^\\top X'}</Tex> — גשר יפה בין בייס לריבועים פחותים.
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
        </p>
      </Panel>

      <Problem titleHe="שאלת מבחן — MMSE מול LMMSE בשני הכיוונים" source="מבחן 2023 מועד א׳ · שאלה 1" parts={nestedParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'Y\\sim U(0,A)'}</Tex></span>, ובהינתן <span dir="ltr"><Tex>{'Y'}</Tex></span> מתקיים{' '}
          <span dir="ltr"><Tex>{'X\\mid Y\\sim U(-Y,Y)'}</Tex></span>. מצאו את ה-MMSE וה-LMMSE של <span dir="ltr"><Tex>{'X'}</Tex></span> מ-
          <span dir="ltr"><Tex>{'Y'}</Tex></span>, ואת ה-MMSE וה-LMMSE של <span dir="ltr"><Tex>{'Y'}</Tex></span> מ-<span dir="ltr"><Tex>{'X'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — הקוביה Y = X³" source="תרגול 10 · שאלה 3" parts={cubicParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X\\sim N(0,\\sigma^2)'}</Tex></span>, <span dir="ltr"><Tex>{'Y=X^3'}</Tex></span>. מצאו MMSE ו-BLE בשני הכיוונים, ואת השגיאות.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — אות בינארי ברעש: BLE, MAP ו-MMSE" source="תרגול 10 · שאלה 5" parts={signalParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'Y\\in\\{\\pm1\\}'}</Tex></span> בהסתברות שווה, <span dir="ltr"><Tex>{'X=Y+W'}</Tex></span>,{' '}
          <span dir="ltr"><Tex>{'W\\sim N(0,\\sigma^2)'}</Tex></span>. מצאו את שלושת האמדים.
        </p>
      </Problem>

      <Problem titleHe="שיעורי בית — LMMSE וקטורי והקשר ל-ML" source="ש.ב 10 · שאלה 2" parts={vectorParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X=HY+w'}</Tex></span> עם <span dir="ltr"><Tex>{'w\\sim N(0,\\sigma_w^2 I)'}</Tex></span> ו-prior{' '}
          <span dir="ltr"><Tex>{'C_Y=\\sigma_Y^2 I'}</Tex></span>. מצאו את ה-LMMSE, פשטו, וגלו את הקשר ל-ML.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="מתי LMMSE שווה בדיוק ל-MMSE?">
            כאשר <Tex>{'x,y'}</Tex> <b>גאוסיים משותפים</b> (משפט 9.2), או כאשר ה-MMSE ממילא יוצא לינארי/קבוע. אחרת ה-LMMSE
            הוא רק הקירוב הלינארי הטוב ביותר.
          </QA>
          <QA q="למה כש-Cov(X,Y)=0 ה-LMMSE מחזיר את התוחלת המוקדמת?">
            כי הנוסחה <Tex>{'\\hat x=\\mu_x+\\tfrac{\\sigma_{xy}}{\\sigma_y^2}(y-\\mu_y)'}</Tex> מאבדת את האיבר התלוי ב-<Tex>{'y'}</Tex>.
            <b> חשוב:</b> אי-מתאם לא אומר אי-תלות — ולכן ה-MMSE עדיין יכול לנצל את <Tex>{'x'}</Tex> (כמו בשאלת המבחן).
          </QA>
        </div>
      </Panel>
    </div>
  )
}
