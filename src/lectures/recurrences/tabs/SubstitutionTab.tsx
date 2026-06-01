import { useState } from 'react'
import type { ComplexityProof } from '@/engine/types'
import Tex from '@/components/Tex'
import ProofView from '@/components/ProofView'
import Panel from '../components/Panel'

const PROOF: ComplexityProof = {
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
}

type Guess = 'n' | 'nlogn' | 'n2'

const FEEDBACK: Record<Guess, { ok: boolean; he: string }> = {
  n: {
    ok: false,
    he: 'חסם נמוך מדי. ההצבה משאירה שארית חיובית של ‎+n‎ שלא נבלעת בחסם, והאינדוקציה נכשלת.',
  },
  n2: {
    ok: false,
    he: 'נכון כחסם עליון — אבל רופף, לא הדוק. אנחנו מחפשים את החסם ההדוק ביותר.',
  },
  nlogn: { ok: true, he: 'בדיוק! זהו החסם ההדוק. ראו את ההוכחה המלאה למטה.' },
}

export default function SubstitutionTab() {
  const [guess, setGuess] = useState<Guess | null>(null)
  const revealed = guess === 'nlogn'

  return (
    <div className="flex flex-col gap-5">
      <Panel title="שיטת ההצבה (Substitution)">
        <p className="leading-relaxed text-slate-600">
          שיטת ההצבה עובדת בשני צעדים: (1) <b>מנחשים</b> את צורת הפתרון, ו-(2){' '}
          <b>מוכיחים באינדוקציה</b> שהניחוש נכון — מוצאים קבועים שמקיימים את אי-השוויון, כולל אימות
          תנאי הבסיס. החיסרון: צריך לנחש נכון; היתרון: ההוכחה ודאית.
        </p>
      </Panel>

      <Panel title="נסו לנחש">
        <p className="mb-3 leading-relaxed text-slate-600">
          נתונה הנוסחה <Tex>T(n) = 2T(n/2) + n</Tex>. איזה חסם הדוק תנחשו?
        </p>
        <div className="flex flex-wrap gap-2">
          {(['n', 'nlogn', 'n2'] as Guess[]).map((g) => {
            const label = g === 'n' ? 'O(n)' : g === 'nlogn' ? 'O(n\\log n)' : 'O(n^2)'
            const active = guess === g
            return (
              <button
                key={g}
                onClick={() => setGuess(g)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'border-sky-500 bg-sky-500 text-white shadow'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Tex>{label}</Tex>
              </button>
            )
          })}
        </div>
        {guess && (
          <div
            className={`mt-3 rounded-xl border-s-4 px-4 py-3 text-sm leading-relaxed ${
              FEEDBACK[guess].ok
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-amber-300 bg-amber-50 text-amber-900'
            }`}
          >
            <span className="font-semibold">{FEEDBACK[guess].ok ? '✓ ' : '✗ '}</span>
            {FEEDBACK[guess].he}
          </div>
        )}
      </Panel>

      {revealed && (
        <Panel title="ההוכחה המלאה">
          <ProofView proof={PROOF} />
        </Panel>
      )}
    </div>
  )
}
