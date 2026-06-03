import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import BiasConventionDiagram from '../components/BiasConventionDiagram'
import { MATERIALS, junctionState } from '../../../lib/junction'

type Mode = 'equilibrium' | 'forward' | 'reverse'
const MODES: { id: Mode; labelHe: string }[] = [
  { id: 'equilibrium', labelHe: 'שיווי משקל' },
  { id: 'forward', labelHe: 'ממתח קדמי' },
  { id: 'reverse', labelHe: 'ממתח אחורי' },
]

/**
 * Lecture 1ב — Intro: what "applying a voltage" to the junction means, the
 * sign convention (forward = + on p, reverse = + on n), where the voltage drops
 * (across the depletion region), and how the active barrier becomes V_bi − V_A.
 */
export default function IntroTab() {
  const [mode, setMode] = useState<Mode>('forward')
  const eq = useMemo(() => junctionState(1e16, 1e17, MATERIALS.Si, 0), [])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו ממתח על הצומת?">
        <p className="leading-relaxed text-slate-600">
          בחלק א' בנינו את הצומת ב<b>שיווי משקל</b> — בלי מקור חיצוני. עכשיו נחבר <b>מתח חיצוני</b>{' '}
          <Tex>{'V_A'}</Tex> ונראה מה משתנה. תובנת-המפתח: כמעט כל המתח נופל על <b>אזור המחסור</b>, כי הוא
          האזור בעל ההתנגדות הגבוהה — האזורים הניטרליים (הבולק) מתנהגים כמעט כמו מוליך.
        </p>
        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'q V_{\\text{מחסום}} = q\\,(V_{bi} - V_A)'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          המתח החיצוני פשוט <b>מחליף</b> את מפל הפוטנציאל על הצומת מ-<Tex>{'V_{bi}'}</Tex> ל-
          <Tex>{'V_{bi}-V_A'}</Tex>. כל שאר הסיפור (רוחב המחסור, השדה, הקיבול, ההזרקה) נובע מההחלפה הזו.
        </p>
      </Panel>

      <Panel title="מוסכמת הסימון — קדמי מול אחורי">
        <div className="mb-3 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                mode === m.id ? 'bg-slate-800 text-white shadow' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m.labelHe}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <BiasConventionDiagram mode={mode} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <p className="font-bold text-amber-700">ממתח קדמי · <Tex>{'V_A > 0'}</Tex></p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              הקוטב החיובי על צד <b>p</b>. המחסום <b>יורד</b> ל-<Tex>{'q(V_{bi}-V_A)'}</Tex>, ובעקבותיו אזור
              המחסור מצטמצם והשדה נחלש.
            </p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
            <p className="font-bold text-sky-700">ממתח אחורי · <Tex>{'V_A < 0'}</Tex></p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              הקוטב החיובי על צד <b>n</b>. המחסום <b>עולה</b> ל-<Tex>{'q(V_{bi}+|V_A|)'}</Tex>, אזור המחסור
              מתרחב והשדה מתחזק.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="נקודת המוצא — הצומת בשיווי משקל" defaultOpen={false}>
        <p className="leading-relaxed text-slate-600">
          תזכורת מחלק א': מפל <span dir="ltr" className="font-mono">ρ→E→V</span> באזור המחסור ב-
          <Tex>{'V_A=0'}</Tex>. בהמשך הלשוניות נראה איך כל אחת מהעקומות האלה משתנה כשמפעילים מתח.
        </p>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V · שיווי משקל</p>
          <JunctionElectrostatics dn={eq.dn} dp={eq.dp} Emax={eq.Emax} Vbi={eq.Vbi} Na={1e16} Nd={1e17} />
        </div>
      </Panel>
    </div>
  )
}
