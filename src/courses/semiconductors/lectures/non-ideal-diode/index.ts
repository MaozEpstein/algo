import type { LectureModule } from '@/core/engine/types'
import NonIdealDiodeExplainer from './NonIdealDiodeExplainer'

/**
 * Semiconductors — Lecture 2ב: the non-ideal (real) diode. Releases the four
 * idealizing assumptions of 2א and shows where the clean exponential breaks:
 * depletion-region recombination/generation (ideality n→2 at low forward, a
 * non-saturating reverse current), high-level injection (n→2 again at high
 * forward), and series resistance (the high-current bend). Tabs: intro, the
 * recombination current, high injection, series resistance, the full picture
 * with the ideality factor n, practice, and a summary. The Schottky diode follows.
 */
export const nonIdealDiodeLecture: LectureModule = {
  id: 'non-ideal-diode',
  number: 2.2,
  numberLabelHe: '2 · חלק ב׳',
  titleHe: 'דיודת PN — דיודה לא-אידיאלית',
  subtitleEn: 'The Non-Ideal Diode',
  views: [],
  algorithms: [],
  summary: NonIdealDiodeExplainer,
  explainer: true,
  glossary: [
    { term: 'מקדם אי-אידיאליות $n$', def: 'הפרמטר באופיין $J=J_S(e^{V_A/nV_T}-1)$ המודד עד כמה הדיודה סוטה מהאידיאלי. $n\\approx1$ = דיפוזיה טהורה; $n\\approx2$ = רקומבינציה/הזרקה חזקה שולטת.', tex: 'J=J_S\\left(e^{V_A/nV_T}-1\\right)' },
    { term: 'זרם רקומבינציה (n=2)', def: 'זרם הנובע מרקומבינציה דרך מלכודות SRH בתוך אזור המחסור. שולט בקדמי נמוך, מעריכי ב-$V_A/2V_T$ (שיפוע חצי משל הדיפוזיה).', tex: 'J_{rec}=\\frac{qn_iW}{2\\tau_0}\\left(e^{V_A/2V_T}-1\\right)' },
    { term: 'זרם גנרציה (אחורי)', def: 'בממתח אחורי המלכודות מייצרות זוגות באזור המחסור; הזרם $\\propto W$ ולכן גדל עם המתח — האחורי אינו רווי (בניגוד לאידיאלי).', tex: 'J_{gen}\\approx -\\frac{qn_iW}{2\\tau_0}' },
    { term: 'הזרקה חזקה (High injection)', def: 'כשעודף נושאי המיעוט המוזרק מתקרב לריכוז נושאי הרוב ($\\Delta n\\to N$), קירוב ההזרקה החלשה נשבר והשיפוע חוזר ל-$n\\approx2$ (אפקט Webster).', tex: '\\Delta n \\sim N' },
    { term: 'התנגדות טורית $R_S$', def: 'התנגדות הבולק והמגעים (לשטח-יחידה, Ω·cm²). בזרם גבוה חלק מהמתח נופל עליה: $V_{term}=V_j+JR_S$, והעקומה מתכופפת ומתיישרת.', tex: 'V_{term}=V_j+J\\,R_S' },
    { term: 'זמן-חיים אפקטיבי $\\tau_0$', def: 'זמן-החיים של נושאי המיעוט במלכודות SRH (קונבנציה סימטרית $\\tau_n=\\tau_p=\\tau_0$). קובע את גודל זרם הרקומבינציה/גנרציה.' },
    { term: 'מלכודות SRH', def: 'מצבי-אנרגיה בתוך הפער האסור (פגמים/זיהומים) המאיצים גנרציה-רקומבינציה. ככל שיש יותר מלכודות $\\tau_0$ קטֵן והזרם הלא-אידיאלי גדל.' },
  ],
  formulas: [
    { name: 'אופיין כללי — מקדם אי-אידיאליות', tex: 'J=J_S\\left(e^{V_A/nV_T}-1\\right)', note: '$1\\le n\\le 2$.' },
    { name: 'זרם רקומבינציה', tex: 'J_{rec}=\\frac{q\\,n_i\\,W}{2\\tau_0}\\left(e^{V_A/2V_T}-1\\right)', note: 'מקדם $n=2$ — שולט בקדמי נמוך.' },
    { name: 'הזרם הכולל', tex: '\\begin{aligned}J&=J_{diff}+J_{rec}\\\\&=J_S\\!\\left(e^{V_A/V_T}\\!-\\!1\\right)+\\tfrac{qn_iW}{2\\tau_0}\\!\\left(e^{V_A/2V_T}\\!-\\!1\\right)\\end{aligned}' },
    { name: 'מתח-הדק עם התנגדות טורית', tex: 'V_{term}=V_j+J\\,R_S', note: 'הברך בזרם גבוה.' },
    { name: 'זרם גנרציה אחורי', tex: 'J_{gen}\\approx-\\frac{q\\,n_i\\,W(V_A)}{2\\tau_0}', note: '$\\propto W\\propto\\sqrt{V_{bi}+|V_A|}$ — לא רווי.' },
  ],
  symbols: [
    { sym: 'n', he: 'מקדם אי-אידיאליות (1–2)', unit: '—' },
    { sym: 'J_{rec}', he: 'צפיפות זרם הרקומבינציה (n=2)', unit: 'A/cm^2' },
    { sym: 'J_{gen}', he: 'צפיפות זרם הגנרציה האחורי', unit: 'A/cm^2' },
    { sym: '\\tau_0', he: 'זמן-חיים אפקטיבי (SRH, $\\tau_n=\\tau_p$)', unit: 's' },
    { sym: 'W', he: 'רוחב אזור המחסור (תלוי במתח)', unit: 'cm' },
    { sym: 'R_S', he: 'התנגדות טורית סגולית (לשטח-יחידה)', unit: '\\Omega\\cdot cm^2' },
    { sym: '\\Delta n', he: 'עודף נושאי המיעוט המוזרק', unit: 'cm^{-3}' },
  ],
}
