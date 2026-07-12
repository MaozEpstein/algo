import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import DetectionExplorer from '../../../viz/DetectionExplorer'

const npProof: ComplexityProof = {
  result: 'R=\\{x:\\ T(x)\\ge\\eta\\},\\quad T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}',
  claimHe: 'המבחן שממקסם את הגילוי בכפוף לאזעקת-שווא α הוא מבחן יחס הנראות.',
  steps: [
    { he: 'רושמים לגרנז׳יאן לבעיה max P_D בכפוף ל-P_FA≤α:', tex: 'L=P_D-\\lambda(P_{FA}-\\alpha)=\\int_R\\big[f(x;H_1)-\\lambda f(x;H_0)\\big]dx+\\lambda\\alpha' },
    { he: 'ממקסמים על R: מכניסים ל-R בדיוק את ה-x-ים שבהם האינטגרנד אי-שלילי:', tex: 'R=\\{x:\\ f(x;H_1)\\ge\\lambda f(x;H_0)\\}=\\{x:\\ T(x)\\ge\\lambda\\}' },
    { he: 'הסף λ=η נקבע מהאילוץ:', tex: '\\alpha=\\int_{\\{T(x)\\ge\\eta\\}} f(x;H_0)\\,dx' },
  ],
  intuitionHe: 'מרחיבים את אזור הדחייה כדי להגדיל את הגילוי, כשכל תוספת "נקנסת" באזעקת-שווא במחיר λ.',
}

const gaussProof: ComplexityProof = {
  result: 'P_D=Q\\big(Q^{-1}(P_{FA})-\\sqrt{n\\mu^2/\\sigma^2}\\big)',
  claimHe: 'עבור H0:N(0,σ²) מול H1:N(μ,σ²), המבחן מצטמצם לממוצע המדגם, והביצועים נקבעים מה-SNR.',
  steps: [
    { he: 'יחס הנראות של מכפלת גאוסים; log ומחיקת קבועים נותנים סטטיסטיקה מספיקה:', tex: 'T(x)=\\tfrac1n\\sum_i x_i' },
    { he: 'התפלגות הסטטיסטיקה תחת כל השערה:', tex: 'T;H_0\\sim N\\!\\big(0,\\tfrac{\\sigma^2}{n}\\big),\\quad T;H_1\\sim N\\!\\big(\\mu,\\tfrac{\\sigma^2}{n}\\big)' },
    { he: 'מכאן P_FA והסף:', tex: 'P_{FA}=Q\\!\\big(\\tfrac{\\eta}{\\sqrt{\\sigma^2/n}}\\big)\\ \\Rightarrow\\ \\eta=\\sqrt{\\tfrac{\\sigma^2}{n}}\\,Q^{-1}(P_{FA})' },
    { he: 'וה-P_D:', tex: 'P_D=Q\\!\\big(Q^{-1}(P_{FA})-\\sqrt{n\\mu^2/\\sigma^2}\\big)' },
  ],
  intuitionHe: 'הסף אינו תלוי ב-μ! יותר דגימות n או SNR גבוה יותר מזיזים את ה-ROC אל הפינה השמאלית-עליונה.',
}

