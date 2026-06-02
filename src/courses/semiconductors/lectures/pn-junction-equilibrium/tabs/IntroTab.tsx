import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import BandDiagram from '../../../viz/BandDiagram'
import JunctionElectrostatics from '../../../viz/JunctionElectrostatics'
import GenRecombDiagram from '../components/GenRecombDiagram'
import { MATERIALS, fmtDoping, fmtVolt, junctionState } from '../../../lib/junction'

// asymmetric example for the electrostatics cascade so one-sided depletion (d_p > d_n) shows
const ES_NA = 5e15
const ES_ND = 5e16

const REVEALS: { titleHe: string; bodyHe: string }[] = [
  {
    titleHe: 'ρ — קירוב המחסור',
    bodyHe: 'מניחים שאזור המחסור "ריק" מנושאים חופשיים, ולכן המטען בו הוא רק היונים הקבועים: $-qN_A$ בצד p, $+qN_D$ בצד n. מחוץ לאזור — ניטרלי ($\\rho=0$).',
  },
  {
    titleHe: 'E — אינטגרל ראשון (גאוס)',
    bodyHe: 'אינטגרל של $\\rho$ נותן את השדה (משוואת פואסון $dE/dx = \\rho/\\varepsilon_s$). השדה משולש, עם שיא $E_{max}$ בדיוק בצומת, ומתאפס בקצות אזור המחסור.',
  },
  {
    titleHe: 'V — אינטגרל שני',
    bodyHe: 'אינטגרל נוסף ($V=-\\int E\\,dx$) נותן את הפוטנציאל: עקומה פרבולית שעולה מ-0 בצד p ל-$V_{bi}$ בצד n. השטח מתחת למשולש השדה שווה ל-$V_{bi}$.',
  },
]

/**
 * Lecture 1א — Intro / foundations: the concepts a learner needs before the
 * junction itself. Two types of semiconductor, the two competing transport
 * processes, what a band diagram is (and at equilibrium), and the depletion-
 * region electrostatics ρ→E→V with charge neutrality and the formulas.
 */
