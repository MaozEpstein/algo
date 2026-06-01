import { useMemo } from 'react'
import katex from 'katex'

/** Render a LaTeX snippet (LTR-isolated, safe inside the RTL page). */
export default function Tex({ children, block }: { children: string; block?: boolean }) {
  const html = useMemo(
    () =>
      katex.renderToString(children, {
        throwOnError: false,
        displayMode: !!block,
      }),
    [children, block],
  )
  return (
    <span
      className="ltr inline-block align-middle"
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
