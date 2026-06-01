import { useState } from 'react'

/**
 * An illustrative comparison decision tree for sorting n=3 elements. Internal
 * nodes (circles) are comparisons (i:j); leaves (cards) are the 3! = 6 possible
 * orderings. Picking an input highlights its root→leaf path — showing that some
 * inputs force 3 comparisons, i.e. the height is 3 = ⌈lg 6⌉. The "see it" behind
 * the Ω(n log n) lower bound.
 */
interface Node {
  id: string
  label: string
  cx: number
  cy: number
  leaf?: boolean
}

const W = 680
const H = 330
const R = 24 // comparison-node circle radius
const LW = 60 // leaf width
const LH = 34 // leaf height

// centres of every node — balanced layout
const NODES: Record<string, Node> = {
  r: { id: 'r', label: '1:2', cx: 340, cy: 40 },
  a: { id: 'a', label: '2:3', cx: 190, cy: 124 },
  b: { id: 'b', label: '1:3', cx: 490, cy: 124 },
  L123: { id: 'L123', label: '⟨1,2,3⟩', cx: 92, cy: 210, leaf: true },
  c: { id: 'c', label: '1:3', cx: 268, cy: 208 },
  L213: { id: 'L213', label: '⟨2,1,3⟩', cx: 412, cy: 210, leaf: true },
  d: { id: 'd', label: '2:3', cx: 566, cy: 208 },
  L132: { id: 'L132', label: '⟨1,3,2⟩', cx: 214, cy: 292, leaf: true },
  L312: { id: 'L312', label: '⟨3,1,2⟩', cx: 312, cy: 292, leaf: true },
  L231: { id: 'L231', label: '⟨2,3,1⟩', cx: 512, cy: 292, leaf: true },
  L321: { id: 'L321', label: '⟨3,2,1⟩', cx: 610, cy: 292, leaf: true },
}

const EDGES: { from: string; to: string; branch: '≤' | '>' }[] = [
  { from: 'r', to: 'a', branch: '≤' },
  { from: 'r', to: 'b', branch: '>' },
  { from: 'a', to: 'L123', branch: '≤' },
  { from: 'a', to: 'c', branch: '>' },
  { from: 'b', to: 'L213', branch: '≤' },
  { from: 'b', to: 'd', branch: '>' },
  { from: 'c', to: 'L132', branch: '≤' },
  { from: 'c', to: 'L312', branch: '>' },
  { from: 'd', to: 'L231', branch: '≤' },
  { from: 'd', to: 'L321', branch: '>' },
]

const PRESETS: { labelHe: string; a: number[] }[] = [
  { labelHe: 'כבר ממוין', a: [1, 2, 3] },
  { labelHe: 'הפוך', a: [3, 2, 1] },
  { labelHe: 'אקראי', a: [2, 3, 1] },
]

function pathFor(a: number[]): string[] {
  const [x, y, z] = a
  if (x <= y) {
    if (y <= z) return ['r', 'a', 'L123']
    return x <= z ? ['r', 'a', 'c', 'L132'] : ['r', 'a', 'c', 'L312']
  }
  if (x <= z) return ['r', 'b', 'L213']
  return y <= z ? ['r', 'b', 'd', 'L231'] : ['r', 'b', 'd', 'L321']
}

/** Bottom port (where an outgoing edge leaves) / top port (where it arrives). */
const botPort = (n: Node) => ({ x: n.cx, y: n.leaf ? n.cy + LH / 2 : n.cy + R })
const topPort = (n: Node) => ({ x: n.cx, y: n.leaf ? n.cy - LH / 2 : n.cy - R })

