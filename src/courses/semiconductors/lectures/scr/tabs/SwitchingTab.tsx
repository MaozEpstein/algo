import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 4 — turn-on / turn-off and operating states + a brief application. */
export default function SwitchingTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הדלקה (turn-on)">
        <p className="mb-2 leading-relaxed text-slate-700">כל דבר שמעלה את <Tex>{'\\alpha_1+\\alpha_2'}</Tex> ל-1 מצית את ההתקן:</p>
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>פולס שער</b> <Tex>{'I_G'}</Tex> — הדרך הנשלטת והמקובלת.</li>
          <li><b>מתח-פריצה</b> <Tex>{'V_{AK}>V_{BF}'}</Tex> — מפולת ב-<Tex>{'J_2'}</Tex> מציתה (בד״כ לא רצוי).</li>
          <li><b><Tex>{'dV/dt'}</Tex> גבוה</b> — זרם קיבולי דרך <Tex>{'J_2'}</Tex> מתפקד כזרם-שער טפילי.</li>
          <li><b>טמפרטורה / אור</b> — מעלים את זרם-הדליפה ואת ה-<Tex>{'\\alpha'}</Tex>-ים.</li>
        </ul>
      </Panel>

      <Panel title="כיבוי (turn-off) — וזרם ההחזקה">
        <p className="leading-relaxed text-slate-700">
          השער <b>אינו</b> יכול לכבות SCR קלאסי — ברגע שננעל, הוא "שכח" מהשער. כיבוי דורש שזרם-האנודה
          <b> יירד מתחת לזרם-ההחזקה</b> <Tex>{'I_H'}</Tex> (כך שהמשוב כבר אינו מקיים <Tex>{'\\alpha_1+\\alpha_2\\ge1'}</Tex>) —
          למשל ע״י הורדת המתח, ניתוק, או היפוך פולריות. זוהי תכונת ה<b>חד-יציבות (latching)</b> של ההתקן.
        </p>
      </Panel>

      <Panel title="שלושת המצבים">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-s-4 border-slate-300 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700"><b>חסימה קדמית</b> — מתח קדמי, עדיין לא הוצת.</div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700"><b>הולכה</b> — ננעל, זרם גדול במתח נמוך.</div>
          <div className="rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700"><b>חסימה הפוכה</b> — מתח הפוך, חוסם כמו דיודה.</div>
        </div>
      </Panel>

      <Panel title="יישום אופייני — מיישר/בקרת הספק">
        <p className="leading-relaxed text-slate-700">
          השימוש הקלאסי הוא <b>מיישר מבוקר ובקרת הספק</b>: בכל מחזור של מתח-הרשת מציתים את ה-SCR בזווית-פאזה
          נבחרת (<Tex>{'\\alpha'}</Tex> firing angle), והוא מוליך עד סוף החצי-מחזור (כשהזרם יורד מתחת ל-<Tex>{'I_H'}</Tex>).
          הזזת זווית-ההצתה שולטת בהספק הממוצע — הבסיס לעמעמים, בקרי-מנועים וממירי-הספק.
        </p>
      </Panel>
    </div>
  )
}
