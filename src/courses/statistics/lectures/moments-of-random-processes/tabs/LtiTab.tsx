import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import LtiFilterExplorer from '../../../viz/LtiFilterExplorer'

const ltiProof: ComplexityProof = {
  result: 'R_Y(k)=\\sum_i\\sum_j h[i]h[j]R_X[k+j-i]',
  claimHe: 'תהליך WSS דרך מערכת LTI יציבה נשאר WSS (דוגמה 45).',
  steps: [
    { he: 'התוחלת של היציאה:', tex: 'E[Y[n]]=E\\big[\\textstyle\\sum_i h[i]X[n-i]\\big]=\\big(\\textstyle\\sum_i h[i]\\big)\\mu_X' },
    { he: 'אינה תלויה ב-n ⇒ תוחלת קבועה. כעת האוטו-קורלציה:', tex: 'R_Y(n,n-k)=E\\big[\\textstyle\\sum_i h[i]X[n-i]\\textstyle\\sum_j h[j]X[n-k-j]\\big]' },
    { he: 'מכניסים את התוחלת פנימה:', tex: '=\\textstyle\\sum_i\\sum_j h[i]h[j]\\,R_X[k+j-i]' },
    { he: 'אינה תלויה ב-n ⇒ WSS. (יציבות Σ|h[i]|<∞ מבטיחה סכומים סופיים.)', tex: '\\Rightarrow\\ Y[n]\\ \\text{WSS}' },
  ],
  intuitionHe: 'הסינון "מערבב" דגימות שכנות במשקלים קבועים — לכן הוא לא יכול להכניס תלות במיקום המוחלט בזמן, והמבנה הסטציונרי נשמר.',
}

/** Lesson 11 · LTI — output moments, jointly WSS, and the filter sandbox. */
export default function LtiTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תהליך WSS דרך מערכת לינארית ובלתי-תלוית-זמן">
        <p className="leading-relaxed text-slate-700">
          מערכת <b>LTI</b> (לינארית ובלתי-תלוית-זמן) פועלת בקונבולוציה: <span dir="ltr"><Tex>{'y[n]=\\sum_i h[i]x[n-i]'}</Tex></span>.
          כאשר הכניסה <b>WSS</b> והמערכת <b>יציבה</b> (<span dir="ltr"><Tex>{'\\sum_i|h[i]|<\\infty'}</Tex></span>) — גם היציאה WSS.
        </p>
      </Panel>

      <DefinitionCard
        n="דוגמה 45"
        kind="theorem"
        titleHe="מומנטי היציאה של מערכת LTI"
        tex="E[Y]=\Big(\sum_i h[i]\Big)\mu_X,\qquad R_Y(k)=\sum_i\sum_j h[i]h[j]\,R_X[k+j-i]"
        meaningHe={
          'ה<b>תוחלת</b> של היציאה היא התוחלת של הכניסה כפול סכום המקדמים. ה<b>אוטו-קורלציה</b> של היציאה היא ' +
          '"קורלציה כפולה" של תגובת ההלם עם האוטו-קורלציה של הכניסה — שתיהן <b>אינן תלויות ב-n</b>.'
        }
        example={
          <p>
            עבור <span dir="ltr"><Tex>{'Y[n]=\\tfrac12X[n]+\\tfrac12X[n-1]'}</Tex></span>:{' '}
            <span dir="ltr"><Tex>{'R_Y(\\tau)=\\tfrac12 r_X(\\tau)+\\tfrac14 r_X(\\tau-1)+\\tfrac14 r_X(\\tau+1)'}</Tex></span>.
          </p>
        }
        proof={ltiProof}
      />

      <DefinitionCard
        n="הגדרה 11.3 · דוגמה 46"
        kind="property"
        titleHe="סטציונריות משותפת (jointly WSS)"
        tex="R_{X,Y}(n,n-k)=\sum_j h[j]\,R_X[k+j]"
        meaningHe={
          'שני תהליכים הם <b>WSS משותף</b> אם שניהם WSS וה<b>קרוס-קורלציה</b> ביניהם תלויה רק בפיגור. ' +
          'כניסה WSS והיציאה שלה דרך LTI הן תמיד WSS משותף.'
        }
        example={
          <p>
            הקרוס-קורלציה בין הכניסה ליציאה היא פשוט תגובת ההלם "מגוללת" על האוטו-קורלציה של הכניסה.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — סינון LTI">
        <p className="mb-3 leading-relaxed text-slate-600">
          העבירו כניסת AR(1) דרך מסנן ממוצע-נע והגדילו את אורכו <span dir="ltr"><Tex>{'L'}</Tex></span>: היציאה נעשית <b>חלקה יותר</b>,
          נשארת WSS, והאוטו-קורלציה <span dir="ltr"><Tex>{'R_Y'}</Tex></span> משנה צורה — הזיכרון מתרחב.
        </p>
        <LtiFilterExplorer />
      </Panel>
    </div>
  )
}
