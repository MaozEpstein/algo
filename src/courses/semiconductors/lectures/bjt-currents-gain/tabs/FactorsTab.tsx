import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import { MATERIALS, baseTransportFactor, diffusionCoeff, diffusionLength, injectionEfficiency } from '../../../lib/junction'

const Si = MATERIALS.Si
const DB = diffusionCoeff(Si.mun) // electrons in the p-base
const DE = diffusionCoeff(Si.mup) // holes in the n-emitter
const LB = diffusionLength(DB, Si.taun) // cm
const LB_UM = LB * 1e4

/** Lecture 3ב — the two gain factors: injection efficiency γ and base transport b. */
export default function FactorsTab() {
  const [rExp, setRExp] = useState(2) // N_E/N_B = 10^rExp
  const [wbwe, setWbwe] = useState(0.4) // W_B/W_E
  const [wb, setWb] = useState(1) // µm

  const r = 10 ** rExp
  const gamma = injectionEfficiency(r, 1, DE, DB, 1, wbwe)
  const b = baseTransportFactor(wb * 1e-4, LB)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="נצילות ההזרקה γ — כמה מזרם-הפולט מועיל">
        <p className="leading-relaxed text-slate-700">
          רק האלקטרונים המוזרקים (<Tex>{'I_{nE}'}</Tex>) מועילים; החורים הנגדיים (<Tex>{'I_{pE}'}</Tex>) מבוזבזים.
          <Tex>{'\\;\\gamma=\\dfrac{1}{1+\\frac{N_B D_E W_B}{N_E D_B W_E}}'}</Tex>. כדי ש-<Tex>{'\\gamma\\to1'}</Tex> רוצים{' '}
          <b>פולט מסומם הרבה יותר מהבסיס</b>. גררו:
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Slider label={<>יחס סימום · <Tex>{'N_E/N_B'}</Tex></>} value={rExp} min={1} max={3} step={0.05} onChange={setRExp} display={`×${r < 1000 ? r.toFixed(0) : (r / 1000).toFixed(1) + 'K'}`} />
            <Slider label={<>יחס רוחב · <Tex>{'W_B/W_E'}</Tex></>} value={wbwe} min={0.1} max={1} step={0.05} onChange={setWbwe} display={wbwe.toFixed(2)} />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Readout label="נצילות הזרקה $\gamma$" value={gamma.toFixed(4)} accent="border-sky-100 bg-sky-50" />
            <Readout label="אובדן $1-\gamma$" value={`${((1 - gamma) * 100).toFixed(2)}%`} accent="border-rose-100 bg-rose-50" />
          </div>
        </div>
      </Panel>

      <Panel title="מקדם מעבר הבסיס b — כמה מההזרקה שורד">
        <p className="leading-relaxed text-slate-700">
          מהאלקטרונים שהוזרקו, רק חלק <b>שורד</b> את הדיפוזיה לרוחב הבסיס בלי להתרקומבן:{' '}
          <Tex>{'b=\\dfrac{1}{\\cosh(W_B/L_B)}\\approx1-\\dfrac{W_B^2}{2L_B^2}'}</Tex>. בסיס דק (<Tex>{'W_B\\ll L_B'}</Tex>) ⇐ <Tex>{'b\\to1'}</Tex>. גררו:
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 lg:items-center">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Slider label={<>רוחב הבסיס · <Tex>{'W_B'}</Tex></>} value={wb} min={0.2} max={6} step={0.1} onChange={setWb} display={`${wb.toFixed(1)} µm`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Readout label="אורך דיפוזיה $L_B$" value={`${LB_UM.toFixed(0)} µm`} accent="border-violet-100 bg-violet-50" />
            <Readout label="מקדם מעבר $b$" value={b.toFixed(4)} accent="border-emerald-100 bg-emerald-50" />
          </div>
        </div>
      </Panel>

      <Panel title="המכפלה">
        <p className="leading-relaxed text-slate-700 text-center">
          <Tex>{`\\alpha=\\gamma\\,b=${gamma.toFixed(3)}\\times${b.toFixed(3)}=${(gamma * b).toFixed(4)}`}</Tex> — וממנו <Tex>{'\\beta'}</Tex> בלשונית הבאה.
        </p>
      </Panel>
    </div>
  )
}
