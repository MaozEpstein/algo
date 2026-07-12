import type { LectureModule } from '@/core/engine/types'
import HypothesisExplainer from './HypothesisExplainer'

/**
 * Statistics — Lesson 5: Simple hypothesis testing. Chapter 5 of the summary,
 * opening Part B (detection & estimation). Deciding between two hypotheses:
 * the likelihood-ratio test, the Neyman-Pearson theorem, the ROC, the Gaussian
 * detector, the matched filter and energy detector, and Bayesian (MAP) testing.
 * Definition-first, with proof modals and one canonical detection sandbox
 * (densities + threshold + ROC). Practice = real recitation/homework/exam problems.
 */
export const hypothesisLecture: LectureModule = {
  id: 'hypothesis-testing',
  number: 5,
  titleHe: 'בדיקת השערות',
  subtitleEn: 'Simple Hypothesis Testing',
  views: [],
  algorithms: [],
  summary: HypothesisExplainer,
  explainer: true,
  glossary: [
    { term: 'נראות (Likelihood)', def: 'הצפיפות כפונקציה של השערה דטרמיניסטית.', tex: 'f(x;H_i)' },
    { term: 'אזעקת שווא / החמצה', def: 'שתי טעויות: לבחור H₁ כשנכון H₀ (Type I), ולהפך (Type II).', tex: 'P_{FA}=\\alpha,\\ \\beta' },
    { term: 'עוצמה / גילוי', def: 'ההסתברות לבחור H₁ כשהוא נכון.', tex: 'P_D=1-\\beta' },
    { term: 'מבחן יחס הנראות (LRT)', def: 'המבנה האופטימלי של כל מבחן.', tex: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\gtrless\\eta' },
    { term: 'ניימן-פירסון', def: 'ה-LRT ממקסם P_D בכפוף ל-P_FA≤α.', tex: '\\max P_D\\ \\text{s.t.}\\ P_{FA}\\le\\alpha' },
    { term: 'פונקציית Q', def: 'הזנב הימני של הנורמלי הסטנדרטי.', tex: 'Q(a)=\\Pr(Z>a)' },
    { term: 'ROC', def: 'עקומת גילוי מול אזעקת-שווא; האלכסון = ניחוש.', tex: 'P_D\\ \\text{vs}\\ P_{FA}' },
    { term: 'מסנן מותאם', def: 'גלאי לינארי לאות ידוע.', tex: 'T=x^\\top\\Sigma^{-1}s' },
    { term: 'גלאי אנרגיה', def: 'גלאי ריבועי לאות אקראי.', tex: 'T=\\|x\\|^2' },
    { term: 'כלל MAP', def: 'מבחן בייסיאני עם סף = יחס מוקדמות.', tex: 'T(x)\\gtrless\\tfrac{P(H_0)}{P(H_1)}' },
  ],
  formulas: [
    { name: 'מבחן יחס הנראות', tex: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\ \\gtrless_{H_0}^{H_1}\\ \\eta' },
    { name: 'ניימן-פירסון', tex: '\\max_R P_D\\ \\text{s.t.}\\ P_{FA}\\le\\alpha' },
    { name: 'פונקציית Q', tex: 'Q(a)=\\int_a^\\infty \\tfrac{1}{\\sqrt{2\\pi}}e^{-t^2/2}dt,\\quad Q(-a)=1-Q(a)' },
    { name: 'גילוי גאוסי', tex: 'P_D=Q\\big(Q^{-1}(P_{FA})-\\sqrt{n\\mu^2/\\sigma^2}\\big)' },
    { name: 'מסנן מותאם', tex: 'T=x^\\top\\Sigma^{-1}s,\\ \\ P_D=Q(Q^{-1}(P_{FA})-d),\\ d^2=s^\\top\\Sigma^{-1}s' },
    { name: 'גלאי אנרגיה', tex: 'T=\\|x\\|^2,\\ \\ T;H_0\\sim\\sigma^2\\chi^2_d' },
    { name: 'הסתברות שגיאה (בייסיאני)', tex: 'P(\\text{err})=P(R_0|H_1)P(H_1)+P(R_1|H_0)P(H_0)' },
    { name: 'כלל MAP', tex: 'T(x)\\ \\gtrless\\ \\tfrac{P(H_0)}{P(H_1)}' },
  ],
  symbols: [
    { sym: 'H_0,\\;H_1', he: 'השערת האפס וההשערה החלופית' },
    { sym: 'T(x)', he: 'יחס הנראות / סטטיסטיקת המבחן' },
    { sym: '\\eta', he: 'סף ההכרעה' },
    { sym: 'P_{FA},\\;P_D', he: 'אזעקת שווא וגילוי' },
    { sym: 'Q(\\cdot)', he: 'פונקציית Q (זנב נורמלי)' },
    { sym: 'd', he: 'מקדם ההסטה / SNR' },
  ],
}
