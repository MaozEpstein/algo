import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 3 · Intro — the core question: what is the distribution of Y=g(X)? */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="השאלה של השיעור">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            נתון משתנה מקרי <span dir="ltr"><Tex>{'X'}</Tex></span> עם צפיפות ידועה, ואנחנו מפעילים עליו פונקציה:{' '}
            <span dir="ltr"><Tex>{'Y=g(X)'}</Tex></span>. השאלה המרכזית של הפרק: <b>מהי ההתפלגות של <Tex>{'Y'}</Tex>?</b> זה קורה כל
            הזמן — כשמעבירים אות דרך מערכת, מרבעים, לוקחים ערך מוחלט, או ממירים יחידות.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Card t="פונקציה הפיכה" s="שינוי משתנה יחיד — הצפיפות נמתחת/נדחסת לפי $|g'|$." />
            <Card t="פונקציה לא-הפיכה" s="כמה $x$-ים נופלים על אותו $y$ — סוכמים על השורשים." />
            <Card t="מספר משתנים" s="אותו רעיון עם היעקוביאן $|\det J|$." />
            <Card t="תוחלת ודגימה" s="לחשב $E[g(X)]$ בלי $f_Y$, ולייצר דגימות מכל התפלגות." />
          </div>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            הערה: במקרה ה<b>בדיד</b> זה קל (פשוט אוספים הסתברויות של כל ה-<Tex>{'x'}</Tex>-ים שנותנים אותו <Tex>{'y'}</Tex>); לכן נתמקד
            במקרה ה<b>רציף</b>, שם צריך את נוסחת שינוי המשתנה.
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
