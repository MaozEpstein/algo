import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import SortDemo, { type DemoPreset } from '../components/SortDemo'
import { countingSortBlock } from '../pseudocode'
import { runCountingSort, countingSortSpec } from '../algorithms/countingSort'

const PRESETS: DemoPreset[] = [
  { labelHe: 'טווח קטן', array: [3, 1, 2, 3, 1, 2] },
  { labelHe: 'כפילויות', array: [2, 2, 2, 1, 3, 1], noteHe: 'שימו לב: ערכים שווים שומרים על סדרם המקורי — המיון יציב.' },
  { labelHe: 'מגוון', array: [4, 2, 5, 1, 3, 2] },
]

export default function CountingTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מיון מנייה (Counting Sort) — הרעיון">
        <p className="leading-relaxed text-slate-600">
          ההנחה: המפתחות הם שלמים בטווח קטן <Tex>{'1..k'}</Tex>. במקום להשוות, <b>סופרים</b> כמה פעמים
          מופיע כל ערך.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          הופכים את הספירות ל<b>סכומי-רישא</b> (כמה איברים ≤ כל ערך) — וזה בדיוק האינדקס שאליו כל ערך
          צריך להגיע בפלט. מציבים <b>מימין לשמאל</b> כדי לשמור על יציבות.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          שימו לב לאורכים: הקלט והפלט הם <Tex>{'A[1..n]'}</Tex> ו-<Tex>{'B[1..n]'}</Tex> (תא לכל
          איבר), אבל מערך המונים <Tex>{'C[1..k]'}</Tex> אורכו <Tex>k</Tex> — <b>תא לכל ערך אפשרי</b>,
          לא לכל איבר. לכן הוא יכול להיות קצר או ארוך מ-<Tex>A</Tex>.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={countingSortSpec} />
        </div>
      </Panel>

      <SortDemo
        titleHe="מיון מנייה — Counting Sort"
        block={countingSortBlock}
        run={runCountingSort}
        presets={PRESETS}
        varsPlacement="side"
        editable={{ min: 2, max: 8, minValue: 1, maxValue: 6 }}
      />
    </div>
  )
}
