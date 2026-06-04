import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import ContactBandDiagram from '../components/ContactBandDiagram'
import { MATERIALS, contactBarrier, contactKind, type CarrierType } from '../../../lib/junction'

const Si = MATERIALS.Si
const CHI = Si.chi // 4.05
const EG = Si.eg // 1.12

type Preset = { labelHe: string; type: CarrierType; phiM: number; phiS: number; Va: number; noteHe: string }
// 8 states = 4 fundamental cases × {forward, reverse}. Bias sign convention: forward
// REDUCES the rectifying barrier (V_eff>0), so for n that is V_A>0 and for p V_A<0.
const VF = 0.3
const PRESETS: Preset[] = [
  { labelHe: '① n · מיישר · קדמי', type: 'n', phiM: 5.1, phiS: 4.25, Va: +VF, noteHe: 'מל"מ-n, <b>$\\varphi_m>\\varphi_s$</b> → כיפוף <b>מעלה</b>, מחסום שוטקי $\\varphi_{Bn}=\\varphi_m-\\chi$. <b>ממתח קדמי</b> מקטין את $q(V_{bi}-V_A)$ → המחסום מצד-המל"מ נמוך, זרם גדל. $\\varphi_B$ עצמו קבוע.' },
  { labelHe: '② n · מיישר · אחורי', type: 'n', phiM: 5.1, phiS: 4.25, Va: -VF, noteHe: 'אותו מגע מיישר, <b>ממתח אחורי</b> מגדיל את $q(V_{bi}-V_A)$ → המחסום מצד-המל"מ גבוה, אזור מחסור רחב, זרם רווי. $\\varphi_B$ נשאר קבוע.' },
  { labelHe: '③ n · אוהמי · קדמי', type: 'n', phiM: 3.95, phiS: 4.45, Va: +VF, noteHe: 'מל"מ-n, <b>$\\varphi_m<\\varphi_s$</b> → כיפוף <b>מטה</b>, צבירת אלקטרונים, <b>אין מחסום</b>. הזרם זורם חופשי; הממתח רק מסיט את מפלס-המתכת ב-$qV_A$ (ליניארי).' },
  { labelHe: '④ n · אוהמי · אחורי', type: 'n', phiM: 3.95, phiS: 4.45, Va: -VF, noteHe: 'אותו מגע אוהמי, <b>ממתח אחורי</b>: עדיין אין מחסום וזרם חופשי — מגע אוהמי <b>סימטרי</b>, מסיט את מפלס-המתכת לכיוון ההפוך.' },
  { labelHe: '⑤ p · מיישר · קדמי', type: 'p', phiM: 4.1, phiS: 4.95, Va: -VF, noteHe: 'מל"מ-p, <b>$\\varphi_m<\\varphi_s$</b> → כיפוף <b>מטה</b>, מחסום חורים $\\varphi_{Bp}=\\chi+E_g-\\varphi_m$. <b>ממתח קדמי</b> (קוטביות הפוכה מ-n) מקטין את המחסום, זרם גדל.' },
  { labelHe: '⑥ p · מיישר · אחורי', type: 'p', phiM: 4.1, phiS: 4.95, Va: +VF, noteHe: 'אותו מגע מיישר-p, <b>ממתח אחורי</b> מגדיל את $q(V_{bi}-V_A)$ → המחסום גבוה, זרם רווי.' },
  { labelHe: '⑦ p · אוהמי · קדמי', type: 'p', phiM: 5.4, phiS: 4.95, Va: -VF, noteHe: 'מל"מ-p, <b>$\\varphi_m>\\varphi_s$</b> → כיפוף <b>מעלה</b>, צבירת חורים, <b>אין מחסום</b>. זרם חופשי; הממתח רק מסיט את מפלס-המתכת.' },
  { labelHe: '⑧ p · אוהמי · אחורי', type: 'p', phiM: 5.4, phiS: 4.95, Va: +VF, noteHe: 'אותו מגע אוהמי-p, <b>ממתח אחורי</b>: אין מחסום, זרם חופשי וסימטרי לכיוון ההפוך.' },
]

