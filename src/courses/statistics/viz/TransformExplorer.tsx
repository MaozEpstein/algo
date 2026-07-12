import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { uniformPdf, gaussianPdf } from '../lib/distributions'
import { affinePdf, squarePdf, pushforwardPdf, sigmoid, sigmoidInv, dSigmoidInv, type Pdf } from '../lib/transforms'

/**
 * The flagship lesson-3 sandbox. The function g is drawn in the middle; the
 * source density f_X runs along the bottom (x) and the transformed density f_Y
 * along the left (y). Density PILES UP where g is flat (small |g'|) and THINS
 * where g is steep — the change-of-variables formula made visible. A draggable x
 * shows the mapping x→g(x)=y and the local slope.
 */

type SrcId = 'uniform' | 'gauss'
type FnId = 'affine' | 'square' | 'sigmoid' | 'exp'

const FNS: { id: FnId; labelHe: string; tex: string }[] = [
  { id: 'affine', labelHe: 'לינארי', tex: 'aX+b' },
  { id: 'square', labelHe: 'ריבוע', tex: 'X^2' },
  { id: 'sigmoid', labelHe: 'סיגמואיד', tex: '\\sigma(X)' },
  { id: 'exp', labelHe: 'מעריכי', tex: 'e^{X}' },
]

const W = 360
const Hh = 360
const LM = 66 // left strip (f_Y)
const BM = 66 // bottom strip (f_X)
const PLOT_W = W - LM
const PLOT_H = Hh - BM

