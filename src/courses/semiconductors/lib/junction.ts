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
  /** electron affinity χ (eV) — vacuum level to E_c; sets the Schottky barrier. */
  chi: number
  /** effective conduction-band density of states N_c (cm⁻³) — sets E_c−E_F=V_T·ln(N_c/N_D). */
  nc: number
  /** effective Richardson constant A* (A·cm⁻²·K⁻²) for thermionic emission. */
  astar: number
}

// Representative textbook values (300K). Mobilities cm²/V·s, lifetimes s.
// χ/N_c/A* (Sze/Neamen): A* = 120·(m*_DOS/m_0) — note GaAs is ~13× smaller than Si.
export const MATERIALS: Record<Material['key'], Material> = {
  Si: { key: 'Si', he: 'סיליקון · Si', ni: 1.5e10, epsR: 11.8, eg: 1.12, mun: 1350, mup: 480, taun: 1e-6, taup: 1e-6, chi: 4.05, nc: 2.8e19, astar: 110 },
  Ge: { key: 'Ge', he: 'גרמניום · Ge', ni: 2.4e13, epsR: 16, eg: 0.67, mun: 3900, mup: 1900, taun: 1e-3, taup: 1e-3, chi: 4.0, nc: 1.04e19, astar: 50 },
  GaAs: { key: 'GaAs', he: 'גליום-ארסניד · GaAs', ni: 1.8e6, epsR: 13.1, eg: 1.42, mun: 8500, mup: 400, taun: 1e-8, taup: 1e-8, chi: 4.07, nc: 4.7e17, astar: 8.2 },
}
export const MATERIAL_LIST: Material[] = [MATERIALS.Si, MATERIALS.Ge, MATERIALS.GaAs]

/** A metal contact, identified by its work function φ_m (eV) — vacuum level to E_F. */
export interface Metal {
  key: string
  he: string
  /** work function φ_m (eV). */
  phiM: number
}

// Vacuum work functions (eV), textbook values. On real Si the measured barrier is
// largely pinned (Bardeen) and nearly metal-independent — the ideal φ_B=φ_m−χ is taught here.
export const METALS: Record<string, Metal> = {
  Al: { key: 'Al', he: 'אלומיניום · Al', phiM: 4.28 },
  Ti: { key: 'Ti', he: 'טיטניום · Ti', phiM: 4.33 },
  Ag: { key: 'Ag', he: 'כסף · Ag', phiM: 4.26 },
  W: { key: 'W', he: 'טונגסטן · W', phiM: 4.55 },
  Au: { key: 'Au', he: 'זהב · Au', phiM: 5.1 },
  Pt: { key: 'Pt', he: 'פלטינה · Pt', phiM: 5.65 },
}
export const METAL_LIST: Metal[] = [METALS.Al, METALS.Ti, METALS.Ag, METALS.W, METALS.Au, METALS.Pt]

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
 *
 * Optional `jkf` (knee current, A/cm²) turns on HIGH-LEVEL INJECTION (Webster /
 * SPICE-IKF): above J_KF the diffusion current rolls from slope 1/V_T to 1/2V_T
 * (apparent n → 2), via J_diff/√(1+J_diff/J_KF). Default Infinity = low injection.
 */
export function nonIdealCurrents(Na: number, Nd: number, mat: Material, Vj: number, tau0: number, T = 300, jkf = Infinity): NonIdealCurrents {
  const ni = niAt(mat, T)
  const W = junctionState(Na, Nd, mat, Vj, T).d
  const Jr0 = (Q * ni * W) / (2 * tau0)
  const JdiffIdeal = diodeCurrents(Na, Nd, mat, Vj, T).J
  const Jdiff = JdiffIdeal > 0 && Number.isFinite(jkf) ? JdiffIdeal / Math.sqrt(1 + JdiffIdeal / jkf) : JdiffIdeal
  const Jrec = Jr0 * (Math.exp(Vj / (2 * thermalVoltage(T))) - 1)
  return { Jdiff, Jrec, Jtot: Jdiff + Jrec, W, Jr0 }
}

