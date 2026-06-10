import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import CompareTab from './tabs/CompareTab'
import BandsTab from './tabs/BandsTab'
import RegimesTab from './tabs/RegimesTab'
import SandboxTab from './tabs/SandboxTab'
import TheoryTab from './tabs/TheoryTab'
import OxideChargesTab from './tabs/OxideChargesTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'compare' | 'bands' | 'regimes' | 'sandbox' | 'theory' | 'oxide' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא ומבנה', icon: '📘' },
  { id: 'compare', labelHe: 'קבל-לוחות מול MOS', icon: '⚖️' },
  { id: 'bands', labelHe: 'דיאגרמת-פסים ו-flat-band', icon: '📊' },
  { id: 'regimes', labelHe: 'שלושת המשטרים', icon: '🔀' },
  { id: 'sandbox', labelHe: 'ארגז-חול', icon: '🎛️' },
  { id: 'theory', labelHe: 'תיאוריה', icon: '🧮' },
  { id: 'oxide', labelHe: 'מטעני-תחמוצת', icon: '🧲' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  compare: CompareTab,
  bands: BandsTab,
  regimes: RegimesTab,
  sandbox: SandboxTab,
  theory: TheoryTab,
  oxide: OxideChargesTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 6א page: the MOS capacitor — structure & operating regimes (deep-linked via ?tab=). */
export default function MosCapacitorExplainer() {
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
