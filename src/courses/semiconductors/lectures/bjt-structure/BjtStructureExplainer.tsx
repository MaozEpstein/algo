import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import ModesTab from './tabs/ModesTab'
import BandsTab from './tabs/BandsTab'
import MinorityTab from './tabs/MinorityTab'
import AmplifyTab from './tabs/AmplifyTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'modes' | 'bands' | 'minority' | 'amplify' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא ומבנה', icon: '📘' },
  { id: 'modes', labelHe: 'ממתח ומצבי-פעולה', icon: '🔀' },
  { id: 'bands', labelHe: 'דיאגרמת-פסים', icon: '📊' },
  { id: 'minority', labelHe: 'פרופיל המיעוט', icon: '〽️' },
  { id: 'amplify', labelHe: 'למה זה מגביר', icon: '🔊' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  modes: ModesTab,
  bands: BandsTab,
  minority: MinorityTab,
  amplify: AmplifyTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 3א page: eight tabs introducing the BJT's structure and operation —
 *  qualitatively (deep-linked via ?tab=). */
export default function BjtStructureExplainer() {
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
