import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import ForwardTab from './tabs/ForwardTab'
import ReverseTab from './tabs/ReverseTab'
import WidthCapTab from './tabs/WidthCapTab'
import InjectionTab from './tabs/InjectionTab'
import SandboxTab from './tabs/SandboxTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'forward' | 'reverse' | 'width-cap' | 'injection' | 'sandbox' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — ממתח על הצומת', icon: '📘' },
  { id: 'forward', labelHe: 'ממתח קדמי', icon: '⬇️' },
  { id: 'reverse', labelHe: 'ממתח אחורי ופריצות', icon: '⬆️' },
  { id: 'width-cap', labelHe: 'מחסור וקיבול', icon: '📐' },
  { id: 'injection', labelHe: 'הזרקת מיעוט', icon: '🌉' },
  { id: 'sandbox', labelHe: 'ארגז חול', icon: '🎛️' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  forward: ForwardTab,
  reverse: ReverseTab,
  'width-cap': WidthCapTab,
  injection: InjectionTab,
  sandbox: SandboxTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 1ב page: eight tabs separating the stages of the biased junction
 *  (deep-linked via ?tab=). */
export default function PnJunctionBiasExplainer() {
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
