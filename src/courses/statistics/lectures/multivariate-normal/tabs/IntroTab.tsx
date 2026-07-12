import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 4 · Intro — why the multivariate normal is the central distribution. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ההתפלגות החשובה בקורס">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            עד עכשיו עבדנו בעיקר עם משתנה או שניים. עכשיו עוברים ל<b>וקטור</b> של משתנים, וההתפלגות המרכזית שם היא
            ה<b>נורמלית הרב-ממדית</b> (MVN). הקורס קורא לה "ההתפלגות החשובה ביותר", ולא בכדי:
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Card t="משפט הגבול המרכזי" s="סכומים של הרבה גורמים שואפים אליה — היא צצה בכל מקום." />
            <Card t="היחידה שנשלטת" s="ההתפלגות הרב-ממדית הרציפה היחידה שקלה לחישוב ולניתוח." />
            <Card t="קשורה ללינאריות" s="טרנספורמציה לינארית של גאוסי היא שוב גאוסי — הכל נשאר במשפחה." />
          </div>
          <p>
            כל התפלגות MVN נקבעת לגמרי משני דברים: <b>וקטור התוחלות</b> <span dir="ltr"><Tex>{'m'}</Tex></span> ו<b>מטריצת
            הקווריאנס</b> <span dir="ltr"><Tex>{'C'}</Tex></span> — ומכאן נגזרות כל התכונות היפות: שוליים גאוסיים, מותנה גאוסי,
            ואי-מתאם ששקול לאי-תלות.
          </p>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            במסלול: ההגדרה והצפיפות → התכונות (טרנספורם, הלבנה, אי-תלות) → ההתניה הגאוסית — הגשר לשיעורי האמידה בהמשך.
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
