import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import DsDemo, { type DsPreset } from '../components/DsDemo'
import { stackBlock, queueBlock } from '../pseudocode'
import { runStack } from '../algorithms/stack'
import { runQueue } from '../algorithms/queue'
import { stackSpec, queueSpec } from '../specs'

// Op-stream encoding: a positive value = push/enqueue it, 0 = pop/dequeue.
const STACK_PRESETS: DsPreset[] = [
  { labelHe: 'דחיפות', array: [5, 8, 3, 9] },
  { labelHe: 'דחיפה והוצאה', array: [5, 8, 0, 3, 0, 0], noteHe: '0 = Pop. שימו לב שהאחרון שנכנס יוצא ראשון (LIFO).' },
  { labelHe: 'מחסנית גבוהה', array: [2, 4, 6, 8, 1, 0, 0] },
]

const QUEUE_PRESETS: DsPreset[] = [
  { labelHe: 'מילוי', array: [5, 8, 3, 9], extra: { m: 6 } },
  { labelHe: 'נכנס ויוצא', array: [5, 8, 0, 3, 0, 9], extra: { m: 6 }, noteHe: '0 = Dequeue. הראשון שנכנס יוצא ראשון (FIFO).' },
  { labelHe: 'מעגלי (wrap-around)', array: [1, 2, 3, 0, 0, 4, 5], extra: { m: 5 }, noteHe: 'rear עוקף את קצה החיץ וחוזר להתחלה — חיץ מעגלי.' },
]

export default function StacksQueuesTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מחסנית ותור — LIFO מול FIFO">
        <p className="leading-relaxed text-slate-600">
          שני מבני נתונים בסיסיים שתומכים בהכנסה והוצאה בזמן <b>קבוע</b>, אך בסדר הפוך:
        </p>
        <ul className="mt-2 flex flex-col gap-1.5 text-slate-600">
          <li>
            <b>מחסנית (Stack)</b> — <b>LIFO</b>: האחרון שנכנס ראשון יוצא. <code className="ltr font-mono">Push</code> ו-
            <code className="ltr font-mono">Pop</code> מתבצעים בראש בלבד.
          </li>
          <li>
            <b>תור (Queue)</b> — <b>FIFO</b>: הראשון שנכנס ראשון יוצא. <code className="ltr font-mono">Enqueue</code> ב-
            <code className="ltr font-mono">rear</code>, <code className="ltr font-mono">Dequeue</code> ב-
            <code className="ltr font-mono">front</code> (מימוש יעיל בחיץ מעגלי).
          </li>
        </ul>
        <p className="mt-2 text-sm text-slate-500">רשימות מקושרות ועצים בינאריים נדונים בספר (פרק 10) כבסיס למבנים אלו.</p>
      </Panel>

      <Panel title="מחסנית (Stack)">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm text-slate-500">בהדגמה: ערך חיובי = Push, ‏0 = Pop.</p>
          <ComplexityProofButton algo={stackSpec} />
        </div>
        <DsDemo titleHe="מחסנית" block={stackBlock} run={runStack} presets={STACK_PRESETS} varsPlacement="overlay" />
      </Panel>

      <Panel title="תור (Queue)">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm text-slate-500">בהדגמה: ערך חיובי = Enqueue, ‏0 = Dequeue.</p>
          <ComplexityProofButton algo={queueSpec} />
        </div>
        <DsDemo titleHe="תור מעגלי" block={queueBlock} run={runQueue} presets={QUEUE_PRESETS} varsPlacement="overlay" />
      </Panel>
    </div>
  )
}
