import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const gaussProof: ComplexityProof = {
  result: '\\hat x_{MMSE}=\\hat x_{LMMSE}',
  claimHe: 'למשתנים גאוסיים משותפים, ה-MMSE האופטימלי הוא לינארי ושווה ל-LMMSE (משפט 9.2).',
  steps: [
    { he: 'שגיאת ה-LMMSE אינה מתואמת עם אף פונקציה לינארית של המדידה (אורתוגונליות):', tex: 'E\\big[(\\hat a^\\top y-X)\\,y\\big]=0' },
    { he: 'השגיאה לינארית ב-y, ולכן היא גאוסית-משותפת עם כל פונקציה לינארית שלה:', tex: '(\\hat a^\\top y-X),\\ y\\ \\text{jointly Gaussian}' },
    { he: 'בגאוסי משותף: אי-מתאם ⇐ אי-תלות; אי-תלות נשמרת תחת כל פונקציה:', tex: '\\text{uncorrelated}\\Rightarrow \\text{independent}' },
    { he: 'לכן השגיאה אינה מתואמת עם כל פונקציה g(y) — התנאי של ה-MMSE המלא מתקיים:', tex: 'E\\big[g(y)(\\hat x-X)\\big]=0\\ \\ \\forall g' },
  ],
  intuitionHe: 'ההתפלגות הגאוסית מוגדרת לגמרי ע"י מומנטים מסדר ראשון ושני — בדיוק מה ש-LMMSE משתמש בו. אין מידע "לא-לינארי" נוסף לנצל, אז הלינארי כבר אופטימלי.',
}

/** Lesson 9 · Gaussian — Thm 9.2 (LMMSE=MMSE) + the two-sensor fusion (Ex 31). */
export default function GaussianTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 9.2"
        kind="theorem"
        titleHe="גאוסי משותף ⇒ MMSE = LMMSE"
        tex="x,y\ \text{jointly Gaussian}\ \Rightarrow\ E[x\mid y]=\mu_x+C_{xy}C_{yy}^{-1}(y-\mu_y)"
        meaningHe={
          'כשהמשתנים גאוסיים משותפים, האמד הלינארי כבר <b>אופטימלי לחלוטין</b> — התוחלת המותנית עצמה יוצאת לינארית. ' +
          'זו בדיוק התוחלת המותנית מ<b>שיעור 4</b> (משפט הגאוסי המותנה).'
        }
        example={
          <p>
            השווו לנוסחה משיעור 4: <span dir="ltr"><Tex>{'E[x\\mid y]=\\rho\\tfrac{\\sigma_x}{\\sigma_y}y'}</Tex></span> — אותו קו בדיוק.
            "מספיק להשתמש בסטטיסטיקה מסדר שני, שהרי היא זו שמגדירה את הגאוסי."
          </p>
        }
        proof={gaussProof}
      />

      <DefinitionCard
        n="דוגמה 31"
        kind="property"
        titleHe="שילוב שני חיישנים"
        tex="x_1=y+n_1,\ x_2=y+n_2\ \Rightarrow\ \hat y=\mu+\dfrac{\frac{x_1-\mu}{\sigma_1^2}+\frac{x_2-\mu}{\sigma_2^2}}{\frac{1}{\sigma_1^2}+\frac{1}{\sigma_2^2}+\frac{1}{\sigma^2}}"
        meaningHe={
          'שתי מדידות רועשות של אותו אות $y\\sim N(\\mu,\\sigma^2)$. ה-MMSE (=LMMSE) הוא <b>ממוצע משוקלל לפי הדיוק</b> ' +
          '(1/שונות) של שתי המדידות וה-prior — חיישן מדויק יותר מקבל משקל גדול יותר.'
        }
        example={
          <div className="space-y-1">
            <p><span dir="ltr"><Tex>{'\\sigma_1\\ll\\sigma_2'}</Tex></span> — סומכים על החיישן הטוב: <span dir="ltr"><Tex>{'\\hat y\\approx x_1'}</Tex></span>.</p>
            <p><span dir="ltr"><Tex>{'\\sigma_1,\\sigma_2\\to\\infty'}</Tex></span> — שני החיישנים חסרי-ערך: <span dir="ltr"><Tex>{'\\hat y\\to\\mu'}</Tex></span> (ה-prior).</p>
            <p><span dir="ltr"><Tex>{'\\sigma_1=\\sigma_2'}</Tex></span> — ממוצע פשוט: <span dir="ltr"><Tex>{'\\hat y\\to(x_1+x_2)/2'}</Tex></span>.</p>
          </div>
        }
      />

      <Panel title="הקשר לשיעור 4">
        <p className="leading-relaxed text-slate-600">
          משפט הגאוסי המותנה שראינו בשיעור 4 הוא <b>בדיוק</b> ה-LMMSE של השיעור הזה. הנוסחה{' '}
          <span dir="ltr"><Tex>{'E[x\\mid y]=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y)'}</Tex></span> חוזרת — רק שעכשיו אנחנו יודעים שהיא
          האמד הלינארי הטוב ביותר <b>לכל</b> התפלגות (לא רק גאוסי), ואופטימלית לחלוטין דווקא בגאוסי.
        </p>
      </Panel>
    </div>
  )
}