/**
 * Small-signal (dynamic) resistance of the junction: r_d = dV/dI = n·V_T/|J|
 * (Ω·cm², per unit area). Bias-dependent — drops as 1/I — unlike the fixed series
 * resistance R_S. `n` is the local ideality factor at the operating point.
 */
export const diodeDynamicResistance = (n: number, J: number, T = 300): number => (n * thermalVoltage(T)) / Math.abs(J)

/**
 * Terminal voltage after the specific series-resistance drop:
 *   V_term = V_j + J_tot·R_S   (R_S in Ω·cm², J_tot in A/cm² ⇒ drop in V).
 * Plotting parametrically at x=V_term (sweeping V_j) yields the exact high-current
 * "bend" without an implicit solve. Forward-monotonic, so the curve never folds.
 */
export const terminalVoltage = (Vj: number, Jtot: number, rs: number): number => Vj + Jtot * rs

// ---- switching / transients (charge storage, reverse recovery) — lecture 2ב ----
/** Effective transit/storage time τ_F (s): 1/τ_F = 1/τ + 2D/W². Long base (W≫L, or W
 *  omitted) → τ_F=τ; short base (W≪L) → τ_F=W²/(2D). W = neutral-base width (NOT the
 *  depletion width). D cm²/s, τ s, W cm. */
export const transitTime = (D: number, tau: number, W = Infinity): number =>
  Number.isFinite(W) ? 1 / (1 / tau + (2 * D) / (W * W)) : tau

/** Diffusion (storage) capacitance per area (F/cm²): C_diff = τ_F/r_d = τ_F·|J|/(n·V_T).
 *  Grows ∝ forward current → dominates C_dep in forward bias (where C_dep is small). */
export const diffusionCapacitancePerArea = (tauF: number, n: number, J: number, T = 300): number =>
  (tauF * Math.abs(J)) / (n * thermalVoltage(T))

/** Stored minority charge per area in forward conduction (C/cm²): Q = |J|·τ (charge-control). */
export const storedCharge = (J: number, tau: number): number => Math.abs(J) * tau

/** Reverse-recovery storage time (s), charge-control long-base step: t_s = τ·ln(1+I_F/I_R).
 *  τ = minority lifetime (long base) or τ_F (short). → 0 as τ→0 (Schottky: no stored charge). */
export const storageTime = (tau: number, If: number, Ir: number): number =>
  tau * Math.log(1 + If / Math.max(Ir, 1e-300))

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

// ---- Schottky diode (metal–semiconductor) — lecture 2ג ---------------------
export interface SchottkyState {
  phiB: number // barrier height φ_B = φ_m − χ (eV), bias-independent
  xi: number // bulk offset ξ = E_c − E_F (eV)
  Vbi: number // built-in potential V_bi = φ_B − ξ (V)
  rectifying: boolean // V_bi > 0 (φ_m > φ_s) — else ohmic/accumulation
  degenerate: boolean // N_D ≥ N_c — the non-degenerate ξ formula breaks down
  W: number // one-sided depletion width into the semiconductor (cm)
  Jst: number // thermionic saturation current density (A/cm²)
  J: number // current density at bias Va (A/cm²)
  Vturn: number // turn-on voltage at J = 1 A/cm² (V)
}

/** Ideal Schottky-Mott barrier height (n-type): φ_B = φ_m − χ (eV). Bias-independent. */
export const schottkyBarrier = (phiM: number, chi: number): number => phiM - chi

/** Bulk conduction offset ξ = E_c − E_F = V_T·ln(N_c/N_D) (eV). ≤0 ⇒ degenerate (N_D ≥ N_c). */
export const bulkOffset = (nc: number, Nd: number, T = 300): number => thermalVoltage(T) * Math.log(nc / Nd)

/** Built-in potential of the metal–semiconductor junction: V_bi = φ_B − ξ = φ_m − φ_s (V). */
export const schottkyVbi = (phiM: number, chi: number, nc: number, Nd: number, T = 300): number =>
  schottkyBarrier(phiM, chi) - bulkOffset(nc, Nd, T)

