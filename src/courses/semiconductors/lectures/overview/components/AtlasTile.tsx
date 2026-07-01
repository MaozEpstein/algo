import { useState, type ReactNode } from 'react'
import RichText from '@/core/components/RichText'
import DeepLinkChip from './DeepLinkChip'

export interface AtlasView {
  label: string
  node: ReactNode
}

/** One tile in the band-diagram atlas: a title, a small toggle between views (e.g. equilibrium/bias
 *  or the MOS regimes), the reused band-diagram itself, a one-line caption, and a deep-link. */
export default function AtlasTile({
  title,
  caption,
  lectureId,
  tab,
  views,
}: {
  title: string
  caption: string
  lectureId: string
  tab?: string
  views: AtlasView[]
}) {
  const [i, setI] = useState(0)
  const view = views[i] ?? views[0]

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <DeepLinkChip lectureId={lectureId} tab={tab}>לשיעור</DeepLinkChip>
      </div>

      {views.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {views.map((v, idx) => (
            <button
              key={v.label}
              onClick={() => setI(idx)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                idx === i ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-xl bg-slate-50/60 p-1">{view.node}</div>
      <p className="text-xs leading-relaxed text-slate-600"><RichText>{caption}</RichText></p>
    </div>
  )
}
