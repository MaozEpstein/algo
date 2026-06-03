import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import BandDiagramTab from './tabs/BandDiagramTab'
import ThermionicTab from './tabs/ThermionicTab'
import VsPnTab from './tabs/VsPnTab'
import SandboxTab from './tabs/SandboxTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'bands' | 'thermionic' | 'vspn' | 'sandbox' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — מתכת ומל"מ', icon: '📘' },
  { id: 'bands', labelHe: 'מחסום שוטקי', icon: '📊' },
  { id: 'thermionic', labelHe: 'פליטה תרמיונית', icon: '🔥' },
  { id: 'vspn', labelHe: 'שוטקי מול PN', icon: '⚡' },
  { id: 'sandbox', labelHe: 'ארגז חול', icon: '🎛️' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  bands: BandDiagramTab,
  thermionic: ThermionicTab,
  vspn: VsPnTab,
  sandbox: SandboxTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 2ג page: seven tabs on the metal–semiconductor (Schottky) rectifying
 *  contact (deep-linked via ?tab=). */
export default function SchottkyDiodeExplainer() {
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
