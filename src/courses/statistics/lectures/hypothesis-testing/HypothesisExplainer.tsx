import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import NeymanPearsonTab from './tabs/NeymanPearsonTab'
import DetectorsTab from './tabs/DetectorsTab'
import BayesianTab from './tabs/BayesianTab'
import PracticeTab from './tabs/PracticeTab'

type TabId = 'intro' | 'neyman' | 'detectors' | 'bayesian' | 'practice'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — בין שתי השערות', icon: '📘' },
  { id: 'neyman', labelHe: 'ניימן-פירסון', icon: '⚖️' },
  { id: 'detectors', labelHe: 'גלאים', icon: '📡' },
  { id: 'bayesian', labelHe: 'בדיקה בייסיאנית', icon: '🎲' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  neyman: NeymanPearsonTab,
  detectors: DetectorsTab,
  bayesian: BayesianTab,
  practice: PracticeTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 5 page: five tabs on simple hypothesis testing (deep-linked via ?tab=). */
export default function HypothesisExplainer() {
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
