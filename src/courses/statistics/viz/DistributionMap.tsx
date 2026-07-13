import { useState } from 'react'
import Tex from '@/core/components/Tex'

/**
 * An interactive map of how the common distributions relate. Nodes are the
 * families; labeled directed edges are the transformations (sum, limit, square,
 * CLT, interarrival, radius, vectorize). Hovering a node highlights its incident
 * edges + neighbours, turning the prose "relationships" list into one mental map.
 */

type NodeId = 'bern' | 'binom' | 'pois' | 'gauss' | 'exp' | 'unif' | 'chi2' | 'rayleigh' | 'mvn'

const NODES: { id: NodeId; label: string; tex: string; x: number; y: number }[] = [
  { id: 'unif', label: 'אחיד', tex: 'U(a,b)', x: 70, y: 60 },
  { id: 'bern', label: 'ברנולי', tex: '\\mathrm{Bern}', x: 70, y: 175 },
  { id: 'binom', label: 'בינומי', tex: '\\mathrm{Bin}', x: 210, y: 175 },
  { id: 'pois', label: 'פואסון', tex: '\\mathrm{Pois}', x: 350, y: 175 },
  { id: 'exp', label: 'מעריכי', tex: '\\mathrm{Exp}', x: 350, y: 60 },
  { id: 'gauss', label: 'גאוסי', tex: 'N(m,\\sigma^2)', x: 210, y: 60 },
  { id: 'chi2', label: 'χ²', tex: '\\chi^2_{(1)}', x: 210, y: 285 },
  { id: 'rayleigh', label: 'ריילי', tex: '\\mathrm{Rayleigh}', x: 340, y: 285 },
  { id: 'mvn', label: 'נורמלי רב-ממדי', tex: 'N(\\mu,\\Sigma)', x: 70, y: 285 },
]

const EDGES: { from: NodeId; to: NodeId; label: string }[] = [
  { from: 'bern', to: 'binom', label: 'סכום n' },
  { from: 'binom', to: 'pois', label: 'גבול n→∞' },
  { from: 'pois', to: 'exp', label: 'זמני המתנה' },
  { from: 'binom', to: 'gauss', label: 'CLT' },
  { from: 'gauss', to: 'chi2', label: 'ריבוע Z²' },
  { from: 'gauss', to: 'rayleigh', label: '2 גאוסים → רדיוס' },
  { from: 'gauss', to: 'mvn', label: 'וקטור' },
]

const NW = 420
const NH = 340

export default function DistributionMap() {
  const [active, setActive] = useState<NodeId | null>(null)
  const nodeOf = (id: NodeId) => NODES.find((n) => n.id === id)!
  const isEdgeOn = (e: { from: NodeId; to: NodeId }) => active === null || e.from === active || e.to === active
  const isNodeOn = (id: NodeId) =>
    active === null || id === active || EDGES.some((e) => (e.from === active && e.to === id) || (e.to === active && e.from === id))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <svg viewBox={`0 0 ${NW} ${NH}`} className="mx-auto block w-full" style={{ maxWidth: 560 }}>
        <defs>
          <marker id="dm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#94a3b8" />
          </marker>
          <marker id="dm-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#059669" />
          </marker>
        </defs>

        {/* edges */}
        {EDGES.map((e, i) => {
          const a = nodeOf(e.from)
          const b = nodeOf(e.to)
          const on = isEdgeOn(e)
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          return (
            <g key={i} opacity={on ? 1 : 0.18}>
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={on ? '#059669' : '#94a3b8'}
                strokeWidth={on ? 2 : 1.2}
                markerEnd={`url(#${on ? 'dm-arrow-on' : 'dm-arrow'})`}
              />
              <text x={mx} y={my - 3} textAnchor="middle" fontSize="8.5" fill={on ? '#047857' : '#94a3b8'} className="select-none">
                {e.label}
              </text>
            </g>
          )
        })}

        {/* nodes */}
        {NODES.map((nd) => {
          const on = isNodeOn(nd.id)
          const sel = active === nd.id
          return (
            <g
              key={nd.id}
              transform={`translate(${nd.x},${nd.y})`}
              opacity={on ? 1 : 0.3}
              onMouseEnter={() => setActive(nd.id)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive((v) => (v === nd.id ? null : nd.id))}
              className="cursor-pointer"
            >
              <rect x={-46} y={-18} width={92} height={36} rx={10}
                fill={sel ? '#059669' : '#ecfdf5'}
                stroke={sel ? '#047857' : '#6ee7b7'} strokeWidth={1.5} />
              <text textAnchor="middle" y={-2} fontSize="11" fontWeight="700" fill={sel ? '#fff' : '#065f46'} className="select-none">{nd.label}</text>
              <foreignObject x={-46} y={2} width={92} height={16}>
                <div dir="ltr" className={`text-center text-[9px] ${sel ? 'text-emerald-50' : 'text-emerald-500'}`}><Tex>{nd.tex}</Tex></div>
              </foreignObject>
            </g>
          )
        })}
      </svg>

      <p className="mt-2 text-center text-xs text-slate-400">
        עברו עם העכבר (או הקישו) על התפלגות כדי להאיר את קשריה. כל חץ הוא <b>טרנספורמציה</b>: סכום, גבול, ריבוע, רדיוס,
        או משפט הגבול המרכזי — והכול מוביל אל הגאוסי במרכז.
      </p>
    </div>
  )
}
