import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const HEB = ['א', 'ב', 'ג', 'ד', 'ה', 'ו']

type Part =
  | { kind: 'numeric'; prompt: string; tex: string; sub: string; res: ReactNode; accent: string; note?: ReactNode; sketch?: () => ReactNode }
  | { kind: 'concept'; prompt: string; answer: ReactNode; sketch?: () => ReactNode }
  | { kind: 'sketch'; prompt: string; render: () => ReactNode }

/** The "שאלה" prompt box (exam-style). `source` tags where the question came from. */
function QuestionBlock({ source, children }: { source?: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-white">שאלה</span>
        {source && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
            {source}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

const labelCls = 'w-14 shrink-0 rounded bg-slate-100 py-0.5 text-center text-xs font-semibold text-slate-500'

function PartCard({ part, index, open, onToggle }: { part: Part; index: number; open: boolean; onToggle: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-2 px-4 py-3 text-start transition hover:bg-slate-50">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-700 text-xs font-bold text-white">{HEB[index]}</span>
        <span className="text-sm font-medium text-slate-700"><RichText>{part.prompt}</RichText></span>
        <svg className={`ms-auto h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {part.kind === 'numeric' && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className={`${labelCls} text-slate-400`}>נוסחה</span>
                <span className="ltr text-slate-600" dir="ltr"><Tex>{part.tex}</Tex></span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className={labelCls}>הצבה</span>
                <span className="ltr text-slate-700" dir="ltr"><Tex>{part.sub}</Tex></span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={labelCls}>תוצאה</span>
                <span className={`rounded-lg px-3 py-1 font-mono text-sm font-bold ring-1 ${part.accent}`} dir="ltr">{part.res}</span>
              </div>
              {part.note && (
                <p className="rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-violet-900">💡 {part.note}</p>
              )}
            </div>
          )}
          {part.kind === 'concept' && (
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className={labelCls}>תשובה</span>
              <span className="text-sm leading-relaxed text-slate-600">{part.answer}</span>
            </div>
          )}
          {part.kind === 'sketch' && (
            <div className="space-y-1.5">
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">כך זה צריך להיראות ✏️</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2">{part.render()}</div>
            </div>
          )}
          {part.kind !== 'sketch' && part.sketch && (
            <div className="mt-3 space-y-1.5">
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">איור מהתרגול ✏️</span>
              <div className="rounded-xl border border-slate-200 bg-white p-2">{part.sketch()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Parts({ parts }: { parts: Part[] }) {
  const printing = usePrintMode()
  const [open, setOpen] = useState<boolean[]>(() => parts.map(() => printing))
  const allOpen = open.every(Boolean)
  const toggleAll = () => setOpen(parts.map(() => !allOpen))
  const toggleOne = (i: number) => setOpen((prev) => prev.map((v, k) => (k === i ? !v : v)))
  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <button onClick={toggleAll} aria-expanded={allOpen} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-emerald-700">
          פתרון
          <svg className={`h-3.5 w-3.5 transition-transform ${allOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <span className="shrink-0 text-xs text-slate-400">נסו לבד — ואז «פתרון» פותח/סוגר את כל הסעיפים</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="mt-3 flex flex-col gap-2.5">
        {parts.map((p, i) => (
          <PartCard key={i} part={p} index={i} open={open[i]} onToggle={() => toggleOne(i)} />
        ))}
      </div>
    </>
  )
}

type TFormula = { name: string; tex: string }

/** Collapsible "📐 נוסחאות מהתרגול" — the toolbox of formulas this question uses,
 *  each shown with its Hebrew name. Closed by default; auto-open when printing. */
function FormulaList({ formulas }: { formulas: TFormula[] }) {
  const [open, setOpen] = useState(usePrintMode())
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100"
      >
        <span aria-hidden>📐</span>
        נוסחאות מהתרגול
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="mt-3 overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/40">
          {formulas.map((f, i) => (
            <div key={i} className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 ${i ? 'border-t border-indigo-100' : ''}`}>
              <span className="text-sm font-semibold text-slate-700">{f.name}</span>
              <span className="ltr text-slate-800" dir="ltr"><Tex>{f.tex}</Tex></span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Problem({ titleHe, source, children, parts, formulas }: { titleHe: string; source?: string; children: ReactNode; parts: Part[]; formulas?: TFormula[] }) {
  return (
    <Panel title={titleHe}>
      <QuestionBlock source={source}>{children}</QuestionBlock>
      {formulas && <FormulaList formulas={formulas} />}
      <Parts parts={parts} />
    </Panel>
  )
}

function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(usePrintMode())
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{q}</RichText></p>
        <button onClick={() => setShow((s) => !s)} aria-expanded={show} className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
          {show ? 'הסתר תשובה' : 'הצג תשובה'}
        </button>
      </div>
      {show && <p className="mt-2 leading-relaxed text-slate-600">{children}</p>}
    </div>
  )
}

/**
 * Lecture 2ב — practice. Real recitation content (תרגול 2 — מודל SRH): the full
 * derivation of the SRH recombination rate, plus the worked symbolic example
 * (N-type, weak injection → R ≈ δp/τ). Faithful to the course PDF; the trap
 * mechanism is shown with the existing GenRecombDiagram. Plus knowledge checks.
 */
export default function PracticeTab() {
  // נוסחאות מהתרגול — ארגז הכלים לדוגמה
  const exampleFormulas: TFormula[] = [
    { name: 'אכלוס מלכודות', tex: '\\dfrac{n_T}{N_T}=\\dfrac{C_n n+C_p p_1}{C_n(n+n_1)+C_p(p+p_1)}' },
    { name: 'קצב התאחדות SRH', tex: 'R_{SRH}=\\dfrac{np-n_i^2}{\\tau_p(n+n_1)+\\tau_n(p+p_1)}' },
    { name: 'הזרקה חלשה (מל"מ N)', tex: 'R_{SRH}\\approx \\delta p/\\tau_p' },
  ]

  // דוגמה: מל"מ מסוג N (סעיפים א–ב), נאמן ל-PDF
  const example: Part[] = [
    {
      kind: 'concept',
      prompt: 'מהו ריכוז המלכודות המלאות באלקטרונים?',
      answer: (
        <>
          עבור <Tex>{'E_T=E_i'}</Tex> מתקיים <Tex>{'n_1=p_1=n_i'}</Tex>, ועם <Tex>{'C_n=C_p'}</Tex>:{' '}
          <span dir="ltr"><Tex>{'\\tfrac{n_T}{N_T}=\\tfrac{n+n_i}{n+n_i+p+n_i}\\xrightarrow{\\text{weak inj.}}1'}</Tex></span>.
          כלומר <b>כמעט כל המלכודות מאוכלסות</b> (<Tex>{'n_T\\approx N_T'}</Tex>) — צפוי, כי במל"מ מסוג <b>N</b> רמת
          פרמי נמצאת <b>מעל</b> <Tex>{'E_T'}</Tex> וכל המצבים שמתחתיה מאוכלסים.
        </>
      ),
    },
    {
      kind: 'concept',
      prompt: 'מהו קצב ההתאחדות העודפת, ומהו התהליך קובע-הקצב?',
      answer: (
        <>
          <Tex>{'np-n_i^2=(n_0+\\delta n)(p_0+\\delta p)-n_i^2\\approx n_0\\,\\delta p'}</Tex> (במל"מ N השלם{' '}
          <Tex>{'n_0\\delta p'}</Tex> דומיננטי). עם <Tex>{'\\tau_n=\\tau_p'}</Tex> מקבלים{' '}
          <span dir="ltr"><Tex>{'R_{SRH}=\\tfrac{n_0\\delta p}{\\tau_p(n+n_i+p+p_i)}\\approx \\tfrac{\\delta p}{\\tau_p}'}</Tex></span>,
          ולכן <span dir="ltr"><Tex>{'-\\tfrac{dp}{dt}=\\tfrac{\\delta p}{\\tau_p}-G_{ex}'}</Tex></span> — בדיוק{' '}
          <b>משוואת הרציפות</b> המוכרת. פיזיקלית: תהליך <b>a</b> מהיר (יש המון אלקטרונים), ולכן <b>תהליך c</b>{' '}
          (לכידת חור) הוא האיטי וקובע-הקצב.
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          זוהי ה<b>דוגמה</b> מתרגול 2 (מל"מ מסוג N). את <b>גזירת מודל SRH</b> המלאה — ארבעת התהליכים ועד{' '}
          <Tex>{'R_{SRH}'}</Tex> — תמצאו בלשונית הלימוד <b>«מודל SRH»</b>. נסו לפתור סעיף-סעיף ורק אז «פתרון»; כפתור{' '}
          <b>«נוסחאות מהתרגול»</b> מרכז את ארגז הכלים.
        </p>
      </Panel>

      <Problem titleHe="דוגמה — מל&quot;מ מסוג N" source="מתוך תרגול 2 · דוגמה" parts={example} formulas={exampleFormulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתון מל"מ מסוג <b>N</b>, עם <span dir="ltr"><Tex>{'C_n=C_p'}</Tex></span> (ולכן{' '}
          <span dir="ltr"><Tex>{'\\tau_n=\\tau_p'}</Tex></span>) ו-<span dir="ltr"><Tex>{'E_T=E_i'}</Tex></span>, בהנחת{' '}
          <b>הזרקה חלשה</b>.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה במל&quot;מ מסוג N דווקא *לכידת החור* (תהליך c) קובעת את קצב ההתאחדות?">
            כי המלכודות מוצפות באלקטרונים (<Tex>{'n_T\\approx N_T'}</Tex>) ולכידת אלקטרון (a) מהירה מאוד. ההתאחדות
            יכולה להסתיים רק כשמלכודת <b>לוכדת חור</b> — תהליך נדיר יותר, ולכן הוא <b>צוואר הבקבוק</b>.
          </QA>
          <QA q="2 · מתי $R_{SRH}$ מקסימלי ביחס למיקום המלכודת $E_T$?">
            כש-<Tex>{'E_T'}</Tex> קרובה לאמצע הפער (<Tex>{'E_T\\approx E_i'}</Tex>): אז <Tex>{'n_1,p_1'}</Tex> מינימליים
            והמכנה קטן. מלכודות עמוקות הן <b>מרכזי-התאחדות יעילים</b>, בעוד מלכודות רדודות בעיקר "לוכדות וזורקות".
          </QA>
          <QA q="3 · מה ההבדל בין $\tau$ של מודל SRH ל-$\tau_0$ שמופיע בזרם הרקומבינציה של הדיודה?">
            אותו רעיון: <Tex>{'\\tau=1/(C\\,N_T)'}</Tex> קובע כמה מהר עודף-מיעוט נעלם. בדיודה הלא-אידיאלית{' '}
            <Tex>{'\\tau_0'}</Tex> (בקונבנציה <Tex>{'\\tau_n=\\tau_p'}</Tex>) הוא בדיוק זה — והוא שקובע את גודל זרם
            הרקומבינציה/גנרציה באזור המחסור.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
