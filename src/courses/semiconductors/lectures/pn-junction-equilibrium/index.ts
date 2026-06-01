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
    { term: 'מל״מ מסוג n', def: 'מוליך-למחצה המסומם בתורמים (N_D); נושאי הרוב בו הם אלקטרונים.' },
    { term: 'מל״מ מסוג p', def: 'מוליך-למחצה המסומם במקבלים (N_A); נושאי הרוב בו הם חורים.' },
    { term: 'תורם (Donor)', def: 'אטום-זר שתורם אלקטרון חופשי לחומר, ונשאר אחריו יון חיובי קבוע.' },
    { term: 'מקבל (Acceptor)', def: 'אטום-זר ש"לוכד" אלקטרון ויוצר חור, ונשאר אחריו יון שלילי קבוע.' },
    { term: 'נושאי רוב ומיעוט', def: 'הסוג הנפוץ מול הנדיר בכל אזור (בצד n: אלקטרונים רוב, חורים מיעוט).' },
    { term: 'חוק המכפלה', def: 'בשיווי משקל מכפלת הריכוזים קבועה: n·p = n_i². יותר נושאי רוב ⇒ פחות מיעוט.' },
    { term: 'דיפוזיה', def: 'זרימת נושאים מאזור בריכוז גבוה לאזור בריכוז נמוך. J = qD·(dn/dx).' },
    { term: 'סחיפה (Drift)', def: 'תנועת נושאים בכוח של שדה חשמלי. J = qμnE.' },
    { term: 'אזור המחסור', def: 'רצועה סביב הצומת הריקה מנושאים חופשיים — נשארו בה רק היונים הקבועים.' },
    { term: 'קירוב המחסור', def: 'הנחה שבתוך אזור המחסור ρ=±qN ומחוצה לו ρ=0 — מה שמפשט את החישוב.' },
    { term: 'מתח בנוי V_bi', def: 'מפל הפוטנציאל הפנימי על הצומת בשיווי משקל: V_bi=(kT/q)·ln(N_A·N_D/n_i²).' },
    { term: 'שדה בנוי', def: 'שדה חשמלי באזור המחסור, מכוון מ-n ל-p, המתנגד לדיפוזיה. שיא בצומת, אפס בקצוות.' },
    { term: 'נייטרליות מטען', def: 'המטען החיובי בצד n שווה לשלילי בצד p: N_A·d_p = N_D·d_n.' },
    { term: 'רוחב אזור המחסור d', def: 'd = d_n + d_p. גדל עם V_bi וקטן ככל שהסימום כבד יותר.' },
    { term: 'שדה מרבי E_max', def: 'עוצמת השדה בצומת: E_max = 2·V_bi/d.' },
    { term: 'צומת חד-צדדי', def: 'צד אחד מסומם הרבה יותר; כמעט כל אזור המחסור נמצא בצד המסומם פחות.' },
    { term: 'פסי אנרגיה (E_c, E_v)', def: 'תחתית פס ההולכה וראש פס הערכיות; הפער ביניהם הוא הפער האסור E_g.' },
    { term: 'רמת פרמי E_F', def: 'המפלס שקובע את אכלוס הנושאים. בשיווי משקל היא אחידה לכל רוחב ההתקן.' },
    { term: 'יחס בולצמן', def: 'ריכוז הנושאים תלוי מעריכית במרחק E_F מ-E_i: n = n_i·e^{(E_F−E_i)/kT}.' },
    { term: 'שיווי משקל', def: 'ללא מתח/אור חיצוני: הסחיפה מאזנת את הדיפוזיה, זרם נטו אפס, ו-E_F אחידה.' },
  ],
}
