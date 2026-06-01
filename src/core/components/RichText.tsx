import { Fragment } from 'react'
import Tex from './Tex'

/**
 * Render a plain string that may contain inline math: any segment wrapped in
 * `$…$` is rendered as KaTeX (via Tex), the rest as text. Lets data-strings
 * (glossary defs, narration steps, readout labels) show pretty symbols like
 * `$N_A$`, `$E_F$`, `$V_{bi}$` without becoming JSX. The house standard for
 * any prose that mentions a symbol.
 */
export default function RichText({ children }: { children: string }) {
  return (
    <>
      {children.split(/\$([^$]+)\$/).map((seg, i) =>
        i % 2 === 1 ? <Tex key={i}>{seg}</Tex> : <Fragment key={i}>{seg}</Fragment>,
      )}
    </>
  )
}
