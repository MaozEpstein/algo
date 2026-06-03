import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import BalanceTab from './tabs/BalanceTab'
import ProfileTab from './tabs/ProfileTab'
import DerivationTab from './tabs/DerivationTab'
import SandboxTab from './tabs/SandboxTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'balance' | 'profile' | 'derivation' | 'sandbox' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא — מהזרקה לזרם', icon: '📘' },
  { id: 'balance', labelHe: 'מאיזון לזרם', icon: '⚖️' },
  { id: 'profile', labelHe: 'פרופיל המיעוט', icon: '📉' },
  { id: 'derivation', labelHe: 'אופיין הדיודה', icon: '📈' },
  { id: 'sandbox', labelHe: 'ארגז חול', icon: '🎛️' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  balance: BalanceTab,
  profile: ProfileTab,
  derivation: DerivationTab,
  sandbox: SandboxTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 2א page: eight tabs separating the stages of deriving the ideal-diode
 *  (Shockley) characteristic (deep-linked via ?tab=). */
export default function IdealDiodeExplainer() {
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
