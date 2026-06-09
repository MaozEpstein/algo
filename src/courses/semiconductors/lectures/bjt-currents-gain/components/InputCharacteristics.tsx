import Tex from '@/core/components/Tex'
import Chart from '@/core/viz/Chart'

/**
 * Input characteristics (forward-biased B-E junction) for both configurations:
 *   CB: I_E vs V_BE  — the large emitter current.
 *   CE: I_B vs V_BE  — the same junction but read as the tiny base current (≈I_E/(β+1)).
 * Both are the exponential diode law; only the current axis differs by ≈β. Schematic.
 */
const VT = 0.02585
const IS = 1e-15 // A
const BETA = 100

const ie = (vbe: number) => IS * (Math.exp(vbe / VT) - 1) // A
const samplePts = (toUnit: (a: number) => number) => {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i <= 60; i++) {
    const v = 0.45 + (0.3 * i) / 60 // 0.45 .. 0.75 V
    pts.push({ x: v, y: toUnit(ie(v)) })
  }
  return pts
}

export default function InputCharacteristics() {
  const cbPts = samplePts((iA) => iA * 1e3) // mA
  const cePts = samplePts((iA) => (iA / (BETA + 1)) * 1e6) // µA

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-1 text-center text-sm font-semibold text-sky-700">CB · אופיין כניסה <Tex>{'I_E(V_{BE})'}</Tex></p>
        <Chart series={[{ label: 'I_E (mA)', color: '#0284c7', points: cbPts }]} xLabel="V_BE (V)" yLabel="I_E (mA)" yMax={1.4} height={230} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-1 text-center text-sm font-semibold text-rose-700">CE · אופיין כניסה <Tex>{'I_B(V_{BE})'}</Tex></p>
        <Chart series={[{ label: 'I_B (µA)', color: '#e11d48', points: cePts }]} xLabel="V_BE (V)" yLabel="I_B (µA)" yMax={14} height={230} />
      </div>
    </div>
  )
}
