import type { LectureModule } from '@/core/engine/types'
import MomentsExplainer from './MomentsExplainer'

/**
 * Statistics — Lesson 2: Moments. Chapter 2 of the lecturer's summary. The numbers
 * that summarize a distribution: expectation (first moment) and conditional
 * expectation, variance/correlation/covariance-matrix (second moment) with the
 * law of total variance, and the characteristic function that packs all the
 * moments. Definition-first, with proof modals and two sandboxes (balance-point/
 * spread, and a correlation-ellipse explorer). Practice = the real recitation/
 * homework/exam problems.
 */
export const momentsLecture: LectureModule = {
  id: 'moments',
  number: 2,
  titleHe: 'מומנטים',
  subtitleEn: 'Moments',
  views: [],
  algorithms: [],
  summary: MomentsExplainer,
  explainer: true,
  glossary: [
    { term: 'תוחלת (מומנט ראשון)', def: 'המרכז/נקודת האיזון של ההתפלגות.', tex: 'E[X]=\\int x f_X(x)\\,dx' },
    { term: 'תוחלת מותנית', def: 'תוחלת $X$ בהינתן $Y$; היא בעצמה משתנה מקרי (פונקציה של $Y$).', tex: 'E[X\\mid Y]' },
    { term: 'שונות', def: 'מדד הפיזור סביב התוחלת; שורשה הוא סטיית התקן.', tex: '\\mathrm{Var}(X)=E[X^2]-E^2[X]' },
    { term: 'שונות משותפת (קווריאנס)', def: 'מדד לנטייה של $X,Y$ לנוע יחד.', tex: '\\sigma_{XY}=E[XY]-E[X]E[Y]' },
    { term: 'מקדם מתאם', def: 'קווריאנס מנורמל, בין $-1$ ל-$1$; מודד קשר לינארי.', tex: '\\rho=\\sigma_{XY}/(\\sigma_X\\sigma_Y)' },
    { term: 'מטריצת קווריאנס', def: 'אוסף כל השונויות/קווריאנסים; סימטרית וחצי-מוגדרת חיובית.', tex: 'C_x=E[xx^\\top]-\\mu\\mu^\\top' },
    { term: 'חוק השונות השלמה', def: 'פירוק השונות לפיזור בתוך הקבוצות ובין הקבוצות.', tex: '\\mathrm{Var}(X)=E_Y[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}_Y(E[X\\mid Y])' },
    { term: 'פונקציה אופיינית', def: 'התמרת פורייה של הצפיפות; קיימת תמיד ומחלצת מומנטים.', tex: '\\varphi_X(w)=E[e^{jwX}]' },
  ],
  formulas: [
    { name: 'תוחלת', tex: 'E[X]=\\int x f_X(x)\\,dx' },
    { name: 'לינאריות', tex: 'E[aX+bY]=aE[X]+bE[Y]' },
    { name: 'שונות', tex: '\\mathrm{Var}(X)=E[X^2]-E^2[X]' },
    { name: 'שונות תחת סקאלה', tex: '\\mathrm{Var}(aX)=a^2\\mathrm{Var}(X)' },
    { name: 'קווריאנס ומתאם', tex: '\\sigma_{XY}=E[XY]-E[X]E[Y],\\quad \\rho=\\tfrac{\\sigma_{XY}}{\\sigma_X\\sigma_Y}\\in[-1,1]' },
    { name: 'מטריצת קווריאנס', tex: 'C_x=E[xx^\\top]-\\mu\\mu^\\top\\succeq 0,\\quad C_{Ax+b}=A C_x A^\\top' },
    { name: 'חוק השונות השלמה', tex: '\\mathrm{Var}(X)=E_Y[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}_Y(E[X\\mid Y])', wide: true },
    { name: 'פונקציה אופיינית', tex: '\\varphi_X(w)=E[e^{jwX}]' },
    { name: 'מומנטים מהנגזרות', tex: 'E[X^n]=j^{-n}\\varphi_X^{(n)}(0)' },
    { name: 'פונקציה אופיינית של גאוסי', tex: '\\varphi_X(w)=e^{\\,jwm-\\frac12 w^2\\sigma^2}' },
  ],
  symbols: [
    { sym: 'E[X]', he: 'תוחלת (מומנט ראשון)' },
    { sym: 'E[X\\mid Y]', he: 'תוחלת מותנית (משתנה מקרי)' },
    { sym: '\\mathrm{Var}(X),\\;\\sigma', he: 'שונות וסטיית תקן' },
    { sym: '\\sigma_{XY}', he: 'שונות משותפת (קווריאנס)' },
    { sym: '\\rho', he: 'מקדם מתאם' },
    { sym: 'C_x', he: 'מטריצת קווריאנס' },
    { sym: '\\varphi_X(w)', he: 'פונקציה אופיינית' },
    { sym: 'm_k', he: 'המומנט מסדר $k$: $E[X^k]$' },
  ],
}
