import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import JfetStructure from '../components/JfetStructure'
import JfetSymbol from '../components/JfetSymbol'

/** Lesson 5א — what a JFET is, its n-channel structure, terminals and symbol. */
export default function StructureTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו טרנזיסטור-שדה מסוג JFET?">
        <p className="leading-relaxed text-slate-700">
          ה-<b>JFET</b> (Junction Field-Effect Transistor) הוא טרנזיסטור שבו <b>מתח</b> (ולא זרם, כמו ב-BJT) שולט
          בזרם. הוא בנוי מ<b>תעלה</b> מוליכה (כאן מסוג <Tex>{'n'}</Tex>) בין <b>מקור</b> (Source) ל<b>ניקוז</b> (Drain),
          ועל צדדיה שני שערי <Tex>{'p^+'}</Tex> (<b>Gate</b>). הצומת שער-תעלה מוטה <b>אחורה</b>, ואזור-המחסור שלו חודר
          לתעלה ו<b>מצר</b> אותה — כך השער שולט במוליכות בלי לצרוך זרם.
        </p>
      </Panel>

      <Panel title="המבנה (חתך)">
        <JfetStructure />
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          התעלה היא נתיב-המוליכות; ככל שאזור-המחסור של השער חודר עמוק יותר, התעלה צרה יותר וההתנגדות גבוהה יותר.
          בלי שום מתח-שער התעלה פתוחה לרווחה — מצב מוליך.
        </p>
      </Panel>

      <Panel title="הסמל הסכמטי">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <JfetSymbol />
          <p className="text-sm leading-relaxed text-slate-600">
            ניקוז (D) למעלה, מקור (S) למטה, ושער (G) בצד. ה<b>חץ של השער פונה פנימה</b> אל התעלה — סימן לתעלת
            <Tex>{'\\,n'}</Tex> (בתעלת <Tex>{'p'}</Tex> החץ פונה החוצה). בשימוש רגיל מפעילים <Tex>{'V_{GS}\\le0'}</Tex>
            (הטיה אחורה) ו-<Tex>{'V_{DS}>0'}</Tex>.
          </p>
        </div>
      </Panel>
    </div>
  )
}
