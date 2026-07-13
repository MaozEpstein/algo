import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 11 · Intro — why two moments, and the mean/autocorrelation/autocovariance. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="למה מסתפקים בשני מומנטים?">
        <p className="leading-relaxed text-slate-700">
          אפיון <b>מלא</b> של תהליך (כל ההתפלגויות הסוף-ממדיות משיעור 10) הוא לרוב בלתי-ישים. לכן נסתפק ב<b>שני המומנטים
          הראשונים</b> — פונקציית התוחלת והאוטו-קורלציה. הם <b>אינטואיטיביים</b>, דורשים <b>פחות אחסון</b>, וקל
          <b> להעריך</b> אותם מנתונים.
        </p>
      </Panel>

      <DefinitionCard
        n="הגדרה 11.1"
        titleHe="שני המומנטים של תהליך"
        tex="\mu_X(t)=E[X(t)],\qquad R_X(t_1,t_2)=E[X(t_1)X(t_2)]"
        meaningHe={
          '<b>פונקציית התוחלת</b> $\\mu_X(t)$ נותנת את "המרכז" בכל רגע. ה<b>אוטו-קורלציה</b> $R_X(t_1,t_2)$ מודדת עד כמה ' +
          'שתי דגימות של התהליך "נעות יחד". היא <b>סימטרית</b>: $R_X(t_1,t_2)=R_X(t_2,t_1)$.'
        }
        example={
          <p>
            ה<b>אוטו-קווריאנס</b> הוא האוטו-קורלציה בניכוי התוחלות:{' '}
            <span dir="ltr"><Tex>{'C_X(t_1,t_2)=R_X(t_1,t_2)-\\mu_X(t_1)\\mu_X(t_2)'}</Tex></span> — בדיוק הקווריאנס משיעור 2, לכל זוג זמנים.
          </p>
        }
      />

      <DefinitionCard
        kind="property"
        titleHe="מקדמי מתאם וחסם קושי-שוורץ"
        tex="\rho(t_1,t_2)=\dfrac{C_X(t_1,t_2)}{\sqrt{C_X(t_1,t_1)\,C_X(t_2,t_2)}}\in[-1,1]"
        meaningHe={
          'כמו בשיעור 2, מנרמלים את הקווריאנס לקבל מקדם מתאם בין $-1$ ל-$1$. החסם נובע מ<b>אי-שוויון קושי-שוורץ</b>: ' +
          '$E^2[XY]\\le E[X^2]E[Y^2]$.'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'r(t_1,t_2)=R_X(t_1,t_2)/\\sqrt{R_X(t_1,t_1)R_X(t_2,t_2)}'}</Tex></span> — הגרסה הלא-מנוכה (סביב האפס).
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם <b>סטציונריות רחבה (WSS)</b> ותכונות האוטו-קורלציה; אחר-כך <b>דוגמאות</b> (קוסינוס, MA, מהלך מקרי, AR);
          ולבסוף <b>מערכות LTI</b> — איך סינון משנה את המומנטים. את הספקטרום (התמרת פורייה של <span dir="ltr"><Tex>{'R_X'}</Tex></span>) נראה בשיעור 12.
        </p>
      </Panel>
    </div>
  )
}
