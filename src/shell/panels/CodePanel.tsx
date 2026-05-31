import { useState } from 'react'
import type { Frame, PseudocodeBlock, PseudocodeLang } from '@/engine/types'
import RoutineBadge from '@/components/RoutineBadge'

interface Props {
  blocks: PseudocodeBlock[]
  frame: Frame
  /** The id of the routine that is the "main" algorithm being run. */
  mainBlockId: string
  /** Short name of the main algorithm (shown as the caller for helpers). */
  mainTitleHe: string
}

/**
 * Shows the pseudocode block currently executing (frame.codeBlock), highlights
 * the running line, and badges the routine as a main algorithm or a helper —
 * noting which algorithm called it when it's a nested helper. Pseudo/Python
 * toggle. English + LTR, isolated from the surrounding Hebrew RTL layout.
 */
export default function CodePanel({ blocks, frame, mainBlockId, mainTitleHe }: Props) {
  const [lang, setLang] = useState<PseudocodeLang>('pseudo')
  const block = blocks.find((b) => b.id === frame.codeBlock) ?? blocks[0]
  if (!block) return null
  const lines = lang === 'python' && block.pythonLines ? block.pythonLines : block.lines
  const hasPython = !!block.pythonLines
  const isMain = block.id === mainBlockId
  const calledFrom = !isMain && block.kind === 'helper' ? mainTitleHe : undefined

  return (
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-semibold text-slate-700">{block.titleEn}</span>
          {hasPython && (
            <div className="flex items-center gap-1 rounded-full bg-slate-100 p-0.5 text-xs">
              <button
                onClick={() => setLang('pseudo')}
                className={`rounded-full px-2 py-0.5 transition ${
                  lang === 'pseudo' ? 'bg-white text-slate-800 shadow' : 'text-slate-500'
                }`}
              >
                פסאודו
              </button>
              <button
                onClick={() => setLang('python')}
                className={`rounded-full px-2 py-0.5 transition ${
                  lang === 'python' ? 'bg-white text-slate-800 shadow' : 'text-slate-500'
                }`}
              >
                Python
              </button>
            </div>
          )}
        </div>
        <RoutineBadge kind={block.kind} calledFromHe={calledFrom} size="sm" />
      </div>

      <pre className="ltr m-0 flex-1 overflow-auto p-3 font-mono text-[15px] leading-7">
        {lines.map((line, idx) => {
          const lineNo = idx + 1
          const active = frame.codeLine === lineNo
          return (
            <div
              key={lineNo}
              className={`flex gap-3 rounded-md px-2 transition-colors ${
                active
                  ? 'bg-sky-100 font-semibold text-slate-900'
                  : 'font-medium text-slate-700'
              }`}
            >
              <span
                className={`w-6 shrink-0 select-none text-right text-xs tabular-nums ${
                  active ? 'font-bold text-sky-600' : 'text-slate-400'
                }`}
              >
                {lineNo}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          )
        })}
      </pre>
    </div>
  )
}
