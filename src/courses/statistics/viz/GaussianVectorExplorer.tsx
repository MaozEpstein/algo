import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { gaussianPdf } from '../lib/distributions'
import { covEigen, conditionalNormal } from '../lib/gaussian2d'

/**
 * The lesson-4 sandbox: a bivariate Gaussian shown as density-contour ellipses
 * over a point cloud, with its principal (whitening) axes, the Gaussian
 * marginals on each axis, and a draggable Y=y conditional slice (X|Y ~ N(ρσx/σy·y,
 * σx²(1−ρ²))). A "counterexample" mode shows Y=SX — marginally Gaussian and
 * uncorrelated, yet the joint is an "X", not an ellipse: marginally Gaussian +
 * uncorrelated ≠ jointly Gaussian.
 */

// deterministic standard-normal pairs (seeded LCG + Box–Muller)
const BASE = ((): { u: number; v: number }[] => {
  let s = 71741
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  const out: { u: number; v: number }[] = []
  for (let i = 0; i < 150; i++) {
    const r = Math.sqrt(-2 * Math.log(Math.max(1e-6, rnd())))
    const t = 2 * Math.PI * rnd()
    out.push({ u: r * Math.cos(t), v: r * Math.sin(t) })
  }
  return out
})()

const W = 300
const H = 300
const LM = 54 // left strip (f_Y)
const BM = 54 // bottom strip (f_X)
const PT = 8
const PR = 8
const PW = W - LM - PR
const PH = H - PT - BM