/** Rectifying (n-type) when φ_m > φ_s = χ + ξ, i.e. V_bi > 0. Otherwise the contact is ohmic. */
export const isRectifying = (phiM: number, chi: number, nc: number, Nd: number, T = 300): boolean =>
  schottkyVbi(phiM, chi, nc, Nd, T) > 0

/** One-sided depletion width in the semiconductor: W = √(2ε_s(V_bi−V_A)/(q N_D)) (cm). */
export function schottkyWidth(mat: Material, Nd: number, Va: number, Vbi: number): number {
  const epsS = mat.epsR * EPS0
  const drive = Math.max(Vbi - Va, 0)
  return Math.sqrt((2 * epsS * drive) / (Q * Nd))
}

/** Thermionic saturation current density J_ST = A*·T²·e^{−φ_B/V_T} (A/cm²). φ_B in eV(≈V). */
export const thermionicJst = (astar: number, phiB: number, T = 300): number =>
  astar * T * T * Math.exp(-phiB / thermalVoltage(T))

/**
 * Thermionic-emission current of a Schottky diode: majority carriers over the
 * barrier, J = J_ST·(e^{V_A/V_T} − 1). Forward rises exponentially; reverse
 * saturates at −J_ST because the metal-side barrier φ_B is fixed by bias.
 */
export const schottkyCurrent = (astar: number, phiB: number, Va: number, T = 300): number =>
  thermionicJst(astar, phiB, T) * (Math.exp(Va / thermalVoltage(T)) - 1)

/** Forward turn-on voltage where J reaches Jref (default 1 A/cm²): V = V_T·ln(Jref/J_ST + 1). */
export const schottkyTurnOn = (astar: number, phiB: number, Jref = 1, T = 300): number =>
  thermalVoltage(T) * Math.log(Jref / thermionicJst(astar, phiB, T) + 1)

/** Image-force barrier lowering Δφ_B = √(qE_max/4πε_s) (eV) — why real reverse current isn't truly flat. */
export const imageForceLowering = (mat: Material, Emax: number): number =>
  Math.sqrt((Q * Math.max(Emax, 0)) / (4 * Math.PI * mat.epsR * EPS0))

// ---- surface states / Fermi-level pinning (the OTHER non-ideal effect, n-type) ----
/** Charge-neutrality level φ_0 measured UP from E_v (Si-like): φ_0 = E_g/3. States below
 *  E_0=E_v+φ_0 are donor-like (filled at neutrality), above acceptor-like (empty). */
export const neutralLevel = (eg: number): number => eg / 3

/** Fully-pinned (Bardeen) electron barrier φ_Bn = E_c−E_0 = E_g−φ_0 = ⅔E_g (eV). Si≈0.75. */
export const pinnedBarrier = (eg: number): number => eg - neutralLevel(eg)

/** Classic pinning threshold (interface-trap density, cm⁻²eV⁻¹) ≈ ε_i/(q²δ). */
export const PIN_DCRIT = 1e13
/** Cowley–Sze pinning factor S∈(0,1]: S=1 ideal (Schottky-Mott), S→0 fully pinned.
 *  S=1/(1+D_it/D_crit) ≡ ε_i/(ε_i+q²δD_it). */
export const pinningFactor = (Dit: number, Dcrit = PIN_DCRIT): number => 1 / (1 + Math.max(Dit, 0) / Dcrit)

/** Interpolated n-type barrier φ_Bn = S·(φ_m−χ) + (1−S)·⅔E_g, clamped to [0,E_g].
 *  small D_it → φ_m−χ (metal-dependent, ideal); large D_it → ⅔E_g (pinned, metal-independent). */
export function surfaceBarrier(phiM: number, chi: number, eg: number, Dit: number, Dcrit = PIN_DCRIT): number {
  const S = pinningFactor(Dit, Dcrit)
  return Math.min(Math.max(S * schottkyBarrier(phiM, chi) + (1 - S) * pinnedBarrier(eg), 0), eg)
}

