import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import MinorityInjectionProfile from '../components/MinorityInjectionProfile'
import Readout from '../components/Readout'
import { MATERIALS, fmtCarrier, fmtVolt, minorityAtEdge, niAt, thermalVoltage } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si

/**
 * Lecture 1ב — minority injection & the law of the junction: forward bias lifts
 * the minority concentration at the depletion edge by e^{V_A/V_T}; the excess
 * relaxes over a diffusion length. This is the BRIDGE: the injected charge that
 * recombines becomes the diode current — derived in the next (ideal-diode) part.
 */
export default function InjectionTab() {
  const [Va, setVa] = useState(0.4)
  const VT = thermalVoltage(300)
  const { factor, np0, edgeP } = useMemo(() => {
    const ni = niAt(mat, 300)
    const np0 = (ni * ni) / NA
    return { factor: Math.exp(Va / VT), np0, edgeP: minorityAtEdge(np0, Va) }
  }, [Va, VT])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="הזרקת נושאי מיעוט">
        <p className="leading-relaxed text-slate-600">
          כשהמחסום יורד (ממתח קדמי), נושאי רוב שחוצים את הצומת הופכים לנושאי <b>מיעוט עודפים</b> בצד השני:
          אלקטרונים מוזרקים לצד <b>p</b>, חורים מוזרקים לצד <b>n</b>. הריכוז בקצה אזור המחסור נקבע על-ידי{' '}
          <b>חוק הצומת</b>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'n_p(0)=n_{p0}\\,e^{V_A/V_T},\\qquad p_n(0)=p_{n0}\\,e^{V_A/V_T}'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          הגורם <Tex>{'e^{V_A/V_T}'}</Tex> הוא <b>מעריכי</b> — לכן אפילו ממתח קדמי קטן מקפיץ את ריכוז
          המיעוט בכמה סדרי-גודל. בממתח אחורי הגורם קטן מ-1, וריכוז המיעוט בקצה <b>צונח</b> אל ~0 (שאיבה).
        </p>
      </Panel>

      <Panel title="הזיזו את המתח — וראו את ההזרקה">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>מתח חיצוני · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={-0.3}
                max={0.6}
                step={0.02}
                onChange={setVa}
                display={fmtVolt(Va)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Readout label="גורם $e^{V_A/V_T}$" value={`×${factor < 1000 ? factor.toFixed(1) : fmtCarrier(factor)}`} accent="border-amber-100 bg-amber-50" />
              <Readout label="מיעוט בש״מ $n_{p0}$" value={`${fmtCarrier(np0)}`} accent="border-slate-100 bg-white" />
              <Readout label="בקצה $n_p(0)$" value={`${fmtCarrier(edgeP)}`} accent="border-sky-100 bg-sky-50" />
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              קו מקווקו = ריכוז שיווי-המשקל. הנקודה בקצה אזור המחסור קופצת איתו פי <Tex>{'e^{V_A/V_T}'}</Tex>,
              והעודף דועך חזרה אל שיווי-המשקל על פני <b>מרחק הדיפוזיה</b> <Tex>{'L=\\sqrt{D\\tau}'}</Tex> (מחלק א').
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">פרופיל המיעוט ליד הצומת</p>
            <MinorityInjectionProfile Va={Va} Na={NA} Nd={ND} mat={mat} />
          </div>
        </div>
      </Panel>

      <Panel title="הגשר אל זרם הדיודה">
        <p className="leading-relaxed text-slate-600">
          זה בדיוק המקום שבו הצומת הופך ל<b>דיודה</b>: נושאי המיעוט שהוזרקו מתפזרים אל תוך האזור הניטרלי
          ושם <b>נעלמים ברקומבינציה</b> עם נושאי הרוב. כדי לקיים את ההזרקה הזו ברציפות חייב לזרום מהמקור
          <b> זרם</b> — וזהו זרם הדיודה. מכיוון שריכוז ההזרקה <Tex>{'\\propto e^{V_A/V_T}'}</Tex>, גם הזרם יוצא
          מעריכי — וזו בדיוק משוואת הדיודה האידיאלית:
        </p>
        <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
          <Tex block>{'I = I_S\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          את הגזירה המלאה (כולל זרם הרוויה <Tex>{'I_S'}</Tex>) נעשה ב<b>חלק הבא</b> — הדיודה האידיאלית.
        </p>
      </Panel>
    </div>
  )
}
