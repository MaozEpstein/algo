import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import StructureTab from './tabs/StructureTab'
import OperationTab from './tabs/OperationTab'
import OutputTab from './tabs/OutputTab'
import TransferTab from './tabs/TransferTab'
import MesfetTab from './tabs/MesfetTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'structure' | 'operation' | 'output' | 'transfer' | 'mesfet' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא · אפקט-השדה', icon: '🌐' },
  { id: 'structure', labelHe: 'מבנה וסימול', icon: '📘' },
  { id: 'operation', labelHe: 'שליטת השער וצביטה', icon: '🎚️' },
  { id: 'output', labelHe: 'אופייני-מוצא', icon: '📈' },
  { id: 'transfer', labelHe: 'אופיין-העברה ואות-קטן', icon: '📐' },
  { id: 'mesfet', labelHe: 'MESFET', icon: '⚡' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  structure: StructureTab,
  operation: OperationTab,
  output: OutputTab,
  transfer: TransferTab,
  mesfet: MesfetTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 5 page: the JFET — structure, operation, characteristics & small-signal (deep-linked via ?tab=). */
export default function JfetExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'intro'
  if (usePrintMode()) return <ExplainerPrint tabs={TABS} panels={PANELS} />
  const Panel = PANELS[active]

  return (
    <div className="flex flex-col gap-5">
      <nav className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
        {TABS.map((t) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              onClick={() => setParams({ tab: t.id }, { replace: true })}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span aria-hidden>{t.icon}</span>
              {t.labelHe}
            </button>
          )
        })}
      </nav>
      <Panel />
    </div>
  )
}
