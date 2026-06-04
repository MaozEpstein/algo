import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import SchottkyIVCurve from '../components/SchottkyIVCurve'
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
