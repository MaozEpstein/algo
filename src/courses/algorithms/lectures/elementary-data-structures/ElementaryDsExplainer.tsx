import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import StacksQueuesTab from './tabs/StacksQueuesTab'
import DirectAddressTab from './tabs/DirectAddressTab'
import HashFunctionsTab from './tabs/HashFunctionsTab'
import ChainingTab from './tabs/ChainingTab'
import OpenAddressingTab from './tabs/OpenAddressingTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'ds' | 'direct' | 'hashfn' | 'chaining' | 'open' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'ds', labelHe: 'מחסנית ותור — Stack & Queue', icon: '🧱' },
  { id: 'direct', labelHe: 'מיעון ישיר — Direct Addressing', icon: '🎯' },
  { id: 'hashfn', labelHe: 'פונקציות גיבוב — Hash Functions', icon: '#️⃣' },
  { id: 'chaining', labelHe: 'שרשור — Chaining', icon: '🔗' },
  { id: 'open', labelHe: 'מיעון פתוח — Open Addressing', icon: '📥' },
  { id: 'summary', labelHe: 'סיכום והשוואה — Summary', icon: '📊' },
]

const PANELS: Record<TabId, React.FC> = {
  ds: StacksQueuesTab,
  direct: DirectAddressTab,
  hashfn: HashFunctionsTab,
  chaining: ChainingTab,
  open: OpenAddressingTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 9 page: six tabs (deep-linked via ?tab=). */
export default function ElementaryDsExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'ds'
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
