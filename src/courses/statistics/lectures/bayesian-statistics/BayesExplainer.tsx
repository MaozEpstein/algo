import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import MmseTab from './tabs/MmseTab'
import CostsTab from './tabs/CostsTab'
import ExamplesTab from './tabs/ExamplesTab'
import PracticeTab from './tabs/PracticeTab'

type TabId = 'intro' | 'mmse' | 'costs' | 'examples' | 'practice'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — prior ו-posterior', icon: '📘' },
  { id: 'mmse', labelHe: 'MMSE — תוחלת מותנית', icon: '🎯' },
  { id: 'costs', labelHe: 'פונקציות עלות', icon: '⚖️' },
  { id: 'examples', labelHe: 'דוגמאות', icon: '📡' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  mmse: MmseTab,
  costs: CostsTab,
  examples: ExamplesTab,
  practice: PracticeTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 8 page: five tabs on Bayesian estimation (deep-linked via ?tab=). */
export default function BayesExplainer() {
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
