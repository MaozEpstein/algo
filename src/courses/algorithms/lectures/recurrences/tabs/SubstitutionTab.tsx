import { useState } from 'react'
import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import ProofView from '@/core/components/ProofView'
import Panel from '../components/Panel'

interface Option {
  /** LaTeX label for the guessed bound, e.g. 'O(n\\log n)'. */
  tex: string
  ok: boolean
  he: string
}

interface Example {
  id: string
  labelHe: string
  recurrenceTex: string
  options: Option[]
  proof: ComplexityProof
}

const LOW = 'חסם נמוך מדי — ההצבה משאירה שארית חיובית שלא נבלעת בחסם, והאינדוקציה נכשלת.'
const HIGH = 'נכון כחסם עליון, אך רופף — לא הדוק. אנחנו מחפשים את החסם ההדוק ביותר.'
const OK = 'בדיוק! זהו החסם ההדוק. ראו את ההוכחה המלאה למטה.'

export const EXAMPLES: Example[] = [
  {
    id: 'mergesort',
    labelHe: 'מיון מיזוג',
    recurrenceTex: 'T(n) = 2T(n/2) + n',
    options: [
      { tex: 'O(n)', ok: false, he: LOW },
      { tex: 'O(n\\log n)', ok: true, he: OK },
      { tex: 'O(n^2)', ok: false, he: HIGH },
    ],
    proof: {
      result: 'O(n \\log n)',
      claimHe:
        'נוכיח שעבור T(n) = 2T(n/2) + n מתקיים T(n) = O(n\\log n) — כלומר קיים קבוע c>0 כך ש-T(n) \\le c\\,n\\log n.',
      steps: [
        {
          he: 'מניחים שהחסם נכון לכל ערך קטן מ-n (הנחת האינדוקציה), ובפרט עבור n/2:',
          tex: 'T(n/2) \\le c\\,\\frac{n}{2}\\log\\frac{n}{2}',
        },
        {
          he: 'מציבים את ההנחה בנוסחת הנסיגה:',
          tex: 'T(n) \\le 2\\left(c\\,\\frac{n}{2}\\log\\frac{n}{2}\\right) + n = c\\,n\\log\\frac{n}{2} + n',
        },
        {
          he: 'מפתחים את לוגריתם המנה (log(n/2) = log n − 1):',
          tex: 'c\\,n\\log\\frac{n}{2} + n = c\\,n\\log n - c\\,n + n',
        },
        {
          he: 'בוחרים c \\ge 1 כך שהשארית אינה חיובית, ומקבלים בדיוק את החסם שרצינו:',
          tex: 'T(n) \\le c\\,n\\log n - (c-1)n \\;\\le\\; c\\,n\\log n',
        },
        {
          he: 'צעד האינדוקציה מתקיים. נותר לאמת את תנאי הבסיס עבור n קטן (תמיד אפשר ע״י הגדלת c) — וההוכחה שלמה.',
        },
      ],
      intuitionHe:
        'הסוד הוא לנחש חסם הדוק מספיק: לו היינו מנחשים רק T(n) ≤ c·n, ההצבה לא הייתה "נסגרת" ונשאר עודף +n. הגורם log n נובע מכך שיש log n רמות רקורסיה.',
    },
  },
  {
    id: 'subtract',
    labelHe: 'הטריק: חיזוק ההשערה',
    recurrenceTex: 'T(n) = 2T(n/2) + 1',
    options: [
      { tex: 'O(\\log n)', ok: false, he: LOW },
      { tex: 'O(n)', ok: true, he: OK },
      { tex: 'O(n^2)', ok: false, he: HIGH },
    ],
    proof: {
      result: 'O(n)',
      claimHe:
        'נוכיח שעבור T(n) = 2T(n/2) + 1 מתקיים T(n) = O(n). דווקא כאן ניחוש "תמים" של T(n) \\le c\\,n נכשל — צריך לחזק את ההשערה.',
      steps: [
        {
          he: 'ניסיון תמים: נניח T(n) \\le c\\,n. ההצבה נותנת c\\,n+1, שגדול מ-c\\,n — ההשערה לא "נסגרת":',
          tex: 'T(n) \\le 2\\left(c\\,\\tfrac{n}{2}\\right) + 1 = c\\,n + 1 \\;\\not\\le\\; c\\,n',
        },
        {
          he: 'מחזקים את ההשערה: מחסירים איבר מסדר נמוך (קבוע d):',
          tex: 'T(n) \\le c\\,n - d',
        },
        {
          he: 'מציבים את ההשערה המחוזקת בנוסחה:',
          tex: 'T(n) \\le 2\\left(c\\,\\tfrac{n}{2} - d\\right) + 1 = c\\,n - 2d + 1',
        },
        {
          he: 'דורשים שזה יהיה \\le c\\,n - d, כלומר -2d+1 \\le -d, ומכאן d \\ge 1. בוחרים d=1:',
          tex: 'T(n) \\le c\\,n - 1 \\le c\\,n',
        },
        {
          he: 'צעד האינדוקציה נסגר; עם אימות הבסיס מתקבל T(n) = O(n).',
        },
      ],
      intuitionHe:
        'כשמנחשים חסם פולינומי צמוד, לפעמים צריך להחסיר איבר מסדר נמוך כדי שההצבה תיסגר. החסם הסופי נשאר O(n) — ההחסרה היא רק "תרגיל אלגברי".',
    },
  },
  {
    id: 'decrease',
    labelHe: 'הקטנה ב-1',
    recurrenceTex: 'T(n) = T(n-1) + n',
    options: [
      { tex: 'O(n\\log n)', ok: false, he: LOW },
      { tex: 'O(n^2)', ok: true, he: OK },
      { tex: 'O(n^3)', ok: false, he: HIGH },
    ],
    proof: {
      result: 'O(n^2)',
      claimHe: 'נוכיח שעבור T(n) = T(n-1) + n מתקיים T(n) = O(n^2).',
      steps: [
        {
          he: 'הנחת האינדוקציה עבור n-1:',
          tex: 'T(n-1) \\le c\\,(n-1)^2',
        },
        {
          he: 'מציבים בנוסחת הנסיגה ומפתחים:',
          tex: 'T(n) \\le c\\,(n-1)^2 + n = c\\,n^2 - 2c\\,n + c + n',
        },
        {
          he: 'מסדרים את האיברים מהסדר הנמוך:',
          tex: 'T(n) \\le c\\,n^2 - (2c-1)\\,n + c',
        },
        {
          he: 'עבור c \\ge 1 (ו-n מספיק גדול) הזנב -(2c-1)n+c אינו חיובי, ולכן:',
          tex: 'T(n) \\le c\\,n^2',
        },
        {
          he: 'צעד האינדוקציה מתקיים; עם אימות הבסיס מתקבל T(n) = O(n^2).',
        },
      ],
      intuitionHe:
        'נוסחה שמקטינה ב-1 בכל צעד יוצרת n רמות שעלותן 1,2,…,n — סכום סדרה חשבונית שהוא Θ(n²).',
    },
  },
  {
    id: 'medians',
    labelHe: 'חציון-של-חציונים',
    recurrenceTex: 'T(n) = T(n/5) + T(3n/4) + O(n)',
    options: [
      { tex: 'O(n)', ok: true, he: 'בדיוק! למרות שתי הקריאות הרקורסיביות — התשובה לינארית.' },
      {
        tex: 'O(n\\log n)',
        ok: false,
        he: 'חסם עליון נכון אך רופף — סכום גודלי תת-הבעיות קטן מ-n, ולכן התשובה האמיתית לינארית.',
      },
      {
        tex: 'O(n^2)',
        ok: false,
        he: 'הרבה יותר מדי — זה בדיוק מה שרצינו להימנע ממנו (כמו מיון). ההצבה נותנת חסם לינארי.',
      },
    ],
    proof: {
      result: 'O(n)',
      claimHe:
        'באלגוריתם הבחירה הדטרמיניסטי (חציון-של-חציונים) מתקיים T(n) = T(n/5) + T(3n/4) + O(n): קריאה אחת למציאת חציון ה-n/5 החציונים, וקריאה שנייה על לכל היותר 3n/4 איברים. נוכיח T(n) = O(n) — קיים c כך ש-T(n) \\le c\\,n.',
      steps: [
        {
          he: 'הנחת האינדוקציה עבור שתי תת-הבעיות:',
          tex: 'T(n/5) \\le c\\tfrac{n}{5}, \\quad T(3n/4) \\le c\\tfrac{3n}{4}',
        },
        {
          he: 'מציבים, ומסמנים את העבודה הלינארית ב-a\\,n:',
          tex: 'T(n) \\le c\\tfrac{n}{5} + c\\tfrac{3n}{4} + a\\,n',
        },
        {
          he: 'סוכמים את המקדמים — וכאן הנקודה: 1/5 + 3/4 = 19/20 < 1:',
          tex: 'c\\tfrac{n}{5} + c\\tfrac{3n}{4} = c\\,n\\left(\\tfrac{1}{5}+\\tfrac{3}{4}\\right) = \\tfrac{19}{20}c\\,n',
        },
        {
          he: 'לכן נותר "רווח" של 1/20 שאמור לבלוע את העבודה הלינארית:',
          tex: 'T(n) \\le \\tfrac{19}{20}c\\,n + a\\,n = c\\,n - \\left(\\tfrac{c}{20} - a\\right)n',
        },
        {
          he: 'בוחרים c \\ge 20a כך שהשארית אינה חיובית, ומקבלים בדיוק את החסם:',
          tex: 'T(n) \\le c\\,n - \\left(\\tfrac{c}{20} - a\\right)n \\le c\\,n',
        },
        {
          he: 'צעד האינדוקציה נסגר, ולכן T(n) = O(n).',
        },
      ],
      intuitionHe:
        'הקסם: סכום גודלי תת-הבעיות הוא 19/20 מ-n — קטן ממש מ-n. ה"רווח" של 1/20 בולע את העבודה הלינארית בכל רמה, ולכן הסכום מתכנס ל-O(n) למרות שתי הקריאות הרקורסיביות. שימו לב: חלוקה לא-שווה כזו אי-אפשר לפתור בשיטת האב.',
    },
  },
  {
    id: 'fibonacci',
    labelHe: 'פיבונאצ׳י',
    recurrenceTex: 'T(n) = T(n-1) + T(n-2) + c',
    options: [
      {
        tex: 'O(n)',
        ok: false,
        he: 'נמוך מדי — כל קריאה מפצלת לשתיים, אז מספר הקריאות גדל מעריכית ולא לינארית.',
      },
      { tex: 'O(\\varphi^n)', ok: true, he: 'בדיוק! זהו הקצב האמיתי. ראו את ההוכחה למטה.' },
      {
        tex: 'O(2^n)',
        ok: false,
        he: 'חסם עליון נכון אך רופף — מספר הקריאות גדל כמו φⁿ (≈1.618ⁿ), לא 2ⁿ.',
      },
    ],
    proof: {
      result: 'O(\\varphi^n)',
      claimHe:
        'לחישוב הרקורסיבי של פיבונאצ׳י מתקיים T(n) = T(n-1) + T(n-2) + c. נוכיח T(n) = O(\\varphi^n), כאשר \\varphi = \\tfrac{1+\\sqrt5}{2} \\approx 1.618 הוא יחס הזהב — נראה שקיים c כך ש-T(n) \\le c(\\varphi^n - 1).',
      steps: [
        {
          he: 'הנחת האינדוקציה עבור n-1 ו-n-2:',
          tex: 'T(n-1) \\le c(\\varphi^{n-1} - 1), \\quad T(n-2) \\le c(\\varphi^{n-2} - 1)',
        },
        {
          he: 'מציבים בנוסחת הנסיגה:',
          tex: 'T(n) \\le c(\\varphi^{n-1} - 1) + c(\\varphi^{n-2} - 1) + c',
        },
        {
          he: 'מוציאים גורם משותף \\varphi^{n-2}:',
          tex: 'T(n) \\le c\\big(\\varphi^{n-2}(\\varphi + 1) - 1\\big)',
        },
        {
          he: 'וכאן הקסם — התכונה היסודית של יחס הזהב, \\varphi + 1 = \\varphi^2:',
          tex: '\\varphi^{n-2}(\\varphi + 1) = \\varphi^{n-2}\\,\\varphi^2 = \\varphi^n',
        },
        {
          he: 'ולכן מתקבל בדיוק החסם שרצינו:',
          tex: 'T(n) \\le c(\\varphi^n - 1) = O(\\varphi^n)',
        },
      ],
      intuitionHe:
        'הזהות φ+1 = φ² היא שמאפשרת לסכום של שני האיברים הקודמים "להתקפל" בדיוק לחזקה הבאה. לכן fib הרקורסיבי איטי מעריכית — וזה בדיוק המניע לפתרון דינמי/איטרטיבי שרץ ב-O(n).',
    },
  },
]

