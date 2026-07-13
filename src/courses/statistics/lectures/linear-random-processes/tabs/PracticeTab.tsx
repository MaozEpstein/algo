import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part, type TFormula } from '../../../components/practice'

/**
 * Lesson 12 — practice. The course finale, with real cited problems:
 *   • מבחן 2025 מועד א׳ — שאלה 3 (AR moments + MMSE filtering, flagship)
 *   • תרגול 12 · §3 (Kalman recursion)
 *   • תרגול 12 · §4 (ML for AR)
 *   • סיכום · דוגמה 48 (Wiener normal equations)
 */

const examFormulas: TFormula[] = [
  { name: 'גבול שונות AR', tex: 'R_S(0)=\\tfrac{\\sigma^2}{1-\\rho^2}' },
  { name: 'אוטו-קורלציה', tex: 'R_S(k)=\\rho^{|k|}R_S(0)' },
  { name: 'LMMSE', tex: '\\hat S=C_{SX}C_{XX}^{-1}X' },
]

const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את השונות ההתחלתית התואמת $\\sigma_0^2$ עבור $S[n]=\\rho S[n-1]+W[n]$ ($|\\rho|<1$).',
    tex: 'E[S[n]^2]=\\rho^2E[S[n-1]^2]+\\sigma^2\\ \\Rightarrow\\ R_S(0)=\\rho^2R_S(0)+\\sigma^2',
    res: <Tex>{'\\sigma_0^2=\\dfrac{\\sigma^2}{1-\\rho^2}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>מאתחלים ישר להתפלגות הסטציונרית ⇒ התהליך SSS מיד.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את האוטו-קורלציה $R_S[k]$.',
    tex: 'E[S[n]]=0,\\quad R_S[k]=\\rho R_S[k-1]',
    res: <Tex>{'R_S[k]=\\rho^{|k|}\\dfrac{\\sigma^2}{1-\\rho^2}'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MMSE של $S[n]$ מתוך $X[n+k]=S[n+k]+V[n+k]$.',
    tex: '\\hat S[n]=C_{S,X}C_{X,X}^{-1}X[n+k],\\ C_{S,X}=\\rho^{|k|}\\sigma_0^2,\\ C_{X,X}=\\sigma_0^2+\\sigma_V^2',
    res: <Tex>{'\\hat S[n]=\\dfrac{\\rho^{|k|}\\sigma_0^2}{\\sigma_0^2+\\sigma_V^2}\\,X[n+k]'}</Tex>,
    accent: ACCENT.sky,
    note: <>MMSE=LMMSE (גאוסי משותף, ממוצע אפס).</>,
  },
  {
    kind: 'concept',
    prompt: 'לאיזה $k$ האמד הטוב ביותר? והאם הוספת $X[n+k-1]$ עוזרת?',
    answer: (
      <>
        השגיאה יורדת עם <Tex>{'\\rho^{|k|}'}</Tex>, ולכן הטוב ביותר הוא <b><Tex>{'k=0'}</Tex></b> (המדידה הקרובה ביותר בזמן).
        הוספת <Tex>{'X[n+k-1]'}</Tex> <b>משפרת</b> — פותרים <Tex>{'\\hat S=C_{S\\underline X}C_{\\underline X\\underline X}^{-1}\\underline X'}</Tex> עם מטריצה 2×2.
      </>
    ),
  },
]

const kalmanParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'רשמו את שלב הניבוי עבור $S_n=aS_{n-1}+Q_n$, $X_n=S_n+R_n$.',
    tex: '\\hat S_{n|n-1}=E[S_n\\mid X_1..X_{n-1}]',
    res: <Tex>{'\\hat S_{n|n-1}=a\\hat S_{n-1|n-1},\\ \\ P_{n|n-1}=a^2P_{n-1|n-1}+\\sigma_Q^2'}</Tex>,
    accent: ACCENT.emerald,
    note: <>אי-הוודאות גדלה ברעש התהליך <Tex>{'\\sigma_Q^2'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'רשמו את שלב העדכון ואת רווח קלמן.',
    tex: 'C_{sx}=P_{n|n-1},\\ C_{xx}=P_{n|n-1}+\\sigma_R^2',
    res: <Tex>{'K_n=\\dfrac{P_{n|n-1}}{P_{n|n-1}+\\sigma_R^2},\\ \\hat S_{n|n}=\\hat S_{n|n-1}+K_n(X_n-\\hat S_{n|n-1})'}</Tex>,
    accent: ACCENT.violet,
    note: <><Tex>{'P_{n|n}=P_{n|n-1}(1-K_n)'}</Tex> — אי-הוודאות קטנה אחרי המדידה.</>,
  },
  {
    kind: 'concept',
    prompt: 'למה זהו בדיוק ה-LMMSE של שיעור 9?',
    answer: (
      <>
        העדכון הוא <Tex>{'\\hat S=\\mu+C_{sx}C_{xx}^{-1}(X-\\mu)'}</Tex> — הנוסחה האפינית של שיעור 9, עם <Tex>{'\\mu=\\hat S_{n|n-1}'}</Tex>.
        קלמן פשוט מפעיל אותה <b>רקורסיבית</b>, צעד אחר צעד.
      </>
    ),
  },
]

const mlParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-ML של $\\alpha$ עבור $X[n]=\\alpha X[n-1]+W[n]$, $W\\sim N(0,\\sigma^2)$.',
    tex: 'f=\\prod_i f(X[i]\\mid X[i-1]),\\ \\ f(X[i]\\mid X[i-1])=N(\\alpha X[i-1],\\sigma^2)',
    res: <Tex>{'\\hat\\alpha_{ML}=\\dfrac{\\sum_i X[i]X[i-1]}{\\sum_i X[i-1]^2}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>גזירת ה-log-likelihood לפי <Tex>{'\\alpha'}</Tex> — בדיוק ריבועים פחותים על הרגרסיה. <b>חסר-הטיה</b>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-ML של $\\sigma^2$.',
    tex: '\\partial_{\\sigma^2}LL=0',
    res: <Tex>{'\\hat\\sigma^2_{ML}=\\dfrac1n\\sum_{i=1}^n(X[i]-\\hat\\alpha_{ML}X[i-1])^2'}</Tex>,
    accent: ACCENT.sky,
    note: <>ממוצע ריבועי השאריות — <b>מוטה</b> (כמו ב-MLE הגאוסי בשיעור 6).</>,
  },
]

const wienerParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'רשמו את מסנן וינר לאמידת $X_k$ מתוך $Y_n=X_n+W_n$ ($n=1..N$).',
    tex: '\\mathrm{MSE}=E[X_k^2]-2h^\\top r_{XY}+h^\\top R_Y h,\\ \\ \\partial_h=0',
    res: <Tex>{'h=R_Y^{-1}r_{XY}'}</Tex>,
    accent: ACCENT.violet,
    note: <>המשוואות הנורמליות — כמו שיעור 7 ו-9.</>,
  },
  {
    kind: 'numeric',
    prompt: 'פרטו עבור כניסת AR: מהי $R_Y$?',
    tex: '(R_Y)_{ij}=R_X(i-j)+\\sigma_W^2\\delta_{ij},\\ \\ R_X(k)=\\tfrac{\\sigma_V^2}{1-\\alpha^2}\\alpha^{|k|}',
    res: <Tex>{'R_Y=R_X+\\sigma_W^2 I,\\ \\ h=(R_X+\\sigma_W^2 I)^{-1}r_{XY}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>הרעש הלבן על האלכסון = צורת Ridge שמייצבת את ההיפוך.</>,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (מבחן · תרגול · סיכום) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="שאלת מבחן — AR, אוטו-קורלציה ואמידה בזמן" source="מבחן 2025 מועד א׳ · שאלה 3" parts={examParts} formulas={examFormulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'S[n]=\\rho S[n-1]+W[n]'}</Tex></span>, <span dir="ltr"><Tex>{'|\\rho|<1'}</Tex></span>, ומדידה <span dir="ltr"><Tex>{'X[n]=S[n]+V[n]'}</Tex></span>.
          מצאו את השונות התואמת, האוטו-קורלציה, ואמד ה-MMSE של <span dir="ltr"><Tex>{'S[n]'}</Tex></span> מתוך <span dir="ltr"><Tex>{'X[n+k]'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — רקורסיית מסנן קלמן" source="תרגול 12 · §3" parts={kalmanParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          מודל מצב-מדידה (למשל GPS): <span dir="ltr"><Tex>{'S_n=aS_{n-1}+Q_n'}</Tex></span>, <span dir="ltr"><Tex>{'X_n=S_n+R_n'}</Tex></span>. גזרו את שלבי הניבוי והעדכון.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — ML עבור תהליך AR" source="תרגול 12 · §4" parts={mlParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתון <span dir="ltr"><Tex>{'X[n]=\\alpha X[n-1]+W[n]'}</Tex></span> עם רעש גאוסי. אמדו את <span dir="ltr"><Tex>{'\\alpha'}</Tex></span> ואת <span dir="ltr"><Tex>{'\\sigma^2'}</Tex></span> בשיטת הנראות המרבית.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — מסנן וינר" source="סיכום · דוגמה 48" parts={wienerParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          אות <span dir="ltr"><Tex>{'X'}</Tex></span> WSS נצפה ברעש לבן: <span dir="ltr"><Tex>{'Y_n=X_n+W_n'}</Tex></span>. מצאו את המסנן הלינארי האופטימלי לאמידת <span dir="ltr"><Tex>{'X_k'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="מה ההבדל בין מסנן וינר למסנן קלמן?">
            שניהם ה-LMMSE האופטימלי, אבל <b>וינר</b> עובד על <b>אצווה</b> קבועה של מדידות (היפוך מטריצה חד-פעמי), ו<b>קלמן</b>
            עושה זאת <b>רקורסיבית</b> — צעד אחר צעד, מתאים לזמן-אמת (GPS, מעקב).
          </QA>
          <QA q="למה כדאי לאתחל AR עם השונות התואמת?">
            כי אז התהליך <b>SSS מיד</b>, ללא "תקופת התחממות". <Tex>{'\\sigma_0^2=\\sigma^2/(1-\\rho^2)'}</Tex> הוא בדיוק השונות הסטציונרית.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
