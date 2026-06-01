import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import { MATERIALS, junctionState } from '../../../lib/junction'

// an asymmetric example so the one-sided depletion (d_p > d_n) is visible
const Na = 5e15
const Nd = 5e16

const REVEALS: { titleHe: string; bodyHe: string }[] = [
  {
    titleHe: 'ρ — קירוב המחסור',
    bodyHe: 'מניחים שאזור המחסור "ריק" מנושאים חופשיים, ולכן המטען בו הוא רק היונים הקבועים: $-qN_A$ בצד p, $+qN_D$ בצד n. מחוץ לאזור — ניטרלי ($\\rho=0$).',
  },
  {
    titleHe: 'E — אינטגרל ראשון (גאוס)',
    bodyHe: 'אינטגרל של $\\rho$ נותן את השדה (משוואת פואסון $dE/dx = \\rho/\\varepsilon_s$). השדה משולש, עם שיא $E_{max}$ בדיוק בצומת, ומתאפס בקצות אזור המחסור.',
  },
  {
    titleHe: 'V — אינטגרל שני',
    bodyHe: 'אינטגרל נוסף ($V=-\\int E\\,dx$) נותן את הפוטנציאל: עקומה פרבולית שעולה מ-0 בצד p ל-$V_{bi}$ בצד n. השטח מתחת למשולש השדה שווה ל-$V_{bi}$.',
  },
]

export default function ElectrostaticsTab() {
  const [reveal, setReveal] = useState(1)
  const state = useMemo(() => junctionState(Na, Nd, MATERIALS.Si), [])
  const r = REVEALS[reveal - 1]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="אזור המחסור והשדה הבנוי — המושגים">
        <ul className="space-y-2 leading-relaxed text-slate-600">
          <li>
            <b>אזור המחסור</b> (Space-Charge Region) — הרצועה סביב הצומת שרוקנה מנושאים חופשיים. נשארו בה
            רק היונים הקבועים, ולכן יש בה מטען מרחבי <Tex>{'\\rho'}</Tex>.
          </li>
          <li>
            <b>קירוב המחסור</b> — מניחים שבתוך הרצועה אין נושאים כלל, ולכן{' '}
            <Tex>{'\\rho = +qN_D'}</Tex> בצד n ו-<Tex>{'\\rho = -qN_A'}</Tex> בצד p; מחוץ לרצועה ניטרלי
            (<Tex>{'\\rho = 0'}</Tex>). זה ההנחה שהופכת את החישוב לפשוט.
          </li>
          <li>
            <b>השדה הבנוי</b> <Tex>{'E'}</Tex> — נוצר מהמטען החשוף, מכוון מ-n ל-p (כלומר מתנגד לדיפוזיה),
            מקסימלי בצומת (<Tex>{'E_{max}'}</Tex>) ומתאפס בקצוות.
          </li>
          <li>
            <b>רוחב אזור המחסור</b> <Tex>{'d'}</Tex> — גדל עם המתח הבנוי <Tex>{'V_{bi}'}</Tex> וקטן ככל
            שהסימום כבד יותר.
          </li>
        </ul>
      </Panel>

      <Panel title="אלקטרוסטטיקה: ρ → E → V">
        <p className="leading-relaxed text-slate-600">
          כל האלקטרוסטטיקה של הצומת היא <b>אינטגרל כפול</b>: מצפיפות המטען <Tex>{'\\rho'}</Tex> מקבלים את
          השדה <Tex>{'E'}</Tex>, וממנו את הפוטנציאל <Tex>{'V'}</Tex>. עברו את שלושת השלבים:
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <JunctionElectrostatics
            dn={state.dn}
            dp={state.dp}
            Emax={state.Emax}
            Vbi={state.Vbi}
            Na={Na}
            Nd={Nd}
            reveal={reveal}
          />
        </div>

        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <p className="font-bold text-slate-800">{r.titleHe}</p>
          <p className="mt-1 leading-relaxed text-slate-600">
            <RichText>{r.bodyHe}</RichText>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={() => setReveal(1)} disabled={reveal === 1} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-30">
            → הקודם
          </button>
          <span className="font-mono text-xs tabular-nums text-slate-400">{reveal}/3</span>
          <button onClick={() => setReveal((k) => Math.min(3, k + 1))} disabled={reveal === 3} className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-amber-600 disabled:opacity-30">
            הבא ←
          </button>
        </div>
      </Panel>

      <Panel title="נייטרליות מטען והנוסחאות">
        <p className="leading-relaxed text-slate-600">
          המטען החיובי הכולל בצד n שווה למטען השלילי בצד p (ההתקן ניטרלי), ולכן:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'N_A\\,d_p = N_D\\,d_n'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          מכאן רוחב אזור המחסור והשדה המרבי (ב-<Tex>{'V_A=0'}</Tex>):
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <Tex block>{'d = \\sqrt{\\frac{2\\varepsilon_s}{q}\\,V_{bi}\\,\\frac{N_A+N_D}{N_A N_D}}'}</Tex>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <Tex block>{'E_{max} = \\frac{2V_{bi}}{d}'}</Tex>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          תובנה: בצומת <b>חד-צדדי</b> (צד אחד מסומם הרבה יותר) כמעט כל אזור המחסור נמצא ב<b>צד המסומם
          פחות</b> — בדיוק כפי שרואים פה (<Tex>{'d_p > d_n'}</Tex>).
        </p>
      </Panel>
    </div>
  )
}
