import type { ReactNode } from 'react'
import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import ProofButton from './ProofButton'

type Kind = 'definition' | 'theorem' | 'property'

const KIND_LABEL: Record<Kind, string> = {
  definition: 'הגדרה',
  theorem: 'משפט',
  property: 'תכונה',
}

/**
 * The atomic "definition unit" of the statistics course — the fixed contract for
 * teaching a new piece of the language:
 *   1. the formal statement (KaTeX block),
 *   2. "במילים" — what it actually means, in plain Hebrew,
 *   3. a small concrete example that runs the definition on real numbers,
 *   4. (optional) a proof button that opens the full derivation in a modal.
 * Everything a learner needs to internalise one symbol, in one place.
 */
export default function DefinitionCard({
  n,
  kind = 'definition',
  titleHe,
  tex,
  meaningHe,
  example,
  proof,
  proofLabel,
}: {
  /** Source numbering, e.g. '1.3' — shown as a subtle badge. */
  n?: string
  kind?: Kind
  titleHe: string
  /** The formal statement in LaTeX, rendered as a highlighted block. */
  tex?: string
  /** Plain-Hebrew meaning ("במילים"). May contain `$…$` inline math. */
  meaningHe: string
  /** A worked numeric example — the definition applied to real numbers. */
  example?: ReactNode
  /** Optional full derivation, opened in a modal from an inline button. */
  proof?: ComplexityProof
  proofLabel?: string
}) {
  return (
    <section className="rounded-2xl border border-slate-200 border-s-4 border-s-emerald-400 bg-white p-5 shadow-card">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
          {KIND_LABEL[kind]}
        </span>
        {n && (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-500">
            {n}
          </span>
        )}
        <h3 className="text-lg font-bold text-slate-800">{titleHe}</h3>
      </div>

      {tex && (
        <div className="mb-3 overflow-x-auto rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-center">
          <Tex block>{tex}</Tex>
        </div>
      )}

      <div className="flex gap-2 leading-relaxed text-slate-700">
        <span className="shrink-0 font-semibold text-emerald-700">במילים:</span>
        <p>
          <RichText>{meaningHe}</RichText>
        </p>
      </div>

      {example && (
        <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <span aria-hidden>🔢</span> דוגמה
          </div>
          <div className="leading-relaxed text-slate-700">{example}</div>
        </div>
      )}

      {proof && (
        <div className="mt-3">
          <ProofButton proof={proof} label={proofLabel ?? 'הוכחה'} titleHe={`${KIND_LABEL[kind]} · ${titleHe}`} />
        </div>
      )}
    </section>
  )
}
