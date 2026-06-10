import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import LowerBoundTab from './tabs/LowerBoundTab'
import CountingTab from './tabs/CountingTab'
import RadixTab from './tabs/RadixTab'
import BucketTab from './tabs/BucketTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'lowerbound' | 'counting' | 'radix' | 'bucket' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'lowerbound', labelHe: 'חסם תחתון', icon: '🌳' },
  { id: 'counting', labelHe: 'מיון מנייה — Counting Sort', icon: '🔢' },
  { id: 'radix', labelHe: 'מיון בסיס — Radix Sort', icon: '🔟' },
  { id: 'bucket', labelHe: 'מיון דלי — Bucket Sort', icon: '🪣' },
  { id: 'summary', labelHe: 'סיכום והשוואה', icon: '📊' },
]

const PANELS: Record<TabId, React.FC> = {
  lowerbound: LowerBoundTab,
  counting: CountingTab,
  radix: RadixTab,
  bucket: BucketTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 8 page: five tabs (deep-linked via ?tab=). */
export default function LinearSortExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'lowerbound'
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
