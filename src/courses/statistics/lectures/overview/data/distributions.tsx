import {
  uniformPdf,
  expPdf,
  gaussianPdf,
  bernoulliPmf,
  binomialPmf,
  poissonPmf,
} from '../../../lib/distributions'

/**
 * Single source of truth for the distributions reference. Both the cards and the
 * comparison table render from this array. Quantities marked in `notes` follow
 * the course-wide scan: E[X]/Var are course-stated for Gaussian/Poisson/
 * Bernoulli/Binomial and standard for Uniform/Exponential; only the Gaussian
 * characteristic function is derived in the summary — the rest are standard.
 */

export type DistKind = 'continuous' | 'discrete' | 'reference'

export interface DistDatum {
  id: string
  nameHe: string
  tex: string // family name in LaTeX, e.g. U(a,b)
  kind: DistKind
  storyHe: string
  /** parameters and their valid range, e.g. 'λ>0' */
  paramsTex: string
  supportTex: string
  pdfLabel: 'PDF' | 'PMF' | 'PDF וקטורי'
  pdfTex: string
  cdfTex?: string // omitted for discrete (step function) and reference
  meanTex: string
  /** second moment E[X²] */
  m2Tex: string
  varTex: string
  cfTex: string
  cfNote?: string
  /** thumbnail: a density/mass fn with default params + domain */
  plot?: { fn: (x: number) => number; xmin?: number; xmax?: number; kmax?: number }
}

export const DISTRIBUTIONS: DistDatum[] = [
  {
    id: 'uniform',
    nameHe: 'אחיד',
    tex: 'U(a,b)',
    kind: 'continuous',
    storyHe: 'חוסר ידע מוחלט בתוך קטע — כל ערך שקול. משמש גם כאבן-בניין לדגימה.',
    paramsTex: 'a<b',
    supportTex: 'a\\le x\\le b',
    pdfLabel: 'PDF',
    pdfTex: 'f_X(x)=\\dfrac{1}{b-a}',
    cdfTex: 'F_X(x)=\\dfrac{x-a}{b-a}',
    meanTex: '\\dfrac{a+b}{2}',
    m2Tex: '\\dfrac{a^2+ab+b^2}{3}',
    varTex: '\\dfrac{(b-a)^2}{12}',
    cfTex: '\\dfrac{e^{jwb}-e^{jwa}}{jw\\,(b-a)}',
    plot: { fn: (x) => uniformPdf(x, 2, 8), xmin: 1, xmax: 9 },
  },
  {
    id: 'exp',
    nameHe: 'מעריכי',
    tex: '\\mathrm{Exp}(\\lambda)',
    kind: 'continuous',
    storyHe: 'זמן המתנה עד לאירוע. חסר-זיכרון: מה שכבר חיכינו לא משנה את ההמשך.',
    paramsTex: '\\lambda>0',
    supportTex: 'x\\ge 0',
    pdfLabel: 'PDF',
    pdfTex: 'f_X(x)=\\lambda e^{-\\lambda x}',
    cdfTex: 'F_X(x)=1-e^{-\\lambda x}',
    meanTex: '\\dfrac{1}{\\lambda}',
    m2Tex: '\\dfrac{2}{\\lambda^2}',
    varTex: '\\dfrac{1}{\\lambda^2}',
    cfTex: '\\dfrac{\\lambda}{\\lambda-jw}',
    plot: { fn: (x) => expPdf(x, 1), xmin: 0, xmax: 6 },
  },
  {
    id: 'gauss',
    nameHe: 'גאוסי (נורמלי)',
    tex: 'N(m,\\sigma^2)',
    kind: 'continuous',
    storyHe: 'ה"פעמון" — סכומים ורעש שואפים אליו (משפט הגבול המרכזי). עמוד השדרה של הקורס.',
    paramsTex: 'm\\in\\mathbb{R},\\ \\sigma^2>0',
    supportTex: 'x\\in\\mathbb{R}',
    pdfLabel: 'PDF',
    pdfTex: 'f_X(x)=\\dfrac{1}{\\sqrt{2\\pi\\sigma^2}}\\,e^{-\\frac{(x-m)^2}{2\\sigma^2}}',
    cdfTex: '\\Phi\\!\\left(\\dfrac{x-m}{\\sigma}\\right)',
    meanTex: 'm',
    m2Tex: 'm^2+\\sigma^2',
    varTex: '\\sigma^2',
    cfTex: 'e^{\\,jwm-\\frac12 w^2\\sigma^2}',
    cfNote: 'היחידה שנגזרת במפורש בסיכום (משפט 2.4).',
    plot: { fn: (x) => gaussianPdf(x, 0, 1), xmin: -4, xmax: 4 },
  },
  {
    id: 'bernoulli',
    nameHe: 'ברנולי',
    tex: '\\mathrm{Bern}(\\theta)',
    kind: 'discrete',
    storyHe: 'ניסוי כן/לא בודד — הצלחה בהסתברות θ. אבן-הבניין של הבינומי ושל תהליכים מקריים.',
    paramsTex: '\\theta\\in[0,1]',
    supportTex: 'k\\in\\{0,1\\}',
    pdfLabel: 'PMF',
    pdfTex: 'P_X(k)=\\theta^{k}(1-\\theta)^{1-k}',
    meanTex: '\\theta',
    m2Tex: '\\theta',
    varTex: '\\theta(1-\\theta)',
    cfTex: '1-\\theta+\\theta e^{jw}',
    plot: { fn: (k) => bernoulliPmf(k, 0.6), kmax: 1 },
  },
  {
    id: 'binomial',
    nameHe: 'בינומי',
    tex: '\\mathrm{Bin}(n,p)',
    kind: 'discrete',
    storyHe: 'מספר ההצלחות ב-n ניסויי ברנולי בלתי-תלויים.',
    paramsTex: 'n\\in\\mathbb{N},\\ p\\in[0,1]',
    supportTex: 'k\\in\\{0,\\dots,n\\}',
    pdfLabel: 'PMF',
    pdfTex: 'P_X(k)=\\binom{n}{k}p^{k}(1-p)^{n-k}',
    meanTex: 'np',
    m2Tex: 'np(1-p)+(np)^2',
    varTex: 'np(1-p)',
    cfTex: '\\left(1-p+pe^{jw}\\right)^{n}',
    plot: { fn: (k) => binomialPmf(k, 8, 0.4), kmax: 8 },
  },
  {
    id: 'poisson',
    nameHe: 'פואסון',
    tex: '\\mathrm{Pois}(\\lambda)',
    kind: 'discrete',
    storyHe: 'מספר אירועים נדירים בפרק זמן או מרחב.',
    paramsTex: '\\lambda>0',
    supportTex: 'k\\in\\{0,1,2,\\dots\\}',
    pdfLabel: 'PMF',
    pdfTex: 'P_X(k)=\\dfrac{e^{-\\lambda}\\lambda^{k}}{k!}',
    meanTex: '\\lambda',
    m2Tex: '\\lambda+\\lambda^2',
    varTex: '\\lambda',
    cfTex: 'e^{\\lambda(e^{jw}-1)}',
    plot: { fn: (k) => poissonPmf(k, 3), kmax: 10 },
  },
]

