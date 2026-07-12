import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import RidgeExplorer from '../../../viz/RidgeExplorer'

const covProof: ComplexityProof = {
  result: '\\mathrm{Cov}(\\hat\\theta)=\\sigma^2(H^\\top H)^{-1}',
  claimHe: 'תחת רעש גאוסי, אמד ה-LS לא-מוטה, עם קווריאנס σ²(HᵀH)⁻¹.',
  steps: [
    { he: 'השגיאה היא פונקציה לינארית של הרעש:', tex: 'e=\\hat\\theta-\\theta=(H^\\top H)^{-1}H^\\top n' },
    { he: 'התוחלת אפס (E[n]=0) ⇒ לא-מוטה:', tex: 'E[e]=(H^\\top H)^{-1}H^\\top E[n]=0' },
    { he: 'והקווריאנס:', tex: 'E[ee^\\top]=(H^\\top H)^{-1}H^\\top(\\sigma^2 I)H(H^\\top H)^{-1}=\\sigma^2(H^\\top H)^{-1}' },
  ],
  intuitionHe: 'יותר מדידות או "אנרגיה" גדולה יותר ב-H → HᵀH גדול → הקווריאנס (וחוסר-הוודאות) קטֵן.',
}

const ridgeProof: ComplexityProof = {
  result: '\\hat\\theta=(H^\\top H+\\lambda I)^{-1}H^\\top y',
  claimHe: 'הוספת ענישה על הנורמה נותנת את פתרון ה-ridge.',
  steps: [
    { he: 'המטרה עם ענישה:', tex: '\\min_\\theta\\ \\|y-H\\theta\\|^2+\\lambda\\|\\theta\\|^2' },
    { he: 'גוזרים ומשווים לאפס:', tex: '-2H^\\top(y-H\\theta)+2\\lambda\\theta=0' },
    { he: 'ומבודדים:', tex: '\\hat\\theta=(H^\\top H+\\lambda I)^{-1}H^\\top y' },
  ],
  intuitionHe: 'ה-λI מבטיח הפיכות ו"מרסן" את θ — מוסיף הטיה אבל מקטין שונות, במיוחד כשמעט נתונים.',
}

/** Lesson 7 · Performance & regularization — covariance, ridge, gradient descent. */
export default function PerformanceTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        kind="theorem"
        titleHe="ביצועי אמד ה-LS"
        tex="E[\hat\theta]=\theta\ (\text{לא-מוטה}),\qquad \mathrm{Cov}(\hat\theta)=\sigma^2(H^\top H)^{-1}"
        meaningHe={
          'תחת המודל $y=H\\theta+n$ עם $n\\sim N(0,\\sigma^2 I)$: האמד <b>לא-מוטה</b>, וכל אי-הוודאות שלו נעוצה בקווריאנס ' +
          '$\\sigma^2(H^\\top H)^{-1}$ — שקטֵן ככל שיש יותר/חזק יותר מדידות.'
        }
        example={
          <p>
            במקרה סקלרי: <span dir="ltr"><Tex>{'\\mathrm{Var}(\\hat\\theta)=\\sigma^2/\\sum x_i^2\\approx\\sigma^2/N'}</Tex></span> — שוב דעיכה כ-<span dir="ltr"><Tex>{'1/N'}</Tex></span>.
          </p>
        }
        proof={covProof}
      />

      <DefinitionCard
        n="7.4"
        kind="theorem"
        titleHe="רגולריזציה (Ridge)"
        tex="\min_\theta\ \|y-H\theta\|^2+\lambda\|\theta\|^2\ \Rightarrow\ \hat\theta=(H^\top H+\lambda I)^{-1}H^\top y"
        meaningHe={
          'כשיש מעט נתונים ביחס לפרמטרים, ה-LS "מתאים-יתר". <b>Ridge</b> מוסיף ענישה $\\lambda\\|\\theta\\|^2$ שמרסנת את הפרמטרים — ' +
          '<b>הטיה תמורת שונות</b>: $\\lambda$ גדול → $\\theta$ קטן, מוטה, אבל יציב יותר.'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'\\lambda>0'}</Tex></span> גם מבטיח ש-<span dir="ltr"><Tex>{'H^\\top H+\\lambda I'}</Tex></span> הפיך תמיד — פותר בעיות של מטריצה סינגולרית.
          </p>
        }
        proof={ridgeProof}
      />

      <DefinitionCard
        n="7.5"
        kind="property"
        titleHe="מזעור בקנה-מידה גדול"
        tex="\theta_{k+1}=\theta_k-\mu\cdot 2H^\top(H\theta_k-y)"
        meaningHe={'כש-$H^\\top H$ גדול מכדי להפוך (או $H$ לא-לינארי), פותרים ב<b>ירידת גרדיאנט</b>: צעד קטן בכיוון הגרדיאנט השלילי, שוב ושוב.'}
        example={<p>זה מה שמאמן מודלים גדולים בפועל — SGD על אצוות (batches) של הנתונים.</p>}
      />

      <Panel title="🎛️ ארגז חול — התאמת-יתר מול רגולריזציה">
        <p className="mb-3 leading-relaxed text-slate-600">
          העלו את <b>דרגת הפולינום</b> עם <span dir="ltr"><Tex>{'\\lambda=0'}</Tex></span> — העקומה "מתפתלת" דרך כל נקודה (התאמת-יתר).
          הגדילו את <span dir="ltr"><Tex>{'\\lambda'}</Tex></span> — היא נרגעת ומחליקה: הטיה תמורת שונות.
        </p>
        <RidgeExplorer />
      </Panel>
    </div>
  )
}
