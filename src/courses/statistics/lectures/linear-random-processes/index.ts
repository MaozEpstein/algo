import type { LectureModule } from '@/core/engine/types'
import LinearRPExplainer from './LinearRPExplainer'

/**
 * Statistics — Lesson 12: Examples of random processes (the course finale).
 * Chapter 12. Studies the linear (AR) random process and its asymptotic
 * stationarity, then two landmark optimal linear filters built on the whole
 * course: the Wiener filter (finite-horizon, batch, via the normal equations
 * h=(R_X+σ_W²I)⁻¹r_XY) and the Kalman filter (recursive predict/update). Both are
 * the LMMSE of lesson 9 applied over time to a WSS process (lessons 10–11).
 * Definition-first, with proof modals and two sandboxes (AR convergence, Kalman
 * tracking). Practice = real exam/recitation/summary problems.
 */
export const linearRPLecture: LectureModule = {
  id: 'linear-random-processes',
  number: 12,
  titleHe: 'דוגמאות לתהליכים מקריים',
  subtitleEn: 'Examples of Random Processes',
  views: [],
  algorithms: [],
  summary: LinearRPExplainer,
  explainer: true,
  glossary: [
    { term: 'תהליך AR', def: 'תהליך אוטו-רגרסיבי לינארי (מרקובי).', tex: 'X_n=\\alpha X_{n-1}+W_n' },
    { term: 'סטציונריות אסימפטוטית', def: 'המומנטים מתכנסים לגבול קבוע כאשר n→∞.', tex: '\\mathrm{Var}(X_n)\\to\\tfrac{\\sigma_W^2}{1-\\alpha^2}' },
    { term: 'תנאי התחלה תואם', def: 'X₀ מותאם להתפלגות הסטציונרית ⇒ SSS מיד.', tex: '\\sigma_0^2=\\tfrac{\\sigma^2}{1-\\alpha^2}' },
    { term: 'מסנן וינר', def: 'המסנן הלינארי האופטימלי (אופק סופי) מהמשוואות הנורמליות.', tex: 'h=(R_X+\\sigma_W^2 I)^{-1}r_{XY}' },
    { term: 'מסנן קלמן', def: 'LMMSE רקורסיבי — ניבוי ואז עדכון.', tex: '\\hat S_{n|n}=\\hat S_{n|n-1}+K_n(X_n-\\hat S_{n|n-1})' },
    { term: 'רווח קלמן', def: 'משקל המדידה מול הניבוי.', tex: 'K_n=\\tfrac{P_{n|n-1}}{P_{n|n-1}+\\sigma_R^2}' },
  ],
  formulas: [
    { name: 'תהליך AR', tex: 'X_n=\\alpha X_{n-1}+W_n' },
    { name: 'גבול תוחלת/שונות', tex: 'E[X_n]\\to\\tfrac{\\mu_W}{1-\\alpha},\\quad \\mathrm{Var}(X_n)\\to\\tfrac{\\sigma_W^2}{1-\\alpha^2}', wide: true },
    { name: 'גבול קווריאנס', tex: '\\mathrm{Cov}(X_n,X_{n+\\tau})\\to\\tfrac{\\sigma_W^2\\,\\alpha^{|\\tau|}}{1-\\alpha^2}' },
    { name: 'מסנן וינר (משוואות נורמליות)', tex: 'h=R_Y^{-1}r_{XY}=(R_X+\\sigma_W^2 I)^{-1}r_{XY}', wide: true },
    { name: 'קלמן — ניבוי', tex: '\\hat S_{n|n-1}=a\\hat S_{n-1|n-1},\\ P_{n|n-1}=a^2P_{n-1|n-1}+\\sigma_Q^2', wide: true },
    { name: 'קלמן — עדכון', tex: 'K_n=\\tfrac{P_{n|n-1}}{P_{n|n-1}+\\sigma_R^2},\\ \\hat S_{n|n}=\\hat S_{n|n-1}+K_n(X_n-\\hat S_{n|n-1}),\\ P_{n|n}=P_{n|n-1}(1-K_n)', wide: true },
    { name: 'ML עבור AR', tex: '\\hat\\alpha_{ML}=\\tfrac{\\sum X[i]X[i-1]}{\\sum X[i-1]^2}' },
  ],
  symbols: [
    { sym: '\\alpha', he: 'מקדם האוטו-רגרסיה' },
    { sym: 'h', he: 'מקדמי מסנן וינר' },
    { sym: 'K_n', he: 'רווח קלמן' },
    { sym: 'P_{n|n}', he: 'שונות שגיאת האמידה' },
    { sym: '\\hat S_{n|n-1}', he: 'ניבוי לפני המדידה' },
  ],
}
