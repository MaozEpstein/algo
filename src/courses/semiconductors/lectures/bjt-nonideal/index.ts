import type { LectureModule } from '@/core/engine/types'
import BjtNonidealExplainer from './BjtNonidealExplainer'

/**
 * Semiconductors — Lecture 3ג: the BJT's non-ideal effects & small-signal models (the
 * capstone of the BJT chapter). The ideal picture of 3ב (flat active region, constant β)
 * breaks in real devices: the EARLY effect (V_CE shrinks the neutral base → I_C rises,
 * giving finite r_o=V_A/I_C), BREAKDOWN (BV_CEO < BV_CBO because the gain multiplies the
 * avalanche), β that ROLLS OFF at low I_C (B-E recombination) and high I_C (high
 * injection) — read off the Gummel plot — and base-width-limiting band-gap narrowing.
 * For circuit use, the small-signal HYBRID-π model (g_m, r_π, r_o) and the cutoff
 * frequency f_T (set by the stored base charge) complete the device.
 */
export const bjtNonidealLecture: LectureModule = {
  id: 'bjt-nonideal',
  number: 3.3,
  numberLabelHe: '3 · חלק ג׳',
  titleHe: 'טרנזיסטור דו-קוטבי (BJT) — אפקטים לא-אידיאליים ומודלים',
  subtitleEn: 'BJT: Non-Ideal Effects & Models',
  views: [],
  algorithms: [],
  summary: BjtNonidealExplainer,
  explainer: true,
  glossary: [
    { term: 'אפקט Early (אפנון רוחב-הבסיס)', def: 'כשמגדילים את המתח האחורי על צומת ה-C-B, אזור-המחסור מתרחב אל תוך הבסיס ומקטין את רוחבו האפקטיבי $W_B$. לכן זרם-הקולט <b>עולה קצת</b> עם $V_{CE}$ (האזור הפעיל אינו שטוח לגמרי), ומכאן התנגדות-מוצא סופית $r_o$.', tex: 'I_C=\\beta I_B\\left(1+\\dfrac{V_{CE}}{V_A}\\right)' },
    { term: 'מתח Early $V_A$ והתנגדות-מוצא $r_o$', def: 'אם ממשיכים את קווי האזור-הפעיל אחורה, כולם נחתכים בציר $V_{CE}$ בנקודה $-V_A$. ההתנגדות הדינמית של המוצא היא $r_o=V_A/I_C$.', tex: 'r_o=\\dfrac{V_A}{I_C},\\quad \\dfrac{1}{V_A}=\\dfrac{1}{W_B}\\dfrac{\\partial W_B}{\\partial V_{BC}}' },
    { term: 'פריצה — $BV_{CBO}$ מול $BV_{CEO}$', def: 'בבסיס משותף הצומת C-B פורץ ב-$BV_{CBO}$. בפולט משותף הטרנזיסטור פורץ ב-מתח <b>נמוך יותר</b>, $BV_{CEO}=BV_{CBO}/\\beta^{1/n}$, כי ההגבר מכפיל את נושאי-המפולת. מקדם המפולת $M=1/(1-(V/BV)^n)$.', tex: 'BV_{CEO}=\\dfrac{BV_{CBO}}{\\beta^{1/n}}' },
    { term: 'β לא-אידיאלי + עקומת Gummel', def: 'ההגבר $\\beta$ שטוח רק בטווח-זרמים בינוני; הוא <b>נופל בזרם נמוך</b> (רקומבינציה במחסור ה-B-E, מקדם $n=2$) וב<b>זרם גבוה</b> (הזרקה-חזקה). בעקומת Gummel ($\\log I_C,\\log I_B$ מול $V_{BE}$) המרווח האנכי בין הישרים הוא $\\log\\beta_F$.' },
    { term: 'צמצום פער-האנרגיה בפולט', def: 'סימום כבד מאוד בפולט מצמצם את פער-האנרגיה ($n_{ie}^2=n_{i0}^2 e^{\\Delta E_g/kT}$), מה שמגדיל את הזרקת-החורים הנגדית ו<b>מגביל</b> את $\\beta$ — ולכן לא מספיק "לסמם עוד".', tex: '\\beta\\propto \\dfrac{N_D}{N_A}\\,e^{\\Delta E_g/kT}' },
    { term: 'מודל אות-קטן hybrid-π', def: 'סביב נקודת-עבודה, הטרנזיסטור מתואר כ-$r_\\pi$ בכניסה ומקור-זרם $g_m v_{be}$ במוצא, עם $r_o$ במקביל. $g_m=I_C/V_T$, $r_\\pi=\\beta/g_m$, $r_o=V_A/I_C$.', tex: 'g_m=\\dfrac{I_C}{V_T},\\; r_\\pi=\\dfrac{\\beta}{g_m},\\; r_o=\\dfrac{V_A}{I_C}' },
    { term: 'תדר-חיתוך $f_T$', def: 'התדר שבו הגבר-הזרם יורד ל-1. מעל $f_\\beta=f_T/\\beta_0$, $|\\beta(f)|$ נופל ב-$-20\\,$dB/decade. $f_T=g_m/2\\pi(C_\\pi+C_\\mu)$, ונקבע ע"י המטען האגור בבסיס (זמן-המעבר).', tex: 'f_T=\\dfrac{g_m}{2\\pi(C_\\pi+C_\\mu)}' },
  ],
  formulas: [
    { name: 'אפקט Early', tex: 'I_C=\\beta I_B\\!\\left(1+\\tfrac{V_{CE}}{V_A}\\right),\\quad r_o=\\dfrac{V_A}{I_C}' },
    { name: 'פריצה', tex: 'BV_{CEO}=\\dfrac{BV_{CBO}}{\\beta^{1/n}},\\quad M=\\dfrac{1}{1-(V/BV)^n}' },
    { name: 'מודל hybrid-π', tex: 'g_m=\\dfrac{I_C}{V_T},\\quad r_\\pi=\\dfrac{\\beta}{g_m},\\quad r_o=\\dfrac{V_A}{I_C}' },
    { name: 'תדר-חיתוך', tex: 'f_T=\\dfrac{g_m}{2\\pi(C_\\pi+C_\\mu)}=\\beta_0\\,f_\\beta' },
  ],
  symbols: [
    { sym: 'V_A', he: 'מתח Early', unit: 'V' },
    { sym: 'r_o', he: 'התנגדות-מוצא ($V_A/I_C$)', unit: '\\Omega' },
    { sym: 'BV_{CBO}', he: 'מתח פריצה בבסיס משותף', unit: 'V' },
    { sym: 'BV_{CEO}', he: 'מתח פריצה בפולט משותף', unit: 'V' },
    { sym: 'M', he: 'מקדם המפולת', unit: '—' },
    { sym: 'g_m', he: 'מוליכות-המעבר ($I_C/V_T$)', unit: 'A/V' },
    { sym: 'r_\\pi', he: 'התנגדות-כניסה אות-קטן ($\\beta/g_m$)', unit: '\\Omega' },
    { sym: 'f_T', he: 'תדר-חיתוך (הגבר-זרם = 1)', unit: 'Hz' },
    { sym: 'f_\\beta', he: 'תדר נפילת β ($f_T/\\beta_0$)', unit: 'Hz' },
    { sym: 'C_\\pi,C_\\mu', he: 'קיבולי בסיס-פולט / בסיס-קולט', unit: 'F' },
    { sym: '\\Delta E_g', he: 'צמצום פער-האנרגיה בפולט', unit: 'eV' },
  ],
}
