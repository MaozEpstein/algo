import type { LectureModule } from '@/core/engine/types'
import OverviewExplainer from './OverviewExplainer'

/**
 * Statistics — Lesson 0: "מבט-על", a growing reference hub. Its first tab is the
 * common-distributions toolbox (Uniform, Exponential, Gaussian, Bernoulli,
 * Binomial, Poisson + MVN reference) — the families the whole course leans on
 * but never teaches as first-class objects. Number 0 keeps it pinned to the top
 * as an always-accessible reference. Extensible: more tabs (course map, general
 * formula sheet) can slot in later.
 */
export const overviewLecture: LectureModule = {
  id: 'overview',
  number: 0,
  numberLabelHe: 'מבט-על',
  titleHe: 'מבט-על — ארגז הכלים של הקורס',
  subtitleEn: 'Toolbox & Course Map',
  views: [],
  algorithms: [],
  summary: OverviewExplainer,
  explainer: true,
  glossary: [
    { term: 'תוחלת', def: 'המרכז "הממוצע" של ההתפלגות (מוגדר רשמית בשיעור 2).', tex: '\\mathbb{E}[X]=\\int x f_X(x)\\,dx' },
    { term: 'שונות', def: 'מדד הפיזור סביב התוחלת (שיעור 2).', tex: '\\mathrm{Var}(X)=\\mathbb{E}[X^2]-\\mathbb{E}^2[X]' },
    { term: 'פונקציה אופיינית', def: 'הטרנספורם המרכזי של הקורס — התמרת פורייה של הצפיפות; ממנה מחלצים מומנטים.', tex: '\\varphi_X(w)=\\mathbb{E}[e^{jwX}]' },
    { term: 'נורמלי רב-ממדי', def: 'ההכללה הווקטורית של הגאוסי (שיעור 4).', tex: 'N(\\boldsymbol\\mu,\\Sigma)' },
  ],
  formulas: [
    { name: 'תוחלת', tex: '\\mathbb{E}[X]=\\int x f_X(x)\\,dx' },
    { name: 'שונות', tex: '\\mathrm{Var}(X)=\\mathbb{E}[X^2]-\\mathbb{E}^2[X]' },
    { name: 'פונקציה אופיינית', tex: '\\varphi_X(w)=\\mathbb{E}[e^{jwX}]' },
    { name: 'מומנטים מהפונקציה האופיינית', tex: '\\mathbb{E}[X^n]=j^{-n}\\varphi_X^{(n)}(0)' },
  ],
  symbols: [
    { sym: '\\mathbb{E}[X]', he: 'תוחלת (מומנט ראשון)' },
    { sym: '\\mathrm{Var}(X)', he: 'שונות' },
    { sym: '\\varphi_X(w)', he: 'פונקציה אופיינית' },
    { sym: '\\lambda', he: 'קצב (מעריכי / פואסון)' },
    { sym: '\\theta,\\;p', he: 'הסתברות הצלחה (ברנולי / בינומי)' },
    { sym: 'm,\\;\\sigma^2', he: 'תוחלת ושונות (גאוסי)' },
  ],
}