export default function DecisionTree() {
  const [a, setA] = useState<number[] | null>(null)
  const path = a ? pathFor(a) : []
  const onPath = new Set(path)
  const edgeOn = (from: string, to: string) => {
    const i = path.indexOf(from)
    return i >= 0 && path[i + 1] === to
  }
  const comparisons = Math.max(0, path.length - 1)
  const orderedEdges = [...EDGES].sort(
    (e1, e2) => Number(edgeOn(e1.from, e1.to)) - Number(edgeOn(e2.from, e2.to)),
  ) // active edges last → drawn on top

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">בחרו קלט (3 איברים):</span>
        {PRESETS.map((p) => {
          const active = a?.join() === p.a.join()
          return (
            <button
              key={p.labelHe}
              onClick={() => setA(p.a)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                active ? 'border-sky-500 bg-sky-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {p.labelHe}{' '}
              <span dir="ltr" className="font-mono text-xs opacity-70">
                [{p.a.join(',')}]
              </span>
            </button>
          )
        })}
        {a && (
          <span className="ms-auto rounded-lg bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
            {comparisons} השוואות → המסלול
          </span>
        )}
      </div>

      <div className="ltr w-full overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3 ring-1 ring-slate-200" dir="ltr">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full" style={{ maxWidth: W }}>
          <defs>
            <linearGradient id="dt-node" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="dt-leaf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#34d399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
            <filter id="dt-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0ea5e9" floodOpacity="0.4" />
            </filter>
            <filter id="dt-glow-g" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10b981" floodOpacity="0.45" />
            </filter>
          </defs>

          {orderedEdges.map((e) => {
            const p1 = botPort(NODES[e.from])
            const p2 = topPort(NODES[e.to])
            const on = edgeOn(e.from, e.to)
            const mx = (p1.x + p2.x) / 2
            const my = (p1.y + p2.y) / 2
            return (
              <g key={`${e.from}-${e.to}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={on ? '#0ea5e9' : '#e2e8f0'}
                  strokeWidth={on ? 4 : 2}
                  strokeLinecap="round"
                />
                <text
                  x={mx + (e.branch === '≤' ? -12 : 12)}
                  y={my + 1}
                  fontSize={13}
                  fontWeight={800}
                  fill={on ? '#0284c7' : '#94a3b8'}
                  textAnchor="middle"
                  paintOrder="stroke"
                  stroke="#ffffff"
                  strokeWidth={4}
                >
                  {e.branch}
                </text>
              </g>
            )
          })}

          {Object.values(NODES).map((nd) => {
            const on = onPath.has(nd.id)
            const isEnd = on && path[path.length - 1] === nd.id
            if (nd.leaf) {
              return (
                <g key={nd.id} filter={isEnd ? 'url(#dt-glow-g)' : undefined}>
                  <rect
                    x={nd.cx - LW / 2}
                    y={nd.cy - LH / 2}
                    width={LW}
                    height={LH}
                    rx={10}
                    fill={isEnd ? 'url(#dt-leaf)' : '#ffffff'}
                    stroke={isEnd ? '#059669' : '#e2e8f0'}
                    strokeWidth={2}
                  />
                  <text
                    x={nd.cx}
                    y={nd.cy + 4}
                    fontSize={12}
                    fontWeight={700}
                    fontFamily="ui-monospace, monospace"
                    fill={isEnd ? '#ffffff' : '#64748b'}
                    textAnchor="middle"
                  >
                    {nd.label}
                  </text>
                </g>
              )
            }
            return (
              <g key={nd.id} filter={on ? 'url(#dt-glow)' : undefined}>
                <circle
                  cx={nd.cx}
                  cy={nd.cy}
                  r={R}
                  fill={on ? 'url(#dt-node)' : '#ffffff'}
                  stroke={on ? '#0284c7' : '#cbd5e1'}
                  strokeWidth={2.5}
                />
                <text
                  x={nd.cx}
                  y={nd.cy + 5}
                  fontSize={15}
                  fontWeight={800}
                  fontFamily="ui-monospace, monospace"
                  fill={on ? '#ffffff' : '#334155'}
                  textAnchor="middle"
                >
                  {nd.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
          השוואה <span dir="ltr" className="font-mono text-xs">(i:j)</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-4 w-5 rounded-md border-2 border-slate-200 bg-slate-50" />
          תוצאה (סידור)
        </span>
        <span>
          יש <b className="text-slate-700">3! = 6</b> עלים ⟸ הגובה ≥ ⌈log₂6⌉ = <b className="text-slate-700">3</b>.
        </span>
      </div>
    </div>
  )
}
