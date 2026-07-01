import type { LectureModule } from '@/core/engine/types'
import OverviewExplainer from './OverviewExplainer'

/**
 * Semiconductors — Lesson 0: a cross-cutting synthesis / bird's-eye view of the whole course.
 * Not new physics, but the connective tissue: an interactive course map (how understanding is
 * built, layer by layer), a compendium of the non-ideal effects organized by *effect-family*
 * to expose parallels (Early ≡ channel-length modulation, the breakdown mechanisms, the high-field
 * effects…), the recurring equations reused across devices (exp(qV/kT), ρ→E→V, the g_m/r_o
 * small-signal skeleton), a BJT/JFET/MOSFET comparison, and a band-diagram atlas. Placed at
 * number 0 so it sits at the top as an always-accessible map and reference.
 */
export const overviewLecture: LectureModule = {
  id: 'overview',
  number: 0,
  numberLabelHe: 'מבט-על',
  titleHe: 'מבט-על וסינתזה — המפה של הקורס',
  subtitleEn: 'Synthesis: The Map of the Course',
  views: [],
  algorithms: [],
  summary: OverviewExplainer,
  explainer: true,
  glossary: [
    { term: 'סחיפה מול דיפוזיה', def: 'שני מנגנוני-ההובלה שחוזרים בכל הקורס: סחיפה מונעת-שדה ($J=\\sigma E$) ודיפוזיה מונעת-מפל-ריכוז ($J=qD\\,dn/dx$). קשורים ביחס איינשטיין $D/\\mu=kT/q$.' },
    { term: 'חוק-הצומת', def: 'ה-$e^{qV/kT}$ שחוזר בדיודה, ב-BJT, בפליטה תרמיונית (שוטקי) ובתת-סף של MOSFET — כולם הולכה מעל מחסום.', tex: 'n=n_0\\,e^{qV/kT}' },
    { term: 'אלקטרוסטטיקת ρ→E→V', def: 'אותה שרשרת (פואסון) בכל אזור-מחסור: מטען-מרחב → שדה → פוטנציאל. מופיעה בצומת, בשוטקי, ב-MOS וב-pinch-off של JFET.', tex: '\\dfrac{dE}{dx}=\\dfrac{\\rho}{\\varepsilon_s}' },
    { term: 'שלד אות-קטן', def: 'כל טרנזיסטור מיוצג באותו שלד: מקור-זרם מבוקר $g_m v_{in}$ עם התנגדות-מוצא $r_o$. ה-$g_m$ משתנה, המבנה זהה.', tex: 'i_{out}=g_m v_{in}' },
    { term: 'Early ≡ התקצרות-תעלה', def: 'אותו אפקט בשני שמות: מודולציה של רוחב-אפקטיבי תלוי-מתח (בסיס ב-BJT, תעלה ב-MOSFET) → מישור-מוצא משופע ו-$r_o$ סופי.' },
  ],
  formulas: [
    { name: 'חוק-הצומת', tex: 'I=I_S\\left(e^{qV/kT}-1\\right)' },
    { name: 'אלקטרוסטטיקה (פואסון)', tex: '\\dfrac{d^2\\psi}{dx^2}=-\\dfrac{\\rho}{\\varepsilon_s}' },
    { name: 'יחס איינשטיין', tex: '\\dfrac{D}{\\mu}=\\dfrac{kT}{q}' },
    { name: 'שלד אות-קטן', tex: 'i_{out}=g_m v_{in},\\quad r_o=\\dfrac{\\partial V}{\\partial I}' },
  ],
  symbols: [
    { sym: 'e^{qV/kT}', he: 'הגורם הבולצמני של חוק-הצומת', unit: '—' },
    { sym: 'g_m', he: 'מוליכות-המעבר (משותפת לכל הטרנזיסטורים)', unit: 'S' },
    { sym: 'r_o', he: 'התנגדות-המוצא (אות-קטן)', unit: '\\Omega' },
    { sym: '\\rho\\to E\\to V', he: 'שרשרת האלקטרוסטטיקה בכל מחסור', unit: '—' },
  ],
}
