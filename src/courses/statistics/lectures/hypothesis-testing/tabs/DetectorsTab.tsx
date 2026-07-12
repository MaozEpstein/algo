import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const matchedProof: ComplexityProof = {
  result: 'T(x)=x^\\top\\Sigma^{-1}s,\\quad d^2=s^\\top\\Sigma^{-1}s',
  claimHe: 'לגילוי אות ידוע s ברעש גאוסי, מבחן יחס הנראות הוא מבחן לינארי.',
  steps: [
    { he: 'H0: x∼N(0,Σ), H1: x∼N(s,Σ). ה-log-LRT:', tex: '\\log\\tfrac{f(x;H_1)}{f(x;H_0)}=-\\tfrac12(x-s)^\\top\\Sigma^{-1}(x-s)+\\tfrac12 x^\\top\\Sigma^{-1}x' },
    { he: 'האיברים הריבועיים מתבטלים ונשאר ביטוי לינארי:', tex: 'T(x)=x^\\top\\Sigma^{-1}s' },
    { he: 'ברעש לבן Σ=σ²I מתקבל "המסנן המותאם":', tex: 'T(x)=x^\\top s' },
  ],
  intuitionHe: 'המבחן "מקרין" את התצפית על כיוון האות; מקדם ההסטה d²=sᵀΣ⁻¹s הוא ה-SNR האפקטיבי, ו-P_D=Q(Q⁻¹(P_FA)−d).',
}

const energyProof: ComplexityProof = {
  result: 'T(x)=\\|x\\|^2\\ \\gtrless\\ \\eta',
  claimHe: 'לגילוי אות אקראי (לא ידוע), מבחן יחס הנראות מצטמצם לאנרגיה של התצפית.',
  steps: [
    { he: 'H0: x∼N(0,σ²I); H1: אות אקראי לבן ועוד רעש:', tex: 'H_1:\\ x\\sim N(0,(\\sigma_s^2+\\sigma^2)I)' },
    { he: 'ה-log-LRT הוא צורה ריבועית; במקרה הלבן הכל פרופורציוני לאנרגיה:', tex: 'T(x)=x^\\top x=\\|x\\|^2' },
    { he: 'הביצועים מחושבים דרך χ² (סכום ריבועי גאוסים):', tex: 'T;H_0\\sim\\sigma^2\\chi^2_d,\\quad T;H_1\\sim(\\sigma_s^2+\\sigma^2)\\chi^2_d' },
  ],
  intuitionHe: 'כשלא יודעים את צורת האות שואלים רק "כמה אנרגיה יש?" — ולכן הביצועים דרך χ² ולא דרך Q.',
}

/** Lesson 5 · Detectors — the matched filter and the energy detector. */
export default function DetectorsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שתי שאלות שונות">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-500 bg-sky-50/60 p-3 leading-relaxed">
            <b className="text-sky-800">"איזה אות ידוע?"</b>
            <p className="mt-1 text-sm text-slate-600">אות $s$ ידוע מראש → <b>מסנן מותאם</b> (מבחן לינארי).</p>
          </div>
          <div className="rounded-xl border-s-4 border-amber-500 bg-amber-50/60 p-3 leading-relaxed">
            <b className="text-amber-800">"האם יש בכלל אות?"</b>
            <p className="mt-1 text-sm text-slate-600">אות אקראי/לא ידוע → <b>גלאי אנרגיה</b> (מבחן ריבועי).</p>
          </div>
        </div>
      </Panel>

      <DefinitionCard
        n="דוגמה 21"
        kind="property"
        titleHe="מסנן מותאם (Matched Filter)"
        tex="T(x)=x^\top\Sigma^{-1}s\ \gtrless\ \eta,\qquad P_D=Q\big(Q^{-1}(P_{FA})-d\big),\ \ d^2=s^\top\Sigma^{-1}s"
        meaningHe={
          'כשמחפשים <b>אות ידוע</b> $s$ ברעש גאוסי, ה-LRT הוא <b>לינארי</b> — מקרינים את $x$ על הכיוון $\\Sigma^{-1}s$. ' +
          'ברעש לבן זה פשוט $x^\\top s$. זהו גם "ניתוח בדל לינארי" (LDA).'
        }
        example={
          <p>
            מכ״ם ששולח פולס ידוע: מכפילים את המתקבל בפולס וסוכמים — האנרגיה בכיוון האות נצברת, והרעש מתבטל בממוצע.
          </p>
        }
        proof={matchedProof}
      />

      <DefinitionCard
        n="דוגמה 22"
        kind="property"
        titleHe="גלאי אנרגיה (Energy Detector)"
        tex="T(x)=\|x\|^2\ \gtrless\ \eta,\qquad T;H_0\sim\sigma^2\chi^2_d,\ \ T;H_1\sim(\sigma_s^2+\sigma^2)\chi^2_d"
        meaningHe={
          'כשה<b>אות אקראי</b> (לא ידוע מראש), אין כיוון להקרין עליו — אז שואלים רק כמה <b>אנרגיה</b> יש. ' +
          'המבחן ריבועי, והביצועים דרך <b>כי-בריבוע</b> (סכום ריבועי הרעש הגאוסי).'
        }
        example={
          <p>
            הסף מ-<span dir="ltr"><Tex>{'P_{FA}'}</Tex></span>: <span dir="ltr"><Tex>{'\\lambda=\\sigma^2 F^{-1}_{\\chi^2_d}(1-P_{FA})'}</Tex></span>, ו-<span dir="ltr"><Tex>{'P_D=1-F_{\\chi^2_d}\\big(\\tfrac{\\lambda}{\\sigma_s^2+\\sigma^2}\\big)'}</Tex></span>.
          </p>
        }
        proof={energyProof}
      />
    </div>
  )
}
