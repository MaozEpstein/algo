import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 7 · Intro — the linear model and the least-squares objective. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="להתאים מודל לינארי לנתונים">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            הרבה בעיות אמידה הן <b>לינאריות</b>: יש תצפיות <span dir="ltr"><Tex>{'y'}</Tex></span>, מטריצת תכנון ידועה{' '}
            <span dir="ltr"><Tex>{'H'}</Tex></span>, ואנחנו מחפשים פרמטרים <span dir="ltr"><Tex>{'\\theta'}</Tex></span> שמתאימים אותם — כמו התאמת קו או עקומה.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Card t="ממוצע" s="$y_i=\theta+n_i$, $H=[1,\dots,1]^\top$." />
            <Card t="התאמת קו" s="$y_i=\theta_0+\theta_1 x_i+n_i$." />
            <Card t="פולינום" s="$y_i=\theta_0+\theta_1 x_i+\theta_2 x_i^2+\dots$" />
          </div>
        </div>
      </Panel>

      <DefinitionCard
        titleHe="המודל הלינארי ומטרת הריבועים הפחותים"
        tex="y=H\theta+n,\qquad \hat\theta_{LS}=\arg\min_\theta\ \|y-H\theta\|^2"
        meaningHe={
          'מחפשים את $\\theta$ שמקטין את <b>סכום ריבועי השאריות</b> — כמה רחוקות התחזיות $H\\theta$ מהתצפיות $y$. ' +
          'זהו בדיוק המקרה של <b>אמד נראות מרבית עם רעש גאוסי</b>: מזעור $\\|y-H\\theta\\|^2$ נובע מה-log-נראות השלילית של $y\\sim N(H\\theta,\\sigma^2 I)$.'
        }
        example={
          <p>
            להתאים קו <span dir="ltr"><Tex>{'\\hat y=\\theta_0+\\theta_1 x'}</Tex></span> לענן נקודות — זו רגרסיה לינארית, המקרה הפשוט של LS.
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם <b>הפתרון</b> (המשוואות הנורמליות והפסאודו-הופכי); אחר-כך <b>ביצועים ורגולריזציה</b> (שונות, ridge);
          ולבסוף <b>ריבועים חסינים</b> — מה עושים כשהרעש אינו גאוסי ויש חריגים.
        </p>
      </Panel>
    </div>
  )
}

function Card({ t, s }: { t: string; s: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
      <div className="text-sm font-bold text-slate-700">{t}</div>
      <div className="mt-0.5 text-sm leading-snug text-slate-500">
        {s.split(/\$([^$]+)\$/).map((seg, i) => (i % 2 === 1 ? <Tex key={i}>{seg}</Tex> : <span key={i}>{seg}</span>))}
      </div>
    </div>
  )
}
