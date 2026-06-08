import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'

/**
 * Interactive decomposition of the BJT terminal currents on the E-B-C cross-section
 * (forward-active npn). Click a component to highlight it and read its role:
 *   • I_nE — electrons injected by the emitter (the useful current);
 *   • I_pE — holes back-injected base→emitter (loss → lowers γ);
 *   • I_R  — recombination in the base (loss → lowers b).
 * From these: I_E = I_nE + I_pE, I_B = I_pE + I_R, I_C ≈ b·I_nE = α·I_E. Pure schematic.
 */
const W = 540
const H = 220
const xE0 = 84
const xEB = 208
const xBC = 252
const xC1 = 472
const yTop = 60
const yBot = 150
const yMid = (yTop + yBot) / 2
const SKY = '#0ea5e9'
const ROSE = '#f43f5e'
const AMBER = '#f59e0b'

type Key = 'nE' | 'pE' | 'R'
const COMPS: { key: Key; sym: string; color: string; he: ReactNode }[] = [
  { key: 'nE', sym: 'I_{nE}', color: SKY, he: <>אלקטרונים שהפולט <b>מזריק</b> אל הבסיס — הזרם <b>המועיל</b>. רובם חוצים את הבסיס הדק ומגיעים לקולט.</> },
  { key: 'pE', sym: 'I_{pE}', color: ROSE, he: <>חורים המוזרקים <b>נגדית</b> מהבסיס לפולט — <b>אובדן</b> שמקטין את נצילות-ההזרקה <Tex>{'\\gamma'}</Tex>.</> },
  { key: 'R', sym: 'I_R', color: AMBER, he: <>חלק מהאלקטרונים <b>מתרקומבן</b> בבסיס לפני שהגיע לקולט — אובדן שמקטין את מקדם-המעבר <Tex>{'b'}</Tex>.</> },
]

