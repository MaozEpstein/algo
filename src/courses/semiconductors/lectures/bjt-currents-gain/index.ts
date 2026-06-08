import type { LectureModule } from '@/core/engine/types'
import BjtCurrentsGainExplainer from './BjtCurrentsGainExplainer'

/**
 * Semiconductors — Lecture 3ב: the BJT's currents & gain (the quantitative companion
 * to 3א). The emitter current splits into injected minority carriers (I_nE, useful)
 * and back-injected majority carriers (I_pE, wasted); some of the injected charge
 * recombines in the base (I_R). Two factors set the gain: the injection efficiency
 * γ=I_nE/I_E (→1 when N_E≫N_B) and the base transport factor b=1/cosh(W_B/L_B) (→1
 * for a thin base). Their product is the common-base gain α=γb≈1, and β=α/(1−α)≫1 is
 * the common-emitter gain. The lecture covers the current components, γ and b, α and β,
 * the output characteristics I_C(V_CE), and the Ebers-Moll model. (Early effect,
 * Gummel and f_T are 3ג.)
 */
export const bjtCurrentsGainLecture: LectureModule = {
  id: 'bjt-currents-gain',
  number: 3.2,
  numberLabelHe: '3 · חלק ב׳',
  titleHe: 'טרנזיסטור דו-קוטבי (BJT) — זרמים והגבר',
  subtitleEn: 'BJT: Currents & Gain',
  views: [],
  algorithms: [],
  summary: BjtCurrentsGainExplainer,
  explainer: true,
  glossary: [
    { term: 'רכיבי זרם-הפולט', def: 'זרם-הפולט מתפצל ל-$I_{nE}$ — נושאי-המיעוט המוזרקים (אלקטרונים, ב-npn; הזרם המועיל) — ול-$I_{pE}$ — הזרקה-נגדית של חורים מהבסיס לפולט (אובדן). כלומר $I_E=I_{nE}+I_{pE}$.', tex: 'I_E=I_{nE}+I_{pE}' },
    { term: 'נצילות ההזרקה $\\gamma$', def: 'השבריר של זרם-הפולט הנישא בהזרקה המועילה: $\\gamma=I_{nE}/I_E$. גבוהה כשהפולט מסומם הרבה יותר מהבסיס — $\\gamma\\to1$ כש-$N_E\\gg N_B$.', tex: '\\gamma=\\dfrac{I_{nE}}{I_E}=\\dfrac{1}{1+\\frac{N_B D_E W_B}{N_E D_B W_E}}' },
    { term: 'מקדם מעבר הבסיס $b$', def: 'השבריר מהמטען המוזרק ששורד את הדיפוזיה לרוחב הבסיס ומגיע לקולט: $b=I_C/I_{nE}=1/\\cosh(W_B/L_B)$. $b\\to1$ בבסיס דק ($W_B\\ll L_B$).', tex: 'b=\\dfrac{1}{\\cosh(W_B/L_B)}' },
    { term: 'הגבר בבסיס משותף $\\alpha$', def: 'יחס זרם-הקולט לזרם-הפולט: $\\alpha=I_C/I_E=\\gamma\\,b$, קרוב מאוד ל-1.', tex: '\\alpha=\\gamma\\,b\\approx1' },
    { term: 'הגבר בפולט משותף $\\beta$', def: 'יחס זרם-הקולט לזרם-הבסיס: $\\beta=I_C/I_B=\\alpha/(1-\\alpha)$. רגיש מאוד ל-$\\alpha$: $\\alpha=0.99\\Rightarrow\\beta=99$.', tex: '\\beta=\\dfrac{\\alpha}{1-\\alpha}\\gg1' },
    { term: 'אופייני המוצא $I_C(V_{CE})$', def: 'משפחת-עקומות, אחת לכל $I_B$: באזור ה<b>פעיל</b> הזרם שטוח ($I_C\\approx\\beta I_B$), וב<b>רוויה</b> (מתח-קולט נמוך) יש ברך עד $V_{CE,\\mathrm{sat}}\\approx0.2\\,$V. המרווח בין העקומות $\\propto\\beta$.' },
    { term: 'מודל Ebers-Moll', def: 'מודל המתאר את הטרנזיסטור כשתי דיודות מצומדות עם מקורות-זרם תלויים. נותן את $I_E,I_C$ כפונקציות $V_{BE},V_{BC}$ בכל ארבעת מצבי-הפעולה. מקיים הדדיות $\\alpha_F I_{ES}=\\alpha_R I_{CS}$.', tex: '\\alpha_F I_{ES}=\\alpha_R I_{CS}' },
  ],
  formulas: [
    { name: 'נצילות ההזרקה', tex: '\\gamma=\\dfrac{1}{1+\\dfrac{N_B D_E W_B}{N_E D_B W_E}}', note: '$\\gamma\\to1$ כש-$N_E\\gg N_B$.' },
    { name: 'מקדם מעבר הבסיס', tex: 'b=\\dfrac{1}{\\cosh(W_B/L_B)}\\approx1-\\dfrac{W_B^2}{2L_B^2}', note: '$b\\to1$ בבסיס דק.' },
    { name: 'מקדמי ההגבר', tex: '\\alpha=\\gamma\\,b,\\qquad \\beta=\\dfrac{\\alpha}{1-\\alpha}', note: '$\\alpha\\approx1$, $\\beta\\gg1$.' },
    { name: 'שימור זרם', tex: 'I_E=I_C+I_B,\\quad I_C=\\alpha I_E=\\beta I_B' },
    { name: 'Ebers-Moll', tex: '\\begin{aligned}I_E&=-I_F+\\alpha_R I_R\\\\ I_C&=\\alpha_F I_F-I_R\\end{aligned}', note: '$I_F=I_{ES}(e^{V_{BE}/V_T}\\!-\\!1)$, $I_R=I_{CS}(e^{V_{BC}/V_T}\\!-\\!1)$.' },
  ],
  symbols: [
    { sym: '\\gamma', he: 'נצילות ההזרקה ($I_{nE}/I_E$)', unit: '—' },
    { sym: 'b', he: 'מקדם מעבר הבסיס', unit: '—' },
    { sym: '\\alpha', he: 'הגבר בבסיס משותף ($I_C/I_E$)', unit: '—' },
    { sym: '\\beta', he: 'הגבר בפולט משותף ($I_C/I_B$)', unit: '—' },
    { sym: 'I_{nE}', he: 'זרם האלקטרונים המוזרק מהפולט (מועיל)', unit: 'A' },
    { sym: 'I_{pE}', he: 'זרם החורים הנגדי (פולט←בסיס, אובדן)', unit: 'A' },
    { sym: 'I_R', he: 'זרם הרקומבינציה בבסיס', unit: 'A' },
    { sym: '\\alpha_F,\\alpha_R', he: 'הגבר קדמי/הפוך (Ebers-Moll)', unit: '—' },
    { sym: 'I_{ES},I_{CS}', he: 'זרמי הרוויה של דיודות הפולט/קולט', unit: 'A' },
    { sym: 'V_{CE,\\mathrm{sat}}', he: 'מתח קולט-פולט ברוויה ($\\approx0.2$V)', unit: 'V' },
    { sym: 'D_E,D_B', he: 'מקדמי דיפוזיה של המיעוט בפולט/בסיס', unit: 'cm^2/s' },
  ],
}
