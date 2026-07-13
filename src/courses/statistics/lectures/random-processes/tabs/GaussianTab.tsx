import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 10 · Gaussian — finite-dimensional distributions + the Gaussian process. */
export default function GaussianTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך מתארים תהליך במלואו?">
        <p className="leading-relaxed text-slate-700">
          וקטור מקרי מתואר במלואו ע"י ה-CDF המשותף. תהליך הוא <b>אוסף אינסופי</b> של משתנים מקריים — אז מתארים אותו ע"י
          כל ה<b>התפלגויות הסוף-ממדיות</b>: ההתפלגות המשותפת של כל תת-קבוצה סופית של זמנים.
        </p>
      </Panel>

      <DefinitionCard
        titleHe="התפלגויות סוף-ממדיות"
        tex="F(t_1,\dots,t_N;\,x_1,\dots,x_N)=P\big(X(t_1)\le x_1,\dots,X(t_N)\le x_N\big)"
        meaningHe={
          'לכל בחירה סופית של רגעי זמן, ה-CDF המשותף של הדגימות באותם רגעים. אוסף כל ההתפלגויות הללו (לכל N ולכל בחירת זמנים) ' +
          'מגדיר את התהליך <b>במלואו</b>.'
        }
        example={
          <p>
            <b>דרישת עקביות (consistency):</b> אם שוליים של התפלגות דו-ממדית <span dir="ltr"><Tex>{'F_{X_1,X_2}'}</Tex></span> ושל{' '}
            <span dir="ltr"><Tex>{'F_{X_2,X_3}'}</Tex></span> — שתיהן חייבות להחזיר את אותה התפלגות חד-ממדית של{' '}
            <span dir="ltr"><Tex>{'X_2'}</Tex></span> בשוליים.
          </p>
        }
      />

      <DefinitionCard
        n="הגדרה 10.3"
        kind="definition"
        titleHe="תהליך גאוסי (GP)"
        tex="\forall k,\ t_1<\dots<t_k:\quad [x(t_1),\dots,x(t_k)]\ \text{הוא וקטור גאוסי}"
        meaningHe={
          'תהליך הוא <b>גאוסי</b> אם <b>כל</b> וקטור סופי של דגימות שלו הוא וקטור גאוסי רב-ממדי (שיעור 4). ' +
          'המשמעות המעשית: התהליך מתואר <b>במלואו</b> ע"י פונקציית התוחלת ומטריצת הקווריאנס בלבד.'
        }
        example={
          <p>
            הוא נקבע ע"י <span dir="ltr"><Tex>{'E[x(t_i)]'}</Tex></span> ו-<span dir="ltr"><Tex>{'C_x(t_i,t_j)'}</Tex></span>.
            דוגמאות: i.i.d גאוסי, ממוצע נע (MA) ואוטו-רגרסיה (AR) עם קלט גאוסי — כולם תהליכים גאוסיים.
          </p>
        }
      />

      <Panel title="הקשר לשיעור 4">
        <p className="leading-relaxed text-slate-600">
          התהליך הגאוסי הוא בדיוק ה<b>הכללה</b> של הווקטור הגאוסי הרב-ממדי משיעור 4 — רק עם אינסוף רכיבים המאונדקסים בזמן.
          כל התכונות היפות (סגירות תחת טרנספורם לינארי, אי-מתאם ⇐ אי-תלות) עוברות לכל תת-וקטור סופי.
        </p>
      </Panel>
    </div>
  )
}
