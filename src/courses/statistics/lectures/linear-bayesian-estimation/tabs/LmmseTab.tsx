import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import LmmseExplorer from '../../../viz/LmmseExplorer'

const normalProof: ComplexityProof = {
  result: '\\hat x(y)=E[Xy^\\top]\\,E[yy^\\top]^{-1}\\,y',
  claimHe: 'האמד הלינארי x̂=aᵀy שממזער את השגיאה הריבועית מקיים את המשוואה הנורמלית (משפט 9.1).',
  steps: [
    { he: 'ממזערים את השגיאה הריבועית על פני a:', tex: '\\min_a E\\big[(a^\\top y-X)^2\\big]' },
    { he: 'מפתחים את הריבוע:', tex: 'a^\\top E[yy^\\top]a-2a^\\top E[yX]+E[X^2]' },
    { he: 'גוזרים לפי a ומשווים לאפס — המשוואה הנורמלית:', tex: 'E[yy^\\top]\\,a=E[yX]' },
    { he: 'מבודדים ומקבלים את האמד:', tex: 'a^\\top=E[Xy^\\top]E[yy^\\top]^{-1}\\ \\Rightarrow\\ \\hat x=E[Xy^\\top]E[yy^\\top]^{-1}y' },
  ],
  intuitionHe: 'בדיוק כמו במשוואות הנורמליות של ריבועים פחותים (שיעור 7) — רק שכאן הממוצע הוא תוחלת (על פני ההתפלגות) ולא סכום על מדגם.',
}

const orthProof: ComplexityProof = {
  result: 'E\\big[y\\,(a^\\top y-X)\\big]=0',
  claimHe: 'שגיאת ה-LMMSE ניצבת לכל פונקציה לינארית של המדידה — עקרון האורתוגונליות.',
  steps: [
    { he: 'המשוואה הנורמלית עצמה היא תנאי אורתוגונליות:', tex: 'E[yy^\\top]a-E[yX]=E\\big[y(a^\\top y-X)\\big]=0' },
    { he: 'הוכחה שנייה: מוסיפים ומחסירים את האמד האופטימלי âᵀy:', tex: 'E[(a^\\top y-X)^2]=E[(a^\\top y-\\hat a^\\top y)^2]+2\\underbrace{E[(a^\\top y-\\hat a^\\top y)(\\hat a^\\top y-X)]}_{=0}+E[(\\hat a^\\top y-X)^2]' },
    { he: 'האיבר האמצעי מתאפס כי âᵀy−âᵀy הוא פונקציה לינארית של y, והשגיאה ניצבת לה:', tex: 'E\\big[y(\\hat a^\\top y-X)\\big]=0' },
    { he: 'ולכן שום אמד לינארי אחר לא טוב יותר:', tex: 'E[(a^\\top y-X)^2]\\ge E[(\\hat a^\\top y-X)^2]' },
  ],
  intuitionHe: 'לעומת ה-MMSE המלא — ששגיאתו ניצבת לכל פונקציה של המדידה — כאן השגיאה ניצבת רק לפונקציות <b>לינאריות</b>. זה בדיוק מה שמבדיל LMMSE מ-MMSE.',
}

/** Lesson 9 · LMMSE — the normal equation, closed form, orthogonality, sandbox. */
export default function LmmseTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 9.1"
        kind="theorem"
        titleHe="אמד ה-LMMSE — הצורה הסגורה"
        tex="\hat x(y)=\mu_x+C_{xy}C_{yy}^{-1}(y-\mu_y),\qquad \mathrm{MSE}=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}"
        meaningHe={
          'האמד הלינארי הטוב ביותר הוא <b>אפיני</b>: מתחילים מהתוחלת המוקדמת $\\mu_x$, ומתקנים לפי כמה שהמדידה חרגה מהצפוי, ' +
          'משוקלל ב-<b>יחס הקווריאנסים</b> $C_{xy}C_{yy}^{-1}$. שונות השגיאה קטנה מ-$C_{xx}$ בדיוק בכמות שהמדידה "הסבירה".'
        }
        example={
          <p>
            סקלרי: <span dir="ltr"><Tex>{'\\hat x=\\mu_x+\\tfrac{\\sigma_{xy}}{\\sigma_y^2}(y-\\mu_y)'}</Tex></span>, ו-
            <span dir="ltr"><Tex>{'\\mathrm{mse}=\\sigma_x^2-\\sigma_{xy}^2/\\sigma_y^2=(1-\\rho^2)\\sigma_x^2'}</Tex></span>. אם{' '}
            <span dir="ltr"><Tex>{'\\sigma_{xy}=0'}</Tex></span> — האמד קורס לתוחלת המוקדמת <span dir="ltr"><Tex>{'\\mu_x'}</Tex></span>.
          </p>
        }
        proof={normalProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="עקרון האורתוגונליות"
        tex="E\big[y\,(a^\top y-X)\big]=0"
        meaningHe={
          'השגיאה <b>ניצבת</b> לכל פונקציה <b>לינארית</b> של המדידה. זו אותה תמונת-הטלה גיאומטרית משיעור 7, במרחב ההסתברותי: ' +
          'האמד הוא ההטלה של $X$ על תת-המרחב הנפרש ע"י המדידות.'
        }
        example={
          <p>
            בניגוד ל-MMSE המלא (שגיאה ניצבת ל<b>כל</b> פונקציה), כאן הניצבות היא רק ל<b>לינאריות</b> — ומכאן ש-LMMSE
            עשוי להיות תת-אופטימלי כשהקשר לא-לינארי.
          </p>
        }
        proof={orthProof}
      />

      <Panel title="🎛️ ארגז חול — קו ה-LMMSE בענן גאוסי">
        <p className="mb-3 leading-relaxed text-slate-600">
          גררו את ה<b>מתאם</b> <span dir="ltr"><Tex>{'\\rho'}</Tex></span> וראו כיצד קו ה-LMMSE מסתובב בתוך הענן, ורצועת השגיאה{' '}
          <span dir="ltr"><Tex>{'\\pm\\sqrt{1-\\rho^2}'}</Tex></span> מצטמצמת ככל שהמתאם חזק יותר. הזיזו את התצפית{' '}
          <span dir="ltr"><Tex>{'y^*'}</Tex></span> כדי לקרוא את האמד.
        </p>
        <LmmseExplorer />
      </Panel>
    </div>
  )
}
