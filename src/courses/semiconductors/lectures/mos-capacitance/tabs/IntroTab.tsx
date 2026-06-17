import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 6ג intro — the conceptual transition from DC (static) to AC (capacitance). */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מטרת החלק — המעבר ל-AC">
        <div className="rounded-2xl border-s-4 border-violet-500 bg-violet-50/70 p-4 leading-relaxed text-slate-700">
          <p>
            עד עכשיו (חלקים א׳-ב׳) עבדנו ב-<b>DC</b>: מתח-שער <b>קבוע</b> ומצב <b>סטטי</b> — איזה מטען יושב היכן.
            כעת עוברים ל-<b>AC</b>: מניחים <b>אות-קטן</b> מתחלף <Tex>{'v_g\\sim'}</Tex> <b>מעל</b> מתח-ה-DC, ושואלים
            כמה מטען <Tex>{'\\Delta Q_G'}</Tex> נכנס/יוצא בתגובה. היחס הזה הוא <b>הקיבול</b>:
          </p>
          <div className="my-3 rounded-xl border-2 border-violet-300 bg-white p-3 text-center">
            <Tex block>{'C \\equiv \\dfrac{dQ_G}{dV_G}'}</Tex>
          </div>
          <p className="text-sm text-slate-600">
            הקיבול <b>חושף פיזיקה שלא נראית ב-DC</b>: <i>מי</i> מהמטענים מספיק להגיב, <i>היכן</i> הוא יושב, וכמה <i>מהר</i>
            {' '}הוא זז — ולכן הוא <b>תלוי-תדר</b>. זה לב המדידה של קבל ה-MOS.
          </p>
        </div>
      </Panel>

      <Panel title='מהו "אות-קטן"?'>
        <p className="leading-relaxed text-slate-700">
          מפרקים את המתח לשניים: רכיב <b>DC</b> גדול שקובע את <b>נקודת-העבודה</b> (המשטר — הצטברות / מחסור / היפוך),
          ורכיב <b>AC</b> זעיר <Tex>{'v_g\\sin\\omega t'}</Tex> שמטלטל סביבה. מכיוון שהאות קטן, התגובה <b>ליניארית</b>
          {' '}ואפשר לדבר על <b>קיבול שקול</b> סביב נקודת-העבודה — בדיוק כמו נגד-דיפרנציאלי בדיודה.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
            <b className="text-slate-700">חלק א׳ · DC איכותי</b>
            <p className="mt-1 text-slate-500">מה קורה בכל משטר.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
            <b className="text-slate-700">חלק ב׳ · DC כמותי</b>
            <p className="mt-1 text-slate-500"><Tex>{'Q_s,\\,V_T'}</Tex>, מטעני-אוקסיד.</p>
          </div>
          <div className="rounded-xl border-2 border-violet-300 bg-violet-50/60 p-3 leading-relaxed">
            <b className="text-violet-800">חלק ג׳ · AC / קיבול</b>
            <p className="mt-1 text-slate-600">הקיבול, המעגל השקול, התדר ו-<Tex>{'C\\text{-}V'}</Tex>. (כאן)</p>
          </div>
        </div>
      </Panel>

      <Panel title="מה נלמד כאן">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>הקיבולים</b> של הקבל — <Tex>{'C_{ox},\\,C_{dep},\\,C_s,\\,C_{ss}'}</Tex> וצירופם.</li>
          <li><b>הסכמה הקיבולית</b> — המעגל השקול לאות-קטן.</li>
          <li><b>תגובת התדר</b> — עקומות <Tex>{'C\\text{-}V'}</Tex> לתדר נמוך / גבוה / דלדול-עמוק.</li>
          <li><b>קבל מבוקר-צומת</b> (varactor) — קבל מתכוונן במתח.</li>
          <li><b>ארגז-החול המסכם</b> — כל קבל ה-MOS מקצה-לקצה, DC↔AC.</li>
        </ul>
      </Panel>
    </div>
  )
}
