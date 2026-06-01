import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import type { ComplexityProof } from '@/core/engine/types'
import Panel from '../components/Panel'
import DecisionTree from '../views/DecisionTree'

const lowerBoundProof: ComplexityProof = {
  result: '\\Omega(n \\log n)',
  claimHe: 'כל מיון מבוסס-השוואות מבצע במקרה הגרוע לפחות Ω(n log n) השוואות.',
  steps: [
    {
      he: 'מייצגים כל מיון-השוואות כעץ החלטה בינארי: צומת פנימי = השוואה בודדת, עלה = סידור (תמורה) אפשרי של הקלט. מסלול מהשורש לעלה = ריצה אחת.',
    },
    { he: 'כדי שהמיון יהיה נכון, חייב להיות עלה לכל אחת מ-n! התמורות:', tex: '\\#\\text{leaves} \\ge n!' },
    { he: 'עץ בינארי בגובה h בעל לכל היותר 2ʰ עלים, ולכן:', tex: 'n! \\le 2^{h}' },
    { he: 'לוקחים לוגריתם בבסיס 2:', tex: 'h \\ge \\log_2(n!)' },
    { he: 'מקירוב סטירלינג:', tex: '\\log_2(n!) = \\Theta(n \\log n)' },
    { he: 'הגובה h שווה למספר ההשוואות במקרה הגרוע, ומכאן:', tex: 'h = \\Omega(n \\log n)' },
  ],
  intuitionHe:
    'עם k השוואות אפשר להבחין בין לכל היותר 2ᵏ מקרים. כדי להבדיל בין n! סידורים שונים צריך k ≥ log₂(n!) ≈ n·log n — לא משנה כמה נהיה חכמים.',
}

/** A designed, connected-timeline rendering of a structured proof (inline). */
function ProofTimeline({ proof }: { proof: ComplexityProof }) {
  const last = proof.steps.length - 1
  return (
    <div className="flex flex-col gap-4">
      {/* claim banner */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
        <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-white shadow-sm">
          <Tex>{proof.result}</Tex>
        </span>
        <p className="flex-1 font-medium leading-relaxed text-slate-700">{proof.claimHe}</p>
      </div>

      {/* steps as a connected timeline */}
      <ol className="flex flex-col">
        {proof.steps.map((s, i) => {
          const isConclusion = i === last
          return (
            <li key={i} className="flex gap-4">
              {/* number + connector */}
              <div className="flex flex-col items-center">
                <span
                  className={`z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold text-white shadow ${
                    isConclusion
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                      : 'bg-gradient-to-br from-sky-400 to-sky-600'
                  }`}
                >
                  {i + 1}
                </span>
                {i < last && <span className="w-0.5 flex-1 bg-slate-200" />}
              </div>
              {/* body */}
              <div className="flex-1 pb-5">
                <p className="leading-relaxed text-slate-700">{s.he}</p>
                {s.tex && (
                  <div
                    className={`mt-2 rounded-xl px-4 py-3 text-center ${
                      isConclusion
                        ? 'border-2 border-emerald-200 bg-emerald-50'
                        : 'border border-slate-100 bg-slate-50'
                    }`}
                  >
                    <Tex block>{s.tex}</Tex>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {proof.intuitionHe && (
        <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
          <span className="font-semibold">💡 אינטואיציה: </span>
          {proof.intuitionHe}
        </div>
      )}
    </div>
  )
}

export default function LowerBoundTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="כל המיונים עד כה — מיוני השוואה">
        <p className="leading-relaxed text-slate-600">
          מיון הכנסה, מיזוג, ערימה ומהיר חולקים תכונה אחת: הכלי היחיד שלהם לאיסוף מידע על הסדר הוא{' '}
          <b>השוואה בין שני איברים</b> (<Tex>{'a_i \\le a_j'}</Tex>?).
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          השאלה: כמה השוואות <b>חייבים</b> לבצע במקרה הגרוע? נראה חסם תחתון — ואז נשבור אותו (בלי השוואות).
        </p>
      </Panel>

      <Panel title="עץ החלטה — מודל מופשט למיון השוואות">
        <p className="mb-4 leading-relaxed text-slate-600">
          כל מיון-השוואות אפשר לתאר כעץ: בכל צומת מבצעים השוואה, ולפי התוצאה פונים שמאלה (<Tex>{'\\le'}</Tex>)
          או ימינה (<Tex>{'>'}</Tex>). העלה שאליו מגיעים הוא הסידור הסופי. בחרו קלט וראו את המסלול:
        </p>
        <DecisionTree />
      </Panel>

      <Panel title="החסם התחתון: Ω(n log n)">
        <ProofTimeline proof={lowerBoundProof} />
      </Panel>

      <Panel title="מסקנה — ואיך שוברים את החסם">
        <p className="leading-relaxed text-slate-600">
          מיון <b>מיזוג</b> ומיון <b>ערימה</b> משיגים <Tex>O(n \log n)</Tex> — כלומר הם{' '}
          <b>אופטימליים</b> אסימפטוטית בין מיוני ההשוואה (
          <Link to={lecturePath('algorithms', 'heapsort', { mode: 'guided' })} className="font-semibold text-sky-600 hover:underline">
            ראו שיעור 4
          </Link>
          ).
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          כדי לרדת מתחת ל-<Tex>n \log n</Tex> אין ברירה אלא <b>לוותר על השוואות</b> ולנצל מבנה בקלט. זה
          בדיוק מה שעושים שלושת המיונים הבאים — מנייה, בסיס ודלי.
        </p>
      </Panel>
    </div>
  )
}
