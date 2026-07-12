import type { LectureModule } from '@/core/engine/types'
import LeastSquaresExplainer from './LeastSquaresExplainer'

/**
 * Statistics — Lesson 7: Least Squares. Chapter 7 of the summary. The linear
 * model y=Hθ+n and the LS objective, the normal equations and pseudo-inverse
 * solution θ̂=(HᵀH)⁻¹Hᵀy, performance (unbiased, σ²(HᵀH)⁻¹), ridge regularization
 * and gradient descent, and robust (L1) regression → the median. Definition-first,
 * with proof modals and three sandboxes (residual-squares regression, ridge
 * overfitting, mean-vs-median). Practice = real recitation/homework/exam problems.
 */
export const lsLecture: LectureModule = {
  id: 'least-squares',
  number: 7,
  titleHe: 'ריבועים פחותים',
  subtitleEn: 'Least Squares',
  views: [],
  algorithms: [],
  summary: LeastSquaresExplainer,
  explainer: true,
  glossary: [
    { term: 'מודל לינארי', def: 'תצפיות כפונקציה לינארית של פרמטרים ועוד רעש.', tex: 'y=H\\theta+n' },
    { term: 'ריבועים פחותים', def: 'מזעור סכום ריבועי השאריות; המקרה הגאוסי של ML.', tex: '\\min_\\theta\\|y-H\\theta\\|^2' },
    { term: 'משוואות נורמליות', def: 'תנאי סדר-ראשון; השארית ניצבת לעמודות H.', tex: 'H^\\top H\\theta=H^\\top y' },
    { term: 'פסאודו-הופכי', def: 'אופרטור הפתרון של LS.', tex: '(H^\\top H)^{-1}H^\\top' },
    { term: 'קווריאנס האמד', def: 'אי-הוודאות תחת רעש גאוסי.', tex: '\\mathrm{Cov}(\\hat\\theta)=\\sigma^2(H^\\top H)^{-1}' },
    { term: 'רגולריזציה (Ridge)', def: 'ענישה על הנורמה; הטיה תמורת שונות.', tex: '\\hat\\theta=(H^\\top H+\\lambda I)^{-1}H^\\top y' },
    { term: 'ריבועים חסינים (L1)', def: 'רעש לפלס → מזעור סכום ערכים מוחלטים → חציון.', tex: '\\hat\\theta=\\mathrm{median}(y)' },
  ],
  formulas: [
    { name: 'מודל ומטרה', tex: 'y=H\\theta+n,\\quad \\min_\\theta\\|y-H\\theta\\|^2' },
    { name: 'משוואות נורמליות', tex: 'H^\\top H\\,\\theta=H^\\top y' },
    { name: 'פתרון LS', tex: '\\hat\\theta_{LS}=(H^\\top H)^{-1}H^\\top y,\\ \\ \\hat\\sigma^2=\\|y-H\\hat\\theta\\|^2/N' },
    { name: 'התאמת קו', tex: '\\hat\\theta_1=\\tfrac{\\sum(x_i-\\bar x)(y_i-\\bar y)}{\\sum(x_i-\\bar x)^2},\\ \\hat\\theta_0=\\bar y-\\hat\\theta_1\\bar x', wide: true },
    { name: 'ביצועים', tex: 'E[\\hat\\theta]=\\theta,\\ \\ \\mathrm{Cov}(\\hat\\theta)=\\sigma^2(H^\\top H)^{-1}' },
    { name: 'Ridge', tex: '\\hat\\theta=(H^\\top H+\\lambda I)^{-1}H^\\top y' },
    { name: 'ירידת גרדיאנט', tex: '\\theta_{k+1}=\\theta_k-\\mu\\cdot 2H^\\top(H\\theta_k-y)' },
    { name: 'חסין (L1)', tex: '\\min_\\theta\\sum_i|y_i-\\theta|\\ \\Rightarrow\\ \\hat\\theta=\\mathrm{median}(y)' },
  ],
  symbols: [
    { sym: 'H', he: 'מטריצת התכנון' },
    { sym: '\\theta,\\;\\hat\\theta', he: 'הפרמטרים והאמד' },
    { sym: '(H^\\top H)^{-1}H^\\top', he: 'הפסאודו-הופכי' },
    { sym: '\\lambda', he: 'מקדם הרגולריזציה (ridge)' },
    { sym: '\\mu', he: 'גודל הצעד (ירידת גרדיאנט)' },
    { sym: '\\Sigma', he: 'קווריאנס הרעש (LS מוכלל)' },
  ],
}