export default function SubstitutionTab() {
  const [exId, setExId] = useState(EXAMPLES[0].id)
  const example = EXAMPLES.find((e) => e.id === exId)!

  return (
    <div className="flex flex-col gap-5">
      <Panel title="שיטת ההצבה (Substitution)">
        <p className="leading-relaxed text-slate-600">שיטת ההצבה עובדת בשני צעדים:</p>
        <ol className="mt-3 flex flex-col gap-2">
          <li className="flex gap-2.5 leading-relaxed text-slate-600">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              1
            </span>
            <span>
              <b>מנחשים</b> את צורת הפתרון (חסם עליון או תחתון).
            </span>
          </li>
          <li className="flex gap-2.5 leading-relaxed text-slate-600">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
              2
            </span>
            <span>
              <b>מוכיחים באינדוקציה</b> שהניחוש נכון — מוצאים קבועים שמקיימים את אי-השוויון, כולל
              אימות תנאי הבסיס.
            </span>
          </li>
        </ol>
        <div className="mt-4 flex flex-col gap-2">
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            <b>חיסרון:</b> צריך לנחש נכון מראש.
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
            <b>יתרון:</b> ההוכחה ודאית ונותנת חסם הדוק.
          </div>
        </div>
      </Panel>

      <Panel title="נסו לנחש — שלוש דוגמאות">
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <button
              key={e.id}
              onClick={() => setExId(e.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                e.id === exId
                  ? 'border-sky-500 bg-sky-500 text-white shadow'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {e.labelHe}
            </button>
          ))}
        </div>
        <GuessChecker key={example.id} example={example} />
      </Panel>
    </div>
  )
}

