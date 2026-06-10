import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import SourceSketch from '../../bjt-structure/components/SourceSketch'
import MosBandSeparated from '../components/MosBandSeparated'
import MosBandJoined from '../components/MosBandJoined'

/** Lesson 6א — the MOS band diagram, work-function difference φ_MS, and flat-band voltage. */
export default function BandsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="דיאגרמת-הפסים של קבל MOS">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex-1 leading-relaxed text-slate-700">
            מציירים תחילה את שלוש השכבות <b>בנפרד</b> (לפי פונקציות-העבודה שלהן), ואז <b>מחברים</b> אותן. ההפרש בין
            פונקציות-העבודה גורם לפסים <b>להתכופף</b> — וזהו מקור כל ההתנהגות.
          </p>
          <SourceSketch src="docs/mos-band-diagram-source.png" title="דיאגרמת-הפסים של קבל MOS — שרטוט המרצה" label="לראות קובץ מקור" download="MOS band diagram (source).png" />
        </div>

        <p className="mt-4 mb-1 text-sm font-semibold text-slate-500">① נצייר בנפרד — מתכת | אוקסיד | מל"מ</p>
        <MosBandSeparated />

        <p className="mt-5 mb-1 text-sm font-semibold text-slate-500">② מחברים — הפסים מתכופפים</p>
        <MosBandJoined />
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          ברגע החיבור, <Tex>{'E_F'}</Tex> מתיישר לאורך כל המבנה; ההפרש בפונקציות-העבודה נופל בחלקו על האוקסיד
          (<Tex>{'qV_{ox}'}</Tex>) ובחלקו ככיפוף-פסים במל"מ (<Tex>{'q\\psi_s'}</Tex>). בבולק <Tex>{'E_i'}</Tex> מעל
          <Tex>{'\\,E_F'}</Tex> ב-<Tex>{'q\\phi_F'}</Tex> (מצע p).
        </p>
      </Panel>

      <Panel title={<>פונקציות-העבודה ו-<Tex>{'\\phi_{MS}'}</Tex></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <Tex block>{'\\phi_S = \\chi_S + \\tfrac{E_g}{2} + q\\phi_F'}</Tex>
            <p className="mt-1 text-xs text-slate-500">פונקציית-העבודה של המצע (p-type)</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-center">
            <Tex block>{'q\\phi_F = kT\\,\\ln\\!\\left(\\dfrac{N_A}{n_i}\\right)'}</Tex>
            <p className="mt-1 text-xs text-slate-500">פוטנציאל פרמי — מרחק <Tex>{'E_i'}</Tex> מ-<Tex>{'E_F'}</Tex></p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-center leading-relaxed text-slate-700">
          <Tex block>{'\\phi_{MS} = \\phi_M - \\phi_S = \\phi_M - \\left(\\chi_S + \\tfrac{E_g}{2} + q\\phi_F\\right)'}</Tex>
          <span className="text-sm">הפרש פונקציות-העבודה מתכת↔מוליך — הוא שקובע את כיפוף-הפסים ההתחלתי.</span>
        </div>
      </Panel>

      <Panel title={<>מתח flat-band <Tex>{'V_{FB}'}</Tex></>}>
        <StepFlow
          tone="reverse"
          steps={[
            { title: <>מחברים M ו-S</>, body: <><Tex>{'\\phi_M\\neq\\phi_S'}</Tex> → הפסים מתכופפים</> },
            { title: <>מפעילים <Tex>{'V_G=V_{FB}'}</Tex></>, body: <>מתח שמבטל את הכיפוף</> },
            { title: <><Tex>{'V_{ox}=0,\\;\\psi_s=0'}</Tex></>, body: <>אין מתח על האוקסיד, אין כיפוף</> },
          ]}
          outcome={{ label: 'פסים שטוחים', sub: <><Tex>{'V_{FB}=\\phi_{MS}'}</Tex> (במקרה אידיאלי)</> }}
        />
        <p className="mt-3 leading-relaxed text-slate-600">
          <b>מתח ה-flat-band</b> הוא מתח-השער שמיישר את הפסים. מעליו/מתחתיו מתחילים המשטרים. (בחלק ב׳ נראה
          שמטעני-אוקסיד מזיזים את <Tex>{'V_{FB}'}</Tex>.) הקשר הכללי: <Tex>{'-\\phi_{MS}=qV_{ox}+q\\psi_s'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
