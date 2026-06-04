import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from './Panel'

/**
 * The metal–semiconductor "separator" card that opens BOTH the Schottky (2ג) and
 * the ohmic (2ד) lectures: the same φ_m vs φ_s criterion decides whether a contact
 * rectifies or is ohmic. The `framing` text is lecture-specific (which side this
 * lecture lives on). Shown as a colored two-side split (violet rectifying / emerald
 * ohmic) so it reads at a glance. Criterion shown for n-type (χ+ξ); the full 2×2
 * (incl. p-type) is explored in the 2ד sandbox.
 */
export default function RectifyingCriterionCard({ framing }: { framing: ReactNode }) {
  return (
    <Panel title={'מתכת פוגשת מל"מ — מיישר או אוהמי?'}>
      <p className="leading-relaxed text-slate-700">{framing}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 text-center">
          <p className="text-sm font-bold text-violet-700">מיישר (שוטקי)</p>
          <div className="my-1.5"><Tex>{'\\varphi_m>\\varphi_s'}</Tex></div>
          <p className="text-xs text-slate-500">מחסום → דיודה · נושא שיעור 2ג</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-center">
          <p className="text-sm font-bold text-emerald-700">אוהמי (צבירה)</p>
          <div className="my-1.5"><Tex>{'\\varphi_m<\\varphi_s'}</Tex></div>
          <p className="text-xs text-slate-500">אין מחסום → ליניארי · נושא שיעור 2ד</p>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500">
        <Tex>{'\\varphi_s=\\chi+\\xi'}</Tex> — פונקציית העבודה של המל"מ (טיפוס-n). הטיפוס מסוג p הופך את הקריטריון —
        ראו את <b>ארבעת המצבים</b> בארגז-החול של 2ד.
      </p>
    </Panel>
  )
}
