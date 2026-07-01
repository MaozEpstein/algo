import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import OperationTab from './tabs/OperationTab'
import DerivationTab from './tabs/DerivationTab'
import CharacteristicsTab from './tabs/CharacteristicsTab'
import TypesTab from './tabs/TypesTab'
import SmallSignalTab from './tabs/SmallSignalTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'operation' | 'derivation' | 'characteristics' | 'types' | 'smallsignal' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא · מבנה', icon: '📘' },
  { id: 'operation', labelHe: 'הפעלה · הערוץ', icon: '🎚️' },
  { id: 'derivation', labelHe: 'גזירת הזרם', icon: '✍️' },
  { id: 'characteristics', labelHe: 'אופיינים', icon: '📈' },
  { id: 'types', labelHe: 'NMOS / PMOS', icon: '🔀' },
  { id: 'smallsignal', labelHe: 'אותות-קטנים', icon: '📐' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  operation: OperationTab,
  derivation: DerivationTab,
  characteristics: CharacteristicsTab,
  types: TypesTab,
  smallsignal: SmallSignalTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 7א page: the ideal MOSFET — structure, operation, I–V, characteristics, small-signal (deep-linked via ?tab=). */
export default function MosfetExplainer() {
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
