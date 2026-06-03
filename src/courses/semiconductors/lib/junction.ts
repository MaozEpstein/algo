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
  /** electron / hole mobilities (cm²/V·s) — set the diffusion coefficients via Einstein. */
  mun: number
  mup: number
  /** minority-carrier lifetimes (s) — set the diffusion lengths L=√(Dτ). */
  taun: number
  taup: number
}

// Representative textbook values (300K). Mobilities cm²/V·s, lifetimes s.
export const MATERIALS: Record<Material['key'], Material> = {
  Si: { key: 'Si', he: 'סיליקון · Si', ni: 1.5e10, epsR: 11.8, eg: 1.12, mun: 1350, mup: 480, taun: 1e-6, taup: 1e-6 },
  Ge: { key: 'Ge', he: 'גרמניום · Ge', ni: 2.4e13, epsR: 16, eg: 0.67, mun: 3900, mup: 1900, taun: 1e-3, taup: 1e-3 },
  GaAs: { key: 'GaAs', he: 'גליום-ארסניד · GaAs', ni: 1.8e6, epsR: 13.1, eg: 1.42, mun: 8500, mup: 400, taun: 1e-8, taup: 1e-8 },
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

// ---- reverse problems (recover doping from a measured V_bi / width) --------
/**
 * One-sided junction (N_A ≫ N_D): the depletion sits almost entirely in the
 * lightly-doped side, so d ≈ √(2ε_s V_bi / q N_D). Inverting recovers the
 * LIGHT-side doping from the measured built-in voltage and depletion width.
 * Accuracy is of order N_D/N_A (negligible for a strongly one-sided junction).
 */
export const dopingFromWidth = (epsR: number, Vbi: number, dCm: number): number =>
  (2 * epsR * EPS0 * Vbi) / (Q * dCm * dCm)

/**
 * Recover the remaining doping from V_bi and one known side, via
 * V_bi = (kT/q)·ln(N_A N_D / n_i²)  ⇒  N = (n_i² / N_known)·e^{qV_bi/kT}.
 */
export const dopingFromVbi = (Vbi: number, nKnown: number, ni: number, T = 300): number =>
  ((ni * ni) / nKnown) * Math.exp(Vbi / thermalVoltage(T))

// ---- bias (the diode under applied voltage) --------------------------------
/**
 * Law of the junction: the minority-carrier concentration at the edge of the
 * depletion region under applied bias V_A, n_p(0) = n_{p0}·e^{V_A/V_T}. Forward
 * bias (V_A>0) raises it exponentially (injection); reverse (V_A<0) drops it
 * toward 0 (extraction). `n0` is the equilibrium minority concentration
 * (n_i²/N_major). This is the bridge to the diode current (derived in part ב).
 */
export const minorityAtEdge = (n0: number, Va: number, T = 300): number =>
  n0 * Math.exp(Va / thermalVoltage(T))

// ---- ideal diode (Shockley) — lecture 2 ------------------------------------
/** Einstein relation: diffusion coefficient D = (kT/q)·μ (cm²/s). */
export const diffusionCoeff = (mu: number, T = 300): number => thermalVoltage(T) * mu

/** Minority diffusion length L = √(Dτ) (cm). */
export const diffusionLength = (D: number, tau: number): number => Math.sqrt(D * tau)

export interface DiodeCurrents {
  Js: number // saturation current density (A/cm²)
  JsP: number // hole contribution (injection into the n-side)
  JsN: number // electron contribution (injection into the p-side)
  J: number // total current density at bias Va (A/cm²)
}

/**
 * Ideal-diode (Shockley) currents per unit area for an abrupt junction:
 *   J_S = q·n_i²·(D_p/(L_p·N_D) + D_n/(L_n·N_A)),   J = J_S·(e^{V_A/V_T} − 1).
 * J_p (holes) is injected into the n-side, J_n (electrons) into the p-side; the
 * lightly-doped side dominates. Diffusion only (no recombination in the
 * depletion region) — the ideal model. Saturation current rises steeply with T
 * (∝ n_i²).
 */
export function diodeCurrents(Na: number, Nd: number, mat: Material, Va = 0, T = 300): DiodeCurrents {
  const ni = niAt(mat, T)
  const Dp = diffusionCoeff(mat.mup, T)
  const Dn = diffusionCoeff(mat.mun, T)
  const Lp = diffusionLength(Dp, mat.taup)
  const Ln = diffusionLength(Dn, mat.taun)
  const JsP = (Q * ni * ni * Dp) / (Lp * Nd) // holes into n-side
  const JsN = (Q * ni * ni * Dn) / (Ln * Na) // electrons into p-side
  const Js = JsP + JsN
  const J = Js * (Math.exp(Va / thermalVoltage(T)) - 1)
  return { Js, JsP, JsN, J }
}

// ---- long vs short base diode — lecture 2א ---------------------------------
/**
 * Normalized excess minority profile in a neutral base of width `WB` ending in an
 * ohmic contact (Δp=0 there): Δp(x)/Δp(0) = sinh((WB−x)/L) / sinh(WB/L), the exact
 * steady-state diffusion solution. Long base (WB≫L) → e^{−x/L} (exponential decay,
 * carriers recombine before reaching the contact). Short base (WB≪L) → linear
 * (WB−x)/WB (carriers reach the contact before recombining). x and WB in cm.
 */
export function shortBaseProfile(x: number, WB: number, L: number): number {
  return Math.sinh((WB - x) / L) / Math.sinh(WB / L)
}

/**
 * The effective diffusion length that replaces L in J_S for a finite base:
 * L_eff = L·tanh(WB/L). Long base → L (recombination-limited); short base → WB
 * (transit-limited). The boundary slope at x=0 is Δp(0)/L_eff, so the initial
 * tangent of the profile hits zero exactly at L_eff.
 */
export const effectiveLength = (WB: number, L: number): number => L * Math.tanh(WB / L)

/**
 * Factor by which a finite (short) base boosts the saturation current over the
 * long-base value: J_S ∝ 1/L_eff, so the multiplier is L/L_eff = coth(WB/L) ≥ 1.
 * ≈1 for a long base, large for a short one (the steeper profile = more current).
 */
export const shortBaseCurrentFactor = (WB: number, L: number): number => 1 / Math.tanh(WB / L)

// ---- non-ideal diode — lecture 2ב ------------------------------------------
export interface NonIdealCurrents {
  Jdiff: number // ideal diffusion current (n=1)            (A/cm²)
  Jrec: number // depletion-region recombination/generation (n=2) (A/cm²)
  Jtot: number // Jdiff + Jrec                              (A/cm²)
  W: number // depletion width at this bias                 (cm)
  Jr0: number // recombination/generation prefactor q·n_i·W/(2τ₀) (A/cm²)
}

/**
 * Depletion-region recombination/generation current density (A/cm²) at junction
 * voltage `Vj` — the Sah–Noyce–Shockley n=2 term that the ideal model omits:
 *   J_rec = (q·n_i·W)/(2τ₀)·(e^{V_j/2V_T} − 1).
 * W = depletion width (grows under reverse bias as √(V_bi+|V_j|)); τ₀ is the
 * effective SRH lifetime (symmetric convention τ_n=τ_p=τ₀). Forward → +; reverse
 * → a small GENERATION current −q·n_i·W/(2τ₀) that GROWS with |V_j| (∝ W), so the
 * real reverse current is not saturated. `niAt`/`junctionState` supply n_i and W.
 */
export function recombCurrent(Na: number, Nd: number, mat: Material, Vj: number, tau0: number, T = 300): number {
  const ni = niAt(mat, T)
  const W = junctionState(Na, Nd, mat, Vj, T).d
  const Jr0 = (Q * ni * W) / (2 * tau0)
  return Jr0 * (Math.exp(Vj / (2 * thermalVoltage(T))) - 1)
}

/**
 * The full non-ideal junction current as the sum of the ideal diffusion term
 * (n=1, from `diodeCurrents`) and the depletion recombination/generation term
 * (n=2, from `recombCurrent`). Returns every branch so plots and tests can show
 * the crossover (low forward → recombination dominates, higher → diffusion) and
 * the non-saturating reverse current. Series resistance is applied separately
 * via `terminalVoltage` (parametric), not here — this is the junction-voltage law.
 */
export function nonIdealCurrents(Na: number, Nd: number, mat: Material, Vj: number, tau0: number, T = 300): NonIdealCurrents {
  const ni = niAt(mat, T)
  const W = junctionState(Na, Nd, mat, Vj, T).d
  const Jr0 = (Q * ni * W) / (2 * tau0)
  const Jdiff = diodeCurrents(Na, Nd, mat, Vj, T).J
  const Jrec = Jr0 * (Math.exp(Vj / (2 * thermalVoltage(T))) - 1)
  return { Jdiff, Jrec, Jtot: Jdiff + Jrec, W, Jr0 }
}

/**
 * Terminal voltage after the specific series-resistance drop:
 *   V_term = V_j + J_tot·R_S   (R_S in Ω·cm², J_tot in A/cm² ⇒ drop in V).
 * Plotting parametrically at x=V_term (sweeping V_j) yields the exact high-current
 * "bend" without an implicit solve. Forward-monotonic, so the curve never folds.
 */
export const terminalVoltage = (Vj: number, Jtot: number, rs: number): number => Vj + Jtot * rs

/**
 * Lumped "engineering" diode model J = J_S·(e^{V_j/(n·V_T)} − 1) with a single
 * ideality factor `n` (1 = pure diffusion, 2 = recombination/high-injection).
 * Used for the dashed overlay in the sandbox — the same physics collapsed into
 * one knob — so students see how the emergent n abstracts the two-exponential sum.
 */
export function lumpedDiodeCurrent(Na: number, Nd: number, mat: Material, Vj: number, n: number, T = 300): number {
  const Js = diodeCurrents(Na, Nd, mat, 0, T).Js
  return Js * (Math.exp(Vj / (n * thermalVoltage(T))) - 1)
}

/**
 * Floor for the logarithmic current axis of the non-ideal curve: the generation
 * prefactor J_{r0}=q·n_i·W/(2τ₀) at equilibrium. Unlike the ideal curve (floored
 * at J_S), the non-ideal reverse/low-bias current is set by recombination, which
 * is typically orders larger than J_S — flooring at J_S would clip the curve.
 */
export function logFloor(Na: number, Nd: number, mat: Material, tau0: number, T = 300): number {
  const ni = niAt(mat, T)
  const W = junctionState(Na, Nd, mat, 0, T).d
  return (Q * ni * W) / (2 * tau0)
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

/** Format a current density (A/cm²) — scientific notation spans the huge range
 *  from reverse saturation (~10⁻¹¹) to forward (~10¹). */
export function fmtCurrentDensity(j: number): string {
  if (j === 0) return '0 A/cm²'
  const a = Math.abs(j)
  const exp = Math.floor(Math.log10(a))
  const mant = a / 10 ** exp
  const sign = j < 0 ? '−' : ''
  return `${sign}${mant.toFixed(1)}×10^${exp} A/cm²`
}

/**
 * Visualization helper — a *perceptual* conduction level in [0,1] for the diode
 * circuit animation (particle count / speed / glow). The real current spans ~13
 * decades, so we map |J| logarithmically between two reference currents:
 *   Jlo = 1e-6 A/cm² ("barely conducting")  →  0
 *   Jhi = 1e2  A/cm² ("fully on")            →  1
 * Reverse and equilibrium fall below Jlo → 0 (blocked); forward ramps smoothly
 * to 1. Material-aware through diodeCurrents (a smaller-gap material lights up at
 * a lower V_A). NOT a physical quantity — purely for driving the animation.
 */
export function conductionLevel(Na: number, Nd: number, mat: Material, Va: number, T = 300): number {
  const J = diodeCurrents(Na, Nd, mat, Va, T).J
  if (J <= 0) return 0 // reverse / equilibrium → blocked
  const Jlo = 1e-6
  const Jhi = 1e2
  const lvl = (Math.log10(J) - Math.log10(Jlo)) / (Math.log10(Jhi) - Math.log10(Jlo))
  return Math.max(0, Math.min(1, lvl))
}

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
