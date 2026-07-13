import type { LectureModule } from '@/core/engine/types'
import BayesExplainer from './BayesExplainer'

/**
 * Statistics — Lesson 8: Bayesian statistics. Chapter 8 of the summary. The
 * parameter is now random with a prior; Bayes gives the posterior, and the cost
 * function picks the estimator: squared → posterior mean (MMSE), 0-1 → mode
 * (MAP), absolute → median. Includes the orthogonality principle, the conjugate-
 * Gaussian weighted average, and the soft/hard decision of a Gaussian channel.
 * Definition-first, with proof modals and two sandboxes (posterior explorer,
 * soft-vs-hard decision). Practice = real recitation/exam problems.
 */
export const bayesLecture: LectureModule = {
  id: 'bayesian-statistics',
  number: 8,
  titleHe: 'סטטיסטיקה בייסיאנית',
  subtitleEn: 'Bayesian Statistics',
  views: [],
  algorithms: [],
  summary: BayesExplainer,
  explainer: true,
  glossary: [
    { term: 'התפלגות מוקדמת (Prior)', def: 'האמונה על הפרמטר לפני שראינו נתונים.', tex: 'f(\\theta)' },
    { term: 'התפלגות בתר (Posterior)', def: 'האמונה על הפרמטר אחרי הנתונים, דרך בייס.', tex: 'f(\\theta\\mid y)=\\tfrac{f(y\\mid\\theta)f(\\theta)}{f(y)}' },
    { term: 'סיכון בייסיאני', def: 'העלות הצפויה של האמד; אותה ממזערים.', tex: '\\min E[c(\\hat\\theta-\\theta)]' },
    { term: 'MMSE', def: 'אמד עלות ריבועית — ממוצע ה-posterior.', tex: '\\hat\\theta_{MMSE}=E[\\theta\\mid y]' },
    { term: 'עקרון האורתוגונליות', def: 'שגיאת ה-MMSE ניצבת לכל פונקציה של המדידה.', tex: 'E[g(Y)(\\hat\\theta-\\theta)]=0' },
    { term: 'MAP', def: 'אמד עלות 0-1 — שיא ה-posterior (=ML×prior).', tex: '\\hat\\theta_{MAP}=\\arg\\max_\\theta f(\\theta\\mid y)' },
    { term: 'אמד חציון', def: 'אמד עלות ערך-מוחלט — חציון ה-posterior.', tex: 'F_{\\theta\\mid Y}(\\hat\\theta\\mid y)=\\tfrac12' },
  ],
  formulas: [
    { name: 'בייס', tex: 'f(\\theta\\mid y)=\\tfrac{f(y\\mid\\theta)f(\\theta)}{f(y)}' },
    { name: 'סיכון בייסיאני', tex: '\\hat\\theta\\Leftarrow\\min_{\\hat\\theta(\\cdot)}E[c(\\hat\\theta-\\theta)]' },
    { name: 'MMSE', tex: '\\hat\\theta_{MMSE}=E[\\theta\\mid Y=y],\\ \\ \\mathrm{MSE}=E[\\mathrm{Var}(\\theta\\mid Y)]' },
    { name: 'אורתוגונליות', tex: 'E[g(Y)(\\hat\\theta-\\theta)]=0\\quad\\forall g' },
    { name: 'MAP (עלות 0-1)', tex: '\\hat\\theta_{MAP}=\\arg\\max_\\theta f(y\\mid\\theta)f(\\theta)' },
    { name: 'חציון (עלות |·|)', tex: 'F_{\\theta\\mid Y}(\\hat\\theta\\mid y)=\\tfrac12' },
    { name: 'MMSE גאוסי (ממוצע משוקלל)', tex: '\\hat Y=\\tfrac{\\sigma_y^2}{\\sigma_y^2+\\sigma_w^2}X+\\tfrac{\\sigma_w^2}{\\sigma_y^2+\\sigma_w^2}\\mu_y', wide: true },
  ],
  symbols: [
    { sym: 'f(\\theta)', he: 'התפלגות מוקדמת (prior)' },
    { sym: 'f(\\theta\\mid y)', he: 'התפלגות בתר (posterior)' },
    { sym: 'c(e)', he: 'פונקציית עלות' },
    { sym: '\\hat\\theta_{MMSE}', he: 'אמד תוחלת מותנית' },
    { sym: '\\hat\\theta_{MAP}', he: 'אמד שיא ה-posterior' },
  ],
}
