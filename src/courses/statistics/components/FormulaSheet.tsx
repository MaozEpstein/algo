import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { OPEN_FORMULA_SHEET } from '@/core/platform/types'
import Tex from '@/core/components/Tex'
import { DISTRIBUTIONS, MVN } from '../lectures/overview/data/distributions'

/**
 * The course-wide formula sheet for שיטות סטטיסטיות — a curated KaTeX reference
 * (there is no official source PDF). Mounted once per course by CourseProvider,
 * so it's reachable from any page: opens on Ctrl/Cmd+Shift+S or the
 * OPEN_FORMULA_SHEET window event (CourseHome's button), closes on Esc / backdrop
 * / the shortcut again. Grouped by topic; the distributions table reuses the same
 * single-source data as the overview tab, so it stays in sync automatically.
 */

type Row = { name: string; tex: string }
type Section = { title: string; rows: Row[] }

const SECTIONS: Section[] = [
  {
    title: '1 · משתנים מקריים',
    rows: [
      { name: 'פונקציית התפלגות (CDF)', tex: 'F_X(x)=\\Pr(X\\le x)' },
      { name: 'צפיפות ↔ CDF', tex: 'f_X(x)=\\tfrac{dF_X}{dx},\\quad F_X(x)=\\int_{-\\infty}^{x} f_X(t)\\,dt' },
      { name: 'הסתברות לקטע', tex: '\\Pr(l\\le X\\le u)=\\int_l^u f_X(t)\\,dt' },
      { name: 'התפלגות משותפת', tex: 'F_{XY}(x,y)=\\Pr(X\\le x,\\,Y\\le y)' },
      { name: 'צפיפות משותפת', tex: 'f_{XY}(x,y)=\\tfrac{\\partial^2 F_{XY}}{\\partial x\\,\\partial y}' },
      { name: 'שולית (Marginal)', tex: 'f_X(x)=\\int f_{XY}(x,y)\\,dy' },
      { name: 'מותנית', tex: 'f_{X\\mid Y}(x\\mid y)=\\tfrac{f_{XY}(x,y)}{f_Y(y)}' },
      { name: 'נוסחת בייס', tex: 'f_{X\\mid Y}(x\\mid y)=\\tfrac{f_{Y\\mid X}(y\\mid x)\\,f_X(x)}{f_Y(y)}' },
      { name: 'אי-תלות', tex: 'f_{XY}(x,y)=f_X(x)\\,f_Y(y)' },
      { name: 'סכום בלתי-תלויים (קונבולוציה)', tex: 'f_{X+Y}(z)=\\int f_X(z-y)f_Y(y)\\,dy' },
    ],
  },
  {
    title: '2 · מומנטים',
    rows: [
      { name: 'תוחלת (מומנט ראשון)', tex: 'E[X]=\\int x\\,f_X(x)\\,dx' },
      { name: 'לינאריות', tex: 'E[aX+bY]=a\\,E[X]+b\\,E[Y]' },
      { name: 'שונות', tex: '\\mathrm{Var}(X)=E[X^2]-E^2[X]' },
      { name: 'שונות תחת סקאלה', tex: '\\mathrm{Var}(aX)=a^2\\,\\mathrm{Var}(X)' },
      { name: 'קווריאנס ומתאם', tex: '\\sigma_{XY}=E[XY]-E[X]E[Y],\\quad \\rho=\\tfrac{\\sigma_{XY}}{\\sigma_X\\sigma_Y}\\in[-1,1]' },
      { name: 'מטריצת קווריאנס', tex: 'C_x=E[xx^\\top]-\\mu\\mu^\\top\\succeq 0,\\quad C_{Ax+b}=A\\,C_x\\,A^\\top' },
      { name: 'חוק השונות השלמה', tex: '\\mathrm{Var}(X)=E_Y[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}_Y(E[X\\mid Y])' },
      { name: 'פונקציה אופיינית', tex: '\\varphi_X(w)=E[e^{jwX}]' },
      { name: 'מומנטים מהנגזרות', tex: 'E[X^n]=j^{-n}\\varphi_X^{(n)}(0)' },
      { name: 'פונקציה אופיינית של גאוסי', tex: '\\varphi_X(w)=e^{\\,jwm-\\frac12 w^2\\sigma^2}' },
      { name: 'מומנטים גבוהים של גאוסי', tex: 'E[(X-m)^{2k}]=(2k-1)!!\\,\\sigma^{2k},\\ \\ E[(X-m)^{2k-1}]=0' },
    ],
  },
  {
    title: '3 · פונקציות של משתנים מקריים',
    rows: [
      { name: 'שינוי משתנה (הפיך)', tex: 'f_Y(y)=|h\'(y)|\\,f_X(h(y)),\\quad h=g^{-1}' },
      { name: 'לינארי', tex: 'Y=aX+b:\\ \\ f_Y(y)=\\tfrac{1}{|a|}f_X\\!\\big(\\tfrac{y-b}{a}\\big)' },
      { name: 'סכום על השורשים', tex: 'f_Y(y)=\\sum_i f_X(x_i)/|g\'(x_i)|,\\ \\ g(x_i)=y' },
      { name: 'ריבוע → χ²₍₁₎', tex: 'Y=X^2,\\ X\\sim N(0,1):\\ f_Y(y)=\\tfrac{1}{\\sqrt{2\\pi y}}e^{-y/2}' },
      { name: 'יעקוביאן (רב-ממדי)', tex: 'f_{Z}(z)=|\\det J_h|\\,f_{XY}(h(z))' },
      { name: 'תוחלת של פונקציה (LOTUS)', tex: 'E[g(X)]=\\int g(x)\\,f_X(x)\\,dx' },
      { name: 'דגימה בטרנספורם ההפוך', tex: 'X=F_X^{-1}(U),\\quad F_X(X)\\sim U[0,1]' },
    ],
  },
  {
    title: '5 · בדיקת השערות',
    rows: [
      { name: 'מבחן יחס הנראות', tex: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\ \\gtrless_{H_0}^{H_1}\\ \\eta' },
      { name: 'ניימן-פירסון', tex: '\\max_R P_D\\ \\text{s.t.}\\ P_{FA}\\le\\alpha' },
      { name: 'פונקציית Q', tex: 'Q(a)=\\int_a^\\infty \\tfrac{1}{\\sqrt{2\\pi}}e^{-t^2/2}dt,\\ \\ Q(-a)=1-Q(a)' },
      { name: 'גילוי גאוסי', tex: 'P_D=Q\\big(Q^{-1}(P_{FA})-\\sqrt{n\\mu^2/\\sigma^2}\\big)' },
      { name: 'מסנן מותאם', tex: 'T=x^\\top\\Sigma^{-1}s,\\ \\ d^2=s^\\top\\Sigma^{-1}s' },
      { name: 'גלאי אנרגיה', tex: 'T=\\|x\\|^2,\\ \\ T;H_0\\sim\\sigma^2\\chi^2_d' },
      { name: 'כלל MAP (בייסיאני)', tex: 'T(x)\\ \\gtrless\\ \\tfrac{P(H_0)}{P(H_1)}' },
    ],
  },
  {
    title: '6 · נראות מרבית',
    rows: [
      { name: 'הטיה ושונות', tex: '\\mathrm{bias}=E[\\hat\\theta]-\\theta,\\ \\ \\mathrm{var}=E[(E-E[E])^2]' },
      { name: 'פירוק MSE', tex: '\\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{var}' },
      { name: 'אמד נראות מרבית', tex: '\\hat\\theta_{ML}=\\arg\\max_\\theta\\textstyle\\sum_i\\log f(y_i;\\theta)' },
      { name: 'MLE ברנולי', tex: '\\hat\\theta=\\tfrac1N\\textstyle\\sum y_i,\\ \\ \\mathrm{Var}=\\tfrac{\\theta(1-\\theta)}{N}' },
      { name: 'MLE גאוסי (σ̂² מוטה)', tex: '\\hat\\mu=\\overline y,\\ \\ \\hat\\sigma^2=\\tfrac1N\\textstyle\\sum(y_i-\\hat\\mu)^2,\\ E[\\hat\\sigma^2]=\\tfrac{N-1}{N}\\sigma^2' },
      { name: 'MLE מעריכי/אחיד', tex: '\\hat\\theta_{\\exp}=\\overline y,\\ \\ \\hat\\theta_{U(0,\\theta)}=\\max_i y_i' },
      { name: 'עקביות (KL)', tex: 'D_{KL}(f_1,f_2)=E_{f_1}[\\log\\tfrac{f_1}{f_2}]\\ge 0' },
    ],
  },
  {
    title: '7 · ריבועים פחותים',
    rows: [
      { name: 'מודל ומטרה', tex: 'y=H\\theta+n,\\ \\ \\min_\\theta\\|y-H\\theta\\|^2' },
      { name: 'משוואות נורמליות', tex: 'H^\\top H\\,\\theta=H^\\top y' },
      { name: 'פתרון LS', tex: '\\hat\\theta_{LS}=(H^\\top H)^{-1}H^\\top y' },
      { name: 'התאמת קו', tex: '\\hat\\theta_1=\\tfrac{\\sum(x_i-\\bar x)(y_i-\\bar y)}{\\sum(x_i-\\bar x)^2},\\ \\hat\\theta_0=\\bar y-\\hat\\theta_1\\bar x' },
      { name: 'קווריאנס', tex: '\\mathrm{Cov}(\\hat\\theta)=\\sigma^2(H^\\top H)^{-1}' },
      { name: 'Ridge', tex: '\\hat\\theta=(H^\\top H+\\lambda I)^{-1}H^\\top y' },
      { name: 'ירידת גרדיאנט', tex: '\\theta_{k+1}=\\theta_k-\\mu\\cdot 2H^\\top(H\\theta_k-y)' },
      { name: 'חסין (L1)', tex: '\\min_\\theta\\sum_i|y_i-\\theta|\\Rightarrow\\hat\\theta=\\mathrm{median}(y)' },
    ],
  },
  {
    title: '8 · סטטיסטיקה בייסיאנית',
    rows: [
      { name: 'בייס', tex: 'f(\\theta\\mid y)=\\tfrac{f(y\\mid\\theta)f(\\theta)}{f(y)}' },
      { name: 'סיכון בייסיאני', tex: '\\hat\\theta\\Leftarrow\\min_{\\hat\\theta(\\cdot)}E[c(\\hat\\theta-\\theta)]' },
      { name: 'MMSE (עלות ריבועית)', tex: '\\hat\\theta_{MMSE}=E[\\theta\\mid Y=y]' },
      { name: 'אורתוגונליות', tex: 'E[g(Y)(\\hat\\theta-\\theta)]=0\\ \\ \\forall g' },
      { name: 'MAP (עלות 0-1)', tex: '\\hat\\theta_{MAP}=\\arg\\max_\\theta f(y\\mid\\theta)f(\\theta)' },
      { name: 'חציון (עלות |·|)', tex: 'F_{\\theta\\mid Y}(\\hat\\theta\\mid y)=\\tfrac12' },
      { name: 'MMSE גאוסי', tex: '\\hat Y=\\tfrac{\\sigma_y^2}{\\sigma_y^2+\\sigma_w^2}X+\\tfrac{\\sigma_w^2}{\\sigma_y^2+\\sigma_w^2}\\mu_y' },
    ],
  },
  {
    title: '9 · אמידה בייסיאנית לינארית',
    rows: [
      { name: 'אמד LMMSE (אפיני)', tex: '\\hat x(y)=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y)' },
      { name: 'משוואה נורמלית', tex: 'E[yy^\\top]\\,a=E[yX]' },
      { name: 'אורתוגונליות', tex: 'E\\big[y\\,(a^\\top y-X)\\big]=0' },
      { name: 'שונות השגיאה', tex: '\\mathrm{MSE}=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}' },
      { name: 'סקלרי', tex: '\\hat x=\\mu_x+\\tfrac{\\sigma_{xy}}{\\sigma_y^2}(y-\\mu_y),\\ \\mathrm{mse}=(1-\\rho^2)\\sigma_x^2' },
      { name: 'גאוסי ⇒ MMSE=LMMSE', tex: 'x,y\\ \\text{Gaussian}\\Rightarrow \\hat x_{MMSE}=\\hat x_{LMMSE}' },
      { name: 'שני חיישנים', tex: '\\hat y=\\mu+\\tfrac{(x_1-\\mu)/\\sigma_1^2+(x_2-\\mu)/\\sigma_2^2}{1/\\sigma_1^2+1/\\sigma_2^2+1/\\sigma^2}' },
    ],
  },
]

/** True when focus is in a text field, so the shortcut doesn't hijack typing. */
function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

export default function FormulaSheet() {
  const [open, setOpen] = useState(false)

  // Global hotkey + window-event trigger — active from any page in the course.
  // `e.code === 'KeyS'` is layout-independent (works on a Hebrew layout too).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS' && !e.altKey && !isTyping(e.target)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpenEvent = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_FORMULA_SHEET, onOpenEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_FORMULA_SHEET, onOpenEvent)
    }
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            className="flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-emerald-100 bg-gradient-to-l from-emerald-50 to-white px-6 py-3">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span aria-hidden>📄</span>
                דף נוסחאות — שיטות סטטיסטיות
                <kbd className="rounded border border-emerald-200 bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-500" dir="ltr">
                  Ctrl+Shift+S
                </kbd>
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {SECTIONS.map((sec) => (
                <section key={sec.title}>
                  <h4 className="mb-2 text-sm font-bold text-emerald-700">{sec.title}</h4>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    {sec.rows.map((r, i) => (
                      <div
                        key={i}
                        className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 ${i ? 'border-t border-slate-100' : ''}`}
                      >
                        <span className="text-sm font-semibold text-slate-700">{r.name}</span>
                        <span className="hide-scrollbar max-w-full overflow-x-auto text-slate-800" dir="ltr">
                          <Tex>{r.tex}</Tex>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* Distributions — reuse the overview's single-source data */}
              <section>
                <h4 className="mb-2 text-sm font-bold text-emerald-700">4 · התפלגויות נפוצות</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-500">
                        <th className="whitespace-nowrap px-3 py-2 text-start font-semibold">התפלגות</th>
                        <th className="whitespace-nowrap px-3 py-2 text-start font-semibold">PDF / PMF</th>
                        <th className="whitespace-nowrap px-3 py-2 text-start font-semibold">E[X]</th>
                        <th className="whitespace-nowrap px-3 py-2 text-start font-semibold">Var(X)</th>
                        <th className="whitespace-nowrap px-3 py-2 text-start font-semibold">φ(w)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...DISTRIBUTIONS, MVN].map((d) => (
                        <tr key={d.id} className="border-b border-slate-100 align-middle">
                          <td className="px-3 py-2">
                            <span className="font-semibold text-slate-800">{d.nameHe}</span>{' '}
                            <span className="text-slate-400" dir="ltr"><Tex>{d.tex}</Tex></span>
                          </td>
                          <td className="px-3 py-2" dir="ltr"><Tex>{d.pdfTex}</Tex></td>
                          <td className="px-3 py-2" dir="ltr"><Tex>{d.meanTex}</Tex></td>
                          <td className="px-3 py-2" dir="ltr"><Tex>{d.varTex}</Tex></td>
                          <td className="px-3 py-2" dir="ltr"><Tex>{d.cfTex}</Tex></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  התוחלת/שונות מובאות כערכי-ייחוס (מוגדרות רשמית בשיעור 2). הפונקציה האופיינית של הגאוסי נגזרת בסיכום;
                  היתר סטנדרטיות.
                </p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