export default function CurrentComponents() {
  const [sel, setSel] = useState<Key>('nE')
  const op = (k: Key) => (sel === k ? 1 : 0.18)

  return (
    <div className="flex flex-col gap-4">
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <marker id="cc-sky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={SKY} /></marker>
            <marker id="cc-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={ROSE} /></marker>
            <marker id="cc-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1,1 L9,5 L1,9 Z" fill={AMBER} /></marker>
          </defs>
          <rect x={2} y={2} width={W - 4} height={H - 4} rx={14} fill="#fcfdff" stroke="#eef2f7" />

          {/* slabs */}
          <rect x={xE0} y={yTop} width={xEB - xE0} height={yBot - yTop} fill={SKY} fillOpacity={0.12} stroke={SKY} strokeOpacity={0.4} />
          <rect x={xEB} y={yTop} width={xBC - xEB} height={yBot - yTop} fill={ROSE} fillOpacity={0.12} stroke={ROSE} strokeOpacity={0.4} />
          <rect x={xBC} y={yTop} width={xC1 - xBC} height={yBot - yTop} fill={SKY} fillOpacity={0.08} stroke={SKY} strokeOpacity={0.4} />
          <text x={(xE0 + xEB) / 2} y={yTop + 17} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 13, fontWeight: 800 }}>N · פולט</text>
          <text x={(xEB + xBC) / 2} y={yTop + 16} textAnchor="middle" className="fill-rose-600" style={{ fontSize: 11, fontWeight: 800 }}>P</text>
          <text x={(xBC + xC1) / 2} y={yTop + 17} textAnchor="middle" className="fill-sky-700" style={{ fontSize: 13, fontWeight: 800 }}>N · קולט</text>
          {/* W_B brace label */}
          <text x={(xEB + xBC) / 2} y={yBot + 14} textAnchor="middle" className="fill-rose-500" style={{ fontSize: 9, fontWeight: 700 }}>W<tspan dy={2} style={{ fontSize: 7 }}>B</tspan></text>

          {/* terminals */}
          <line x1={xE0} y1={yMid} x2={30} y2={yMid} stroke="#475569" strokeWidth={2} />
          <text x={26} y={yMid - 8} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 800 }}>E</text>
          <line x1={xC1} y1={yMid} x2={W - 30} y2={yMid} stroke="#475569" strokeWidth={2} />
          <text x={W - 26} y={yMid - 8} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 11, fontWeight: 800 }}>C</text>

          {/* I_nE — electrons emitter → across base → collector (useful) */}
          <g opacity={op('nE')}>
            <line x1={xE0 + 14} y1={yMid - 12} x2={xC1 - 14} y2={yMid - 12} stroke={SKY} strokeWidth={3} markerEnd="url(#cc-sky)" />
            <text x={(xE0 + xC1) / 2} y={yMid - 18} textAnchor="middle" fill={SKY} style={{ fontSize: 11, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 7.5 }}>nE</tspan></text>
          </g>

          {/* I_pE — holes back-injected base → emitter (loss) */}
          <g opacity={op('pE')}>
            <line x1={xEB - 2} y1={yMid + 16} x2={xE0 + 12} y2={yMid + 16} stroke={ROSE} strokeWidth={2.25} markerEnd="url(#cc-rose)" />
            <text x={(xE0 + xEB) / 2} y={yMid + 30} textAnchor="middle" fill={ROSE} style={{ fontSize: 10.5, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 7 }}>pE</tspan></text>
          </g>

          {/* I_R — recombination in the base */}
          <g opacity={op('R')}>
            <line x1={(xEB + xBC) / 2} y1={yMid - 4} x2={(xEB + xBC) / 2} y2={yBot - 30} stroke={AMBER} strokeWidth={2.25} markerEnd="url(#cc-amber)" />
            <text x={(xEB + xBC) / 2 + 4} y={yBot - 34} textAnchor="start" fill={AMBER} style={{ fontSize: 10.5, fontWeight: 800 }}>I<tspan dy={2} style={{ fontSize: 7 }}>R</tspan></text>
          </g>
        </svg>
      </div>

      {/* component selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {COMPS.map((c) => (
          <button
            key={c.key}
            onClick={() => setSel(c.key)}
            aria-pressed={sel === c.key}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition ${sel === c.key ? 'text-white shadow' : 'bg-white'}`}
            style={sel === c.key ? { backgroundColor: c.color, borderColor: c.color } : { borderColor: c.color, color: c.color }}
            dir="ltr"
          >
            <Tex>{c.sym}</Tex>
          </button>
        ))}
      </div>
      <div className="rounded-xl border-s-4 bg-slate-50/70 p-3 text-sm leading-relaxed text-slate-700" style={{ borderColor: COMPS.find((c) => c.key === sel)!.color }}>
        {COMPS.find((c) => c.key === sel)!.he}
      </div>

      {/* relations */}
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { tex: 'I_E=I_{nE}+I_{pE}', n: 'זרם הפולט' },
          { tex: 'I_B=I_{pE}+I_R', n: 'זרם הבסיס (קטן)' },
          { tex: 'I_C\\approx b\\,I_{nE}=\\alpha I_E', n: 'זרם הקולט' },
        ].map((r, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-2.5 text-center">
            <p className="text-base" dir="ltr"><Tex>{r.tex}</Tex></p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{r.n}</p>
          </div>
        ))}
      </div>
      <p className="rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
        מכאן שני המקדמים: <b>נצילות-הזרקה</b> <Tex>{'\\gamma=I_{nE}/I_E'}</Tex> (כמה מזרם-הפולט הוא הזרקה מועילה),
        ו<b>מקדם-מעבר</b> <Tex>{'b=I_C/I_{nE}'}</Tex> (כמה מההזרקה שורד לקולט). מכפלתם — <Tex>{'\\alpha=\\gamma b'}</Tex>.
      </p>
    </div>
  )
}
