import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import SrhModelTab from './tabs/SrhModelTab'
import RecombinationTab from './tabs/RecombinationTab'
import HighInjectionTab from './tabs/HighInjectionTab'
import SeriesResistanceTab from './tabs/SeriesResistanceTab'
import SwitchingTab from './tabs/SwitchingTab'
import FullPictureTab from './tabs/FullPictureTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'srh' | 'recombination' | 'highInjection' | 'seriesR' | 'switching' | 'full' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — מהאידיאלי למציאות', icon: '📘' },
  { id: 'srh', labelHe: 'מודל SRH', icon: '🪤' },
  { id: 'recombination', labelHe: 'זרם רקומבינציה', icon: '♻️' },
  { id: 'highInjection', labelHe: 'הזרקה חזקה', icon: '🌊' },
  { id: 'seriesR', labelHe: 'התנגדות טורית', icon: '🧱' },
  { id: 'switching', labelHe: 'מיתוג ומעברי-זמן', icon: '⚡' },
  { id: 'full', labelHe: 'התמונה המלאה — n', icon: '🎛️' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  srh: SrhModelTab,
  recombination: RecombinationTab,
  highInjection: HighInjectionTab,
  seriesR: SeriesResistanceTab,
  switching: SwitchingTab,
  full: FullPictureTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 2ב page: seven tabs walking through the deviations of a real diode
 *  from the ideal Shockley line (deep-linked via ?tab=). */
export default function NonIdealDiodeExplainer() {
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
