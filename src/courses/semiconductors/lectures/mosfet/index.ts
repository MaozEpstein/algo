import type { LectureModule } from '@/core/engine/types'
import MosfetExplainer from './MosfetExplainer'

/**
 * Semiconductors — Lesson 7 · part א׳: the ideal (long-channel) MOSFET. The MOS-capacitor
 * inversion layer becomes a conducting CHANNEL once two n⁺ source/drain contacts flank the gate.
 * V_GS>V_T turns the device on; V_DS tapers the channel (local overdrive V_GS−V_T−V(y)) until it
 * PINCHES OFF at the drain (V_DS,sat=V_GS−V_T) → saturation. The gradual-channel model gives the
 * triode law I_DS=k[(V_GS−V_T)V_DS−V_DS²/2] and the square-law saturation I_DS=(k/2)(V_GS−V_T)²
 * with k=(W/L)μ*C_ox; output & transfer characteristics; NMOS/PMOS + enhancement/depletion; and
 * the small-signal model g_m=k(V_GS−V_T), ideal r_o→∞, with the common-source load line.
 * Grounded in the class summary (structure → operation → derivation → characteristics).
 */
export const mosfetLecture: LectureModule = {
  id: 'mosfet',
  number: 7.1,
  numberLabelHe: '7 · חלק א׳',
  lessonHe: 'טרנזיסטור MOS (MOSFET)',
  titleHe: 'טרנזיסטור MOS — מבנה, פעולה ואופיינים',
  subtitleEn: 'MOSFET: Structure, Operation & Characteristics',
  views: [],
  algorithms: [],
  summary: MosfetExplainer,
  explainer: true,
  glossary: [
    { term: 'MOSFET', def: 'טרנזיסטור-שדה עם שער מבודד (MOS) מעל ערוץ בין מקור לניקוז. מתח-השער שולט קיבולית במוליכות הערוץ — כניסה ללא זרם-שער.' },
    { term: 'ערוץ (Channel)', def: 'שכבת-ההיפוך המוליכה שנוצרת מתחת לשער כאשר $V_{GS}>V_T$ ומחברת מקור↔ניקוז.' },
    { term: 'מתח-סף $V_T$', def: 'מתח-השער ליצירת הערוץ. מתחתיו ההתקן כבוי (קטעון). זהו מתח-הסף של קבל ה-MOS.', tex: 'V_{GS}>V_T\\Rightarrow\\text{on}' },
    { term: 'מקדם ההולכה $k$', def: 'קובע את עוצמת הזרם: $k=\\frac{W}{L}\\mu^*C_{ox}$ (יחידות A/V²). תלוי בגאומטריה, בניידות ובקיבול-האוקסיד.', tex: 'k=\\dfrac{W}{L}\\mu^*C_{ox}' },
    { term: 'טריודה (לינארי)', def: 'למתחי-ניקוז קטנים ($V_{DS}<V_{GS}-V_T$) הערוץ פתוח לכל אורכו — ההתקן נגד נשלט-מתח.', tex: 'I_{DS}=k\\!\\left[(V_{GS}-V_T)V_{DS}-\\tfrac{V_{DS}^2}{2}\\right]' },
    { term: 'צביטה ורוויה', def: 'ב-$V_{DS}=V_{DS,sat}=V_{GS}-V_T$ הערוץ נצבט בקצה-הניקוז; מעבר לכך הזרם רווי (חוק ריבועי).', tex: 'I_{DS}=\\tfrac{k}{2}(V_{GS}-V_T)^2' },
    { term: 'מוליכות-מעבר $g_m$', def: 'רגישות הזרם למתח-השער (אות-קטן): $g_m=k(V_{GS}-V_T)=\\sqrt{2kI_{DS}}$.', tex: 'g_m=\\dfrac{\\partial I_{DS}}{\\partial V_{GS}}' },
    { term: 'אנהנסמנט / דיפלישן', def: 'אנהנסמנט — אין ערוץ ב-$V_{GS}=0$, צריך ליצור אותו. דיפלישן — ערוץ קיים מראש, מתח-השער מדלל אותו.' },
  ],
  formulas: [
    { name: 'מטען הערוץ המקומי', tex: 'Q_n(y)=-C_{ox}\\big(V_{GS}-V_T-V(y)\\big)' },
    { name: 'מקדם ההולכה', tex: 'k=\\dfrac{W}{L}\\mu^*C_{ox}' },
    { name: 'טריודה', tex: 'I_{DS}=k\\left[(V_{GS}-V_T)V_{DS}-\\dfrac{V_{DS}^2}{2}\\right]', note: 'תקף ל-$V_{DS}<V_{GS}-V_T$.' },
    { name: 'רוויה (חוק ריבועי)', tex: 'I_{DS}=\\dfrac{k}{2}(V_{GS}-V_T)^2' },
    { name: 'מתח-רוויה', tex: 'V_{DS,sat}=V_{GS}-V_T' },
    { name: 'מוליכות-מעבר', tex: 'g_m=k(V_{GS}-V_T)=\\sqrt{2k\\,I_{DS}}' },
  ],
  symbols: [
    { sym: 'V_{GS}', he: 'מתח שער-מקור', unit: 'V' },
    { sym: 'V_{DS}', he: 'מתח ניקוז-מקור', unit: 'V' },
    { sym: 'V_T', he: 'מתח-הסף', unit: 'V' },
    { sym: 'V_{DS,sat}', he: 'מתח-הניקוז לכניסה לרוויה ($=V_{GS}-V_T$)', unit: 'V' },
    { sym: 'k', he: 'מקדם ההולכה ($\\frac{W}{L}\\mu^*C_{ox}$)', unit: 'A/V^2' },
    { sym: 'Q_{inv}', he: 'צפיפות מטען-ההיפוך (הערוץ)', unit: 'C/cm^2' },
    { sym: 'g_m', he: 'מוליכות-המעבר', unit: 'S' },
    { sym: 'W,\\,L', he: 'רוחב ואורך הערוץ', unit: 'cm' },
  ],
}
