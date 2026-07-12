import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import RegressionExplorer from '../../../viz/RegressionExplorer'

const normalProof: ComplexityProof = {
  result: '\\hat\\theta_{LS}=(H^\\top H)^{-1}H^\\top y',
  claimHe: 'גזירת מטרת הריבועים הפחותים נותנת את "המשוואות הנורמליות".',
  steps: [
    { he: 'מפתחים את הריבוע וגוזרים לפי θ:', tex: '\\nabla_\\theta\\|y-H\\theta\\|^2=-2H^\\top(y-H\\theta)' },
    { he: 'משווים לאפס — אלה המשוואות הנורמליות:', tex: 'H^\\top H\\,\\theta=H^\\top y' },
    { he: 'ומבודדים (HᵀH הפיך):', tex: '\\hat\\theta_{LS}=(H^\\top H)^{-1}H^\\top y' },
  ],
  intuitionHe: 'צריך להפוך רק מטריצה K×K (מספר הפרמטרים), קטנה ביחס ל-N המדידות.',
}

/** Lesson 7 · Normal equations — the LS solution and the sandbox. */
export default function NormalEqTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        titleHe="המשוואות הנורמליות והפתרון"
        tex="H^\top H\,\hat\theta=H^\top y\ \ \Longrightarrow\ \ \hat\theta_{LS}=(H^\top H)^{-1}H^\top y"
        meaningHe={
          'מזערים ריבוע ⇒ גוזרים ומשווים לאפס. המטריצה $(H^\\top H)^{-1}H^\\top$ נקראת ה<b>פסאודו-הופכי</b> — היא ' +
          '"הופכת" מטריצה מלבנית. חישוב מהיר: מהפכים רק $K\\times K$.'
        }
        example={
          <p>
            אומדים גם את שונות הרעש מהשאריות: <span dir="ltr"><Tex>{'\\hat\\sigma^2=\\|y-H\\hat\\theta\\|^2/N'}</Tex></span>.
          </p>
        }
        proof={normalProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="פתרון סגור להתאמת קו"
        tex="\hat\theta_1=\dfrac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2},\qquad \hat\theta_0=\bar y-\hat\theta_1\bar x"
        meaningHe={'עבור התאמת קו יש נוסחה מפורשת: השיפוע הוא הקווריאנס המדגמי חלקי שונות ה-$x$, והחותך "מיישר" דרך נקודת המרכז $(\\bar x,\\bar y)$.'}
        example={
          <p>
            הקו האופטימלי <b>תמיד</b> עובר דרך מרכז-הכובד <span dir="ltr"><Tex>{'(\\bar x,\\bar y)'}</Tex></span> של הנתונים.
          </p>
        }
      />

      <DefinitionCard
        kind="property"
        titleHe="הפרשנות הגיאומטרית — הטלה"
        tex="H^\top(y-H\hat\theta)=0\ \Longrightarrow\ y-H\hat\theta\ \perp\ \mathrm{col}(H)"
        meaningHe={
          'המשוואה הנורמלית אומרת בדיוק ש<b>השארית ניצבת</b> לעמודות $H$. לכן $\\hat y=H\\hat\\theta$ היא ה<b>הטלה האורתוגונלית</b> ' +
          'של $y$ על מרחב העמודות — הנקודה הקרובה ביותר ל-$y$ שאפשר להשיג עם המודל.'
        }
        example={
          <p>
            "הצל" של <span dir="ltr"><Tex>{'y'}</Tex></span> על המישור שפורשות עמודות <span dir="ltr"><Tex>{'H'}</Tex></span> — קצר ככל האפשר, ולכן ניצב.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — הריבועים הפחותים, פשוטו כמשמעו">
        <p className="mb-3 leading-relaxed text-slate-600">
          גררו את הקו: כל <b>ריבוע כתום</b> הוא השארית בריבוע, וה-<span dir="ltr"><Tex>{'\\text{SSR}'}</Tex></span> הוא סכום שטחיהם.
          «פתרון LS» מקפיץ לקו שממזער אותם. נסו «נקודה חריגה» וראו איך היא מטה את הקו.
        </p>
        <RegressionExplorer />
      </Panel>
    </div>
  )
}
