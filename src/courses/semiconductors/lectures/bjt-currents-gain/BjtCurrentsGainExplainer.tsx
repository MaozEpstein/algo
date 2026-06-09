import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import ComponentsTab from './tabs/ComponentsTab'
import FactorsTab from './tabs/FactorsTab'
import GainTab from './tabs/GainTab'
import ConfigsTab from './tabs/ConfigsTab'
import OutputTab from './tabs/OutputTab'
import EbersMollTab from './tabs/EbersMollTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'components' | 'factors' | 'gain' | 'configs' | 'output' | 'ebers' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מהאיכותי לכמותי', icon: '📘' },
  { id: 'components', labelHe: 'רכיבי-הזרם', icon: '🧩' },
  { id: 'factors', labelHe: 'γ ו-b', icon: '🎚️' },
  { id: 'gain', labelHe: 'הגבר α ו-β', icon: '🔊' },
  { id: 'configs', labelHe: 'תצורות CB / CE', icon: '🔀' },
  { id: 'output', labelHe: 'אופייני זרם-מתח', icon: '📈' },
  { id: 'ebers', labelHe: 'מודל Ebers-Moll', icon: '🔁' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  components: ComponentsTab,
  factors: FactorsTab,
  gain: GainTab,
  configs: ConfigsTab,
  output: OutputTab,
  ebers: EbersMollTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 3ב page: eight tabs quantifying the BJT's currents and gain (deep-linked
 *  via ?tab=). */
export default function BjtCurrentsGainExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'intro'
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
