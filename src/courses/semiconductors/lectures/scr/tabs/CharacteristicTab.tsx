import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import ScrCharacteristic from '../components/ScrCharacteristic'

/** Lesson 4 — the S-shaped I-V characteristic with NDR and breakover. */
export default function CharacteristicTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אופיין זרם-מתח — I_A(V_AK)">
        <p className="leading-relaxed text-slate-700">
          האופיין הקדמי הוא בצורת <b>S</b> ומכיל אזור שבו <b>המתח יורד כשהזרם עולה</b> — התנגדות דיפרנציאלית
          שלילית (<b>NDR</b>, <Tex>{'dV/dI<0'}</Tex>). זה הופך את ה-SCR ל<b>מתג דו-מצבי</b> ולא לרכיב לינארי.
        </p>
        <div className="mt-3">
          <ScrCharacteristic />
        </div>
      </Panel>

      <Panel title="לקרוא את האופיין">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            <b>חסימה קדמית</b>: עד <Tex>{'V_{BF}'}</Tex> זורם רק זרם-דליפה זעיר (<Tex>{'J_2'}</Tex> חוסם).
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b>NDR</b>: בפריצה המשוב משתלט, והמתח <b>קורס</b> מ-<Tex>{'V_{BF}'}</Tex> אל מתח-הולכה נמוך.
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b>הולכה (ON)</b>: מתח נמוך (<Tex>{'\\sim1\\text{-}2\\,V'}</Tex>), זרם גדול — כמו דיודה מוליכה.
          </div>
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b>זרם החזקה</b> <Tex>{'I_H'}</Tex>: יורדים מתחתיו → ההתקן <b>נכבה</b> וחוזר לחסום.
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          זרם-שער <b>מקטין</b> את <Tex>{'V_{BF}'}</Tex>: ככל שמזריקים יותר, ההצתה מוקדמת יותר — ובזרם מספיק, ה-NDR
          נעלם וההתקן נדלק כבר במתח נמוך, בדיוק כמו דיודה. בכיוון ההפוך ה-SCR <b>חוסם</b> (שני צמתים הפוכים).
        </p>
      </Panel>
    </div>
  )
}
