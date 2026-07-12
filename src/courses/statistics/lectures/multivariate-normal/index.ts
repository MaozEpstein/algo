import type { LectureModule } from '@/core/engine/types'
import MvnExplainer from './MvnExplainer'

/**
 * Statistics — Lesson 4: Multivariate normal. Chapter 4 of the summary — "the
 * most important distribution". The MVN via linear combinations (aᵀx Gaussian),
 * the density and characteristic function, affine transforms, whitening/
 * colorization, uncorrelated⇔independent, the conditional Gaussian, and the
 * Y=SX counterexample. Definition-first, with proof modals and one rich
 * bivariate-Gaussian sandbox. Practice = real recitation/exam problems.
 */
export const mvnLecture: LectureModule = {
  id: 'multivariate-normal',
  number: 4,
  titleHe: 'נורמלי רב-ממדי',
  subtitleEn: 'Multivariate Normal',
  views: [],
  algorithms: [],
  summary: MvnExplainer,
  explainer: true,
  glossary: [
    { term: 'נורמלי רב-ממדי (MVN)', def: 'וקטור שכל צירוף לינארי של רכיביו הוא גאוסי.', tex: 'a^\\top x\\ \\text{גאוסי } \\forall a' },
    { term: 'צפיפות MVN', def: 'נקבעת מווקטור התוחלות ומטריצת הקווריאנס.', tex: 'f_x=\\tfrac{1}{\\sqrt{|2\\pi C|}}e^{-\\frac12(x-m)^\\top C^{-1}(x-m)}' },
    { term: 'פונקציה אופיינית', def: 'שוב "גאוסי במעריך".', tex: '\\varphi_x(w)=e^{\\,jw^\\top m-\\frac12 w^\\top C w}' },
    { term: 'טרנספורם אפיני', def: 'לינארי של גאוסי הוא גאוסי.', tex: 'y=Ax+b\\sim N(Am+b,\\,ACA^\\top)' },
    { term: 'הלבנה/צביעה', def: 'ייצור גאוסי מסטנדרטי והחזרה אליו.', tex: 'x=Az+b,\\ AA^\\top=C' },
    { term: 'אי-מתאם ⇔ אי-תלות', def: 'תכונה ייחודית לגאוסי: C אלכסונית ⇔ בלתי-תלויים.', tex: 'C\\ \\text{diagonal}\\iff \\perp' },
    { term: 'התניה גאוסית', def: 'ההתניה שוב גאוסית — תוחלת לינארית ב-y.', tex: 'E[x\\mid y]=m_x+C_{xy}C_{yy}^{-1}(y-m_y)' },
  ],
  formulas: [
    { name: 'הגדרה', tex: 'x\\ \\text{MVN}\\iff a^\\top x\\ \\text{גאוסי } \\forall a' },
    { name: 'צפיפות', tex: 'f_x(x)=\\tfrac{1}{\\sqrt{|2\\pi C|}}e^{-\\frac12(x-m)^\\top C^{-1}(x-m)}' },
    { name: 'פונקציה אופיינית', tex: '\\varphi_x(w)=e^{\\,jw^\\top m-\\frac12 w^\\top C w}' },
    { name: 'טרנספורם אפיני', tex: 'y=Ax+b\\sim N(Am+b,\\,ACA^\\top)' },
    { name: 'הלבנה', tex: 'z=C^{-1/2}(x-m)\\sim N(0,I)' },
    { name: 'אי-מתאם ⇔ אי-תלות', tex: 'C\\ \\text{אלכסונית}\\iff x_i\\ \\text{בלתי-תלויים}' },
    { name: 'תוחלת מותנית', tex: 'E[x\\mid y]=m_x+C_{xy}C_{yy}^{-1}(y-m_y)', wide: true },
    { name: 'שונות מותנית', tex: 'C_{x\\mid y}=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}', wide: true },
    { name: 'ריכוז על הספירה', tex: 'x\\sim N(0,I_d)\\Rightarrow \\|x\\|^2\\sim\\chi^2_d' },
  ],
  symbols: [
    { sym: 'm', he: 'וקטור התוחלות' },
    { sym: 'C', he: 'מטריצת הקווריאנס' },
    { sym: 'C^{-1/2}', he: 'שורש הופכי (מטריצת הלבנה)' },
    { sym: 'A', he: 'מטריצת הטרנספורם/צביעה ($AA^\\top=C$)' },
    { sym: '\\rho', he: 'מקדם מתאם (מקרה דו-ממדי)' },
    { sym: 'U,\\;D', he: 'פירוק עצמי $C=UDU^\\top$' },
  ],
}
