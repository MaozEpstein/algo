import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'

/**
 * Interactive build-up of the SRH trap kinetics. The band diagram (E_c, trap E_T,
 * E_v) carries the four elementary processes a/b/c/d; selecting one highlights its
 * arrow AND lights up the matching term in the two master rate equations, so the
 * learner assembles −dn/dt and −dp/dt piece by piece. Pure SVG + KaTeX.
 */
type Proc = 'a' | 'b' | 'c' | 'd'
type Sel = Proc | 'all'

const W = 460
const H = 250
const EC = 60
const ET = 125
const EV = 190
const CX = W / 2

const SKY = '#0ea5e9'
const ROSE = '#f43f5e'

type ProcDef = { id: Proc; he: string; x: number; y1: number; y2: number; color: string; term: string; eq: 1 | 2; body: ReactNode }

const PROCS: ProcDef[] = [
  {
    id: 'a', he: 'לכידת אלקטרון', x: CX - 70, y1: EC, y2: ET, color: SKY, term: 'C_n p_T n', eq: 1,
    body: <>אלקטרון מפס ההולכה <b>נלכד</b> במלכודת. הקצב <Tex>{'\\propto'}</Tex> ריכוז המלכודות הריקות <Tex>{'p_T'}</Tex>, ריכוז האלקטרונים <Tex>{'n'}</Tex>, ומקדם הלכידה <Tex>{'C_n'}</Tex>.</>,
  },
  {
    id: 'b', he: 'פליטת אלקטרון', x: CX - 26, y1: ET, y2: EC, color: SKY, term: 'E_n n_T', eq: 1,
    body: <>אלקטרון לכוד <b>נפלט</b> חזרה לפס ההולכה. הקצב <Tex>{'\\propto'}</Tex> ריכוז המלכודות המלאות <Tex>{'n_T'}</Tex> ומקדם הפליטה <Tex>{'E_n'}</Tex>.</>,
  },
  {
    id: 'c', he: 'לכידת חור', x: CX + 26, y1: ET, y2: EV, color: ROSE, term: 'C_p n_T p', eq: 2,
    body: <>מלכודת מלאה <b>לוכדת חור</b> מפס הערכיות (אלקטרון יורד ל-<Tex>{'E_v'}</Tex>). הקצב <Tex>{'\\propto n_T\\,p'}</Tex>.</>,
  },
  {
    id: 'd', he: 'פליטת חור', x: CX + 70, y1: EV, y2: ET, color: ROSE, term: 'E_p p_T', eq: 2,
    body: <>מלכודת <b>פולטת חור</b> לפס הערכיות. הקצב <Tex>{'\\propto'}</Tex> ריכוז המלכודות הריקות <Tex>{'p_T'}</Tex> ומקדם הפליטה <Tex>{'E_p'}</Tex>.</>,
  },
]

const isActive = (sel: Sel, id: Proc) => sel === 'all' || sel === id

/** One term of a rate equation, highlighted (amber) when its process is selected. */
function Term({ tex, on }: { tex: string; on: boolean }) {
  return (
    <span className={`rounded px-1.5 py-0.5 transition ${on ? 'bg-amber-100 ring-1 ring-amber-300' : ''}`} dir="ltr">
      <Tex>{tex}</Tex>
    </span>
  )
}

