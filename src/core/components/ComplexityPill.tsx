import Tex from './Tex'

/**
 * A complexity value rendered as a colored pill, where the colour encodes the
 * growth class — green (fast) → red (slow). Gives the summary tables a
 * consistent, at-a-glance feel. Pass the LaTeX complexity (e.g. 'O(n \\log n)').
 */
type Cls = 'const' | 'log' | 'lin' | 'nlogn' | 'quad' | 'exp' | 'other'

const STYLE: Record<Cls, string> = {
  const: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  log: 'bg-teal-50 text-teal-700 ring-teal-100',
  lin: 'bg-sky-50 text-sky-700 ring-sky-100',
  nlogn: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  quad: 'bg-amber-50 text-amber-700 ring-amber-100',
  exp: 'bg-rose-50 text-rose-700 ring-rose-100',
  other: 'bg-slate-100 text-slate-700 ring-slate-200',
}

function classify(tex: string): Cls {
  const t = tex.replace(/\s/g, '').toLowerCase()
  if (t.includes('2^')) return 'exp'
  if (t.includes('n^2') || t.includes('n²')) return 'quad'
  if (t.includes('n\\log') || t.includes('nlogn')) return 'nlogn'
  if (t.includes('log')) return 'log'
  if (t.includes('(1)')) return 'const'
  if (t.includes('n')) return 'lin'
  return 'other'
}

export default function ComplexityPill({ tex }: { tex: string }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-lg px-2.5 py-1 font-semibold ring-1 ${STYLE[classify(tex)]}`}
    >
      <Tex>{tex}</Tex>
    </span>
  )
}
