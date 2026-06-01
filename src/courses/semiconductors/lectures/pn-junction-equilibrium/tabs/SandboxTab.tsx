import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import BandDiagram from '../../../viz/BandDiagram'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import {
  MATERIALS,
  MATERIAL_LIST,
  fmtDoping,
  fmtField,
  fmtLength,
  fmtVolt,
  junctionState,
  type Material,
} from '../../../lib/junction'

function Readout({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${accent}`}>
      <span className="block text-xs text-slate-500">{label}</span>
      <span className="block font-mono text-base font-bold text-slate-800">{value}</span>
    </div>
  )
}

export default function SandboxTab() {
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd
  const state = useMemo(() => junctionState(Na, Nd, mat), [Na, Nd, mat])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז חול — שחקו עם הצומת">
        <p className="leading-relaxed text-slate-600">
          גררו את הסימום של כל צד ובחרו חומר — וראו בזמן אמת איך משתנים דיאגרמת הפסים, מפל ρ→E→V, וכל
          הגדלים. שימו לב: <b>סימום כבד יותר ⇒ אזור מחסור צר יותר ושדה חזק יותר</b>.
        </p>

        {/* controls */}
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-600">חומר:</span>
            {MATERIAL_LIST.map((m) => (
              <button
                key={m.key}
                onClick={() => setMatKey(m.key)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  m.key === matKey
                    ? 'border-violet-500 bg-violet-500 text-white shadow'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {m.he}
              </button>
            ))}
          </div>
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
        </div>

        {/* numeric readouts */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          <Readout label="מתח בנוי V_bi" value={fmtVolt(state.Vbi)} accent="border-sky-100 bg-sky-50" />
          <Readout label="רוחב כולל d" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
          <Readout label="d_n (צד n)" value={fmtLength(state.dn)} accent="border-slate-100 bg-white" />
          <Readout label="d_p (צד p)" value={fmtLength(state.dp)} accent="border-slate-100 bg-white" />
          <Readout label="שדה שיא E_max" value={fmtField(state.Emax)} accent="border-amber-100 bg-amber-50" />
        </div>

        {/* live visuals */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">דיאגרמת הפסים</p>
            <BandDiagram state={state} Na={Na} Nd={Nd} mat={mat} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V</p>
            <JunctionElectrostatics dn={state.dn} dp={state.dp} Emax={state.Emax} Vbi={state.Vbi} Na={Na} Nd={Nd} />
          </div>
        </div>
      </Panel>
    </div>
  )
}
