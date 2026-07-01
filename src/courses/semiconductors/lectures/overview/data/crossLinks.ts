/**
 * Single source of truth for the cross-course "non-ideal effects" compendium. Organized by
 * EFFECT-FAMILY (not by device) so the parallels between devices jump out. Every `lectureId`/`tab`
 * is a real deep-link target — guarded by overview.test.ts against the registry.
 */
export interface CrossLink {
  device: string
  lectureId: string
  tab: string
  formula?: string // KaTeX
  note?: string
}
export interface EffectFamily {
  id: string
  title: string
  icon: string
  /** The shared physics idea (may contain $…$ inline math). */
  shared: string
  members: CrossLink[]
}

export const EFFECT_FAMILIES: EffectFamily[] = [
  {
    id: 'rout',
    title: 'התנגדות-מוצא סופית',
    icon: '📈',
    shared: 'מודולציה של **רוחב-אפקטיבי תלוי-מתח** של אזור-הפעולה → מישור-המוצא אינו שטוח, והזרם עולה מעט עם מתח-המוצא. אותה פיזיקה בדיוק ב-BJT וב-MOSFET.',
    members: [
      { device: 'BJT · אפקט Early', lectureId: 'bjt-nonideal', tab: 'early', formula: 'I_C\\propto\\left(1+\\dfrac{V_{CE}}{V_A}\\right),\\ r_o\\approx\\dfrac{V_A}{I_C}', note: 'אפנון רוחב-הבסיס ע״י $V_{CE}$.' },
      { device: 'MOSFET · התקצרות-תעלה', lectureId: 'mosfet-nonideal', tab: 'clm', formula: 'I_D=\\tfrac{k}{2}(V_{GS}-V_T)^2(1+\\lambda V_{DS}),\\ r_o\\approx\\dfrac{1}{\\lambda I_D}', note: 'אזור-המחסור בניקוז מקצר את התעלה.' },
    ],
  },
  {
    id: 'breakdown',
    title: 'פריצה (Breakdown)',
    icon: '⚡',
    shared: 'מעל שדה/מתח קריטי ההתקן "נשבר": **יינון-פגיעה** (מפולת) או **מנהור** (Zener) בצומת, ו**משוב-חיובי** שנועל מבנה רב-שכבתי.',
    members: [
      { device: 'צומת PN · מפולת + Zener', lectureId: 'pn-junction-bias', tab: 'reverse', formula: 'V_{BR}', note: 'יינון-פגיעה (רחב) מול מנהור (צר, מסומם כבד).' },
      { device: 'BJT · פריצה', lectureId: 'bjt-nonideal', tab: 'breakdown', formula: 'BV_{CEO}=\\dfrac{BV_{CBO}}{\\sqrt[n]{\\beta}}', note: 'ההגבר מחמיר את הפריצה.' },
      { device: 'תיריסטור · latch/NDR', lectureId: 'scr', tab: 'latch', formula: '\\alpha_1+\\alpha_2\\ge1', note: 'משוב-חיובי → הצתה ואזור התנגדות-שלילית.' },
    ],
  },
  {
    id: 'highfield',
    title: 'אפקטי שדה/זרם גבוה',
    icon: '🏎️',
    shared: 'בשדות ובזרמים גבוהים ההנחות הליניאריות נשברות: **המהירות נרווית**, **הניידות יורדת**, וריכוזי-הנושאים כבר אינם "מיעוט".',
    members: [
      { device: 'MOSFET · רוויית-מהירות', lectureId: 'mosfet-nonideal', tab: 'velocity', formula: 'I_{DS,sat}\\propto W C_{ox}(V_{GS}-V_T)v_{sat}', note: 'מ-ריבועי ל-לינארי.' },
      { device: 'MOSFET · הדרדרות-ניידות', lectureId: 'mosfet-nonideal', tab: 'mobility', formula: '\\mu_{eff}=\\dfrac{\\mu_0}{1+\\theta(V_{GS}-V_T)}', note: 'פיזור-שטח מהשדה האנכי.' },
      { device: 'דיודה · הזרקה חזקה', lectureId: 'non-ideal-diode', tab: 'highInjection', formula: 'I\\propto e^{qV/2kT}', note: 'המיעוט המוזרק משתווה לרוב.' },
    ],
  },
  {
    id: 'ideality',
    title: 'זליגה ומקדם-אי-אידאליות',
    icon: '📉',
    shared: 'זרם שחורג מ-$e^{qV/kT}$ האידיאלי — הולכת-**דיפוזיה**/רקומבינציה חלשה שמיוצגת ב**מקדם-אי-אידאליות** $n$ או בנדנוד-תת-סף.',
    members: [
      { device: 'דיודה · זרם רקומבינציה ($n$)', lectureId: 'non-ideal-diode', tab: 'recombination', formula: 'I\\propto e^{qV/nkT},\\ 1\\le n\\le2', note: 'רקומבינציה באזור-המחסור (SRH).' },
      { device: 'MOSFET · תת-סף', lectureId: 'mosfet-nonideal', tab: 'subthreshold', formula: 'S=2.3\\dfrac{mkT}{q}\\approx m\\cdot60\\,\\text{mV/dec}', note: 'הולכת-דיפוזיה מתחת ל-$V_T$ — כמו BJT.' },
    ],
  },
  {
    id: 'barriers',
    title: 'מחסומים משתנים / קיבוע',
    icon: '📌',
    shared: 'גובה-המחסום או מתח-הסף **אינם קבועים** — הם מושפעים משדה (הנמכת-מחסום), ממצבי-שטח (קיבוע-פרמי) או מהטיית-מצע.',
    members: [
      { device: 'שוטקי · הנמכת-מחסום', lectureId: 'schottky-diode', tab: 'bands', formula: '\\Delta\\varphi_B\\propto\\sqrt{E_{max}}', note: 'כוח-דמות מנמיך את $\\varphi_B$ בממתח.' },
      { device: 'שוטקי · קיבוע-פרמי', lectureId: 'schottky-diode', tab: 'surface', formula: '\\varphi_B\\to\\text{const}', note: 'מצבי-שטח נועלים את $E_F$.' },
      { device: 'MOSFET · אפקט-המצע', lectureId: 'mosfet-nonideal', tab: 'body', formula: 'V_T=V_{T0}+\\gamma(\\sqrt{2\\phi_F+V_{SB}}-\\sqrt{2\\phi_F})', note: 'הטיית-מצע מעלה את הסף.' },
    ],
  },
  {
    id: 'dynamics',
    title: 'טפיליים ומהירות-מיתוג',
    icon: '⏱️',
    shared: 'אפקטים ש**מגבילים מתח/מהירות**: התנגדות-טורית שמשטחת את האופיין, מטען-אגור שמעכב מיתוג, ותדר-חיתוך.',
    members: [
      { device: 'דיודה · התנגדות טורית', lectureId: 'non-ideal-diode', tab: 'seriesR', formula: 'V=V_j+IR_s', note: 'מיישר את האקספוננט בזרם גבוה.' },
      { device: 'דיודה · שחזור-אחורי', lectureId: 'non-ideal-diode', tab: 'switching', formula: 't_{rr}', note: 'פינוי מטען-מיעוט אגור בכיבוי.' },
      { device: 'BJT · תדר-חיתוך', lectureId: 'bjt-nonideal', tab: 'ft', formula: 'f_T', note: 'גבול ההגבר עם התדר.' },
    ],
  },
]