/** Chapter-4 pillar — shown as a reference card (no 1-D plot), links to lesson 4. */
export const MVN: DistDatum = {
  id: 'mvn',
  nameHe: 'נורמלי רב-ממדי',
  tex: 'N(\\boldsymbol\\mu,\\Sigma)',
  kind: 'reference',
  storyHe: 'ההכללה הווקטורית של הגאוסי — וקטור תוחלות μ ומטריצת קווריאנס Σ. נלמד לעומק בשיעור 4.',
  paramsTex: '\\boldsymbol\\mu\\in\\mathbb{R}^{n},\\ \\Sigma\\succeq 0',
  supportTex: '\\mathbf{x}\\in\\mathbb{R}^{n}',
  pdfLabel: 'PDF וקטורי',
  pdfTex: 'f_{\\mathbf x}(\\mathbf x)=\\dfrac{1}{\\sqrt{(2\\pi)^{n}|\\Sigma|}}\\,e^{-\\frac12(\\mathbf x-\\boldsymbol\\mu)^{\\top}\\Sigma^{-1}(\\mathbf x-\\boldsymbol\\mu)}',
  meanTex: '\\boldsymbol\\mu',
  m2Tex: '\\Sigma+\\boldsymbol\\mu\\boldsymbol\\mu^{\\top}',
  varTex: '\\mathrm{Cov}=\\Sigma',
  cfTex: 'e^{\\,jw^{\\top}\\boldsymbol\\mu-\\frac12 w^{\\top}\\Sigma w}',
}

/** Incidental / derived distributions — appear as examples, not studied families. */
export const INCIDENTAL: { nameHe: string; tex: string; noteHe: string }[] = [
  { nameHe: 'כי-בריבוע', tex: '\\chi^2_{(1)}', noteHe: 'ריבוע של נורמלי סטנדרטי, $Z^2$ עם $Z\\sim N(0,1)$ (פרק 3).' },
  { nameHe: 'ריילי', tex: '\\mathrm{Rayleigh}', noteHe: 'רדיוס של נורמלי מרוכב סימטרי, $f(r)=r\\,e^{-r^2/2}$ (פרק 3).' },
  { nameHe: 'לפלס', tex: '\\mathrm{Laplace}', noteHe: 'מודל רעש עם "זנבות כבדים" — מוטיבציה לאמידה חסינה (פרק 6).' },
]
