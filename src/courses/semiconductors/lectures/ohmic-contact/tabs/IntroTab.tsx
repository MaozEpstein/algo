import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import RectifyingCriterionCard from '../../../components/RectifyingCriterionCard'
import OhmicVsRectifyingIV from '../components/OhmicVsRectifyingIV'

const ROUTES: { icon: string; titleHe: string; body: React.ReactNode; accent: string }[] = [
  {
    icon: '⬇️',
    titleHe: 'מחסום נמוך / צבירה',
    body: <>כש-<Tex>{'\\varphi_m<\\varphi_s'}</Tex> אין מחסום לאלקטרונים — הפסים מתכופפים <b>כלפי מטה</b> ונוצרת שכבת צבירה. נדיר על Si (קיבוע-פרמי).</>,
    accent: 'border-emerald-200 bg-emerald-50/60',
  },
  {
    icon: '🚇',
    titleHe: 'מנהור (סימום כבד) — המעשי',
    body: <>משאירים מחסום, אבל מסממים <b>n⁺</b> כך שהמחסום נעשה <b>דק מאוד</b> והאלקטרונים <b>מנהרים</b> דרכו — התנגדות נמוכה.</>,
    accent: 'border-violet-200 bg-violet-50/60',
  },
]

/**
 * Lecture 2ד — Intro: not every metal–semiconductor contact rectifies. The two
 * routes to an ohmic (linear, low-resistance) contact, why we need them (connect
 * devices without a parasitic diode), and an ohmic-vs-rectifying I–V teaser.
 */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <RectifyingCriterionCard
        framing={
          <>
            ב<b>חלק הקודם (2ג)</b> ראינו את המגע ה<b>מיישר</b> (שוטקי) — <Tex>{'\\varphi_m>\\varphi_s'}</Tex>. <b>החלק הזה (2ד)</b>
            עוסק בצד השני: המגע ה<b>אוהמי</b> — כש-<Tex>{'\\varphi_m<\\varphi_s'}</Tex> (צבירה), או כשמסממים כבד והאלקטרונים <b>מנהרים</b>.
          </>
        }
      />
      <Panel title="לא כל מגע מתכת–מוליך-למחצה מיישר">
        <p className="leading-relaxed text-slate-700">
          ב-2ג ראינו את המגע ה<b>מיישר</b> (שוטקי). אבל לחבר התקן למעגל צריך מגעים ש<b>לא</b> מתנהגים כדיודה — אחרת
          לכל רכיב הייתה <b>דיודה טפילית</b> בכל הדק. <b>מגע אוהמי</b> הוא מגע מתכת–מל"מ <b>לא-מיישר</b>: אופיין
          <b> ליניארי</b> (<Tex>{'V=I\\rho_c'}</Tex>, סימטרי) והתנגדות נמוכה. יש לו <b>שני מסלולים</b>:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {ROUTES.map((r, i) => (
            <div key={i} className={`rounded-xl border p-4 ${r.accent}`}>
              <p className="flex items-center gap-2 font-bold text-slate-800">
                <span aria-hidden>{r.icon}</span> {r.titleHe}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{r.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="אוהמי מול מיישר — במבט אחד">
        <p className="leading-relaxed text-slate-600">ההבדל נראה מיד באופיין <Tex>{'I\\text{–}V'}</Tex>:</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-s-4 border-violet-400 bg-gradient-to-l from-violet-50/70 to-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-500/10 text-lg leading-none text-violet-600" aria-hidden>▷</span>
              <span className="font-bold text-violet-700">מיישר</span>
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">כיוון אחד</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">מעביר זרם <b>בכיוון אחד</b> בלבד — האקספוננציאלי של שוטקי.</p>
          </div>
          <div className="rounded-2xl border-s-4 border-emerald-400 bg-gradient-to-l from-emerald-50/70 to-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-lg leading-none text-emerald-600" aria-hidden>⇄</span>
              <span className="font-bold text-emerald-700">אוהמי</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">דו-כיווני</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600"><b>קו ישר דרך הראשית</b> — מוליך לשני הכיוונים, התנגדות נמוכה וקבועה.</p>
          </div>
        </div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">אופיין I–V · זרם–מתח</span> — אוהמי (ירוק, ליניארי) מול מיישר (סגול)
          </p>
          <OhmicVsRectifyingIV />
        </div>
      </Panel>
    </div>
  )
}
