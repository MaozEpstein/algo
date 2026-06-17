import type { LectureModule } from '@/core/engine/types'
import OhmicContactExplainer from './OhmicContactExplainer'

/**
 * Semiconductors — Lecture 2ד: the OHMIC metal–semiconductor contact, the
 * non-rectifying counterpart of the Schottky diode. Two routes to ohmic behaviour:
 * a low barrier / accumulation (φ_m<φ_s, rare on Si), and — the practical one —
 * heavy n⁺ doping that thins the barrier until electrons TUNNEL through it (field
 * emission), giving a low specific contact resistance ρ_c. Closes lesson 2 and
 * sets up the BJT (lesson 3), whose terminals rely on ohmic contacts.
 */
export const ohmicContactLecture: LectureModule = {
  id: 'ohmic-contact',
  number: 2.4,
  numberLabelHe: '2 · חלק ד׳',
  lessonHe: 'דיודת PN',
  titleHe: 'מגע אוהמי',
  subtitleEn: 'The Ohmic Contact',
  views: [],
  algorithms: [],
  summary: OhmicContactExplainer,
  explainer: true,
  glossary: [
    { term: 'מגע אוהמי', def: 'מגע מתכת–מל"מ לא-מיישר: אופיין ליניארי ($V=I\\rho_c$, סימטרי) והתנגדות נמוכה, לחיבור התקן למעגל בלי דיודה טפילית.' },
    { term: 'שני המסלולים לאוהמי', def: 'מחסום נמוך/צבירה ($\\varphi_m<\\varphi_s$) — נדיר על Si; או סימום כבד (n⁺) שמדק את המחסום ומאפשר מנהור — המסלול המעשי.' },
    { term: 'צבירה (Accumulation)', def: 'כש-$\\varphi_m<\\varphi_s$ אין מחסום לאלקטרונים; הפסים מתכופפים כלפי מטה והאלקטרונים מצטברים בממשק → זרימה חופשית דו-כיוונית.' },
    { term: 'מנהור (Field Emission)', def: 'בסימום כבד אזור המחסור צר מאוד; אלקטרונים מנהרים ישירות דרך המחסום הדק (לא מעליו) — המנגנון של מגע אוהמי מעשי.' },
    { term: 'אנרגיית מנהור $E_{00}$', def: 'הפרמטר שקובע את משטר ההובלה: $E_{00}=\\tfrac{q\\hbar}{2}\\sqrt{N_D/(\\varepsilon_s m^{*})}$, עולה כ-$\\sqrt{N_D}$.', tex: 'E_{00}=\\tfrac{q\\hbar}{2}\\sqrt{N_D/(\\varepsilon_s m^{*})}' },
    { term: 'משטרי TE / TFE / FE', def: 'לפי $E_{00}$ מול $kT$: פליטה תרמיונית (TE, סימום נמוך → מיישר), תרמיונית-שדה (TFE), פליטת-שדה (FE, סימום כבד → מנהור → אוהמי).' },
    { term: 'התנגדות מגע סגולית $\\rho_c$', def: 'מדד הביצועים של המגע (Ω·cm²). צונחת מעריכית עם הסימום ($\\rho_c\\propto e^{C\\varphi_B/\\sqrt{N_D}}$) — לכן מסממים כבד.', tex: '\\rho_c\\propto e^{C\\varphi_B/\\sqrt{N_D}}' },
    { term: 'שכבת n⁺', def: 'שכבה דקה מסוממת-כבד מתחת לכל מגע מתכת בהתקן (דיודה/טרנזיסטור), כדי לקבל מגע אוהמי בעל התנגדות נמוכה.' },
  ],
  formulas: [
    { name: 'קריטריון מיישר / אוהמי (n)', tex: '\\begin{cases}\\varphi_m>\\varphi_s & \\Rightarrow\\ \\textcolor{#7c3aed}{\\text{מיישר (שוטקי)}}\\\\[4pt]\\varphi_m<\\varphi_s & \\Rightarrow\\ \\textcolor{#059669}{\\text{אוהמי (צבירה)}}\\end{cases}', note: '$\\varphi_s=\\chi+\\xi$ — פונקציית העבודה של המל"מ.' },
    { name: 'רוחב המחסום', tex: 'W=\\sqrt{2\\varepsilon_s V_{bi}/(qN_D)}\\propto 1/\\sqrt{N_D}', note: 'סימום כבד → מחסום דק → מנהור.' },
    { name: 'אנרגיית מנהור', tex: 'E_{00}=\\tfrac{q\\hbar}{2}\\sqrt{N_D/(\\varepsilon_s m^{*})}' },
    { name: 'אנרגיית מעבר', tex: 'E_0=E_{00}\\coth(E_{00}/kT)', note: 'מגשרת TE→FE.' },
    { name: 'התנגדות מגע סגולית', tex: '\\rho_c=\\rho_0\\,e^{\\varphi_B/E_0}', note: 'צונחת מעריכית עם $N_D$.' },
    { name: 'אופיין אוהמי', tex: 'V=I\\,\\rho_c', note: 'ליניארי, דרך הראשית.' },
  ],
  symbols: [
    { sym: '\\rho_c', he: 'התנגדות מגע סגולית', unit: '\\Omega\\cdot cm^2' },
    { sym: 'E_{00}', he: 'אנרגיית מנהור אופיינית', unit: 'eV' },
    { sym: 'E_0', he: 'אנרגיית מעבר $E_{00}\\coth(E_{00}/kT)$', unit: 'eV' },
    { sym: 'N_D', he: 'ריכוז התורמים (סימום)', unit: 'cm^{-3}' },
    { sym: 'W', he: 'רוחב אזור המחסור', unit: 'cm' },
    { sym: '\\varphi_B', he: 'גובה מחסום שוטקי', unit: 'eV' },
    { sym: '\\varphi_s', he: 'פונקציית העבודה של המל"מ', unit: 'eV' },
    { sym: 'm^{*}', he: 'מסת המנהור האפקטיבית', unit: 'm_0' },
  ],
}
