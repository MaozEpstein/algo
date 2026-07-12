import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import LikelihoodExplorer from '../../../viz/LikelihoodExplorer'

const gaussProof: ComplexityProof = {
  result: '\\hat\\mu=\\tfrac1N\\textstyle\\sum y_i,\\quad \\hat\\sigma^2=\\tfrac1N\\textstyle\\sum(y_i-\\hat\\mu)^2',
  claimHe: 'אמדי הנראות המרבית של הגאוסי — כאשר σ̂² יוצא מוטה.',
  steps: [
    { he: 'ה-log-נראות:', tex: '\\ell=C-N\\log\\sigma-\\tfrac{1}{2\\sigma^2}\\textstyle\\sum(y_i-\\mu)^2' },
    { he: 'משוואת הנראות ל-μ נותנת את ממוצע המדגם:', tex: '\\partial_\\mu\\ell=\\tfrac{1}{\\sigma^2}\\textstyle\\sum(y_i-\\mu)=0\\ \\Rightarrow\\ \\hat\\mu=\\tfrac1N\\textstyle\\sum y_i' },
    { he: 'ומשוואת הנראות ל-σ²:', tex: '\\hat\\sigma^2=\\tfrac1N\\textstyle\\sum(y_i-\\hat\\mu)^2' },
    { he: 'אבל σ̂² מוטה (לכל N סופי):', tex: 'E[\\hat\\sigma^2]=\\tfrac{N-1}{N}\\sigma^2' },
  ],
  intuitionHe: 'μ̂ לא-מוטה; σ̂² "מקטין" מעט כי הוא מודד פיזור סביב הממוצע המשוערך ולא האמיתי — ולכן מחלקים ב-N−1 לתיקון.',
}

/** Lesson 6 · Maximum likelihood — definition, examples, and the sandbox. */
export default function MleTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        titleHe="אמד הנראות המרבית (MLE)"
        tex="\hat\theta_{ML}(y)=\arg\max_\theta f(y;\theta)=\arg\max_\theta \log f(y;\theta)"
        meaningHe={
          'המתכון: בוחרים את ה-$\\theta$ ש<b>הכי מסביר</b> את הנתונים שנצפו. עובדים עם ה-<b>log</b> (מונוטוני) כדי שמכפלות ' +
          'יהפכו לסכומים, ומוצאים שיא ע״י <b>משוואת הנראות</b> $\\partial_\\theta\\log f=0$.'
        }
        example={
          <p>
            עבור <span dir="ltr"><Tex>{'N'}</Tex></span> דגימות בלתי-תלויות: <span dir="ltr"><Tex>{'\\hat\\theta_{ML}=\\arg\\max_\\theta\\sum_i\\log f(y_i;\\theta)'}</Tex></span>.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 23"
        kind="property"
        titleHe="MLE של ברנולי"
        tex="y_i\sim\mathrm{Ber}(\theta)\ \Rightarrow\ \hat\theta=\tfrac1N\textstyle\sum y_i=\tfrac kN"
        meaningHe={'האמד הוא פשוט <b>שכיחות ההצלחות</b>. הוא <b>לא-מוטה</b> ($E[\\hat\\theta]=\\theta$) ובעל שונות $\\theta(1-\\theta)/N$ — ולכן עקבי.'}
        example={<p>מתוך 10 הטלות עם 8 "עץ": <span dir="ltr"><Tex>{'\\hat\\theta=0.8'}</Tex></span>.</p>}
      />

      <DefinitionCard
        n="דוגמה 24"
        kind="property"
        titleHe="MLE של הגאוסי"
        tex="\hat\mu=\tfrac1N\textstyle\sum y_i\ \text{(לא-מוטה)},\quad \hat\sigma^2=\tfrac1N\textstyle\sum(y_i-\hat\mu)^2\ \text{(מוטה)}"
        meaningHe={
          'התוחלת נאמדת בממוצע המדגם (לא-מוטה, שונות $\\sigma^2/N$). השונות נאמדת בפיזור סביב הממוצע — אבל היא ' +
          '<b>מוטה</b>: $E[\\hat\\sigma^2]=\\tfrac{N-1}{N}\\sigma^2$, ולכן "תיקון בסל" מחלק ב-$N-1$.'
        }
        example={
          <p>
            זו הסיבה שבמחשבון/אקסל יש שתי נוסחאות שונות לשונות — חלוקה ב-<span dir="ltr"><Tex>{'N'}</Tex></span> (MLE) מול{' '}
            <span dir="ltr"><Tex>{'N-1'}</Tex></span> (לא-מוטה).
          </p>
        }
        proof={gaussProof}
      />

      <Panel title="עוד אמדי נראות מרבית">
        <div className="grid gap-2 sm:grid-cols-2 text-sm leading-relaxed text-slate-600">
          <div className="rounded-lg bg-slate-50 px-3 py-2">מעריכי <Tex>{'\\mathrm{Exp}(1/\\theta)'}</Tex>: <b><Tex>{'\\hat\\theta=\\text{mean}'}</Tex></b> (לא-מוטה).</div>
          <div className="rounded-lg bg-slate-50 px-3 py-2">אחיד <Tex>{'U(0,\\theta)'}</Tex>: <b><Tex>{'\\hat\\theta=\\max_i y_i'}</Tex></b> (מוטה — ראו תרגול).</div>
        </div>
      </Panel>

      <Panel title="🎛️ ארגז חול — הנראות מגיעה לשיא ב-θ̂">
        <p className="mb-3 leading-relaxed text-slate-600">
          הנקודות הן הנתונים; גררו את <span dir="ltr"><Tex>{'\\theta'}</Tex></span> ותראו את הצפיפות "מתלבשת" עליהם ואת עקומת
          ה-log-נראות <span dir="ltr"><Tex>{'\\ell(\\theta)'}</Tex></span> מגיעה לשיא — בדיוק ב-<span dir="ltr"><Tex>{'\\hat\\theta_{ML}'}</Tex></span> (ממוצע המדגם).
        </p>
        <LikelihoodExplorer />
      </Panel>
    </div>
  )
}
