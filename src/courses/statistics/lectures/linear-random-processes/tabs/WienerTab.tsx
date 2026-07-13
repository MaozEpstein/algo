import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const wienerProof: ComplexityProof = {
  result: 'h=R_Y^{-1}r_{XY}',
  claimHe: 'מקדמי מסנן וינר האופטימלי מקיימים את המשוואות הנורמליות (משוואות 331–334).',
  steps: [
    { he: 'ה-MSE כפונקציה של המקדמים h:', tex: '\\mathrm{MSE}=E[X_k^2]-2h^\\top r_{XY}+h^\\top R_Y h' },
    { he: 'גוזרים לפי h ומשווים לאפס:', tex: '-2r_{XY}+2R_Y h=0' },
    { he: 'המשוואות הנורמליות:', tex: 'R_Y h=r_{XY}\\ \\Rightarrow\\ h=R_Y^{-1}r_{XY}' },
    { he: 'זהו עקרון האורתוגונליות: השגיאה ניצבת לכל המדידות:', tex: 'E\\big[(X_k-h^\\top Y)\\,Y\\big]=0' },
  ],
  intuitionHe: 'אותן משוואות נורמליות בדיוק כמו בריבועים פחותים (שיעור 7) וב-LMMSE הווקטורי (שיעור 9) — רק שכאן ה"מטריצה" בנויה מהאוטו-קורלציה של התהליך.',
}

/** Lesson 12 · Wiener — the finite-horizon optimal linear filter. */
export default function WienerTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הבעיה — לשחזר אות נקי מתוך מדידות רועשות">
        <p className="leading-relaxed text-slate-700">
          נתון <span dir="ltr"><Tex>{'Y_n=X_n+W_n'}</Tex></span> (<span dir="ltr"><Tex>{'n=1,\\dots,N'}</Tex></span>), כאשר <span dir="ltr"><Tex>{'X'}</Tex></span> הוא אות
          WSS מרכזי ו-<span dir="ltr"><Tex>{'W'}</Tex></span> רעש לבן בלתי-תלוי. רוצים לאמוד את <span dir="ltr"><Tex>{'X_k'}</Tex></span> ע"י <b>שילוב לינארי</b> של כל המדידות.
        </p>
      </Panel>

      <DefinitionCard
        n="דוגמה 48"
        kind="theorem"
        titleHe="מסנן וינר — המשוואות הנורמליות"
        tex="\hat X_k=h^\top Y,\qquad h=R_Y^{-1}r_{XY}"
        meaningHe={
          'המסנן הלינארי שממזער את השגיאה הריבועית נתון ע"י ה<b>משוואות הנורמליות</b>: מטריצת האוטו-קורלציה של המדידות ' +
          '$R_Y$ כפול וקטור המקדמים = וקטור הקרוס-קורלציה $r_{XY}$. זהו ה-LMMSE של שיעור 9 — לאורך זמן.'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'r_{XY}=E[X_k Y]'}</Tex></span> (קרוס-קורלציה), <span dir="ltr"><Tex>{'R_Y=E[YY^\\top]'}</Tex></span> (אוטו-קורלציה של המדידות).
          </p>
        }
        proof={wienerProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="המקרה הפרטי — כניסת AR ברעש"
        tex="R_Y=R_X+\sigma_W^2 I,\qquad h=\big(R_X+\sigma_W^2 I\big)^{-1}r_{XY}"
        meaningHe={
          'כשהאות הוא AR, <span dir="ltr">$R_X(k)=\\sigma_V^2\\alpha^{|k|}/(1-\\alpha^2)$</span> ממלא את המטריצות. המדידות מוסיפות ' +
          '<span dir="ltr">$\\sigma_W^2 I$</span> לאלכסון — בדיוק צורת ה-<b>Ridge</b> משיעור 7!'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'r_{XY}=[R_X(k-1),\\dots,R_X(k-N)]^\\top'}</Tex></span>, <span dir="ltr"><Tex>{'(R_Y)_{ij}=R_X(i-j)+\\sigma_W^2\\delta_{ij}'}</Tex></span>.
            הרעש הלבן על האלכסון הוא זה שמייצב את ההיפוך.
          </p>
        }
      />

      <Panel title="החוט המקשר">
        <p className="leading-relaxed text-slate-600">
          מסנן וינר הוא נקודת המפגש של הקורס: <b>המשוואות הנורמליות</b> (שיעור 7), <b>ה-LMMSE הווקטורי</b> (שיעור 9),
          וה<b>אוטו-קורלציה</b> של תהליך WSS (שיעור 11) — כולם באים יחד לכדי מסנן אופטימלי אחד.
        </p>
      </Panel>
    </div>
  )
}
