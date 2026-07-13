import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import CLTExplorer from '../../../viz/CLTExplorer'

/** Overview · CLT — why the Gaussian is everywhere, made visible. */
export default function CLTTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="למה גאוסי נמצא בכל מקום?">
        <p className="leading-relaxed text-slate-700">
          התשובה היא <b>משפט הגבול המרכזי (CLT)</b>: כשמחברים (או ממצעים) הרבה משתנים מקריים בלתי-תלויים — לא משנה
          מאיזו התפלגות — התוצאה <b>שואפת לגאוסי</b>. זו הסיבה שהגאוסי הוא עמוד השדרה של הקורס, ולמה הוא ראשון בטבלה.
        </p>
      </Panel>

      <DefinitionCard
        titleHe="משפט הגבול המרכזי"
        tex="\bar X_n=\tfrac1n\sum_{i=1}^{n}X_i\ \xrightarrow[n\to\infty]{}\ N\!\left(\mu,\tfrac{\sigma^2}{n}\right)"
        meaningHe={
          'עבור $X_1,\\dots,X_n$ בלתי-תלויים ושווי-התפלגות עם תוחלת $\\mu$ ושונות $\\sigma^2$ — הממוצע שלהם מתפלג ' +
          '<b>בקירוב גאוסי</b>, עם אותה תוחלת $\\mu$ ושונות שמצטמצמת כ-$\\sigma^2/n$.'
        }
        example={
          <p>
            לכן סכום/ממוצע של רעשים קטנים בלתי-תלויים נראה "פעמון" — גם אם כל רעש בודד רחוק מגאוסי.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — ההתכנסות לפעמון">
        <p className="mb-3 leading-relaxed text-slate-600">
          בחרו התפלגות בסיס <b>לא-גאוסית</b> (אחיד / מעריכי / ברנולי), וגררו את <span dir="ltr"><Tex>{'n'}</Tex></span> — גודל המדגם שממצעים.
          ההיסטוגרמה של הממוצעים מתחדדת אל עקומת <span dir="ltr"><Tex>{'N(\\mu,\\sigma^2/n)'}</Tex></span> ככל ש-<span dir="ltr"><Tex>{'n'}</Tex></span> גדל.
        </p>
        <CLTExplorer />
      </Panel>
    </div>
  )
}
