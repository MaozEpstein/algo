import type { LectureModule } from '@/core/engine/types'
import MosCapacitorExplainer from './MosCapacitorExplainer'

/**
 * Semiconductors — Lesson 6א: the MOS capacitor (metal–oxide–semiconductor) — structure and
 * operating regimes. The gate controls the surface charge of a p-type semiconductor through a
 * capacitor-like oxide (no DC gate current). The work-function difference φ_MS bends the bands;
 * the flat-band voltage V_FB=φ_MS undoes that bend. As V_G rises the surface passes through
 * accumulation (holes pile up), depletion (a negative ionised-acceptor space-charge region of
 * width W=√(2ε_sψ_s/qN_A)), and inversion (an electron channel forms, ψ_s pins at 2φ_F). The
 * heart of the MOSFET. (Threshold V_T, the C-V characteristic and oxide charges are part ב.)
 */
export const mosCapacitorLecture: LectureModule = {
  id: 'mos-capacitor',
  number: 6.1,
  numberLabelHe: '6 · חלק א׳',
  titleHe: 'קבל MOS — מבנה ומשטרי פעולה',
  subtitleEn: 'The MOS Capacitor: Structure & Operating Regimes',
  views: [],
  algorithms: [],
  summary: MosCapacitorExplainer,
  explainer: true,
  glossary: [
    { term: 'קבל MOS', def: 'מבנה מתכת–אוקסיד–מוליך (M-O-S). מתח-השער שולט במטען בפני-השטח של המוליך דרך שדה (קיבולי), כמעט ללא זרם-שער. הלב של ה-MOSFET.' },
    { term: 'פוטנציאל פרמי $\\phi_F$', def: 'מרחק $E_i$ מ-$E_F$ במצע: $\\phi_F=\\frac{kT}{q}\\ln(N_A/n_i)$.', tex: '\\phi_F=\\dfrac{kT}{q}\\ln\\dfrac{N_A}{n_i}' },
    { term: 'הפרש פונקציות-עבודה $\\phi_{MS}$', def: '$\\phi_{MS}=\\phi_M-(\\chi_S+E_g/2+q\\phi_F)$ — קובע את כיפוף-הפסים ההתחלתי.', tex: '\\phi_{MS}=\\phi_M-\\left(\\chi_S+\\tfrac{E_g}{2}+q\\phi_F\\right)' },
    { term: 'מתח flat-band $V_{FB}$', def: 'מתח-השער שמיישר את הפסים ($V_{ox}=0,\\psi_s=0$). אידיאלית $V_{FB}=\\phi_{MS}$.', tex: 'V_{FB}=\\phi_{MS}' },
    { term: 'הצטברות', def: '$V_G<V_{FB}$: נושאי-רוב (חורים) נצברים בשפה; פסים מתכופפים מעלה.' },
    { term: 'מחסור', def: '$V_{FB}<V_G<V_T$: החורים נדחים ונחשף מטען שלילי של יוני-מקבל; רוחב-מחסור $W=\\sqrt{2\\varepsilon_s\\psi_s/qN_A}$.', tex: 'W=\\sqrt{\\dfrac{2\\varepsilon_s\\psi_s}{qN_A}}' },
    { term: 'היפוך (חלש/חזק)', def: '$V_G>V_T$: נוצר ערוץ אלקטרונים בשפה. חלש: $\\phi_F<\\psi_s<2\\phi_F$; חזק: $\\psi_s\\ge2\\phi_F$ (סף הערוץ), שם $\\psi_s$ ננעל ו-$W=W_{max}$.' },
    { term: 'סימום אפקטיבי $N$', def: 'הסימום נטו: $N>0$ למוליך מסוג n, $N<0$ לסוג p.', tex: 'N=N_D-N_A' },
    { term: 'צפיפות מטען מרחבית $\\rho(x)$', def: 'אגף-המקור במשוואת פואסון — הוא שקובע את כיפוף-הפסים.', tex: '\\rho(x)=q\\,(p-n+N)' },
    { term: 'מטען פני-השטח $Q_s$', def: 'המטען הכולל במל"מ ליחידת-שטח כפונקציה של $\\psi_s$: מעריכי בהצטברות/היפוך, $\\propto\\sqrt{\\psi_s}$ במחסור.' },
    { term: 'מתח-סף $V_T$', def: 'מתח-השער לתחילת היפוך חזק ($\\psi_s=2\\phi_F$).', tex: 'V_T=V_{FB}+2\\phi_F+\\dfrac{|Q_{D,\\max}|}{C_{ox}}' },
    { term: 'מטעני-תחמוצת', def: 'מטענים לא-אידיאליים ב-SiO₂ ובממשק: $Q_{it}$ (ממשק), $Q_f$ (קבוע), $Q_{ox}$ (נפח), $Q_m$ (יונים ניידים Na⁺/K⁺).' },
    { term: 'מטען אפקטיבי $Q_{ss}$', def: 'סכום מטעני-התחמוצת הממופה לממשק (שקלול לפי המרחק מהשער); מזיז את $V_{FB}$.' },
    { term: 'מתח flat-band ריאלי', def: 'עם מטעני-תחמוצת זה כבר לא רק $\\phi_{MS}$ — אלא $V_{FB}=\\phi_{MS}-Q_{ss}/C_{ox}$.', tex: 'V_{FB}=\\phi_{MS}-\\dfrac{Q_{ss}}{C_{ox}}' },
  ],
  formulas: [
    { name: 'פוטנציאל פרמי', tex: '\\phi_F=\\dfrac{kT}{q}\\ln\\dfrac{N_A}{n_i}' },
    { name: 'הפרש פונקציות-עבודה', tex: '\\phi_{MS}=\\phi_M-\\left(\\chi_S+\\tfrac{E_g}{2}+q\\phi_F\\right)' },
    { name: 'קיבול-אוקסיד', tex: 'C_{ox}=\\dfrac{\\varepsilon_{ox}\\varepsilon_0}{t_{ox}}' },
    { name: 'צפיפות מטען', tex: '\\rho(x)=q\\,(p-n+N)' },
    { name: 'רוחב מחסור / מטען', tex: 'W=\\sqrt{\\dfrac{2\\varepsilon_s\\psi_s}{qN_A}},\\quad Q_{dep}=\\sqrt{2q\\varepsilon_sN_A\\psi_s}' },
    { name: 'מטען פני-השטח', tex: '|Q_s|=\\sqrt{2\\varepsilon_s qV_T\\left[N_A(e^{-\\beta\\psi_s}+\\beta\\psi_s-1)+\\tfrac{n_i^2}{N_A}(e^{\\beta\\psi_s}-\\beta\\psi_s-1)\\right]}', wide: true },
    { name: 'משוואת השער', tex: 'V_G=V_{FB}-\\dfrac{Q_s}{C_{ox}}+\\psi_s' },
    { name: 'מתח-סף', tex: 'V_T=V_{FB}+2\\phi_F+\\dfrac{|Q_{D,\\max}|}{C_{ox}}' },
    { name: 'flat-band ריאלי', tex: 'V_{FB}=\\phi_{MS}-\\dfrac{Q_{ss}}{C_{ox}}' },
    { name: 'הזזת flat-band', tex: '\\Delta V_{FB}=-\\dfrac{Q_{ss}}{C_{ox}}=-\\dfrac{qN_{ss}}{C_{ox}}' },
  ],
  symbols: [
    { sym: 'V_G', he: 'מתח השער', unit: 'V' },
    { sym: 'V_{FB}', he: 'מתח flat-band', unit: 'V' },
    { sym: 'V_T', he: 'מתח-הסף (סף ההיפוך)', unit: 'V' },
    { sym: '\\phi_{MS}', he: 'הפרש פונקציות-העבודה מתכת-מוליך', unit: 'V' },
    { sym: '\\phi_F', he: 'פוטנציאל פרמי של המצע', unit: 'V' },
    { sym: '\\psi_s', he: 'פוטנציאל פני-השטח (כיפוף הפסים)', unit: 'V' },
    { sym: '\\beta', he: '$q/kT$ (הופכי המתח התרמי)', unit: 'V^{-1}' },
    { sym: 'N', he: 'סימום אפקטיבי $N_D-N_A$', unit: 'cm^{-3}' },
    { sym: 'Q_s', he: 'מטען פני-השטח במל"מ', unit: 'C/cm^2' },
    { sym: 'Q_{ss}', he: 'מטען-תחמוצת אפקטיבי (ממופה לממשק)', unit: 'C/cm^2' },
    { sym: 'N_{ss}', he: 'צפיפות מטען-תחמוצת אפקטיבי', unit: 'cm^{-2}' },
    { sym: 'n_s,p_s', he: 'ריכוזי נשאים בשפה', unit: 'cm^{-3}' },
    { sym: 'C_{ox}', he: 'קיבול-האוקסיד ליחידת-שטח', unit: 'F/cm^2' },
    { sym: 'W', he: 'רוחב אזור-המחסור', unit: 'cm' },
    { sym: 't_{ox}', he: 'עובי האוקסיד', unit: 'cm' },
  ],
}
