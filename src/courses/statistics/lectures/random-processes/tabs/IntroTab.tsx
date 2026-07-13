import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 10 · Intro — what a random process is: realization vs random variable. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ממשתנה מקרי לתהליך מקרי">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            משתנה מקרי הוא פונקציה ממרחב המדגם לממשיים, <span dir="ltr"><Tex>{'x:\\Omega\\to\\mathbb{R}'}</Tex></span>.
            <b> תהליך מקרי</b> דומה — רק שמוסיפים לו <b>ציר זמן</b>: לכל רגע <span dir="ltr"><Tex>{'t'}</Tex></span> יש משתנה מקרי.
          </p>
          <p>
            דוגמאות: אות תקשורת או מכ"ם, טמפרטורה יומית, אק"ג, שער מניה, מספר חבילות שמגיעות לנתב, מספר פוטונים בחיישן.
            הזמן יכול להיות <b>רציף</b> (קול, מכ"ם) או <b>בדיד</b> (דגימות במחשב — "תהליך בזמן בדיד הוא פשוט וקטור מקרי ארוך").
          </p>
        </div>
      </Panel>

      <DefinitionCard
        n="הגדרה 10.1 / 10.2"
        titleHe="תהליך מקרי"
        tex="x(t,\zeta):\mathbb{R}\times\Omega\to\mathbb{R}\qquad(\text{בזמן בדיד: } x:\mathbb{Z}\times\Omega\to\mathbb{R})"
        meaningHe={
          'תהליך מקרי הוא פונקציה של <b>שני</b> ארגומנטים: הזמן $t$ והמאורע $\\zeta$. שני הקיבועים נותנים שתי תמונות שונות ' +
          'לגמרי — וזה הלב של השיעור.'
        }
        example={
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border-s-4 border-emerald-500 bg-emerald-50/60 p-3">
              <b className="text-emerald-800">מקבעים ζ₀</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'x(t,\\zeta_0)'}</Tex> — <b>מימוש</b>: פונקציה דטרמיניסטית של הזמן.</p>
            </div>
            <div className="rounded-xl border-s-4 border-violet-500 bg-violet-50/60 p-3">
              <b className="text-violet-800">מקבעים t₀</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'X(t_0)'}</Tex> — <b>משתנה מקרי</b> (על פני האנסמבל).</p>
            </div>
          </div>
        }
      />

      <Panel title="ארבע דרכים לחשוב על תהליך">
        <ul className="list-disc space-y-1.5 pe-5 leading-relaxed text-slate-600">
          <li>פונקציה של <b>שני</b> הארגומנטים <span dir="ltr"><Tex>{'x(t,\\zeta)'}</Tex></span>.</li>
          <li>מקבעים <span dir="ltr"><Tex>{'\\zeta_0'}</Tex></span> — <b>מימוש</b> דטרמיניסטי בזמן.</li>
          <li>מקבעים <span dir="ltr"><Tex>{'t_0'}</Tex></span> — <b>משתנה מקרי</b> <span dir="ltr"><Tex>{'X(t_0)'}</Tex></span>.</li>
          <li><b>משפחה</b> של משתנים מקריים המאונדקסת ע"י הזמן.</li>
        </ul>
      </Panel>

      <DefinitionCard
        kind="property"
        titleHe="בנייה מתוך משתנים מקריים"
        tex="x(t)=A\cos(2\pi t),\qquad x(t)=A\cos(2\pi t+\Theta)"
        meaningHe={
          'דרך פשוטה לייצר תהליך: לוקחים פונקציה דטרמיניסטית ומכניסים לתוכה <b>פרמטר מקרי</b> — משרעת $A$ או פאזה $\\Theta$. ' +
          'כך כל הגרלה של $(A,\\Theta)$ נותנת מימוש אחר.'
        }
        example={
          <p>
            שילובים נפוצים: קוסינוס עם רעש <span dir="ltr"><Tex>{'x[n]=A\\cos(2\\pi f n)+w[n]'}</Tex></span>, ממוצע נע{' '}
            <span dir="ltr"><Tex>{'x[n]=\\sum_{k=0}^{K}w[n-k]'}</Tex></span>, ואוטו-רגרסיה <span dir="ltr"><Tex>{'x[n]=\\sum_{k=1}^{K}\\alpha_k x[n-k]+w[n]'}</Tex></span>.
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם <b>תהליכי i.i.d</b> (ברנולי, מונה, XOR); אחר-כך ה<b>התפלגויות הסוף-ממדיות</b> וה<b>תהליך הגאוסי</b>; ולבסוף
          <b> סטציונריות</b> — צרה (SSS) ואסימפטוטית. את המומנטים המלאים (אוטו-קורלציה, WSS) נפתח בשיעור 11.
        </p>
      </Panel>
    </div>
  )
}
