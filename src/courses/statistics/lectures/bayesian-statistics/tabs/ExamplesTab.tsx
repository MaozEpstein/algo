import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import SoftDecisionExplorer from '../../../viz/SoftDecisionExplorer'

/** Lesson 8 · Examples — the Gaussian channel and the MVN MMSE. */
export default function ExamplesTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="דוגמה 28"
        kind="property"
        titleHe="ביט בערוץ גאוסי — רך מול קשה"
        tex="X\sim\mathrm{Bern}(p),\ Y=X+N:\quad \hat X_{MMSE}=E[X\mid Y]\ (\text{סיגמואיד}),\ \ \hat X_{MAP}\ (\text{מדרגה})"
        meaningHe={
          'שולחים ביט <b>0/1</b> ומקבלים אותו עם רעש גאוסי. ה-<b>MMSE</b> נותן <b>החלטה רכה</b> — הסתברות ל-1 בצורת ' +
          '<b>סיגמואיד</b>. ה-<b>MAP</b> נותן <b>החלטה קשה</b> — 0 או 1 מעל/מתחת לסף $\\tfrac12+\\sigma^2\\ln\\tfrac{1-p}{p}$.'
        }
        example={
          <p>
            זו בדיוק ה-posterior הסיגמואידי מ<b>שיעור 1</b> (הערוץ הבינארי) — עכשיו כאמד MMSE בייסיאני, וה-MAP הוא הגלאי משיעור 5.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — החלטה רכה מול קשה">
        <p className="mb-3 leading-relaxed text-slate-600">
          העקומה הסגולה היא ה-<b>MMSE</b> (סיגמואיד), והמדרגה השחורה היא ה-<b>MAP</b>. הקטינו את הרעש והסיגמואיד מתחדד למדרגה;
          שנו את ה-prior <span dir="ltr"><Tex>{'p'}</Tex></span> והסף זז.
        </p>
        <SoftDecisionExplorer />
      </Panel>

      <DefinitionCard
        n="דוגמה 29"
        kind="property"
        titleHe="MMSE בגאוסי המשותף"
        tex="\hat X_{MMSE}(y)=\rho y,\quad \mathrm{MSE}=1-\rho^2,\quad E[X^2\mid y]=1-\rho^2+(\rho y)^2"
        meaningHe={
          'עבור זוג גאוסי סטנדרטי עם מתאם $\\rho$: הניחוש הטוב ביותר ל-$X$ מתוך $y$ הוא הקו $\\rho y$, והשגיאה $1-\\rho^2$. ' +
          '<b>שימו לב</b>: MMSE של $X^2$ אינו $(\\rho y)^2$ — צריך להוסיף את השונות המותנית $1-\\rho^2$.'
        }
        example={
          <p>
            טעות נפוצה: <span dir="ltr"><Tex>{'E[X^2\\mid y]\\ne(E[X\\mid y])^2'}</Tex></span> — תמיד יש את איבר השונות המותנית.
          </p>
        }
      />

      <Panel title="חיבורים">
        <ul className="space-y-2 leading-relaxed text-slate-700">
          <li><b>שיעור 1:</b> ה-posterior הסיגמואידי של הערוץ הבינארי — הוא ה-MMSE כאן.</li>
          <li><b>שיעור 4:</b> התוחלת המותנית של גאוסי משותף <Tex>{'E[x\\mid y]'}</Tex> <b>היא</b> ה-MMSE.</li>
          <li><b>שיעור 5:</b> ה-MAP הבייסיאני הוא בדיוק כלל הגילוי ממזער-השגיאה.</li>
        </ul>
      </Panel>
    </div>
  )
}
