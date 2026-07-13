import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import MapTab from './tabs/MapTab'
import DistributionsTab from './tabs/DistributionsTab'
import CLTTab from './tabs/CLTTab'
import ToolkitTab from './tabs/ToolkitTab'
import NotationTab from './tabs/NotationTab'

type TabId = 'map' | 'distributions' | 'clt' | 'toolkit' | 'notation'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'map', labelHe: 'מפת הקורס', icon: '🗺️' },
  { id: 'distributions', labelHe: 'התפלגויות נפוצות', icon: '📊' },
  { id: 'clt', labelHe: 'משפט הגבול המרכזי', icon: '🔔' },
  { id: 'toolkit', labelHe: 'איזה כלי מתי', icon: '🧭' },
  { id: 'notation', labelHe: 'סימונים', icon: '🔤' },
]

const PANELS: Record<TabId, React.FC> = {
  map: MapTab,
  distributions: DistributionsTab,
  clt: CLTTab,
  toolkit: ToolkitTab,
  notation: NotationTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Statistics overview ("מבט-על"): a growing reference hub. Starts with the
 *  common-distributions toolbox; more tabs (course map, …) can slot in later. */
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
