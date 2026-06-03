import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import MinorityInjectionProfile from '../../pn-junction-bias/components/MinorityInjectionProfile'
import { MATERIALS, fmtVolt } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si

/**
 * Lecture 2א — the injected minority profile: in the neutral region the excess
 * minority concentration decays exponentially over a diffusion length, and the
 * slope at the depletion edge IS the diffusion current.
 */
export default function ProfileTab() {
  const [Va, setVa] = useState(0.4)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="הפרופיל של נושאי המיעוט המוזרקים">
        <p className="leading-relaxed text-slate-600">
          באזור הניטרלי אין שדה — הנושאים נעים ב<b>דיפוזיה</b> בלבד, ובמצב מתמיד מתקבל פתרון של דעיכה
          <b> מעריכית</b> מקצה אזור המחסור פנימה, על פני <b>אורך הדיפוזיה</b> <Tex>{'L_p=\\sqrt{D_p\\tau_p}'}</Tex>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'\\Delta p_n(x)=\\Delta p_n(0)\\,e^{-x/L_p}'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          הנקודה הקריטית: ה<b>שיפוע</b> של הפרופיל בקצה (<Tex>{'x=0'}</Tex>) הוא בדיוק מה שקובע את <b>זרם
          הדיפוזיה</b> — וזה מה שנגזור בלשונית הבאה. הזיזו את הממתח הקדמי וראו איך גובה ההזרקה (וממילא השיפוע)
          עולה מעריכית:
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Slider
              label={<>ממתח קדמי · <Tex>{'V_A'}</Tex></>}
              value={Va}
              min={0}
              max={0.6}
              step={0.02}
              onChange={setVa}
              display={fmtVolt(Va)}
            />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              ככל ש-<Tex>{'V_A'}</Tex> עולה, <Tex>{'\\Delta p_n(0)'}</Tex> מזנק (חוק הצומת), השיפוע בקצה
              נעשה תלול יותר, והזרם גדל.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <MinorityInjectionProfile Va={Va} Na={NA} Nd={ND} mat={mat} />
          </div>
        </div>
      </Panel>
    </div>
  )
}
