import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import SortDemo, { type DemoPreset } from '../components/SortDemo'
import { radixSortBlock } from '../pseudocode'
import { runRadixSort, radixSortSpec } from '../algorithms/radixSort'

const PRESETS: DemoPreset[] = [
  { labelHe: 'דו-ספרתי', array: [29, 13, 48, 5, 31, 27] },
  { labelHe: 'הפוך', array: [48, 31, 29, 27, 13, 5] },
  { labelHe: 'כפילויות', array: [33, 12, 21, 12, 7, 33], noteHe: 'ערכים שווים שומרים על סדרם — תודות למיון היציב בכל מעבר.' },
]

export default function RadixTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מיון בסיס — הרעיון">
        <p className="leading-relaxed text-slate-600">
          ממיינים מספר רב-ספרתי <b>ספרה אחר ספרה</b>, החל מה<b>פחות-משמעותית</b> (LSD).
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          בכל מעבר מחלקים את המספרים ל-10 דליים לפי הספרה הנוכחית, ואוספים חזרה לפי סדר הדליים.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          הקסם הוא ש-המיון הפנימי <b>יציב</b>: כך הסדר שהושג בספרות הקודמות נשמר, וכל מעבר רק משכלל אותו.
          אחרי <Tex>d</Tex> ספרות — ממוין.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={radixSortSpec} />
        </div>
      </Panel>

      <SortDemo titleHe="מיון בסיס" block={radixSortBlock} run={runRadixSort} presets={PRESETS} />
    </div>
  )
}
