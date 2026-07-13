import type { LectureModule } from '@/core/engine/types'
import LinBayesExplainer from './LinBayesExplainer'

/**
 * Statistics — Lesson 9: Linear Bayesian estimation (LMMSE / BLE). Chapter 9 of
 * the summary and the last lesson of Part B. Lesson 8's MMSE needs the full
 * posterior; here we restrict to affine estimators x̂=Ay+b — needing only first-
 * and second-order moments — and get the closed form x̂=μ_x+C_xy C_yy⁻¹(y−μ_y)
 * from the normal equation, with the orthogonality principle. The punchline
 * (Thm 9.2): for jointly Gaussian x,y the LMMSE equals the full MMSE. Includes
 * the two-sensor fusion (Ex 31), the cubic Y=X³ where LMMSE≠MMSE, and two
 * sandboxes. Practice = real recitation/homework/exam problems.
 */
export const linBayesLecture: LectureModule = {
  id: 'linear-bayesian-estimation',
  number: 9,
  titleHe: 'אמידה בייסיאנית לינארית',
  subtitleEn: 'Linear Bayesian Estimation',
  views: [],
  algorithms: [],
  summary: LinBayesExplainer,
  explainer: true,
  glossary: [
    { term: 'אמד LMMSE / BLE', def: 'האמד הלינארי (אפיני) הטוב ביותר של x מ-y.', tex: '\\hat x(y)=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y)' },
    { term: 'משוואה נורמלית', def: 'תנאי האופטימליות של האמד הלינארי.', tex: 'E[yy^\\top]a=E[yX]' },
    { term: 'עקרון האורתוגונליות', def: 'השגיאה ניצבת לכל פונקציה לינארית של המדידה.', tex: 'E[y(a^\\top y-X)]=0' },
    { term: 'שונות השגיאה', def: 'ה-MSE של האמד הלינארי (מטריצת קווריאנס השגיאה).', tex: 'C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}' },
    { term: 'גאוסי ⇒ MMSE=LMMSE', def: 'למשתנים גאוסיים משותפים ה-MMSE האופטימלי לינארי.', tex: 'x,y\\ \\text{Gaussian}\\Rightarrow \\hat x_{MMSE}=\\hat x_{LMMSE}' },
  ],
  formulas: [
    { name: 'אמד LMMSE (אפיני)', tex: '\\hat x(y)=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y)', wide: true },
    { name: 'משוואה נורמלית', tex: 'E[yy^\\top]\\,a=E[yX]' },
    { name: 'אורתוגונליות', tex: 'E\\big[y\\,(a^\\top y-X)\\big]=0' },
    { name: 'שונות השגיאה', tex: '\\mathrm{MSE}=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}' },
    { name: 'סקלרי', tex: '\\hat x=\\mu_x+\\tfrac{\\sigma_{xy}}{\\sigma_y^2}(y-\\mu_y),\\ \\ \\mathrm{mse}=\\sigma_x^2-\\tfrac{\\sigma_{xy}^2}{\\sigma_y^2}' },
    { name: 'גאוסי ⇒ MMSE=LMMSE', tex: 'x,y\\ \\text{jointly Gaussian}\\Rightarrow \\hat x_{MMSE}=\\hat x_{LMMSE}' },
  ],
  symbols: [
    { sym: 'C_{xy}', he: 'קווריאנס בין x ל-y' },
    { sym: 'C_{yy}', he: 'מטריצת קווריאנס של המדידה' },
    { sym: 'a,\\,A', he: 'מקדמי האמד הלינארי' },
    { sym: '\\hat x_{LMMSE}', he: 'אמד לינארי (BLE)' },
    { sym: '\\rho', he: 'מקדם המתאם' },
  ],
}
