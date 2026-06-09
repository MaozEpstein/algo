import { useSearchParams } from 'react-router-dom'
import StructureTab from './tabs/StructureTab'
import TwoTransistorTab from './tabs/TwoTransistorTab'
import LatchTab from './tabs/LatchTab'
import CharacteristicTab from './tabs/CharacteristicTab'
import SwitchingTab from './tabs/SwitchingTab'
import PracticeTab from './tabs/PracticeTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'structure' | 'twotransistor' | 'latch' | 'characteristic' | 'switching' | 'practice' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'structure', labelHe: 'מבנה וסימול', icon: '📘' },
  { id: 'twotransistor', labelHe: 'מודל שני הטרנזיסטורים', icon: '🔀' },
  { id: 'latch', labelHe: 'תנאי ההצתה', icon: '🔒' },
  { id: 'characteristic', labelHe: 'אופיין I-V', icon: '📈' },
  { id: 'switching', labelHe: 'מיתוג ומצבי-פעולה', icon: '🔌' },
  { id: 'practice', labelHe: 'תרגול', icon: '✏️' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  structure: StructureTab,
  twotransistor: TwoTransistorTab,
  latch: LatchTab,
  characteristic: CharacteristicTab,
  switching: SwitchingTab,
  practice: PracticeTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 4 page: the SCR / thyristor (deep-linked via ?tab=). */
export default function ScrExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'structure'
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
