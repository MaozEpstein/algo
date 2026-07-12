import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 5 · Intro — the decision problem, likelihoods, and the two errors. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="להחליט בין שתי אפשרויות">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            כאן מתחיל <b>חלק ב׳</b> של הקורס — גילוי ואמידה. השאלה הבסיסית: קיבלנו תצפית{' '}
            <span dir="ltr"><Tex>{'x'}</Tex></span>, ועלינו להכריע בין <b>שתי השערות</b>. למשל: האם המכ״ם רואה מטרה, או רק
            רעש? האם המטבע הוגן? האם הודעה ששודרה הייתה 0 או 1?
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border-s-4 border-slate-400 bg-slate-50/70 p-3">
              <b className="text-slate-700">H₀ — השערת האפס</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'x\\sim f(x;H_0)'}</Tex> — "רק רעש".</p>
            </div>
            <div className="rounded-xl border-s-4 border-emerald-500 bg-emerald-50/60 p-3">
              <b className="text-emerald-800">H₁ — ההשערה החלופית</b>
              <p className="mt-1 text-sm text-slate-600"><Tex>{'x\\sim f(x;H_1)'}</Tex> — "אות + רעש".</p>
            </div>
          </div>
          <p>
            <span dir="ltr"><Tex>{'f(x;H_i)'}</Tex></span> נקראת ה<b>נראות</b> (likelihood) — הצפיפות כפונקציה של השערה
            <b> דטרמיניסטית</b> (לא אקראית). ההכרעה מגדירה <b>אזור דחייה</b>: אם <span dir="ltr"><Tex>{'x'}</Tex></span> נופל בו — בוחרים H₁.
          </p>
        </div>
      </Panel>

      <DefinitionCard
        titleHe="שני סוגי שגיאה"
        tex="\begin{aligned} &P_{FA}=\Pr(\text{בוחרים }H_1\mid H_0)\quad(\text{אזעקת שווא, Type I}) \\ &P_{D}=\Pr(\text{בוחרים }H_1\mid H_1)=1-\beta\quad(\text{גילוי, Power}) \end{aligned}"
        meaningHe={
          'תמיד יש <b>תמורה</b> (tradeoff): אפשר להיזהר ולבחור H₁ רק כשבטוחים — אז מעט <b>אזעקות שווא</b> אבל גם ' +
          'החמצות רבות; או להיות "טריגר-קליל" — הרבה גילויים אבל גם הרבה שווא. אי אפשר לאפס את שניהם יחד.'
        }
        example={
          <p>
            גלאי עשן: רגישות גבוהה מדי → צפצופים מכל טוסט (<span dir="ltr"><Tex>{'P_{FA}'}</Tex></span> גבוה); רגישות נמוכה מדי →
            מפספס שריפה אמיתית (<span dir="ltr"><Tex>{'\\beta'}</Tex></span> גבוה).
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          <b>ניימן-פירסון</b>: מהו המבחן שממקסם את הגילוי בכפוף לאזעקת-שווא נתונה (מבחן יחס הנראות). אחר-כך{' '}
          <b>גלאים</b> קלאסיים (מסנן מותאם, גלאי אנרגיה), ולבסוף ה<b>גישה הבייסיאנית</b> — כשיש הסתברויות מוקדמות על ההשערות.
        </p>
      </Panel>
    </div>
  )
}
