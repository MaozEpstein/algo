import type { LectureModule } from '@/core/engine/types'
import MosThresholdExplainer from './MosThresholdExplainer'

/**
 * Semiconductors — Lesson 6ב: the MOS capacitor, part 2 — the quantitative DC picture. Poisson's
 * equation gives the exact surface charge Q_s(ψ_s) (exponential in accumulation/inversion, √ψ_s
 * through depletion). The threshold voltage V_T=V_FB+2φ_F+|Q_D,max|/C_ox marks strong inversion —
 * where the MOSFET channel forms. Real oxide/interface charges (Q_it,Q_f,Q_ox,Q_m → Q_ss) shift
 * V_FB=φ_MS−Q_ss/C_ox and with it the whole characteristic. (The C-V/AC picture is part ג.)
 */
export const mosThresholdLecture: LectureModule = {
  id: 'mos-threshold',
  number: 6.2,
  numberLabelHe: '6 · חלק ב׳',
  lessonHe: 'קבל MOS',
  titleHe: 'קבל MOS — מתח-סף ומטענים',
  subtitleEn: 'The MOS Capacitor: Threshold Voltage & Charges',
  views: [],
  algorithms: [],
  summary: MosThresholdExplainer,
  explainer: true,
  glossary: [
    { term: 'מטען פני-השטח $Q_s$', def: 'המטען הכולל במל"מ ליחידת-שטח כפונקציה של $\\psi_s$ (פתרון פואסון): מעריכי בהצטברות/היפוך, $\\propto\\sqrt{\\psi_s}$ במחסור.' },
    { term: 'מתח-סף $V_T$', def: 'מתח-השער לתחילת היפוך חזק ($\\psi_s=2\\phi_F$) — שם נוצר ערוץ ה-MOSFET.', tex: 'V_T=V_{FB}+2\\phi_F+\\dfrac{|Q_{D,\\max}|}{C_{ox}}' },
    { term: 'מטען מחסור מרבי $Q_{D,max}$', def: 'מטען-המחסור בסף ($\\psi_s=2\\phi_F$): $|Q_{D,\\max}|=qN_AW_{max}$.', tex: '|Q_{D,\\max}|=\\sqrt{2q\\varepsilon_sN_A\\,(2\\phi_F)}' },
    { term: 'מטעני-תחמוצת', def: 'מטענים לא-אידיאליים ב-SiO₂ ובממשק: $Q_{it}$ (ממשק/מלכודות), $Q_f$ (קבוע), $Q_{ox}$ (נפח), $Q_m$ (יונים ניידים Na⁺/K⁺).' },
    { term: 'מטען אפקטיבי $Q_{ss}$', def: 'סכום מטעני-התחמוצת הממופה לממשק (שקלול לפי המרחק מהשער); מזיז את $V_{FB}$.' },
    { term: 'מתח flat-band ריאלי', def: 'עם מטעני-תחמוצת: $V_{FB}=\\phi_{MS}-Q_{ss}/C_{ox}$, ולא רק $\\phi_{MS}$.', tex: 'V_{FB}=\\phi_{MS}-\\dfrac{Q_{ss}}{C_{ox}}' },
  ],
  formulas: [
    { name: 'מטען פני-השטח', tex: '|Q_s|=\\sqrt{2\\varepsilon_s qV_T\\left[N_A(e^{-\\beta\\psi_s}+\\beta\\psi_s-1)+\\tfrac{n_i^2}{N_A}(e^{\\beta\\psi_s}-\\beta\\psi_s-1)\\right]}', wide: true },
    { name: 'מטען מחסור', tex: 'Q_{dep}=\\sqrt{2q\\varepsilon_sN_A\\psi_s}' },
    { name: 'משוואת השער', tex: 'V_G=V_{FB}-\\dfrac{Q_s}{C_{ox}}+\\psi_s' },
    { name: 'מתח-סף', tex: 'V_T=V_{FB}+2\\phi_F+\\dfrac{|Q_{D,\\max}|}{C_{ox}}' },
    { name: 'flat-band ריאלי', tex: 'V_{FB}=\\phi_{MS}-\\dfrac{Q_{ss}}{C_{ox}}' },
    { name: 'הזזת flat-band', tex: '\\Delta V_{FB}=-\\dfrac{qN_{ss}}{C_{ox}}' },
  ],
  symbols: [
    { sym: 'Q_s', he: 'מטען פני-השטח במל"מ', unit: 'C/cm^2' },
    { sym: 'Q_{dep}', he: 'מטען אזור-המחסור', unit: 'C/cm^2' },
    { sym: 'V_T', he: 'מתח-הסף (סף ההיפוך)', unit: 'V' },
    { sym: 'V_{FB}', he: 'מתח flat-band', unit: 'V' },
    { sym: '\\psi_s', he: 'פוטנציאל פני-השטח', unit: 'V' },
    { sym: '\\phi_F', he: 'פוטנציאל פרמי של המצע', unit: 'V' },
    { sym: 'Q_{ss}', he: 'מטען-תחמוצת אפקטיבי (ממופה לממשק)', unit: 'C/cm^2' },
    { sym: 'N_{ss}', he: 'צפיפות מטען-תחמוצת אפקטיבי', unit: 'cm^{-2}' },
    { sym: 'C_{ox}', he: 'קיבול-האוקסיד ליחידת-שטח', unit: 'F/cm^2' },
  ],
}
