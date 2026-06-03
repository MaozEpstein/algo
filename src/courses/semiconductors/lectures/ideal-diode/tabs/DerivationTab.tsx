import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import IVCurve from '../components/IVCurve'
import {
  MATERIALS,
  MATERIAL_LIST,
  diffusionCoeff,
  diffusionLength,
  diodeCurrents,
  fmtCurrentDensity,
  fmtDoping,
  fmtLength,
  fmtVolt,
  thermalVoltage,
  type Material,
} from '../../../lib/junction'

// the I–V characteristic plot uses a canonical Si junction (its job is the curve
// SHAPE); the saturation-current explorer below varies material/doping/T
const IV_NA = 1e16
const IV_ND = 1e17
const IV_MAT = MATERIALS.Si

/**
 * Lecture 2א — "the diode characteristic": the derivation, the I–V curve it
 * produces, and the saturation current J_S behind it — all in one tab, since each
 * is the natural continuation of the previous. We derive J=J_S(e^{V_A/V_T}−1) from
 * the minority diffusion current, plot the characteristic (linear/log, live), then
 * unpack what sets J_S (D, L, doping, n_i²), the electron/hole split (the
 * less-doped side dominates) and the strong temperature dependence (∝ n_i²).
 */
export default function DerivationTab() {
  // I–V characteristic panel — operating point + axis scale
  const [Va, setVa] = useState(0.6)
  const [mode, setMode] = useState<'linear' | 'log'>('linear')
  const VT = thermalVoltage(300)
  const { ivJs, ivJ, factor } = useMemo(() => {
    const c = diodeCurrents(IV_NA, IV_ND, IV_MAT, Va, 300)
    return { ivJs: c.Js, ivJ: c.J, factor: Math.exp(Va / VT) }
  }, [Va, VT])

  // saturation-current explorer — material / doping / temperature
  const [matKey, setMatKey] = useState<Material['key']>('Si')
  const [expNa, setExpNa] = useState(16)
  const [expNd, setExpNd] = useState(17)
  const [T, setT] = useState(300)
  const mat = MATERIALS[matKey]
  const Na = 10 ** expNa
  const Nd = 10 ** expNd

  const { Js, JsP, JsN, Lp, Ln, Js400 } = useMemo(() => {
    const c = diodeCurrents(Na, Nd, mat, 0, T)
    const Lp = diffusionLength(diffusionCoeff(mat.mup, T), mat.taup)
    const Ln = diffusionLength(diffusionCoeff(mat.mun, T), mat.taun)
    const Js400 = diodeCurrents(Na, Nd, mat, 0, T + 50).Js
    return { Js: c.Js, JsP: c.JsP, JsN: c.JsN, Lp, Ln, Js400 }
  }, [Na, Nd, mat, T])

  const holeDominant = JsP > JsN
  const ratio = Js400 / Js

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהשיפוע — לזרם שוקלי">
        <p className="leading-relaxed text-slate-600">
          הזרם הזורם בקצה אזור המחסור הוא <b>זרם דיפוזיה</b> של נושאי המיעוט המוזרקים. נגזור אותו בארבעה צעדים:
        </p>
        <ol className="mt-3 list-decimal space-y-3 ps-6 leading-relaxed text-slate-600 marker:font-bold marker:text-violet-500">
          <li>
            צפיפות זרם החורים = <Tex>{'-qD_p'}</Tex> כפול <b>שיפוע</b> הפרופיל בקצה. מהדעיכה המעריכית{' '}
            <Tex>{'\\Delta p_n(x)=\\Delta p_n(0)e^{-x/L_p}'}</Tex> השיפוע ב-<Tex>{'x=0'}</Tex> הוא{' '}
            <Tex>{'-\\Delta p_n(0)/L_p'}</Tex>, ולכן:
            <div className="mt-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-center">
              <Tex block>{'J_p = qD_p\\,\\frac{\\Delta p_n(0)}{L_p}'}</Tex>
            </div>
          </li>
          <li>
            מציבים את <b>חוק הצומת</b> <Tex>{'\\Delta p_n(0)=p_{n0}\\left(e^{V_A/V_T}-1\\right)'}</Tex> עם{' '}
            <Tex>{'p_{n0}=n_i^2/N_D'}</Tex>:
            <div className="mt-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-center">
              <Tex block>{'J_p = \\frac{qD_p\\,n_i^2}{L_p N_D}\\left(e^{V_A/V_T}-1\\right)'}</Tex>
            </div>
          </li>
          <li>
            באותו אופן, אלקטרונים מוזרקים אל צד <b>p</b> (עם <Tex>{'n_{p0}=n_i^2/N_A'}</Tex>):
            <div className="mt-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-center">
              <Tex block>{'J_n = \\frac{qD_n\\,n_i^2}{L_n N_A}\\left(e^{V_A/V_T}-1\\right)'}</Tex>
            </div>
          </li>
          <li>
            הזרם הכולל אחיד דרך אזור המחסור (אין שם רקומבינציה — הנחה 3), לכן פשוט <b>מחברים</b> את שתי
            התרומות:
          </li>
        </ol>
        <div className="mt-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J = J_S\\left(e^{V_A/V_T}-1\\right),\\qquad J_S = q\\,n_i^2\\!\\left(\\frac{D_p}{L_p N_D}+\\frac{D_n}{L_n N_A}\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          הגורם <Tex>{'\\left(e^{V_A/V_T}-1\\right)'}</Tex> שצץ מתנאי השפה הוא בדיוק הפירוק לשני הזרמים מלשונית
          <b> «מאיזון לזרם»</b>: ה-<Tex>{'J_S e^{V_A/V_T}'}</Tex> הוא זרם הדיפוזיה, וה-<Tex>{'-J_S'}</Tex> הוא זרם
          הסחיפה הקבוע.
        </p>
      </Panel>

      <Panel title="לקרוא את התוצאה">
        <ul className="list-disc space-y-2 ps-6 leading-relaxed text-slate-600 marker:text-violet-400">
          <li>
            <b>קדמי</b> (<Tex>{'V_A>0'}</Tex>): המעריך גדול מ-1 וגדל מהר — הזרם <b>מתפוצץ מעריכית</b>.
          </li>
          <li>
            <b>אחורי</b> (<Tex>{'V_A<0'}</Tex>): המעריך שואף ל-0, ולכן <Tex>{'J\\to -J_S'}</Tex> — זרם זעיר
            ו<b>רווי</b> (כמעט בלתי תלוי במתח).
          </li>
          <li>
            <b>שיווי-משקל</b> (<Tex>{'V_A=0'}</Tex>): הסוגריים מתאפסים — <Tex>{'J=0'}</Tex>, כמצופה.
          </li>
        </ul>
      </Panel>

      <Panel title="אופיין הזרם-מתח של הדיודה">
        <p className="leading-relaxed text-slate-600">
          זוהי משוואת שוקלי על גרף: כמעט שטוח באחורי ובקדמי קטן, ואז <b>ברך</b> חדה סביב{' '}
          <Tex>{'0.6\\!-\\!0.7\\,\\mathrm{V}'}</Tex> (בסיליקון) ו<b>זינוק מעריכי</b>. עברו ל<b>סקאלה
          לוגריתמית</b> כדי לראות את המעריכי כ<b>קו ישר</b> שעולה מעל רצפת הרוויה <Tex>{'J_S'}</Tex>.
        </p>

        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_minmax(0,1.2fr)] lg:items-center">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <Slider
                label={<>ממתח · <Tex>{'V_A'}</Tex></>}
                value={Va}
                min={-0.4}
                max={0.8}
                step={0.01}
                onChange={setVa}
                display={fmtVolt(Va)}
              />
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Readout label="$J_S$ (רוויה)" value={fmtCurrentDensity(ivJs)} accent="border-rose-100 bg-rose-50" />
              <Readout label="גורם $e^{V_A/V_T}$" value={`×${factor < 1000 ? factor.toFixed(1) : factor.toExponential(1)}`} accent="border-amber-100 bg-amber-50" />
              <Readout label="$J$ בנקודת העבודה" value={fmtCurrentDensity(ivJ)} accent="border-violet-100 bg-violet-50" />
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              שימו לב לטווח האדיר: <Tex>{'J_S'}</Tex> זעיר (~<Tex>{'10^{-11}'}</Tex>) בעוד הזרם הקדמי מגיע
              לסדרי <Tex>{'\\mathrm{A/cm^2}'}</Tex> — יחס של עשרות סדרי-גודל.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <IVCurve Na={IV_NA} Nd={IV_ND} mat={IV_MAT} Va={Va} mode={mode} />
          </div>
        </div>
      </Panel>

      <Panel title="מה קובע את זרם הרוויה?">
        <p className="leading-relaxed text-slate-600">
          הקבוע <Tex>{'J_S'}</Tex> שגזרנו זה עתה הוא <b>לב העניין</b> — הוא קובע את גובה הזרם האחורי ואת
          מתח-ההצתה הקדמי. נפרק אותו: זהו סכום שתי תרומות הזרקה — חורים אל צד <b>n</b> ואלקטרונים אל צד <b>p</b>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'J_S=\\underbrace{\\frac{qD_p n_i^2}{L_p N_D}}_{J_{S,p}}+\\underbrace{\\frac{qD_n n_i^2}{L_n N_A}}_{J_{S,n}}'}</Tex>
        </div>
        <ul className="mt-3 list-disc space-y-2 ps-6 leading-relaxed text-slate-600 marker:text-rose-400">
          <li>כל תרומה <Tex>{'\\propto 1/N'}</Tex> של אותו צד — <b>הצד המסומם פחות שולט</b> בהזרקה.</li>
          <li>תלות חזקה ב-<Tex>{'n_i^2'}</Tex> ⇒ <b>תלות חדה בטמפרטורה</b> ובפער האסור (חומר).</li>
          <li>גם <Tex>{'D=\\tfrac{kT}{q}\\mu'}</Tex> ו-<Tex>{'L=\\sqrt{D\\tau}'}</Tex> נכנסים — דרך הניידות וזמן-החיים.</li>
        </ul>
      </Panel>

      <Panel title="חקרו את זרם הרוויה — חומר, סימום, טמפרטורה">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-600">חומר:</span>
              {MATERIAL_LIST.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMatKey(m.key)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    m.key === matKey ? 'border-rose-500 bg-rose-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {m.he}
                </button>
              ))}
            </div>
            <Slider
              label={<>סימום צד p · <Tex>{'N_A'}</Tex></>}
              value={expNa}
              min={14}
              max={19}
              onChange={setExpNa}
              display={<Tex>{`${fmtDoping(Na)}\\,\\mathrm{cm^{-3}}`}</Tex>}
            />
            <Slider
              label={<>סימום צד n · <Tex>{'N_D'}</Tex></>}
              value={expNd}
              min={14}
              max={19}
              onChange={setExpNd}
              display={<Tex>{`${fmtDoping(Nd)}\\,\\mathrm{cm^{-3}}`}</Tex>}
            />
            <Slider
              label={<>טמפרטורה · <Tex>{'T'}</Tex></>}
              value={T}
              min={250}
              max={450}
              step={5}
              onChange={setT}
              display={`${T} K`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Readout label="$J_S$ כולל" value={fmtCurrentDensity(Js)} accent="border-rose-100 bg-rose-50" />
              <Readout label="$J_{S,p}$ (חורים→n)" value={fmtCurrentDensity(JsP)} accent="border-sky-100 bg-sky-50" />
              <Readout label="$J_{S,n}$ (אלקטרונים→p)" value={fmtCurrentDensity(JsN)} accent="border-amber-100 bg-amber-50" />
              <Readout label="אורך דיפוזיה $L_p$" value={fmtLength(Lp)} accent="border-slate-100 bg-white" />
              <Readout label="אורך דיפוזיה $L_n$" value={fmtLength(Ln)} accent="border-slate-100 bg-white" />
              <Readout label={`$J_S(T{+}50)/J_S$`} value={`×${ratio < 100 ? ratio.toFixed(1) : ratio.toExponential(1)}`} accent="border-violet-100 bg-violet-50" />
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm leading-relaxed text-slate-700">
              <b>שליטה:</b>{' '}
              {holeDominant ? (
                <>הזרקת ה<b>חורים</b> אל צד n שולטת (כי <Tex>{'N_D'}</Tex> קטן יותר → <Tex>{'J_{S,p}'}</Tex> גדול).</>
              ) : (
                <>הזרקת ה<b>אלקטרונים</b> אל צד p שולטת (כי <Tex>{'N_A'}</Tex> קטן יותר → <Tex>{'J_{S,n}'}</Tex> גדול).</>
              )}{' '}
              העלאת הטמפרטורה ב-<Tex>{'50\\,\\mathrm{K}'}</Tex> מכפילה את <Tex>{'J_S'}</Tex> בערך פי {ratio < 100 ? ratio.toFixed(1) : ratio.toExponential(1)} — זו טביעת-האצבע של <Tex>{'n_i^2'}</Tex>.
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