export default function IntroTab() {
  const [bandExp, setBandExp] = useState(16) // symmetric doping 10^exp cm⁻³
  const bandNa = 10 ** bandExp
  const bandNd = 10 ** bandExp
  const bandState = useMemo(() => junctionState(bandNa, bandNd, MATERIALS.Si), [bandNa, bandNd])

  const [reveal, setReveal] = useState(1)
  const esState = useMemo(() => junctionState(ES_NA, ES_ND, MATERIALS.Si), [])
  const r = REVEALS[reveal - 1]

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

      <Panel title="ריכוז אינטרינסי וטמפרטורה">
        <p className="leading-relaxed text-slate-600">
          בחומר <b>אינטרינסי</b> (טהור, ללא סימום) מתקיים <Tex>{'n = p = n_i'}</Tex>. הריכוז האינטרינסי{' '}
          <Tex>{'n_i'}</Tex> תלוי בחומר ובטמפרטורה:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'n_i = \\sqrt{N_c N_v}\\;e^{-E_g/2kT}'}</Tex>
        </div>
        <ul className="mt-3 space-y-1.5 leading-relaxed text-slate-600">
          <li>
            <b>פער אנרגיה גדול יותר</b> <Tex>{'E_g'}</Tex> ⇐ <Tex>{'n_i'}</Tex> קטן יותר. לכן{' '}
            <span dir="ltr" className="font-mono">GaAs (1.8·10⁶) &lt; Si (1.5·10¹⁰) &lt; Ge (2.4·10¹³)</span> ב-300K.
          </li>
          <li>
            <b>טמפרטורה גבוהה יותר</b> ⇐ <Tex>{'n_i'}</Tex> גדל <b>מעריכית</b> — ולכן <Tex>{'V_{bi}'}</Tex>{' '}
            <b>יורד</b> עם החום, והזרמים גדלים.
          </li>
          <li>
            חוק המכפלה <Tex>{'n\\cdot p = n_i^2'}</Tex> נובע ישירות מכאן ותקף בכל סימום (בשיווי משקל).
          </li>
        </ul>
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

      <Panel title="יחס איינשטיין — D ו-μ">
        <p className="leading-relaxed text-slate-600">
          הניידות <Tex>{'\\mu'}</Tex> (שקובעת את הסחיפה) ומקדם הדיפוזיה <Tex>{'D'}</Tex> אינם בלתי-תלויים —
          אותן התנגשויות תרמיות קובעות את שניהם, ולכן הם קשורים ב<b>יחס איינשטיין</b>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'\\frac{D}{\\mu} = \\frac{kT}{q} \\quad\\Longrightarrow\\quad D = \\frac{kT}{q}\\,\\mu'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          זה מחבר את הסחיפה והדיפוזיה לתמונה אחת, וגם יקבע בהמשך את <b>מרחק הדיפוזיה</b>{' '}
          <Tex>{'L = \\sqrt{D\\tau}'}</Tex> של נושאי המיעוט המוזרקים.
        </p>
      </Panel>

      <Panel title="מה זו דיאגרמת פסים?">
        <p className="leading-relaxed text-slate-600">
          דיאגרמת הפסים מציירת את <b>אנרגיית האלקטרון</b> כפונקציה של המיקום. ארבעה מפלסים מספרים הכול:
        </p>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-600">
          <li>
            <Tex>{'E_C'}</Tex> · <b>תחתית פס ההולכה</b> — האנרגיה המינימלית של אלקטרון חופשי.
          </li>
          <li>
            <Tex>{'E_V'}</Tex> · <b>ראש פס הערכיות</b> — מעליו "יושבים" החורים. הפער ביניהם הוא{' '}
            <b>הפער האסור</b> <Tex>{'E_g = E_C - E_V'}</Tex> (ב-Si כ-<Tex>{'1.12\\,eV'}</Tex>).
          </li>
          <li>
            <Tex>{'E_i'}</Tex> · <b>רמת פרמי אינטרינסית</b> — בערך באמצע הפער; סמן-ייחוס.
          </li>
          <li>
            <Tex>{'E_F'}</Tex> · <b>רמת פרמי</b> — ה"מפלס" שקובע אכלוס: ככל ש-<Tex>{'E_F'}</Tex> קרובה
            ל-<Tex>{'E_C'}</Tex> יש יותר אלקטרונים (חומר n), וקרובה ל-<Tex>{'E_V'}</Tex> — יותר חורים (חומר p).
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-slate-600">
          הקשר הכמותי (יחס בולצמן) — ריכוז הנושאים נקבע ממרחק <Tex>{'E_F'}</Tex> מ-<Tex>{'E_i'}</Tex>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'n = n_i\\,e^{(E_F - E_i)/kT}, \\qquad p = n_i\\,e^{(E_i - E_F)/kT}'}</Tex>
        </div>
      </Panel>

      <Panel title="דיאגרמת הפסים בשיווי משקל">
        <p className="leading-relaxed text-slate-600">
          בשיווי משקל <b>רמת פרמי</b> <Tex>{'E_F'}</Tex> היא <b>קו אחיד</b> לכל רוחב ההתקן — זו ממש החתימה
          של שיווי המשקל.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          הפסים <Tex>{'E_C'}</Tex> ו-<Tex>{'E_V'}</Tex> <b>מתכופפים</b> כלפי מטה במעבר מ-p ל-n, וההפרש הכולל
          הוא בדיוק <Tex>{'qV_{bi}'}</Tex>. ככל שהסימום כבד יותר — הכיפוף גדול יותר.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3">
          <BandDiagram state={bandState} Na={bandNa} Nd={bandNd} mat={MATERIALS.Si} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <Slider
            label={<>סימום (סימטרי) <Tex>{'N_A = N_D'}</Tex></>}
            value={bandExp}
            min={14}
            max={19}
            step={1}
            onChange={setBandExp}
            display={<Tex>{`${fmtDoping(bandNa)}\\,\\mathrm{cm^{-3}}`}</Tex>}
          />
          <span className="rounded-xl bg-sky-50 px-4 py-2 text-center text-sky-700">
            <span className="text-xs">מתח בנוי</span>
            <span className="block font-mono text-lg font-bold">{fmtVolt(bandState.Vbi)}</span>
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'V_{bi} = \\frac{kT}{q}\\,\\ln\\!\\left(\\frac{N_A N_D}{n_i^2}\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          הסימום החשמלי (<Tex>{'kT/q \\approx 25.85\\,mV'}</Tex> ב-300K) קובע סקאלה לוגריתמית — לכן הכפלת
          הסימום פי 10 מוסיפה ל-<Tex>{'V_{bi}'}</Tex> רק <Tex>{'\\sim 60\\,mV'}</Tex>.
        </p>
      </Panel>

      <Panel title="גנרציה ורקומבינציה">
        <p className="leading-relaxed text-slate-600">
          נושאים לא רק זזים (דיפוזיה/סחיפה) — הם גם <b>נוצרים</b> ו<b>נעלמים</b>:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
            <p className="font-bold text-emerald-700">גנרציה (Generation)</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              אלקטרון מקבל אנרגיה (חום או אור) וקופץ מפס הערכיות לפס ההולכה — נוצר <b>זוג</b>{' '}
              אלקטרון–חור. קצב <Tex>{'G'}</Tex>.
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
            <p className="font-bold text-rose-600">רקומבינציה (Recombination)</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              אלקטרון "נופל" חזרה ומאחה עם חור — הזוג <b>נעלם</b>, ואנרגיה משתחררת (אור/חום). קצב{' '}
              <Tex>{'R'}</Tex>.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <GenRecombDiagram />
        </div>

        <p className="mt-3 leading-relaxed text-slate-600">
          שני מנגנוני רקומבינציה עיקריים: <b>ישירה (פס-לפס)</b> — שולטת בחומרים בעלי פער ישיר (כמו GaAs;
          זה ה-LED!), ו<b>SRH דרך מלכודת</b> — שולטת בצורן (Si) דרך רמת-פגם <Tex>{'E_t'}</Tex> בפער.
        </p>
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-center text-sm text-slate-600">
          בשיווי משקל <Tex>{'G = R'}</Tex> וזה בדיוק מה ששומר על <Tex>{'n\\cdot p = n_i^2'}</Tex>.
        </p>

        <p className="mt-3 leading-relaxed text-slate-600">
          לנושא מיעוט עודף יש <b>זמן חיים</b> <Tex>{'\\tau'}</Tex> (הזמן הממוצע עד רקומבינציה). בזמן הזה הוא
          מספיק לעבור <b>מרחק דיפוזיה</b>:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'L = \\sqrt{D\\,\\tau} \\qquad \\left(L_n=\\sqrt{D_n\\tau_n},\\;\\; L_p=\\sqrt{D_p\\tau_p}\\right)'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          <Tex>{'L'}</Tex> הוא גודל-מפתח לדיודה: הוא קובע עד כמה עמוק נושאי המיעוט המוזרקים חודרים לפני
          שהם נעלמים — ומכאן את זרם הדיודה (בחלק ב׳).
        </p>
      </Panel>

      <Panel title="הזרקה חלשה והזרקה חזקה">
        <p className="leading-relaxed text-slate-600">
          <b>הזרקה</b> (Injection) = הוספת נושאים <b>מעבר</b> לשיווי המשקל (למשל ע״י מתח קדמי או הארה).
          מסמנים את העודף <Tex>{'\\Delta n'}</Tex>, <Tex>{'\\Delta p'}</Tex>. השאלה היא כמה גדול העודף ביחס
          ל<b>נושאי הרוב</b>:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-4">
            <p className="font-bold text-sky-700">הזרקה חלשה (Low-level)</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              העודף קטן בהרבה מריכוז נושאי הרוב, למשל בצד n: <Tex>{'\\Delta p \\ll n_{n0}'}</Tex>. ריכוז
              הרוב כמעט לא משתנה — וזו ההנחה שמאחורי כל ניתוח הדיודה הסטנדרטי (משוואת שוקלי).
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <p className="font-bold text-amber-700">הזרקה חזקה (High-level)</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              העודף בסדר-גודל של הסימום או יותר: <Tex>{'\\Delta p \\gtrsim n_{n0}'}</Tex>. גם ריכוז הרוב
              משתנה, ההנחות הפשוטות נשברות, והזרם גדל לאט יותר (כ-<Tex>{'e^{V/2V_T}'}</Tex>).
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          לאורך הקורס נניח <b>הזרקה חלשה</b> אלא אם צוין אחרת — זה מה שמשאיר את המשוואות לינאריות ופתירות.
        </p>
      </Panel>

      <Panel title="אלקטרוסטטיקה: ρ → E → V">
        <p className="leading-relaxed text-slate-600">
          כל האלקטרוסטטיקה של הצומת היא <b>אינטגרל כפול</b>: מצפיפות המטען <Tex>{'\\rho'}</Tex> מקבלים את
          השדה <Tex>{'E'}</Tex>, וממנו את הפוטנציאל <Tex>{'V'}</Tex>. עברו את שלושת השלבים:
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <JunctionElectrostatics
            dn={esState.dn}
            dp={esState.dp}
            Emax={esState.Emax}
            Vbi={esState.Vbi}
            Na={ES_NA}
            Nd={ES_ND}
            reveal={reveal}
          />
        </div>

        <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <p className="font-bold text-slate-800">{r.titleHe}</p>
          <p className="mt-1 leading-relaxed text-slate-600">
            <RichText>{r.bodyHe}</RichText>
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={() => setReveal(1)} disabled={reveal === 1} className="rounded-lg border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-30">
            → הקודם
          </button>
          <span className="font-mono text-xs tabular-nums text-slate-400">{reveal}/3</span>
          <button onClick={() => setReveal((k) => Math.min(3, k + 1))} disabled={reveal === 3} className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white shadow transition hover:bg-amber-600 disabled:opacity-30">
            הבא ←
          </button>
        </div>
      </Panel>

      <Panel title="נייטרליות מטען והנוסחאות">
        <p className="leading-relaxed text-slate-600">
          המטען החיובי הכולל בצד n שווה למטען השלילי בצד p (ההתקן ניטרלי), ולכן:
        </p>
        <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
          <Tex block>{'N_A\\,d_p = N_D\\,d_n'}</Tex>
        </div>
        <p className="mt-2 leading-relaxed text-slate-600">
          מכאן רוחב אזור המחסור והשדה המרבי (ב-<Tex>{'V_A=0'}</Tex>):
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <Tex block>{'d = \\sqrt{\\frac{2\\varepsilon_s}{q}\\,V_{bi}\\,\\frac{N_A+N_D}{N_A N_D}}'}</Tex>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center">
            <Tex block>{'E_{max} = \\frac{2V_{bi}}{d}'}</Tex>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          תובנה: בצומת <b>חד-צדדי</b> (צד אחד מסומם הרבה יותר) כמעט כל אזור המחסור נמצא ב<b>צד המסומם
          פחות</b> — בדיוק כפי שרואים פה (<Tex>{'d_p > d_n'}</Tex>).
        </p>
      </Panel>
    </div>
  )
}
