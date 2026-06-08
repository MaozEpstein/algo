import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import HybridPiModel from '../components/HybridPiModel'
import GainExplorerCE from '../components/GainExplorerCE'

/** One small-signal parameter: its formula (KaTeX) and where it comes from. */
function ParamCard({ sym, he, cls }: { sym: string; he: string; cls: string }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${cls}`}>
      <div className="text-base" dir="ltr"><Tex>{sym}</Tex></div>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{he}</p>
    </div>
  )
}

/** Lecture 3ג — the small-signal hybrid-π model. */
export default function HybridPiTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מודל אות-קטן — hybrid-π">
        <p className="leading-relaxed text-slate-700">
          לשימוש כ<b>מגבר</b>, מחליפים את המכשיר סביב נקודת-העבודה במעגל-שקול ליניארי: <Tex>{'r_\\pi'}</Tex> בכניסה (B-E),
          ומקור-זרם תלוי <Tex>{'g_m v_{be}'}</Tex> במקביל ל-<Tex>{'r_o'}</Tex> במוצא (C-E). גררו את נקודת-העבודה:
        </p>
        <div className="mt-3">
          <HybridPiModel />
        </div>
      </Panel>

      <Panel title="מאיפה הפרמטרים באים">
        <div className="grid gap-3 sm:grid-cols-3">
          <ParamCard sym="g_m=\dfrac{\partial I_C}{\partial V_{BE}}=\dfrac{I_C}{V_T}" he="גזירת האקספוננט של הזרם — לכן המוליכות פרופורציונית לזרם-העבודה." cls="border-emerald-200 bg-emerald-50/50" />
          <ParamCard sym="r_\pi=\dfrac{\beta}{g_m}=\dfrac{\beta V_T}{I_C}" he="התנגדות-הכניסה הנראית מהבסיס — אות-המתח נופל עליה." cls="border-blue-200 bg-blue-50/50" />
          <ParamCard sym="r_o=\dfrac{V_A}{I_C}" he="התנגדות-המוצא — מגיעה ישירות מאפקט Early." cls="border-violet-200 bg-violet-50/50" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          (קיים גם מודל <Tex>{'T'}</Tex> שקול לחלוטין, עם <Tex>{'r_e=V_T/I_E'}</Tex> במקום <Tex>{'r_\\pi'}</Tex>.)
        </p>
      </Panel>

      <Panel title="למה זה חשוב — הגבר-המתח של פולט-משותף">
        <p className="mb-1 leading-relaxed text-slate-700">
          זו מטרת המודל: מקור-הזרם <Tex>{'g_m v_{be}'}</Tex> זורם דרך העומס <Tex>{'(r_o\\parallel R_C)'}</Tex> ויוצר אות-מתח גדול במוצא —
          הגבר-המתח הוא <Tex>{'A_v=-g_m(r_o\\parallel R_C)'}</Tex>. גררו את נקודת-העבודה ואת העומס:
        </p>
        <div className="mt-3">
          <GainExplorerCE />
        </div>
      </Panel>
    </div>
  )
}
