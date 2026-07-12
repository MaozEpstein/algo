import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 2 · Intro — what moments are and why they summarize a distribution. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ממשתנה שלם — למספרים בודדים שמסכמים אותו">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            בשיעור הקודם תיארנו משתנה מקרי במלואו — דרך ה-CDF או הצפיפות. אבל לרוב לא צריך את כל הפירוט;
            מספיקים כמה <b>מספרים מסכמים</b>. אלה ה<b>מומנטים</b>: התוחלת אומרת <b>איפה</b> ההתפלגות ממוקמת,
            השונות אומרת <b>כמה היא מפוזרת</b>, ומומנטים גבוהים יותר מוסיפים פרטים על הצורה.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Card t="תוחלת" s="המומנט הראשון — נקודת האיזון $E[X]$." />
            <Card t="שונות ומתאם" s="המומנט השני — פיזור $\mathrm{Var}(X)$, וקשר בין משתנים $\rho$." />
            <Card t="פונקציה אופיינית" s="אורזת את כל המומנטים בבת-אחת." />
          </div>
          <p>
            הכלי המאחד הוא ה<b>פונקציה האופיינית</b> <span dir="ltr"><Tex>{'\\varphi_X(w)=E[e^{jwX}]'}</Tex></span> —
            טרנספורם שממנו נחלץ כל מומנט שנרצה, והוא ילווה אותנו לכל אורך הקורס.
          </p>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            הערה: כאן מגדירים רשמית את <span dir="ltr"><Tex>{'E[X]'}</Tex></span> ו-<span dir="ltr"><Tex>{'\\mathrm{Var}(X)'}</Tex></span>
            {' '}שהופיעו כערכי-ייחוס בטבלת ההתפלגויות ב<b>מבט-על</b>.
          </p>
        </div>
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
