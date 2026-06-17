import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import PlayButton from '../../../components/PlayButton'
import { useAutoSweep } from '../../../components/useAutoSweep'
import Readout from '../components/Readout'
import IVCurve from '../components/IVCurve'
import MinorityInjectionProfile from '../../pn-junction-bias/components/MinorityInjectionProfile'
import {
  MATERIALS,
  MATERIAL_LIST,
  diffusionCoeff,
  diffusionLength,
  diodeCurrents,
  fmtCurrentDensity,
  fmtDoping,
  fmtLength,
  fmtVolt,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

interface Preset {
  labelHe: string
  va: number
  noteHe: string
}
const PRESETS: Preset[] = [
  { labelHe: 'שיווי משקל', va: 0, noteHe: 'אין מתח — הסוגריים מתאפסות והזרם אפס.' },
  { labelHe: 'קדמי קל +0.4V', va: 0.4, noteHe: 'מתחת לברך — הזרם עדיין קטן, אך גדל מעריכית.' },
  { labelHe: 'קדמי +0.7V', va: 0.7, noteHe: 'מעל הברך — הדיודה "פתוחה" וזורם זרם גדול.' },
  { labelHe: 'אחורי −1V', va: -1, noteHe: 'רק זרם רוויה זעיר $\\approx -J_S$.' },
]

export default function SandboxTab() {
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [Va, setVa] = useState(0.4)
  const [T, setT] = useState(300)
  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd

  const { Js, J, factor, Lp, Ln } = useMemo(() => {
    const c = diodeCurrents(Na, Nd, mat, Va, T)
    const Lp = diffusionLength(diffusionCoeff(mat.mup, T), mat.taup)
    const Ln = diffusionLength(diffusionCoeff(mat.mun, T), mat.taun)
    return { Js: c.Js, J: c.J, factor: Math.exp(Va / thermalVoltage(T)), Lp, Ln }
  }, [Na, Nd, mat, Va, T])

  const sweep = useAutoSweep({ min: -1, max: 0.8, value: Va, onChange: setVa })
  const activePreset = PRESETS.find((p) => Math.abs(p.va - Va) < 1e-9)

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז חול — הדיודה האידיאלית">
        <p className="leading-relaxed text-slate-600">
          בחרו חומר, סימום וטמפרטורה, ואז גררו את <b>הממתח</b> <Tex>{'V_A'}</Tex>: ראו בו-זמנית את אופיין
          ה-<Tex>{'I'}</Tex>–<Tex>{'V'}</Tex>, את פרופיל המיעוט המוזרק, ואת כל המספרים.
        </p>

        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-violet-700">💡 כללי אצבע</p>
          <ol className="list-decimal space-y-1.5 ps-6 text-sm leading-relaxed text-slate-600 marker:font-bold marker:text-violet-500">
            <li>הזרם <Tex>{'\\propto e^{V_A/V_T}-1'}</Tex> — מעריכי בקדמי, רווי (<Tex>{'-J_S'}</Tex>) באחורי.</li>
            <li><Tex>{'J_S'}</Tex> גדל עם הטמפרטורה (<Tex>{'\\propto n_i^2'}</Tex>) ועם הקטנת הסימום.</li>
            <li>הצד המסומם פחות שולט בהזרקה ובזרם.</li>
          </ol>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2.5 flex items-center justify-between gap-2 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-2"><span aria-hidden>🎛️</span> מצבי ממתח</span>
            <PlayButton playing={sweep.playing} onClick={sweep.toggle} label="הרצה" />
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = Math.abs(p.va - Va) < 1e-9
              return (
                <button
                  key={p.labelHe}
                  onClick={() => sweep.setManual(p.va)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 ${
                    active
                      ? 'bg-gradient-to-b from-violet-500 to-violet-600 text-white shadow-violet-500/30'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
                  }`}
                >
                  {p.labelHe}
                </button>
              )
            })}
          </div>
          {activePreset && (
            <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">
              <RichText>{activePreset.noteHe}</RichText>
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">חומר:</span>
                {MATERIAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMatKey(m.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      m.key === matKey ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.he}
                  </button>
                ))}
              </div>
              <Slider
                label={<>ממתח · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={-1}
                max={0.8}
                step={0.01}
                onChange={sweep.setManual}
                display={fmtVolt(Va)}
              />
              <Slider
                label={<>סימום צד p · <Tex>{'N_A'}</Tex></>}
                value={expNa}
                min={14}
                max={19}
                onChange={setExpNa}
                display={<Tex>{`${fmtDoping(Na)}\\,\\mathrm{cm^{-3}}`}</Tex>}
              />
              <Slider
                label={<>סימום צד n · <Tex>{'N_D'}</Tex></>}
                value={expNd}
                min={14}
                max={19}
                onChange={setExpNd}
                display={<Tex>{`${fmtDoping(Nd)}\\,\\mathrm{cm^{-3}}`}</Tex>}
              />
              <Slider
                label={<>טמפרטורה · <Tex>{'T'}</Tex></>}
                value={T}
                min={250}
                max={450}
                step={5}
                onChange={setT}
                display={`${T} K`}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
              <Readout label="$J_S$ (רוויה)" value={fmtCurrentDensity(Js)} accent="border-rose-100 bg-rose-50" />
              <Readout label="$J$ בנקודת העבודה" value={fmtCurrentDensity(J)} accent="border-violet-100 bg-violet-50" />
              <Readout label="גורם $e^{V_A/V_T}$" value={`×${factor < 1000 ? factor.toFixed(1) : factor.toExponential(1)}`} accent="border-amber-100 bg-amber-50" />
              <Readout label="$L_p$" value={fmtLength(Lp)} accent="border-slate-100 bg-white" />
              <Readout label="$L_n$" value={fmtLength(Ln)} accent="border-slate-100 bg-white" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">אופיין ה-I–V (לינארי)</p>
              <IVCurve Na={Na} Nd={Nd} mat={mat} Va={Va} T={T} mode="linear" trail={sweep.playing ? sweep.trail : undefined} pulsing={sweep.playing} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">פרופיל המיעוט המוזרק</p>
              <MinorityInjectionProfile Va={Va} Na={Na} Nd={Nd} mat={mat} T={T} />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
