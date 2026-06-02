import Tex from '@/core/components/Tex'
import ComplexityProofButton from '@/core/components/ComplexityProofButton'
import Panel from '../components/Panel'
import DsDemo, { type DsPreset } from '../components/DsDemo'
import { directAddressBlock } from '../pseudocode'
import { runDirectAddress } from '../algorithms/directAddress'
import { directAddressSpec } from '../specs'

const PRESETS: DsPreset[] = [
  { labelHe: 'מפתחות קטנים', array: [2, 5, 8, 3], extra: { U: 10 } },
  { labelHe: 'עם חיפוש', array: [2, 5, 8, 3], extra: { U: 10, search: 5 } },
  { labelHe: 'טבלה גדולה יותר', array: [1, 4, 7, 9, 2], extra: { U: 12 } },
]

export default function DirectAddressTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון: תא לכל מפתח">
        <p className="leading-relaxed text-slate-600">
          כשטווח המפתחות קטן (<Tex>{'0..U-1'}</Tex>) והמפתחות שונים זה מזה, אפשר פשוט להחזיק מערך{' '}
          <Tex>{'T[0..U-1]'}</Tex> ולשמור את המפתח <Tex>k</Tex> בתא <Tex>{'T[k]'}</Tex>. אין חישוב ואין השוואות —
          הכנסה, חיפוש ומחיקה ב-<Tex>O(1)</Tex>.
        </p>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <ComplexityProofButton algo={directAddressSpec} />
        </div>
      </Panel>

      <DsDemo titleHe="מיעון ישיר" block={directAddressBlock} run={runDirectAddress} presets={PRESETS} varsPlacement="side" />

      <Panel title="הבעיה: טווח מפתחות ענק">
        <p className="leading-relaxed text-slate-600">
          המחיר הוא <b>זיכרון</b>: הטבלה חייבת תא לכל מפתח אפשרי, כלומר <Tex>{'\\Theta(|U|)'}</Tex>. למפתחות בני 32 ביט
          זה <Tex>{'2^{32} \\approx 4.3 \\times 10^{9}'}</Tex> תאים — בלתי-אפשרי, ובזבזני גם אם רק מעטים מהם בשימוש.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          הפתרון: <b>פונקציית גיבוב</b> שממפה את המפתחות לטווח קטן <Tex>{'0..m-1'}</Tex> — וזה הנושא של הלשוניות הבאות.
        </p>
      </Panel>
    </div>
  )
}
