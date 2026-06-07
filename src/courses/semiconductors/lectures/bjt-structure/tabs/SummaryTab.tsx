import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lecture 3א — summary + pointers to 3ב / 3ג. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הרעיון המרכזי">
        <p className="leading-relaxed text-slate-700">
          טרנזיסטור דו-קוטבי הוא <b>שני צמתי-PN מצומדים</b> דרך <b>בסיס דק</b>. ב<b>פעיל-קדמי</b> (BE קדמי, CB אחורי)
          הפולט <b>מזריק</b> מיעוט, הבסיס הדק מאפשר לו <b>לחצות</b> כמעט במלואו, וה<b>קולט</b> <b>קולט</b> אותו — כך שזרם-בסיס זעיר
          שולט בזרם-קולט גדול (<Tex>{'\\beta\\gg1'}</Tex>).
        </p>
      </Panel>

      <Panel title="הנקודות לזכור">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-700">
          <li><b>מבנה:</b> פולט מסומם בכבדות · בסיס דק ומסומם קלות · קולט רחב — <Tex>{'N_E\\gg N_B>N_C'}</Tex>.</li>
          <li><b>ארבעה מצבים:</b> קטעון (מפסק פתוח), פעיל-קדמי (מגבר), רוויה (מפסק סגור), פעיל-הפוך.</li>
          <li><b>פעיל-קדמי:</b> <Tex>{'V_{BE}>0,\\;V_{BC}<0'}</Tex> — הזרקה → דיפוזיה בבסיס → קליטה.</li>
          <li><b>הזרם הוא השיפוע:</b> <Tex>{'I_C\\propto \\Delta n(0)/W_B'}</Tex>; בסיס דק → שיפוע תלול → זרם גדול.</li>
          <li><b>הגבר:</b> <Tex>{'\\alpha=b\\gamma\\approx1'}</Tex>, <Tex>{'\\beta=\\alpha/(1-\\alpha)\\gg1'}</Tex>, <Tex>{'I_E=I_C+I_B'}</Tex>.</li>
        </ul>
      </Panel>

      <Panel title="מה בהמשך">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-violet-700">חלק ב׳ · זרמים והגבר</b><br />
            גזירה כמותית של רכיבי-הזרם מהפרופילים, <Tex>{'\\gamma'}</Tex> (נצילות הזרקה), <Tex>{'b'}</Tex> (מקדם מעבר),{' '}
            <Tex>{'\\alpha,\\beta'}</Tex>, אופייני המוצא ומודל Ebers-Moll.
          </div>
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">חלק ג׳ · אפקטים לא-אידיאליים</b><br />
            אפקט Early, פריצה, <Tex>{'\\beta'}</Tex> לא-אידיאלי (עקומת Gummel), מודל אות-קטן ותדר-חיתוך <Tex>{'f_T'}</Tex>.
          </div>
        </div>
      </Panel>
    </div>
  )
}
