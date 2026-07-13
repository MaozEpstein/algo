import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/**
 * Overview · notation — a one-stop reference for the symbols that recur across the
 * whole course, grouped by area. Same two-column row style as the formula sheet.
 */

type Sym = { tex: string; he: string }
type Group = { title: string; syms: Sym[] }

const GROUPS: Group[] = [
  {
    title: 'הסתברות',
    syms: [
      { tex: 'f_X(x)', he: 'צפיפות (PDF) / הסתברות (PMF)' },
      { tex: 'F_X(x)=\\Pr(X\\le x)', he: 'פונקציית התפלגות מצטברת (CDF)' },
      { tex: 'f_{X\\mid Y}(x\\mid y)', he: 'צפיפות מותנית' },
      { tex: 'f_{X\\mid Y}=\\tfrac{f_{Y\\mid X}f_X}{f_Y}', he: 'נוסחת בייס' },
    ],
  },
  {
    title: 'מומנטים',
    syms: [
      { tex: 'E[X],\\ \\mathrm{Var}(X)', he: 'תוחלת ושונות' },
      { tex: '\\sigma_{XY},\\ \\rho', he: 'קווריאנס ומקדם מתאם' },
      { tex: 'C_x=E[xx^\\top]-\\mu\\mu^\\top', he: 'מטריצת קווריאנס' },
      { tex: '\\varphi_X(w)=E[e^{jwX}]', he: 'פונקציה אופיינית' },
    ],
  },
  {
    title: 'אמידה',
    syms: [
      { tex: '\\hat\\theta', he: 'אמד (estimator)' },
      { tex: '\\hat\\theta_{ML},\\ \\hat\\theta_{LS}', he: 'נראות מרבית / ריבועים פחותים' },
      { tex: '\\hat\\theta_{MMSE},\\ \\hat\\theta_{MAP}', he: 'תוחלת מותנית / שיא ה-posterior' },
      { tex: '\\hat x_{LMMSE}', he: 'אמד לינארי (BLE)' },
      { tex: '\\mathrm{bias}=E[\\hat\\theta]-\\theta', he: 'הטיה' },
    ],
  },
  {
    title: 'גילוי',
    syms: [
      { tex: 'H_0,\\ H_1', he: 'השערות (null / חלופית)' },
      { tex: 'T(x)', he: 'סטטיסטי מבחן / יחס נראות' },
      { tex: 'P_{FA},\\ P_D', he: 'הסתברות אזעקת-שווא / גילוי' },
      { tex: 'Q(a)=\\int_a^\\infty\\tfrac{1}{\\sqrt{2\\pi}}e^{-t^2/2}dt', he: 'פונקציית הזנב של הגאוסי' },
    ],
  },
  {
    title: 'תהליכים מקריים',
    syms: [
      { tex: 'X(t),\\ x(t,\\zeta)', he: 'תהליך מקרי (זמן, מאורע)' },
      { tex: 'm_X(t)=E[X(t)]', he: 'פונקציית התוחלת' },
      { tex: 'R_X(\\tau)=E[X(t)X(t+\\tau)]', he: 'אוטו-קורלציה (WSS)' },
      { tex: 'R_X(0)=E[X^2]', he: 'הספק' },
    ],
  },
  {
    title: 'מסננים',
    syms: [
      { tex: 'h[n]', he: 'תגובת הלם של מערכת LTI' },
      { tex: 'K_n', he: 'רווח קלמן' },
      { tex: 'P_{n|n}', he: 'שונות שגיאת האמידה' },
    ],
  },
]

export default function NotationTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מילון סימונים">
        <p className="leading-relaxed text-slate-600">
          כל הסימונים החוזרים לאורך הקורס במקום אחד, מקובצים לפי תחום. נתקלתם בסימון ולא זכרתם מאיפה? כאן.
        </p>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <section key={g.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <h4 className="border-b border-emerald-100 bg-gradient-to-l from-emerald-50 to-white px-4 py-2.5 text-sm font-bold text-emerald-700">
              {g.title}
            </h4>
            <div className="divide-y divide-slate-100">
              {g.syms.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-4 py-2.5 transition hover:bg-emerald-50/40">
                  <span className="text-sm font-medium text-slate-600">{s.he}</span>
                  <span className="hide-scrollbar max-w-[55%] overflow-x-auto rounded-lg bg-slate-50 px-2.5 py-1 text-slate-800 ring-1 ring-slate-100" dir="ltr">
                    <Tex>{s.tex}</Tex>
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
