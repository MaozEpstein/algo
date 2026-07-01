import type { ReactNode } from 'react'
import DeepLinkChip from './DeepLinkChip'

export interface CompareColumn {
  key: string
  label: ReactNode
  lectureId: string
  tab?: string
  accent?: string // header bg tint
}
export interface CompareRow {
  label: ReactNode
  cells: Record<string, ReactNode>
}

/** A generic device-comparison table: one column per device (with a deep-link header), one row per
 *  attribute. The row-label column is sticky-styled; cells may hold Tex/JSX. RTL-friendly. */
export default function CompareTable({ columns, rows }: { columns: CompareColumn[]; rows: CompareRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-card">
      <table className="w-full border-collapse text-center text-sm">
        <thead>
          <tr>
            <th className="bg-slate-100 px-3 py-3" />
            {columns.map((c) => (
              <th key={c.key} className={`px-3 py-3 ${c.accent ?? 'bg-slate-50'}`}>
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-base font-extrabold text-slate-800">{c.label}</span>
                  <DeepLinkChip lectureId={c.lectureId} tab={c.tab}>לשיעור</DeepLinkChip>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <th className="bg-slate-50 px-3 py-3 text-start text-xs font-bold text-slate-500">{r.label}</th>
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-3 align-middle">
                  {r.cells[c.key] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