export default function SrhTrapProcesses() {
  const [sel, setSel] = useState<Sel>('a')
  const current = PROCS.find((p) => p.id === sel)

  return (
    <div className="flex flex-col gap-3">
      {/* process picker */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PROCS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSel(p.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              sel === p.id ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <span className="font-mono" dir="ltr">{p.id}</span> · {p.he}
          </button>
        ))}
        <button
          onClick={() => setSel('all')}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
            sel === 'all' ? 'border-slate-800 bg-slate-800 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          הכל
        </button>
      </div>

      {/* band diagram with the four processes */}
      <div className="ltr w-full" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <marker id="srh-ar-sky" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L5,10 L10,0 z" fill={SKY} />
            </marker>
            <marker id="srh-ar-rose" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L5,10 L10,0 z" fill={ROSE} />
            </marker>
            <linearGradient id="srh-cb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bfdbfe" />
              <stop offset="100%" stopColor="#eff6ff" />
            </linearGradient>
            <linearGradient id="srh-vb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fee2e2" />
              <stop offset="100%" stopColor="#fef2f2" />
            </linearGradient>
          </defs>

          {/* bands */}
          <rect x={30} y={EC - 34} width={W - 42} height={34} rx={7} fill="url(#srh-cb)" />
          <rect x={30} y={EV} width={W - 42} height={34} rx={7} fill="url(#srh-vb)" />
          <line x1={30} y1={EC} x2={W - 12} y2={EC} stroke="#1e293b" strokeWidth={2.5} />
          <line x1={30} y1={EV} x2={W - 12} y2={EV} stroke="#1e293b" strokeWidth={2.5} />
          {/* trap level */}
          <line x1={CX - 110} y1={ET} x2={CX + 110} y2={ET} stroke="#d97706" strokeWidth={2.5} strokeDasharray="7 4" />

          <text x={26} y={EC + 5} textAnchor="end" className="fill-sky-700" style={{ fontSize: 16, fontWeight: 800 }}>
            E<tspan dy={3} style={{ fontSize: 12 }}>c</tspan>
          </text>
          <text x={26} y={EV + 18} textAnchor="end" className="fill-rose-600" style={{ fontSize: 16, fontWeight: 800 }}>
            E<tspan dy={3} style={{ fontSize: 12 }}>v</tspan>
          </text>
          <text x={CX - 116} y={ET + 4} textAnchor="end" className="fill-amber-600" style={{ fontSize: 15, fontWeight: 700 }}>
            E<tspan dy={3} style={{ fontSize: 11 }}>T</tspan>
          </text>

          {/* the four process arrows */}
          {PROCS.map((p) => {
            const on = isActive(sel, p.id)
            const dir = p.y2 > p.y1 ? 1 : -1
            const marker = p.color === SKY ? 'srh-ar-sky' : 'srh-ar-rose'
            return (
              <g key={p.id} opacity={on ? 1 : 0.18}>
                <line
                  x1={p.x}
                  y1={p.y1 + dir * 10}
                  x2={p.x}
                  y2={p.y2 - dir * 12}
                  stroke={p.color}
                  strokeWidth={on ? 3.5 : 2.5}
                  markerEnd={`url(#${marker})`}
                />
                <text x={p.x} y={(p.y1 + p.y2) / 2 + 4} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fontWeight: 800, fill: p.color }}>
                  {p.id}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* caption for the selected process */}
      {current && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm leading-relaxed text-slate-700">
          <b className="font-mono" dir="ltr">{current.id}</b> · <b>{current.he}</b> — {current.body}
        </div>
      )}

      {/* the two master equations — terms light up with the selection */}
      <div className="flex flex-col gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/40 px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-slate-800">
          <span dir="ltr"><Tex>{'-\\tfrac{dn}{dt}='}</Tex></span>
          <Term tex="C_n p_T n" on={isActive(sel, 'a')} />
          <span dir="ltr"><Tex>{'-'}</Tex></span>
          <Term tex="E_n n_T" on={isActive(sel, 'b')} />
          <span className="ms-1 text-xs text-slate-400">(a − b)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-slate-800">
          <span dir="ltr"><Tex>{'-\\tfrac{dp}{dt}='}</Tex></span>
          <Term tex="C_p n_T p" on={isActive(sel, 'c')} />
          <span dir="ltr"><Tex>{'-'}</Tex></span>
          <Term tex="E_p p_T" on={isActive(sel, 'd')} />
          <span className="ms-1 text-xs text-slate-400">(c − d)</span>
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-sky-500" /> תהליכי אלקטרון (a, b)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-rose-500" /> תהליכי חור (c, d)</span>
        <span className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-3.5 border-b-2 border-dashed border-amber-500" /> מלכודת E_T</span>
      </div>
    </div>
  )
}
