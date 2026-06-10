import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Tex from '@/core/components/Tex'
import { OPEN_CONSTANTS } from '@/core/platform/types'
import { MATERIALS, METALS, Q, EPS0, KB, KB_EV } from '../lib/junction'

/** number → LaTeX: scientific for very large/small magnitudes, plain otherwise. */
function texNum(x: number): string {
  const a = Math.abs(x)
  if (a !== 0 && (a >= 1e4 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a))
    const m = x / 10 ** e
    return `${(Math.round(m * 100) / 100).toString()}\\times10^{${e}}`
  }
  return String(x)
}
const T = (s: string) => <Tex>{s}</Tex>

const PHYS: { sym: string; he: string; val: string; unit: string }[] = [
  { sym: 'q', he: 'מטען היסוד', val: texNum(Q), unit: 'C' },
  { sym: 'k', he: 'קבוע בולצמן', val: texNum(KB), unit: 'J/K' },
  { sym: 'k', he: 'קבוע בולצמן', val: texNum(KB_EV), unit: 'eV/K' },
  { sym: '\\varepsilon_0', he: 'פרמיטיביות הריק', val: texNum(EPS0), unit: 'F/cm' },
  { sym: '\\varepsilon_0', he: 'פרמיטיביות הריק', val: texNum(8.854e-12), unit: 'F/m' },
  { sym: 'h', he: 'קבוע פלאנק', val: texNum(6.626e-34), unit: 'J·s' },
  { sym: '\\hbar', he: 'פלאנק מצומצם', val: texNum(1.055e-34), unit: 'J·s' },
  { sym: 'c', he: 'מהירות האור', val: texNum(3.0e10), unit: 'cm/s' },
  { sym: 'm_0', he: 'מסת האלקטרון', val: texNum(9.109e-31), unit: 'kg' },
  { sym: 'N_{Av}', he: 'מספר אבוגדרו', val: texNum(6.022e23), unit: 'mol⁻¹' },
  { sym: 'V_T', he: 'מתח תרמי (300K)', val: '0.02585', unit: 'V' },
]

const MAT_COLS: { key: keyof (typeof MATERIALS)['Si']; sym: string; unit: string }[] = [
  { key: 'eg', sym: 'E_g', unit: 'eV' },
  { key: 'ni', sym: 'n_i', unit: 'cm⁻³' },
  { key: 'epsR', sym: '\\varepsilon_r', unit: '' },
  { key: 'chi', sym: '\\chi', unit: 'eV' },
  { key: 'nc', sym: 'N_C', unit: 'cm⁻³' },
  { key: 'mun', sym: '\\mu_n', unit: 'cm²/Vs' },
  { key: 'mup', sym: '\\mu_p', unit: 'cm²/Vs' },
  { key: 'taun', sym: '\\tau', unit: 's' },
]

const MAT_DOT = ['bg-sky-400', 'bg-emerald-400', 'bg-amber-400']

function Card({ accent, title, children }: { accent: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm [break-inside:avoid]">
      <div className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white ${accent}`}>{title}</div>
      <div className="overflow-x-auto p-1">{children}</div>
    </section>
  )
}

/** Course-wide constants reference — physical constants + material & metal properties. */
export default function Constants() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      // Ctrl+Shift+C — open the constants table from anywhere in the course (incl. lessons)
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.code === 'KeyC') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener(OPEN_CONSTANTS, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_CONSTANTS, onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  async function exportPdf() {
    if (!contentRef.current) return
    setBusy(true)
    await document.fonts.ready
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import('html2pdf.js')).default as any
      await html2pdf()
        .set({
          margin: 10,
          filename: 'semiconductor-constants.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(contentRef.current)
        .save()
    } finally {
      setBusy(false)
    }
  }

  const mats = Object.values(MATERIALS)
  const metals = Object.values(METALS)

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[5vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl" initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-emerald-100 bg-gradient-to-l from-emerald-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span aria-hidden>📌</span>קבועים</h3>
              <div className="flex items-center gap-2">
                <button onClick={exportPdf} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60">
                  <span aria-hidden>⬇️</span> {busy ? 'מייצא…' : 'ייצא ל-PDF'}
                </button>
                <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600" aria-label="סגירה">✕</button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              <div ref={contentRef} className="bg-slate-50">
                <Card accent="bg-violet-500" title="קבועים פיזיקליים">
                  <table className="w-full text-right text-sm">
                    <tbody className="text-slate-700">
                      {PHYS.map((c, i) => (
                        <tr key={i} className={i % 2 ? 'bg-slate-50/60' : ''}>
                          <td className="px-3 py-2"><span className="inline-grid min-w-8 place-items-center rounded-lg bg-violet-100 px-2 py-0.5 font-mono text-violet-700" dir="ltr">{T(c.sym)}</span></td>
                          <td className="px-3 py-2 text-slate-600">{c.he}</td>
                          <td className="px-3 py-2 font-mono text-slate-900" dir="ltr">{T(c.val)}</td>
                          <td className="px-3 py-2 text-xs text-slate-400" dir="ltr">{c.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <Card accent="bg-sky-500" title="תכונות חומרים (300K)">
                  <table className="w-full text-center text-sm">
                    <thead>
                      <tr className="text-slate-500">
                        <th className="px-2 py-2 font-semibold">חומר</th>
                        {MAT_COLS.map((c) => <th key={c.key} className="px-2 py-2 font-semibold" dir="ltr">{T(c.sym)}{c.unit && <span className="block text-[10px] font-normal text-slate-400">{c.unit}</span>}</th>)}
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {mats.map((m, mi) => (
                        <tr key={m.key} className="border-t border-slate-100">
                          <td className="whitespace-nowrap px-2 py-2 text-start font-semibold"><span className={`me-1.5 inline-block h-2 w-2 rounded-full ${MAT_DOT[mi % 3]}`} />{m.he}</td>
                          {MAT_COLS.map((c) => <td key={c.key} className="px-2 py-2 font-mono text-xs" dir="ltr">{T(texNum(m[c.key] as number))}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <Card accent="bg-emerald-500" title="פונקציות-עבודה של מתכות">
                  <div className="flex flex-wrap gap-2 p-2">
                    {metals.map((m) => (
                      <div key={m.key} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                        <span className="font-semibold text-slate-700">{m.he}</span>
                        <span className="font-mono text-sm text-emerald-700" dir="ltr">{T('\\phi_M')}={m.phiM}<span className="text-xs text-slate-400"> eV</span></span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
