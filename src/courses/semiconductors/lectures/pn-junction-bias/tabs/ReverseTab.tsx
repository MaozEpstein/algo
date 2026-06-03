import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import BiasedBandDiagram from '../components/BiasedBandDiagram'
import Readout from '../components/Readout'
import ReverseIVKnee from '../components/ReverseIVKnee'
import AvalancheDiagram from '../components/AvalancheDiagram'
import ZenerTunnelingDiagram from '../components/ZenerTunnelingDiagram'
import { MATERIALS, fmtField, fmtLength, fmtVolt, junctionState } from '../../../lib/junction'

const NA = 1e16
const ND = 1e17
const mat = MATERIALS.Si
// fixed x-frame (widest case = the most-reverse end of the slider) so the band
// visibly WIDENS toward reverse and is narrower near equilibrium
const REF = junctionState(NA, ND, mat, -5)
const X_REF = Math.max(REF.dn, REF.dp) * 2.2

/**
 * Lecture 1ב — Reverse bias: barrier raises to q(V_bi+|V_A|), depletion widens,
 * the field strengthens, diffusion is choked off and only a tiny minority
 * "leakage" current flows (it saturates). A slider drives the visuals live.
 */
export default function ReverseTab() {
  const [Va, setVa] = useState(-2)
  const state = useMemo(() => junctionState(NA, ND, mat, Va), [Va])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="ממתח אחורי — מה קורה?">
        <p className="leading-relaxed text-slate-600">
          בממתח אחורי (<Tex>{'V_A<0'}</Tex>) המתח החיצוני <b>מחזק</b> את השדה הבנוי. השרשרת מתהפכת:
        </p>
        <ol className="mt-3 list-decimal space-y-2 ps-6 leading-relaxed text-slate-600 marker:font-bold marker:text-sky-500">
          <li>מחסום הפוטנציאל <b>עולה</b> ל-<Tex>{'q(V_{bi}+|V_A|)'}</Tex>.</li>
          <li>אזור המחסור <b>מתרחב</b> (צריך לחשוף יותר מטען), והשדה הבנוי <b>מתחזק</b>.</li>
          <li>הדיפוזיה כמעט נחסמת; נשאר רק זרם <b>מיעוט</b> זעיר שנסחף — והוא כמעט <b>אינו תלוי</b> במתח (רווי).</li>
          <li>
            בממתח אחורי גבוה מאוד מתרחשת <b>פריצה</b> (Breakdown) והזרם מזנק — ראו בהרחבה למטה.
          </li>
        </ol>
      </Panel>

      <Panel title="הזיזו את הממתח האחורי">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>ממתח אחורי · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={-5}
                max={0}
                step={0.1}
                onChange={setVa}
                display={fmtVolt(Va)}
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                ככל ש-<Tex>{'|V_A|'}</Tex> גדל, רצועת המחסור מתרחבת ופסי האנרגיה נעשים תלולים יותר — הצומת
                "אוגר" יותר מטען (קיבול קטֵן, כי האזור רחב).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="מחסום $q(V_{bi}-V_A)$" value={fmtVolt(state.Vbi - Va)} accent="border-sky-100 bg-sky-50" />
              <Readout label="רוחב $d$" value={fmtLength(state.d)} accent="border-slate-100 bg-white" />
              <Readout label="שדה שיא $E_{max}$" value={fmtField(state.Emax)} accent="border-amber-100 bg-amber-50" />
              <Readout label="פיצול $E_{Fn}-E_{Fp}$" value={fmtVolt(Va)} accent="border-emerald-100 bg-emerald-50" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">דיאגרמת הפסים תחת ממתח</p>
              <BiasedBandDiagram state={state} Va={Va} Na={NA} Nd={ND} mat={mat} xMaxRef={X_REF} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">ρ → E → V · המפל עולה ל-<Tex>{'V_{bi}-V_A'}</Tex></p>
              <JunctionElectrostatics dn={state.dn} dp={state.dp} Emax={state.Emax} Vbi={state.Vbi - Va} Na={NA} Nd={ND} xMaxRef={X_REF} />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="פריצה (Breakdown)">
        <p className="leading-relaxed text-slate-600">
          כשמגדילים מספיק את הממתח האחורי, בנקודה מסוימת <b>הזרם מזנק</b> — זו ה<b>פריצה</b>, במתח אופייני{' '}
          <Tex>{'V_{BR}'}</Tex>. באופיין <Tex>{'I'}</Tex>–<Tex>{'V'}</Tex> רואים <b>"ברך"</b> חדה:
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">אופיין I–V — הברך בצד האחורי</p>
          <ReverseIVKnee />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          הפריצה אינה הרסנית כל עוד מגבילים את הזרם, ויש לה <b>שני מנגנונים</b>:
        </p>

        {/* bullet 1 — avalanche */}
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
          <p className="font-bold text-amber-700">⚡ פריצת מפולת (Avalanche)</p>
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2">
            <AvalancheDiagram />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            בשדה החזק נושא מואץ ו<b>מיינן אטום בהתנגשות</b> → נוצר זוג אלקטרון–חור, והנושאים החדשים מייננים
            בתורם (<b>כפל-מפולת</b>). אופייני לצמתים <b>מסוממים קלות</b> (מחסור רחב), עם <Tex>{'V_{BR}'}</Tex>{' '}
            <b>גבוה</b> ומקדם-טמפרטורה <b>חיובי</b>.
          </p>
        </div>

        {/* bullet 2 — Zener */}
        <div className="mt-3 rounded-2xl border border-sky-200 bg-sky-50/40 p-4">
          <p className="font-bold text-sky-700">🔻 פריצת Zener (מנהור)</p>
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-2">
            <ZenerTunnelingDiagram />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            בצמתים <b>מסוממים כבד</b> אזור המחסור צר מאוד והשדה עצום (<Tex>{'\\sim\\!10^6\\,\\mathrm{V/cm}'}</Tex>),
            כך שאלקטרונים <b>מנהרים</b> ישירות מפס-הערכיות בצד p לפס-ההולכה בצד n. אופייני ל-<Tex>{'V_{BR}'}</Tex>{' '}
            <b>נמוך</b> (≲5V ב-Si) ומקדם-טמפרטורה <b>שלילי</b>. <b>דיודת Zener</b> מנצלת את הברך הזו לייצוב מתח.
          </p>
        </div>

        {/* comparison */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-center text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-start font-semibold text-slate-400">מאפיין</th>
                <th className="border-b-2 border-amber-200 bg-amber-50/60 px-3 py-2 font-bold text-amber-700">מפולת</th>
                <th className="border-b-2 border-sky-200 bg-sky-50/60 px-3 py-2 font-bold text-sky-700">Zener</th>
              </tr>
            </thead>
            <tbody>
              {[
                { k: 'סימום', a: 'קל (מחסור רחב)', z: 'כבד (מחסור צר)' },
                { k: 'מתח פריצה', a: 'גבוה', z: 'נמוך (≲5V)' },
                { k: 'מקדם טמפרטורה', a: 'חיובי', z: 'שלילי' },
                { k: 'מנגנון', a: 'כפל בהתנגשות', z: 'מנהור פס-לפס' },
              ].map((r, i) => (
                <tr key={i} className={i % 2 ? 'bg-slate-50/40' : ''}>
                  <td className="border-b border-slate-100 px-3 py-2 text-start font-semibold text-slate-700">{r.k}</td>
                  <td className="border-b border-slate-100 px-3 py-2 text-amber-700">{r.a}</td>
                  <td className="border-b border-slate-100 px-3 py-2 text-sky-700">{r.z}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
