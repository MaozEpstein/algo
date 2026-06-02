import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import DsDemo, { type DsPreset } from '../components/DsDemo'
import { openAddressingBlock } from '../pseudocode'
import { runOpenAddressing } from '../algorithms/openAddressing'
import { openAddressingSpec } from '../specs'

const PRESETS: DsPreset[] = [
  { labelHe: 'גישוש בסיסי', array: [12, 7, 25, 18, 3], extra: { m: 7 } },
  { labelHe: 'קלסטרינג', array: [7, 14, 21, 8, 15], extra: { m: 7 }, noteHe: 'כפולות של 7 מתנגשות ויוצרות רצף תפוס — הגישושים מתארכים.' },
  { labelHe: 'עם חיפוש', array: [12, 7, 25, 18, 3], extra: { m: 7, search: 25 }, noteHe: 'החיפוש חוזר על אותה סדרת גישושים כמו ההכנסה.' },
]

export default function OpenAddressingTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מיעון פתוח: בלי רשימות">
        <p className="leading-relaxed text-slate-600">
          ב<b>מיעון פתוח</b> כל המפתחות יושבים בטבלה עצמה — אין רשימות מקושרות. בהתנגשות <b>מגששים</b> את התא הפנוי הבא
          לפי סדרת גישושים. בגישוש לינארי:
        </p>
        <div className="mt-2">
          <Tex block>{'h(k, i) = (k \\bmod m + i) \\bmod m, \\quad i = 0, 1, 2, \\dots'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          החיפוש חוזר על אותה סדרת גישושים עד שמוצא את המפתח או מגיע לתא ריק. חובה <Tex>{'\\alpha < 1'}</Tex> (הטבלה
          לא יכולה להתמלא), ותוחלת הגישושים בחיפוש לא-מוצלח חסומה ב-<Tex>{'\\tfrac{1}{1-\\alpha}'}</Tex>.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={openAddressingSpec} />
        </div>
      </Panel>

      <DsDemo titleHe="מיעון פתוח" block={openAddressingBlock} run={runOpenAddressing} presets={PRESETS} varsPlacement="side" />

      <Panel title="הערה: מחיקה" defaultOpen={false}>
        <p className="leading-relaxed text-slate-600">
          מחיקה במיעון פתוח מורכבת: לא ניתן פשוט לרוקן תא, כי זה ישבור סדרות גישוש של מפתחות אחרים. הפתרון המקובל הוא
          סימון התא כ-<b>"מצבה" (tombstone)</b> — פנוי-לחיפוש אך תפוס-להכנסה.
        </p>
      </Panel>
    </div>
  )
}
