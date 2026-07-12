import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import BiasVarianceTab from './tabs/BiasVarianceTab'
import MleTab from './tabs/MleTab'
import AsymptoticsTab from './tabs/AsymptoticsTab'
import PracticeTab from './tabs/PracticeTab'

type TabId = 'intro' | 'biasvar' | 'mle' | 'asymptotics' | 'practice'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — לאמוד פרמטר', icon: '📘' },
  { id: 'biasvar', labelHe: 'הטיה, שונות ו-MSE', icon: '🎯' },
  { id: 'mle', labelHe: 'נראות מרבית', icon: '📈' },
  { id: 'asymptotics', labelHe: 'תכונות אסימפטוטיות', icon: '♾️' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  biasvar: BiasVarianceTab,
  mle: MleTab,
  asymptotics: AsymptoticsTab,
  practice: PracticeTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 6 page: five tabs on maximum likelihood (deep-linked via ?tab=). */
export default function MleExplainer() {
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
