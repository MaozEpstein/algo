import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import MetalSemiconductorBandDiagram from '../components/MetalSemiconductorBandDiagram'
import { MATERIALS, METALS, fmtVolt, schottkyState } from '../../../lib/junction'

const Si = MATERIALS.Si
const Au = METALS.Au // tall, clearly-visible barrier φ_B = 1.05 eV
const ND = 1e17

/**
 * Lecture 2ג — the band diagram & barrier formation (centerpiece). A
 * before/after-contact toggle teaches WHY the barrier forms (Fermi-level
 * equalization), and a bias slider shows the SC-side bending q(V_bi−V_A) change
 * while the metal-side φ_B stays fixed — the root of the rectifying behaviour.
 */
export default function BandDiagramTab() {
  const [phase, setPhase] = useState<'separated' | 'joined'>('separated')
  const [Va, setVa] = useState(0)
  const st = useMemo(() => schottkyState(Au, Si, ND, Va), [Va])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך נוצר המחסום?">
        <p className="leading-relaxed text-slate-600">
          <b>לפני המגע</b> רמת הוואקום משותפת, ורמת פרמי של המתכת <Tex>{'E_{Fm}'}</Tex> נמוכה מזו של המל"מ (כי
          <Tex>{'\\varphi_m>\\varphi_s'}</Tex>). <b>ברגע המגע</b> אלקטרונים זורמים מהמל"מ אל המתכת עד שרמות פרמי
          <b> משתוות</b> — והמעבר הזה מכופף את הפסים כלפי מעלה ויוצר את אזור המחסור והמחסום. החליפו בין המצבים:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['separated', 'joined'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPhase(p)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                phase === p ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {p === 'separated' ? 'לפני מגע' : 'אחרי מגע'}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">דיאגרמת פסים · אנרגיה–מיקום</span> ·{' '}
            {phase === 'separated' ? 'לפני מגע — רמת ואקום משותפת, רמות פרמי לא מיושרות' : 'אחרי מגע — הפסים מתכופפים, נוצר מחסום'}
          </p>
          <MetalSemiconductorBandDiagram metal={Au} mat={Si} Nd={ND} Va={phase === 'joined' ? Va : 0} phase={phase} />
        </div>

        {phase === 'joined' && (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Slider
              label={<>ממתח חיצוני · <Tex>{'V_A'}</Tex></>}
              value={Va}
              min={-0.4}
              max={0.6}
              step={0.02}
              onChange={setVa}
              display={fmtVolt(Va)}
            />
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              שימו לב: בקדמי הגבעה מצד-המל"מ <Tex>{'q(V_{bi}-V_A)'}</Tex> <b>מצטמצמת</b>, אבל המחסום מצד-המתכת
              <Tex>{'\\varphi_B'}</Tex> <b>נשאר קבוע</b> — וזה בדיוק מקור פעולת היישור.
            </p>
          </div>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Readout label="מחסום $\varphi_B$" value={`${st.phiB.toFixed(2)} eV`} accent="border-violet-100 bg-violet-50" />
          <Readout label="היסט בולק $\xi$" value={`${st.xi.toFixed(2)} eV`} accent="border-sky-100 bg-sky-50" />
          <Readout label="מתח בנוי $V_{bi}$" value={fmtVolt(st.Vbi)} accent="border-amber-100 bg-amber-50" />
        </div>
      </Panel>

      <Panel title="אידיאלי מול ממשי — קיבוע רמת-פרמי">
        <p className="leading-relaxed text-slate-600">
          המודל כאן הוא ה<b>אידיאלי</b> (Schottky-Mott): <Tex>{'\\varphi_B=\\varphi_m-\\chi'}</Tex>. במציאות, על
          סיליקון, <b>מצבי-שטח</b> בממשק "מקבעים" את רמת פרמי (Bardeen), כך שהמחסום הנמדד <b>כמעט בלתי-תלוי
          במתכת</b> ונע סביב <Tex>{'\\sim\\!0.6\\!-\\!0.8\\,\\mathrm{eV}'}</Tex>. זו אותה רוח של "אידיאלי ואז ממשי"
          שראינו בדיודת PN.
        </p>
      </Panel>
    </div>
  )
}