export default function TransformExplorer() {
  const [src, setSrc] = useState<SrcId>('gauss')
  const [fn, setFn] = useState<FnId>('square')
  const [a, setA] = useState(1)
  const [b, setB] = useState(0)
  const [m, setM] = useState(0)
  const [sigma, setSigma] = useState(1)
  const [xFrac, setXFrac] = useState(0.62)

  const model = useMemo(() => {
    const fX: Pdf = src === 'uniform' ? (x) => uniformPdf(x, -2, 2) : (x) => gaussianPdf(x, m, sigma)
    const xmin = src === 'uniform' ? -2.6 : m - 3.6 * sigma
    const xmax = src === 'uniform' ? 2.6 : m + 3.6 * sigma

    // g, its y-range over [xmin,xmax], and f_Y(y)
    let g: (x: number) => number
    let fY: (y: number) => number
    let ymin: number
    let ymax: number
    if (fn === 'affine') {
      g = (x) => a * x + b
      fY = (y) => affinePdf(fX, a, b, y)
      const y1 = g(xmin), y2 = g(xmax)
      ymin = Math.min(y1, y2); ymax = Math.max(y1, y2)
    } else if (fn === 'square') {
      g = (x) => x * x
      fY = (y) => squarePdf(fX, y)
      ymin = 0; ymax = Math.max(g(xmin), g(xmax))
    } else if (fn === 'sigmoid') {
      g = sigmoid
      fY = (y) => (y > 0 && y < 1 ? pushforwardPdf(fX, sigmoidInv, dSigmoidInv, y) : 0)
      ymin = 0; ymax = 1
    } else {
      g = (x) => Math.exp(x)
      fY = (y) => (y > 0 ? pushforwardPdf(fX, (yy) => Math.log(yy), (yy) => 1 / yy, y) : 0)
      ymin = 0; ymax = Math.exp(xmax)
    }
    return { fX, xmin, xmax, g, fY, ymin, ymax }
  }, [src, fn, a, b, m, sigma])

  const { fX, xmin, xmax, g, fY, ymin, ymax } = model
  const yPad = (ymax - ymin) * 0.08 || 0.1
  const yLo = ymin - yPad, yHi = ymax + yPad

  const px = (x: number) => LM + ((x - xmin) / (xmax - xmin)) * PLOT_W
  const py = (y: number) => PLOT_H - ((y - yLo) / (yHi - yLo)) * PLOT_H

  const N = 160
  // robust maxima for the density strips (skip singular endpoints for square/exp)
  const fXMax = useMemo(() => {
    let mx = 0
    for (let i = 0; i <= N; i++) mx = Math.max(mx, fX(xmin + (i / N) * (xmax - xmin)))
    return mx || 1
  }, [fX, xmin, xmax])
  const fYMax = useMemo(() => {
    const vals: number[] = []
    for (let i = 1; i < N; i++) vals.push(fY(yLo + (i / N) * (yHi - yLo)))
    vals.sort((p, q) => p - q)
    return vals[Math.floor(vals.length * 0.96)] || 1 // 96th pct → tame the spike
  }, [fY, yLo, yHi])

  // paths
  const gPath = useMemo(() => {
    let d = ''
    for (let i = 0; i <= N; i++) {
      const x = xmin + (i / N) * (xmax - xmin)
      const yy = g(x)
      const cy = Math.max(-20, Math.min(PLOT_H + 20, py(yy)))
      d += `${i ? 'L' : 'M'}${px(x).toFixed(1)} ${cy.toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

  const fXArea = useMemo(() => {
    // drawn in the bottom strip, growing downward from the axis
    let d = `M${LM} ${PLOT_H} `
    for (let i = 0; i <= N; i++) {
      const x = xmin + (i / N) * (xmax - xmin)
      const h = (fX(x) / fXMax) * (BM - 10)
      d += `L${px(x).toFixed(1)} ${(PLOT_H + h).toFixed(1)} `
    }
    d += `L${W} ${PLOT_H} Z`
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, fXMax])

  const fYArea = useMemo(() => {
    // drawn in the left strip, growing leftward from the axis
    let d = `M${LM} ${py(yLo)} `
    for (let i = 0; i <= N; i++) {
      const y = yLo + (i / N) * (yHi - yLo)
      const w = Math.min(1, fY(y) / fYMax) * (LM - 10)
      d += `L${(LM - w).toFixed(1)} ${py(y).toFixed(1)} `
    }
    d += `L${LM} ${py(yHi)} Z`
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, fYMax])

  const xSel = xmin + xFrac * (xmax - xmin)
  const ySel = g(xSel)
  const slope = fn === 'affine' ? a : fn === 'square' ? 2 * xSel : fn === 'sigmoid' ? sigmoid(xSel) * (1 - sigmoid(xSel)) : Math.exp(xSel)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex gap-1.5">
          <Chip on={src === 'uniform'} onClick={() => setSrc('uniform')}>אחיד</Chip>
          <Chip on={src === 'gauss'} onClick={() => setSrc('gauss')}>גאוסי</Chip>
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex flex-wrap gap-1.5">
          {FNS.map((f) => (
            <Chip key={f.id} on={fn === f.id} onClick={() => setFn(f.id)}>
              <span className="flex items-center gap-1">{f.labelHe}<span dir="ltr" className={fn === f.id ? '' : 'text-slate-400'}><Tex>{f.tex}</Tex></span></span>
            </Chip>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block w-full" style={{ maxWidth: 400 }}>
        {/* axes of the g-plot */}
        <line x1={LM} y1={0} x2={LM} y2={PLOT_H} stroke="#cbd5e1" />
        <line x1={LM} y1={PLOT_H} x2={W} y2={PLOT_H} stroke="#cbd5e1" />
        <text x={W - 4} y={PLOT_H - 5} textAnchor="end" fontSize="10" fill="#94a3b8">x</text>
        <text x={LM + 5} y={12} fontSize="10" fill="#94a3b8">y=g(x)</text>

        {/* source density f_X (bottom strip) */}
        <path d={fXArea} fill="#94a3b8" fillOpacity={0.35} />
        <text x={W - 4} y={Hh - 6} textAnchor="end" fontSize="9" fill="#64748b">f_X</text>

        {/* transformed density f_Y (left strip) */}
        <path d={fYArea} fill="#34d399" fillOpacity={0.5} />
        <text x={6} y={12} fontSize="9" fill="#059669">f_Y</text>

        {/* g curve */}
        <path d={gPath} fill="none" stroke="#0f172a" strokeWidth={2} />

        {/* mapping of the selected x: up to the curve, then left to f_Y */}
        <line x1={px(xSel)} y1={PLOT_H} x2={px(xSel)} y2={py(ySel)} stroke="#f59e0b" strokeWidth={1.3} strokeDasharray="4 3" />
        <line x1={px(xSel)} y1={py(ySel)} x2={LM} y2={py(ySel)} stroke="#f59e0b" strokeWidth={1.3} strokeDasharray="4 3" />
        <circle cx={px(xSel)} cy={py(ySel)} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
      </svg>

      <div className="mt-1 rounded-lg bg-slate-50 px-3 py-1.5 text-center text-sm text-slate-600" dir="ltr">
        <Tex>{`x=${xSel.toFixed(2)}\\ \\to\\ y=${ySel.toFixed(2)},\\quad |g'(x)|=${Math.abs(slope).toFixed(2)}`}</Tex>
      </div>

      <div className="mt-2 space-y-2">
        <Slider label="נבחר x" tex="x" value={xFrac} min={0} max={1} step={0.01} onChange={setXFrac} display={xSel.toFixed(2)} />
        {fn === 'affine' && (<>
          <Slider label="שיפוע" tex="a" value={a} min={-2} max={2} step={0.1} onChange={setA} display={a.toFixed(1)} />
          <Slider label="הזזה" tex="b" value={b} min={-2} max={2} step={0.5} onChange={setB} display={b.toFixed(1)} />
        </>)}
        {src === 'gauss' && (<>
          <Slider label="תוחלת המקור" tex="m" value={m} min={-1.5} max={1.5} step={0.5} onChange={setM} display={m.toFixed(1)} />
          <Slider label="סטיית תקן" tex="\\sigma" value={sigma} min={0.5} max={1.8} step={0.1} onChange={setSigma} display={sigma.toFixed(1)} />
        </>)}
      </div>

      <p className="mt-2 text-center text-xs text-slate-400">
        הצפיפות מצטופפת היכן ש-g <b>שטוחה</b> (|g′| קטן) ומתדללת היכן שהיא <b>תלולה</b> — זו נוסחת שינוי המשתנה.
      </p>
    </div>
  )
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-2.5 py-1 text-sm font-semibold transition ${on ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
      {children}
    </button>
  )
}

function Slider({ label, tex, value, min, max, step, onChange, display }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}<span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display}</span>
    </label>
  )
}
