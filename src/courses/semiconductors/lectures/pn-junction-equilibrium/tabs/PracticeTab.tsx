import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import RecitationBandDiagram from '../components/RecitationBandDiagram'

// result-chip accents, by quantity
const ACCENT = {
  sky: 'bg-sky-50 text-sky-700 ring-sky-100',
  slate: 'bg-slate-50 text-slate-700 ring-slate-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-100',
  violet: 'bg-violet-50 text-violet-700 ring-violet-100',
  rose: 'bg-rose-50 text-rose-700 ring-rose-100',
}
const chipCls = 'rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-sm text-slate-700'
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

/** One collapsible sub-part (formula → substitution → result, or a concept/sketch). */
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
              <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">כך זה צריך להיראות ✏️</span>
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

/** A self-check question with a toggle to reveal/hide the answer. */
function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(usePrintMode())
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{q}</RichText></p>
        <button
          onClick={() => setShow((s) => !s)}
          aria-expanded={show}
          className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          {show ? 'הסתר תשובה' : 'הצג תשובה'}
        </button>
      </div>
      {show && <p className="mt-2 leading-relaxed text-slate-600">{children}</p>}
    </div>
  )
}

/**
 * Lecture 1א — practice. The worked example is the real recitation problem
 * (תרגול 1, שאלה 1): numbers are reproduced faithfully from the course PDF. The
 * self-check (knowledge) questions consolidate the equilibrium concepts.
 */
