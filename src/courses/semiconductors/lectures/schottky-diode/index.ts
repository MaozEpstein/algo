import type { LectureModule } from '@/core/engine/types'
import SchottkyDiodeExplainer from './SchottkyDiodeExplainer'

/**
 * Semiconductors — Lecture 2ג: the Schottky (metal–semiconductor) diode. A
 * different kind of junction: the barrier φ_B = φ_m − χ is set by the work-
 * function difference, the current is carried by MAJORITY carriers via thermionic
 * emission J = A*T²e^{−φ_B/V_T}(e^{V_A/V_T}−1), and the device turns on at a lower
 * voltage and switches fast (no minority storage). Tabs: intro, the band diagram &
 * barrier formation, thermionic current, Schottky-vs-PN, a sandbox, practice and a
 * summary. The ohmic metal–semiconductor contact follows (2ד).
 */
export const schottkyDiodeLecture: LectureModule = {
  id: 'schottky-diode',
  number: 2.3,
  numberLabelHe: '2 · חלק ג׳',
  titleHe: 'דיודת שוטקי',
  subtitleEn: 'The Schottky Diode',
  views: [],
  algorithms: [],
  summary: SchottkyDiodeExplainer,
  explainer: true,
  glossary: [
    { term: 'צומת מתכת–מל"מ', def: 'מגע בין מתכת למוליך-למחצה. תלוי בפונקציות העבודה, הוא יכול להיות מיישר (שוטקי) או אוהמי.' },
    { term: 'מחסום שוטקי $\\varphi_B$', def: 'גובה המחסום שאלקטרון מהמתכת רואה: $\\varphi_B=\\varphi_m-\\chi$. בלתי-תלוי במתח החיצוני (קבוע מצד המתכת).', tex: '\\varphi_B=\\varphi_m-\\chi' },
    { term: 'פונקציית עבודה $\\varphi_m$', def: 'האנרגיה מרמת פרמי של המתכת עד לרמת הוואקום.' },
    { term: 'זיקה אלקטרונית $\\chi$ (אפיניות)', def: 'האנרגיה מקצה פס ההולכה $E_c$ עד לרמת הוואקום — כמה החומר "מעוניין" לקלוט אלקטרון: $\\chi$ גבוהה ⇒ נוטה לספוג אלקטרונים, $\\chi$ נמוכה ⇒ נוטה לשחרר אותם.' },
    { term: 'מתח בנוי $V_{bi}$', def: 'כיפוף הפסים במל"מ: $V_{bi}=\\varphi_B-\\xi$, כאשר $\\xi=E_c-E_F=V_T\\ln(N_c/N_D)$.', tex: 'V_{bi}=\\varphi_B-\\xi' },
    { term: 'פליטה תרמיונית', def: 'מנגנון הזרם: נושאי רוב (אלקטרונים) בעלי אנרגיה מספקת חוצים את המחסום. נותן את אופיין הדיודה.', tex: 'J=A^{*}T^2e^{-\\varphi_B/V_T}\\left(e^{V_A/V_T}-1\\right)' },
    { term: 'שני הזרמים הנגדיים $J_{S\\to M},\\,J_{M\\to S}$', def: 'הזרם הוא הפרש שני שטפי-אלקטרונים מעל אותו מחסום: $J_{M\\to S}$ (מהמתכת, מעל $\\varphi_B$ הקבוע) $=J_{ST}$ קבוע; $J_{S\\to M}$ (מהמל"מ, מעל $q(V_{bi}-V_A)$) תלוי-מתח. ההפרש נותן את אופיין הדיודה, והאחורי רווי כי נשאר רק $-J_{M\\to S}$.', tex: 'J=J_{S\\to M}-J_{M\\to S}' },
    { term: 'קבוע ריצׁרדסון $A^{*}$', def: 'הקדם בפליטה התרמיונית, תלוי-חומר (Si≈110, GaAs≈8.2 A·cm⁻²K⁻²).' },
    { term: 'התקן נושאי-רוב', def: 'בשוטקי הזרם נישא בנושאי הרוב — אין אגירת מיעוט, ולכן מיתוג מהיר מאוד (ללא reverse-recovery).' },
    { term: 'קיבוע רמת-פרמי (Bardeen)', def: 'במציאות מצבי-שטח בממשק "מקבעים" את $\\varphi_B$ כך שהוא כמעט בלתי-תלוי במתכת — סטייה מהמודל האידיאלי $\\varphi_m-\\chi$.' },
    { term: 'אפקט שוטקי (הנמכת המחסום)', def: 'הנמכת מחסום בכוח-דמות: השדה החשמלי מנמיך מעט את $\\varphi_B$ ($\\Delta\\varphi_B\\propto\\sqrt{E_{max}}$) — לכן הזרם האחורי אינו רווי לחלוטין.', tex: '\\Delta\\varphi_B\\propto\\sqrt{E_{max}}' },
  ],
  formulas: [
    { name: 'גובה המחסום', tex: '\\varphi_B=\\varphi_m-\\chi', note: 'בלתי-תלוי במתח.' },
    { name: 'מתח בנוי', tex: 'V_{bi}=\\varphi_B-\\xi,\\quad \\xi=V_T\\ln(N_c/N_D)' },
    { name: 'אופיין שוטקי (תרמיוני)', tex: 'J=A^{*}T^2e^{-\\varphi_B/V_T}\\left(e^{V_A/V_T}-1\\right)', note: 'רווי אחורית ב-$-J_{ST}$.' },
    { name: 'הפרש שני הזרמים הנגדיים', tex: 'J=\\underbrace{J_{ST}e^{V_A/V_T}}_{J_{S\\to M}}-\\underbrace{J_{ST}}_{J_{M\\to S}}', note: '$J_{M\\to S}$ קבוע (מעל $\\varphi_B$); $J_{S\\to M}$ תלוי-מתח.' },
    { name: 'זרם הרוויה התרמיוני', tex: 'J_{ST}=A^{*}T^2e^{-\\varphi_B/V_T}', note: '$\\gg$ זרם הרוויה של דיודת PN.' },
    { name: 'רוחב המחסור (חד-צדדי)', tex: 'W=\\sqrt{\\tfrac{2\\varepsilon_s(V_{bi}-V_A)}{qN_D}}' },
    { name: 'קריטריון מיישר (n)', tex: '\\varphi_m>\\varphi_s=\\chi+\\xi' },
  ],
  symbols: [
    { sym: '\\varphi_m', he: 'פונקציית העבודה של המתכת', unit: 'eV' },
    { sym: '\\varphi_s', he: 'פונקציית העבודה של המל"מ ($\\chi+\\xi$)', unit: 'eV' },
    { sym: '\\chi', he: 'זיקה אלקטרונית של המל"מ', unit: 'eV' },
    { sym: '\\varphi_B', he: 'גובה מחסום שוטקי', unit: 'eV' },
    { sym: '\\xi', he: 'היסט הבולק $E_c-E_F$', unit: 'eV' },
    { sym: 'V_{bi}', he: 'מתח בנוי', unit: 'V' },
    { sym: 'V_A', he: 'מתח חיצוני מופעל', unit: 'V' },
    { sym: 'J', he: 'צפיפות זרם הדיודה', unit: 'A/cm^2' },
    { sym: 'J_{ST}', he: 'צפיפות זרם הרוויה התרמיוני', unit: 'A/cm^2' },
    { sym: 'J_{S\\to M}', he: 'שטף אלקטרונים מל"מ→מתכת (תלוי-מתח)', unit: 'A/cm^2' },
    { sym: 'J_{M\\to S}', he: 'שטף אלקטרונים מתכת→מל"מ (קבוע)', unit: 'A/cm^2' },
    { sym: 'A^{*}', he: 'קבוע ריצׁרדסון אפקטיבי', unit: 'A\\,cm^{-2}K^{-2}' },
    { sym: 'N_c', he: 'צפיפות מצבים אפקטיבית בפס ההולכה', unit: 'cm^{-3}' },
    { sym: 'E_{Fm}', he: 'רמת פרמי של המתכת', unit: 'eV' },
    { sym: 'E_0', he: 'רמת הוואקום', unit: 'eV' },
  ],
}
