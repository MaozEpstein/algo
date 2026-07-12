import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const condProof: ComplexityProof = {
  result: 'x\\mid y\\sim N\\big(m_x+C_{xy}C_{yy}^{-1}(y-m_y),\\ C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}\\big)',
  claimHe: 'ההתניה של גאוסי היא שוב גאוסי — עם תוחלת לינארית ב-y ושונות קבועה (לא תלויה ב-y).',
  steps: [
    { he: 'למקרה הדו-ממדי הסטנדרטי מחשבים f_{X|Y}=f_{XY}/f_Y, עם היפוך הקווריאנס:', tex: '\\begin{pmatrix}1&\\rho\\\\\\rho&1\\end{pmatrix}^{-1}=\\tfrac{1}{1-\\rho^2}\\begin{pmatrix}1&-\\rho\\\\-\\rho&1\\end{pmatrix}' },
    { he: 'השלמה לריבוע במעריך נותנת שוב גאוסי:', tex: 'f_{X\\mid Y}=\\tfrac{1}{\\sqrt{2\\pi(1-\\rho^2)}}\\,e^{-\\frac{(x-\\rho y)^2}{2(1-\\rho^2)}}' },
    { he: 'כלומר תוחלת ρy ושונות 1−ρ²; ההכללה הווקטורית:', tex: 'E[x\\mid y]=m_x+C_{xy}C_{yy}^{-1}(y-m_y)' },
  ],
  intuitionHe: 'ידיעת y "מזיזה" את התוחלת של x באופן לינארי, ו"מכווצת" את השונות — וזה בדיוק אמד לינארי אופטימלי.',
}

/** Lesson 4 · Conditional Gaussian — Thm 4.6 and the bridge to estimation. */
export default function ConditionalTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 4.6"
        kind="theorem"
        titleHe="התניה גאוסית"
        tex="\begin{aligned} &E[x\mid y]=m_x+C_{xy}C_{yy}^{-1}(y-m_y) \\ &\mathrm{Cov}[x\mid y]=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx} \end{aligned}"
        meaningHe={
          'כשמתנים גאוסי משותף על חלק מהמשתנים, מקבלים <b>שוב גאוסי</b>. התוחלת המותנית היא <b>לינארית</b> ב-$y$, ' +
          'והשונות המותנית <b>קטֵנה</b> מהמקורית ו<b>אינה תלויה בערך</b> $y$ — רק במטריצות הקווריאנס.'
        }
        example={
          <p>
            זהו הבסיס לאמידה: <span dir="ltr"><Tex>{'E[x\\mid y]'}</Tex></span> הוא בדיוק ה<b>מנבא האופטימלי</b> של $x$ מתוך $y$.
          </p>
        }
        proof={condProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="המקרה הדו-ממדי"
        tex="X\mid Y=y\ \sim\ N\!\Big(\rho\tfrac{\sigma_x}{\sigma_y}\,y,\ \ \sigma_x^2(1-\rho^2)\Big)"
        meaningHe={
          'עבור זוג גאוסי עם מתאם $\\rho$: התוחלת המותנית היא קו-הניבוי $\\rho\\tfrac{\\sigma_x}{\\sigma_y}y$, והשונות שנותרה היא ' +
          '$\\sigma_x^2(1-\\rho^2)$ — פוחתת ככל שהמתאם חזק יותר.'
        }
        example={
          <p>
            בדיוק מה שהחתך הכתום בארגז החול מראה: גררו את <span dir="ltr"><Tex>{'Y=y'}</Tex></span> ואת{' '}
            <span dir="ltr"><Tex>{'\\rho'}</Tex></span> — הפס מצטמצם עד שב-<span dir="ltr"><Tex>{'|\\rho|=1'}</Tex></span> $X$ נקבע לחלוטין.
          </p>
        }
      />

      <Panel title="הגשר לשיעורי האמידה">
        <p className="leading-relaxed text-slate-700">
          ההתניה הגאוסית היא הסיבה שהגאוסי כה מרכזי באמידה. התוחלת המותנית <span dir="ltr"><Tex>{'E[x\\mid y]'}</Tex></span> היא
          ה<b>אמד בעל השגיאה הריבועית המינימלית (MMSE)</b>, והיא כאן <b>לינארית</b> ב-<span dir="ltr"><Tex>{'y'}</Tex></span> —
          ולכן במקרה הגאוסי ה-MMSE וה-LMMSE (האמד הלינארי) <b>מתלכדים</b>. את זה נפרוש בשיעורים 8–9 (סטטיסטיקה בייסיאנית
          ואמידה לינארית).
        </p>
      </Panel>
    </div>
  )
}
