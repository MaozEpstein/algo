import { useSearchParams } from 'react-router-dom'
import { usePrintMode } from '@/core/platform/printMode'
import ExplainerPrint from '@/core/platform/ExplainerPrint'
import IntroTab from './tabs/IntroTab'
import ClmTab from './tabs/ClmTab'
import BodyTab from './tabs/BodyTab'
import SubthresholdTab from './tabs/SubthresholdTab'
import MobilityTab from './tabs/MobilityTab'
import VelocityTab from './tabs/VelocityTab'
import CmosTab from './tabs/CmosTab'
import SummaryTab from './tabs/SummaryTab'

type TabId = 'intro' | 'clm' | 'body' | 'subthreshold' | 'mobility' | 'velocity' | 'cmos' | 'summary'

const TABS: { id: TabId; labelHe: string; icon: string }[] = [
  { id: 'intro', labelHe: 'מבוא', icon: '📘' },
  { id: 'clm', labelHe: 'התקצרות תעלה', icon: '📏' },
  { id: 'body', labelHe: 'אפקט המצע', icon: '🔋' },
  { id: 'subthreshold', labelHe: 'תת-סף', icon: '📉' },
  { id: 'mobility', labelHe: 'הדרדרות ניידות', icon: '🐌' },
  { id: 'velocity', labelHe: 'רוויית מהירות', icon: '🏎️' },
  { id: 'cmos', labelHe: 'CMOS', icon: '🧩' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

const PANELS: Record<TabId, React.FC> = {
  intro: IntroTab,
  clm: ClmTab,
  body: BodyTab,
  subthreshold: SubthresholdTab,
  mobility: MobilityTab,
  velocity: VelocityTab,
  cmos: CmosTab,
  summary: SummaryTab,
}

const isTab = (v: string | null): v is TabId => TABS.some((t) => t.id === v)

/** Lesson 7ב page: the modern MOSFET — non-ideal effects + CMOS (deep-linked via ?tab=). */
export default function MosfetNonidealExplainer() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const active: TabId = isTab(raw) ? raw : 'intro'
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
