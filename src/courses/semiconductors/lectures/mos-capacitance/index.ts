import type { LectureModule } from '@/core/engine/types'
import MosCapacitanceExplainer from './MosCapacitanceExplainer'

/**
 * Semiconductors — Lesson 6ג: the MOS capacitor, part 3 — the AC / capacitance picture. A small AC
 * signal on top of the DC bias probes the capacitance C=dQ_G/dV_G. The gate sees C_ox in series
 * with C_s‖C_ss (1/C=1/C_ox+1/(C_s+C_ss)), giving the textbook C-V curve. The inversion branch is
 * frequency-dependent — LF recovers to C_ox, HF locks at C_min=C_ox‖C_dep,max, and a fast ramp
 * gives deep depletion. A body bias V_R tunes the curve (varactor). Capped by the flagship sandbox
 * that ties the whole lesson together (DC↔AC, regimes, charge motion, live C-V).
 */
export const mosCapacitanceLecture: LectureModule = {
  id: 'mos-capacitance',
  number: 6.3,
  numberLabelHe: '6 · חלק ג׳',
  lessonHe: 'קבל MOS',
  titleHe: 'קבל MOS — קיבול ו-C-V',
  subtitleEn: 'The MOS Capacitor: Capacitance & C-V',
  views: [],
  algorithms: [],
  summary: MosCapacitanceExplainer,
  explainer: true,
  glossary: [
    { term: 'קיבול $C$', def: 'תגובת מטען-השער לאות-קטן: $C=dQ_G/dV_G$. נמדד עם אות AC מעל נקודת-העבודה.', tex: 'C\\equiv\\dfrac{dQ_G}{dV_G}' },
    { term: 'קיבול-מחסור $C_{dep}$', def: 'קיבול אזור-המחסור, $\\varepsilon_s/W$ — קטֵן ככל ש-$W$ גדל.', tex: 'C_{dep}=\\dfrac{\\varepsilon_s}{W}' },
    { term: 'קיבול-מל"מ $C_s$', def: 'תגובת מטען פני-השטח לשינוי $\\psi_s$: $-dQ_s/d\\psi_s$; גדול בהצטברות/היפוך.', tex: 'C_s=-\\dfrac{dQ_s}{d\\psi_s}' },
    { term: 'צירוף טורי', def: 'השער רואה את $C_{ox}$ בטור עם $C_s\\|C_{ss}$.', tex: '\\dfrac{1}{C}=\\dfrac{1}{C_{ox}}+\\dfrac{1}{C_s+C_{ss}}' },
    { term: 'תגובת-תדר (LF/HF/DD)', def: 'בהיפוך: תדר נמוך → $C\\to C_{ox}$; תדר גבוה → ננעל על $C_{min}$; סריקה מהירה → דלדול-עמוק ($C<C_{min}$).' },
    { term: 'קבל מבוקר-צומת (Varactor)', def: 'מתח אחורי $V_R$ מזיז את אופיין ה-$C\\text{-}V$ (מעלה $V_T$, מוריד $C_{min}$) — קבל מתכוונן במתח.' },
  ],
  formulas: [
    { name: 'הגדרת הקיבול', tex: 'C\\equiv\\dfrac{dQ_G}{dV_G}' },
    { name: 'קיבול-אוקסיד', tex: 'C_{ox}=\\dfrac{\\varepsilon_{ox}\\varepsilon_0}{t_{ox}}' },
    { name: 'קיבול-מחסור', tex: 'C_{dep}=\\dfrac{\\varepsilon_s}{W}' },
    { name: 'צירוף טורי', tex: '\\dfrac{1}{C}=\\dfrac{1}{C_{ox}}+\\dfrac{1}{C_s+C_{ss}}' },
    { name: 'קיבול-מל"מ', tex: 'C_s=-\\dfrac{dQ_s}{d\\psi_s}' },
    { name: 'רצפת היפוך (HF)', tex: 'C_{min}=C_{ox}\\,\\|\\,C_{dep,\\max}' },
  ],
  symbols: [
    { sym: 'C', he: 'הקיבול הנמדד (אות-קטן)', unit: 'F/cm^2' },
    { sym: 'C_{ox}', he: 'קיבול האוקסיד', unit: 'F/cm^2' },
    { sym: 'C_{dep}', he: 'קיבול אזור-המחסור', unit: 'F/cm^2' },
    { sym: 'C_s', he: 'קיבול המל"מ ($-dQ_s/d\\psi_s$)', unit: 'F/cm^2' },
    { sym: 'C_{ss}', he: 'קיבול מצבי-השטח', unit: 'F/cm^2' },
    { sym: 'C_{min}', he: 'רצפת הקיבול בהיפוך (HF)', unit: 'F/cm^2' },
    { sym: 'V_R', he: 'מתח אחורי (body bias)', unit: 'V' },
  ],
}
