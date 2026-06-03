import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import CircuitTab from './CircuitTab'

/**
 * Lecture 2א — Intro: from the injection story of lesson 1ב to an actual current.
 * Opens with the junction→diode framing, then the tangible "does it conduct?"
 * playground (the diode circuit + junction flow), then the result/assumptions.
 */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 to-white p-4 shadow-card">
        <p className="flex items-center gap-2 text-base font-bold text-violet-800">
          <span aria-hidden>🔀</span> מצומת PN — לדיודת PN
        </p>
        <p className="mt-1.5 leading-relaxed text-slate-700">
          בשיעור 1 הצומת היה אובייקט <b>אלקטרוסטטי</b>: מחסום, שדה, רוחב מחסור וקיבול — וזרם <b>נטו אפס</b>.
          מהרגע שממתח חיצוני <b>שובר את האיזון</b>, אותו צומת בדיוק הופך ל<b>התקן שנושא זרם א-סימטרי</b> — זוהי
          ה<b>דיודה</b>. נתחיל מלהרגיש זאת — ואז (ב<b>«מאיזון לזרם»</b>) נראה איך בדיוק זה קורה ונסמן מה נגזור.
        </p>
      </div>

      <CircuitTab />

      <Panel title="מהזרקה — לזרם">
        <p className="leading-relaxed text-slate-600">
          בחלק ב' ראינו שממתח קדמי <b>מזריק</b> נושאי מיעוט מעבר לצומת. כאן עושים את הצעד הבא: מההזרקה
          ל<b>זרם</b> — וזהו זרם הדיודה. ארבע חוליות:
        </p>
        <StepFlow
          tone="forward"
          steps={[
            {
              title: <>חוק הצומת — <b>הזרקה מעריכית</b></>,
              body: <><Tex>{'\\Delta p_n(0)=p_{n0}\\left(e^{V_A/V_T}-1\\right)'}</Tex> בקצה אזור המחסור.</>,
            },
            {
              title: <>הנושאים <b>מתפזרים ונעלמים ברקומבינציה</b></>,
              body: <>אל תוך האזור הניטרלי, על סקאלת <Tex>{'L=\\sqrt{D\\tau}'}</Tex>.</>,
            },
            {
              title: <>לקיום הפרופיל חייב לזרום <b>זרם-דיפוזיה</b></>,
              body: <>פרופורציוני ל<b>שיפוע</b> פרופיל הריכוז בקצה.</>,
            },
          ]}
          outcome={{ label: 'זרם הדיודה — גדל מעריכית', sub: <>כי ריכוז ההזרקה <Tex>{'\\propto e^{V_A/V_T}'}</Tex></> }}
        />
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'I=I_S\\left(e^{V_A/V_T}-1\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          זוהי <b>משוואת שוקלי</b>. בלשוניות הבאות נגזור אותה צעד-אחר-צעד ונראה מה קובע את זרם הרוויה{' '}
          <Tex>{'I_S'}</Tex>.
        </p>
      </Panel>

      <Panel title="הנחות הדיודה האידיאלית">
        <p className="leading-relaxed text-slate-600">
          "אידיאלית" = הגזירה נשענת על ארבע הנחות מפשטות. הסטיות מהן הן בדיוק נושא <b>הדיודה הלא-אידיאלית</b> (החלק הבא):
        </p>
        <ol className="mt-3 list-decimal space-y-2 ps-6 leading-relaxed text-slate-600 marker:font-bold marker:text-violet-500">
          <li><b>צומת חד</b> (קירוב המחסור), עם אזורי-קצה ניטרליים.</li>
          <li><b>הזרקה חלשה</b> — העודף קטן בהרבה מנושאי הרוב (<Tex>{'\\Delta p \\ll n_{n0}'}</Tex>).</li>
          <li><b>אין גנרציה/רקומבינציה באזור המחסור</b> — הזרם שם אחיד; כל הרקומבינציה מתרחשת באזורים הניטרליים.</li>
          <li>כל מפל המתח נופל על <b>אזור המחסור</b> (הבולק מוליק-כמעט) — אין התנגדות טורית.</li>
        </ol>
      </Panel>
    </div>
  )
}
