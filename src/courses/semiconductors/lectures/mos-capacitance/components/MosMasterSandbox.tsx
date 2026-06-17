import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Tex from '@/core/components/Tex'
import Slider from '../../../components/Slider'
import PlayButton from '../../../components/PlayButton'
import { useAutoSweep } from '../../../components/useAutoSweep'
import {
  MATERIALS,
  METALS,
  fermiPotential,
  mosPhiMS,
  oxideCap,
  mosDepletionWidth,
  mosDepletionCharge,
  mosMaxDepletion,
  mosThreshold,
  mosSurfacePotential,
  mosRegime,
  mosFlatBandShift,
  mosCapLF,
  mosCapHF,
  mosCapDeepDepletion,
  type MosCvParams,
} from '../../../lib/junction'
import Readout from './Readout'
import MosLayerSchematic from '../../mos-capacitor/components/MosLayerSchematic'
import MosBandDiagram from '../../mos-capacitor/components/MosBandDiagram'
import MosChargeProfile from '../../mos-capacitor/components/MosChargeProfile'
import { REGIME_HE, REGIME_EN, REGIME_ACCENT, type Regime } from '../../mos-capacitor/components/regime'
import CVFrequencyChart, { type CvMode } from './CVFrequencyChart'
import CapacitanceStack from './CapacitanceStack'

/**
 * The flagship MOS sandbox — the capstone of lesson 6. One V_G slider (plus N_A, t_ox and the
 * oxide charge N_ss that slides the whole curve) drives the regime, ψ_s, W, the band diagram,
 * charge profile, layer schematic AND the live C-V curve with a moving operating point. A DC↔AC
 * switch and an LF/HF/DD selector show static vs. small-signal behaviour (with the animated ΔQ).
 * A ▶ "play" button auto-sweeps V_G ping-pong so the whole device evolves like a movie — with a
 * comet trail and a pulsing halo on the C-V operating point. End-to-end, all three parts at once.
 */
const SI = MATERIALS.Si
const AL = METALS.Al
const EPS_SI = SI.epsR

const MODE_LABEL: Record<CvMode, string> = { LF: 'תדר נמוך (LF)', HF: 'תדר גבוה (HF)', DD: 'דלדול-עמוק (DD)' }
const capFn: Record<CvMode, (vg: number, p: MosCvParams) => number> = { LF: mosCapLF, HF: mosCapHF, DD: mosCapDeepDepletion }

/** Guided-tour narration for the current state — turns the auto-sweep into a narrated movie. */
function narration(regime: Regime, ac: boolean, mode: CvMode): { title: string; body: ReactNode } {
  if (regime === 'accumulation')
    return {
      title: 'הצטברות',
      body: <>נושאי-הרוב (חורים) נצברים בשפה והפסים מתכופפים <b>מעלה</b>. כל המטען מגיב מיד לאות → <Tex>{'C\\approx C_{ox}'}</Tex>.</>,
    }
  if (regime === 'depletion')
    return {
      title: 'מחסור',
      body: <>החורים נדחים ונחשף מטען שלילי של יוני-מקבל; <Tex>{'W'}</Tex> גדל. הקיבול יורד — <Tex>{'C_{ox}'}</Tex> בטור עם <Tex>{'C_{dep}=\\varepsilon_s/W'}</Tex>.</>,
    }
  // inversion
  if (ac && mode !== 'LF')
    return {
      title: mode === 'DD' ? 'היפוך · דלדול-עמוק' : 'היפוך · תדר גבוה',
      body: mode === 'DD'
        ? <>סריקה מהירה — אין זמן ליצירת הערוץ, <Tex>{'\\psi_s'}</Tex> חורג מ-<Tex>{'2\\phi_F'}</Tex> ו-<Tex>{'C'}</Tex> ממשיך לרדת <b>מתחת</b> ל-<Tex>{'C_{min}'}</Tex>.</>
        : <>נוצר ערוץ אלקטרונים, אך בתדר גבוה נושאי-המיעוט <b>לא מספיקים</b> להגיב → <Tex>{'C'}</Tex> ננעל על <Tex>{'C_{min}'}</Tex>.</>,
    }
  return {
    title: 'היפוך',
    body: <>נוצר <b>ערוץ אלקטרונים</b> בשפה (תעלת ה-MOSFET!). בתדר נמוך המיעוט מספיק להגיב → <Tex>{'C'}</Tex> חוזר ל-<Tex>{'C_{ox}'}</Tex>.</>,
  }
}

