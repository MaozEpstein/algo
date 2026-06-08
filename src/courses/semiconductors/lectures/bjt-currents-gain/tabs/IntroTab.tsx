import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lecture 3ב — intro: from the qualitative picture (3א) to the quantitative gain. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהאיכותי לכמותי">
        <p className="leading-relaxed text-slate-700">
          בחלק א׳ ראינו <b>איכותית</b> מדוע הטרנזיסטור מגביר: הפולט <b>מזריק</b>, הבסיס הדק מאפשר למטען <b>לחצות</b>,
          והקולט <b>קולט</b>. כעת נ<b>כמת</b> את זה — נגדיר את שני המקדמים שקובעים את ההגבר, ונחשב את <Tex>{'\\alpha'}</Tex> ו-<Tex>{'\\beta'}</Tex>.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">נצילות ההזרקה <Tex>{'\\gamma'}</Tex></b> — איזה חלק מזרם-הפולט הוא הזרקה <b>מועילה</b> (אלקטרונים), ולא הזרקה-נגדית של חורים. תלוי ביחס-הסימום <Tex>{'N_E/N_B'}</Tex>.
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-violet-700">מקדם המעבר <Tex>{'b'}</Tex></b> — איזה חלק מהמטען המוזרק <b>שורד</b> את הדיפוזיה לרוחב הבסיס ומגיע לקולט. תלוי ביחס <Tex>{'W_B/L_B'}</Tex>.
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-emerald-50/70 px-3 py-2 text-sm leading-relaxed text-slate-700">
          מכפלתם נותנת את הגבר <b>הבסיס-המשותף</b> <Tex>{'\\alpha=\\gamma b\\approx1'}</Tex>, וממנו את הגבר <b>הפולט-המשותף</b>{' '}
          <Tex>{'\\beta=\\dfrac{\\alpha}{1-\\alpha}\\gg1'}</Tex> — לב ההגבר.
        </p>
      </Panel>

      <Panel title="מה נלמד כאן">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-700">
          <li><b>רכיבי-הזרם</b> — פירוק <Tex>{'I_E,I_B,I_C'}</Tex> לרכיביהם (<Tex>{'I_{nE},I_{pE},I_R'}</Tex>).</li>
          <li><b><Tex>{'\\gamma'}</Tex> ו-<Tex>{'b'}</Tex></b> — שני המקדמים, אינטראקטיבית.</li>
          <li><b>הגבר <Tex>{'\\alpha'}</Tex> ו-<Tex>{'\\beta'}</Tex></b> — וההתפוצצות של <Tex>{'\\beta'}</Tex> כש-<Tex>{'\\alpha\\to1'}</Tex>.</li>
          <li><b>אופייני המוצא</b> <Tex>{'I_C(V_{CE})'}</Tex> — משפחת-העקומות.</li>
          <li><b>מודל Ebers-Moll</b> — שתי דיודות שמתארות הכול.</li>
        </ul>
      </Panel>
    </div>
  )
}
