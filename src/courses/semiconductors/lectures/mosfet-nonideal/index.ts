import type { LectureModule } from '@/core/engine/types'
import MosfetNonidealExplainer from './MosfetNonidealExplainer'

/**
 * Semiconductors — Lesson 7 · part ב׳: the modern (non-ideal) MOSFET. Real, scaled devices deviate
 * from the ideal long-channel laws — exactly Neamen §11.1 "Nonideal Effects": (1) channel-length
 * modulation tilts the saturation plateau, I_D=(k/2)(V_GS−V_T)²(1+λV_DS) with r_o≈1/(λI_D);
 * (2) the body effect raises V_T with source-body bias, V_T=V_T0+γ(√(2φ_F+V_SB)−√(2φ_F));
 * (3) subthreshold conduction is diffusion-limited and exponential, with swing S≈m·60 mV/dec;
 * (4) surface scattering degrades mobility, μ_eff=μ0/(1+θ(V_GS−V_T)); (5) velocity saturation
 * makes I_DS,sat linear in the overdrive (v_sat≈10⁷ cm/s). Capped by CMOS technology (n-well
 * cross-section + the complementary inverter). Grounded in the class "last lesson" summary + Neamen.
 */
export const mosfetNonidealLecture: LectureModule = {
  id: 'mosfet-nonideal',
  number: 7.2,
  numberLabelHe: '7 · חלק ב׳',
  lessonHe: 'טרנזיסטור MOS (MOSFET)',
  titleHe: 'טרנזיסטור MOS — ההתקן המודרני (אפקטים לא-אידיאליים)',
  subtitleEn: 'MOSFET: The Modern Device (Non-Ideal Effects) & CMOS',
  views: [],
  algorithms: [],
  summary: MosfetNonidealExplainer,
  explainer: true,
  glossary: [
    { term: 'התקצרות תעלה (CLM)', def: 'ברוויה אזור-המחסור בניקוז מתרחב אל הערוץ ומקצר אותו; הזרם עולה מעט עם $V_{DS}$. מיוצג ע״י $\\lambda$.', tex: 'I_D=\\tfrac{k}{2}(V_{GS}-V_T)^2(1+\\lambda V_{DS})' },
    { term: 'התנגדות-מוצא $r_o$', def: 'עקב התקצרות-התעלה מוליכות-המוצא אינה אפס: $r_o\\approx1/(\\lambda I_D)$ (במקום $\\infty$ האידיאלי).', tex: 'r_o\\approx\\dfrac{1}{\\lambda I_D}' },
    { term: 'אפקט המצע (Body)', def: 'הטיית מקור-מצע $V_{SB}$ מרחיבה את מטען-המחסור ומעלה את מתח-הסף.', tex: 'V_T=V_{T0}+\\gamma\\!\\left(\\sqrt{2\\phi_F+V_{SB}}-\\sqrt{2\\phi_F}\\right)' },
    { term: 'מקדם-המצע $\\gamma$', def: 'קובע את חוזק אפקט-המצע: $\\gamma=\\sqrt{2q\\varepsilon_sN_A}/C_{ox}$.', tex: '\\gamma=\\dfrac{\\sqrt{2q\\varepsilon_sN_A}}{C_{ox}}' },
    { term: 'זרם תת-סף', def: 'מתחת ל-$V_T$ הזרם דועך אקספוננציאלית — הולכת דיפוזיה מעל מחסום (כמו BJT), לא אפס.' },
    { term: 'נדנוד תת-סף $S$', def: 'מתח-השער לשינוי הזרם בעשור: $S=2.3\\,mkT/q\\approx m\\cdot60$ mV/dec. הגבול האידיאלי ~60 mV/dec.', tex: 'S=\\left[\\tfrac{d(\\log I_D)}{dV_{GS}}\\right]^{-1}' },
    { term: 'הדרדרות ניידות', def: 'השדה האנכי דוחף נושאים אל האוקסיד → פיזור-שטח → $\\mu$ יורדת: $\\mu_{eff}=\\mu_0/(1+\\theta(V_{GS}-V_T))$.', tex: '\\mu_{eff}=\\dfrac{\\mu_0}{1+\\theta(V_{GS}-V_T)}' },
    { term: 'רוויית מהירות', def: 'בשדה גבוה $v_{drift}\\to v_{sat}\\approx10^7$ cm/s, ולכן $I_{DS,sat}$ הופך לינארי ב-$(V_{GS}-V_T)$.', tex: 'I_{DS,sat}\\propto W C_{ox}(V_{GS}-V_T)v_{sat}' },
    { term: 'CMOS', def: 'שילוב NMOS+PMOS משלימים (PMOS בבאר-$n$). במצב יציב רק אחד מוליך → הספק-סטטי אפסי — יסוד האלקטרוניקה הספרתית.' },
  ],
  formulas: [
    { name: 'התקצרות תעלה', tex: 'I_{DS}=\\dfrac{k}{2}(V_{GS}-V_T)^2(1+\\lambda V_{DS})', wide: true },
    { name: 'התנגדות-מוצא', tex: 'r_o\\approx\\dfrac{1}{\\lambda I_D}' },
    { name: 'אפקט המצע', tex: 'V_T=V_{T0}+\\gamma\\!\\left(\\sqrt{2\\phi_F+V_{SB}}-\\sqrt{2\\phi_F}\\right)', wide: true },
    { name: 'מקדם-המצע', tex: '\\gamma=\\dfrac{\\sqrt{2q\\varepsilon_sN_A}}{C_{ox}}' },
    { name: 'נדנוד תת-סף', tex: 'S=2.3\\,\\dfrac{mkT}{q}\\approx m\\cdot60\\ \\text{mV/dec}' },
    { name: 'הדרדרות ניידות', tex: '\\mu_{eff}=\\dfrac{\\mu_0}{1+\\theta(V_{GS}-V_T)}' },
    { name: 'רוויית מהירות', tex: 'I_{DS,sat}=W C_{ox}(V_{GS}-V_T)v_{sat}', note: 'מוסכמת הסיכום: עם מקדם $\\tfrac{1}{2}$.' },
  ],
  symbols: [
    { sym: '\\lambda', he: 'מקדם התקצרות-התעלה', unit: 'V^{-1}' },
    { sym: 'r_o', he: 'התנגדות-המוצא (אות-קטן)', unit: '\\Omega' },
    { sym: 'V_{SB}', he: 'מתח מקור-מצע (הטיה אחורית)', unit: 'V' },
    { sym: '\\gamma', he: 'מקדם-המצע (body factor)', unit: '\\sqrt{V}' },
    { sym: 'S', he: 'נדנוד תת-סף', unit: 'V/dec' },
    { sym: 'm', he: 'מקדם-אידאליות ($1+C_{dep}/C_{ox}$)', unit: '—' },
    { sym: '\\theta', he: 'מקדם הדרדרות-הניידות', unit: 'V^{-1}' },
    { sym: 'v_{sat}', he: 'מהירות-הרוויה ($\\approx10^7$)', unit: 'cm/s' },
  ],
}
