import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import DsDemo, { type DsPreset } from '../components/DsDemo'
import { chainingBlock } from '../pseudocode'
import { runChaining } from '../algorithms/chaining'
import { chainingSpec } from '../specs'

const PRESETS: DsPreset[] = [
  { labelHe: 'ללא התנגשויות', array: [1, 2, 3, 4], extra: { m: 5 } },
  { labelHe: 'התנגשויות', array: [12, 7, 25, 18, 3, 10], extra: { m: 5 }, noteHe: '12 ו-7 וגם 25 וכו׳ נופלים לאותם תאים — נוצרות שרשראות.' },
  { labelHe: 'גורם עומס גבוה (α>1)', array: [3, 8, 13, 18, 1, 6, 11], extra: { m: 5 }, noteHe: 'יותר מפתחות מתאים — α>1, השרשראות מתארכות.' },
  { labelHe: 'חיפוש בשרשרת', array: [12, 7, 25, 18, 3], extra: { m: 5, search: 7 }, noteHe: 'אחרי ההכנסות, מחפשים מפתח וסורקים את שרשרת התא שלו.' },
]

export default function ChainingTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="פתרון התנגשויות בשרשור">
        <p className="leading-relaxed text-slate-600">
          ב<b>שרשור</b> כל תא בטבלה מצביע ל<b>רשימה מקושרת</b> של כל המפתחות שמופו אליו. בהתנגשות פשוט מוסיפים את המפתח
          החדש ל<b>ראש</b> הרשימה — הכנסה ב-<Tex>O(1)</Tex>.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          החיפוש מחשב <Tex>{'h(k)'}</Tex> וסורק את שרשרת התא. בגיבוב אחיד פשוט, אורך שרשרת ממוצע הוא{' '}
          <b>גורם העומס</b> <Tex>{'\\alpha = n/m'}</Tex>, ולכן החיפוש עולה בתוחלת <Tex>{'\\Theta(1+\\alpha)'}</Tex>.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={chainingSpec} />
        </div>
      </Panel>

      <DsDemo
        titleHe="גיבוב בשרשור"
        block={chainingBlock}
        run={runChaining}
        presets={PRESETS}
        varsPlacement="side"
        editable={{ min: 1, max: 10, minValue: 0, maxValue: 99 }}
      />
    </div>
  )
}
