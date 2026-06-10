import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import Readout from './Readout'
import { jfetGm, jfetTransfer, parallelR } from '../../../lib/junction'

/**
 * JFET common-source small-signal gain: A_v = −g_m·(r_o∥R_D). The bias V_GS sets g_m (and
 * I_D); the drain load R_D and the channel-length-modulation output resistance r_o=1/(λI_D)
 * close the gain. A live g_m → (r_o∥R_D) → A_v cause-chain. Units: g_m mA/V, R kΩ → A_v V/V.
 * (Mirrors the BJT GainExplorerCE.)
 */
const VP = 4 // |V_P|
const IDSS = 10 // mA
const LAMBDA = 0.02 // 1/V — channel-length modulation (sets r_o)

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
const Arrow = () => <span className="self-center text-2xl font-bold text-slate-300" aria-hidden>←</span>

export default function GainExplorerJfet() {
  const [vmag, setVmag] = useState(1) // |V_GS|
  const [rdK, setRdK] = useState(5)
  const vgs = -vmag
  const gm = jfetGm(vgs, VP, IDSS) // mA/V
  const id = jfetTransfer(vgs, VP, IDSS) // mA
  const ro = id > 0.001 ? 1 / (LAMBDA * id) : 1e6 // kΩ
  const rLoad = parallelR(ro, rdK) // kΩ
  const av = -gm * rLoad // V/V

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <Slider label={<>נקודת-עבודה · <Tex>{'V_{GS}'}</Tex></>} value={vmag} min={0} max={3.5} step={0.05} onChange={setVmag} display={`−${vmag.toFixed(2)} V`} />
        <Slider label={<>עומס-ניקוז · <Tex>{'R_D'}</Tex></>} value={rdK} min={0.5} max={50} step={0.5} onChange={setRdK} display={`${rdK.toFixed(1)} kΩ`} />
      </div>

      <div className="flex flex-wrap items-stretch justify-center gap-x-3 gap-y-2">
        <ChainCard tone="emerald" head={<Tex>{'g_m=\\tfrac{2I_{DSS}}{|V_P|}(1-\\tfrac{V_{GS}}{V_P})'}</Tex>} value={`${gm.toFixed(2)} mA/V`} />
        <Arrow />
        <ChainCard tone="violet" head={<Tex>{'r_o\\parallel R_D'}</Tex>} value={`${rLoad.toFixed(2)} kΩ`} />
        <Arrow />
        <ChainCard tone="rose" head={<Tex>{'A_v=-g_m(r_o\\parallel R_D)'}</Tex>} value={`${av.toFixed(1)} V/V`} big />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Readout label="זרם-עבודה $I_D$" value={`${id.toFixed(2)} mA`} accent="border-sky-100 bg-sky-50" />
        <Readout label={'התנגדות-מוצא $r_o=1/\\lambda I_D$'} value={`${ro > 999 ? '∞' : ro.toFixed(1)} kΩ`} accent="border-violet-100 bg-violet-50" />
        <Readout label="הגבר-מתח $|A_v|$" value={`${Math.abs(av).toFixed(1)}×`} accent="border-rose-100 bg-rose-50" />
      </div>

      <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        בתצורת <b>מקור-משותף</b> (Common-Source) ההגבר הוא <Tex>{'A_v=-g_m(r_o\\parallel R_D)'}</Tex> — <b>מהפך</b>,
        בדיוק כמו ה-CE ב-BJT. הוא עולה עם <Tex>{'g_m'}</Tex> (כלומר עם זרם-העבודה) ועם העומס, ונחסם ע״י <Tex>{'r_o'}</Tex>.
      </p>
    </div>
  )
}
