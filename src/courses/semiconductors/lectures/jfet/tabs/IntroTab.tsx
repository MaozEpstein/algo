import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import FetStructures from '../components/FetStructures'

/** Lesson 5 opener — what field-effect transistors are, the two families, and the course's MOSFET emphasis. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מה מיוחד בטרנזיסטורי אפקט-השדה (FET)?">
        <p className="leading-relaxed text-slate-700">
          ב<b>טרנזיסטור אפקט-השדה</b> (Field-Effect Transistor) <b>מתח</b>-השער שולט בזרם דרך התעלה — בעזרת
          <b> שדה חשמלי</b>, ולא ע״י הזרקת זרם כמו ב-BJT. השער בנוי כמעין <b>קבל</b>: הוא מצומד לתעלה אך
          <b> מבודד</b> ממנה חשמלית, ולכן כמעט אינו מושך זרם.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">שליטת-מתח</b> — מתח-השער קובע את הזרם (לא זרם-בסיס כמו ב-BJT).
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">התנגדות-כניסה עצומה</b> — השער מבודד מהתעלה, כמעט ללא זרם-שער.
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-violet-700">חד-קוטבי (unipolar)</b> — ההולכה ע״י סוג-נשא אחד (נשאי-הרוב בתעלה).
          </div>
        </div>
      </Panel>

      <Panel title="שני סוגים — אותו רעיון, שער אחר">
        <p className="leading-relaxed text-slate-700">
          ההבדל הוא <b>איך</b> בנוי ה"קבל" שמפעיל את התעלה:
        </p>
        <ul className="mt-2 mb-3 list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>JFET</b> — השער הוא <b>צומת <Tex>{'p\\text{-}n'}</Tex></b>: ההטיה האחורית מרחיבה אזור-מחסור ש<b>מצר</b> את התעלה.</li>
          <li><b>MOSFET</b> — השער הוא מתכת מעל <b>אוקסיד מבודד</b> (MOS): השדה <b>משרה/שולט</b> בתעלה דרך הדיאלקטרי.</li>
        </ul>
        <FetStructures />
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          בשני המקרים: <b>מקור</b> (S) ו<b>ניקוז</b> (D) בקצוות התעלה, ו<b>שער</b> (G) שולט במוליכותה דרך אזור-המחסור
          (JFET) או דרך הערוץ-המושרה מתחת לאוקסיד (MOSFET).
        </p>
      </Panel>

      <Panel title="דגש הקורס">
        <div className="rounded-xl border-s-4 border-amber-400 bg-amber-50 px-4 py-3 leading-relaxed text-amber-900">
          הקורס <b>מתעמק ב-MOSFET</b> — סוס-העבודה של האלקטרוניקה המודרנית (מעבדים, זיכרון, VLSI) — ועוסק
          ב-<b>JFET בקצרה</b>. לכן שיעור ה-JFET הזה <b>קומפקטי</b>, ואילו <b>קבל-MOS</b> ו-<b>MOSFET</b> (השיעורים
          הבאים) מקבלים את עיקר העומק.
        </div>
      </Panel>
    </div>
  )
}
