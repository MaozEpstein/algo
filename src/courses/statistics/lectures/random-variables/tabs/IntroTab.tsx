import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 1 · Intro — why this course is a language, and the probability triple. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="למה הקורס הזה הוא בעצם שפה חדשה">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            רוב מה שנמדוד בהנדסה הוא <b>לא ודאי</b>: אות דיבור שנשמע קצת אחר בכל פעם, רעש תרמי במכשיר,
            הד מכ״ם שאולי מסתיר מטרה, זמן המתנה במוקד, שער מניה. כדי לדבר על אי-ודאות במדויק צריך
            <b> אוצר מילים</b> — וזה בדיוק מה שנלמד כאן.
          </p>
          <p>
            לכן השיעורים הראשונים הם <b>הגדרות</b>. כל מושג חדש נבנה מאותה תבנית קבועה: הנוסחה
            הפורמלית, אחר-כך <b>מה זה אומר במילים</b>, ומיד <b>דוגמה על מספרים</b>. מי שרוצה לצלול —
            הגזירות המלאות ממתינות מאחורי כפתורי <span className="font-semibold text-emerald-700">📐 הוכחה</span>,
            כדי שהעמוד הראשי יישאר קריא.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Axis title="בדיד או רציף" body="מספר בּדוד (הצבעה, ספירה) מול גודל על רצף (מתח, זמן)." />
            <Axis title="תדירותי או בייסיאני" body="הרבה ניסויים חוזרים מול ידע מוקדם (prior) על הגודל." />
            <Axis title="סקלר, וקטור או סדרה" body="מספר יחיד, כמה מספרים יחד, או תהליך לאורך זמן." />
          </div>
          <p className="text-sm text-slate-500">
            המשימות שנרצה לבצע עם השפה הזו: חיזוי, אמידה, גילוי, ניקוי-רעש וקיבוץ (clustering).
          </p>
        </div>
      </Panel>

      <DefinitionCard
        n="1.1"
        titleHe="מרחב הסתברות"
        tex="(\Omega,\;\mathcal{F},\;\Pr)"
        meaningHe={
          'כל מודל הסתברותי נשען על שלושה רכיבים: $\\Omega$ — מרחב המדגם (כל התוצאות האפשריות); ' +
          '$\\mathcal{F}$ — מרחב המאורעות (אוספי תוצאות שאפשר לשאול עליהם "האם קרה?"); ' +
          'ו-$\\Pr(A)$ — פונקציה שנותנת לכל מאורע $A$ הסתברות.'
        }
        example={
          <div className="space-y-1.5">
            <p>
              קוביית משחק: <span dir="ltr"><Tex>{'\\Omega=\\{1,2,3,4,5,6\\}'}</Tex></span>. מאורע לדוגמה — "יצא זוגי":{' '}
              <span dir="ltr"><Tex>{'A=\\{2,4,6\\}'}</Tex></span>, וההסתברות שלו{' '}
              <span dir="ltr"><Tex>{'\\Pr(A)=\\tfrac{3}{6}=\\tfrac12'}</Tex></span>.
            </p>
          </div>
        }
      />

      <Panel title="שלוש הדרישות מ-Pr (האקסיומות)">
        <ol className="list-decimal space-y-2 ps-6 leading-relaxed text-slate-700">
          <li>
            אי-שליליות: <span dir="ltr"><Tex>{'\\Pr(A)\\ge 0'}</Tex></span> לכל מאורע.
          </li>
          <li>
            נרמול: <span dir="ltr"><Tex>{'\\Pr(\\Omega)=1'}</Tex></span> — משהו מהמרחב בוודאות יקרה.
          </li>
          <li>
            חיבוריות למאורעות זרים: אם <span dir="ltr"><Tex>{'A_i'}</Tex></span> זרים זה לזה, אז{' '}
            <span dir="ltr"><Tex>{'\\Pr\\!\\left(\\bigcup_i A_i\\right)=\\sum_i \\Pr(A_i)'}</Tex></span>.
          </li>
        </ol>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          מכאן ואילך כמעט תמיד נעבוד עם <b>משתנה מקרי</b> — פונקציה שממירה תוצאה מ-<span dir="ltr"><Tex>{'\\Omega'}</Tex></span>{' '}
          למספר — במקום עם המרחב <span dir="ltr"><Tex>{'\\Omega'}</Tex></span> עצמו. זה הנושא של הלשונית הבאה.
        </p>
      </Panel>
    </div>
  )
}

function Axis({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
      <div className="text-sm font-bold text-slate-700">{title}</div>
      <div className="mt-0.5 text-sm leading-snug text-slate-500">{body}</div>
    </div>
  )
}
