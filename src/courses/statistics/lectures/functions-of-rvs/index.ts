import type { LectureModule } from '@/core/engine/types'
import FunctionsExplainer from './FunctionsExplainer'

/**
 * Statistics — Lesson 3: Functions of random variables. Chapter 3 of the summary.
 * Given X, what is the distribution of Y=g(X)? The change-of-variables formula
 * (invertible), the sum-over-roots rule (non-invertible), the Jacobian
 * (multivariate), the law of the unconscious statistician for E[g(X)], and
 * inverse-transform sampling. Definition-first, with proof modals and two
 * sandboxes (a change-of-variables density-reshaper and an inverse-sampling
 * demo). Practice = the real recitation/homework problems.
 */
export const functionsLecture: LectureModule = {
  id: 'functions-of-rvs',
  number: 3,
  titleHe: 'פונקציות של משתנים מקריים',
  subtitleEn: 'Functions of Random Variables',
  views: [],
  algorithms: [],
  summary: FunctionsExplainer,
  explainer: true,
  glossary: [
    { term: 'שינוי משתנה', def: 'צפיפות של $Y=g(X)$ הפיכה: מציבים $x=h(y)$ ומכפילים בגורם המתיחה.', tex: 'f_Y(y)=|h\'(y)|\\,f_X(h(y))' },
    { term: 'סכום על השורשים', def: 'לפונקציה לא-הפיכה — סוכמים תרומה מכל $x$ שממופה ל-$y$.', tex: 'f_Y(y)=\\sum_i f_X(x_i)/|g\'(x_i)|' },
    { term: 'יעקוביאן', def: 'גורם מתיחת-הנפח בשינוי משתנה רב-ממדי.', tex: 'f_{Z}=|\\det J_h|\\,f_{XY}(h)' },
    { term: 'LOTUS', def: 'תוחלת של פונקציה — ישירות מ-$f_X$, בלי $f_Y$.', tex: 'E[g(X)]=\\int g(x)f_X(x)\\,dx' },
    { term: 'דגימה בטרנספורם הפוך', def: 'מייצרים דגימה מכל התפלגות מתוך אחיד.', tex: 'X=F_X^{-1}(U),\\ U\\sim U[0,1]' },
    { term: 'טרנספורם אינטגרל ההסתברות', def: 'הפעלת ה-CDF על המשתנה מחזירה אחיד.', tex: 'F_X(X)\\sim U[0,1]' },
    { term: 'כי-בריבוע (k=1)', def: 'ריבוע של נורמלי סטנדרטי.', tex: 'X^2,\\ X\\sim N(0,1)' },
    { term: 'ריילי', def: 'רדיוס של שני גאוסים בלתי-תלויים במישור.', tex: 'f_R(r)=\\tfrac{r}{\\sigma^2}e^{-r^2/2\\sigma^2}' },
  ],
  formulas: [
    { name: 'שינוי משתנה (הפיך)', tex: 'f_Y(y)=|h\'(y)|\\,f_X(h(y)),\\quad h=g^{-1}' },
    { name: 'לינארי', tex: 'Y=aX+b:\\ \\ f_Y(y)=\\tfrac{1}{|a|}f_X\\!\\big(\\tfrac{y-b}{a}\\big)' },
    { name: 'סכום על השורשים', tex: 'f_Y(y)=\\sum_i f_X(x_i)/|g\'(x_i)|' },
    { name: 'ריבוע → χ²', tex: 'Y=X^2,\\ X\\sim N(0,1):\\ f_Y(y)=\\tfrac{1}{\\sqrt{2\\pi y}}e^{-y/2}' },
    { name: 'יעקוביאן (רב-ממדי)', tex: 'f_{Z}(z)=|\\det J_h|\\,f_{XY}(h(z))' },
    { name: 'סכום → קונבולוציה', tex: 'Z=X+Y\\ (\\perp):\\ f_Z=f_X*f_Y' },
    { name: 'LOTUS', tex: 'E[g(X)]=\\int g(x)f_X(x)\\,dx' },
    { name: 'דגימה הפוכה', tex: 'X=F_X^{-1}(U),\\quad F_X(X)\\sim U[0,1]' },
  ],
  symbols: [
    { sym: 'g,\\;h=g^{-1}', he: 'הפונקציה ומההופכי שלה' },
    { sym: 'h\'(y)', he: 'גורם מתיחת-הסקאלה (חד-ממדי)' },
    { sym: '\\det J_h', he: 'דטרמיננטת היעקוביאן (רב-ממדי)' },
    { sym: 'F_X^{-1}', he: 'הפונקציה ההופכית ל-CDF' },
    { sym: 'U', he: 'משתנה אחיד על $[0,1]$' },
    { sym: '\\chi^2_{(1)}', he: 'התפלגות כי-בריבוע, דרגת חופש 1' },
  ],
}
