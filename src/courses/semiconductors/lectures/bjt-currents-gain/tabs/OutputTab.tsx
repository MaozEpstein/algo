import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import InputCharacteristics from '../components/InputCharacteristics'
import OutputCharacteristics from '../components/OutputCharacteristics'
import CbOutputCharacteristics from '../components/CbOutputCharacteristics'

/** Lecture 3ב — input & output I-V characteristics for both configurations (CB & CE). */
export default function OutputTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אופייני כניסה — I(V_BE)">
        <p className="leading-relaxed text-slate-700">
          הכניסה בשתי התצורות היא צומת ה-<b>בסיס-פולט</b> המוטה קדמית — דיודה. ההבדל הוא רק <b>איזה זרם</b> מודדים:
          בתצורת בסיס-משותף הכניסה היא הפולט (<Tex>{'I_E'}</Tex>, גדול), ובתצורת פולט-משותף הכניסה היא הבסיס
          (<Tex>{'I_B\\approx I_E/(\\beta+1)'}</Tex>, קטן פי <Tex>{'\\beta'}</Tex> בערך).
        </p>
        <div className="mt-3">
          <InputCharacteristics />
        </div>
      </Panel>

      <Panel title="אופייני מוצא — CE: I_C(V_CE)">
        <p className="leading-relaxed text-slate-700">
          "דיוקן" הטרנזיסטור בתצורת <b>פולט-משותף</b>: לכל זרם-בסיס <Tex>{'I_B'}</Tex> עקומה של <Tex>{'I_C'}</Tex> מול <Tex>{'V_{CE}'}</Tex>.
        </p>
        <div className="mt-3">
          <OutputCharacteristics />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">אזור פעיל</b> (<Tex>{'V_{CE}>V_{CE,\\mathrm{sat}}'}</Tex>): שטוח ב-<Tex>{'I_C\\approx\\beta I_B'}</Tex> — מגבר. המרווח בין העקומות <Tex>{'\\propto\\beta'}</Tex>.
          </div>
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-amber-700">רוויה</b> (<Tex>{'V_{CE}\\lesssim0.2\\,V'}</Tex>): הזרם צונח — מפסק סגור.
          </div>
        </div>
      </Panel>

      <Panel title="אופייני מוצא — CB: I_C(V_CB)">
        <p className="leading-relaxed text-slate-700">
          בתצורת <b>בסיס-משותף</b> נשלטים על-ידי זרם-הפולט <Tex>{'I_E'}</Tex>: העקומות <b>שטוחות לחלוטין</b> ב-<Tex>{'I_C\\approx\\alpha I_E'}</Tex>
          (התנגדות-מוצא עצומה), בניגוד ל-CE שבו אפקט Early נותן שיפוע (3ג).
        </p>
        <div className="mt-3">
          <CbOutputCharacteristics />
        </div>
      </Panel>
    </div>
  )
}
