import { useSearchParams } from 'react-router-dom'
import IntroTab from './tabs/IntroTab'
import PseudocodeTab from './tabs/PseudocodeTab'
import ComplexityTab from './tabs/ComplexityTab'
import InsertionSortTab from './tabs/InsertionSortTab'

type TabId = 'intro' | 'pseudocode' | 'complexity' | 'insertion'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא', icon: '📘' },
  { id: 'pseudocode', labelHe: 'פסאודו-קוד', icon: '📝' },
  { id: 'complexity', labelHe: 'סיבוכיות וסימון אסימפטוטי', icon: '📈' },
  { id: 'insertion', labelHe: 'מיון הכנסה', icon: '🎬' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  pseudocode: PseudocodeTab,
  complexity: ComplexityTab,
  insertion: InsertionSortTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lecture 1 page: four focused tabs (deep-linked via ?tab=). */
export default function FoundationsExplainer() {
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
