import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import MarginalDriftExplorer from '../../../viz/MarginalDriftExplorer'

const iidSssProof: ComplexityProof = {
  result: 'i.i.d\\ \\Rightarrow\\ \\text{SSS}',
  claimHe: 'תהליך i.i.d הוא סטציונרי במובן הצר (דוגמה 38).',
  steps: [
    { he: 'לכל הדגימות אותה שולית g:', tex: 'F_{x(n)}(x_n)=g(x_n)' },
    { he: 'אי-תלות ⇒ ההתפלגות המשותפת היא מכפלה:', tex: 'F_{x(t_1),\\dots,x(t_k)}(a_1,\\dots,a_k)=\\textstyle\\prod_{i=1}^{k} g(a_i)' },
    { he: 'אחרי הזזה בזמן τ — אותה מכפלה בדיוק:', tex: 'F_{x(t_1+\\tau),\\dots,x(t_k+\\tau)}(a_1,\\dots,a_k)=\\textstyle\\prod_{i=1}^{k} g(a_i)' },
    { he: 'התוצאה תלויה רק ב-k ובערכים, לא בזמנים:', tex: 'F_{x(t_i)}=F_{x(t_i+\\tau)}\\ \\Rightarrow\\ \\text{SSS}' },
  ],
  intuitionHe: 'כשאין תלות בזמן ואין שינוי בשולית — אין שום דבר ש"זוכר" את המיקום המוחלט בזמן. באופן כללי קשה להוכיח SSS, אבל ל-i.i.d זה מיידי.',
}

/** Lesson 10 · Stationarity — SSS, asymptotic, and the marginal-drift sandbox. */
export default function StationaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהי סטציונריות?">
        <p className="leading-relaxed text-slate-700">
          תהליך <b>סטציונרי</b> אם הסטטיסטיקה שלו קבועה לאורך הזמן: הקטע <span dir="ltr"><Tex>{'(t_1,t_1+s)'}</Tex></span> נראה
          <b> זהה סטטיסטית</b> לקטע <span dir="ltr"><Tex>{'(t_2,t_2+s)'}</Tex></span> לכל הזזה. זו הנחה מרכזית שתאפשר בהמשך לאמוד מומנטים מתוך מימוש יחיד.
        </p>
      </Panel>

      <DefinitionCard
        n="הגדרה 10.4"
        kind="definition"
        titleHe="סטציונריות במובן הצר (SSS)"
        tex="F_{x(t_1),\dots,x(t_k)}(a_1,\dots,a_k)=F_{x(t_1+\tau),\dots,x(t_k+\tau)}(a_1,\dots,a_k)\quad\forall\,k,\tau,t_i"
        meaningHe={
          'ההתפלגות המשותפת <b>אינווריאנטית להזזת זמן</b>: היא תלויה רק ב<b>הפרשי</b> הזמנים, לא במיקום המוחלט. ' +
          'זו דרישה חזקה — על <b>כל</b> ההתפלגויות הסוף-ממדיות, לא רק על התוחלת.'
        }
        example={
          <p>
            תהליך i.i.d מקיים זאת מיד (דוגמה 38): ההתפלגות המשותפת היא מכפלת שוליים זהות, שאינה תלויה בזמנים.
          </p>
        }
        proof={iidSssProof}
      />

      <DefinitionCard
        n="הגדרה 10.5"
        kind="definition"
        titleHe="סטציונריות אסימפטוטית"
        tex="\lim_{T\to\infty}F_{x(t_1+T),\dots,x(t_k+T)}(x_1,\dots,x_k)=F_k(x_1,\dots,x_k)"
        meaningHe={
          'דרישה <b>חלשה יותר</b>: לא צריך שההתפלגות תהיה קבועה — מספיק שה<b>מוזזת</b> תתכנס לגבול $F_k$ כאשר $T\\to\\infty$. ' +
          'הגבול תלוי במימד $k$ ובהפרשי הזמנים, אך לא בזמנים המקוריים.'
        }
        example={
          <p>
            תהליך ה-XOR עם <span dir="ltr"><Tex>{'p\\ne\\tfrac12'}</Tex></span>: השוליים <span dir="ltr"><Tex>{'P(X_n{=}1)'}</Tex></span> תלויים ב-n
            (לא SSS), אבל מתכנסים ל-½ — <b>סטציונרי אסימפטוטית</b>.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 39"
        kind="property"
        titleHe="גאוסי קבוע בזמן"
        tex="y\sim N(0,1),\ x(t)=y\ \forall t\ \Rightarrow\ F_{x(t_1),\dots,x(t_k)}(a_1,\dots,a_k)=F_y\big(\min(a_1,\dots,a_k)\big)"
        meaningHe={'תהליך שבו כל הזמנים חולקים את <b>אותו</b> משתנה מקרי. ה-CDF המשותף אינו תלוי בזמנים כלל — ולכן התהליך <b>SSS</b>.'}
        example={
          <p>
            כל הדגימות שוות זו לזו (<span dir="ltr"><Tex>{'x(t_i)=y'}</Tex></span>), אז המאורע המשותף נשלט ע"י ה-<span dir="ltr"><Tex>{'\\min'}</Tex></span> של הערכים.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — SSS מול אסימפטוטי">
        <p className="mb-3 leading-relaxed text-slate-600">
          גררו את <span dir="ltr"><Tex>{'p'}</Tex></span> וצפו בשוליים של תהליך ה-XOR: ב-<span dir="ltr"><Tex>{'p=\\tfrac12'}</Tex></span> הם שטוחים על ½
          (SSS), ואחרת הם <b>נודדים</b> אל ½ (סטציונרי אסימפטוטית בלבד).
        </p>
        <MarginalDriftExplorer />
      </Panel>
    </div>
  )
}
