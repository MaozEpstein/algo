import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 12 · Intro — the linear/AR random process and its three regimes. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="השיעור המסכם — תהליכים לינאריים ואמידה לאורך זמן">
        <p className="leading-relaxed text-slate-700">
          בשיעור האחרון אנחנו לוקחים את התהליך הלינארי המרכזי — ה-<b>AR</b> — וחוקרים מתי הוא סטציונרי. משם נבנה שני
          <b> מסננים אופטימליים</b> מפורסמים: מסנן <b>וינר</b> (אצווה) ומסנן <b>קלמן</b> (רקורסיבי). שניהם אינם אלא
          ה-LMMSE של שיעור 9, מוחל לאורך זמן על תהליך WSS — כך שהשיעור מחבר את כל החצי השני של הקורס.
        </p>
      </Panel>

      <DefinitionCard
        n="משוואה 322"
        titleHe="התהליך הלינארי (AR)"
        tex="X_n=\alpha X_{n-1}+W_n,\qquad X_0\sim f_{X_0},\ W_n\ \text{i.i.d.},\ X_0\perp W_n"
        meaningHe={
          'כל דגימה היא <b>גרסה מוחלשת</b> של קודמתה (במקדם $\\alpha$) בתוספת רעש חדש. זהו תהליך <b>מרקובי</b> — ' +
          'העתיד תלוי בעבר רק דרך ההווה $X_{n-1}$.'
        }
        example={
          <p>
            אותו מבנה כמו ה-AR משיעור 11, אבל כאן מתמקדים ב<b>התנהגות לאורך זמן</b>: האם ההתפלגות מתייצבת?
          </p>
        }
      />

      <Panel title="שלושה משטרים לפי α">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border-s-4 border-rose-400 bg-rose-50/60 p-3">
            <b className="text-rose-700"><Tex>{'|\\alpha|\\ge1'}</Tex></b>
            <p className="mt-1 text-sm text-slate-600">לא סטציונרי — <span dir="ltr"><Tex>{'\\mathrm{Var}(X_n)\\to\\infty'}</Tex></span>.</p>
          </div>
          <div className="rounded-xl border-s-4 border-amber-400 bg-amber-50/60 p-3">
            <b className="text-amber-700"><Tex>{'|\\alpha|<1'}</Tex></b>
            <p className="mt-1 text-sm text-slate-600">סטציונרי <b>אסימפטוטית</b> — המומנטים מתכנסים.</p>
          </div>
          <div className="rounded-xl border-s-4 border-emerald-500 bg-emerald-50/60 p-3">
            <b className="text-emerald-700"><Tex>{'|\\alpha|<1'}</Tex> + התחלה תואמת</b>
            <p className="mt-1 text-sm text-slate-600"><b>SSS</b> מיד — <span dir="ltr"><Tex>{'X_0\\sim\\tilde X_0'}</Tex></span>.</p>
          </div>
        </div>
      </Panel>

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם ה<b>סטציונריות האסימפטוטית</b> של ה-AR (גבולות המומנטים ותנאי התחלה תואם); אחר-כך מסנן <b>וינר</b>
          (המשוואות הנורמליות); ולבסוף מסנן <b>קלמן</b> — הגרסה הרקורסיבית שסוגרת את הקורס.
        </p>
      </Panel>
    </div>
  )
}
