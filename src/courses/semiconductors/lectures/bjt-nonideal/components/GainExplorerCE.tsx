import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { earlyResistance, parallelR, transconductance, voltageGainCE } from '../../../lib/junction'

/**
 * Why the model matters: the common-emitter voltage gain A_v = −g_m·(r_o∥R_C).
 * Sliders for the bias current I_C (which sets g_m and r_o) and the load R_C let
 * the learner watch the gain build up — and see r_o (the Early effect) cap it as
 * R_C grows. A live g_m → (r_o∥R_C) → A_v cause-chain makes the derivation concrete.
 */
const VA = 60 // V — fixed Early voltage for this explorer

export default function GainExplorerCE() {
  const [icMa, setIcMa] = useState(1)
  const [rcK, setRcK] = useState(5)
  const ic = icMa / 1000 // A
  const rc = rcK * 1000 // Ω
  const gm = transconductance(ic) // S
  const ro = earlyResistance(VA, ic) // Ω
  const rLoad = parallelR(ro, rc) // Ω
  const av = voltageGainCE(gm, ro, rc) // V/V (negative)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <Slider label={<>זרם-עבודה · <Tex>{'I_C'}</Tex></>} value={icMa} min={0.1} max={10} step={0.1} onChange={setIcMa} display={`${icMa.toFixed(1)} mA`} />
        <Slider label={<>עומס-קולט · <Tex>{'R_C'}</Tex></>} value={rcK} min={0.5} max={50} step={0.5} onChange={setRcK} display={`${rcK.toFixed(1)} kΩ`} />
      </div>

      {/* g_m → (r_o ∥ R_C) → A_v cause-chain */}
      <div className="flex flex-wrap items-stretch justify-center gap-x-3 gap-y-2">
        <ChainCard tone="emerald" head={<Tex>{'g_m=I_C/V_T'}</Tex>} value={`${(gm * 1000).toFixed(1)} mS`} />
        <Arrow />
        <ChainCard tone="violet" head={<Tex>{'r_o\\parallel R_C'}</Tex>} value={`${(rLoad / 1000).toFixed(2)} kΩ`} />
        <Arrow />
        <ChainCard tone="rose" head={<Tex>{'A_v=-g_m(r_o\\parallel R_C)'}</Tex>} value={`${av.toFixed(0)} V/V`} big />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Readout label="מוליכות-מעבר $g_m$" value={`${(gm * 1000).toFixed(1)} mS`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="התנגדות-מוצא $r_o=V_A/I_C$" value={`${(ro / 1000).toFixed(0)} kΩ`} accent="border-violet-100 bg-violet-50" />
        <Readout label="הגבר-מתח $|A_v|$" value={`${Math.abs(av).toFixed(0)}×`} accent="border-rose-100 bg-rose-50" />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        ההגבר עולה עם <Tex>{'g_m'}</Tex> (כלומר עם זרם-העבודה) ועם העומס — אבל <b><Tex>{'r_o'}</Tex> (אפקט Early) חוסם אותו</b>:
        כש-<Tex>{'R_C\\!\\gg\\!r_o'}</Tex> ההגבר רווי סביב <Tex>{'-g_m r_o=-V_A/V_T'}</Tex>, ה<b>הגבר-המרבי</b> של הקומה.
      </p>
    </div>
  )
}

const TONES = {
  emerald: 'border-emerald-200 bg-emerald-50/60 text-emerald-700',
  violet: 'border-violet-200 bg-violet-50/60 text-violet-700',
  rose: 'border-rose-200 bg-rose-50/60 text-rose-700',
} as const

function ChainCard({ tone, head, value, big }: { tone: keyof typeof TONES; head: React.ReactNode; value: string; big?: boolean }) {
  return (
    <div className={`flex w-44 flex-col items-center rounded-xl border px-3 py-3 text-center ${TONES[tone]}`}>
      <div className="text-xs leading-snug" dir="ltr">{head}</div>
      <p className={`mt-1 font-mono font-bold text-slate-800 ${big ? 'text-xl' : 'text-base'}`} dir="ltr">{value}</p>
    </div>
  )
}

function Arrow() {
  return <span className="self-center text-2xl font-bold text-slate-300" aria-hidden>←</span>
}
