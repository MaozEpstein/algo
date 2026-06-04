import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import RectifyingCriterionCard from '../../../components/RectifyingCriterionCard'
import SchottkyIVCurve from '../components/SchottkyIVCurve'
import { MATERIALS, METALS } from '../../../lib/junction'

const Si = MATERIALS.Si
const W = METALS.W // moderate barrier φ_B = 0.5 eV

const TRAITS: { icon: string; titleHe: string; body: React.ReactNode; accent: string }[] = [
  {
    icon: '⚡',
    titleHe: 'התקן נושאי-רוב',
    body: <>הזרם נישא ב<b>אלקטרוני הרוב</b> שחוצים את המחסום — אין אגירת מיעוט, ולכן <b>מיתוג מהיר מאוד</b> (ללא reverse-recovery).</>,
    accent: 'border-violet-200 bg-violet-50/60',
  },
  {
    icon: '🔋',
    titleHe: 'מתח-הצתה נמוך',
    body: <>זרם הרוויה התרמיוני <Tex>{'J_{ST}'}</Tex> גדול בהרבה מזה של דיודת PN, ולכן הדיודה <b>נדלקת</b> כבר ב-<Tex>{'\\sim\\!0.2\\!-\\!0.3\\,V'}</Tex>.</>,
    accent: 'border-amber-200 bg-amber-50/60',
  },
  {
    icon: '🌡️',
    titleHe: 'דליפה אחורית גדולה',
    body: <>אותו <Tex>{'J_{ST}'}</Tex> גדול הוא גם הזרם האחורי — דליפה גבוהה יחסית לדיודת PN, ורגישות לטמפרטורה.</>,
    accent: 'border-rose-200 bg-rose-50/60',
  },
]

/**
 * Lecture 2ג — Intro: a metal touching an n-type semiconductor forms a rectifying
 * barrier set by the work-function difference. Frames the new junction type, the
 * rectifying criterion, and the headline device traits, with a live Schottky-vs-PN
 * I–V teaser showing the lower turn-on.
 */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <RectifyingCriterionCard
        framing={
          <>
            מגע מתכת–מל"מ יכול להיות <b>מיישר</b> או <b>אוהמי</b>, לפי הפרש פונקציות-העבודה. <b>השיעור הזה (2ג)</b> עוסק
            במקרה ה<b>מיישר</b> — <Tex>{'\\varphi_m>\\varphi_s'}</Tex> (דיודת שוטקי). המקרה ה<b>אוהמי</b> (<Tex>{'\\varphi_m<\\varphi_s'}</Tex>)
            הוא נושא <b>החלק הבא (2ד)</b>.
          </>
        }
      />
      <Panel title="מתכת פוגשת מוליך-למחצה">
        <p className="leading-relaxed text-slate-700">
          עד עכשיו הצומת היה בין שני חצאי מל"מ (p ו-n). דיודת <b>שוטקי</b> נוצרת ממגע <b>מתכת–מל"מ</b>: כשמתכת
          נוגעת במל"מ מסוג n, נוצר <b>מחסום</b> שגובהו נקבע מ<b>הפרש פונקציות-העבודה</b> בין השניים. התוצאה היא
          דיודה <b>מיישרת</b> — אבל מסוג שונה לגמרי מדיודת PN: הזרם נישא ב<b>נושאי רוב</b> דרך <b>פליטה תרמיונית</b>.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
            <p className="mb-1 text-xs font-semibold text-violet-700">גובה המחסום</p>
            <Tex block>{'\\varphi_B=\\varphi_m-\\chi'}</Tex>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
            <p className="mb-1 text-xs font-semibold text-violet-700">תנאי ליישור (מל"מ-n)</p>
            <Tex block>{'\\varphi_m>\\varphi_s=\\chi+\\xi'}</Tex>
          </div>
        </div>
        <dl className="mt-3 grid gap-x-6 gap-y-2 rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3 text-sm sm:grid-cols-2">
          {[
            { sym: '\\varphi_m', he: 'פונקציית העבודה של המתכת' },
            { sym: '\\chi', he: 'הזיקה האלקטרונית של המל"מ' },
            { sym: '\\varphi_s=\\chi+\\xi', he: 'פונקציית העבודה של המל"מ' },
            { sym: '\\xi=E_c-E_F', he: 'היסט הבולק' },
          ].map((d, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="shrink-0 font-semibold text-slate-700" dir="ltr"><Tex>{d.sym}</Tex></span>
              <span className="text-slate-300">—</span>
              <span className="leading-snug text-slate-600"><RichText>{d.he}</RichText></span>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="זיקה אלקטרונית — אפיניות">
        <p className="leading-relaxed text-slate-700">
          <Tex>{'\\chi'}</Tex> היא המרחק מקצה פס ההולכה <Tex>{'E_c'}</Tex> עד לרמת הוואקום — בעצם <b>כמה החומר
          "מעוניין" לקלוט אלקטרון</b>:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-3">
            <span className="text-2xl leading-none" aria-hidden>🧲</span>
            <p className="text-sm leading-relaxed text-slate-700">
              <Tex>{'\\chi'}</Tex> <b>גבוהה</b> — החומר אוחז חזק באלקטרונים ונוטה ל<b>ספוג</b> אותם (קשה להם להימלט).
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <span className="text-2xl leading-none" aria-hidden>💨</span>
            <p className="text-sm leading-relaxed text-slate-700">
              <Tex>{'\\chi'}</Tex> <b>נמוכה</b> — אחיזה חלשה, החומר נוטה ל<b>שחרר</b> אלקטרונים בקלות.
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          ה<b>הפרש בנטיות</b> בין המתכת (<Tex>{'\\varphi_m'}</Tex>) למל"מ (<Tex>{'\\varphi_s=\\chi+\\xi'}</Tex>) הוא
          שקובע אם נוצר מחסום מיישר — וכמה גבוה.
        </p>
      </Panel>

      <Panel title="למה דיודת שוטקי מיוחדת?">
        <div className="grid gap-3 sm:grid-cols-3">
          {TRAITS.map((t, i) => (
            <div key={i} className={`rounded-xl border p-4 ${t.accent}`}>
              <p className="flex items-center gap-2 font-bold text-slate-800">
                <span aria-hidden>{t.icon}</span> {t.titleHe}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="טעימה — שוטקי נדלקת מוקדם יותר">
        <p className="leading-relaxed text-slate-600">
          על ציר חצי-לוגריתמי רואים מיד את ההבדל: עקומת השוטקי (סגול) <b>מוסטת שמאלה</b> ביחס לדיודת PN (אפור
          מקווקו) — אותה צורה מעריכית, אבל <Tex>{'J_{ST}\\gg J_S'}</Tex>, ולכן הצתה במתח נמוך יותר. בלשוניות הבאות
          נבנה את זה צעד-אחר-צעד: קודם דיאגרמת הפסים, אחר-כך הזרם התרמיוני.
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">אופיין I–V · זרם–מתח</span> (חצי-לוג) — שוטקי (W/Si) מול PN
          </p>
          <SchottkyIVCurve metal={W} mat={Si} Va={0.2} mode="log" comparePN={{ Na: 1e16, Nd: 1e17 }} showTurnOn />
        </div>
      </Panel>
    </div>
  )
}
