import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import OutputCharacteristics from '../components/OutputCharacteristics'

/** Lecture 3ב — common-emitter output characteristics I_C(V_CE). */
export default function OutputTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אופייני המוצא — I_C(V_CE)">
        <p className="leading-relaxed text-slate-700">
          זהו ה"דיוקן" של הטרנזיסטור כרכיב מעגלי: לכל זרם-בסיס <Tex>{'I_B'}</Tex> מקבלים עקומה של <Tex>{'I_C'}</Tex> מול{' '}
          <Tex>{'V_{CE}'}</Tex>. הקצוות מתאימים לשני מצבי-הפעולה שראינו בחלק א׳:
        </p>
        <div className="mt-3">
          <OutputCharacteristics />
        </div>
      </Panel>

      <Panel title="לקרוא את הגרף">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">אזור פעיל</b> (<Tex>{'V_{CE}>V_{CE,\\mathrm{sat}}'}</Tex>): העקומה <b>שטוחה</b> ב-<Tex>{'I_C\\approx\\beta I_B'}</Tex> — הטרנזיסטור <b>מגבר</b> (מקור-זרם נשלט).
          </div>
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-amber-700">רוויה</b> (<Tex>{'V_{CE}\\lesssim0.2\\,V'}</Tex>): הזרם <b>צונח</b> מהר לאפס — הטרנזיסטור <b>מפסק סגור</b>.
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          ה<b>מרווח</b> בין העקומות (לכל קפיצת <Tex>{'I_B'}</Tex> שווה) פרופורציוני ל-<Tex>{'\\beta'}</Tex>: ככל ש-<Tex>{'\\beta'}</Tex> גדול, העקומות מרוחקות יותר.
        </p>
      </Panel>
    </div>
  )
}
