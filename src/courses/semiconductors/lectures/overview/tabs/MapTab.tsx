import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import ConceptMap from '../components/ConceptMap'

/** Overview · Map — the step-by-step "how understanding is built" concept map of the whole course. */
export default function MapTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מפת הקורס — איך נבנית ההבנה">
        <p className="leading-relaxed text-slate-700">
          הקורס אינו רשימת-התקנים מנותקים אלא <b>מגדל אחד</b>: כל שכבה נשענת על הקודמת. לחצו על
          {' '}<b>"בנה את ההבנה"</b> כדי לראות איך התמונה נבנית שלב-אחר-שלב — מהיסודות (<Tex>{'\\,'}</Tex>נושאים,
          פסים, סחיפה+דיפוזיה), דרך <b>הצומת</b> (אבן-הבניין של כמעט כל התקן), ועד למשפחות ההתקנים.
          כל צומת במפה <b>לחיץ</b> ומקפיץ ישירות לשיעור.
        </p>
        <ConceptMap />
      </Panel>

      <Panel title="שני החוטים המרכזיים">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-500 bg-sky-50/60 p-3 leading-relaxed">
            <b className="text-sky-800">ענף הצומת (p-n)</b>
            <p className="mt-1 text-sm text-slate-600">
              צומת PN → דיודה → BJT (שני צמתים) → SCR (ארבע שכבות). גם שוטקי והמגע האוהמי יושבים כאן
              (מתכת–מל"מ). המנוע: <b>הזרקת-מיעוט</b> וחוק-הצומת.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-amber-500 bg-amber-50/60 p-3 leading-relaxed">
            <b className="text-amber-800">ענף אפקט-השדה</b>
            <p className="mt-1 text-sm text-slate-600">
              קבל MOS → MOSFET → ההתקן המודרני, ובמקביל JFET. המנוע: <b>שליטה קיבולית/מחסור</b> במוליכות
              הערוץ — בלי זרם-שער.
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          שני הענפים נפגשים שוב ושוב: אותה אלקטרוסטטיקה <Tex>{'\\rho\\to E\\to V'}</Tex>, אותו
          {' '}<Tex>{'e^{qV/kT}'}</Tex>, ואותם אפקטים לא-אידיאליים (למשל <b>Early ≡ התקצרות-תעלה</b>). את הקשרים
          האלה נפרוש בלשוניות הבאות.
        </p>
      </Panel>
    </div>
  )
}
