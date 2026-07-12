import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const consistProof: ComplexityProof = {
  result: '\\hat\\theta_{ML}\\ \\xrightarrow{\\ N\\to\\infty\\ }\\ \\theta_{\\text{true}}',
  claimHe: 'תחת תנאי רגולריות, אמד הנראות המרבית מתכנס לפרמטר האמיתי (משפט 6.2).',
  steps: [
    { he: 'לפי חוק המספרים הגדולים, ה-log-נראות הממוצעת מתכנסת לתוחלת:', tex: '\\tfrac1N\\textstyle\\sum_i\\log f(y_i;\\theta)\\ \\to\\ E_{\\text{true}}[\\log f(Y;\\theta)]' },
    { he: 'לכן האמד מתכנס אל הממקסם של התוחלת:', tex: '\\hat\\theta_{ML}\\to\\arg\\max_\\theta E_{\\text{true}}[\\log f(Y;\\theta)]' },
    { he: 'ואי-שוויון KL קובע שהממקסם הוא θ_true:', tex: 'E_{\\text{true}}\\Big[\\log\\tfrac{f(Y;\\theta_{\\text{true}})}{f(Y;\\theta)}\\Big]=D_{KL}\\ge 0' },
  ],
  intuitionHe: 'ה-KL מודד "מרחק" בין ההתפלגות האמיתית למועמדת ומתאפס רק בזהות — לכן האמת ממקסמת את הנראות הצפויה.',
}

/** Lesson 6 · Asymptotics — KL, consistency of the MLE, pros & cons. */
export default function AsymptoticsTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="למה 1"
        kind="property"
        titleHe="אי-שוויון קולבק-ליבלר (KL)"
        tex="D_{KL}(f_1,f_2)=E_{f_1}\!\Big[\log\tfrac{f_1(Y)}{f_2(Y)}\Big]\ \ge\ 0"
        meaningHe={
          'מדד "מרחק" (לא-סימטרי) בין שתי התפלגויות, שתמיד <b>אי-שלילי</b> ומתאפס רק כשהן זהות. ההוכחה משתמשת ' +
          'באי-שוויון $\\log z\\le z-1$.'
        }
        example={<p>זה הכלי שמבטיח שהפרמטר האמיתי הוא זה שממקסם את הנראות הצפויה.</p>}
      />

      <DefinitionCard
        n="משפט 6.2"
        kind="theorem"
        titleHe="עקביות אסימפטוטית של ה-MLE"
        tex="\hat\theta_{ML}\ \xrightarrow{\ N\to\infty\ }\ \theta_{\text{true}}"
        meaningHe={'עם מספיק נתונים, אמד הנראות המרבית <b>מתכנס</b> לערך האמיתי — שילוב של חוק המספרים הגדולים ואי-שוויון KL.'}
        example={<p>לכן MLE הוא "בטוח לטווח ארוך": ככל שאוספים יותר תצפיות, השגיאה נעלמת.</p>}
        proof={consistProof}
      />

      <Panel title="יתרונות וחסרונות של MLE">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 leading-relaxed">
            <b className="text-emerald-800">✓ יתרונות</b>
            <ul className="mt-1 list-disc space-y-1 ps-5 text-sm text-slate-600">
              <li>מתכון <b>אוניברסלי</b> — עובד לכל מודל הסתברותי.</li>
              <li><b>אסימפטוטית לא-מוטה</b>, ו-<Tex>{'\\mathrm{MSE}\\sim 1/N'}</Tex>.</li>
              <li>אסימפטוטית <b>יעיל</b> (המילה נאמרת בקורס — לא מוכחת).</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 leading-relaxed">
            <b className="text-rose-800">✗ חסרונות</b>
            <ul className="mt-1 list-disc space-y-1 ps-5 text-sm text-slate-600">
              <li>ל-<b>N סופי</b> לרוב <b>לא</b> אופטימלי ל-MSE (ראו האמד המכווץ).</li>
              <li>דורש <b>אופטימיזציה</b> (שעלולה להיות לא-קמורה).</li>
              <li>לא תמיד <b>קיים</b>.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
          הערה: הקורס אינו מפתח את חסם קרמר-ראו / אינפורמציית פישר — היעילות מוזכרת כתכונה בלבד. בשיעור הבא (ריבועים
          פחותים) נראה את הכוח של MLE כשהרעש <b>אינו גאוסי</b> — למשל רעש לפלס נותן אמד <b>חציון</b> במקום ממוצע.
        </p>
      </Panel>
    </div>
  )
}
