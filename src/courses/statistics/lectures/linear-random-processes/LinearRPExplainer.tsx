import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import AsymptoticTab from './tabs/AsymptoticTab'
import WienerTab from './tabs/WienerTab'
import KalmanTab from './tabs/KalmanTab'
import PracticeTab from './tabs/PracticeTab'

type TabId = 'intro' | 'asymptotic' | 'wiener' | 'kalman' | 'practice'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — תהליך AR', icon: '📘' },
  { id: 'asymptotic', labelHe: 'סטציונריות אסימפטוטית', icon: '📉' },
  { id: 'wiener', labelHe: 'מסנן וינר', icon: '🎚️' },
  { id: 'kalman', labelHe: 'מסנן קלמן', icon: '🛰️' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  asymptotic: AsymptoticTab,
  wiener: WienerTab,
  kalman: KalmanTab,
  practice: PracticeTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 12 page: five tabs on linear random processes and optimal filtering (deep-linked via ?tab=). */
export default function LinearRPExplainer() {
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
