import type { LectureModule } from '@/core/engine/types'
import JfetStructureExplainer from './JfetStructureExplainer'

/**
 * Semiconductors — Lesson 5א: the JFET (junction field-effect transistor) — structure &
 * operation. An n-channel between source and drain is squeezed by the reverse-biased
 * depletion regions of two p⁺ gates. The gate voltage V_GS narrows the channel uniformly
 * (cutoff at the pinch-off voltage |V_P|=qN_Da²/2ε_s); V_DS tapers the channel toward the
 * drain and pinches it there at V_Dsat=|V_P|−|V_GS| → saturation. Three regions: cutoff,
 * ohmic (voltage-controlled resistor) and saturation. (I-V square law, MESFET and
 * small-signal are part ב.)
 */
export const jfetStructureLecture: LectureModule = {
  id: 'jfet-structure',
  number: 5.1,
  numberLabelHe: '5 · חלק א׳',
  titleHe: 'טרנזיסטור שדה (JFET) — מבנה ופעולה',
  subtitleEn: 'JFET: Structure & Operation',
  views: [],
  algorithms: [],
  summary: JfetStructureExplainer,
  explainer: true,
  glossary: [
    { term: 'JFET', def: 'טרנזיסטור-שדה עם שער-צומת: מתח-שער שולט במוליכות תעלה דרך אזור-המחסור של צומת שער-תעלה מוטה-אחורה. שליטת-מתח, כניסה כמעט ללא זרם.' },
    { term: 'תעלה (channel)', def: 'נתיב המוליכות בין המקור לניקוז (כאן מסוג $n$). רוחבה האפקטיבי נקבע ע״י חדירת אזור-המחסור של השער.' },
    { term: 'מתח-צביטה $V_P$', def: 'מתח-השער שמדלדל את כל התעלה: $|V_P|=qN_Da^2/2\\varepsilon_s$. מעליו — קטעון.', tex: '|V_P|=\\dfrac{qN_Da^2}{2\\varepsilon_s}' },
    { term: 'מתח רוויה $V_{Dsat}$', def: 'מתח-הניקוז שבו התעלה נצבטת בקצה הניקוז: $V_{Dsat}=|V_P|-|V_{GS}|$. מעליו — רוויה.', tex: 'V_{Dsat}=|V_P|-|V_{GS}|' },
    { term: 'אזור אוהמי / רוויה', def: 'אוהמי: $V_{DS}<V_{Dsat}$, התעלה פתוחה — נגד נשלט-מתח. רוויה: $V_{DS}\\ge V_{Dsat}$, צביטה בניקוז — $I_D$ כמעט קבוע.' },
  ],
  formulas: [
    { name: 'מתח-צביטה', tex: '|V_P|=\\dfrac{q\\,N_D\\,a^2}{2\\varepsilon_s}', note: 'תלוי בסימום וברוחב חצי-התעלה.' },
    { name: 'מתח רוויה בניקוז', tex: 'V_{Dsat}=|V_P|-|V_{GS}|' },
    { name: 'תנאי קטעון', tex: '|V_{GS}|\\ge|V_P|' },
  ],
  symbols: [
    { sym: 'V_{GS}', he: 'מתח שער-מקור (הטיה אחורה, $\\le0$ בתעלת $n$)', unit: 'V' },
    { sym: 'V_{DS}', he: 'מתח ניקוז-מקור', unit: 'V' },
    { sym: 'V_P', he: 'מתח-הצביטה (pinch-off)', unit: 'V' },
    { sym: 'V_{Dsat}', he: 'מתח-הניקוז לכניסה לרוויה', unit: 'V' },
    { sym: 'a', he: 'חצי-רוחב התעלה המטלורגית', unit: 'cm' },
    { sym: 'N_D', he: 'סימום התעלה', unit: 'cm^{-3}' },
  ],
}
