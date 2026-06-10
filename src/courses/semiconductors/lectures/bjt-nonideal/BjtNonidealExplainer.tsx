import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import EarlyTab from './tabs/EarlyTab'
import BreakdownTab from './tabs/BreakdownTab'
import BetaTab from './tabs/BetaTab'
import HybridPiTab from './tabs/HybridPiTab'
import FtTab from './tabs/FtTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'early' | 'breakdown' | 'beta' | 'hybridpi' | 'ft' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מהאידיאלי לאמיתי', icon: '📘' },
  { id: 'early', labelHe: 'אפקט Early', icon: '📈' },
  { id: 'breakdown', labelHe: 'פריצה', icon: '⚡' },
  { id: 'beta', labelHe: 'β ו-Gummel', icon: '〽️' },
  { id: 'hybridpi', labelHe: 'מודל אות-קטן', icon: '🔌' },
  { id: 'ft', labelHe: 'תדר-חיתוך fₜ', icon: '🚀' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  early: EarlyTab,
  breakdown: BreakdownTab,
  beta: BetaTab,
  hybridpi: HybridPiTab,
  ft: FtTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 3ג page: eight tabs on the BJT's non-ideal effects and small-signal models
 *  (deep-linked via ?tab=). */
export default function BjtNonidealExplainer() {
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
