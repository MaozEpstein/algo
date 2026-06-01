import type { ReactNode } from 'react'
import Tex from '@/components/Tex'
import Panel from '../components/Panel'
import UnrollStepper, { type UnrollStep } from '../components/UnrollStepper'

const EXAMPLES: { titleHe: string; tex: string; baseTex: string; solTex: string }[] = [
  { titleHe: 'פיבונאצ׳י', tex: 'F(n) = F(n-1) + F(n-2)', baseTex: 'F(0)=0,\\; F(1)=1', solTex: 'O(\\varphi^n)' },
  { titleHe: 'מיון מיזוג', tex: 'T(n) = 2T(n/2) + \\Theta(n)', baseTex: 'T(1)=\\Theta(1)', solTex: '\\Theta(n\\log n)' },
  { titleHe: 'חיפוש בינארי', tex: 'T(n) = T(n/2) + \\Theta(1)', baseTex: 'T(1)=\\Theta(1)', solTex: '\\Theta(\\log n)' },
  { titleHe: 'עצרת', tex: 'T(n) = T(n-1) + \\Theta(1)', baseTex: 'T(0)=\\Theta(1)', solTex: '\\Theta(n)' },
]

const STEPS: UnrollStep[] = [
  { tex: 'T(n) = T(n-1) + 1', noteHe: 'נוסחת הנסיגה' },
  { tex: 'T(n) = \\big(T(n-2) + 1\\big) + 1 = T(n-2) + 2', noteHe: 'מציבים שוב' },
  { tex: 'T(n) = T(n-3) + 3', noteHe: 'ושוב…' },
  { tex: 'T(n) = T(n-i) + i', noteHe: 'הדפוס הכללי' },
  { tex: 'T(n) = T(0) + n = n', noteHe: 'עוצרים כש-i=n' },
]

// The course's "Recurrence Relations to Know and Love" — a quick reference map.
// `methods` lists which solving methods apply (Master only fits the a·T(n/b)+f
// "divide" form — never the decrease-by-constant family).
type Method = 'sub' | 'iter' | 'master'
const METHOD_HE: Record<Method, string> = {
  sub: 'הצבה',
  iter: 'איטרציה',
  master: 'שיטת האב',
}
const METHOD_STYLE: Record<Method, string> = {
  sub: 'bg-sky-100 text-sky-700',
  iter: 'bg-violet-100 text-violet-700',
  master: 'bg-amber-100 text-amber-700',
}
const KNOWN: { recTex: string; solTex: string; exHe: string; methods: Method[] }[] = [
  { recTex: 'T(n) = T(n/2) + O(1)', solTex: '\\Theta(\\log n)', exHe: 'חיפוש בינארי', methods: ['sub', 'iter', 'master'] },
  { recTex: 'T(n) = T(n-1) + O(1)', solTex: '\\Theta(n)', exHe: 'חיפוש סדרתי', methods: ['sub', 'iter'] },
  { recTex: 'T(n) = 2T(n/2) + O(1)', solTex: '\\Theta(n)', exHe: 'מעבר על עץ בינארי', methods: ['sub', 'iter', 'master'] },
  { recTex: 'T(n) = T(n-1) + O(n)', solTex: '\\Theta(n^2)', exHe: 'מיון בחירה / הכנסה / בועות', methods: ['sub', 'iter'] },
  { recTex: 'T(n) = 2T(n/2) + O(n)', solTex: '\\Theta(n\\log n)', exHe: 'מיון מיזוג · Quicksort (ממוצע)', methods: ['sub', 'iter', 'master'] },
  { recTex: 'T(n) = T(n-1) + T(n-2) + O(1)', solTex: 'O(\\varphi^n)', exHe: 'פיבונאצ׳י (רקורסיבי)', methods: ['sub'] },
]

