import type { LectureModule } from '@/core/engine/types'
import JfetExplainer from './JfetExplainer'

/**
 * Semiconductors — Lesson 5: the JFET (junction field-effect transistor). An n-channel
 * between source and drain is squeezed by the reverse-biased depletion regions of two p⁺
 * gates: V_GS narrows it uniformly (cutoff at |V_P|=qN_Da²/2ε_s); V_DS tapers it toward the
 * drain and pinches it there at V_Dsat=|V_P|−|V_GS| → saturation. Output characteristics
 * I_D(V_DS) (ohmic / voltage-controlled-resistor → saturation), transfer characteristic
 * (square law) I_D=I_DSS(1−V_GS/V_P)², transconductance g_m=2I_DSS/|V_P|·(1−V_GS/V_P) and
 * the common-source gain A_v=−g_m(r_o∥R_D). A brief MESFET (Schottky-gate) extension.
 * Grounded in the class summary (structure + output family) with the square-law, g_m and
 * the ohmic-region equation completed from the course book.
 */
export const jfetLecture: LectureModule = {
  id: 'jfet',
  number: 5,
  titleHe: 'טרנזיסטור שדה (JFET)',
  subtitleEn: 'The Junction Field-Effect Transistor',
  views: [],
  algorithms: [],
  summary: JfetExplainer,
  explainer: true,
  glossary: [
    { term: 'JFET', def: 'טרנזיסטור-שדה עם שער-צומת: מתח-שער שולט במוליכות תעלה דרך אזור-המחסור של צומת שער-תעלה מוטה-אחורה. שליטת-מתח, כניסה כמעט ללא זרם.' },
    { term: 'מתח-צביטה $V_P$', def: 'מתח-השער שמדלדל את כל התעלה: $|V_P|=qN_Da^2/2\\varepsilon_s$. מעליו — קטעון.', tex: '|V_P|=\\dfrac{qN_Da^2}{2\\varepsilon_s}' },
    { term: 'מתח רוויה $V_{Dsat}$', def: 'מתח-הניקוז שבו התעלה נצבטת בקצה הניקוז: $V_{Dsat}=|V_P|-|V_{GS}|$.', tex: 'V_{Dsat}=|V_P|-|V_{GS}|' },
    { term: 'אזור אוהמי (VCR)', def: 'למתחי-ניקוז קטנים הזרם לינארי ב-$V_{DS}$ — ההתקן הוא נגד שמתח-השער שולט בו.' },
    { term: 'אופיין-העברה (חוק ריבועי)', def: 'תלות הזרם ברוויה במתח-השער: $I_D=I_{DSS}(1-V_{GS}/V_P)^2$. $I_{DSS}$ הוא הזרם המרבי ($V_{GS}=0$).', tex: 'I_D=I_{DSS}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)^2' },
    { term: 'מוליכות-מעבר $g_m$', def: 'שיפוע אופיין-ההעברה: $g_m=\\frac{2I_{DSS}}{|V_P|}(1-\\frac{V_{GS}}{V_P})$. מרבי ב-$V_{GS}=0$.', tex: 'g_m=\\dfrac{2I_{DSS}}{|V_P|}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)' },
    { term: 'מקור משותף (CS)', def: 'תצורת המגבר המקבילה ל-CE: $A_v=-g_m(r_o\\parallel R_D)$, מהפך.', tex: 'A_v=-g_m(r_o\\parallel R_D)' },
    { term: 'MESFET', def: 'הרחבה: FET עם שער מחסום-שוטקי (מתכת) במקום צומת $p$-$n$ — אותה פיזיקה, מהיר לתדרי-מיקרוגל (GaAs).' },
  ],
  formulas: [
    { name: 'מתח-צביטה', tex: '|V_P|=\\dfrac{q\\,N_D\\,a^2}{2\\varepsilon_s}' },
    { name: 'מתח רוויה', tex: 'V_{Dsat}=|V_P|-|V_{GS}|', note: 'קטעון ב-$|V_{GS}|\\ge|V_P|$.' },
    { name: 'אופיין-העברה (רוויה)', tex: 'I_D=I_{DSS}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)^2' },
    { name: 'אזור אוהמי', tex: 'I_D=I_{DSS}\\left[2\\left(1-\\tfrac{V_{GS}}{V_P}\\right)\\tfrac{V_{DS}}{|V_P|}-\\tfrac{V_{DS}^2}{V_P^2}\\right]' },
    { name: 'מוליכות-מעבר', tex: 'g_m=\\dfrac{2I_{DSS}}{|V_P|}\\left(1-\\dfrac{V_{GS}}{V_P}\\right)=\\dfrac{2\\sqrt{I_{DSS}I_D}}{|V_P|}' },
    { name: 'הגבר מקור-משותף', tex: 'A_v=-g_m(r_o\\parallel R_D)' },
  ],
  symbols: [
    { sym: 'V_{GS}', he: 'מתח שער-מקור (הטיה אחורה, $\\le0$ בתעלת $n$)', unit: 'V' },
    { sym: 'V_{DS}', he: 'מתח ניקוז-מקור', unit: 'V' },
    { sym: 'V_P', he: 'מתח-הצביטה (pinch-off)', unit: 'V' },
    { sym: 'V_{Dsat}', he: 'מתח-הניקוז לכניסה לרוויה', unit: 'V' },
    { sym: 'I_{DSS}', he: 'זרם-הניקוז המרבי ($V_{GS}=0$, רוויה)', unit: 'A' },
    { sym: 'g_m', he: 'מוליכות-המעבר', unit: 'S' },
    { sym: 'a', he: 'חצי-רוחב התעלה המטלורגית', unit: 'cm' },
    { sym: 'N_D', he: 'סימום התעלה', unit: 'cm^{-3}' },
  ],
}
