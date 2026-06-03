import type { LectureModule } from '@/core/engine/types'
import PnJunctionBiasExplainer from './PnJunctionBiasExplainer'

/**
 * Semiconductors — Lecture 1ב: the PN junction under applied bias. An explainer
 * (8 tabs): מבוא (what bias is, sign conventions, where V_A drops); ממתח קדמי
 * (barrier ↓, depletion ↓, field ↓); ממתח אחורי (barrier ↑, depletion ↑); רוחב
 * המחסור והקיבול (d(V_A), junction capacitance C_j, the 1/C² extraction);
 * הזרקת מיעוט וחוק הצומת (n_p(0)=n_{p0}e^{V_A/V_T} — the bridge to the diode
 * current); ארגז חול (a bias slider driving the biased band diagram + ρ→E→V);
 * תרגול; and a summary. The ideal-diode I–V characteristic follows in the next
 * part (the ideal diode).
 */
export const pnJunctionBiasLecture: LectureModule = {
  id: 'pn-junction-bias',
  number: 1.2,
  numberLabelHe: '1 · חלק ב׳',
  titleHe: 'צומת PN — תחת ממתח',
  subtitleEn: 'PN Junction Under Applied Bias',
  views: [],
  algorithms: [],
  summary: PnJunctionBiasExplainer,
  explainer: true,
  glossary: [
    { term: 'ממתח (Bias)', def: 'מתח $V_A$ המופעל על הצומת. כמעט כולו נופל על אזור המחסור (ההתנגדות הגבוהה), כי הבולק הניטרלי כמעט-מוליך.' },
    { term: 'ממתח קדמי', def: 'הקוטב החיובי על צד p ($V_A>0$). המחסום יורד, אזור המחסור מצטמצם, השדה הבנוי נחלש — והדיפוזיה גוברת.', tex: 'q(V_{bi}-V_A)' },
    { term: 'ממתח אחורי', def: 'הקוטב החיובי על צד n ($V_A<0$). המחסום עולה, אזור המחסור מתרחב והשדה מתחזק; זורם רק זרם מיעוט זעיר.', tex: 'q(V_{bi}+|V_A|)' },
    { term: 'מחסום הפוטנציאל תחת ממתח', def: 'מפל הפוטנציאל הפעיל על הצומת. תחת ממתח הוא $V_{bi}-V_A$ במקום $V_{bi}$ של שיווי המשקל.', tex: 'q(V_{bi}-V_A)' },
    { term: 'רמות קוואזי-פרמי', def: 'מחוץ לשיווי משקל רמת פרמי מתפצלת לשתיים — $E_{Fn}$ לאלקטרונים ו-$E_{Fp}$ לחורים — המופרדות בדיוק ב-$qV_A$ על הצומת.', tex: 'E_{Fn}-E_{Fp}=qV_A' },
    { term: 'קיבול הצומת', def: 'אזור המחסור מתנהג כקבל לוחות; הקיבול ליחידת שטח גדל בממתח קדמי (אזור צר) וקטֵן בממתח אחורי.', tex: 'C_j/A=\\varepsilon_s/d \\propto (V_{bi}-V_A)^{-1/2}' },
    { term: 'חילוץ מקיבול ($1/C_j^2$)', def: 'הגרף של $1/C_j^2$ מול $V_A$ הוא קו ישר: השיפוע נותן את הסימום, וחיתוך הציר נותן את $V_{bi}$. שיטת מדידה נפוצה.' },
    { term: 'הזרקת מיעוט (Injection)', def: 'בממתח קדמי נושאי מיעוט נדחפים מעבר לצומת ומצטברים מעל ריכוז שיווי המשקל בקצה אזור המחסור.' },
    { term: 'חוק הצומת', def: 'ריכוז המיעוט בקצה אזור המחסור עולה מעריכית עם המתח. זהו תנאי השפה שמוליד את זרם הדיודה.', tex: 'n_p(0)=n_{p0}\\,e^{V_A/V_T}' },
    { term: 'זרם דליפה (אחורי)', def: 'בממתח אחורי זורם זרם מיעוט קטן ורווי — מקדים את זרם הרוויה $I_S$ שייגזר בשיעור הבא.' },
    { term: 'רוחב המחסור $W\\equiv d$', def: 'רוחב אזור המחסור; חלק מהספרים מסמנים אותו $W$, וכאן $d$. תחת ממתח הוא תלוי-מתח: $d(V_A)$.' },
    { term: 'פריצה (Breakdown)', def: 'בממתח אחורי גבוה דיו הזרם מזנק במתח אופייני $V_{BR}$ — ה"ברך" באופיין. לא הרסנית כל עוד מגבילים את הזרם.' },
    { term: 'פריצת מפולת (Avalanche)', def: 'בשדה חזק נושא מיינן אטום בהתנגשות ויוצר זוג; כפל-מפולת. סימום קל, $V_{BR}$ גבוה, מקדם-טמפ׳ חיובי.' },
    { term: 'פריצת Zener', def: 'מנהור פס-לפס דרך מחסור צר מאוד (סימום כבד, שדה עצום). $V_{BR}$ נמוך (≲5V), מקדם-טמפ׳ שלילי.' },
    { term: 'דיודת Zener', def: 'דיודה שמופעלת באזור הפריצה — מתח-הברך כמעט קבוע, ולכן משמשת לייצוב מתח.' },
  ],
  formulas: [
    { name: 'מחסום הפוטנציאל תחת ממתח', tex: 'q(V_{bi}-V_A)', note: 'ממתח קדמי ($V_A>0$) מוריד, ממתח אחורי ($V_A<0$) מעלה.' },
    { name: 'רוחב אזור המחסור תחת ממתח', tex: 'd(V_A)=\\sqrt{\\frac{2\\varepsilon_s}{q}\\,(V_{bi}-V_A)\\,\\frac{N_A+N_D}{N_A N_D}}' },
    { name: 'שדה מרבי תחת ממתח', tex: 'E_{max}=\\frac{2(V_{bi}-V_A)}{d}' },
    { name: 'קיבול הצומת (ליחידת שטח)', tex: 'C_j/A=\\frac{\\varepsilon_s}{d}=\\sqrt{\\frac{q\\,\\varepsilon_s}{2(V_{bi}-V_A)}\\cdot\\frac{N_A N_D}{N_A+N_D}}' },
    { name: 'חילוץ מקיבול', tex: '\\frac{1}{C_j^2}\\propto (V_{bi}-V_A)', note: 'קו ישר ב-$V_A$ — שיפוע→סימום, חיתוך→$V_{bi}$.' },
    { name: 'פיצול קוואזי-פרמי', tex: 'E_{Fn}-E_{Fp}=qV_A' },
    { name: 'חוק הצומת', tex: 'n_p(0)=n_{p0}\\,e^{V_A/V_T},\\quad p_n(0)=p_{n0}\\,e^{V_A/V_T}', note: 'הגשר אל זרם הדיודה (נגזר בהמשך).' },
  ],
  symbols: [
    { sym: 'V_A', he: 'המתח החיצוני המופעל (קדמי $>0$, אחורי $<0$)', unit: 'V' },
    { sym: 'V_{bi}-V_A', he: 'מפל הפוטנציאל הפעיל על הצומת תחת ממתח', unit: 'V' },
    { sym: 'q(V_{bi}-V_A)', he: 'גובה מחסום האנרגיה תחת ממתח', unit: 'eV' },
    { sym: 'E_{Fn}', he: 'רמת קוואזי-פרמי לאלקטרונים', unit: 'eV' },
    { sym: 'E_{Fp}', he: 'רמת קוואזי-פרמי לחורים', unit: 'eV' },
    { sym: 'C_j', he: 'קיבול הצומת (אזור המחסור)', unit: 'F' },
    { sym: 'C_j/A', he: 'קיבול ליחידת שטח, $=\\varepsilon_s/d$', unit: 'F/cm^2' },
    { sym: '1/C_j^2', he: 'הגודל הליניארי ב-$V_A$ (לחילוץ סימום ו-$V_{bi}$)', unit: 'cm^4/F^2' },
    { sym: 'n_p(0)', he: 'ריכוז אלקטרונים (מיעוט) בקצה המחסור בצד p', unit: 'cm^{-3}' },
    { sym: 'p_n(0)', he: 'ריכוז חורים (מיעוט) בקצה המחסור בצד n', unit: 'cm^{-3}' },
    { sym: 'n_{p0},\\;p_{n0}', he: 'ריכוזי המיעוט בשיווי משקל (ייחוס לחוק הצומת)', unit: 'cm^{-3}' },
    { sym: 'd(V_A)', he: 'רוחב אזור המחסור התלוי במתח', unit: 'cm' },
    { sym: 'V_T = kT/q', he: 'המתח התרמי (מופיע בחוק הצומת)', unit: 'V' },
    { sym: 'C_d', he: 'קיבול הדיפוזיה — אגירת מטען מיעוט; שולט בממתח קדמי', unit: 'F/cm^2' },
    { sym: 'V_{on}', he: 'מתח ההצתה — סביבו הדיודה מתחילה להוליק (~0.6–0.7V ב-Si)', unit: 'V' },
    { sym: 'V_{BR}', he: 'מתח הפריצה — סביבו הזרם האחורי מזנק', unit: 'V' },
  ],
}