export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהי נוסחת נסיגה?">
        <p className="leading-relaxed text-slate-600">
          נוסחת נסיגה (recurrence) מגדירה איבר בסדרה באמצעות האיברים הקודמים לו.
        </p>
        <p className="mt-1.5 leading-relaxed text-slate-600">
          בניתוח אלגוריתמים רקורסיביים היא מבטאת את <b>זמן הריצה</b> של בעיה בגודל <Tex>n</Tex>{' '}
          באמצעות זמן הריצה של תת-הבעיות הקטנות יותר שהיא יוצרת.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50 px-4 py-3">
            <span className="text-sm font-semibold text-sky-700">תנאי התחלה (בסיס)</span>
            <p className="mt-1 text-sm text-slate-600">
              קובע את האיברים הראשונים — נקודת העצירה של הרקורסיה. למשל <Tex>T(1)=\Theta(1)</Tex>.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-3">
            <span className="text-sm font-semibold text-violet-700">נוסחת הנסיגה (צעד כללי)</span>
            <p className="mt-1 text-sm text-slate-600">
              מגדירה כל איבר לפי הקודמים. למשל <Tex>T(n)=2T(n/2)+\Theta(n)</Tex>.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="דוגמאות מוכרות">
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.titleHe}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"
            >
              <span className="text-sm font-semibold text-slate-700">{ex.titleHe}</span>
              <Tex block>{ex.tex}</Tex>
              <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-2">
                <span className="text-xs text-slate-400">
                  <Tex>{ex.baseTex}</Tex>
                </span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  פתרון:
                  <span className="rounded-md bg-slate-900 px-2 py-0.5 text-white">
                    <Tex>{ex.solTex}</Tex>
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="לפתור = להפוך לנוסחה מפורשת">
        <p className="leading-relaxed text-slate-600">
          הנוסחה הרקורסיבית לא אומרת לנו ישירות מהו קצב הגדילה.
        </p>
        <p className="mt-1.5 leading-relaxed text-slate-600">
          <b>פתרון</b> נוסחת הנסיגה הוא המעבר ממנה לנוסחה מפורשת — חסם כמו <Tex>\Theta(n)</Tex> או{' '}
          <Tex>\Theta(n\log n)</Tex>.
        </p>
        <p className="mb-4 mt-1.5 leading-relaxed text-slate-600">
          ננסה זאת על דוגמה פשוטה: לחצו "הבא" כדי לפתח את הנוסחה צעד-אחר-צעד.
        </p>
        <UnrollStepper
          steps={STEPS}
          resultTex="T(n) = n = \Theta(n)"
          introHe="נפתח את T(n) = T(n-1) + 1 שוב ושוב עד שנגיע לתנאי הבסיס T(0)."
        />
        <p className="mt-4 leading-relaxed text-slate-500">
          זו בדיוק העבודה שעושות שלוש השיטות בלשוניות הבאות — <b>הצבה</b>, <b>איטרציה</b> ו<b>שיטת
          האב</b> — כל אחת בגישה אחרת.
        </p>
      </Panel>

      <Panel title="מפת דרכים — איזו שיטה מתי?">
        <p className="leading-relaxed text-slate-600">שלוש שיטות לפתרון נוסחאות נסיגה.</p>
        <p className="mt-1.5 leading-relaxed text-slate-600">
          <b>כלל אצבע:</b> אם הנוסחה בצורת <Tex>{'a\\,T(n/b) + f(n)'}</Tex> — נסו קודם{' '}
          <b>שיטת האב</b>.
        </p>
        <p className="mb-3 mt-1.5 leading-relaxed text-slate-600">
          אחרת — השתמשו ב<b>איטרציה</b> (כדי לגלות את הפתרון) או ב<b>הצבה</b> (כדי להוכיח אותו).
        </p>
        <div className="grid gap-3 lg:grid-cols-3">
          <MethodCard
            color="sky"
            icon="🎯"
            name="הצבה"
            when="מנחשים את צורת הפתרון ומוכיחים אותה באינדוקציה. מתאים כשיש ניחוש טוב, או כשהנוסחה אינה בצורת שיטת האב (חלוקה לא-שווה, הקטנה בקבוע)."
            pro="עובדת כמעט תמיד; ההוכחה ודאית והדוקה."
            con="צריך לנחש נכון מראש."
          />
          <MethodCard
            color="violet"
            icon="🔁"
            name="איטרציה"
            when="מציבים את הנוסחה בתוך עצמה שוב ושוב עד שמזהים דפוס, ואז סוכמים את עלויות כל הרמות."
            pro="לא צריך לנחש — הפתרון 'מתגלה' תוך כדי."
            con="לעיתים נדרשת עבודה אלגברית מרובה."
          />
          <MethodCard
            color="amber"
            icon="🧮"
            name="שיטת האב"
            when={
              <>
                השוואה ישירה של <Tex>f(n)</Tex> לסף <Tex>{'n^{\\log_b a}'}</Tex>. חלה <b>רק</b> על
                נוסחאות מהצורה <Tex>{'a\\,T(n/b)+f(n)'}</Tex>.
              </>
            }
            pro="מהירה ומיידית — בלי פיתוח אלגברי."
            con="לא חלה על הקטנה-בקבוע או חלוקה לא-שווה."
          />
        </div>
      </Panel>

      <Panel title="נוסחאות שכדאי להכיר">
        <p className="mb-3 leading-relaxed text-slate-600">
          כמה נוסחאות נסיגה חוזרות שוב ושוב בקורס — שווה לזהות אותן ישר לפי הצורה:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="py-2 pe-3 text-start font-semibold">נוסחת נסיגה</th>
                <th className="py-2 pe-3 text-start font-semibold">פתרון</th>
                <th className="py-2 pe-3 text-start font-semibold">שיטות פתרון</th>
                <th className="py-2 text-start font-semibold">דוגמה</th>
              </tr>
            </thead>
            <tbody>
              {KNOWN.map((row) => (
                <tr key={row.recTex} className="border-b border-slate-100 align-middle">
                  <td className="py-2.5 pe-3">
                    <Tex>{row.recTex}</Tex>
                  </td>
                  <td className="py-2.5 pe-3">
                    <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-white">
                      <Tex>{row.solTex}</Tex>
                    </span>
                  </td>
                  <td className="py-2.5 pe-3">
                    <div className="flex flex-wrap gap-1">
                      {row.methods.map((m) => (
                        <span
                          key={m}
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${METHOD_STYLE[m]}`}
                        >
                          {METHOD_HE[m]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5 text-sm leading-relaxed text-slate-600">{row.exHe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

function MethodCard({
  color,
  icon,
  name,
  when,
  pro,
  con,
}: {
  color: 'sky' | 'violet' | 'amber'
  icon: string
  name: string
  when: ReactNode
  pro: string
  con: string
}) {
  const ring = {
    sky: 'border-sky-200 bg-sky-50/40',
    violet: 'border-violet-200 bg-violet-50/40',
    amber: 'border-amber-200 bg-amber-50/40',
  }[color]
  const chip = {
    sky: 'bg-sky-100 text-sky-700',
    violet: 'bg-violet-100 text-violet-700',
    amber: 'bg-amber-100 text-amber-700',
  }[color]
  return (
    <div className={`flex flex-col gap-2 rounded-2xl border p-4 ${ring}`}>
      <span className={`w-fit rounded-full px-2.5 py-1 text-sm font-bold ${chip}`}>
        {icon} {name}
      </span>
      <p className="text-sm leading-relaxed text-slate-600">{when}</p>
      <div className="mt-auto flex flex-col gap-1 pt-1 text-sm">
        <span className="text-emerald-700">✓ {pro}</span>
        <span className="text-rose-600">✗ {con}</span>
      </div>
    </div>
  )
}
