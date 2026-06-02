import { useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import FormationCartoon from '../components/FormationCartoon'
import CarrierProfile from '../components/CarrierProfile'

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

/**
 * Lecture 1א — the PN junction at equilibrium: the step-by-step formation
 * cartoon (diffusion → exposed ions → built-in field → equilibrium), the
 * depletion-region concepts, and the carrier-concentration profile. The
 * interactive sandbox lives in its own tab.
 */
export default function PnJunctionTab() {
  const [step, setStep] = useState(0)
  const last = STEPS.length - 1
  const s = STEPS[step]

  return (
    <div className="flex flex-col gap-5">
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

      <Panel title="אזור המחסור והשדה הבנוי — המושגים">
        <ul className="space-y-2 leading-relaxed text-slate-600">
          <li>
            <b>אזור המחסור</b> (Space-Charge Region) — הרצועה סביב הצומת שרוקנה מנושאים חופשיים. נשארו בה
            רק היונים הקבועים, ולכן יש בה מטען מרחבי <Tex>{'\\rho'}</Tex>.
          </li>
          <li>
            <b>קירוב המחסור</b> — מניחים שבתוך הרצועה אין נושאים כלל, ולכן{' '}
            <Tex>{'\\rho = +qN_D'}</Tex> בצד n ו-<Tex>{'\\rho = -qN_A'}</Tex> בצד p; מחוץ לרצועה ניטרלי
            (<Tex>{'\\rho = 0'}</Tex>). זה ההנחה שהופכת את החישוב לפשוט.
          </li>
          <li>
            <b>השדה הבנוי</b> <Tex>{'E'}</Tex> — נוצר מהמטען החשוף, מכוון מ-n ל-p (כלומר מתנגד לדיפוזיה),
            מקסימלי בצומת (<Tex>{'E_{max}'}</Tex>) ומתאפס בקצוות.
          </li>
          <li>
            <b>רוחב אזור המחסור</b> <Tex>{'d'}</Tex> — גדל עם המתח הבנוי <Tex>{'V_{bi}'}</Tex> וקטן ככל
            שהסימום כבד יותר.
          </li>
        </ul>
      </Panel>

      <Panel title="פרופיל ריכוז הנושאים לאורך הצומת">
        <p className="leading-relaxed text-slate-600">
          על ציר לוגריתמי רואים בבירור: בכל צד יש נושא <b>רוב</b> (גבוה) ונושא <b>מיעוט</b> (נמוך בכמה
          סדרי-גודל). העקומות חוצות בדיוק ב-<Tex>{'n_i'}</Tex> בצומת (לפי <Tex>{'n\\cdot p = n_i^2'}</Tex>),
          ושתיהן צונחות באזור המחסור — שם כמעט אין נושאים חופשיים.
        </p>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <CarrierProfile />
        </div>
      </Panel>
    </div>
  )
}
