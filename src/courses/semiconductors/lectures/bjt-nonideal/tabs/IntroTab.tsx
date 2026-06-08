import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lecture 3ג — intro: from the ideal transistor (3ב) to the real device. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהאידיאלי לאמיתי">
        <p className="leading-relaxed text-slate-700">
          בחלק ב׳ הנחנו טרנזיסטור <b>אידיאלי</b>: אזור-פעיל שטוח לגמרי (<Tex>{'I_C=\\beta I_B'}</Tex> ללא תלות ב-<Tex>{'V_{CE}'}</Tex>),
          <Tex>{'\\;\\beta'}</Tex> קבוע, ופריצה רחוקה. במכשיר <b>אמיתי</b> כל אלה נשברים — וזה מה שקובע את גבולות-השימוש שלו.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">אפקט Early</b> — האזור הפעיל אינו שטוח: <Tex>{'I_C'}</Tex> עולה מעט עם <Tex>{'V_{CE}'}</Tex> (התנגדות-מוצא סופית <Tex>{'r_o'}</Tex>).
          </div>
          <div className="rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-rose-700">פריצה</b> — ב-<Tex>{'V_{CE}'}</Tex> גבוה הצומת פורץ; <Tex>{'BV_{CEO}<BV_{CBO}'}</Tex>.
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-violet-700">β לא-קבוע</b> — נופל בזרם נמוך וגבוה (עקומת Gummel), ומוגבל ע"י צמצום-פער בפולט.
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">מודלים</b> — לתכן מעגלים: מודל אות-קטן <b>hybrid-π</b> ותדר-חיתוך <Tex>{'f_T'}</Tex>.
          </div>
        </div>
      </Panel>

      <Panel title="מה נלמד כאן">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-700">
          <li><b>אפקט Early</b> — אפנון רוחב-הבסיס, <Tex>{'V_A'}</Tex> ו-<Tex>{'r_o'}</Tex>.</li>
          <li><b>פריצה</b> — <Tex>{'BV_{CBO}'}</Tex> מול <Tex>{'BV_{CEO}'}</Tex> ומפולת.</li>
          <li><b>β לא-אידיאלי</b> ועקומת <b>Gummel</b>.</li>
          <li><b>מודל אות-קטן hybrid-π</b> — <Tex>{'g_m,r_\\pi,r_o'}</Tex>.</li>
          <li><b>תדר-חיתוך <Tex>{'f_T'}</Tex></b> ומיתוג.</li>
        </ul>
      </Panel>
    </div>
  )
}
