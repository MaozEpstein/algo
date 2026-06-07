import type { LectureModule } from '@/core/engine/types'
import BjtStructureExplainer from './BjtStructureExplainer'

/**
 * Semiconductors — Lecture 3א: the bipolar junction transistor (BJT), structure &
 * operation. Three doped layers (npn / pnp) form TWO back-to-back PN junctions that
 * share a THIN base, so they are coupled — not two separate diodes. In the
 * forward-active mode (E-B forward, B-C reverse) the emitter injects minority
 * carriers over the lowered E-B barrier; the thin, lightly-doped base lets almost
 * all of them diffuse across (base transport factor b→1) and roll down into the
 * collector — so a tiny base current controls a large collector current (β≫1). This
 * part is QUALITATIVE: the two-junction band diagram, the minority profile along
 * E-B-C, the four operating modes, and *why* it amplifies. The quantitative current
 * components, γ/b/α/β derivation (3ב) and Ebers-Moll/Early/f_T (3ג) follow.
 */
export const bjtStructureLecture: LectureModule = {
  id: 'bjt-structure',
  number: 3.1,
  numberLabelHe: '3 · חלק א׳',
  titleHe: 'טרנזיסטור דו-קוטבי (BJT) — מבנה ופעולה',
  subtitleEn: 'BJT: Structure & Operation',
  views: [],
  algorithms: [],
  summary: BjtStructureExplainer,
  explainer: true,
  glossary: [
    { term: 'טרנזיסטור דו-קוטבי (BJT)', def: 'שלוש שכבות מוליך-למחצה מסוממות לסירוגין (npn או pnp) = שני צמתי-PN "גב-אל-גב" החולקים בסיס דק. "דו-קוטבי" כי בהולכה משתתפים שני סוגי הנושאים (אלקטרונים וחורים).' },
    { term: 'פולט (Emitter, E)', def: 'האזור המסומם בכבדות ביותר. תפקידו להזריק ביעילות נושאי-מיעוט אל הבסיס — לכן $N_{DE}\\gg N_{AB}$ (נצילות-הזרקה $\\gamma\\to1$).' },
    { term: 'בסיס (Base, B)', def: 'אזור דק מאוד ומסומם קלות בין הפולט לקולט. דק במכוון: כך כמעט כל המטען המוזרק חוצה אותו בדיפוזיה לפני שייעלם ברקומבינציה ($W_B\\ll L_B$).' },
    { term: 'קולט (Collector, C)', def: 'האזור הקולט את הנושאים שחצו את הבסיס. מסומם בינוני/קל ורחב, כדי לעמוד במתח-האחורי של צומת ה-CB.' },
    { term: 'שני צמתים מצומדים — לא שתי דיודות', def: 'מכיוון שהבסיס דק (קצר ביחס לאורך-הדיפוזיה), המטען המוזרק בצומת ה-BE מגיע ישירות לצומת ה-CB. הצמתים מצומדים — וזה ההבדל מהותי משתי דיודות נפרדות.' },
    { term: 'מצב פעיל-קדמי (Forward-Active)', def: 'צומת BE בממתח קדמי ($V_{BE}>0$) וצומת BC בממתח אחורי ($V_{BC}<0$). מצב ההגבר הליניארי: הזרקה→דיפוזיה-בבסיס→קליטה.', tex: 'V_{BE}>0,\\;V_{BC}<0' },
    { term: 'מצבי-הפעולה', def: 'קטעון (שני הצמתים אחורי — מפסק פתוח), פעיל-קדמי (מגבר), רוויה (שני הצמתים קדמי — מפסק סגור, $V_{CE,\\mathrm{sat}}\\approx0.2\\,$V), ופעיל-הפוך (הגבר נמוך מאוד).' },
    { term: 'מקדם מעבר הבסיס $b$', def: 'השבריר של הנושאים המוזרקים שמצליחים לחצות את הבסיס ולהגיע לקולט: $b=1/\\cosh(W_B/L_B)\\approx1-W_B^2/2L_B^2$. בבסיס דק $b\\to1$.', tex: 'b=1/\\cosh(W_B/L_B)' },
    { term: 'מקדמי הגבר $\\alpha,\\beta$', def: '$\\alpha=I_C/I_E\\approx1$ (הגבר זרם בבסיס משותף); $\\beta=I_C/I_B=\\alpha/(1-\\alpha)\\gg1$ (הגבר זרם בפולט משותף). הגזירה הכמותית ב-3ב.', tex: '\\beta=\\dfrac{\\alpha}{1-\\alpha}' },
  ],
  formulas: [
    { name: 'שימור זרם (KCL)', tex: 'I_E=I_C+I_B', note: 'זרם-הבסיס $I_B$ קטן מאוד.' },
    { name: 'מקדם מעבר הבסיס', tex: 'b=\\dfrac{1}{\\cosh(W_B/L_B)}\\approx1-\\dfrac{W_B^2}{2L_B^2}', note: 'בסיס דק $\\Rightarrow b\\to1$.' },
    { name: 'מקדמי ההגבר', tex: '\\alpha=\\dfrac{I_C}{I_E}\\approx1,\\qquad \\beta=\\dfrac{I_C}{I_B}=\\dfrac{\\alpha}{1-\\alpha}', note: 'הגזירה הכמותית ($\\alpha=b\\gamma$) ב-3ב.' },
    { name: 'תנאי מצב פעיל-קדמי', tex: 'V_{BE}>0\\;(\\text{קדמי}),\\quad V_{BC}<0\\;(\\text{אחורי})' },
  ],
  symbols: [
    { sym: 'I_E', he: 'זרם הפולט', unit: 'A' },
    { sym: 'I_B', he: 'זרם הבסיס', unit: 'A' },
    { sym: 'I_C', he: 'זרם הקולט', unit: 'A' },
    { sym: 'V_{BE}', he: 'מתח בסיס-פולט', unit: 'V' },
    { sym: 'V_{BC}', he: 'מתח בסיס-קולט', unit: 'V' },
    { sym: 'W_B', he: 'רוחב הבסיס הניטרלי', unit: 'cm' },
    { sym: 'L_B', he: 'אורך הדיפוזיה בבסיס', unit: 'cm' },
    { sym: 'b', he: 'מקדם מעבר הבסיס', unit: '—' },
    { sym: '\\alpha', he: 'הגבר זרם בבסיס משותף ($I_C/I_E$)', unit: '—' },
    { sym: '\\beta', he: 'הגבר זרם בפולט משותף ($I_C/I_B$)', unit: '—' },
    { sym: 'N_{DE}', he: 'סימום הפולט (כבד)', unit: 'cm^{-3}' },
    { sym: 'N_{AB}', he: 'סימום הבסיס (קל)', unit: 'cm^{-3}' },
    { sym: 'N_{DC}', he: 'סימום הקולט', unit: 'cm^{-3}' },
  ],
}
