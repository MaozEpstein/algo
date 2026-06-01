import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import BandDiagram from '../../../viz/BandDiagram'
import { MATERIALS, fmtDoping, fmtVolt, junctionState } from '../../../lib/junction'

export default function BandDiagramTab() {
  const [exp, setExp] = useState(16) // symmetric doping 10^exp cm⁻³
  const Na = 10 ** exp
  const Nd = 10 ** exp
  const state = useMemo(() => junctionState(Na, Nd, MATERIALS.Si), [Na, Nd])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מה זו דיאגרמת פסים?">
        <p className="leading-relaxed text-slate-600">
          דיאגרמת הפסים מציירת את <b>אנרגיית האלקטרון</b> כפונקציה של המיקום. ארבעה מפלסים מספרים הכול:
        </p>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-600">
          <li>
            <Tex>{'E_C'}</Tex> · <b>תחתית פס ההולכה</b> — האנרגיה המינימלית של אלקטרון חופשי.
          </li>
          <li>
            <Tex>{'E_V'}</Tex> · <b>ראש פס הערכיות</b> — מעליו "יושבים" החורים. הפער ביניהם הוא{' '}
            <b>הפער האסור</b> <Tex>{'E_g = E_C - E_V'}</Tex> (ב-Si כ-<Tex>{'1.12\\,eV'}</Tex>).
          </li>
          <li>
            <Tex>{'E_i'}</Tex> · <b>רמת פרמי אינטרינסית</b> — בערך באמצע הפער; סמן-ייחוס.
          </li>
          <li>
            <Tex>{'E_F'}</Tex> · <b>רמת פרמי</b> — ה"מפלס" שקובע אכלוס: ככל ש-<Tex>{'E_F'}</Tex> קרובה
            ל-<Tex>{'E_C'}</Tex> יש יותר אלקטרונים (חומר n), וקרובה ל-<Tex>{'E_V'}</Tex> — יותר חורים (חומר p).
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-slate-600">
          הקשר הכמותי (יחס בולצמן) — ריכוז הנושאים נקבע ממרחק <Tex>{'E_F'}</Tex> מ-<Tex>{'E_i'}</Tex>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'n = n_i\\,e^{(E_F - E_i)/kT}, \\qquad p = n_i\\,e^{(E_i - E_F)/kT}'}</Tex>
        </div>
      </Panel>

      <Panel title="דיאגרמת הפסים בשיווי משקל">
        <p className="leading-relaxed text-slate-600">
          בשיווי משקל <b>רמת פרמי</b> <Tex>{'E_F'}</Tex> היא <b>קו אחיד</b> לכל רוחב ההתקן — זו ממש החתימה
          של שיווי המשקל.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          הפסים <Tex>{'E_C'}</Tex> ו-<Tex>{'E_V'}</Tex> <b>מתכופפים</b> כלפי מטה במעבר מ-p ל-n, וההפרש הכולל
          הוא בדיוק <Tex>{'qV_{bi}'}</Tex>. ככל שהסימום כבד יותר — הכיפוף גדול יותר.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
          <BandDiagram state={state} Na={Na} Nd={Nd} mat={MATERIALS.Si} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <Slider
            label={<>סימום (סימטרי) <Tex>{'N_A = N_D'}</Tex></>}
            value={exp}
            min={14}
            max={19}
            step={1}
            onChange={setExp}
            display={<Tex>{`${fmtDoping(Na)}\\,\\mathrm{cm^{-3}}`}</Tex>}
          />
          <span className="rounded-xl bg-sky-50 px-4 py-2 text-center text-sky-700">
            <span className="text-xs">מתח בנוי</span>
            <span className="block font-mono text-lg font-bold">{fmtVolt(state.Vbi)}</span>
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'V_{bi} = \\frac{kT}{q}\\,\\ln\\!\\left(\\frac{N_A N_D}{n_i^2}\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          הסימום החשמלי (<Tex>{'kT/q \\approx 25.85\\,mV'}</Tex> ב-300K) קובע סקאלה לוגריתמית — לכן הכפלת
          הסימום פי 10 מוסיפה ל-<Tex>{'V_{bi}'}</Tex> רק <Tex>{'\\sim 60\\,mV'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
