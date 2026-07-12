import { Fragment } from 'react'
import Tex from './Tex'

/**
 * Render a plain string that may contain inline math and simple emphasis:
 * any segment wrapped in `$…$` is rendered as KaTeX (via Tex), and any segment
 * wrapped in `<b>…</b>` is rendered bold (its inner text may itself contain
 * `$…$`). Everything else is plain text. Lets data-strings (glossary defs,
 * narration steps, "meaning" lines) show pretty symbols like `$N_A$` and bold
 * emphasis without becoming JSX. The house standard for any prose that mentions
 * a symbol. Strings without `$` or `<b>` are unaffected.
 */
export default function RichText({ children }: { children: string }) {
  return <>{renderBold(children)}</>
}

/** Split on `<b>…</b>`, rendering matched segments bold; the rest goes to math. */
function renderBold(text: string) {
  return text.split(/(<b>.*?<\/b>)/g).map((seg, i) => {
    const bold = seg.match(/^<b>([\s\S]*)<\/b>$/)
    return bold ? (
      <b key={i}>{renderMath(bold[1])}</b>
    ) : (
      <Fragment key={i}>{renderMath(seg)}</Fragment>
    )
  })
}

/** Split on `$…$`, rendering matched segments as KaTeX; the rest as text. */
function renderMath(text: string) {
  return text
    .split(/\$([^$]+)\$/)
    .map((seg, i) => (i % 2 === 1 ? <Tex key={i}>{seg}</Tex> : <Fragment key={i}>{seg}</Fragment>))
}
