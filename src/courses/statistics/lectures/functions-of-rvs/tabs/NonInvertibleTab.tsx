import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import DefinitionCard from '../../../components/DefinitionCard'

const chiProof: ComplexityProof = {
  result: 'f_Y(y)=\\tfrac{1}{\\sqrt{2\\pi y}}\\,e^{-y/2}',
  claimHe: 'ריבוע של נורמלי סטנדרטי מתפלג χ² עם k=1.',
  steps: [
    { he: 'שני שורשים ±√y נותנים אותו y, אז מתחילים מה-CDF:', tex: 'F_Y(y)=\\Pr(-\\sqrt y\\le X\\le \\sqrt y)=F_X(\\sqrt y)-F_X(-\\sqrt y)' },
    { he: 'גוזרים — כל שורש תורם גורם 1/(2√y):', tex: 'f_Y(y)=\\tfrac{1}{2\\sqrt y}\\big(f_X(\\sqrt y)+f_X(-\\sqrt y)\\big)' },
    { he: 'מציבים נורמלי סטנדרטי (זוגי, אז שתי התרומות שוות):', tex: '=\\tfrac{1}{2\\sqrt y}\\cdot\\tfrac{2}{\\sqrt{2\\pi}}e^{-y/2}=\\tfrac{1}{\\sqrt{2\\pi y}}e^{-y/2}' },
  ],
  intuitionHe: 'כל y>0 מגיע משני x-ים ולכן סוכמים שתי תרומות; הגורם 1/(2√y) הוא "מתיחת" הריבוע.',
}

const rayleighProof: ComplexityProof = {
  result: 'f_R(r)=\\tfrac{r}{\\sigma^2}e^{-r^2/2\\sigma^2},\\ \\ \\Theta\\sim U[0,2\\pi]',
  claimHe: 'שני גאוסים בלתי-תלויים, במעבר לקואורדינטות קוטביות, נותנים זווית אחידה ורדיוס ריילי — בלתי-תלויים.',
  steps: [
    { he: 'הצפיפות המשותפת סימטרית-מעגלית:', tex: 'f_{XY}=\\tfrac{1}{2\\pi\\sigma^2}e^{-(x^2+y^2)/2\\sigma^2}' },
    { he: 'מעבר לקוטביות x=r\\cos\\theta,\\,y=r\\sin\\theta; היעקוביאן:', tex: '|J_h(r,\\theta)|=|r\\cos^2\\theta+r\\sin^2\\theta|=r' },
    { he: 'לפי משפט 3.2 (הצפיפות מתפרקת למכפלה):', tex: 'f_{R,\\Theta}=r\\,f_{XY}=\\underbrace{\\tfrac{1}{2\\pi}}_{f_\\Theta}\\cdot\\underbrace{\\tfrac{r}{\\sigma^2}e^{-r^2/2\\sigma^2}}_{f_R}' },
  ],
  intuitionHe: 'הגורם r מהיעקוביאן הוא היקף הטבעת ברדיוס r — לכן רדיוסים גדולים "שכיחים" יותר, עד שהמעריך מדכא אותם.',
}

/** Lesson 3 · Non-invertible + multivariate — roots sum, χ², Jacobian, Rayleigh. */
export default function NonInvertibleTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        kind="property"
        titleHe="פונקציה לא-הפיכה — סכום על השורשים"
        tex="f_Y(y)=\sum_{i}\dfrac{f_X(x_i)}{\big|g'(x_i)\big|},\qquad g(x_i)=y"
        meaningHe={
          'כשכמה ערכי $x$ נופלים על אותו $y$ (למשל $\\pm\\sqrt{y}$ עבור $X^2$), <b>כל שורש תורם</b> את החלק שלו ' +
          'לפי אותה נוסחת מתיחה — ומחברים את כולם.'
        }
        example={
          <p>
            עבור <span dir="ltr"><Tex>{'Y=X^2'}</Tex></span> יש שני שורשים <span dir="ltr"><Tex>{'\\pm\\sqrt y'}</Tex></span>, ולכן{' '}
            <span dir="ltr"><Tex>{'f_Y(y)=\\tfrac{1}{2\\sqrt y}\\big(f_X(\\sqrt y)+f_X(-\\sqrt y)\\big)'}</Tex></span>.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 14"
        kind="property"
        titleHe="ריבוע של נורמלי → כי-בריבוע"
        tex="X\sim N(0,1),\ Y=X^2\ \Rightarrow\ f_Y(y)=\dfrac{1}{\sqrt{2\pi y}}\,e^{-y/2}"
        meaningHe={'זו התפלגות <b>כי-בריבוע</b> עם דרגת חופש אחת ($\\chi^2_{(1)}$) — היא צצה בכל מקום בגילוי ואמידה (סכום ריבועים של רעש גאוסי).'}
        example={
          <p>
            שימו לב לסינגולריות האינטגרבילית ב-<span dir="ltr"><Tex>{'y\\to0'}</Tex></span>: הצפיפות מתפוצצת אבל השטח סופי.
          </p>
        }
        proof={chiProof}
      />

      <DefinitionCard
        n="משפט 3.2"
        kind="theorem"
        titleHe="שינוי משתנה רב-ממדי (יעקוביאן)"
        tex="f_{Z_1Z_2}(z_1,z_2)=\big|\det J_h\big|\,f_{XY}\big(h(z_1,z_2)\big)"
        meaningHe={
          'אותו רעיון כמו במקרה החד-ממדי, אבל "מתיחת הסקאלה" היא כעת <b>הדטרמיננטה של היעקוביאן</b> $|\\det J_h|$ ' +
          '— גורם ה"מתיחת-נפח" המקומי של הטרנספורמציה ההפוכה $h$.'
        }
        example={
          <p>
            סכום שני משתנים הוא מקרה פרטי: <span dir="ltr"><Tex>{'Z=X+Y'}</Tex></span> ובבלתי-תלויים מתקבלת קונבולוציה{' '}
            <span dir="ltr"><Tex>{'f_Z=f_X*f_Y'}</Tex></span> (כמו בשיעור 1).
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 17"
        kind="property"
        titleHe="מהמישור לקוטביות → ריילי"
        tex="f_R(r)=\dfrac{r}{\sigma^2}\,e^{-r^2/2\sigma^2}\;(r\ge0),\qquad \Theta\sim U[0,2\pi]"
        meaningHe={
          'לוקחים שני גאוסים בלתי-תלויים במישור ועוברים לרדיוס וזווית. התוצאה: הזווית <b>אחידה</b>, הרדיוס מתפלג ' +
          '<b>ריילי</b>, והשניים <b>בלתי-תלויים</b> — דוגמה יפה לכוח היעקוביאן.'
        }
        example={
          <p>
            זו בדיוק התפלגות הריילי שראינו בתרגול המומנטים (<span dir="ltr"><Tex>{'f(r)=r e^{-r^2/2}'}</Tex></span> עבור{' '}
            <span dir="ltr"><Tex>{'\\sigma=1'}</Tex></span>).
          </p>
        }
        proof={rayleighProof}
      />
    </div>
  )
}