export default function MosMasterSandbox() {
  const [vg, setVg] = useState(0)
  const [logNa, setLogNa] = useState(17)
  const [toxNm, setToxNm] = useState(20)
  const [nss, setNss] = useState(0) // effective oxide sheet charge (cm⁻²)
  const [ac, setAc] = useState(true)
  const [mode, setMode] = useState<CvMode>('LF')
  const reduce = useReducedMotion()

  const Na = 10 ** logNa
  const Cox = oxideCap(toxNm * 1e-7)
  const phiF = fermiPotential(Na, SI.ni)
  const VFBideal = mosPhiMS(AL.phiM, SI.chi, SI.eg, phiF)
  const dVfb = mosFlatBandShift(nss, Cox)
  const VFB = VFBideal + dVfb
  const QdMax = mosDepletionCharge(2 * phiF, Na, EPS_SI)
  const VT = mosThreshold(VFB, phiF, QdMax, Cox)

  const regime: Regime = mosRegime(vg, VFB, VT)
  const psiS = mosSurfacePotential(vg, VFB, Na, EPS_SI, Cox, phiF)
  const W = mosDepletionWidth(psiS, Na, EPS_SI)
  const Wmax = mosMaxDepletion(phiF, Na, EPS_SI)
  const bendPx = regime === 'accumulation' ? -Math.min(30, 12 * (VFB - vg) + 6) : Math.min(56, (psiS / (2 * phiF)) * 54)
  const wRel = Wmax > 0 ? W / Wmax : 1

  const cvParams: MosCvParams = { Na, ni: SI.ni, epsR: EPS_SI, Cox, phiF, VFB }
  const Cnow = capFn[mode](vg, cvParams)
  const Cdep = regime === 'depletion' ? (EPS_SI * 8.85e-14) / W : Infinity
  const acc = REGIME_ACCENT[regime]
  const acFollows = mode === 'LF' // minority follows only at low frequency

  const vmin = VFB - 2.5
  const vmax = VT + 2.5
  const frac = (v: number) => Math.max(0, Math.min(1, (v - vmin) / (vmax - vmin)))
  const sweep = useAutoSweep({ min: vmin, max: vmax, value: vg, onChange: setVg })

  const presets: { label: string; en: string; v: number; r: Exclude<Regime, 'flat'> }[] = [
    { label: 'הצטברות', en: 'Accumulation', v: Math.max(vmin, VFB - 1.5), r: 'accumulation' },
    { label: 'מחסור', en: 'Depletion', v: (VFB + VT) / 2, r: 'depletion' },
    { label: 'סף', en: 'Threshold', v: VT, r: 'inversion' },
    { label: 'היפוך חזק', en: 'Strong inv.', v: Math.min(vmax, VT + 1.5), r: 'inversion' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* intent banner */}
      <div className="rounded-2xl border-s-4 border-violet-400 bg-violet-50/60 p-4 text-sm leading-relaxed text-slate-700">
        <b className="text-violet-800">ארגז-החול המסכם.</b> כאן הכול מתחבר: שנו את <Tex>{'V_G'}</Tex>, עברו בין שלושת
        המצבים, החליפו <b>DC↔AC</b> ובחרו תדר — או לחצו <b>▶ הרצה</b> וצפו בכל ההתקן מתפתח כמו סרטון.
      </div>

      {/* play + mode + frequency controls */}
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton playing={sweep.playing} onClick={sweep.toggle} />
        <div className="inline-flex overflow-hidden rounded-xl border border-slate-300">
          {(['DC', 'AC'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setAc(m === 'AC')}
              className={`px-4 py-2 text-sm font-bold transition ${(m === 'AC') === ac ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {m === 'DC' ? 'DC (סטטי)' : 'AC (אות-קטן)'}
            </button>
          ))}
        </div>
        {ac && (
          <div className="inline-flex overflow-hidden rounded-xl border border-slate-300">
            {(['LF', 'HF', 'DD'] as CvMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-3.5 py-2 text-sm font-semibold transition ${mode === m ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {MODE_LABEL[m]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* presets */}
      <div>
        <p className="mb-1.5 text-sm font-semibold text-slate-500">קפיצה מהירה:</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {presets.map((pr) => {
            const a = REGIME_ACCENT[pr.r]
            const active = Math.abs(vg - pr.v) < 0.03
            return (
              <button
                key={pr.label}
                type="button"
                onClick={() => sweep.setManual(Number(pr.v.toFixed(2)))}
                className={`flex flex-col items-center rounded-xl border-2 px-3 py-2 font-bold shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${a.border} ${active ? `${a.bg} ${a.text} ring-2 ring-offset-1 ring-slate-300` : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <span className="text-sm">{pr.label}</span>
                <span className="text-[11px] font-semibold opacity-70">{pr.en}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* sliders */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <Slider label={<>מתח שער · <Tex>{'V_G'}</Tex></>} value={vg} min={Number(vmin.toFixed(2))} max={Number(vmax.toFixed(2))} step={0.05} onChange={sweep.setManual} display={`${vg.toFixed(2)} V`} />
        <Slider label={<>סימום מצע · <Tex>{'N_A'}</Tex></>} value={logNa} min={15} max={18} step={0.1} onChange={setLogNa} display={`10^${logNa.toFixed(1)} cm⁻³`} />
        <Slider label={<>עובי אוקסיד · <Tex>{'t_{ox}'}</Tex></>} value={toxNm} min={3} max={60} step={1} onChange={setToxNm} display={`${toxNm} nm`} />
        <Slider label={<>מטען-תחמוצת · <Tex>{'N_{ss}'}</Tex></>} value={nss} min={-3e11} max={3e11} step={1e10} onChange={setNss} display={`${(nss / 1e11).toFixed(1)}×10¹¹ cm⁻²`} />
      </div>

      {/* V_G number line */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="ltr w-full" dir="ltr">
          <svg viewBox="0 0 600 70" className="w-full">
            <rect x={20} y={18} width={frac(VFB) * 560} height={16} fill="#fecdd3" />
            <rect x={20 + frac(VFB) * 560} y={18} width={(frac(VT) - frac(VFB)) * 560} height={16} fill="#fde68a" />
            <rect x={20 + frac(VT) * 560} y={18} width={(1 - frac(VT)) * 560} height={16} fill="#a7f3d0" />
            <line x1={20 + frac(VFB) * 560} y1={12} x2={20 + frac(VFB) * 560} y2={38} stroke="#64748b" strokeWidth={1.25} />
            <text x={20 + frac(VFB) * 560} y={9} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>FB</tspan></text>
            <line x1={20 + frac(VT) * 560} y1={12} x2={20 + frac(VT) * 560} y2={38} stroke="#64748b" strokeWidth={1.25} />
            <text x={20 + frac(VT) * 560} y={9} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 11, fontWeight: 700 }}>V<tspan dy={2} style={{ fontSize: 8 }}>T</tspan></text>
            <text x={20 + frac(VFB) / 2 * 560} y={52} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 11.5, fontWeight: 700 }}>הצטברות</text>
            <text x={20 + (frac(VFB) + frac(VT)) / 2 * 560} y={52} textAnchor="middle" className="fill-amber-500" style={{ fontSize: 11.5, fontWeight: 700 }}>מחסור</text>
            <text x={20 + (frac(VT) + 1) / 2 * 560} y={52} textAnchor="middle" className="fill-emerald-600" style={{ fontSize: 11.5, fontWeight: 700 }}>היפוך</text>
            <circle cx={20 + frac(vg) * 560} cy={26} r={7} fill="#1e293b" stroke="#fff" strokeWidth={2} />
          </svg>
        </div>
      </div>

      {/* regime badge */}
      <div className={`rounded-2xl border-s-4 px-4 py-2.5 text-center text-base font-extrabold ${acc.border} ${acc.bg} ${acc.text}`}>
        משטר: {REGIME_HE[regime]} <span className="font-bold opacity-80">({REGIME_EN[regime]})</span>
        {sweep.playing && <span className="ms-2 text-sm font-bold text-rose-500">● הרצה</span>}
      </div>

      {/* guided-tour narration — turns the sweep into a narrated movie */}
      {(() => {
        const n = narration(regime, ac, mode)
        return (
          <div className={`overflow-hidden rounded-2xl border ${acc.border} bg-white`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${regime}|${ac}|${mode}`}
                initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                transition={{ duration: reduce ? 0 : 0.28, ease: 'easeInOut' }}
                className="flex items-start gap-3 p-3.5"
              >
                <span aria-hidden className="text-xl leading-none">{sweep.playing ? '🎬' : '💡'}</span>
                <p className="text-sm leading-relaxed text-slate-700">
                  <b className={acc.text}>{n.title}:</b> {n.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        )
      })()}

      {/* two columns: left = static views, right = C-V + AC */}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <p className="mb-1 text-center text-xs font-semibold text-slate-500">דיאגרמת פסים</p>
            <MosBandDiagram regime={regime} bendPx={bendPx} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <p className="mb-1 text-center text-xs font-semibold text-slate-500">צפיפות המטען <Tex>{'\\rho(x)'}</Tex></p>
            <MosChargeProfile regime={regime} wRel={wRel} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <p className="mb-1 text-center text-xs font-semibold text-slate-500">סכמת השכבות</p>
            <MosLayerSchematic regime={regime} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <p className="mb-1 text-center text-xs font-semibold text-slate-500">
              אופיין <Tex>{'C\\text{-}V'}</Tex> {ac ? `· ${MODE_LABEL[mode]}` : '· (נמדד עם אות AC)'}
            </p>
            <CVFrequencyChart
              {...cvParams}
              show={ac ? [mode] : ['LF', 'HF', 'DD']}
              vgNow={ac ? vg : undefined}
              activeMode={mode}
              trail={ac && sweep.playing ? sweep.trail.slice() : undefined}
              pulsing={ac && sweep.playing && !reduce}
            />
          </div>

          {/* AC small-signal ΔQ — the tangible part */}
          <div className={`rounded-2xl border p-3 transition ${ac ? 'border-pink-200 bg-pink-50/40' : 'border-slate-200 bg-slate-50'}`}>
            <p className="mb-1 text-center text-xs font-semibold text-slate-500">
              {ac ? 'אות-קטן: היכן מופיע ΔQ (ומי מגיב)' : 'הדליקו AC כדי לראות את תגובת ΔQ'}
            </p>
            {ac ? (
              <motion.div
                animate={reduce ? undefined : { opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <CapacitanceStack regime={regime} follows={acFollows} />
              </motion.div>
            ) : (
              <div className="opacity-40"><CapacitanceStack regime={regime} follows={acFollows} /></div>
            )}
            {ac && regime === 'inversion' && (
              <p className="mt-1 text-center text-xs leading-relaxed text-slate-500">
                {mode === 'LF' ? (
                  <>בתדר נמוך נושאי-המיעוט מספיקים להגיב → ΔQ בשכבת-ההיפוך, והקיבול חוזר ל-<Tex>{'C_{ox}'}</Tex>.</>
                ) : (
                  <>בתדר גבוה/מהיר נושאי-המיעוט לא מספיקים → ΔQ נשאר בקצה <Tex>{'W_{max}'}</Tex>, והקיבול ננעל על <Tex>{'C_{min}'}</Tex>.</>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* readouts */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <Readout label="$V_{FB}$" value={`${VFB.toFixed(2)} V`} accent="border-rose-100 bg-rose-50" />
        <Readout label="$V_T$" value={`${VT.toFixed(2)} V`} accent="border-emerald-100 bg-emerald-50" />
        <Readout label="$\\Delta V_{FB}$" value={`${dVfb >= 0 ? '+' : ''}${dVfb.toFixed(2)} V`} accent="border-amber-100 bg-amber-50" />
        <Readout label={'$\\psi_s$'} value={`${psiS.toFixed(3)} V`} accent="border-amber-100 bg-amber-50" />
        <Readout label="$W$" value={`${(W * 1e7).toFixed(0)} nm`} accent="border-sky-100 bg-sky-50" />
        <Readout label="$C_{ox}$" value={`${(Cox * 1e9).toFixed(0)} nF/cm²`} accent="border-violet-100 bg-violet-50" />
        <Readout label={`$C/C_{ox}$ (${mode})`} value={`${(Cnow / Cox).toFixed(2)}`} accent="border-slate-200 bg-slate-50" />
        <Readout label="$\\phi_F$" value={`${phiF.toFixed(3)} V`} accent="border-violet-100 bg-violet-50" />
      </div>
      <p className="text-center text-xs leading-relaxed text-slate-400">
        מטען-תחמוצת חיובי (<Tex>{'N_{ss}>0'}</Tex>) מזיז את <Tex>{'V_{FB}'}</Tex> ואת כל עקומת ה-<Tex>{'C\\text{-}V'}</Tex> שמאלה.
        {regime === 'depletion' && (
          <> {' · '}<Tex>{`C_{dep}=\\varepsilon_s/W\\approx ${(Cdep * 1e9).toFixed(0)}\\,nF/cm^2`}</Tex></>
        )}
      </p>
    </div>
  )
}
