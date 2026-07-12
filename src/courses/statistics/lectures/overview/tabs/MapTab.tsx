import Panel from '../../../components/Panel'
import CourseMap from '../components/CourseMap'

/** Overview · Map — the 3-part course map, a topic tracker for the whole course. */
export default function MapTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מפת הקורס — שלושה חלקים שנבנים זה על זה">
        <p className="leading-relaxed text-slate-700">
          הקורס אינו רשימת נושאים מנותקים אלא <b>מגדל אחד</b>: כל נושא נשען על הקודמים. לחצו על{' '}
          <b>"בנה את ההבנה"</b> כדי לראות איך התמונה נבנית חלק-אחר-חלק — מהיסודות (משתנים מקריים ומומנטים),
          דרך גילוי ואמידה, ועד תהליכים מקריים. <b>נושא שכבר נלמד</b> צבוע ולחיץ ומקפיץ ישר לשיעור; השאר
          מסומנים "בקרוב" ויידלקו אוטומטית כשייבנו.
        </p>
        <CourseMap />
      </Panel>

      <Panel title="שלושת החלקים">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-s-4 border-emerald-500 bg-emerald-50/60 p-3 leading-relaxed">
            <b className="text-emerald-800">א׳ · משתנים מקריים ווקטורים</b>
            <p className="mt-1 text-sm text-slate-600">
              שפת הבסיס: משתנה מקרי, מומנטים (תוחלת/שונות/פונקציה אופיינית), פונקציות של משתנים, והנורמלי
              הרב-ממדי — הכלי המרכזי לכל ההמשך.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-indigo-500 bg-indigo-50/60 p-3 leading-relaxed">
            <b className="text-indigo-800">ב׳ · גילוי ואמידה</b>
            <p className="mt-1 text-sm text-slate-600">
              מה עושים עם מדידות: החלטה בין השערות, ואמידת פרמטרים — נראות מרבית, ריבועים פחותים, והגישה
              הבייסיאנית (MMSE) הקלאסית והלינארית.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-amber-500 bg-amber-50/60 p-3 leading-relaxed">
            <b className="text-amber-800">ג׳ · תהליכים מקריים</b>
            <p className="mt-1 text-sm text-slate-600">
              אקראיות לאורך זמן: הגדרת תהליך מקרי, המומנטים שלו (מתאם עצמי וסטציונריות), ודוגמאות —
              תהליכים לינאריים ורעש.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
