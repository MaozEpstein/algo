import type { LectureModule } from '@/core/engine/types'
import PnJunctionEqExplainer from './PnJunctionEqExplainer'

/**
 * Semiconductors — Lecture 1א: the PN junction at equilibrium. An explainer
 * (5 tabs): how the junction forms, the equilibrium band diagram, the ρ→E→V
 * electrostatics cascade, an interactive sandbox, and a summary. Part ב (the
 * biased diode) follows later.
 */
export const pnJunctionEqLecture: LectureModule = {
  id: 'pn-junction-equilibrium',
  number: 1.1,
  numberLabelHe: '1 · חלק א׳',
  titleHe: 'דיודת PN — הצומת בשיווי משקל',
  subtitleEn: 'PN Junction at Equilibrium',
  views: [],
  algorithms: [],
  summary: PnJunctionEqExplainer,
  explainer: true,
  glossary: [
    { term: 'מל״מ מסוג n', def: 'מוליך-למחצה המסומם בתורמים ($N_D$); נושאי הרוב בו הם אלקטרונים.' },
    { term: 'מל״מ מסוג p', def: 'מוליך-למחצה המסומם במקבלים ($N_A$); נושאי הרוב בו הם חורים.' },
    { term: 'תורם (Donor)', def: 'אטום-זר שתורם אלקטרון חופשי לחומר, ונשאר אחריו יון חיובי קבוע.' },
    { term: 'מקבל (Acceptor)', def: 'אטום-זר ש"לוכד" אלקטרון ויוצר חור, ונשאר אחריו יון שלילי קבוע.' },
    { term: 'נושאי רוב ומיעוט', def: 'הסוג הנפוץ מול הנדיר בכל אזור (בצד n: אלקטרונים רוב, חורים מיעוט).' },
    { term: 'חוק המכפלה', def: 'בשיווי משקל מכפלת הריכוזים קבועה — יותר נושאי רוב ⇒ פחות מיעוט.', tex: 'n\\cdot p = n_i^2' },
    { term: 'דיפוזיה', def: 'זרימת נושאים מאזור בריכוז גבוה לאזור בריכוז נמוך.', tex: 'J = qD\\,\\dfrac{dn}{dx}' },
    { term: 'סחיפה (Drift)', def: 'תנועת נושאים בכוח של שדה חשמלי.', tex: 'J = q\\mu n E' },
    { term: 'אזור המחסור', def: 'רצועה סביב הצומת הריקה מנושאים חופשיים — נשארו בה רק היונים הקבועים.' },
    { term: 'קירוב המחסור', def: 'הנחה שבתוך אזור המחסור $\\rho=\\pm qN$ ומחוצה לו $\\rho=0$ — מה שמפשט את החישוב.' },
    { term: 'מתח בנוי', def: 'מפל הפוטנציאל הפנימי על הצומת בשיווי משקל.', tex: 'V_{bi}=\\dfrac{kT}{q}\\ln\\!\\left(\\dfrac{N_A N_D}{n_i^2}\\right)' },
    { term: 'שדה בנוי', def: 'שדה חשמלי באזור המחסור, מכוון מ-n ל-p, המתנגד לדיפוזיה. שיא בצומת, אפס בקצוות.' },
    { term: 'נייטרליות מטען', def: 'המטען החיובי בצד n שווה לשלילי בצד p.', tex: 'N_A\\,d_p = N_D\\,d_n' },
    { term: 'רוחב אזור המחסור', def: 'גדל עם המתח הבנוי וקטן ככל שהסימום כבד יותר.', tex: 'd = d_n + d_p' },
    { term: 'שדה מרבי', def: 'עוצמת השדה החשמלי בצומת.', tex: 'E_{max} = \\dfrac{2V_{bi}}{d}' },
    { term: 'צומת חד-צדדי', def: 'צד אחד מסומם הרבה יותר; כמעט כל אזור המחסור נמצא בצד המסומם פחות.' },
    { term: 'פסי אנרגיה ($E_c$, $E_v$)', def: 'תחתית פס ההולכה וראש פס הערכיות; הפער ביניהם הוא הפער האסור $E_g$.' },
    { term: 'רמת פרמי $E_F$', def: 'המפלס שקובע את אכלוס הנושאים. בשיווי משקל היא אחידה לכל רוחב ההתקן.' },
    { term: 'יחס בולצמן', def: 'ריכוז הנושאים תלוי מעריכית במרחק רמת פרמי מהרמה האינטרינסית.', tex: 'n = n_i\\,e^{(E_F-E_i)/kT}' },
    { term: 'שיווי משקל', def: 'ללא מתח/אור חיצוני: הסחיפה מאזנת את הדיפוזיה, זרם נטו אפס, ו-$E_F$ אחידה.' },
  ],
  formulas: [
    { name: 'מתח תרמי', tex: '\\frac{kT}{q} \\approx 25.85\\,\\mathrm{mV}', note: 'בטמפרטורת החדר (300K).' },
    { name: 'מתח בנוי', tex: 'V_{bi}=\\frac{kT}{q}\\ln\\!\\left(\\frac{N_A N_D}{n_i^2}\\right)' },
    { name: 'חוק המכפלה (שיווי משקל)', tex: 'n\\cdot p = n_i^2' },
    { name: 'נייטרליות מטען', tex: 'N_A\\,d_p = N_D\\,d_n' },
    { name: 'רוחב אזור המחסור', tex: 'd = \\sqrt{\\frac{2\\varepsilon_s V_{bi}}{q}\\cdot\\frac{N_A+N_D}{N_A N_D}}', note: 'כאשר $\\varepsilon_s=\\varepsilon_r\\varepsilon_0$; בהטיה מחליפים $V_{bi}$ ב-$(V_{bi}-V_A)$.' },
    { name: 'רוחב בצד n', tex: 'd_n = \\sqrt{\\frac{2\\varepsilon_s V_{bi}}{q}\\cdot\\frac{N_A}{N_D(N_A+N_D)}}' },
    { name: 'רוחב בצד p', tex: 'd_p = \\sqrt{\\frac{2\\varepsilon_s V_{bi}}{q}\\cdot\\frac{N_D}{N_A(N_A+N_D)}}' },
    { name: 'שדה מרבי (בצומת)', tex: 'E_{max} = \\frac{2V_{bi}}{d} = \\frac{qN_D d_n}{\\varepsilon_s}' },
    { name: 'ריכוז נושאים (יחס בולצמן)', tex: 'n = n_i\\,e^{(E_F-E_i)/kT}' },
  ],
}
