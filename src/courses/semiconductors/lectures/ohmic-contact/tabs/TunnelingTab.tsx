import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import EnrichmentBadge from '../../../components/EnrichmentBadge'
import Slider from '../../../components/Slider'
import Readout from '../components/Readout'
import ContactResistanceCurve from '../components/ContactResistanceCurve'
import OhmicBandDiagram from '../components/OhmicBandDiagram'
import TunnelingIllustration from '../components/TunnelingIllustration'
import { MATERIALS, METALS, METAL_LIST, fmtDoping, fmtLength, ohmicState } from '../../../lib/junction'

const Si = MATERIALS.Si

const REGIME_HE: Record<string, string> = {
  TE: 'תרמיוני (TE)',
  TFE: 'תרמיוני-שדה (TFE)',
  FE: 'מנהור (FE) — אוהמי',
}

/**
 * Lecture 2ד centerpiece — tunneling & specific contact resistance. Drag N_D: the
 * barrier W thins, ρ_c collapses exponentially, and the regime moves TE→TFE→FE.
 * The ρ_c(N_D) log-log curve is the hero; the band diagram shows the thin barrier.
 */
export default function TunnelingTab() {
  const [metalKey, setMetalKey] = useState('W')
  const [expNd, setExpNd] = useState(20)
  const metal = METALS[metalKey]
  const Nd = 10 ** expNd
  const st = useMemo(() => ohmicState(metal, Si, Nd), [metal, Nd])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מה זה מנהור?">
        <p className="leading-relaxed text-slate-700">
          <b>קלאסית</b>, אלקטרון שאין לו מספיק אנרגיה לטפס <b>מעל</b> המחסום פשוט נחסם ומוחזר — כמו כדור שנזרק על קיר
          ולא עובר אותו. <b>אבל אלקטרון הוא גם גל</b>: פונקציית-הגל שלו לא נעצרת בקיר אלא <b>דועכת מעריכית בתוכו</b>, ואם
          המחסום <b>דק מספיק</b> נשארת לה משרעת גם בצד השני — כלומר יש <b>הסתברות</b> שהאלקטרון "יופיע" מעבר למחסום מבלי
          לטפס מעליו. זהו <b>מנהור</b>.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">פונקציית-הגל של האלקטרון</span> — דועכת במחסום, יוצאת מוקטנת בצד השני
          </p>
          <TunnelingIllustration />
        </div>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 px-4 py-2.5 text-sm leading-relaxed text-slate-700">
            ההסתברות <b>צונחת מעריכית עם רוחב המחסום</b> — לכן סימום כבד, שמדקק את <Tex>{'W'}</Tex>, <b>מקפיץ</b> את המנהור.
          </div>
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50/50 px-4 py-2.5 text-sm leading-relaxed text-slate-700">
            המנהור <b>אלסטי</b>: האנרגיה נשמרת, ולכן האלקטרון עובר <b>אופקית</b> ברמת פרמי (לא מטפס ולא מאבד אנרגיה).
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-2.5 text-sm leading-relaxed text-slate-600">
        <EnrichmentBadge className="shrink-0" />
        <span>
          <b>רעיון</b> המנהור הוא ליבת הקורס. הניתוח ה<b>כמותי</b> שלהלן — <Tex>{'E_{00}'}</Tex>, המשטרים (TE/TFE/FE)
          וההתנגדות <Tex>{'\\rho_c'}</Tex> — אינו בדף-הנוסחאות; זו <b>העשרה</b> (מבוסס Sze).
        </span>
      </div>

      <Panel title="מנהור: מסממים כבד → המחסום מתדקק">
        <p className="leading-relaxed text-slate-600">
          רוחב המחסום <Tex>{'W=\\sqrt{2\\varepsilon_s V_{bi}/(qN_D)}\\propto 1/\\sqrt{N_D}'}</Tex> מצטמצם עם הסימום. ב-<Tex>{'N_D\\sim10^{20}'}</Tex>
          הוא מגיע לכמה ננומטרים — דק מספיק כדי שאלקטרונים <b>ינהרו</b> דרכו. המשטר נקבע מ<b>אנרגיית המנהור</b>{' '}
          <Tex>{'E_{00}\\propto\\sqrt{N_D}'}</Tex> מול <Tex>{'kT'}</Tex>, וההתנגדות הסגולית צונחת מעריכית:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'\\rho_c=\\rho_0\\,e^{\\varphi_B/E_0},\\qquad E_0=E_{00}\\coth(E_{00}/kT)'}</Tex>
        </div>
      </Panel>

      <Panel title="גררו את הסימום">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-slate-600">מתכת:</span>
                {METAL_LIST.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMetalKey(m.key)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                      m.key === metalKey ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {m.key} <span className="text-xs opacity-70">{m.phiM}</span>
                  </button>
                ))}
              </div>
              <Slider label={<>סימום · <Tex>{'N_D'}</Tex></>} value={expNd} min={16} max={21} onChange={setExpNd} display={<Tex>{`${fmtDoping(Nd)}\\,\\mathrm{cm^{-3}}`}</Tex>} />
              <p className="text-xs leading-relaxed text-slate-500">
                שימו לב: ב-TE (סימום נמוך) ההתנגדות <b>מוגבלת-מחסום</b> וכמעט קבועה; ב-FE (סימום כבד) היא
                <b> מוגבלת-מנהור</b> וצונחת בסדרי-גודל.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="רוחב מחסום $W$" value={fmtLength(st.W)} accent="border-slate-100 bg-white" />
              <Readout label="אנרגיית מנהור $E_{00}$" value={`${(st.E00 * 1000).toFixed(1)} meV`} accent="border-sky-100 bg-sky-50" />
              <Readout label="מחסום $\varphi_B$" value={`${st.phiB.toFixed(2)} eV`} accent="border-amber-100 bg-amber-50" />
              <Readout label="התנגדות מגע $\rho_c$" value={`${st.rhoC.toExponential(1)} Ω·cm²`} accent="border-violet-100 bg-violet-50" />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${st.regime === 'FE' ? 'bg-emerald-100 text-emerald-700' : st.regime === 'TFE' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                משטר: {REGIME_HE[st.regime]}
              </span>
              {st.degenerate && <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">n⁺ מנוון</span>}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">
                <span className="text-slate-500">ρ_c מול N_D · לוג–לוג</span> — הקריסה המעריכית
              </p>
              <ContactResistanceCurve metal={metal} mat={Si} Nd={Nd} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <p className="mb-1 text-center text-xs font-semibold text-slate-400">
                <span className="text-slate-500">דיאגרמת פסים</span> — המחסום הדק והמנהור
              </p>
              <OhmicBandDiagram metal={metal} mat={Si} Nd={Nd} mode="tunneling" />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
