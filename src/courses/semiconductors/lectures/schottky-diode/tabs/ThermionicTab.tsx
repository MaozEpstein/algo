import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import SchottkyIVCurve from '../components/SchottkyIVCurve'
import MetalSemiconductorBandDiagram from '../components/MetalSemiconductorBandDiagram'
import { MATERIALS, METALS, fmtCurrentDensity, fmtVolt, schottkyState } from '../../../lib/junction'

const Si = MATERIALS.Si
const W = METALS.W
const ND = 1e17

/**
 * Lecture 2ג — thermionic emission. Majority electrons with enough energy cross
 * the barrier, giving J = A*T²e^{−φ_B/V_T}(e^{V_A/V_T}−1). The reverse branch
 * saturates because the metal-side barrier φ_B is bias-independent; image-force
 * lowering is named as the (small) reason real reverse current isn't perfectly flat.
 */
export default function ThermionicTab() {
  const [Va, setVa] = useState(0.2)
  const [mode, setMode] = useState<'linear' | 'log'>('log')
  const st = useMemo(() => schottkyState(W, Si, ND, Va), [Va])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="הזרם — פליטה תרמיונית">
        <p className="leading-relaxed text-slate-600">
          בניגוד לדיודת PN (דיפוזיה של מיעוט), בשוטקי הזרם הוא <b>פליטה תרמיונית</b>: אלקטרוני ה<b>רוב</b> בעלי
          אנרגיה תרמית מספקת <b>חוצים את המחסום</b>. הקצב פרופורציוני ל-<Tex>{'e^{-\\varphi_B/V_T}'}</Tex>, ותנאי
          השפה תחת מתח מוסיף את הגורם המעריכי המוכר:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J=\\underbrace{A^{*}T^2e^{-\\varphi_B/V_T}}_{J_{ST}}\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>אלקטרוני <b>רוב</b> מעל המחסום</>, body: <>קצב <Tex>{'\\propto e^{-\\varphi_B/V_T}'}</Tex>.</> },
            { title: <>מתח קדמי <b>מנמיך</b> את הגבעה</>, body: <>הזרם <Tex>{'\\propto e^{V_A/V_T}'}</Tex>.</> },
            { title: <>אחורי: המחסום מצד-המתכת <b>קבוע</b></>, body: <>הזרם רווי ב-<Tex>{'-J_{ST}'}</Tex>.</> },
          ]}
          outcome={{ label: 'אופיין מיישר — נישא בנושאי רוב', sub: <>אותה צורת שוקלי, <Tex>{'J_{ST}'}</Tex> גדול</> }}
        />
      </Panel>

      <Panel title="הזיזו את הממתח">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider label={<>ממתח · <Tex>{'V_A'}</Tex></>} value={Va} min={-0.4} max={0.6} step={0.01} onChange={setVa} display={fmtVolt(Va)} />
              <div className="mt-3 flex gap-2">
                {(['linear', 'log'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      mode === m ? 'bg-violet-600 text-white shadow' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m === 'linear' ? 'לינארי' : 'לוגריתמי'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="זרם רוויה $J_{ST}$" value={fmtCurrentDensity(st.Jst)} accent="border-rose-100 bg-rose-50" />
              <Readout label="$J$ בנקודת העבודה" value={fmtCurrentDensity(st.J)} accent="border-violet-100 bg-violet-50" />
              <Readout label="מחסום $\varphi_B$" value={`${st.phiB.toFixed(2)} eV`} accent="border-sky-100 bg-sky-50" />
              <Readout label="מתח-הצתה" value={fmtVolt(st.Vturn)} accent="border-amber-100 bg-amber-50" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">
              <span className="text-slate-500">אופיין I–V · זרם–מתח</span> (W/Si) — רווי באחורי
            </p>
            <SchottkyIVCurve metal={W} mat={Si} Va={Va} mode={mode} showTurnOn />
          </div>
        </div>
      </Panel>

      <Panel title="שני הזרמים הנגדיים — מהיכן האקספוננט?">
        <p className="leading-relaxed text-slate-600">
          הזרם התרמיוני הוא למעשה <b>הפרש של שני שטפי-אלקטרונים</b> נגדיים החוצים את אותו מחסום. בשיווי-משקל
          (<Tex>{'V_A=0'}</Tex>) הם <b>שווים ומבטלים זה את זה</b> — אין זרם נטו:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4">
            <p className="flex items-center gap-2 font-bold text-blue-700">
              <span aria-hidden>→</span> <Tex>{'J_{M\\to S}'}</Tex> · <span className="text-sm font-semibold">קבוע</span>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              אלקטרונים מ<b>המתכת</b> מעל המחסום <Tex>{'\\varphi_B'}</Tex>. כיוון ש-<Tex>{'\\varphi_B'}</Tex> מצד-המתכת
              <b> בלתי-תלוי במתח</b>, השטף <b>קבוע</b>: <Tex>{'\\propto e^{-\\varphi_B/V_T}=J_{ST}'}</Tex>.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
            <p className="flex items-center gap-2 font-bold text-cyan-700">
              <span aria-hidden>←</span> <Tex>{'J_{S\\to M}'}</Tex> · <span className="text-sm font-semibold">תלוי-מתח</span>
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              אלקטרונים מ<b>המל"מ</b> מעל המחסום מצד-המל"מ <Tex>{'q(V_{bi}-V_A)'}</Tex>. מתח קדמי <b>מנמיך</b> אותו,
              ולכן השטף <b>גדל</b>: <Tex>{'\\propto e^{-(V_{bi}-V_A)/V_T}=J_{ST}\\,e^{V_A/V_T}'}</Tex>.
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J=J_{S\\to M}-J_{M\\to S}=J_{ST}\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">דיאגרמת פסים · אנרגיה–מיקום</span> — שני השטפים (הזיזו את הממתח למעלה)
          </p>
          <MetalSemiconductorBandDiagram metal={W} mat={Si} Nd={ND} Va={Va} phase="joined" showFlux />
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          <b>קדמי</b> (<Tex>{'V_A>0'}</Tex>): <Tex>{'J_{S\\to M}'}</Tex> גובר מעריכית → זרם קדמי גדול.{' '}
          <b>אחורי</b> (<Tex>{'V_A<0'}</Tex>): <Tex>{'J_{S\\to M}\\to0'}</Tex>, ונשאר רק <Tex>{'-J_{M\\to S}=-J_{ST}'}</Tex> —
          <b> זו הרוויה האחורית</b>. <Tex>{'J_{M\\to S}'}</Tex> הקבוע הוא שמסביר למה הזרם האחורי אינו תלוי במתח.
        </p>
      </Panel>

      <Panel title="אפקט שוטקי — הנמכת המחסום">
        <p className="leading-relaxed text-slate-600">
          במודל האידיאלי האחורי רווי בדיוק ב-<Tex>{'-J_{ST}'}</Tex>. במציאות פועל <b>אפקט שוטקי</b> — <b>הנמכת מחסום
          בכוח-דמות</b>: השדה החשמלי מנמיך מעט את <Tex>{'\\varphi_B'}</Tex> (<Tex>{'\\Delta\\varphi_B\\propto\\sqrt{E_{max}}'}</Tex>),
          כך שהזרם האחורי <b>עולה לאט</b> עם המתח — בדיוק האנלוג של זרם הגנרציה הלא-רווי שראינו בדיודה הלא-אידיאלית.
        </p>
      </Panel>
    </div>
  )
}
