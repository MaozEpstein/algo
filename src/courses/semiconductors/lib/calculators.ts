import {
  MATERIALS,
  METALS,
  thermalVoltage,
  oxideCap,
  fermiPotential,
  mosDepletionWidth,
  mosDepletionCharge,
  mosPhiMS,
  mosThreshold,
  builtInVoltage,
  commonEmitterBeta,
  transconductance,
} from './junction'

/**
 * Data-driven specs for the live calculator (course-level "מחשבון" modal). Each calculator wraps a
 * tested pure function from junction.ts, exposes a few inputs, computes live results, and offers
 * "known-value" presets. Pure — unit-tested; the React modal just renders these.
 */
export interface CalcInput {
  key: string
  /** May contain $…$ inline math. */
  label: string
  unit: string
  min: number
  max: number
  step: number
  default: number
  /** Input is log10 of a doping concentration (display as 10^x). */
  log?: boolean
}
export interface CalcResult {
  label: string
  value: string
}
export interface CalcPreset {
  label: string
  vals: Record<string, number>
}
export interface CalcSpec {
  id: string
  titleHe: string
  tex: string
  inputs: CalcInput[]
  presets: CalcPreset[]
  compute: (v: Record<string, number>) => CalcResult[]
}

const NI = MATERIALS.Si.ni
const EPS_SI = MATERIALS.Si.epsR

