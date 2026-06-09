import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { scrAlphaSum, scrAnodeCurrent } from '../../../lib/junction'

/**
 * The latch condition made tangible. In real BJTs the gains α rise with current, so as
 * the gate/anode drive increases the loop sum α1+α2 climbs toward 1. The regenerative
 * current I_A=(α2·I_G+I_leak)/(1−(α1+α2)) blows up at α1+α2=1 — the device LATCHES on.
 * The slider sweeps the drive; the verdict flips blocking ↔ latched as the sum crosses 1.
 */
const IG = 1e-3 // A (gate current, fixed)
const ILEAK = 1e-6 // A

export default function LatchExplorer() {
  const [drive, setDrive] = useState(0.2)
  const a1 = Math.min(0.45 + 0.5 * drive, 0.999)
  const a2 = Math.min(0.4 + 0.55 * drive, 0.999)
  const sum = scrAlphaSum(a1, a2)
  const latched = sum >= 1
  const ia = scrAnodeCurrent(a1, a2, IG, ILEAK)
  const b1 = a1 / (1 - a1)
  const b2 = a2 / (1 - a2)

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>עוצמת ההנעה (זרם/שער)</>} value={drive} min={0} max={1} step={0.01} onChange={setDrive} display={`${(drive * 100).toFixed(0)}%`} />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Readout label="$\alpha_1$" value={a1.toFixed(3)} accent="border-rose-100 bg-rose-50" />
        <Readout label="$\alpha_2$" value={a2.toFixed(3)} accent="border-sky-100 bg-sky-50" />
        <Readout label="$\alpha_1+\alpha_2$" value={sum.toFixed(3)} accent={latched ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'} />
        <Readout label="$\beta_1\cdot\beta_2$" value={latched ? '≥ 1' : (b1 * b2).toFixed(2)} accent={latched ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'} />
      </div>

      {/* verdict */}
      <div className={`flex items-center justify-between gap-3 rounded-2xl border-s-4 px-4 py-3 ${latched ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}>
        <div>
          <p className={`text-base font-extrabold ${latched ? 'text-emerald-700' : 'text-slate-600'}`}>
            {latched ? '🔒 נעול — ON (הולכה רגנרטיבית)' : '⛔ חוסם — OFF'}
          </p>
          <p className="mt-0.5 text-sm text-slate-600" dir="rtl">
            {latched
              ? <>כש-<Tex>{'\\alpha_1+\\alpha_2\\ge1'}</Tex> המכנה מתאפס וה-<Tex>{'I_A'}</Tex> מתפרץ — המכשיר ננעל בעצמו.</>
              : <>כל עוד <Tex>{'\\alpha_1+\\alpha_2<1'}</Tex> המכשיר חוסם; הזרם זעיר ונשלט.</>}
          </p>
        </div>
        <div className="shrink-0 text-center">
          <span className="block text-xs text-slate-500"><Tex>{'I_A=\\dfrac{\\alpha_2 I_G+I_{leak}}{1-(\\alpha_1+\\alpha_2)}'}</Tex></span>
          <span className="mt-1 block font-mono text-lg font-bold text-slate-800" dir="ltr">{latched ? '→ ∞' : `${(ia * 1e3).toFixed(2)} mA`}</span>
        </div>
      </div>
    </div>
  )
}
