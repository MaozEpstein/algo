import { useSearchParams } from 'react-router-dom'
import FormationTab from './tabs/FormationTab'
import BandDiagramTab from './tabs/BandDiagramTab'
import ElectrostaticsTab from './tabs/ElectrostaticsTab'
import SandboxTab from './tabs/SandboxTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'formation' | 'bands' | 'electrostatics' | 'sandbox' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'formation', labelHe: 'היווצרות הצומת', icon: '🔗' },
  { id: 'bands', labelHe: 'דיאגרמת הפסים', icon: '📊' },
  { id: 'electrostatics', labelHe: 'אלקטרוסטטיקה ρ→E→V', icon: '⚡' },
  { id: 'sandbox', labelHe: 'ארגז חול', icon: '🎛️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  formation: FormationTab,
  bands: BandDiagramTab,
  electrostatics: ElectrostaticsTab,
  sandbox: SandboxTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 1א page: five tabs (deep-linked via ?tab=). */
export default function PnJunctionEqExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'formation'
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
