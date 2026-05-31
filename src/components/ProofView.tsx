import type { ComplexityProof } from '@/engine/types'
import Tex from './Tex'

/** Renders a structured complexity proof: claim → numbered steps → intuition. */
export default function ProofView({ proof }: { proof: ComplexityProof }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-500">תוצאה:</span>
        <span className="rounded-lg bg-slate-900 px-3 py-1 text-white">
          <Tex>{proof.result}</Tex>
        </span>
      </div>

      <p className="font-medium leading-relaxed text-slate-700">{proof.claimHe}</p>

      <ol className="flex flex-col gap-3">
        {proof.steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              {i + 1}
            </span>
            <div className="flex flex-col gap-1.5">
              <p className="leading-relaxed text-slate-700">{s.he}</p>
              {s.tex && (
                <div className="rounded-lg bg-slate-50 px-3 py-2">
                  <Tex block>{s.tex}</Tex>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      {proof.intuitionHe && (
        <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
          <span className="font-semibold">💡 אינטואיציה: </span>
          {proof.intuitionHe}
        </div>
      )}
    </div>
  )
}
