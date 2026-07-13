import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import LmmseTab from './tabs/LmmseTab'
import GaussianTab from './tabs/GaussianTab'
import BeyondTab from './tabs/BeyondTab'
import PracticeTab from './tabs/PracticeTab'

type TabId = 'intro' | 'lmmse' | 'gaussian' | 'beyond' | 'practice'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — למה לינארי', icon: '📘' },
  { id: 'lmmse', labelHe: 'LMMSE ואורתוגונליות', icon: '📐' },
  { id: 'gaussian', labelHe: 'המקרה הגאוסי', icon: '🔔' },
  { id: 'beyond', labelHe: 'מעבר ללינארי', icon: '🌀' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  lmmse: LmmseTab,
  gaussian: GaussianTab,
  beyond: BeyondTab,
  practice: PracticeTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 9 page: five tabs on linear Bayesian (LMMSE) estimation (deep-linked via ?tab=). */
export default function LinBayesExplainer() {
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
