import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import SortDemo, { type DemoPreset } from '../components/SortDemo'
import { bucketSortBlock } from '../pseudocode'
import { runBucketSort, bucketSortSpec } from '../algorithms/bucketSort'

// reals in [0,1) — passed as the same number[] channel
const PRESETS: DemoPreset[] = [
  { labelHe: 'פרוש אחיד', array: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94] },
  {
    labelHe: 'מקובץ',
    array: [0.71, 0.78, 0.72, 0.75, 0.12, 0.77],
    noteHe: 'כשרוב האיברים נופלים לדלי אחד, המיון הפנימי מתייקר — זה המקרה הגרוע O(n²).',
  },
  { labelHe: 'אקראי', array: [0.42, 0.05, 0.88, 0.51, 0.23, 0.67] },
]

export default function BucketTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מיון דלי — הרעיון">
        <p className="leading-relaxed text-slate-600">
          ההנחה: <Tex>n</Tex> מספרים ממשיים פרושים <b>אחיד</b> ב-<Tex>[0,1)</Tex>. פותחים <Tex>n</Tex>{' '}
          דליים, ומכניסים כל איבר <Tex>x</Tex> לדלי <Tex>{'\\lfloor n \\cdot x \\rfloor'}</Tex>.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          ממיינים כל דלי (מיון הכנסה — זול, כי הוא מכיל מעט איברים) ומשרשרים את הדליים לפי הסדר. בהתפלגות
          אחידה התוחלת היא <Tex>O(n)</Tex>.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={bucketSortSpec} />
        </div>
      </Panel>

      <SortDemo titleHe="מיון דלי" block={bucketSortBlock} run={runBucketSort} presets={PRESETS} varsPlacement="side" />
    </div>
  )
}