/** Where E_F sits above the neutral level E_0 at the surface (eV): φ_B(pinned) − φ_B(D_it).
 *  → 0 as D_it→∞ (E_F pinned to E_0); = (φ_m−χ)−⅔E_g in the ideal limit. */
export const fermiAboveNeutral = (phiM: number, chi: number, eg: number, Dit: number, Dcrit = PIN_DCRIT): number =>
  pinnedBarrier(eg) - surfaceBarrier(phiM, chi, eg, Dit, Dcrit)

/** Everything the Schottky widgets need, from one call (mirrors junctionState/diodeCurrents). */
export function schottkyState(metal: Metal, mat: Material, Nd: number, Va: number, T = 300): SchottkyState {
  const phiB = schottkyBarrier(metal.phiM, mat.chi)
  const xi = bulkOffset(mat.nc, Nd, T)
  const Vbi = phiB - xi
  return {
    phiB,
    xi,
    Vbi,
    rectifying: Vbi > 0,
    degenerate: Nd >= mat.nc,
    W: schottkyWidth(mat, Nd, Va, Vbi),
    Jst: thermionicJst(mat.astar, phiB, T),
    J: schottkyCurrent(mat.astar, phiB, Va, T),
    Vturn: schottkyTurnOn(mat.astar, phiB, 1, T),
  }
}

// ---- ohmic metal–semiconductor contact — lecture 2ד ------------------------
export type OhmicRegime = 'TE' | 'TFE' | 'FE'
export interface OhmicState {
  phiB: number // Schottky barrier φ_B = φ_m − χ (eV)
  xi: number // bulk offset ξ (eV)
  Vbi: number // built-in potential (V); <0 ⇒ accumulation/ohmic
  accumulation: boolean // φ_m < φ_s ⇒ no barrier, electron accumulation (ideal-ohmic route)
  E00: number // tunneling characteristic energy (eV)
  regime: OhmicRegime // transport regime by E_00 vs kT
  W: number // one-sided depletion width at equilibrium (cm); 0 in accumulation
  rhoC: number // specific contact resistance (Ω·cm²)
  degenerate: boolean
}

/**
 * Tunneling (conductivity) effective-mass ratio m* / m₀ — the mass that sets the
 * tunnel probability. NOT the DOS mass implied by A* (≈120·m_DOS): for tunneling
 * Si≈0.26, Ge≈0.12, GaAs≈0.067. A small local lookup so `Material` stays untouched.
 */
export const tunnelingMass = (mat: Material): number => ({ Si: 0.26, Ge: 0.12, GaAs: 0.067 }[mat.key])

/**
 * Tunneling characteristic energy E₀₀ = (qℏ/2)·√(N_D/(ε_s·m*)) (eV). Worked into a
 * closed form with N_D in cm⁻³: E₀₀[eV] = 1.857e-11·√(N_D/(ε_r·m_r)) (SI constants
 * folded in; verified Si,1e19 → 33.5 meV). Rises with √N_D; bigger for lighter m*.
 */
export const e00 = (mat: Material, Nd: number): number => 1.857e-11 * Math.sqrt(Nd / (mat.epsR * tunnelingMass(mat)))

/**
 * Transport regime of the contact, by E₀₀ vs kT: thermionic emission (TE, low
 * doping → rectifying), thermionic-field (TFE), or field emission (FE, heavy
 * doping → tunneling → ohmic). Boundaries 0.5·kT and 5·kT.
 */
export function tunnelRegime(mat: Material, Nd: number, T = 300): OhmicRegime {
  const kT = KB_EV * T
  const E = e00(mat, Nd)
  if (E < 0.5 * kT) return 'TE'
  if (E <= 5 * kT) return 'TFE'
  return 'FE'
}

