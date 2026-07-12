import type { LectureModule } from '@/core/engine/types'
import RandomVariablesExplainer from './RandomVariablesExplainer'

/**
 * Statistics — Lesson 1: Random variables. Chapter 1 of the lecturer's summary.
 * The first bricks of the course's "language": the probability triple, a random
 * variable, its CDF and PDF/PMF, the standard distributions, and then the joint
 * world — marginal, conditional, Bayes, independence and the convolution of a
 * sum. Definitions-first, with the depth tucked behind proof buttons and two
 * sandboxes (CDF↔PDF, and a joint-density viewer). Practice = the real course
 * recitation/homework/exam problems.
 */
export const randomVariablesLecture: LectureModule = {
  id: 'random-variables',
  number: 1,
  titleHe: 'משתנים מקריים',
  subtitleEn: 'Random Variables',
  views: [],
  algorithms: [],
  summary: RandomVariablesExplainer,
  explainer: true,
  glossary: [
    { term: 'מרחב הסתברות', def: 'שלישייה המתארת מודל הסתברותי: מרחב המדגם, מרחב המאורעות, ופונקציית ההסתברות.', tex: '(\\Omega,\\mathcal{F},\\Pr)' },
    { term: 'משתנה מקרי', def: 'פונקציה שמצמידה מספר ממשי לכל תוצאה במרחב המדגם.', tex: 'X:\\Omega\\to\\mathbb{R}' },
    { term: 'פונקציית התפלגות מצטברת (CDF)', def: 'ההסתברות ש-$X$ אינו עולה על $x$; עולה חלש, מ-0 ל-1.', tex: 'F_X(x)=\\Pr(X\\le x)' },
    { term: 'פונקציית צפיפות (PDF)', def: 'נגזרת ה-CDF של משתנה רציף; אי-שלילית, השטח מתחתיה 1.', tex: 'f_X(x)=\\tfrac{dF_X}{dx}' },
    { term: 'פונקציית מסה (PMF)', def: 'הסתברות נקודתית של משתנה בדיד.', tex: 'P_X(x)=\\Pr(X=x)' },
    { term: 'התפלגות משותפת', def: 'ההסתברות של שני משתנים בו-זמנית.', tex: 'F_{XY}(x,y)=\\Pr(X\\le x,Y\\le y)' },
    { term: 'התפלגות שולית (Marginal)', def: 'התפלגות של משתנה אחד, המתקבלת מאינטגרציה על השני.', tex: 'f_X(x)=\\int f_{XY}(x,y)\\,dy' },
    { term: 'התפלגות מותנית', def: 'התפלגות $X$ בהינתן ש-$Y=y$; המשותף חלקי השולי של $Y$.', tex: 'f_{X\\mid Y}=f_{XY}/f_Y' },
    { term: 'נוסחת בייס', def: 'היפוך כיוון ההתניה — מ-$y|x$ ל-$x|y$.', tex: 'f_{X\\mid Y}=\\tfrac{f_{Y\\mid X}f_X}{f_Y}' },
    { term: 'אי-תלות', def: 'הצפיפות המשותפת מתפרקת למכפלת השוליים; ידיעת אחד לא משנה את השני.', tex: 'f_{XY}=f_X\\,f_Y' },
    { term: 'קונבולוציה', def: 'צפיפות הסכום של שני משתנים בלתי-תלויים.', tex: 'f_{X+Y}=f_X*f_Y' },
  ],
  formulas: [
    { name: 'CDF', tex: 'F_X(x)=\\Pr(X\\le x)' },
    { name: 'צפיפות ↔ CDF', tex: 'f_X(x)=\\tfrac{dF_X}{dx},\\quad F_X(x)=\\int_{-\\infty}^{x} f_X(t)\\,dt' },
    { name: 'הסתברות לקטע', tex: '\\Pr(l\\le X\\le u)=\\int_l^u f_X(t)\\,dt' },
    { name: 'אחיד', tex: 'f_X(x)=\\tfrac{1}{b-a},\\;\\; a\\le x\\le b' },
    { name: 'מעריכי', tex: 'f_X(x)=\\lambda e^{-\\lambda x}\\;\\Rightarrow\\; F_X(x)=1-e^{-\\lambda x}' },
    { name: 'גאוסי', tex: 'f_X(x)=\\tfrac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-\\frac{(x-m)^2}{2\\sigma^2}}' },
    { name: 'פואסון', tex: '\\Pr(X=k)=\\tfrac{e^{-\\lambda}\\lambda^k}{k!}' },
    { name: 'שולית', tex: 'f_Y(y)=\\int_{-\\infty}^{\\infty} f_{XY}(x,y)\\,dx' },
    { name: 'מותנית', tex: 'f_{X\\mid Y}(x\\mid y)=\\tfrac{f_{XY}(x,y)}{f_Y(y)}' },
    { name: 'בייס', tex: 'f_{X\\mid Y}(x\\mid y)=\\tfrac{f_{Y\\mid X}(y\\mid x)f_X(x)}{f_Y(y)}' },
    { name: 'אי-תלות', tex: 'f_{XY}(x,y)=f_X(x)f_Y(y)' },
    { name: 'סכום (קונבולוציה)', tex: 'f_Z(z)=\\int f_X(z-y)f_Y(y)\\,dy', wide: true },
  ],
  symbols: [
    { sym: '\\Omega', he: 'מרחב המדגם — כל התוצאות האפשריות' },
    { sym: '\\mathcal{F}', he: 'מרחב המאורעות' },
    { sym: '\\Pr(A)', he: 'הסתברות של מאורע' },
    { sym: 'X,\\;Y', he: 'משתנים מקריים' },
    { sym: 'F_X(x)', he: 'פונקציית ההתפלגות המצטברת (CDF)' },
    { sym: 'f_X(x)', he: 'פונקציית הצפיפות (PDF)' },
    { sym: 'P_X(x)', he: 'פונקציית המסה (PMF) — למשתנה בדיד' },
    { sym: 'f_{XY}(x,y)', he: 'צפיפות משותפת' },
    { sym: 'f_{X\\mid Y}', he: 'צפיפות מותנית' },
    { sym: '\\lambda', he: 'קצב (מעריכי / פואסון)' },
    { sym: 'm,\\;\\sigma', he: 'תוחלת וסטיית תקן (גאוסי)' },
  ],
}