export default function GaussianVectorExplorer() {
  const [sx, setSx] = useState(1.3)
  const [sy, setSy] = useState(0.8)
  const [rho, setRho] = useState(0.6)
  const [y0f, setY0f] = useState(0.62)
  const [counter, setCounter] = useState(false)

  const D = 3.6 * Math.max(sx, sy, 1)
  const px = (x: number) => LM + ((x + D) / (2 * D)) * PW
  const py = (y: number) => PT + PH - ((y + D) / (2 * D)) * PH
  const scale = PW / (2 * D)

  const pts = useMemo(() => {
    if (counter) return BASE.map(({ u, v }) => ({ x: u, y: (v >= 0 ? 1 : -1) * u })) // Y=SX
    const c = Math.sqrt(Math.max(0, 1 - rho * rho))
    return BASE.map(({ u, v }) => ({ x: sx * u, y: sy * (rho * u + c * v) }))
  }, [sx, sy, rho, counter])

  const eig = covEigen(sx, sy, rho)
  const angleDeg = (-eig.angleRad * 180) / Math.PI // math angle → screen (y flipped)

  // marginal strips (both Gaussian)
  const fxMax = gaussianPdf(0, 0, sx)
  const fyMax = gaussianPdf(0, 0, sy)
  const fxArea = useMemo(() => {
    let d = `M${LM} ${PT + PH} `
    for (let i = 0; i <= 120; i++) {
      const x = -D + (i / 120) * 2 * D
      d += `L${px(x).toFixed(1)} ${(PT + PH + (gaussianPdf(x, 0, sx) / fxMax) * (BM - 10)).toFixed(1)} `
    }
    d += `L${W - PR} ${PT + PH} Z`
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sx, D])
  const fyArea = useMemo(() => {
    let d = `M${LM} ${py(-D)} `
    for (let i = 0; i <= 120; i++) {
      const y = -D + (i / 120) * 2 * D
      d += `L${(LM - (gaussianPdf(y, 0, sy) / fyMax) * (LM - 10)).toFixed(1)} ${py(y).toFixed(1)} `
    }
    d += `L${LM} ${py(D)} Z`
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sy, D])

  const y0 = -D + y0f * 2 * D
  const cond = conditionalNormal(sx, sy, rho, y0)
  const condSd = Math.sqrt(cond.variance)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setCounter(false)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${!counter ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>גאוסי משותף</button>
        <button onClick={() => setCounter(true)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${counter ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>דוגמה נגדית (Y=SX)</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full" style={{ maxWidth: 380 }}>
        {/* plot frame */}
        <line x1={LM} y1={PT} x2={LM} y2={PT + PH} stroke="#cbd5e1" />
        <line x1={LM} y1={PT + PH} x2={W - PR} y2={PT + PH} stroke="#cbd5e1" />
        <line x1={px(0)} y1={PT} x2={px(0)} y2={PT + PH} stroke="#eef2f6" />
        <line x1={LM} y1={py(0)} x2={W - PR} y2={py(0)} stroke="#eef2f6" />
        <text x={W - PR - 3} y={PT + PH - 4} textAnchor="end" fontSize="10" fill="#94a3b8">X</text>
        <text x={LM + 4} y={PT + 10} fontSize="10" fill="#94a3b8">Y</text>

        {/* marginals */}
        <path d={fxArea} fill="#94a3b8" fillOpacity={0.35} />
        <path d={fyArea} fill="#94a3b8" fillOpacity={0.35} />

        {/* point cloud */}
        {pts.map((p, i) => (
          <circle key={i} cx={px(p.x)} cy={py(p.y)} r={2} fill="#059669" fillOpacity={0.5} />
        ))}

        {!counter && (
          <>
            {/* density-contour ellipses */}
            {[1, 2].map((k) => (
              <ellipse
                key={k}
                cx={px(0)}
                cy={py(0)}
                rx={eig.major * k * scale}
                ry={eig.minor * k * scale}
                fill="none"
                stroke="#0f172a"
                strokeOpacity={k === 1 ? 0.8 : 0.35}
                strokeWidth={1.5}
                transform={`rotate(${angleDeg} ${px(0)} ${py(0)})`}
              />
            ))}
            {/* principal (whitening) axes */}
            {(() => {
              const ca = Math.cos(eig.angleRad), sa = Math.sin(eig.angleRad)
              const majEnd = { x: 2 * eig.major * ca, y: 2 * eig.major * sa }
              const minEnd = { x: -2 * eig.minor * sa, y: 2 * eig.minor * ca }
              return (
                <>
                  <line x1={px(-majEnd.x)} y1={py(-majEnd.y)} x2={px(majEnd.x)} y2={py(majEnd.y)} stroke="#7c3aed" strokeWidth={1.4} strokeDasharray="3 2" />
                  <line x1={px(-minEnd.x)} y1={py(-minEnd.y)} x2={px(minEnd.x)} y2={py(minEnd.y)} stroke="#7c3aed" strokeWidth={1.4} strokeDasharray="3 2" />
                </>
              )
            })()}
            {/* conditional slice at Y=y0 */}
            <line x1={LM} y1={py(y0)} x2={W - PR} y2={py(y0)} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="4 3" />
            <line x1={px(cond.mean - condSd)} y1={py(y0)} x2={px(cond.mean + condSd)} y2={py(y0)} stroke="#f59e0b" strokeWidth={8} strokeOpacity={0.3} strokeLinecap="round" />
            <circle cx={px(cond.mean)} cy={py(y0)} r={4} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
          </>
        )}
      </svg>

      {counter ? (
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          ❗ כאן <span dir="ltr"><Tex>{'Y=SX'}</Tex></span> (<span dir="ltr"><Tex>{'S=\\pm1'}</Tex></span>): שני השוליים{' '}
          <span dir="ltr"><Tex>{'N(0,1)'}</Tex></span> ו-<span dir="ltr"><Tex>{'\\rho=0'}</Tex></span>, אבל הענן הוא <b>"X"</b> ולא אליפסה —
          <b> שוליים גאוסיים + אי-מתאם ≠ גאוסי משותף</b>, והמשתנים גם <b>תלויים</b>.
        </p>
      ) : (
        <>
          <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700" dir="ltr">
              <Tex>{`C=\\begin{pmatrix}${(sx * sx).toFixed(2)} & ${(rho * sx * sy).toFixed(2)}\\\\ ${(rho * sx * sy).toFixed(2)} & ${(sy * sy).toFixed(2)}\\end{pmatrix}`}</Tex>
            </div>
            <div className="rounded-lg bg-amber-50 px-2 py-1.5 text-amber-900" dir="ltr">
              <Tex>{`X\\mid Y{=}${y0.toFixed(1)}\\sim N(${cond.mean.toFixed(2)},\\,${cond.variance.toFixed(2)})`}</Tex>
            </div>
          </div>

          <div className="mt-2 space-y-1.5">
            <Slider label="סטיית תקן" tex="\\sigma_x" value={sx} min={0.5} max={2} step={0.1} onChange={setSx} />
            <Slider label="סטיית תקן" tex="\\sigma_y" value={sy} min={0.5} max={2} step={0.1} onChange={setSy} />
            <Slider label="מתאם" tex="\\rho" value={rho} min={-0.9} max={0.9} step={0.05} onChange={setRho} />
            <Slider label="חתך" tex="Y=y" value={y0f} min={0.05} max={0.95} step={0.01} onChange={setY0f} display={y0.toFixed(1)} />
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            הסגול = הצירים הראשיים (כיווני ה"הלבנה"/דה-קורלציה) · הכתום = ההתפלגות המותנית של X בהינתן Y
          </p>
        </>
      )}
    </div>
  )
}

function Slider({ label, tex, value, min, max, step, onChange, display }: { label: string; tex: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display?: string }) {
  return (
    <label className="flex items-center gap-3">
      <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
        {label}<span dir="ltr" className="text-slate-400"><Tex>{tex}</Tex></span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
      <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{display ?? value.toFixed(2)}</span>
    </label>
  )
}
