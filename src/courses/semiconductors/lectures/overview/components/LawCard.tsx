import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import DeepLinkChip from './DeepLinkChip'

export interface LawDevice {
  label: string
  manifest: string // KaTeX — how the law looks in this device
  lectureId: string
  tab?: string
}

/** A "one law → many devices" card: the master equation on top, then how it reappears in each device. */
export default function LawCard({
  icon,
  title,
  equation,
  idea,
  devices,
}: {
  icon: string
  title: string
  equation: string
  idea: string
  devices: LawDevice[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-800">
        <span aria-hidden>{icon}</span> {title}
      </div>
      <div className="mb-3 rounded-xl border-2 border-sky-300 bg-sky-50/50 px-3 py-3 text-center">
        <div className="w-full overflow-x-auto"><Tex block>{equation}</Tex></div>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-600"><RichText>{idea}</RichText></p>
      <div className="grid gap-2.5 md:grid-cols-2">
        {devices.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-800">{d.label}</div>
              <div className="w-full overflow-x-auto text-slate-600"><Tex>{d.manifest}</Tex></div>
            </div>
            <DeepLinkChip lectureId={d.lectureId} tab={d.tab}>מקור</DeepLinkChip>
          </div>
        ))}
      </div>
    </div>
  )
}
