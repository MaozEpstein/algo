import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import SubstitutionTab from './tabs/SubstitutionTab'
import IterationTab from './tabs/IterationTab'
import MasterTab from './tabs/MasterTab'

type TabId = 'intro' | 'substitution' | 'iteration' | 'master'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'נוסחאות נסיגה', icon: '📐' },
  { id: 'substitution', labelHe: 'שיטת ההצבה', icon: '🎯' },
  { id: 'iteration', labelHe: 'שיטת האיטרציה', icon: '🔁' },
  { id: 'master', labelHe: 'שיטת האב', icon: '🧮' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  substitution: SubstitutionTab,
  iteration: IterationTab,
  master: MasterTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/**
 * The whole lecture-3ב page: four focused tabs, each diving into one topic.
 * The active tab is deep-linked via `?tab=…` to match the app's URL ethos.
 */
export default function RecurrencesExplainer() {
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
