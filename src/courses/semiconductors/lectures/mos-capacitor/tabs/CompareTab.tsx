import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import CapacitorComparison from '../components/CapacitorComparison'

/** Lesson 6א — the MOS capacitor compared to a parallel-plate capacitor. */
export default function CompareTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="קבל-לוחות מול קבל-MOS">
        <p className="leading-relaxed text-slate-700">
          קבל-MOS הוא בעצם <b>קבל</b> — אבל לוח אחד הוא <b>מוליך-למחצה</b> שמגיב למתח. נשווה את השניים זה ליד זה:
          מבנה, צפיפות-מטען <Tex>{'\\rho(x)'}</Tex>, ושדה <Tex>{'E(x)'}</Tex>, מיושרים זה מתחת לזה.
        </p>
        <div className="mt-3">
          <CapacitorComparison />
        </div>
      </Panel>

      <Panel title="מה ההבדל המהותי?">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            <b>בקבל-לוחות</b> שני הלוחות מתכתיים: המטען הוא <b>יריעת-משטח</b> דקה על כל לוח, והשדה <b>קבוע</b> בין הלוחות.
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b>בקבל-MOS</b> צד המתכת עדיין יריעת-מטען, אך בצד המוליך-למחצה המטען <b>מתפרש על רוחב-דלדול</b> —
            ולכן השדה קבוע באוקסיד אך <b>דועך</b> לאורך אזור-הדלדול. בדיוק כאן נכנס משטר-הפעולה.
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          המסקנה: השער שולט במטען בפני-השטח של המוליך-למחצה — וכמה מטען (ואיזה <b>סוג</b>) תלוי ב-<Tex>{'V_G'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
