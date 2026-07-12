import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'

/**
 * A viewer for a joint density f_{XY}. The heatmap is the joint; the curve below
 * is the marginal f_X; the dashed slice at x picks the conditional f_{Y|X=x}
 * (highlighted column). Switch between an independent example (uniform on the
 * square — the slice looks the same for every x) and a dependent one (uniform on
 * the disk — the slice shrinks near the edges). That contrast *is* the meaning of
 * independence, shown rather than asserted.
 */

type Model = {
  id: 'square' | 'disk'
  labelHe: string
  lo: number
  hi: number
  fxy: string // LaTeX for the joint density
  density: (x: number, y: number) => number
  marginalX: (x: number) => number
  /** half-width of the conditional support at x (for the highlighted column) */
  condHalf: (x: number) => number
  independent: boolean
  condTex: (x: number) => string
}

const SQUARE: Model = {
  id: 'square',
  labelHe: 'אחיד על ריבוע',
  lo: -0.15,
  hi: 1.15,
  fxy: 'f_{XY}(x,y)=1,\\;\\; 0\\le x,y\\le 1',
  density: (x, y) => (x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1 : 0),
  marginalX: (x) => (x >= 0 && x <= 1 ? 1 : 0),
  condHalf: (x) => (x >= 0 && x <= 1 ? 0.5 : 0), // support [0,1], drawn centered at 0.5
  independent: true,
  condTex: () => 'Y\\mid X=x \\sim U(0,1)',
}

const DISK: Model = {
  id: 'disk',
  labelHe: 'אחיד על עיגול',
  lo: -1.15,
  hi: 1.15,
  fxy: 'f_{XY}(x,y)=\\tfrac{1}{\\pi},\\;\\; x^2+y^2\\le 1',
  density: (x, y) => (x * x + y * y <= 1 ? 1 / Math.PI : 0),
  marginalX: (x) => (Math.abs(x) < 1 ? (2 * Math.sqrt(1 - x * x)) / Math.PI : 0),
  condHalf: (x) => (Math.abs(x) < 1 ? Math.sqrt(1 - x * x) : 0),
  independent: false,
  condTex: (x) => `Y\\mid X=${x.toFixed(2)} \\sim U(-\\sqrt{1-x^2},\\,\\sqrt{1-x^2})`,
}

const MODELS = [SQUARE, DISK]

const S = 240 // heatmap size (px)
const N = 30 // grid resolution
const MH = 54 // marginal strip height