export default function PracticeTab() {
  // נוסחאות מהתרגול — ארגז הכלים של שאלה 1
  const q1Formulas: TFormula[] = [
    { name: 'פוטנציאל פרמי (קירוב בולצמן)', tex: 'e\\phi_F = kT\\ln(N/n_i)' },
    { name: 'מתח בנוי', tex: 'V_{bi} = \\phi_{Fn} + \\phi_{Fp}' },
    { name: 'רוחב מחסור (קירוב חד-צדדי)', tex: 'x_n \\approx \\sqrt{2\\epsilon V_{bi}/(qN_d)}' },
    { name: 'נייטרליות מטען (חלוקת המחסור)', tex: 'N_a\\,x_p = N_d\\,x_n' },
    { name: 'שדה מקסימלי (בצומת)', tex: 'E_{max} = -qN_d x_n/\\epsilon' },
    { name: 'רוחב מחסור תחת ממתח', tex: 'x_n \\approx \\sqrt{2\\epsilon(V_{bi}+V_a)/(qN_d)}' },
    { name: 'קיבול הצומת', tex: 'C = \\epsilon/x_n' },
  ]

  // תרגול 1 · שאלה 1 — סעיפים א–ו (מספרים נאמנים ל-PDF המקורי)
  const q1: Part[] = [
    {
      kind: 'numeric',
      prompt: 'חשבו את רמת פרמי ביחס לרמה האינטרינזית בשני צידי הצומת.',
      tex: 'e\\phi_{Fn}=kT\\ln\\dfrac{N_d}{n_i}\\quad e\\phi_{Fp}=kT\\ln\\dfrac{N_a}{n_i}',
      sub: '=0.026\\ln\\dfrac{10^{14}}{1.5\\times10^{10}}\\;,\\;\\; 0.026\\ln\\dfrac{5\\times10^{15}}{1.5\\times10^{10}}',
      res: (
        <>
          φ<sub>Fn</sub>≈0.229&nbsp;eV · φ<sub>Fp</sub>≈0.331&nbsp;eV
        </>
      ),
      accent: ACCENT.sky,
      note: (
        <>
          מרחק רמת פרמי מהרמה האינטרינזית נקבע מהאילוח דרך קירוב בולצמן (<Tex>{'n_0=n_i e^{(E_F-E_{Fi})/kT}'}</Tex>).
          הצד המאולח <b>יותר</b> (p, עם <Tex>{'N_a'}</Tex> גדול) רחוק יותר מהאמצע, ולכן <Tex>{'\\phi_{Fp}>\\phi_{Fn}'}</Tex>.
        </>
      ),
    },
    {
      kind: 'numeric',
      prompt: 'שרטטו את דיאגרמת פסי האנרגיה וסמנו את המתח הבנוי $V_{bi}$.',
      tex: 'V_{bi}=\\phi_{Fn}+\\phi_{Fp}',
      sub: '=0.229+0.331',
      res: <>≈0.560&nbsp;V</>,
      accent: ACCENT.violet,
      note: (
        <>
          המתח הבנוי הוא סך הירידה בפסים על-פני אזור המחסור (מסומן <Tex>{'eV_{bi}'}</Tex> בשרטוט), והוא תלוי
          <b> רק</b> באילוח בקצוות שכבת המחסור.
        </>
      ),
      sketch: () => <RecitationBandDiagram mode="equilibrium" />,
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את $x_n$, $x_p$ ואת השדה החשמלי המקסימלי בצומת.',
      tex: 'x_n\\!\\approx\\!\\sqrt{\\tfrac{2\\epsilon V_{bi}}{q}\\tfrac{1}{N_d}}\\;,\\;\\; E_{max}=-\\tfrac{qN_d x_n}{\\epsilon}',
      sub: 'x_n=\\sqrt{\\dfrac{2\\cdot11.7\\cdot8.85\\times10^{-14}\\cdot0.56}{1.6\\times10^{-19}}\\cdot\\dfrac{1}{10^{14}}}',
      res: (
        <>
          x<sub>n</sub>≈2.69&nbsp;µm · x<sub>p</sub>≈0.054&nbsp;µm · E<sub>max</sub>≈−4.11×10³&nbsp;V/cm
        </>
      ),
      accent: ACCENT.amber,
      note: (
        <>
          רוב שכבת המחסור נמצאת בצד המאולח <b>פחות</b> (צד n), כי <Tex>{'x\\propto 1/\\sqrt{N}'}</Tex>. השדה
          המקסימלי מתקבל בצומת עצמו (<Tex>{'x=0'}</Tex>).
        </>
      ),
    },
    {
      kind: 'numeric',
      prompt: 'חשבו את המתח החיצוני הדרוש כדי לקבל $x_n=3.5\\,\\mu m$. מה יהיה הזרם בדיודה?',
      tex: 'V_a\\approx x_n^{2}\\,\\dfrac{qN_d}{2\\epsilon}-V_{bi}',
      sub: '=(3.5\\times10^{-4})^{2}\\dfrac{1.6\\times10^{-19}\\cdot10^{14}}{2\\cdot11.7\\cdot8.85\\times10^{-14}}-0.56',
      res: (
        <>
          V<sub>a</sub>≈0.39&nbsp;V (אחורי) · J ≈ זרם רוויה הופכי זעיר
        </>
      ),
      accent: ACCENT.rose,
      note: (
        <>
          כדי <b>להרחיב</b> את המחסור צריך ממתח <b>אחורי</b> (<Tex>{'V_a<0'}</Tex>). הזרם אז הוא זרם הרוויה
          ההופכי בלבד — זעיר; עם האילוח הנתון אנו רחוקים ממתח הפריצה.
        </>
      ),
    },
    {
      kind: 'concept',
      prompt: 'איך תשתנה דיאגרמת פסי האנרגיה בהפעלת המתח החיצוני (האחורי) מהסעיף הקודם?',
      answer: (
        <>
          הדיודה יוצאת משיווי משקל, ולכן רמת פרמי כבר <b>אינה אחידה</b>: היא מתפצלת לרמות קוואזי-פרמי. בחיבור
          ממתח <b>אחורי</b> מחסום הפוטנציאל בין הצדדים <b>גדל</b> ל-<Tex>{'e(V_{bi}+V_a)'}</Tex>, ורמת פרמי בצד{' '}
          <Tex>{'n'}</Tex> יורדת מתחת לרמת פרמי בצד <Tex>{'p'}</Tex> בהפרש <Tex>{'eV_a'}</Tex> (ראו את כל
          המרחקים המסומנים בשרטוט).
        </>
      ),
      sketch: () => <RecitationBandDiagram mode="reverse" />,
    },
    {
      kind: 'numeric',
      prompt: 'מהו הקיבול בצומת?',
      tex: 'C=\\dfrac{dQ}{dV_a}=\\dfrac{\\epsilon}{x_n}=\\left(\\dfrac{q\\epsilon}{2}\\dfrac{N_d}{V_{bi}+V_a}\\right)^{1/2}',
      sub: '=\\dfrac{11.7\\cdot8.85\\times10^{-14}}{x_n}',
      res: <>≈2.96×10⁻⁹&nbsp;F/cm²</>,
      accent: ACCENT.slate,
      note: (
        <>
          שינוי המתח משנה את המטען הכלוא במחסור ויוצר קיבול. מתקבלת בדיוק <b>נוסחת קבל הלוחות</b>{' '}
          <Tex>{'C=\\epsilon/x_n'}</Tex>, כשאזור המחסור משמש כדיאלקטרי.
        </>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          להלן <b>השאלה מתוך תרגול 1</b> של הקורס, סעיף-סעיף (א–ו). נסו לפתור כל סעיף בעצמכם — כולל
          סעיפי ה<b>שרטוט</b> — ורק אז «פתרון» להשוואה. אחר-כך ענו על שאלות הבדיקה-העצמית <b>לפני</b> שאתם
          חושפים את התשובה.
        </p>
      </Panel>

      <Problem titleHe="תרגיל — צומת PN בשיווי משקל" source="מתוך תרגול 1 · שאלה 1" parts={q1} formulas={q1Formulas}>
        <p className="mt-2 leading-relaxed text-slate-700">
          נתונה דיודת <b>PN מסיליקון</b> בטמפרטורת החדר, מאולחת בצורה אחידה עם הריכוזים הבאים:
        </p>
        {/* טבלת הנתונים — נאמן לקופסה הממוסגרת שבגוף השאלה במקור */}
        <table className="mx-auto mt-4 border-collapse text-center" dir="ltr">
          <thead>
            <tr>
              <th className="border-2 border-slate-700 px-8 py-1.5 text-base font-bold text-slate-800">P</th>
              <th className="border-2 border-slate-700 px-8 py-1.5 text-base font-bold text-slate-800">N</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 border-slate-700 px-8 py-3"><Tex>{'N_a = 5\\times10^{15}\\,\\mathrm{cm^{-3}}'}</Tex></td>
              <td className="border-2 border-slate-700 px-8 py-3"><Tex>{'N_d = 10^{14}\\,\\mathrm{cm^{-3}}'}</Tex></td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-center text-sm text-slate-500"><Tex>{'T = 300\\,\\mathrm{K}'}</Tex></p>
      </Problem>

      <Panel title="שאלות לבדיקה עצמית">
        <div className="flex flex-col gap-3">
          <QA q="1 · למה רמת פרמי $E_F$ אחידה לכל רוחב ההתקן בשיווי משקל?">
            כי בשיווי משקל אין זרם נטו. שיפוע ב-<Tex>{'E_F'}</Tex> היה גורר זרם (דיפוזיה+סחיפה שאינם מתאזנים),
            ולכן <Tex>{'E_F'}</Tex> חייבת להיות שטוחה — זו ממש החתימה של שיווי המשקל.
          </QA>
          <QA q="2 · באיזה צד אזור המחסור רחב יותר, ולמה?">
            בצד המסומם <b>פחות</b>. מנייטרליות המטען <Tex>{'N_A d_p = N_D d_n'}</Tex> — הצד עם פחות יונים קבועים
            צריך רוחב גדול יותר כדי "לחשוף" מטען שווה לצד השני.
          </QA>
          <QA q="3 · מה קורה ל-$V_{bi}$ אם מכפילים את שני הסימומים פי 10?">
            המכפלה <Tex>{'N_A N_D'}</Tex> גדלה פי 100, ולכן <Tex>{'V_{bi}'}</Tex> עולה ב-
            <Tex>{'\\tfrac{kT}{q}\\ln(100) \\approx 120\\,mV'}</Tex> בלבד — עלייה קטנה, בגלל התלות הלוגריתמית.
          </QA>
          <QA q="4 · למה אי-אפשר למדוד את $V_{bi}$ עם מודד-מתח?">
            המתח הבנוי מתקזז על-ידי <b>מתחי-המגע</b> במגעים בקצות ההתקן. סכום המתחים בלולאה סגורה הוא אפס,
            ולכן אין מתח חיצוני מדיד ואי-אפשר להפיק מ-<Tex>{'V_{bi}'}</Tex> הספק.
          </QA>
          <QA q="5 · מה זה $n_i$ ולמה הוא מכריע?">
            ריכוז הנושאים בחומר אינטרינסי (<Tex>{'n = p = n_i'}</Tex>). דרך <Tex>{'n\\cdot p = n_i^2'}</Tex> הוא
            קובע את ריכוזי המיעוט, ודרך <Tex>{'V_{bi}=\\tfrac{kT}{q}\\ln(N_AN_D/n_i^2)'}</Tex> את המתח הבנוי.
            הוא תלוי מעריכית בפער האנרגיה ובטמפרטורה.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
