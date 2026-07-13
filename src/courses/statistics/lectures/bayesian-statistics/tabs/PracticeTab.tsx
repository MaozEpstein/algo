import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part } from '../../../components/practice'

/**
 * Lesson 8 — practice. Every problem is a REAL course item with its citation:
 *   • מבחן 2022 מועד א׳ — שאלה 1 (Bernoulli ML/MAP/MMSE)
 *   • תרגול 9 — שאלה 5 (Gaussian thermometer), שאלה 8 (log-uniform MMSE)
 *   • תרגול 10 — sign(x) MAP for Y∈{±1}
 */

const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'כתבו את הנראות עבור $x_i\\in\\{0,1\\}$, $\\Pr(x_i{=}1)=p$.',
    tex: 'P(x;p)=\\prod_i p^{x_i}(1-p)^{1-x_i}',
    res: <Tex>{'p^{n_1}(1-p)^{n_0}'}</Tex>,
    accent: ACCENT.sky,
    note: <><Tex>{'n_1'}</Tex> = מספר האחדות, <Tex>{'n_0=n-n_1'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-ML.',
    tex: '\\partial_p[n_1\\log p+n_0\\log(1-p)]=0',
    res: <Tex>{'\\hat p_{ML}=n_1/n'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'עם prior אחיד $p\\sim U[0,1]$ — מהו ה-MAP?',
    tex: 'f(p\\mid x)=\\tfrac{p^{n_1}(1-p)^{n_0}}{\\int_0^1 p^{n_1}(1-p)^{n_0}dp}',
    res: <Tex>{'\\hat p_{MAP}=n_1/n=\\hat p_{ML}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>prior אחיד ⇒ ה-posterior פרופורציוני לנראות ⇒ MAP=ML.</>,
  },
  {
    kind: 'numeric',
    prompt: 'למקרה "הכל אחדות" ($n_1=n$) — מהו ה-MMSE?',
    tex: 'E[p\\mid x]=\\tfrac{\\int_0^1 p\\cdot p^{n}dp}{\\int_0^1 p^{n}dp}=\\tfrac{1/(n+2)}{1/(n+1)}',
    res: <Tex>{'(n+1)/(n+2)'}</Tex>,
    accent: ACCENT.emerald,
    note: <>כלל לפלס / posterior מסוג בטא. בכללי: <Tex>{'(n_1+1)/(n+2)'}</Tex>.</>,
  },
]

const thermParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MMSE של $Y$ בהינתן $X$ ($Y\\sim N(\\mu_y,\\sigma_y^2)$, $X=Y+W$).',
    tex: '\\hat Y=\\mu_y+C_{yx}C_{xx}^{-1}(X-\\mu_x),\\ C_{xx}=\\sigma_y^2+\\sigma_w^2',
    res: <Tex>{'\\hat Y_{MMSE}=\\tfrac{\\sigma_y^2}{\\sigma_y^2+\\sigma_w^2}X+\\tfrac{\\sigma_w^2}{\\sigma_y^2+\\sigma_w^2}\\mu_y'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את ה-MSE הבייסיאני.',
    tex: '\\mathrm{MSE}=E_X[\\mathrm{Var}(Y\\mid X)]=C_{yy}-C_{yx}C_{xx}^{-1}C_{xy}',
    res: <Tex>{'\\sigma_y^2\\sigma_w^2/(\\sigma_y^2+\\sigma_w^2)'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'למה כאן MAP=MMSE?',
    answer: (
      <>
        כי ה-posterior <Tex>{'Y\\mid X'}</Tex> הוא <b>גאוסי</b> — סימטרי וחד-שיאי, אז השיא (MAP) והתוחלת (MMSE) מתלכדים.
      </>
    ),
  },
]

const signParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MAP של $Y\\in\\{\\pm1\\}$ בהינתן $X=Y+W$ (prior שווה).',
    tex: '\\arg\\max_{y\\in\\pm1}-\\tfrac{(x-y)^2}{2\\sigma^2}=\\arg\\min_{y\\in\\pm1}|x-y|',
    res: <Tex>{'\\hat Y_{MAP}=\\mathrm{sign}(X)'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'מהו ה-MMSE, ובמה הוא נבדל?',
    answer: (
      <>
        <Tex>{'\\hat Y_{MMSE}=E[Y\\mid X]=\\tanh(X/\\sigma^2)'}</Tex> — החלטה <b>רכה</b> (ערך בין −1 ל-1), בעוד ה-MAP נותן <b>קשה</b>{' '}
        <Tex>{'\\pm1'}</Tex>. (ה-BLE/LMMSE ייתן קו לינארי — נראה בשיעור 9.)
      </>
    ),
  },
]

const uniParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את ה-MMSE כאשר $f_{Y\\mid X}(y\\mid x)=\\tfrac{1}{y\\,\\ln(a/x)}$ על $[x,a]$.',
    tex: '\\hat Y_{MMSE}=\\int_x^a y\\cdot\\tfrac{1}{y\\ln(a/x)}\\,dy',
    res: <Tex>{'\\hat Y_{MMSE}=\\dfrac{a-x}{\\ln(a/x)}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>התוחלת המותנית של ה-posterior הלוג-אחיד.</>,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (מבחן · תרגול) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="שאלת מבחן — ML, MAP ו-MMSE של ברנולי" source="מבחן 2022 מועד א׳ · שאלה 1" parts={examParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          רצף הטלות <span dir="ltr"><Tex>{'x=\\{x_1,\\dots,x_n\\}'}</Tex></span>, <span dir="ltr"><Tex>{'x_i\\sim\\mathrm{Ber}(p)'}</Tex></span>. מצאו את ה-ML, ה-MAP (prior אחיד), וה-MMSE.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — מדחום גאוסי רועש" source="תרגול 9 · שאלה 5" parts={thermParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'Y\\sim N(\\mu_y,\\sigma_y^2)'}</Tex></span> (prior), ומדידה <span dir="ltr"><Tex>{'X=Y+W'}</Tex></span> עם <span dir="ltr"><Tex>{'W\\sim N(0,\\sigma_w^2)'}</Tex></span>. אמדו את <span dir="ltr"><Tex>{'Y'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — sign(x) בערוץ ±1" source="תרגול 10 · אות בינארי" parts={signParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'Y\\in\\{\\pm1\\}'}</Tex></span> בהסתברות שווה, <span dir="ltr"><Tex>{'X=Y+W'}</Tex></span>, <span dir="ltr"><Tex>{'W\\sim N(0,\\sigma^2)'}</Tex></span>. מצאו את ה-MAP וה-MMSE.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — MMSE עם posterior לוג-אחיד" source="תרגול 9 · שאלה 8" parts={uniParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתון ה-posterior <span dir="ltr"><Tex>{'f_{Y\\mid X}(y\\mid x)=\\tfrac{1}{y\\ln(a/x)}'}</Tex></span> על <span dir="ltr"><Tex>{'[x,a]'}</Tex></span>. מצאו את ה-MMSE.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="למה MAP תמיד מחזיר ערך חוקי של θ, ו-MMSE לא בהכרח?">
            כי MAP <b>בוחר</b> ערך מהתחום של <Tex>{'\\theta'}</Tex> (שיא ה-posterior), בעוד MMSE <b>ממצע</b> — והממוצע יכול ליפול בין
            הערכים (למשל ממוצע של <Tex>{'\\pm1'}</Tex> הוא ערך רך שאינו ±1).
          </QA>
          <QA q="למה ה-MMSE הגאוסי הוא ממוצע משוקלל?">
            כי ה-posterior גאוסי, ותוחלתו יוצאת שילוב לינארי של ה-prior והנתונים. המשקל נקבע מיחס אי-הוודאויות: פחות רעש
            במדידה → משקל גדול יותר לנתונים.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