/**
 * Specific contact resistance ρ_c (Ω·cm²). Uses the Padovani–Stratton crossover
 * energy E₀ = E₀₀·coth(E₀₀/kT) so the single formula spans all regimes WITHOUT
 * overflow: in TE (E₀₀≪kT) E₀→kT ⇒ ρ_c = (k_B/qA*T)·e^{φ_B/kT} (finite, ~Ω·cm²
 * for light doping); in FE (E₀₀≫kT) E₀→E₀₀ ⇒ ρ_c ∝ e^{φ_B/E₀₀} ∝ e^{C·φ_B/√N_D}
 * (the exponential collapse). The prefactor is the thermionic k_B/(q·A*·T).
 */
export function specificContactResistance(metal: Metal, mat: Material, Nd: number, T = 300): number {
  const phiB = schottkyBarrier(metal.phiM, mat.chi)
  const E = e00(mat, Nd)
  const kT = KB_EV * T
  const E0 = E / Math.tanh(E / kT) // E₀₀·coth(E₀₀/kT)
  const RHO0 = KB / (Q * mat.astar * T) // thermionic prefactor (Ω·cm²)
  return RHO0 * Math.exp(phiB / E0)
}

/** Ohmic via low barrier / accumulation: φ_m < φ_s (n-type) ⇔ V_bi < 0 (not φ_B<0). */
export const isAccumulation = (metal: Metal, mat: Material, Nd: number, T = 300): boolean =>
  !isRectifying(metal.phiM, mat.chi, mat.nc, Nd, T)

/** Everything the ohmic-contact widgets need, from one call (mirrors schottkyState). */
export function ohmicState(metal: Metal, mat: Material, Nd: number, T = 300): OhmicState {
  const phiB = schottkyBarrier(metal.phiM, mat.chi)
  const xi = bulkOffset(mat.nc, Nd, T)
  const Vbi = phiB - xi
  return {
    phiB,
    xi,
    Vbi,
    accumulation: Vbi < 0,
    E00: e00(mat, Nd),
    regime: tunnelRegime(mat, Nd, T),
    W: schottkyWidth(mat, Nd, 0, Vbi),
    rhoC: specificContactResistance(metal, mat, Nd, T),
    degenerate: Nd >= mat.nc,
  }
}

// ---- general metal–semiconductor contact (n OR p) --------------------------
/** Majority-carrier type of the semiconductor. */
export type CarrierType = 'n' | 'p'

/**
 * The four fundamental metal–semiconductor cases reduce to one rule. φ_s=χ+(E_c−E_F).
 * The band-bending direction is sign(φ_m−φ_s), INDEPENDENT of type; whether that
 * bending rectifies depends on the type:
 *  • n-type rectifies when φ_m>φ_s (electron depletion, Schottky barrier);
 *  • p-type rectifies when φ_m<φ_s (hole depletion).
 * Otherwise the contact is ohmic (majority-carrier accumulation, no barrier).
 */
export const contactKind = (type: CarrierType, phiM: number, phiS: number): 'rectifying' | 'ohmic' =>
  (type === 'n' ? phiM > phiS : phiM < phiS) ? 'rectifying' : 'ohmic'

/**
 * Barrier height seen from the metal (eV), bias-independent. For n-type it is the
 * electron barrier φ_Bn=φ_m−χ; for p-type the hole barrier φ_Bp=χ+E_g−φ_m=E_g−φ_Bn.
 * (Meaningful for the rectifying cases; returned regardless so callers can label.)
 */
export const contactBarrier = (type: CarrierType, phiM: number, chi: number, eg: number): number =>
  type === 'n' ? phiM - chi : chi + eg - phiM

// ---- BJT — lecture 3א ------------------------------------------------------
/**
 * Base transport factor b = I_C/I_E(injected) = 1/cosh(W_B/L_B) — the fraction of
 * minority carriers injected at the emitter edge that survive diffusion across the
 * neutral base of width W_B to reach the collector (L_B = base diffusion length).
 * A thin base (W_B ≪ L_B) → b ≈ 1 − W_B²/2L_B² → 1: almost everything gets through,
 * which (with high injection efficiency γ) is *why* the transistor amplifies.
 * Quantitative α=b·γ, β=α/(1−α) are developed in 3ב.
 */
export const baseTransportFactor = (WB: number, L: number): number => 1 / Math.cosh(WB / L)

