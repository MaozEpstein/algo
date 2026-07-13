import type { LectureModule } from '@/core/engine/types'
import MomentsRPExplainer from './MomentsRPExplainer'

/**
 * Statistics — Lesson 11: Moments of random processes. Chapter 11 of the summary,
 * extending lesson 10. Full characterization is intractable, so we keep the first
 * two moments: the mean function, the autocorrelation R_X(t₁,t₂)=E[X(t₁)X(t₂)],
 * and the autocovariance. These give wide-sense stationarity (WSS) — the weaker,
 * checkable cousin of SSS — plus the moment behavior of the canonical processes
 * (cosine, MA, random walk, AR) and how an LTI system transforms them.
 * Definition-first, with proof modals and two sandboxes (autocorrelation explorer,
 * LTI filter explorer). Practice = real recitation/summary/exam problems.
 */
export const momentsRPLecture: LectureModule = {
  id: 'moments-of-random-processes',
  number: 11,
  titleHe: 'מומנטים של תהליכים מקריים',
  subtitleEn: 'Moments of Random Processes',
  views: [],
  algorithms: [],
  summary: MomentsRPExplainer,
  explainer: true,
  glossary: [
    { term: 'פונקציית התוחלת', def: 'התוחלת של התהליך בכל רגע.', tex: '\\mu_X(t)=E[X(t)]' },
    { term: 'אוטו-קורלציה', def: 'המתאם (הלא-מנוכה) בין שתי דגימות של התהליך.', tex: 'R_X(t_1,t_2)=E[X(t_1)X(t_2)]' },
    { term: 'אוטו-קווריאנס', def: 'האוטו-קורלציה בניכוי התוחלות.', tex: 'C_X(t_1,t_2)=R_X-\\mu_X(t_1)\\mu_X(t_2)' },
    { term: 'סטציונריות רחבה (WSS)', def: 'תוחלת קבועה ואוטו-קורלציה תלוית-פיגור בלבד.', tex: '\\mu_X\\ \\text{const},\\ R_X(t_1,t_2)=R_X(\\tau)' },
    { term: 'הספק', def: 'האוטו-קורלציה בפיגור אפס = המומנט השני.', tex: 'R_X(0)=E[X^2(t)]\\ge0' },
    { term: 'מערכת LTI', def: 'קונבולוציה; WSS בכניסה ⇒ WSS ביציאה.', tex: 'y[n]=\\textstyle\\sum_i h[i]x[n-i]' },
  ],
  formulas: [
    { name: 'פונקציית התוחלת', tex: '\\mu_X(t)=E[X(t)]' },
    { name: 'אוטו-קורלציה', tex: 'R_X(t_1,t_2)=E[X(t_1)X(t_2)]=R_X(t_2,t_1)' },
    { name: 'אוטו-קווריאנס', tex: 'C_X(t_1,t_2)=R_X(t_1,t_2)-\\mu_X(t_1)\\mu_X(t_2)' },
    { name: 'WSS (שני תנאים)', tex: '\\mu_X(t)=\\mu_X,\\quad R_X(t_1,t_2)=R_X(t_1-t_2)=R_X(\\tau)', wide: true },
    { name: 'חסם וסימטריה', tex: 'R_X(\\tau)=R_X(-\\tau),\\quad |R_X(\\tau)|\\le R_X(0)' },
    { name: 'AR(1) (דוגמה 44)', tex: 'R_X(k)=\\tfrac{\\sigma^2}{1-\\alpha^2}\\alpha^{|k|}' },
    { name: 'יציאת LTI', tex: 'E[Y]=\\big(\\textstyle\\sum_i h[i]\\big)\\mu_X,\\ \\ R_Y(k)=\\textstyle\\sum_i\\sum_j h[i]h[j]R_X[k+j-i]', wide: true },
  ],
  symbols: [
    { sym: '\\mu_X(t)', he: 'פונקציית התוחלת' },
    { sym: 'R_X(\\tau)', he: 'אוטו-קורלציה (תלוית פיגור)' },
    { sym: 'C_X(\\tau)', he: 'אוטו-קווריאנס' },
    { sym: '\\tau', he: 'פיגור (t₁−t₂)' },
    { sym: 'h[i]', he: 'תגובת ההלם של מערכת LTI' },
  ],
}