export const CALCULATORS: CalcSpec[] = [
  {
    id: 'vt',
    titleHe: 'מתח תרמי',
    tex: 'V_T=\\dfrac{kT}{q}',
    inputs: [{ key: 'T', label: 'טמפרטורה $T$', unit: 'K', min: 77, max: 500, step: 1, default: 300 }],
    presets: [
      { label: 'טמפ׳ חדר (300K)', vals: { T: 300 } },
      { label: 'חנקן נוזלי (77K)', vals: { T: 77 } },
    ],
    compute: (v) => [{ label: '$V_T$', value: `${(thermalVoltage(v.T) * 1000).toFixed(2)} mV` }],
  },
  {
    id: 'cox',
    titleHe: 'קיבול-אוקסיד',
    tex: 'C_{ox}=\\dfrac{\\varepsilon_{ox}\\varepsilon_0}{t_{ox}}',
    inputs: [{ key: 'tox', label: 'עובי אוקסיד $t_{ox}$', unit: 'nm', min: 2, max: 100, step: 1, default: 20 }],
    presets: [
      { label: 'דק (10nm)', vals: { tox: 10 } },
      { label: 'טיפוסי (20nm)', vals: { tox: 20 } },
    ],
    compute: (v) => [{ label: '$C_{ox}$', value: `${(oxideCap(v.tox * 1e-7) * 1e9).toFixed(1)} nF/cm²` }],
  },
  {
    id: 'phif',
    titleHe: 'פוטנציאל פרמי',
    tex: '\\phi_F=\\dfrac{kT}{q}\\ln\\dfrac{N_A}{n_i}',
    inputs: [{ key: 'logNa', label: 'סימום מצע $N_A$', unit: 'cm⁻³', min: 14, max: 19, step: 0.1, default: 17, log: true }],
    presets: [
      { label: 'p קל (10¹⁵)', vals: { logNa: 15 } },
      { label: 'p טיפוסי (10¹⁷)', vals: { logNa: 17 } },
    ],
    compute: (v) => [{ label: '$\\phi_F$', value: `${fermiPotential(10 ** v.logNa, NI).toFixed(3)} V` }],
  },
  {
    id: 'w',
    titleHe: 'רוחב אזור-המחסור (MOS)',
    tex: 'W=\\sqrt{\\dfrac{2\\varepsilon_s\\,\\psi_s}{qN_A}}',
    inputs: [
      { key: 'psiS', label: 'פוטנציאל-שטח $\\psi_s$', unit: 'V', min: 0.05, max: 1, step: 0.01, default: 0.4 },
      { key: 'logNa', label: 'סימום מצע $N_A$', unit: 'cm⁻³', min: 14, max: 19, step: 0.1, default: 17, log: true },
    ],
    presets: [
      { label: 'סף היפוך (ψ=0.8, 10¹⁷)', vals: { psiS: 0.8, logNa: 17 } },
      { label: 'מחסור מתון (ψ=0.3, 10¹⁶)', vals: { psiS: 0.3, logNa: 16 } },
    ],
    compute: (v) => [{ label: '$W$', value: `${(mosDepletionWidth(v.psiS, 10 ** v.logNa, EPS_SI) * 1e7).toFixed(1)} nm` }],
  },
  {
    id: 'vbi',
    titleHe: 'מתח מובנה (צומת PN)',
    tex: 'V_{bi}=\\dfrac{kT}{q}\\ln\\dfrac{N_A N_D}{n_i^2}',
    inputs: [
      { key: 'logNa', label: 'סימום $N_A$', unit: 'cm⁻³', min: 14, max: 19, step: 0.1, default: 17, log: true },
      { key: 'logNd', label: 'סימום $N_D$', unit: 'cm⁻³', min: 14, max: 19, step: 0.1, default: 17, log: true },
    ],
    presets: [
      { label: 'סימטרי (10¹⁷)', vals: { logNa: 17, logNd: 17 } },
      { label: 'א-סימטרי (10¹⁸/10¹⁵)', vals: { logNa: 18, logNd: 15 } },
    ],
    compute: (v) => [{ label: '$V_{bi}$', value: `${builtInVoltage(10 ** v.logNa, 10 ** v.logNd, NI).toFixed(3)} V` }],
  },
  {
    id: 'vth',
    titleHe: 'מתח-סף MOS',
    tex: 'V_T=V_{FB}+2\\phi_F+\\dfrac{|Q_{D,\\max}|}{C_{ox}}',
    inputs: [
      { key: 'logNa', label: 'סימום מצע $N_A$', unit: 'cm⁻³', min: 15, max: 18, step: 0.1, default: 17, log: true },
      { key: 'tox', label: 'עובי אוקסיד $t_{ox}$', unit: 'nm', min: 2, max: 60, step: 1, default: 20 },
    ],
    presets: [
      { label: 'Al · 10¹⁷ · 20nm', vals: { logNa: 17, tox: 20 } },
      { label: 'Al · 10¹⁶ · 10nm', vals: { logNa: 16, tox: 10 } },
    ],
    compute: (v) => {
      const Na = 10 ** v.logNa
      const phiF = fermiPotential(Na, NI)
      const Cox = oxideCap(v.tox * 1e-7)
      const VFB = mosPhiMS(METALS.Al.phiM, MATERIALS.Si.chi, MATERIALS.Si.eg, phiF)
      const VT = mosThreshold(VFB, phiF, mosDepletionCharge(2 * phiF, Na, EPS_SI), Cox)
      return [
        { label: '$V_T$', value: `${VT.toFixed(2)} V` },
        { label: '$V_{FB}$', value: `${VFB.toFixed(2)} V` },
      ]
    },
  },
  {
    id: 'qdep',
    titleHe: 'מטען-מחסור מרבי',
    tex: 'Q_{D,\\max}=\\sqrt{2q\\varepsilon_s N_A\\,(2\\phi_F)}',
    inputs: [{ key: 'logNa', label: 'סימום מצע $N_A$', unit: 'cm⁻³', min: 15, max: 18, step: 0.1, default: 17, log: true }],
    presets: [
      { label: 'p טיפוסי (10¹⁷)', vals: { logNa: 17 } },
      { label: 'p קל (10¹⁵)', vals: { logNa: 15 } },
    ],
    compute: (v) => {
      const Na = 10 ** v.logNa
      const phiF = fermiPotential(Na, NI)
      return [{ label: '$|Q_{D,\\max}|$', value: `${(mosDepletionCharge(2 * phiF, Na, EPS_SI) * 1e9).toFixed(1)} nC/cm²` }]
    },
  },
  {
    id: 'einstein',
    titleHe: 'מקדם-דיפוזיה (איינשטיין)',
    tex: 'D=\\mu\\,\\dfrac{kT}{q}',
    inputs: [
      { key: 'mu', label: 'ניידות $\\mu$', unit: 'cm²/Vs', min: 50, max: 9000, step: 10, default: 1350 },
      { key: 'T', label: 'טמפרטורה $T$', unit: 'K', min: 77, max: 500, step: 1, default: 300 },
    ],
    presets: [
      { label: 'אלקטרונים Si (μ=1350)', vals: { mu: 1350, T: 300 } },
      { label: 'חורים Si (μ=480)', vals: { mu: 480, T: 300 } },
    ],
    compute: (v) => [{ label: '$D$', value: `${(v.mu * thermalVoltage(v.T)).toFixed(1)} cm²/s` }],
  },
  {
    id: 'beta',
    titleHe: 'הגבר-זרם β (מ-α)',
    tex: '\\beta=\\dfrac{\\alpha}{1-\\alpha}',
    inputs: [{ key: 'alpha', label: 'הגבר בסיס-משותף $\\alpha$', unit: '', min: 0.9, max: 0.999, step: 0.001, default: 0.98 }],
    presets: [
      { label: 'α = 0.98', vals: { alpha: 0.98 } },
      { label: 'α = 0.995', vals: { alpha: 0.995 } },
    ],
    compute: (v) => [{ label: '$\\beta$', value: `${commonEmitterBeta(v.alpha).toFixed(0)}` }],
  },
  {
    id: 'gm',
    titleHe: 'מוליכות-מעבר $g_m$',
    tex: 'g_m=\\dfrac{I_C}{V_T}',
    inputs: [
      { key: 'ic', label: 'זרם-קולט $I_C$', unit: 'mA', min: 0.01, max: 10, step: 0.01, default: 1 },
      { key: 'T', label: 'טמפרטורה $T$', unit: 'K', min: 77, max: 500, step: 1, default: 300 },
    ],
    presets: [
      { label: '$I_C$ = 1mA', vals: { ic: 1, T: 300 } },
      { label: '$I_C$ = 0.1mA', vals: { ic: 0.1, T: 300 } },
    ],
    compute: (v) => [{ label: '$g_m$', value: `${(transconductance(v.ic * 1e-3, v.T) * 1e3).toFixed(2)} mS` }],
  },
]
