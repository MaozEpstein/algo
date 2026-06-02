import Tex from '@/core/components/Tex'
import Panel from '../components/Panel'
import DsDemo, { type DsPreset } from '../components/DsDemo'
import { hashFunctionsBlock } from '../pseudocode'
import { runHashDistribution } from '../algorithms/hashFunctions'

const KEYS = [12, 7, 25, 18, 3, 10, 22]
const PRESETS: DsPreset[] = [
  { labelHe: 'שיטת החילוק', array: KEYS, extra: { m: 7, method: 0 }, noteHe: 'h(k) = k mod m — פשוט ומהיר.' },
  { labelHe: 'שיטת הכפל', array: KEYS, extra: { m: 7, method: 1 }, noteHe: 'h(k) = ⌊m·(kA mod 1)⌋ — פחות רגיש לבחירת m.' },
  { labelHe: 'התנגשויות (כפולות של m)', array: [7, 14, 21, 3, 10, 17], extra: { m: 7, method: 0 }, noteHe: 'כל הכפולות של 7 נופלות לתא 0 — פיזור גרוע.' },
]

export default function HashFunctionsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="פונקציית גיבוב: ממפתח לתא">
        <p className="leading-relaxed text-slate-600">
          פונקציית גיבוב <Tex>{'h : U \\to \\{0,\\dots,m-1\\}'}</Tex> מכווצת את טווח המפתחות לטווח קטן של{' '}
          <Tex>m</Tex> תאים. פונקציה טובה <b>מפזרת</b> את המפתחות אחיד ואינה תלויה בתבניות בקלט.
        </p>
        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <b className="text-slate-700">שיטת החילוק</b>
            <div className="mt-1">
              <Tex block>{'h(k) = k \\bmod m'}</Tex>
            </div>
            <p className="mt-1 text-sm text-slate-500">בוחרים <Tex>m</Tex> ראשוני, רחוק מחזקת 2 (אחרת תלוי רק בסיביות הנמוכות).</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <b className="text-slate-700">שיטת הכפל</b>
            <div className="mt-1">
              <Tex block>{'h(k) = \\lfloor m\\,(kA \\bmod 1)\\rfloor, \\quad A = \\tfrac{\\sqrt5-1}{2} \\approx 0.618'}</Tex>
            </div>
            <p className="mt-1 text-sm text-slate-500">פחות רגיש לבחירת <Tex>m</Tex>; קנוט ממליץ על <Tex>A</Tex> זה.</p>
          </div>
        </div>
      </Panel>

      <Panel title="התפלגות המפתחות בתאים">
        <p className="mb-3 text-sm text-slate-500">
          כל מפתח "עף" לתא <Tex>{'h(k)'}</Tex> ובונה היסטוגרמה. השוו בין שתי השיטות — ככל שהפיזור אחיד יותר, השרשראות
          קצרות יותר.
        </p>
        <DsDemo titleHe="פונקציית גיבוב" block={hashFunctionsBlock} run={runHashDistribution} presets={PRESETS} varsPlacement="side" />
      </Panel>
    </div>
  )
}
