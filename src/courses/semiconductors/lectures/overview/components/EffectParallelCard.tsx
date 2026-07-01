import { Fragment } from 'react'
import RichText from '@/core/components/RichText'
import Tex from '@/core/components/Tex'
import type { EffectFamily } from '../data/crossLinks'
import DeepLinkChip from './DeepLinkChip'

/** Renders `**bold**` + `$math$` text: split on **, bold odd segments, RichText handles the $…$. */
function Rich({ children }: { children: string }) {
  return (
    <>
      {children.split('**').map((seg, i) =>
        i % 2 === 1 ? (
          <b key={i} className="text-slate-800">
            <RichText>{seg}</RichText>
          </b>
        ) : (
          <Fragment key={i}><RichText>{seg}</RichText></Fragment>
        ),
      )}
    </>
  )
}

/** One effect-FAMILY card: the shared physics on top, then a member card per device with its
 *  own formula and a deep-link — so the same effect across devices sits side by side. */
export default function EffectParallelCard({ family }: { family: EffectFamily }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border-s-4 border-indigo-500 bg-indigo-50/60 p-4 leading-relaxed text-slate-700">
        <div className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-800">
          <span aria-hidden>{family.icon}</span> {family.title}
        </div>
        <p className="text-sm"><Rich>{family.shared}</Rich></p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {family.members.map((m) => (
          <div key={m.device} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="text-sm font-bold text-slate-800">{m.device}</div>
            {m.formula && (
              <div className="w-full overflow-x-auto rounded-lg bg-slate-50 px-2 py-2 text-center">
                <Tex block>{m.formula}</Tex>
              </div>
            )}
            {m.note && <p className="text-xs leading-relaxed text-slate-600"><RichText>{m.note}</RichText></p>}
            <div className="mt-auto pt-1">
              <DeepLinkChip lectureId={m.lectureId} tab={m.tab}>לשיעור</DeepLinkChip>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
