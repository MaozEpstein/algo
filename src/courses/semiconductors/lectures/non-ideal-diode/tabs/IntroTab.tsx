import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import NonIdealIVCurve from '../components/NonIdealIVCurve'
import { MATERIALS } from '../../../lib/junction'

const Si = MATERIALS.Si
const NA = 1e16
const ND = 1e17

const DEVIATIONS: { icon: string; titleHe: string; body: React.ReactNode; accent: string }[] = [
  {
    icon: '♻️',
    titleHe: 'רקומבינציה (n→2) בקדמי נמוך',
    body: <>רקומבינציה דרך מלכודות <b>בתוך אזור המחסור</b> מוסיפה זרם מעריכי ב-<Tex>{'V_A/2V_T'}</Tex> — שיפוע חצי משל הדיפוזיה.</>,
    accent: 'border-emerald-200 bg-emerald-50/50',
  },
  {
    icon: '🌊',
    titleHe: 'הזרקה חזקה (n→2) בקדמי גבוה',
    body: <>כשהעודף המוזרק מתקרב לריכוז נושאי הרוב, קירוב ההזרקה-החלשה נשבר והשיפוע שב ל-<Tex>{'n\\approx2'}</Tex>.</>,
    accent: 'border-sky-200 bg-sky-50/50',
  },
  {
    icon: '🧱',
    titleHe: 'התנגדות טורית — ברך בזרם גבוה',
    body: <>בזרם גבוה חלק מהמתח נופל על הבולק והמגעים (<Tex>{'R_S'}</Tex>), והעקומה <b>מתכופפת</b> ומתיישרת.</>,
    accent: 'border-violet-200 bg-violet-50/50',
  },
  {
    icon: '📈',
    titleHe: 'הזרם האחורי אינו רווי',
    body: <>גנרציה תרמית באזור המחסור נותנת זרם <Tex>{'\\propto W'}</Tex> שגדל עם המתח — לא הקו השטוח <Tex>{'-J_S'}</Tex>.</>,
    accent: 'border-rose-200 bg-rose-50/50',
  },
]

/**
 * Lecture 2ב — Intro: the ideal Shockley line is only a baseline; a real diode
 * deviates from it in four concrete ways. A live ideal-vs-real semilog teaser
 * sets up the rest of the lecture, and the unifying ideality-factor model is named.
 */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 to-white p-4 shadow-card">
        <p className="flex items-center gap-2 text-base font-bold text-violet-800">
          <span aria-hidden>🔬</span> מהאידיאלי — למציאות
        </p>
        <p className="mt-1.5 leading-relaxed text-slate-700">
          ב-2א גזרנו את הקו המעריכי ה<b>נקי</b> <Tex>{'I=I_S(e^{V_A/V_T}-1)'}</Tex> תחת <b>ארבע הנחות</b>. דיודה
          אמיתית מצייתת לו רק <b>חלקית</b>: כשמשחררים את ההנחות, צצות <b>ארבע סטיות</b> אופייניות. כולן נאספות
          למודל-על אחד — <b>מקדם אי-אידיאליות</b> <Tex>{'n'}</Tex>:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'I=I_S\\left(e^{V_A/nV_T}-1\\right),\\qquad 1\\le n\\le 2'}</Tex>
        </div>
      </div>

      <Panel title="אידיאלי מול ממשי — מבט-על">
        <p className="leading-relaxed text-slate-600">
          על ציר חצי-לוגריתמי, הקו האידיאלי (מקווקו, אפור) הוא <b>ישר אחד</b> בשיפוע <Tex>{'n=1'}</Tex>. העקומה
          הממשית (סגול) <b>נשברת</b>: שיפוע <Tex>{'n\\approx2'}</Tex> בתחתית (רקומבינציה), <Tex>{'n\\approx1'}</Tex>{' '}
          באמצע (דיפוזיה), ו<b>ברך</b> שטוחה למעלה (התנגדות טורית).
        </p>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">אופיין חצי-לוגריתמי — אידיאלי (מקווקו) מול ממשי (סגול)</p>
          <NonIdealIVCurve Na={NA} Nd={ND} mat={Si} Vj={0.45} tau0={1e-7} rs={0.6} mode="log" showIdeal regions curves={['tot']} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          בלשוניות הבאות נפרק כל סטייה לחוד — ובלשונית <b>«התמונה המלאה»</b> נחבר הכול חזרה ונראה איך מקדם{' '}
          <Tex>{'n'}</Tex> ה<b>נמדד</b> מתגלגל בין 1 ל-2 לאורך העקומה.
        </p>
      </Panel>

      <Panel title="ארבע הסטיות מהאידיאלי">
        <div className="grid gap-3 sm:grid-cols-2">
          {DEVIATIONS.map((d) => (
            <div key={d.titleHe} className={`rounded-xl border p-4 ${d.accent}`}>
              <p className="flex items-center gap-2 font-bold text-slate-800">
                <span aria-hidden>{d.icon}</span> {d.titleHe}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
