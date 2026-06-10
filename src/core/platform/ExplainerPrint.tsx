import { createElement, type FC } from 'react'

/**
 * Print layout for a tabbed explainer: renders EVERY tab's panel stacked (each under its heading),
 * instead of the nav + single active panel. Used when usePrintMode() is true so a lesson's full
 * content lands in the PDF. Page-break-friendly.
 */
export default function ExplainerPrint({
  tabs,
  panels,
}: {
  tabs: { id: string; labelHe: string; icon?: string }[]
  panels: Record<string, FC>
}) {
  return (
    <div className="flex flex-col gap-8">
      {tabs.map((t) => (
        <section key={t.id} className="break-inside-avoid">
          <h2 className="mb-3 border-b-2 border-slate-200 pb-1 text-xl font-extrabold text-slate-800">
            {t.icon ? `${t.icon} ` : ''}
            {t.labelHe}
          </h2>
          {createElement(panels[t.id])}
        </section>
      ))}
    </div>
  )
}