// ---- BJT currents & gain — lecture 3ב --------------------------------------
/**
 * Emitter injection efficiency γ = I_nE/(I_nE+I_pE) — the fraction of the emitter
 * current carried by the USEFUL injected minority carriers (electrons, for npn) vs the
 * wasteful back-injected majority carriers (holes into the emitter). For uniform
 * doping with a short emitter:
 *   γ = 1 / (1 + (N_B·D_E·W_B)/(N_E·D_B·W_E)).
 * Heavy emitter doping (N_E≫N_B) → γ→1. D_E/D_B are the minority diffusion coeffs in
 * the emitter/base, W_E/W_B the neutral widths.
 */
export const injectionEfficiency = (NE: number, NB: number, DE: number, DB: number, WE: number, WB: number): number =>
  1 / (1 + (NB * DE * WB) / (NE * DB * WE))

/** Common-base current gain α = γ·b (≈1). */
export const commonBaseAlpha = (gamma: number, b: number): number => gamma * b

/** Common-emitter current gain β = α/(1−α) ≫ 1. */
export const commonEmitterBeta = (alpha: number): number => alpha / (1 - alpha)

export interface BjtCurrents { iE: number; iC: number; iB: number }
/**
 * Ebers-Moll model (npn): two coupled diodes with current sources. Given the
 * forward/reverse gains α_F, α_R and the emitter saturation current I_ES (the
 * collector one follows from reciprocity α_F·I_ES = α_R·I_CS):
 *   I_F = I_ES(e^{V_BE/V_T}−1),  I_R = I_CS(e^{V_BC/V_T}−1)
 *   I_E = −I_F + α_R·I_R,  I_C = α_F·I_F − I_R,  I_B = −(I_E+I_C)  (KCL).
 */
export function ebersMoll(VBE: number, VBC: number, IES: number, aF: number, aR: number, T = 300): BjtCurrents {
  const VT = thermalVoltage(T)
  const ICS = (aF * IES) / aR
  const iF = IES * (Math.exp(VBE / VT) - 1)
  const iR = ICS * (Math.exp(VBC / VT) - 1)
  const iE = -iF + aR * iR
  const iC = aF * iF - iR
  return { iE, iC, iB: -(iE + iC) }
}

/**
 * Simplified common-emitter output characteristic I_C(V_CE) for a given base current:
 * a soft knee at V_CE≈V_k (the saturation region) rising to the flat active value β·I_B.
 *   I_C = β·I_B·(1 − e^{−V_CE/V_k}).
 * (The Early-effect upward slope in the active region is deferred to 3ג.)
 */
export const collectorOutput = (VCE: number, IB: number, beta: number, Vk = 0.06): number =>
  beta * IB * (1 - Math.exp(-Math.max(VCE, 0) / Vk))

/**
 * Common-base output characteristic I_C(V_CB) for a given EMITTER current I_E:
 * essentially flat at the active value α·I_E (near-infinite output resistance),
 * dropping to zero only once the collector junction is driven forward
 * (V_CB ≲ −V_off → saturation). I_C = α·I_E·(1 − e^{−(V_CB+V_off)/V_k}), clamped ≥0.
 * Contrast with the common-emitter family, whose knee sits at V_CE≈0.
 */
export const cbOutput = (VCB: number, IE: number, alpha: number, Vk = 0.06, Voff = 0.4): number =>
  Math.max(0, alpha * IE * (1 - Math.exp(-(VCB + Voff) / Vk)))

// ---- BJT non-ideal effects & models — lecture 3ג ---------------------------
/**
 * Output characteristic WITH the Early effect: the active-region current is no longer
 * flat but rises with V_CE, I_C = β·I_B·(1−e^{−V_CE/V_k})·(1+V_CE/V_A). Extrapolating
 * the active-region lines backwards, they all meet the V_CE axis at −V_A (the Early
 * voltage): base-width modulation makes W_B shrink as V_CE grows, raising I_C.
 */