/** Lesson 5 · Neyman-Pearson — the LRT, the NP theorem, the Gaussian example, ROC. */
export default function NeymanPearsonTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        titleHe="מבחן יחס הנראות (LRT)"
        tex="T(x)=\dfrac{f(x;H_1)}{f(x;H_0)}\ \gtrless_{H_0}^{H_1}\ \eta"
        meaningHe={
          'משווים <b>כמה סביר</b> ש-$x$ הגיע מ-$H_1$ לעומת $H_0$. אם היחס גדול מסף $\\eta$ — בוחרים $H_1$. ' +
          'זה המבנה של <b>כל</b> מבחן אופטימלי; ההבדל בין הגישות הוא רק <b>איך קובעים את $\\eta$</b>.'
        }
        example={
          <p>
            נוח לעבוד עם <span dir="ltr"><Tex>{'\\log T'}</Tex></span>: המכפלות הופכות לסכומים, ולרוב מתגלה סטטיסטיקה מספיקה פשוטה.
          </p>
        }
      />

      <DefinitionCard
        n="משפט 5.1"
        kind="theorem"
        titleHe="ניימן-פירסון"
        tex="\max_R P_D\ \ \text{s.t.}\ \ P_{FA}\le\alpha\quad\Longrightarrow\quad T(x)\gtrless\eta"
        meaningHe={
          'מבין <b>כל</b> המבחנים עם אותה אזעקת-שווא, מבחן יחס הנראות נותן את <b>הגילוי הגבוה ביותר</b>. הסף $\\eta$ נקבע ' +
          'יחיד מהאילוץ $P_{FA}=\\alpha$.'
        }
        example={<p>לכן לא צריך "להמציא" מבחנים — ה-LRT מובטח אופטימלי, ונשאר רק לחשב את הסף.</p>}
        proof={npProof}
      />

      <DefinitionCard
        titleHe="פונקציית Q"
        tex="Q(a)=\Pr(Z>a)=\int_a^{\infty}\tfrac{1}{\sqrt{2\pi}}e^{-t^2/2}\,dt,\quad Z\sim N(0,1)"
        meaningHe={'הזנב הימני של הנורמלי הסטנדרטי — הכלי לחישוב $P_{FA}$ ו-$P_D$ בבעיות גאוסיות. תכונה שימושית: $Q(-a)=1-Q(a)$.'}
        example={
          <p>
            עבור <span dir="ltr"><Tex>{'Y\\sim N(\\mu,\\sigma^2)'}</Tex></span>: <span dir="ltr"><Tex>{'\\Pr(Y>\\gamma)=Q\\big(\\tfrac{\\gamma-\\mu}{\\sigma}\\big)'}</Tex></span>.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 20"
        kind="property"
        titleHe="גילוי גאוסי — הזזת תוחלת"
        tex="H_0:N(0,\sigma^2)\ \text{מול}\ H_1:N(\mu,\sigma^2)\ \Rightarrow\ T=\tfrac1n\textstyle\sum x_i"
        meaningHe={
          'המבחן האופטימלי הוא פשוט <b>ממוצע המדגם</b> מול סף. ה-$P_D$ נקבע מה<b>יחס אות-לרעש</b> ' +
          '$\\sqrt{n\\mu^2/\\sigma^2}$ — יותר דגימות או אות חזק יותר → גילוי טוב יותר.'
        }
        example={
          <p>
            שימו לב: הסף <span dir="ltr"><Tex>{'\\eta=\\sqrt{\\sigma^2/n}\\,Q^{-1}(P_{FA})'}</Tex></span> <b>אינו תלוי</b> ב-<span dir="ltr"><Tex>{'\\mu'}</Tex></span> —
            מגדירים אותו רק מ-<span dir="ltr"><Tex>{'P_{FA}'}</Tex></span>.
          </p>
        }
        proof={gaussProof}
      />

      <Panel title="🎛️ ארגז חול — סף, שגיאות, ו-ROC">
        <p className="mb-3 leading-relaxed text-slate-600">
          גררו את הסף <span dir="ltr"><Tex>{'\\eta'}</Tex></span>: הזנב האדום הוא <span dir="ltr"><Tex>{'P_{FA}'}</Tex></span> והירוק{' '}
          <span dir="ltr"><Tex>{'P_D'}</Tex></span>. הגדילו את ההפרדה <span dir="ltr"><Tex>{'d'}</Tex></span> וראו איך עקומת ה-ROC
          מתקמרת אל הפינה. במצב <b>בייסיאני</b> הסף נקבע מה-prior כדי למזער שגיאה.
        </p>
        <DetectionExplorer />
      </Panel>
    </div>
  )
}
