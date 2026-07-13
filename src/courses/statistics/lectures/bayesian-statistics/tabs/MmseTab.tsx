import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import PosteriorExplorer from '../../../viz/PosteriorExplorer'

const mmseProof: ComplexityProof = {
  result: '\\hat\\theta_{MMSE}=E[\\theta\\mid Y=y]',
  claimHe: 'תחת עלות ריבועית, האמד האופטימלי הוא התוחלת המותנית (משפט 8.1).',
  steps: [
    { he: 'ממזערים את הסיכון בנפרד לכל y (האינטגרל הפנימי):', tex: '\\hat\\theta(y)=\\arg\\min_{\\hat\\theta}\\int(\\hat\\theta-\\theta)^2 f(\\theta\\mid y)\\,d\\theta' },
    { he: 'גוזרים לפי θ̂ ומשווים לאפס:', tex: '2\\int(\\hat\\theta-\\theta)f(\\theta\\mid y)\\,d\\theta=0' },
    { he: 'מבודדים:', tex: '\\hat\\theta(y)=\\int \\theta\\,f(\\theta\\mid y)\\,d\\theta=E[\\theta\\mid Y=y]' },
  ],
  intuitionHe: 'לכל y, "מרכז" ה-posterior הוא הניחוש שממזער את השגיאה הריבועית — כמו שהממוצע ממזער סטיות בריבוע.',
}

const orthProof: ComplexityProof = {
  result: 'E\\big[g(Y)\\,(\\hat\\theta-\\theta)\\big]=0',
  claimHe: 'שגיאת ה-MMSE ניצבת לכל פונקציה של המדידה — עקרון האורתוגונליות.',
  steps: [
    { he: 'לכל אמד אחר θ̄ מפרקים את השגיאה הריבועית:', tex: 'E[(\\bar\\theta-\\theta)^2]=E[(\\bar\\theta-\\hat\\theta)^2]+2E[(\\bar\\theta-\\hat\\theta)(\\hat\\theta-\\theta)]+E[(\\hat\\theta-\\theta)^2]' },
    { he: 'האיבר האמצעי מתאפס (אורתוגונליות, עם g=θ̄−θ̂):', tex: 'E\\big[g(Y)(\\hat\\theta-E[\\theta\\mid Y])\\big]=0' },
    { he: 'ולכן שום אמד אחר לא טוב יותר:', tex: 'E[(\\bar\\theta-\\theta)^2]\\ge E[(\\hat\\theta-\\theta)^2]' },
  ],
  intuitionHe: 'השגיאה "מנוצלת עד הסוף": אין שום פונקציה של הנתונים שיכולה להקטין אותה עוד — לכן ה-MMSE אופטימלי.',
}

/** Lesson 8 · MMSE — the posterior mean, orthogonality, and the sandbox. */
export default function MmseTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 8.1"
        kind="theorem"
        titleHe="MMSE = התוחלת המותנית"
        tex="\hat\theta_{MMSE}(y)=E[\theta\mid Y=y]"
        meaningHe={
          'כשעולת השגיאה היא <b>ריבועית</b> $(\\theta-\\hat\\theta)^2$, האמד שממזער אותה הוא בדיוק <b>ממוצע ה-posterior</b>. ' +
          'זהו הניחוש ה"מרכזי" ביותר בהינתן כל מה שראינו.'
        }
        example={
          <p>
            אותה תוחלת מותנית מ<b>שיעור 4</b>: עבור גאוסי משותף <span dir="ltr"><Tex>{'E[x\\mid y]'}</Tex></span> — הוא בדיוק ה-MMSE.
          </p>
        }
        proof={mmseProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="עקרון האורתוגונליות"
        tex="E\big[g(Y)\,(\hat\theta_{MMSE}-\theta)\big]=0\quad \forall g"
        meaningHe={'שגיאת ה-MMSE <b>ניצבת</b> לכל פונקציה של המדידה. זו אותה תמונה גיאומטרית של הטלה משיעור 7 (LS) — רק במרחב הסתברותי.'}
        example={
          <p>
            תוצאה שימושית: ערך ה-MMSE הוא <span dir="ltr"><Tex>{'E[\\mathrm{Var}(\\theta\\mid Y)]'}</Tex></span> — הפיזור הממוצע שנותר ב-posterior.
          </p>
        }
        proof={orthProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="המקרה הגאוסי — ממוצע משוקלל"
        tex="Y\sim N(\mu,\sigma_y^2),\ X=Y+W\ \Rightarrow\ \hat Y_{MMSE}=\tfrac{\sigma_y^2}{\sigma_y^2+\sigma_w^2}X+\tfrac{\sigma_w^2}{\sigma_y^2+\sigma_w^2}\mu"
        meaningHe={
          'כשה-prior וה-likelihood גאוסיים, ה-posterior גאוסי, וה-MMSE הוא <b>ממוצע משוקלל</b> של התצפית וה-prior. ' +
          'רעש קטן → נצמדים לנתונים; רעש גדול → נצמדים ל-prior.'
        }
        example={
          <p>
            מדחום רועש: המדידה מקבלת משקל <span dir="ltr"><Tex>{'\\sigma_y^2/(\\sigma_y^2+\\sigma_w^2)'}</Tex></span>. וה-MSE הבייסיאני:{' '}
            <span dir="ltr"><Tex>{'\\sigma_y^2\\sigma_w^2/(\\sigma_y^2+\\sigma_w^2)'}</Tex></span>.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — prior × likelihood → posterior">
        <p className="mb-3 leading-relaxed text-slate-600">
          במצב <b>גאוסי צמוד</b>: ה-posterior הוא ממוצע משוקלל — גררו את הרעש וראו אותו נע בין ה-prior לנתונים; שלושת האמדים
          מתלכדים. במצב <b>בטא (מוטה)</b>: התוחלת, השיא והחציון <b>נבדלים</b> — כאן פונקציית העלות באמת חשובה.
        </p>
        <PosteriorExplorer />
      </Panel>
    </div>
  )
}