export const collectorOutputEarly = (VCE: number, IB: number, beta: number, VA: number, Vk = 0.06): number =>
  collectorOutput(VCE, IB, beta, Vk) * (1 + Math.max(VCE, 0) / VA)

/** Small-signal output resistance r_o = V_A/I_C (the inverse of the Early slope). */
export const earlyResistance = (VA: number, IC: number): number => VA / IC

/**
 * Common-emitter breakdown BV_CEO = BV_CBO/β^{1/n} — lower than the common-base BV_CBO
 * because the transistor's own gain multiplies the avalanche-generated carriers. n is
 * the avalanche exponent (≈3–6).
 */
export const bvCeo = (bvCbo: number, beta: number, n = 4): number => bvCbo / Math.pow(beta, 1 / n)

/** Avalanche multiplication factor M = 1/(1−(V/BV)^n) — diverges at the breakdown voltage. */
export const avalancheMultiplication = (V: number, BV: number, n = 4): number =>
  1 / (1 - Math.pow(Math.min(Math.abs(V) / BV, 0.999), n))

/**
 * Current gain β as a function of collector current (log-bell shape): flat at β_max in
 * the mid-range, falling at LOW I_C (B-E depletion recombination, the n=2 component) and
 * at HIGH I_C (high-level injection). β = β_max/(1 + I_lo/I_C + I_C/I_hi).
 */
export const betaVsIc = (IC: number, betaMax: number, Ilo: number, Ihi: number): number =>
  betaMax / (1 + Ilo / IC + IC / Ihi)

/** Gummel-plot collector current I_C = I_S·e^{V_BE/V_T} (ideal, slope one decade per ~60 mV). */
export const gummelIc = (VBE: number, IS: number, T = 300): number => IS * Math.exp(VBE / thermalVoltage(T))
/**
 * Gummel-plot base current: the ideal part I_C/β_max plus a low-V_BE recombination part
 * (ideality n=2). The vertical gap log(I_C)−log(I_B) is log(β_F).
 */
export const gummelIb = (VBE: number, IS: number, betaMax: number, IB2: number, T = 300): number => {
  const VT = thermalVoltage(T)
  return (IS * Math.exp(VBE / VT)) / betaMax + IB2 * Math.exp(VBE / (2 * VT))
}

/** Small-signal transconductance g_m = I_C/V_T. */
export const transconductance = (IC: number, T = 300): number => IC / thermalVoltage(T)
/** Small-signal input resistance r_π = β/g_m = β·V_T/I_C. */
export const rPi = (beta: number, gm: number): number => beta / gm

/** AC common-emitter current gain magnitude |β(f)| = β₀/√(1+(f/f_β)²), with f_β = f_T/β₀. */
export const currentGainAC = (beta0: number, f: number, fT: number): number => {
  const fBeta = fT / beta0
  return beta0 / Math.sqrt(1 + (f / fBeta) ** 2)
}
/** Cutoff (unity-gain) frequency f_T = g_m/(2π·C). */
export const cutoffFrequency = (gm: number, C: number): number => gm / (2 * Math.PI * C)

/** Two resistors in parallel: R₁∥R₂ = R₁R₂/(R₁+R₂). */
export const parallelR = (r1: number, r2: number): number => (r1 * r2) / (r1 + r2)
/** Common-emitter small-signal voltage gain A_v = −g_m·(r_o∥R_C) (inverting). */
export const voltageGainCE = (gm: number, ro: number, RC: number): number =>
  -gm * parallelR(ro, RC)

/**
 * Common-base small-signal voltage gain A_v = +g_m·(r_o∥R_C) — same magnitude as
 * the CE gain but NON-inverting (the input drives the emitter). The current gain is
 * only ≈α≈1, and the input resistance is the low emitter resistance r_e=1/g_m.
 */
export const voltageGainCB = (gm: number, ro: number, RC: number): number =>
  gm * parallelR(ro, RC)

/** Emitter (small-signal) resistance r_e = 1/g_m = V_T/I_C — the CB input resistance. */
export const emitterResistance = (gm: number): number => 1 / gm

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