function GuessChecker({ example }: { example: Example }) {
  const [picked, setPicked] = useState<number | null>(null)
  const chosen = picked === null ? null : example.options[picked]

  return (
    <div className="mt-4 flex flex-col gap-3">
      <p className="leading-relaxed text-slate-600">
        נתונה הנוסחה <Tex>{example.recurrenceTex}</Tex>. איזה חסם הדוק תנחשו?
      </p>
      <div className="flex flex-wrap gap-2">
        {example.options.map((o, i) => (
          <button
            key={i}
            onClick={() => setPicked(i)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              picked === i
                ? 'border-sky-500 bg-sky-500 text-white shadow'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <Tex>{o.tex}</Tex>
          </button>
        ))}
      </div>

      {chosen && (
        <div
          className={`rounded-xl border-s-4 px-4 py-3 text-sm leading-relaxed ${
            chosen.ok
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          <span className="font-semibold">{chosen.ok ? '✓ ' : '✗ '}</span>
          {chosen.he}
        </div>
      )}

      {chosen?.ok && (
        <div className="mt-1 rounded-2xl border border-slate-200 bg-white p-5">
          <h4 className="mb-3 text-base font-bold text-slate-800">ההוכחה המלאה</h4>
          <ProofView proof={example.proof} />
        </div>
      )}
    </div>
  )
}