export default function JointDensityViewer() {
  const [modelId, setModelId] = useState<Model['id']>('disk')
  const model = MODELS.find((m) => m.id === modelId)!
  const { lo, hi } = model
  const span = hi - lo
  const [xFrac, setXFrac] = useState(0.5)
  const x0 = lo + xFrac * span

  const px = (x: number) => ((x - lo) / span) * S
  const py = (y: number) => S - ((y - lo) / span) * S

  // heatmap peak for color scaling
  const pmax = useMemo(() => {
    let mx = 0
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const x = lo + ((i + 0.5) / N) * span
        const y = lo + ((j + 0.5) / N) * span
        mx = Math.max(mx, model.density(x, y))
      }
    return mx || 1
  }, [model, lo, span])

  const cells = useMemo(() => {
    const out: { x: number; y: number; o: number }[] = []
    const cw = S / N
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++) {
        const xc = lo + ((i + 0.5) / N) * span
        const yc = lo + ((j + 0.5) / N) * span
        const d = model.density(xc, yc)
        if (d > 0) out.push({ x: i * cw, y: S - (j + 1) * cw, o: 0.15 + 0.85 * (d / pmax) })
      }
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, pmax])

  const cw = S / N
  // marginal f_X curve
  const marginalMax = model.id === 'square' ? 1.2 : 2 / Math.PI + 0.1
  const marginalPath = useMemo(() => {
    let d = ''
    for (let i = 0; i <= 120; i++) {
      const x = lo + (i / 120) * span
      const yy = MH - (model.marginalX(x) / marginalMax) * (MH - 6)
      d += `${i ? 'L' : 'M'}${px(x).toFixed(1)} ${yy.toFixed(1)} `
    }
    return d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, lo, span])

  const half = model.condHalf(x0)
  // conditional support drawn on the heatmap column
  const condY0 = model.id === 'square' ? 0 : -half
  const condY1 = model.id === 'square' ? 1 : half

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        {MODELS.map((mo) => (
          <button
            key={mo.id}
            onClick={() => setModelId(mo.id)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              modelId === mo.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {mo.labelHe}
          </button>
        ))}
      </div>

      <div className="mb-2 text-center text-slate-700" dir="ltr">
        <Tex>{model.fxy}</Tex>
      </div>

      <div className="mx-auto" style={{ maxWidth: S }}>
        {/* joint heatmap */}
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full rounded-lg border border-slate-200 bg-slate-50">
          {cells.map((c, i) => (
            <rect key={i} x={c.x} y={c.y} width={cw + 0.5} height={cw + 0.5} fill="#059669" fillOpacity={c.o} />
          ))}
          {/* conditional column highlight */}
          <rect
            x={px(x0) - 5}
            y={py(condY1)}
            width={10}
            height={Math.max(0, py(condY0) - py(condY1))}
            fill="#f59e0b"
            fillOpacity={0.35}
            stroke="#f59e0b"
          />
          <line x1={px(x0)} y1={0} x2={px(x0)} y2={S} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="4 3" />
          {/* axes labels */}
          <text x={S - 4} y={py(0) - 4} textAnchor="end" fontSize="10" fill="#94a3b8">x</text>
          <text x={px(0) + 4} y={12} fontSize="10" fill="#94a3b8">y</text>
        </svg>

        {/* marginal f_X strip, aligned under the heatmap */}
        <svg viewBox={`0 0 ${S} ${MH}`} className="mt-1 w-full">
          <path d={`M0 ${MH} L${marginalPath.slice(1)} L${S} ${MH} Z`} fill="#34d399" fillOpacity={0.2} />
          <path d={marginalPath} fill="none" stroke="#059669" strokeWidth={2} />
          <line x1={px(x0)} y1={0} x2={px(x0)} y2={MH} stroke="#0f172a" strokeWidth={1.2} strokeDasharray="4 3" />
          <circle cx={px(x0)} cy={MH - (model.marginalX(x0) / marginalMax) * (MH - 6)} r={3.5} fill="#0f172a" />
          <text x={4} y={12} fontSize="10" fill="#94a3b8">f_X(x)</text>
        </svg>
      </div>

      <div className="mt-2 rounded-xl bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-900" dir="ltr">
        <Tex>{model.condTex(x0)}</Tex>
      </div>

      <div className="mt-3">
        <label className="flex items-center gap-3">
          <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
            חתך ב-
            <span dir="ltr" className="text-slate-400"><Tex>{'X=x'}</Tex></span>
          </span>
          <input
            type="range"
            min={0.04}
            max={0.96}
            step={0.01}
            value={xFrac}
            onChange={(e) => setXFrac(Number(e.target.value))}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600"
          />
          <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{x0.toFixed(2)}</span>
        </label>
      </div>

      <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
        {model.independent ? (
          <>
            ✅ <b>אי-תלות:</b> החתך המותנה (בכתום) נראה <b>אותו דבר</b> לכל <span dir="ltr"><Tex>{'x'}</Tex></span> — ידיעת{' '}
            <span dir="ltr"><Tex>{'X'}</Tex></span> לא משנה את התפלגות <span dir="ltr"><Tex>{'Y'}</Tex></span>. כאן אכן{' '}
            <span dir="ltr"><Tex>{'f_{XY}=f_X\\,f_Y'}</Tex></span>.
          </>
        ) : (
          <>
            ❌ <b>תלות:</b> רוחב החתך המותנה (בכתום) <b>משתנה</b> עם <span dir="ltr"><Tex>{'x'}</Tex></span> — קרוב לקצה נותר פחות
            מקום ל-<span dir="ltr"><Tex>{'Y'}</Tex></span>. לכן <span dir="ltr"><Tex>{'f_{XY}\\ne f_X\\,f_Y'}</Tex></span>.
          </>
        )}
      </p>
    </div>
  )
}
