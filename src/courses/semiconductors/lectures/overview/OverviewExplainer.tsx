import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import MapTab from './tabs/MapTab'
import EffectsTab from './tabs/EffectsTab'
import OneLawTab from './tabs/OneLawTab'
import CompareTab from './tabs/CompareTab'
import AtlasTab from './tabs/AtlasTab'
import QuizTab from './tabs/QuizTab'

type TabId = 'map' | 'effects' | 'onelaw' | 'compare' | 'atlas' | 'quiz'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'map', labelHe: 'מפת הקורס', icon: '🗺️' },
  { id: 'effects', labelHe: 'אפקטים חוצי-קורס', icon: '⚡' },
  { id: 'onelaw', labelHe: 'חוק אחד, הרבה התקנים', icon: '🔗' },
  { id: 'compare', labelHe: 'השוואת טרנזיסטורים', icon: '📊' },
  { id: 'atlas', labelHe: 'אטלס דיאגרמות-פסים', icon: '📚' },
  { id: 'quiz', labelHe: 'אתגר סינתזה', icon: '🎯' },
]

const PANELS: Record<TabId, React.FC> = {
  map: MapTab,
  effects: EffectsTab,
  onelaw: OneLawTab,
  compare: CompareTab,
  atlas: AtlasTab,
  quiz: QuizTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 0 page: cross-cutting synthesis of the semiconductors course (deep-linked via ?tab=). */
export default function OverviewExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'map'
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
