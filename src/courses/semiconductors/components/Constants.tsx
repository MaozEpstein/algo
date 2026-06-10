import { useEffect, useState } from 'react'
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
    const ms = (Math.round(m * 100) / 100).toString()
    return `${ms}\\times10^{${e}}`
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-sm font-bold text-slate-500">{title}</h3>
      <div className="overflow-x-auto rounded-2xl border border-slate-200">{children}</div>
    </section>
  )
}
const TH = 'px-3 py-2 font-semibold'
const TD = 'px-3 py-2'

/** Course-wide constants reference (physical constants + material & metal properties). */
export default function Constants() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener(OPEN_CONSTANTS, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_CONSTANTS, onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const mats = Object.values(MATERIALS)
  const metals = Object.values(METALS)

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[6vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl" initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-emerald-100 bg-gradient-to-l from-emerald-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span aria-hidden>📌</span>קבועים</h3>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-600" aria-label="סגירה">✕</button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              <Section title="קבועים פיזיקליים">
                <table className="w-full text-right text-sm">
                  <tbody className="text-slate-700">
                    {PHYS.map((c, i) => (
                      <tr key={i} className="border-t border-slate-100 first:border-0">
                        <td className={`${TD} font-mono`} dir="ltr">{T(c.sym)}</td>
                        <td className={`${TD} text-slate-500`}>{c.he}</td>
                        <td className={`${TD} font-mono`} dir="ltr">{T(c.val)}</td>
                        <td className={`${TD} text-slate-400`} dir="ltr">{c.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>

              <Section title="תכונות חומרים (300K)">
                <table className="w-full text-center text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className={TH}>חומר</th>
                      {MAT_COLS.map((c) => <th key={c.key} className={TH} dir="ltr">{T(c.sym)}{c.unit && <span className="text-[10px] text-slate-400"> [{c.unit}]</span>}</th>)}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {mats.map((m) => (
                      <tr key={m.key} className="border-t border-slate-100">
                        <td className={`${TD} font-semibold`}>{m.he}</td>
                        {MAT_COLS.map((c) => <td key={c.key} className={`${TD} font-mono`} dir="ltr">{T(texNum(m[c.key] as number))}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>

              <Section title="פונקציות-עבודה של מתכות">
                <table className="w-full text-center text-sm">
                  <thead className="bg-slate-50 text-slate-500"><tr><th className={TH}>מתכת</th><th className={TH} dir="ltr">{T('\\phi_M')} [eV]</th></tr></thead>
                  <tbody className="text-slate-700">
                    {metals.map((m) => (
                      <tr key={m.key} className="border-t border-slate-100">
                        <td className={`${TD} font-semibold`}>{m.he}</td>
                        <td className={`${TD} font-mono`} dir="ltr">{m.phiM}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
