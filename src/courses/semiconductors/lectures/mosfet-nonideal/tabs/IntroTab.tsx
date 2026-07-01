import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const EFFECTS: { icon: string; title: string; body: React.ReactNode }[] = [
  { icon: '📏', title: 'התקצרות תעלה', body: <>מישור-הרוויה <b>עולה מעט</b> עם <Tex>{'V_{DS}'}</Tex>; <Tex>{'r_o'}</Tex> סופי.</> },
  { icon: '🔋', title: 'אפקט המצע', body: <>מתח-הסף <Tex>{'V_T'}</Tex> <b>עולה</b> עם הטיית-המצע <Tex>{'V_{SB}'}</Tex>.</> },
  { icon: '📉', title: 'זרם תת-סף', body: <>מתחת ל-<Tex>{'V_T'}</Tex> יש זרם <b>אקספוננציאלי</b> (דיפוזיה).</> },
  { icon: '🐌', title: 'הדרדרות ניידות', body: <>השדה האנכי מוריד את <Tex>{'\\mu'}</Tex> בתחום הלינארי.</> },
  { icon: '🏎️', title: 'רוויית מהירות', body: <>המהירות נחסמת ב-<Tex>{'v_{sat}'}</Tex> → זרם <b>לינארי</b>.</> },
  { icon: '🧩', title: 'טכנולוגיית CMOS', body: <>שילוב NMOS+PMOS — הספק סטטי אפסי.</> },
]

/** Lesson 7ב intro — why the ideal long-channel model breaks in real, scaled devices. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מההתקן האידיאלי למודרני">
        <div className="rounded-2xl border-s-4 border-indigo-500 bg-indigo-50/70 p-4 leading-relaxed text-slate-700">
          <p>
            בחלק א׳ גזרנו את ה-MOSFET ב<b>הנחות אידיאליות</b>: ערוץ ארוך, ניידות קבועה, מישור-רוויה שטוח, וזרם אפס
            מתחת לסף. בהתקנים <b>אמיתיים וקטנים</b> ההנחות האלה נשברות — וכל סטייה היא אפקט פיזיקלי בעל שם.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            זהו בדיוק <b>§11.1 "Nonideal Effects"</b> אצל Neamen. נעבור עליהם אחד-אחד, ונסיים בטכנולוגיית <b>CMOS</b>.
          </p>
          <div className="mt-3">
            <Link to={lecturePath('semiconductors', 'mosfet')} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-50">
              ← חזרה לחלק א׳ (ההתקן האידיאלי)
            </Link>
          </div>
        </div>
      </Panel>

      <Panel title="מפת האפקטים בחלק זה">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EFFECTS.map((e) => (
            <div key={e.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
              <b className="text-slate-700">{e.icon} {e.title}</b>
              <p className="mt-1 text-sm text-slate-600">{e.body}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
