import type { LectureModule } from '@/core/engine/types'
import RandomProcessExplainer from './RandomProcessExplainer'

/**
 * Statistics — Lesson 10: Random processes. Chapter 10 of the summary and the
 * first lesson of Part C. A random process x(t,ζ):ℝ×Ω→ℝ adds a time index to a
 * random variable: fix ζ → a deterministic realization, fix t → a random
 * variable. Covers i.i.d. processes (Bernoulli, counting/Binomial, XOR), the
 * finite-dimensional distributions, the Gaussian process, and strict-sense (SSS)
 * + asymptotic stationarity. Definition-first, with proof modals and two
 * sandboxes (ensemble/realization explorer, marginal-drift SSS vs asymptotic).
 * Practice = real recitation/homework/exam problems.
 */
export const randomProcessLecture: LectureModule = {
  id: 'random-processes',
  number: 10,
  titleHe: 'תהליכים מקריים',
  subtitleEn: 'Random Processes',
  views: [],
  algorithms: [],
  summary: RandomProcessExplainer,
  explainer: true,
  glossary: [
    { term: 'תהליך מקרי', def: 'פונקציה של הזמן והמאורע — משתנה מקרי לכל זמן.', tex: 'x(t,\\zeta):\\mathbb{R}\\times\\Omega\\to\\mathbb{R}' },
    { term: 'מימוש (realization)', def: 'קיבוע ζ נותן פונקציה דטרמיניסטית של הזמן.', tex: 'x(t,\\zeta_0)' },
    { term: 'אנסמבל', def: 'קיבוע הזמן t נותן משתנה מקרי.', tex: 'X(t_0)' },
    { term: 'תהליך i.i.d', def: 'שוליים זהים + אי-תלות הדדית של הדגימות.', tex: 'P(X_1,\\dots,X_k)=\\textstyle\\prod_i P(X_i)' },
    { term: 'תהליך גאוסי', def: 'כל וקטור סופי של דגימות הוא גאוסי.', tex: '[x(t_1),\\dots,x(t_k)]\\ \\text{Gaussian}' },
    { term: 'סטציונריות צרה (SSS)', def: 'ההתפלגות המשותפת לא תלויה בהזזת זמן.', tex: 'F_{x(t_1+\\tau),\\dots}=F_{x(t_1),\\dots}' },
    { term: 'סטציונריות אסימפטוטית', def: 'ההתפלגות המוזזת מתכנסת כאשר T→∞.', tex: '\\lim_{T\\to\\infty}F_{x(t_i+T)}=F_k' },
  ],
  formulas: [
    { name: 'תהליך מקרי', tex: 'x(t,\\zeta):\\mathbb{R}\\times\\Omega\\to\\mathbb{R}' },
    { name: 'פונקציית התוחלת', tex: 'm_X(t)=E[X(t)]' },
    { name: 'תהליך i.i.d (משותף)', tex: 'P(X_{i_1},\\dots,X_{i_k})=\\textstyle\\prod_{j} P(X_{i_j})' },
    { name: 'תהליך מונה (Ex 33)', tex: 'X_n\\sim\\mathrm{Bin}(n,p),\\ E[X_n]=np,\\ \\mathrm{Var}=np(1-p)' },
    { name: 'תהליך XOR (Ex 34)', tex: 'P(X_n{=}1)=\\tfrac12\\big[1-(1-2p)^n\\big]' },
    { name: 'התפלגויות סוף-ממדיות', tex: 'F(t_1,\\dots,t_N;x)=P\\big(X(t_1)\\le x_1,\\dots,X(t_N)\\le x_N\\big)', wide: true },
    { name: 'סטציונריות צרה (SSS)', tex: 'F_{x(t_1),\\dots,x(t_k)}=F_{x(t_1+\\tau),\\dots,x(t_k+\\tau)}\\ \\ \\forall\\tau', wide: true },
  ],
  symbols: [
    { sym: 'x(t,\\zeta)', he: 'תהליך מקרי' },
    { sym: '\\zeta', he: 'מאורע במרחב המדגם' },
    { sym: 'm_X(t)', he: 'פונקציית התוחלת' },
    { sym: 'F_{t_1,\\dots,t_k}', he: 'התפלגות סוף-ממדית' },
    { sym: '\\tau', he: 'הזזת זמן' },
  ],
}
