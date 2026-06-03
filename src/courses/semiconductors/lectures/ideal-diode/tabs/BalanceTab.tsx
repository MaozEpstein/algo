import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import CurrentBalanceCurve from '../components/CurrentBalanceCurve'
import { MATERIALS, diodeCurrents, fmtCurrentDensity, fmtVolt, thermalVoltage } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si

/**
 * Lecture 2א — the conceptual bridge "PN junction → PN diode": the current is the
 * difference of two competing components (diffusion ∝ e^{V_A/V_T}, drift ≈ −I_S),
 * balanced at equilibrium and tipped by bias. Makes the "−1" and I_S physical,
 * names the junction→diode boundary, the rectifier identity, and what sustains
 * the current.
 */
export default function BalanceTab() {
  const [Va, setVa] = useState(0.0)
  const VT = thermalVoltage(300)
  const { Js, J, factor } = useMemo(() => {
    const c = diodeCurrents(NA, ND, mat, Va, 300)
    return { Js: c.Js, J: c.J, factor: Math.exp(Va / VT) }
  }, [Va, VT])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="משיווי-משקל — לזרם">
        <p className="leading-relaxed text-slate-600">
          בשיעור 1 הצומת היה <b>פסיבי</b>: זרם נטו אפס. אבל זה לא שקט — זהו <b>איזון דינמי</b> בין שני זרמים
          הפוכים שחוצים את הצומת כל הזמן:
        </p>
        <ul className="mt-3 list-disc space-y-2 ps-6 leading-relaxed text-slate-600 marker:text-violet-400">
          <li>
            <b className="text-amber-600">זרם דיפוזיה</b> — נושאי <b>רוב</b> שחומם מספיק כדי לטפס <b>מעל</b> המחסום.
            תלוי אקספוננציאלית בגובה המחסום, ולכן <Tex>{'\\propto e^{V_A/V_T}'}</Tex>.
          </li>
          <li>
            <b className="text-sky-600">זרם סחיפה/גנרציה</b> — נושאי <b>מיעוט</b> שמחליקים <b>במורד</b> המחסום.
            מוגבל בכמות המיעוט הזמין (גנרציה תרמית), ולכן <b>קבוע</b> וכמעט בלתי תלוי במתח — בדיוק{' '}
            <Tex>{'I_S'}</Tex>.
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-slate-600">
          בשיווי-משקל השניים <b>שווים והפוכים</b> ומתקזזים. <b>מתח חיצוני מפר את האיזון</b>: הוא מזיז את
          המחסום (ולכן את זרם הדיפוזיה אקספוננציאלית) בעוד זרם הסחיפה נשאר נעוץ ב-<Tex>{'I_S'}</Tex>. ההפרש =
          הזרם נטו:
        </p>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'I = I_{\\text{diff}} - I_{\\text{drift}} = I_S\\,e^{V_A/V_T} - I_S = I_S\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          וכך מתפרשים שני האיברים: ה-<b>«<Tex>{'-1'}</Tex>»</b> אינו טריק אלגברי אלא <b>זרם הסחיפה שתמיד שם</b>
          (שב-<Tex>{'V_A=0'}</Tex> מבטל בדיוק את הדיפוזיה); ו-<Tex>{'I_S'}</Tex> הוא <b>זרם החליפין המאוזן</b> של
          שיווי-המשקל.
        </p>
      </Panel>

      <Panel title="לראות את האיזון נשבר">
        <p className="leading-relaxed text-slate-600">
          גררו את <Tex>{'V_A'}</Tex> סביב שיווי-המשקל וראו את שלוש העקומות (ביחידות של <Tex>{'I_S'}</Tex>):
          ב-<Tex>{'V_A=0'}</Tex> הדיפוזיה (<Tex>{'+1'}</Tex>) והסחיפה (<Tex>{'-1'}</Tex>) מתקזזות לנטו <Tex>{'0'}</Tex>;
          קדמי מטה אל הדיפוזיה, אחורי משאיר רק את רצפת ה-<Tex>{'-I_S'}</Tex>.
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_minmax(0,1.15fr)] lg:items-center">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>ממתח · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={-0.15}
                max={0.05}
                step={0.005}
                onChange={setVa}
                display={fmtVolt(Va)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Readout label="זרם דיפוזיה (ביח׳ $I_S$)" value={`×${factor.toFixed(2)}`} accent="border-amber-100 bg-amber-50" />
              <Readout label="זרם סחיפה (ביח׳ $I_S$)" value="×(−1)" accent="border-sky-100 bg-sky-50" />
              <Readout label="זרם נטו (ביח׳ $I_S$)" value={`×${(factor - 1).toFixed(2)}`} accent="border-violet-100 bg-violet-50" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Readout label="זרם הרוויה $I_S$" value={fmtCurrentDensity(Js)} accent="border-rose-100 bg-rose-50" />
              <Readout label="זרם נטו $J$" value={fmtCurrentDensity(J)} accent="border-slate-100 bg-white" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <CurrentBalanceCurve Va={Va} />
          </div>
        </div>
      </Panel>

      <Panel title="מה בעצם «נושא» את הזרם?">
        <p className="leading-relaxed text-slate-600">
          הנושאים שהוזרקו מעבר לצומת <b>נעלמים בהדרגה ברקומבינציה</b> תוך כדי דיפוזיה באזור הניטרלי. כדי לקיים את הפרופיל הזה במצב
          מתמיד, ה<b>מעגל החיצוני</b> חייב לספק נושאים חדשים <b>ברציפות</b> — וזרימה רציפה זו <b>היא</b> הזרם
          המוליך. צומת מבודד לא יכול לקיים זאת (אין מאיפה לספק); דיודה <b>סגורה במעגל</b> כן — ולכן רק עכשיו,
          כשיש זרם מתמשך, מדובר ב<b>התקן</b> ולא רק במבנה אלקטרוסטטי.
        </p>
      </Panel>
    </div>
  )
}
