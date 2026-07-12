import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import { conditionalStd } from '../lib/moments'

/**
 * Lesson-2 correlation sandbox, framed as PREDICTION. For a standardized
 * bivariate Gaussian the best linear guess of Y from X is the line ŷ=ρx, and the
 * uncertainty that remains after knowing X is √(1−ρ²). Drag ρ and watch the line
 * tilt and the conditional band shrink: ρ=0 → flat line, widest band (X useless);
 * |ρ|→1 → 45° line, band collapses (X pins Y down). A "horseshoe" mode shows a
 * strongly dependent cloud with ρ≈0 — correlation sees only LINEAR structure.
 */

// deterministic standard-normal pairs (seeded LCG + Box–Muller, computed once)
const BASE = ((): { x: number; z: number }[] => {
  let s = 20260712 // fixed seed → deterministic across runs
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff
  const out: { x: number; z: number }[] = []
  for (let i = 0; i < 150; i++) {
    const u1 = Math.max(1e-6, rnd())
    const u2 = rnd()
    const r = Math.sqrt(-2 * Math.log(u1))
    out.push({ x: r * Math.cos(2 * Math.PI * u2), z: r * Math.sin(2 * Math.PI * u2) })
  }
  return out
})()

const S = 260
const LIM = 3.6 // axis range [-LIM, LIM]

export default function CorrelationExplorer() {
  const [rho, setRho] = useState(0.6)
  const [xSel, setXSel] = useState(1.2)
  const [horseshoe, setHorseshoe] = useState(false)

  const sx = (v: number) => S / 2 + (v / (2 * LIM)) * S
  const sy = (v: number) => S / 2 - (v / (2 * LIM)) * S

  const cStd = conditionalStd(rho)

  const pts = useMemo(() => {
    if (horseshoe) {
      // y ≈ x² − c (dependent, but ρ≈0 by symmetry); light vertical jitter via z
      return BASE.map(({ x, z }) => ({ x, y: 0.8 * (x * x - 1.5) + 0.25 * z }))
    }
    return BASE.map(({ x, z }) => ({ x, y: rho * x + cStd * z }))
  }, [rho, cStd, horseshoe])

  const uncorr = Math.abs(rho) < 0.02
  const yHat = rho * xSel // predicted Y at the selected X (linear mode)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setHorseshoe(false)}
          className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${!horseshoe ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          ניבוי לינארי
        </button>
        <button
          onClick={() => setHorseshoe(true)}
          className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${horseshoe ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          פרסה (ρ≈0 אך תלוי)
        </button>
      </div>

      <div className="mx-auto" style={{ maxWidth: S }}>
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full rounded-lg border border-slate-200 bg-slate-50">
          <line x1={0} y1={S / 2} x2={S} y2={S / 2} stroke="#e2e8f0" />
          <line x1={S / 2} y1={0} x2={S / 2} y2={S} stroke="#e2e8f0" />
          <text x={S - 10} y={S / 2 - 5} fontSize="10" fill="#94a3b8">X</text>
          <text x={S / 2 + 5} y={12} fontSize="10" fill="#94a3b8">Y</text>

          {/* point cloud */}
          {pts.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={2} fill="#059669" fillOpacity={0.45} />
          ))}

          {!horseshoe && (
            <>
              {/* prediction line ŷ = ρx */}
              <line x1={sx(-LIM)} y1={sy(-rho * LIM)} x2={sx(LIM)} y2={sy(rho * LIM)} stroke="#0f172a" strokeWidth={2} />
              {/* conditional ±√(1−ρ²) band at the selected X */}
              <line x1={sx(xSel)} y1={sy(yHat - cStd)} x2={sx(xSel)} y2={sy(yHat + cStd)} stroke="#f59e0b" strokeWidth={10} strokeOpacity={0.3} strokeLinecap="round" />
              <line x1={sx(xSel)} y1={0} x2={sx(xSel)} y2={S} stroke="#0f172a" strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.5} />
              {/* predicted point */}
              <circle cx={sx(xSel)} cy={sy(yHat)} r={4.5} fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
            </>
          )}
        </svg>
      </div>

      {horseshoe ? (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          ❗ כאן <span dir="ltr"><Tex>{'Y\\approx X^2'}</Tex></span> — <b>תלות חזקה</b>, אבל קו-הניבוי הישר כמעט שטוח ו-<span dir="ltr"><Tex>{'\\rho\\approx0'}</Tex></span>.
          המסקנה: <b>מתאם מודד רק קשר לינארי</b>; הוא מפספס תלות מעוקלת.
        </p>
      ) : (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-lg bg-slate-100 px-2 py-1.5 text-slate-700" dir="ltr">
              <Tex>{`\\hat Y=\\rho X,\\ \\ \\rho=${rho.toFixed(2)}`}</Tex>
            </div>
            <div className="rounded-lg bg-amber-50 px-2 py-1.5 text-amber-900" dir="ltr">
              <Tex>{`\\text{spread}=\\sqrt{1-\\rho^2}=${cStd.toFixed(2)}`}</Tex>
            </div>
          </div>

          <label className="mt-3 flex items-center gap-3">
            <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
              מתאם <span dir="ltr" className="text-slate-400"><Tex>{'\\rho'}</Tex></span>
            </span>
            <input type="range" min={-0.98} max={0.98} step={0.02} value={rho} onChange={(e) => setRho(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-emerald-200 accent-emerald-600" />
            <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{rho.toFixed(2)}</span>
          </label>
          <label className="mt-2 flex items-center gap-3">
            <span className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-slate-600">
              נבחר <span dir="ltr" className="text-slate-400"><Tex>{'X=x'}</Tex></span>
            </span>
            <input type="range" min={-3} max={3} step={0.1} value={xSel} onChange={(e) => setXSel(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-amber-200 accent-amber-600" />
            <span className="w-12 shrink-0 text-end font-mono text-sm text-slate-700" dir="ltr">{xSel.toFixed(1)}</span>
          </label>

          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
            {uncorr ? (
              <>✅ <b>אין מתאם</b> (<span dir="ltr"><Tex>{'\\rho=0'}</Tex></span>): קו-הניבוי <b>שטוח</b> והפס הכתום רחב מקסימלית — ידיעת <span dir="ltr"><Tex>{'X'}</Tex></span> לא עוזרת לנחש את <span dir="ltr"><Tex>{'Y'}</Tex></span>.</>
            ) : Math.abs(rho) > 0.9 ? (
              <>🎯 <b>מתאם חזק</b> (<span dir="ltr"><Tex>{`\\rho=${rho.toFixed(2)}`}</Tex></span>): הפס הכתום כמעט נעלם — הניבוי <span dir="ltr"><Tex>{'\\hat Y=\\rho x'}</Tex></span> כמעט מדויק, <span dir="ltr"><Tex>{'X'}</Tex></span> "קובע" את <span dir="ltr"><Tex>{'Y'}</Tex></span>.</>
            ) : (
              <>הקו <span dir="ltr"><Tex>{'\\hat Y=\\rho x'}</Tex></span> הוא הניחוש הטוב ביותר ל-<span dir="ltr"><Tex>{'Y'}</Tex></span>, והפס הכתום <span dir="ltr"><Tex>{'\\pm\\sqrt{1-\\rho^2}'}</Tex></span> הוא <b>אי-הוודאות שנותרה</b> אחרי שידענו <span dir="ltr"><Tex>{'X'}</Tex></span>. ככל ש-<span dir="ltr"><Tex>{'|\\rho|'}</Tex></span> גדל — הפס מצטמצם.</>
            )}
          </p>
        </>
      )}
    </div>
  )
}
