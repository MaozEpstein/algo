import { useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import FormationCartoon from '../components/FormationCartoon'

const STEPS: { titleHe: string; bodyHe: string }[] = [
  {
    titleHe: '1 · שני חצאים נפרדים',
    bodyHe: 'בצד p רוב הנושאים הם חורים (חיוביים) ובו יונים שליליים קבועים; בצד n רוב הנושאים אלקטרונים (שליליים) ובו יונים חיוביים קבועים. כל צד ניטרלי בפני עצמו.',
  },
  {
    titleHe: '2 · דיפוזיה דרך הצומת',
    bodyHe: 'כשמחברים, יש מפל ריכוז עצום: חורים מתפזרים ימינה ל-n ואלקטרונים שמאלה ל-p — בדיוק כמו טיפת דיו במים.',
  },
  {
    titleHe: '3 · נחשפים סימומים מיוננים',
    bodyHe: 'הנושאים שחצו מתאחים סמוך לצומת ונעלמים, ומשאירים מאחור את היונים הקבועים החשופים: שליליים בצד p, חיוביים בצד n — זהו אזור המחסור (ללא נושאים חופשיים).',
  },
  {
    titleHe: '4 · נבנה שדה פנימי',
    bodyHe: 'המטען החשוף יוצר שדה חשמלי בנוי E המכוון מ-n ל-p — והוא דוחף את הנושאים בחזרה, כלומר מתנגד לדיפוזיה.',
  },
  {
    titleHe: '5 · שיווי משקל',
    bodyHe: 'כשזרם הסחיפה (מהשדה) מאזן בדיוק את זרם הדיפוזיה — הזרם נטו אפס. אזור המחסור מתייצב, ורמת פרמי $E_F$ אחידה לכל רוחב ההתקן.',
  },
]

export default function FormationTab() {
  const [step, setStep] = useState(0)
  const last = STEPS.length - 1
  const s = STEPS[step]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מושגי יסוד — שני סוגי מל״מ">
        <p className="leading-relaxed text-slate-600">
          מוליך-למחצה הופך שימושי כש<b>מסממים</b> אותו — מוסיפים אטומי-זרים שתורמים נושאי-מטען חופשיים.
          יש שני סוגים, והם אבני-הבניין של כל התקן:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
            <p className="font-bold text-sky-700">מסוג n — תורמים (Donors)</p>
            <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-slate-600">
              <li>כל אטום תורם (ריכוז <Tex>{'N_D'}</Tex>) מוסיף <b>אלקטרון</b> חופשי ונשאר יון חיובי קבוע.</li>
              <li>נושאי <b>רוב</b>: אלקטרונים, <Tex>{'n_{n0} \\approx N_D'}</Tex>.</li>
              <li>נושאי <b>מיעוט</b>: חורים, <Tex>{'p_{n0} = n_i^2 / N_D'}</Tex>.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
            <p className="font-bold text-rose-600">מסוג p — מקבלים (Acceptors)</p>
            <ul className="mt-1.5 space-y-1 text-sm leading-relaxed text-slate-600">
              <li>כל אטום מקבל (ריכוז <Tex>{'N_A'}</Tex>) "לוכד" אלקטרון ויוצר <b>חור</b>, ונשאר יון שלילי קבוע.</li>
              <li>נושאי <b>רוב</b>: חורים, <Tex>{'p_{p0} \\approx N_A'}</Tex>.</li>
              <li>נושאי <b>מיעוט</b>: אלקטרונים, <Tex>{'n_{p0} = n_i^2 / N_A'}</Tex>.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm text-slate-600">
          בשיווי משקל מתקיים תמיד <Tex>{'n\\cdot p = n_i^2'}</Tex> — לכן ככל שיש יותר נושאי רוב, יש פחות מיעוט.
        </p>
      </Panel>

      <Panel title="שני התהליכים המתחרים">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-bold text-slate-800">דיפוזיה</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              נושאים זורמים מאזור בריכוז גבוה לאזור בריכוז נמוך (מפל ריכוז).
            </p>
            <div className="mt-2 text-center"><Tex>{'J_{diff} = qD\\,\\dfrac{dn}{dx}'}</Tex></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-bold text-slate-800">סחיפה</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              נושאים נסחפים בכוח של שדה חשמלי <Tex>{'E'}</Tex>.
            </p>
            <div className="mt-2 text-center"><Tex>{'J_{drift} = q\\mu n E'}</Tex></div>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          כל סיפור הצומת הוא <b>התחרות בין השניים</b>: דיפוזיה דוחפת נושאים לחצות, השדה הבנוי דוחף אותם
          בחזרה. <b>שיווי משקל</b> = הנקודה שבה הם מתאזנים לכל סוג נושא, והזרם נטו מתאפס.
        </p>
      </Panel>

      <Panel title="איך נוצר הצומת? — צעד אחר צעד">
        <p className="leading-relaxed text-slate-600">
          עברו את חמשת השלבים וראו איך מדיפוזיה ראשונית מגיעים לאזור-מחסור, שדה בנוי, ושיווי משקל:
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <FormationCartoon stage={step} />
        </div>

        <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
          <p className="font-bold text-slate-800">{s.titleHe}</p>
          <p className="mt-1 leading-relaxed text-slate-600">
            <RichText>{s.bodyHe}</RichText>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={() => setStep(0)}
            disabled={step === 0}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 disabled:opacity-30"
          >
            איפוס
          </button>
          <button
            onClick={() => setStep((k) => Math.max(0, k - 1))}
            disabled={step === 0}
            className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-30"
          >
            → הקודם
          </button>
          <span className="font-mono text-xs tabular-nums text-slate-400">
            {step + 1}/{STEPS.length}
          </span>
          <button
            onClick={() => setStep((k) => Math.min(last, k + 1))}
            disabled={step === last}
            className="rounded-lg bg-sky-500 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-sky-600 disabled:opacity-30"
          >
            הבא ←
          </button>
        </div>
      </Panel>
    </div>
  )
}
