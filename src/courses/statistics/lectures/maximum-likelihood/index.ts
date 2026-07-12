import type { LectureModule } from '@/core/engine/types'
import MleExplainer from './MleExplainer'

/**
 * Statistics — Lesson 6: Maximum Likelihood. Chapter 6 of the summary. Parameter
 * estimation and how to judge an estimator (bias, variance, MSE, the bias-variance
 * decomposition, consistency), then the maximum-likelihood recipe (argmax of the
 * log-likelihood), its worked examples (Bernoulli/Gaussian/exponential/uniform),
 * and its asymptotic consistency (via KL + LLN). Definition-first, with proof
 * modals and two sandboxes (a likelihood curve peaking at θ̂, and a bias-variance
 * sampling distribution). Practice = real recitation/homework/exam problems.
 */
export const mleLecture: LectureModule = {
  id: 'maximum-likelihood',
  number: 6,
  titleHe: 'נראות מרבית',
  subtitleEn: 'Maximum Likelihood',
  views: [],
  algorithms: [],
  summary: MleExplainer,
  explainer: true,
  glossary: [
    { term: 'אמד', def: 'פונקציה של הנתונים המשערכת פרמטר לא-ידוע.', tex: '\\hat\\theta(Y)' },
    { term: 'הטיה', def: 'הפרש התוחלת של האמד מהערך האמיתי.', tex: '\\mathrm{bias}=E[\\hat\\theta]-\\theta' },
    { term: 'שגיאה ריבועית ממוצעת (MSE)', def: 'תוחלת השגיאה בריבוע; מתפרקת להטיה²+שונות.', tex: '\\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{var}' },
    { term: 'אמד לא-מוטה', def: 'הטיה אפס לכל θ.', tex: '\\mathrm{bias}=0' },
    { term: 'עקביות', def: 'התכנסות האמד לערך האמיתי כש-N גדל.', tex: '\\hat\\theta_N\\to\\theta' },
    { term: 'נראות מרבית (MLE)', def: 'הפרמטר שממקסם את הנראות של הנתונים.', tex: '\\hat\\theta_{ML}=\\arg\\max_\\theta\\log f(y;\\theta)' },
    { term: 'משוואת הנראות', def: 'תנאי סדר-ראשון לאמד.', tex: '\\partial_\\theta\\log f=0' },
    { term: 'דיברגנס KL', def: 'מדד מרחק אי-שלילי בין התפלגויות; הבסיס לעקביות.', tex: 'D_{KL}\\ge 0' },
  ],
  formulas: [
    { name: 'שגיאה', tex: 'E=\\hat\\theta(Y)-\\theta' },
    { name: 'הטיה ושונות', tex: '\\mathrm{bias}=E[\\hat\\theta]-\\theta,\\quad \\mathrm{var}=E[(E-E[E])^2]' },
    { name: 'פירוק MSE', tex: '\\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{var}' },
    { name: 'אמד נראות מרבית', tex: '\\hat\\theta_{ML}=\\arg\\max_\\theta\\sum_i\\log f(y_i;\\theta)' },
    { name: 'MLE ברנולי', tex: '\\hat\\theta=\\tfrac1N\\sum y_i,\\ \\ \\mathrm{Var}=\\tfrac{\\theta(1-\\theta)}{N}' },
    { name: 'MLE גאוסי', tex: '\\hat\\mu=\\tfrac1N\\sum y_i,\\ \\ \\hat\\sigma^2=\\tfrac1N\\sum(y_i-\\hat\\mu)^2,\\ E[\\hat\\sigma^2]=\\tfrac{N-1}{N}\\sigma^2', wide: true },
    { name: 'MLE מעריכי/אחיד', tex: '\\hat\\theta_{\\exp}=\\overline y,\\quad \\hat\\theta_{U(0,\\theta)}=\\max_i y_i' },
    { name: 'עקביות (KL)', tex: 'D_{KL}(f_1,f_2)=E_{f_1}[\\log\\tfrac{f_1}{f_2}]\\ge 0' },
  ],
  symbols: [
    { sym: '\\theta,\\;\\hat\\theta', he: 'הפרמטר והאמד שלו' },
    { sym: 'L(y;\\theta)', he: 'פונקציית הנראות' },
    { sym: '\\ell(\\theta)', he: 'log-נראות' },
    { sym: '\\mathrm{bias},\\;\\mathrm{var}', he: 'הטיה ושונות' },
    { sym: '\\mathrm{MSE}', he: 'שגיאה ריבועית ממוצעת' },
    { sym: 'D_{KL}', he: 'דיברגנס קולבק-ליבלר' },
  ],
}
