import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import LocalPlayer from '@/core/shell/LocalPlayer'
import Panel from '../components/Panel'
import { insertionSortBlock } from '../pseudocode'
import { runInsertionSort, insertionSortSpec } from '../algorithms/insertionSort'

const PRESETS: { labelHe: string; array: number[]; noteHe?: string }[] = [
  { labelHe: 'ממוין — המקרה הטוב', array: [1, 2, 3, 4, 5, 6], noteHe: 'O(n) — השוואה אחת לכל איבר, בלי הזזות.' },
  { labelHe: 'אקראי', array: [5, 3, 8, 4, 1, 7] },
  { labelHe: 'הפוך — המקרה הגרוע', array: [6, 5, 4, 3, 2, 1], noteHe: 'O(n²) — כל איבר מחליק עד תחילת המערך.' },
]

export default function InsertionSortTab() {
  const [array, setArray] = useState<number[]>(PRESETS[1].array)
  const frames = useMemo(() => runInsertionSort({ array }), [array])
  const active = PRESETS.find((p) => p.array.join() === array.join())

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מיון הכנסה — Insertion Sort">
        <p className="leading-relaxed text-slate-600">
          בכל צעד לוקחים את האיבר הבא ו<b>מכניסים</b> אותו למקומו באזור הממוין משמאלו — הוא "מחליק"
          שמאלה כל עוד השכן משמאלו גדול ממנו.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          שימו לב למונה ההשוואות וההחלפות: על קלט <b>ממוין</b> הוא <Tex>O(n)</Tex>, ועל קלט{' '}
          <b>הפוך</b> הוא קופץ ל-<Tex>O(n^2)</Tex> — בדיוק ההבדל בין מקרה טוב לגרוע.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">קלט:</span>
          {PRESETS.map((p) => (
            <button
              key={p.labelHe}
              onClick={() => setArray(p.array)}
              title={p.noteHe}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                p.array.join() === array.join()
                  ? 'border-sky-500 bg-sky-500 text-white shadow'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {p.labelHe}
            </button>
          ))}
        </div>
        {active?.noteHe && <p className="mt-2 text-sm text-slate-500">{active.noteHe}</p>}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={insertionSortSpec} />
        </div>
      </Panel>

      <LocalPlayer
        key={array.join(',')}
        frames={frames}
        pseudocode={[insertionSortBlock]}
        titleHe="מיון הכנסה"
        views={['array']}
        showCost
      />
    </div>
  )
}
