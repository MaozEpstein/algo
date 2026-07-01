import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'

export interface QuizOption {
  text: ReactNode
  correct: boolean
}
export interface QuizQuestion {
  id: string
  topic: string
  kind: 'single' | 'multi'
  prompt: ReactNode
  options: QuizOption[]
  explanation: ReactNode
  lectureId?: string
  tab?: string
}

/**
 * Cross-cutting synthesis quiz — every question deliberately bridges lessons (the whole point of the
 * overview lesson). `single` = one correct option; `multi` = "select all" (exact-set match). Each has
 * an explanation + an optional deep-link to the source lecture. Deep-links are guarded by overview.test.ts.
 */
export const QUIZ: QuizQuestion[] = [
  {
    id: 'early-clm',
    topic: 'התנגדות-מוצא',
    kind: 'single',
    prompt: <>אפקט Early ב-BJT והתקצרות-התעלה ב-MOSFET נחשבים "אותו אפקט". מה המכנה המשותף הפיזיקלי?</>,
    options: [
      { text: <>מודולציה של <b>רוחב אזור-הפעולה</b> תלוית-מתח → מישור-מוצא משופע ו-<Tex>{'r_o'}</Tex> סופי</>, correct: true },
      { text: <>מנהור דרך מחסום דק</>, correct: false },
      { text: <>רקומבינציה באזור-המחסור</>, correct: false },
      { text: <>רוויית מהירות בשדה גבוה</>, correct: false },
    ],
    explanation: <>בשניהם מתח-המוצא מקצר את האזור המוליך (רוחב-הבסיס ב-BJT, אורך-התעלה ב-MOSFET), הזרם עולה מעט, ולכן <Tex>{'r_o'}</Tex> סופי במקום אינסופי.</>,
    lectureId: 'mosfet-nonideal',
    tab: 'clm',
  },
  {
    id: 'exp-law',
    topic: 'חוק-הצומת',
    kind: 'multi',
    prompt: <>באילו מההתקנים/מנגנונים הזרם תלוי מעריכית במתח כ-<Tex>{'e^{qV/kT}'}</Tex>? (בחרו את כל הנכונים)</>,
    options: [
      { text: <>דיודת PN (חוק הדיודה)</>, correct: true },
      { text: <>הזרקת בסיס-פולט ב-BJT</>, correct: true },
      { text: <>פליטה תרמיונית בשוטקי</>, correct: true },
      { text: <>הולכת תת-סף ב-MOSFET</>, correct: true },
      { text: <>אזור הרוויה (הריבועי) של MOSFET</>, correct: false },
    ],
    explanation: <>בכל מקום שבו נושאים חוצים מחסום-פוטנציאל, התפלגות בולצמן נותנת תלות מעריכית. אזור-הרוויה של MOSFET הוא חוק <b>ריבועי</b> (סחיפה בערוץ), לא מעריכי.</>,
    lectureId: 'ideal-diode',
    tab: 'derivation',
  },
  {
    id: 'scr-two-bjt',
    topic: 'ריבוי-צמתים',
    kind: 'single',
    prompt: <>המבנה ארבע-השכבתי (PNPN) של התיריסטור שקול ל…</>,
    options: [
      { text: <>שני טרנזיסטורים דו-קוטביים (PNP ו-NPN) במשוב חיובי</>, correct: true },
      { text: <>שתי דיודות שוטקי גב-אל-גב</>, correct: false },
      { text: <>MOSFET עם שני שערים</>, correct: false },
      { text: <>דיודת Zener מוגברת</>, correct: false },
    ],
    explanation: <>מפצלים את ארבע השכבות לשני טרנזיסטורים חופפים; המשוב <Tex>{'\\alpha_1+\\alpha_2\\ge1'}</Tex> נועל את ההתקן במצב מוליך.</>,
    lectureId: 'scr',
    tab: 'twotransistor',
  },
  {
    id: 'control-type',
    topic: 'שליטה',
    kind: 'multi',
    prompt: <>אילו מההתקנים הם <b>נשלטי-מתח</b> (עכבת-כניסה גבוהה, כמעט ללא זרם-כניסה)? (בחרו הכול)</>,
    options: [
      { text: <>JFET</>, correct: true },
      { text: <>MOSFET</>, correct: true },
      { text: <>BJT</>, correct: false },
      { text: <>תיריסטור (הצתת-שער)</>, correct: false },
    ],
    explanation: <>JFET ו-MOSFET הם אפקט-שדה — השער שולט דרך שדה/קיבול, כמעט ללא זרם. ב-BJT זרם-הבסיס הוא שמניע, ובתיריסטור ההצתה היא בזרם-שער.</>,
    lectureId: 'jfet',
    tab: 'intro',
  },
  {
    id: 'poisson-reuse',
    topic: 'אלקטרוסטטיקה',
    kind: 'single',
    prompt: <>השרשרת <Tex>{'\\rho\\to E\\to V'}</Tex> (פתרון פואסון באזור-מחסור) חוזרת בכל הרשימה הבאה <b>חוץ</b> מ…</>,
    options: [
      { text: <>גזירת מהירות המיתוג של דיודה (מטען אגור)</>, correct: true },
      { text: <>רוחב-המחסור והמתח-הבנוי בצומת PN</>, correct: false },
      { text: <>גובה-המחסום בדיודת שוטקי</>, correct: false },
      { text: <>מתח-הצביטה <Tex>{'V_P'}</Tex> ב-JFET</>, correct: false },
    ],
    explanation: <>רוחב-מחסור, מתח-בנוי, גובה-מחסום ו-<Tex>{'V_P'}</Tex> נגזרים כולם מפואסון (אלקטרוסטטיקה). מהירות-המיתוג נשלטת ע״י <b>אגירת מטען-מיעוט ופינויו</b> — דינמיקה, לא אלקטרוסטטיקה.</>,
    lectureId: 'pn-junction-equilibrium',
  },
  {
    id: 'subthreshold-diffusion',
    topic: 'תת-סף',
    kind: 'single',
    prompt: <>מדוע הולכת תת-הסף של MOSFET "מזכירה BJT"?</>,
    options: [
      { text: <>שתיהן הולכת <b>דיפוזיה</b> מעל מחסום, ולכן מעריכיות במתח</>, correct: true },
      { text: <>בשתיהן יש ערוץ-היפוך</>, correct: false },
      { text: <>בשתיהן הזרם ריבועי במתח</>, correct: false },
      { text: <>בשתיהן השער מבודד</>, correct: false },
    ],
    explanation: <>מתחת לסף אין ערוץ-סחיפה חזק; הנושאים מתפזרים מעל מחסום — בדיוק כמו הזרקה ב-BJT. מכאן גם נדנוד-הסף <Tex>{'S\\approx60'}</Tex> mV/dec.</>,
    lectureId: 'mosfet-nonideal',
    tab: 'subthreshold',
  },
  {
    id: 'breakdown-mech',
    topic: 'פריצה',
    kind: 'multi',
    prompt: <>אילו טענות על מנגנוני-הפריצה נכונות? (בחרו הכול)</>,
    options: [
      { text: <>מפולת = יינון-פגיעה, שכיחה בצמתים רחבים/מסוממים חלש</>, correct: true },
      { text: <>Zener = מנהור, שכיח בצמתים צרים/מסוממים כבד</>, correct: true },
      { text: <>ההגבר של BJT <b>מחמיר</b> את מתח-הפריצה (<Tex>{'BV_{CEO}<BV_{CBO}'}</Tex>)</>, correct: true },
      { text: <>פריצה תמיד הורסת את ההתקן באופן בלתי-הפיך</>, correct: false },
    ],
    explanation: <>מפולת ומנהור הם שני מנגנונים שונים (רוחב/סימום), וההגבר ב-BJT מנצל את נושאי-הפריצה ומחמיר אותה. פריצה מבוקרת (Zener) היא <b>הפיכה</b> ושמישה לייחוס-מתח.</>,
    lectureId: 'pn-junction-bias',
    tab: 'reverse',
  },
  {
    id: 'schottky-vs-pn',
    topic: 'דיודות',
    kind: 'single',
    prompt: <>יתרון מרכזי של דיודת שוטקי על דיודת PN במיתוג מהיר נובע מ…</>,
    options: [
      { text: <>היעדר אגירת מטען-מיעוט (הולכת נשאי-רוב) → אין שחזור-אחורי איטי</>, correct: true },
      { text: <>מפל-מתח קדמי גבוה יותר</>, correct: false },
      { text: <>מתח-פריצה גבוה יותר</>, correct: false },
      { text: <>זרם-דלף נמוך יותר</>, correct: false },
    ],
    explanation: <>שוטקי מוליכה בנשאי-רוב, ולכן אין מטען-מיעוט אגור לפנות בכיבוי — מיתוג מהיר מאוד. מחיר: מפל קדמי נמוך אך זרם-דלף גבוה יותר.</>,
    lectureId: 'schottky-diode',
    tab: 'vspn',
  },
]
