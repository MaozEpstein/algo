import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'

/**
 * The switching-speed story made tangible: the base transit time τ_F = W_B²/(2D_n)
 * sets both the cutoff frequency (f_T ≈ 1/2πτ_F) and how fast the transistor turns
 * off (the stored base charge must be swept out first). A base-width slider drives
 * a live W_B → Q_B → τ_F → f_T cause-chain plus a proportional "base" bar, so a
 * thinner base visibly means less charge, shorter transit, faster switching.
 */
const DN = 25 // cm²/s — electron diffusion constant in the (p-type) base, typical

export default function SwitchingExplorer() {
  const [wbNm, setWbNm] = useState(500) // base width in nm
  const wb = wbNm * 1e-7 // cm
  const tau = (wb * wb) / (2 * DN) // s — base transit time
  const fT = 1 / (2 * Math.PI * tau) // Hz
  // charge scales with W_B² (∝ τ); show it relative to the widest base on the slider.
  const wbMax = 800
  const chargeRel = (wbNm / wbMax) ** 2

  const fmtHz = (f: number) => (f >= 1e9 ? `${(f / 1e9).toFixed(1)} GHz` : `${(f / 1e6).toFixed(0)} MHz`)
  const fmtT = (t: number) => (t < 1e-9 ? `${(t * 1e12).toFixed(0)} ps` : `${(t * 1e9).toFixed(2)} ns`)

  return (
    <div className="flex flex-col gap-3">
      {/* proportional base-width bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="ltr flex items-stretch gap-0.5" dir="ltr" style={{ height: 56 }}>
          <div className="grid w-16 place-items-center rounded-s-lg bg-sky-100 text-xs font-bold text-sky-700">E</div>
          <div
            className="grid place-items-center bg-amber-200 text-xs font-bold text-amber-800 transition-all"
            style={{ width: `${8 + (wbNm / wbMax) * 46}%` }}
          >
            {`בסיס · ${wbNm} nm`}
          </div>
          <div className="grid flex-1 place-items-center rounded-e-lg bg-rose-100 text-xs font-bold text-rose-700">C</div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <Slider label={<>רוחב-הבסיס · <Tex>{'W_B'}</Tex></>} value={wbNm} min={100} max={wbMax} step={20} onChange={setWbNm} display={`${wbNm} nm`} />
      </div>

      {/* W_B → Q_B → τ → f_T cause-chain */}
      <div className="flex flex-wrap items-stretch justify-center gap-x-3 gap-y-2">
        <ChainCard tone="amber" head={<Tex>{'W_B'}</Tex>} value={`${wbNm} nm`} />
        <Arrow />
        <ChainCard tone="amber" head={<><Tex>{'Q_B\\propto W_B^2'}</Tex></>} value={`${(chargeRel * 100).toFixed(0)}%`} />
        <Arrow />
        <ChainCard tone="sky" head={<Tex>{'\\tau_F=W_B^2/2D_n'}</Tex>} value={fmtT(tau)} />
        <Arrow />
        <ChainCard tone="emerald" head={<Tex>{'f_T\\approx 1/2\\pi\\tau_F'}</Tex>} value={fmtHz(fT)} big />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Readout label="מטען-בסיס יחסי $Q_B\propto W_B^2$" value={`${(chargeRel * 100).toFixed(0)} %`} accent="border-amber-100 bg-amber-50" />
        <Readout label="זמן-מעבר $\tau_F$" value={fmtT(tau)} accent="border-sky-100 bg-sky-50" />
        <Readout label="תדר-חיתוך $f_T$" value={fmtHz(fT)} accent="border-emerald-100 bg-emerald-50" />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        כדי לכבות טרנזיסטור-בהולכה צריך קודם <b>לשטוף את מטען-הבסיס האגור</b> <Tex>{'Q_B'}</Tex> — וזה מגביל את מהירות-המיתוג
        (בדיוק כמו אגירת-המטען בדיודה, שיעור 2ב). <b>בסיס דק יותר</b> ⇐ פחות מטען, זמן-מעבר <Tex>{'\\tau_F\\propto W_B^2'}</Tex> קצר
        בריבוע ⇐ <Tex>{'f_T'}</Tex> גבוה יותר ומיתוג מהיר יותר. זו הסיבה שבסיס דק הוא מפתח לטרנזיסטור מהיר.
      </p>
    </div>
  )
}

const TONES = {
  amber: 'border-amber-200 bg-amber-50/60 text-amber-700',
  sky: 'border-sky-200 bg-sky-50/60 text-sky-700',
  emerald: 'border-emerald-200 bg-emerald-50/60 text-emerald-700',
} as const

function ChainCard({ tone, head, value, big }: { tone: keyof typeof TONES; head: React.ReactNode; value: string; big?: boolean }) {
  return (
    <div className={`flex w-40 flex-col items-center rounded-xl border px-3 py-3 text-center ${TONES[tone]}`}>
      <div className="text-xs leading-snug" dir="ltr">{head}</div>
      <p className={`mt-1 font-mono font-bold text-slate-800 ${big ? 'text-xl' : 'text-base'}`} dir="ltr">{value}</p>
    </div>
  )
}

function Arrow() {
  return <span className="self-center text-2xl font-bold text-slate-300" aria-hidden>←</span>
}
