import type { LectureModule } from '@/core/engine/types'
import IdealDiodeExplainer from './IdealDiodeExplainer'

/**
 * Semiconductors — Lecture 2א: the ideal (Shockley) diode. Turns the qualitative
 * injection story of lesson 1ב into a current: the injected minority carriers
 * diffuse and recombine, and the diffusion current at the depletion edges gives
 * I = I_S(e^{V_A/V_T} − 1). Tabs: from-injection-to-current, the decaying
 * minority profile, the derivation, the I–V characteristic, the saturation
 * current & electron/hole split, a sandbox, practice, and a summary. The
 * non-ideal diode (recombination current, high injection) follows.
 */
export const idealDiodeLecture: LectureModule = {
  id: 'ideal-diode',
  number: 2.1,
  numberLabelHe: '2 · חלק א׳',
  titleHe: 'דיודת PN — דיודה אידיאלית',
  subtitleEn: 'The Ideal Diode',
  views: [],
  algorithms: [],
  summary: IdealDiodeExplainer,
  explainer: true,
  glossary: [
    { term: 'דיודה אידיאלית', def: 'מודל הדיודה בהנחות מפשטות: דיפוזיה בלבד באזורים הניטרליים, ללא רקומבינציה באזור המחסור, הזרקה חלשה, וצומת חד.' },
    { term: 'משוואת שוקלי', def: 'אופיין הזרם-מתח של הדיודה האידיאלית — מעריכי בקדמי, רווי באחורי.', tex: 'I=I_S\\left(e^{V_A/V_T}-1\\right)' },
    { term: 'זרם הרוויה $I_S$', def: 'הזרם האחורי המקסימלי (זעיר), שנקבע מהזרקת נושאי המיעוט; תלוי חזק בטמפרטורה ($\\propto n_i^2$).', tex: 'J_S=q n_i^2\\left(\\tfrac{D_p}{L_p N_D}+\\tfrac{D_n}{L_n N_A}\\right)' },
    { term: 'זרם דיפוזיה', def: 'זרם נושאי המיעוט המוזרקים — פרופורציוני לשיפוע פרופיל הריכוז בקצה אזור המחסור.', tex: 'J_p=qD_p\\tfrac{\\Delta p_n(0)}{L_p}' },
    { term: 'אורך דיפוזיה $L$', def: 'המרחק הממוצע שנושא מיעוט עודף עובר לפני שהוא נעלם ברקומבינציה.', tex: 'L=\\sqrt{D\\tau}' },
    { term: 'יחס איינשטיין', def: 'קושר את מקדם הדיפוזיה לניידות — אותן התנגשויות תרמיות קובעות את שניהם.', tex: 'D=\\frac{kT}{q}\\,\\mu' },
    { term: 'איזון דיפוזיה-סחיפה', def: 'בשיווי-משקל זרם הדיפוזיה (רוב, מעל המחסום) שווה והפוך לזרם הסחיפה/גנרציה (מיעוט, קבוע ~$I_S$). המתח מפר את האיזון: ה-$I_S$ הוא זרם החליפין המאוזן, וה-"$-1$" הוא זרם הסחיפה שתמיד נוכח.', tex: 'I=I_S e^{V_A/V_T}-I_S' },
    { term: 'מיישר (Rectifier)', def: 'דיודה מוליכה היטב בקדמי (שסתום פתוח) וכמעט חוסמת באחורי ($-I_S$ זעיר) — שסתום חד-כיווני לזרם.' },
    { term: 'הנחות הדיודה האידיאלית', def: 'צומת חד · הזרקה חלשה · אין גנרציה/רקומבינציה באזור המחסור · האזורים הניטרליים מוליכים-כמעט (כל המתח על המחסור).' },
  ],
  formulas: [
    { name: 'אופיין הדיודה (שוקלי)', tex: 'I=I_S\\left(e^{V_A/V_T}-1\\right)', note: 'מעריכי בקדמי, רווי ($-I_S$) באחורי.' },
    { name: 'פירוק לשני זרמים', tex: 'I=I_{\\text{diff}}-I_{\\text{drift}}=I_S e^{V_A/V_T}-I_S', note: 'ה-$I_S$ = זרם החליפין; ה-"$-1$" = זרם הסחיפה הקבוע.' },
    { name: 'זרם הרוויה', tex: 'J_S=q\\,n_i^2\\left(\\frac{D_p}{L_p N_D}+\\frac{D_n}{L_n N_A}\\right)' },
    { name: 'יחס איינשטיין', tex: 'D=\\frac{kT}{q}\\,\\mu' },
    { name: 'אורך דיפוזיה', tex: 'L=\\sqrt{D\\,\\tau}' },
    { name: 'פרופיל המיעוט המוזרק', tex: '\\Delta p_n(x)=\\Delta p_n(0)\\,e^{-x/L_p}', note: 'דועך על סקאלת $L_p$ באזור הניטרלי.' },
    { name: 'חוק הצומת (תנאי השפה)', tex: '\\Delta p_n(0)=p_{n0}\\left(e^{V_A/V_T}-1\\right)' },
  ],
  symbols: [
    { sym: 'J', he: 'צפיפות זרם הדיודה', unit: 'A/cm^2' },
    { sym: 'J_S', he: 'צפיפות זרם הרוויה (האחורי המקסימלי)', unit: 'A/cm^2' },
    { sym: 'D_n,\\;D_p', he: 'מקדמי הדיפוזיה (איינשטיין $D=\\tfrac{kT}{q}\\mu$)', unit: 'cm^2/s' },
    { sym: 'L_n,\\;L_p', he: 'אורכי הדיפוזיה של נושאי המיעוט', unit: 'cm' },
    { sym: '\\tau_n,\\;\\tau_p', he: 'זמני החיים של נושאי המיעוט', unit: 's' },
    { sym: '\\mu_n,\\;\\mu_p', he: 'ניידויות האלקטרונים והחורים', unit: 'cm^2/Vs' },
    { sym: '\\Delta p_n(0)', he: 'ריכוז החורים העודף בקצה אזור המחסור (צד n)', unit: 'cm^{-3}' },
  ],
}