const fmtV = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)} V`

/**
 * Lecture 2ד capstone — the unifying sandbox. Toggle n/p, drag φ_m and φ_s, and
 * sweep the bias to see ALL FOUR fundamental metal–SC cases plus forward/reverse.
 * Four preset buttons jump to the canonical states; a 2×2 matrix highlights which
 * case is live. Material fixed = Si (χ, E_g).
 */
export default function SandboxTab() {
  const [type, setType] = useState<CarrierType>('n')
  const [phiM, setPhiM] = useState(5.1)
  const [phiS, setPhiS] = useState(4.25)
  const [Va, setVa] = useState(0.3)
  const [activePreset, setActivePreset] = useState<string | null>('① n · מיישר · קדמי')

  const st = useMemo(() => {
    const kind = contactKind(type, phiM, phiS)
    return {
      kind,
      rectifying: kind === 'rectifying',
      phiB: contactBarrier(type, phiM, CHI, EG),
      Vbi: Math.abs(phiM - phiS),
      bendUp: phiM > phiS,
    }
  }, [type, phiM, phiS])

  const applyPreset = (p: Preset) => {
    setType(p.type)
    setPhiM(p.phiM)
    setPhiS(p.phiS)
    setVa(p.Va)
    setActivePreset(p.labelHe)
  }
  const clear = () => setActivePreset(null)
  const note = PRESETS.find((p) => p.labelHe === activePreset)?.noteHe

  // 2×2 matrix cell helper — which case for (row type, column sign)
  const cellKind = (t: CarrierType, gt: boolean) => contactKind(t, gt ? 1 : 0, gt ? 0 : 1) // gt: φ_m>φ_s
  const isActiveCell = (t: CarrierType, gt: boolean) => t === type && gt === st.bendUp

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז חול: שוטקי ואוהמי">
        <p className="leading-relaxed text-slate-600">
          כל מגע מתכת–מל"מ נופל לאחד מ-<b>ארבעה מצבים</b>: טיפוס <b>n/p</b> כפול הסימן <Tex>{'\\varphi_m\\gtrless\\varphi_s'}</Tex>.
          כיוון הכיפוף נקבע מ-<Tex>{'\\mathrm{sign}(\\varphi_m-\\varphi_s)'}</Tex> (לא תלוי בטיפוס), אבל <b>מי מיישר</b> תלוי בטיפוס.
          עם <b>ממתח קדמי/אחורי</b> מקבלים <b>8 מצבים</b>. בחרו מצב, או גררו את <Tex>{'\\varphi_m,\\varphi_s'}</Tex> והממתח.
        </p>

        {/* rule-of-thumb callout — header on its own line, the rules below */}
        <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
          <p className="mb-2 text-sm font-semibold text-violet-700">💡 כללי אצבע</p>
          <ol className="list-decimal space-y-2 ps-6 text-sm leading-relaxed text-slate-600 marker:font-bold marker:text-violet-500">
            <li>
              <b>כיוון הכיפוף</b> נקבע מ-<Tex>{'\\mathrm{sign}(\\varphi_m-\\varphi_s)'}</Tex> בלבד (לא תלוי בטיפוס):
              <span className="mt-1.5 inline-flex flex-wrap items-center gap-2 align-middle">
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200"><Tex>{'\\varphi_m>\\varphi_s'}</Tex></span>
                <span className="text-lg font-bold leading-none text-violet-500" aria-hidden>←</span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200">מעלה ↑</span>
                <span className="text-slate-300" aria-hidden>·</span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200"><Tex>{'\\varphi_m<\\varphi_s'}</Tex></span>
                <span className="text-lg font-bold leading-none text-violet-500" aria-hidden>←</span>
                <span className="rounded-full bg-white px-2.5 py-1 font-medium text-slate-600 ring-1 ring-slate-200">מטה ↓</span>
              </span>
            </li>
            <li>
              <b>מי מיישר תלוי בטיפוס</b>, והקריטריון <b>מתהפך</b>: <b>n</b> מיישר כש-<Tex>{'\\varphi_m>\\varphi_s'}</Tex>,
              ואילו <b>p</b> מיישר כש-<Tex>{'\\varphi_m<\\varphi_s'}</Tex>.
            </li>
            <li>
              <b>שני המחסומים משלימים ל-</b><Tex>{'E_g'}</Tex>: <Tex>{'\\varphi_{Bn}=\\varphi_m-\\chi'}</Tex> ו-<Tex>{'\\varphi_{Bp}=E_g-\\varphi_{Bn}'}</Tex>.
              מתכת עם <Tex>{'\\varphi_m'}</Tex> גבוה ⇐ מחסום-אלקטרונים גבוה אך מחסום-חורים נמוך.
            </li>
            <li>
              <b>גובה המחסום קבוע במתח</b> — רק הכיפוף מצד-המל"מ <Tex>{'q(V_{bi}-V_A)'}</Tex> משתנה: קדמי <b>מקטין</b>,
              אחורי <b>מגדיל</b> (לכן הזרם האחורי רווי).
            </li>
            <li>
              <b>אוהמי = ליניארי וסימטרי</b>: אין מחסום, הזרם זורם חופשי לשני הכיוונים והממתח רק מסיט את מפלס-המתכת ב-<Tex>{'qV_A'}</Tex>.
            </li>
            <li>
              <b>להפוך מיישר לאוהמי</b> בלי להחליף מתכת — מסממים <b>n⁺</b>: המחסום נשאר אך נעשה <b>דק</b> והאלקטרונים <b>מנהרים</b> דרכו.
            </li>
          </ol>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <span aria-hidden>🎛️</span> 8 מצבים בסיסיים (4 × קדמי/אחורי)
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.labelHe}
                onClick={() => applyPreset(p)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  activePreset === p.labelHe ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {p.labelHe}
              </button>
            ))}
          </div>
          {note && (
            <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
              <RichText>{note}</RichText>
            </p>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">טיפוס מל"מ:</span>
                {(['n', 'p'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setType(t); setPhiS(t === 'n' ? 4.25 : 4.95); clear() }}
                    className={`rounded-full border px-4 py-1 text-sm font-bold transition ${
                      type === t ? (t === 'n' ? 'border-sky-500 bg-sky-500 text-white shadow' : 'border-rose-500 bg-rose-500 text-white shadow') : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t === 'n' ? 'n (אלקטרונים)' : 'p (חורים)'}
                  </button>
                ))}
              </div>
              <Slider label={<>פונקציית עבודה מתכת · <Tex>{'\\varphi_m'}</Tex></>} value={phiM} min={3.9} max={5.8} step={0.05} onChange={(v) => { setPhiM(v); clear() }} display={`${phiM.toFixed(2)} eV`} />
              <Slider label={<>פונקציית עבודה מל"מ · <Tex>{'\\varphi_s'}</Tex></>} value={phiS} min={+(CHI + 0.1).toFixed(2)} max={+(CHI + EG - 0.1).toFixed(2)} step={0.02} onChange={(v) => { setPhiS(v); clear() }} display={`${phiS.toFixed(2)} eV`} />
              <Slider label={<>ממתח · <Tex>{'V_A'}</Tex></>} value={Va} min={-0.4} max={0.6} step={0.02} onChange={(v) => { setVa(v); clear() }} display={fmtV(Va)} />
              <p className="text-xs leading-relaxed text-slate-500">
                הממתח משפיע על המחסום רק במצב <b>מיישר</b> (קדמי מקטין, אחורי מגדיל). במצב <b>אוהמי</b> הזרם זורם חופשי.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Readout label="סוג המגע" value={st.rectifying ? 'מיישר' : 'אוהמי'} accent={st.rectifying ? 'border-violet-100 bg-violet-50' : 'border-emerald-100 bg-emerald-50'} />
              <Readout label={st.rectifying ? (type === 'n' ? 'מחסום $\\varphi_{Bn}$' : 'מחסום $\\varphi_{Bp}$') : 'מחסום'} value={st.rectifying ? `${st.phiB.toFixed(2)} eV` : '—'} accent="border-sky-100 bg-sky-50" />
              <Readout label="מתח בנוי $V_{bi}$" value={`${st.Vbi.toFixed(2)} V`} accent="border-amber-100 bg-amber-50" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st.bendUp ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                כיפוף {st.bendUp ? 'מעלה ↑' : 'מטה ↓'} ({st.bendUp ? 'φₘ>φₛ' : 'φₘ<φₛ'})
              </span>
            </div>

            {/* 2×2 case matrix */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-2 text-center text-xs font-semibold text-slate-400">מטריצת 4 המצבים</p>
              <table className="w-full border-collapse text-center text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-slate-400"></th>
                    <th className="px-2 py-1 font-semibold text-slate-500"><Tex>{'\\varphi_m>\\varphi_s'}</Tex></th>
                    <th className="px-2 py-1 font-semibold text-slate-500"><Tex>{'\\varphi_m<\\varphi_s'}</Tex></th>
                  </tr>
                </thead>
                <tbody>
                  {(['n', 'p'] as const).map((t) => (
                    <tr key={t}>
                      <td className="px-2 py-1 font-bold text-slate-600">{t}</td>
                      {[true, false].map((gt) => {
                        const k = cellKind(t, gt)
                        const active = isActiveCell(t, gt)
                        return (
                          <td key={String(gt)} className={`rounded-lg border px-2 py-2 font-semibold transition ${active ? (k === 'rectifying' ? 'border-violet-400 bg-violet-100 text-violet-700 ring-2 ring-violet-300' : 'border-emerald-400 bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300') : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
                            {k === 'rectifying' ? 'מיישר' : 'אוהמי'}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">
              <span className="text-slate-500">דיאגרמת פסים · אנרגיה–מיקום</span> — מתכת (M) משמאל · מל"מ (SC) מימין
            </p>
            <ContactBandDiagram type={type} phiM={phiM} chi={CHI} eg={EG} phiS={phiS} Va={Va} />
          </div>
        </div>
      </Panel>
    </div>
  )
}
