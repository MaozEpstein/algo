import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 6 · Intro — the estimation problem; probability vs likelihood. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="לאמוד פרמטר מתוך נתונים">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            בבדיקת השערות בחרנו בין <b>שתי</b> אפשרויות בדידות. עכשיו הפרמטר <span dir="ltr"><Tex>{'\\theta'}</Tex></span> הוא{' '}
            <b>רציף</b> (למשל תוחלת, שונות, הסתברות), ואנחנו רוצים <b>לאמוד</b> אותו מתוך התצפיות{' '}
            <span dir="ltr"><Tex>{'y'}</Tex></span>.
          </p>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/60 p-3 leading-relaxed">
            <b className="text-emerald-800">הסתברות מול נראות</b>
            <p className="mt-1 text-sm text-slate-600">
              "מה הסיכוי ל-100 עץ במטבע <b>הוגן</b>?" — זו <b>הסתברות</b> (θ ידוע, שואלים על הנתונים). "בהינתן 100 עץ,
              מה ה<b>נראות</b> שהמטבע הוגן?" — זו <b>נראות</b> <span dir="ltr"><Tex>{'L(y;\\theta)=f(y;\\theta)'}</Tex></span> (הנתונים ידועים, שואלים על θ).
            </p>
          </div>
        </div>
      </Panel>

      <DefinitionCard
        titleHe="אמד ושגיאה"
        tex="\hat\theta(Y)\ \text{אמד},\qquad E=\hat\theta(Y)-\theta\ \text{(שגיאה)}"
        meaningHe={
          'ה<b>אמד</b> $\\hat\\theta(Y)$ הוא פונקציה של הנתונים שמנסה לשחזר את $\\theta$. ה<b>שגיאה</b> $E$ היא משתנה מקרי ' +
          '(תלוי בנתונים האקראיים), ולכן נמדוד את איכות האמד דרך <b>תוחלת</b> וה<b>פיזור</b> של השגיאה.'
        }
        example={
          <p>
            כדי להעריך את הטמפרטורה של נגד ממדידות רועשות — האמד הטבעי הוא ממוצע המדידות, ואיכותו נמדדת בכמה הוא "קרוב" בממוצע.
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם <b>איך מודדים אמד</b> (הטיה, שונות, MSE); אחר-כך <b>אמד הנראות המרבית</b> — מתכון כללי שעובד לכל מודל
          הסתברותי; ולבסוף ה<b>תכונות האסימפטוטיות</b> שלו (עקביות).
        </p>
      </Panel>
    </div>
  )
}
