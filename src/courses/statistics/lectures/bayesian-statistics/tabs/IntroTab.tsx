import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 8 · Intro — the Bayesian view: a prior turns into a posterior. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הפרמטר עצמו הופך למשתנה מקרי">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            בשיעורים 6–7 הפרמטר <span dir="ltr"><Tex>{'\\theta'}</Tex></span> היה <b>קבוע לא-ידוע</b>. בגישה ה<b>בייסיאנית</b> הוא
            <b> משתנה מקרי</b> עם <b>התפלגות מוקדמת (prior)</b> ידועה — ואנחנו <b>מעדכנים</b> את האמונה שלנו לאחר שראינו את הנתונים.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border-s-4 border-slate-400 bg-slate-50/70 p-3">
              <b className="text-slate-700">Prior</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'f(\\theta)'}</Tex> — מה שידענו לפני.</p>
            </div>
            <div className="rounded-xl border-s-4 border-sky-500 bg-sky-50/60 p-3">
              <b className="text-sky-800">Likelihood</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'f(y\\mid\\theta)'}</Tex> — מודל המדידה.</p>
            </div>
            <div className="rounded-xl border-s-4 border-emerald-500 bg-emerald-50/60 p-3">
              <b className="text-emerald-800">Posterior</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'f(\\theta\\mid y)'}</Tex> — מה שיודעים אחרי.</p>
            </div>
          </div>
        </div>
      </Panel>

      <DefinitionCard
        titleHe="בייס והסיכון הבייסיאני"
        tex="f(\theta\mid y)=\dfrac{f(y\mid\theta)\,f(\theta)}{f(y)},\qquad \hat\theta\ \Leftarrow\ \min_{\hat\theta(\cdot)} E\big[c(\hat\theta-\theta)\big]"
        meaningHe={
          'מחשבים את ה-posterior דרך בייס, ואז בוחרים אמד ש<b>ממזער את העלות הצפויה</b> (הסיכון הבייסיאני). ' +
          'בניגוד ל-ML/LS — שם מזערנו שגיאה ב-$y$ ולא ב-$\\theta$ — כאן ממזערים <b>ישירות</b> את השגיאה ב-$\\theta$.'
        }
        example={
          <p>
            <b>פונקציית העלות</b> <span dir="ltr"><Tex>{'c(e)'}</Tex></span> קובעת את האמד: ריבוע → תוחלת; 0-1 → שיא; ערך מוחלט → חציון.
            זה הלב של השיעור.
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם <b>MMSE</b> (עלות ריבועית → תוחלת מותנית); אחר-כך <b>פונקציות עלות אחרות</b> (MAP וחציון); ולבסוף
          <b> דוגמאות</b> — כולל ההחלטה הרכה מול הקשה בערוץ גאוסי, שמחברת חזרה לשיעורים 1, 4 ו-5.
        </p>
      </Panel>
    </div>
  )
}
