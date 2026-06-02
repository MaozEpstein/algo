/**
 * Pure physics of an abrupt PN junction at (or near) equilibrium — no React.
 * Everything is unit-tested. Units: doping in cm⁻³, lengths in cm internally
 * (converted for display), voltages in V, field in V/cm. Grounded in the course
 * formula sheet (p.3) and Neamen ch7. The React widgets call `junctionState()`
 * and format with the helpers below.
 */

// ---- physical constants (cm units, to pair with doping in cm⁻³) ------------
const Q = 1.602e-19 // C
const EPS0 = 8.854e-14 // F/cm
const KB = 1.381e-23 // J/K
const KB_EV = 8.617e-5 // eV/K

export interface Material {
  key: 'Si' | 'Ge' | 'GaAs'
  he: string
  /** intrinsic carrier concentration n_i at 300K (cm⁻³). */
  ni: number
  /** relative permittivity ε_r. */
  epsR: number
  /** band gap E_g (eV). */
  eg: number
}

export const MATERIALS: Record<Material['key'], Material> = {
  Si: { key: 'Si', he: 'סיליקון · Si', ni: 1.5e10, epsR: 11.8, eg: 1.12 },
  Ge: { key: 'Ge', he: 'גרמניום · Ge', ni: 2.4e13, epsR: 16, eg: 0.67 },
  GaAs: { key: 'GaAs', he: 'גליום-ארסניד · GaAs', ni: 1.8e6, epsR: 13.1, eg: 1.42 },
}
export const MATERIAL_LIST: Material[] = [MATERIALS.Si, MATERIALS.Ge, MATERIALS.GaAs]

/** Thermal voltage kT/q (V). ≈ 0.02585 V at 300K. */
export const thermalVoltage = (T = 300): number => (KB * T) / Q

/**
 * Intrinsic carrier concentration at temperature T (cm⁻³), scaled from the
 * material's 300K value: n_i² = N_c N_v e^{−E_g/kT} with N_c N_v ∝ T³, so
 * n_i(T) = n_i(300)·(T/300)^{3/2}·exp[(E_g/2k)(1/300 − 1/T)]. Strongly rising
 * with T — this (not kT/q) is why V_bi DROPS as the junction heats up.
 */
export const niAt = (mat: Material, T = 300): number =>
  mat.ni * (T / 300) ** 1.5 * Math.exp((mat.eg / (2 * KB_EV)) * (1 / 300 - 1 / T))

/** Built-in potential V_bi = (kT/q)·ln(N_A·N_D / n_i²). */
export function builtInVoltage(Na: number, Nd: number, ni: number, T = 300): number {
  return thermalVoltage(T) * Math.log((Na * Nd) / (ni * ni))
}

export interface JunctionState {
  Vbi: number // built-in potential (V)
  dn: number // depletion width into the n-side (cm)
  dp: number // depletion width into the p-side (cm)
  d: number // total depletion width (cm)
  Emax: number // peak field magnitude at the junction (V/cm)
}

/**
 * Depletion-approximation solution for an abrupt junction under applied bias
 * `Va` (Va=0 → equilibrium). Forward bias (Va>0) shrinks the depletion region.
 */
export function junctionState(
  Na: number,
  Nd: number,
  mat: Material,
  Va = 0,
  T = 300,
): JunctionState {
  const Vbi = builtInVoltage(Na, Nd, niAt(mat, T), T)
  const epsS = mat.epsR * EPS0 // F/cm
  const drive = Math.max(Vbi - Va, 0) // V across the junction
  const k = (2 * epsS * drive) / Q // common factor (cm²·cm⁻³)
  const d = Math.sqrt(k * ((Na + Nd) / (Na * Nd)))
  const dn = Math.sqrt(k * (Na / (Nd * (Na + Nd))))
  const dp = Math.sqrt(k * (Nd / (Na * (Na + Nd))))
  const Emax = (Q * Nd * dn) / epsS // V/cm  (identically 2·drive/d)
  return { Vbi, dn, dp, d, Emax }
}

// ---- display helpers -------------------------------------------------------
export const cmToNm = (cm: number): number => cm * 1e7
export const cmToMicron = (cm: number): number => cm * 1e4

/** Format a length given in cm as nm or µm, whichever reads cleaner. */
export function fmtLength(cm: number): string {
  const nm = cmToNm(cm)
  if (nm < 1000) return `${nm.toFixed(0)} nm`
  return `${cmToMicron(cm).toFixed(2)} µm`
}

/** Depletion (junction) capacitance per unit area, C/A = ε_s / d (F/cm²). */
export const capPerArea = (epsR: number, dCm: number): number => (epsR * EPS0) / dCm

/** Format a capacitance-per-area (F/cm²) as nF/cm². */
export const fmtCapPerArea = (fPerCm2: number): string => `${(fPerCm2 * 1e9).toFixed(1)} nF/cm²`

/** Format a field given in V/cm as kV/cm. */
export const fmtField = (vPerCm: number): string => `${(vPerCm / 1e3).toFixed(1)} kV/cm`

/** Format a voltage (V) with 3 significant places. */
export const fmtVolt = (v: number): string => `${v.toFixed(3)} V`

/** Format a carrier concentration (cm⁻³) as a plain "m×10^e" string (readouts). */
export function fmtCarrier(n: number): string {
  const exp = Math.floor(Math.log10(n))
  const mant = n / 10 ** exp
  return `${mant.toFixed(1)}×10^${exp}`
}

/** Format a doping concentration (cm⁻³) as a ×10ⁿ string for labels. */
export function fmtDoping(n: number): string {
  const exp = Math.floor(Math.log10(n))
  const mant = n / 10 ** exp
  const m = Math.abs(mant - 1) < 0.05 ? '' : `${mant.toFixed(1)}·`
  return `${m}10^{${exp}}`
}
