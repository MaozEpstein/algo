import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part } from '../../../components/practice'

/**
 * Lesson 7 — practice. Every problem is a REAL course item with its citation:
 *   • תרגול 8 — שאלה 1 (scalar LS + ridge), שאלה 3 (numeric line fit)
 *   • ש.ב 8 — שאלה 1 (generalized / colored-noise LS)
 *   • מבחן 2024 מועד א׳ — שאלה 2 (linear-Gaussian LS)
 */

const q1Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-ML/LS עבור $y_i=\\theta h_i+n_i$.',
    tex: '\\tfrac{dLL}{d\\theta}=0:\\ \\ \\textstyle\\sum h_i^2\\,\\theta=\\textstyle\\sum h_i y_i',
    res: <Tex>{'\\hat\\theta=\\tfrac{\\sum h_i y_i}{\\sum h_i^2}=(H^\\top H)^{-1}H^\\top Y'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'הטיה ושונות.',
    tex: 'E[\\hat\\theta]=\\theta,\\quad \\mathrm{Var}=\\tfrac{\\sum h_i^2\\,\\sigma^2}{(\\sum h_i^2)^2}',
    res: <Tex>{'\\text{לא-מוטה},\\ \\mathrm{Var}=\\sigma^2/\\textstyle\\sum h_i^2'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'מהו אמד ה-ridge, והטייתו/שונותו?',
    tex: '\\hat\\theta=\\arg\\min\\|Y-\\theta h\\|^2+\\lambda\\theta^2',
    res: <Tex>{'\\hat\\theta=\\tfrac{\\sum h_i y_i}{\\lambda+\\sum h_i^2}'}</Tex>,
    accent: ACCENT.emerald,
    note: <><Tex>{'\\mathrm{bias}=-\\tfrac{\\lambda\\theta}{\\lambda+\\sum h_i^2}'}</Tex>, <Tex>{'\\mathrm{Var}=\\tfrac{\\sigma^2\\sum h_i^2}{(\\sum h_i^2+\\lambda)^2}'}</Tex> — מוטה אך בעל שונות קטנה יותר.</>,
  },
]

const q3Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'בנו את $H^\\top H$ ו-$H^\\top y$ עבור $x=1..5$, $y=2.1,3.9,6.2,7.8,10.1$.',
    tex: 'H=\\begin{pmatrix}1&1\\\\1&2\\\\ \\vdots&\\vdots\\\\1&5\\end{pmatrix}',
    res: <Tex>{'H^\\top H=\\begin{pmatrix}5&15\\\\15&55\\end{pmatrix},\\ H^\\top y=\\begin{pmatrix}30.1\\\\110.2\\end{pmatrix}'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'פתרו $\\hat\\theta=(H^\\top H)^{-1}H^\\top y$.',
    tex: '\\hat\\theta=\\begin{pmatrix}5&15\\\\15&55\\end{pmatrix}^{-1}\\begin{pmatrix}30.1\\\\110.2\\end{pmatrix}',
    res: <Tex>{'\\hat\\theta\\approx[0.05,\\ 1.99],\\ \\ \\hat y\\approx0.05+1.99x'}</Tex>,
    accent: ACCENT.emerald,
  },
]

const q4Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-ML עבור $y=\\theta h+N(0,\\sigma^2 I)$.',
    tex: 'y\\sim N(\\theta h,\\sigma^2 I)',
    res: <Tex>{'\\hat\\theta=(h^\\top h)^{-1}h^\\top y'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'האם מוטה? מהו ה-MSE?',
    tex: 'E[\\hat\\theta]=(h^\\top h)^{-1}h^\\top h\\theta=\\theta',
    res: <Tex>{'\\text{לא-מוטה},\\ \\mathrm{MSE}=\\sigma^2/(h^\\top h)'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'אם משתמשים ב-$\\hat h\\ne h$ שגוי — האם מוטה? MSE?',
    tex: '\\mathrm{bias}=(h^\\top h)^{-1}h^\\top(\\hat h-h)\\theta',
    res: <Tex>{'\\mathrm{MSE}=\\tfrac{\\sigma^2}{h^\\top h}+\\theta^2\\big(\\tfrac{h^\\top(\\hat h-h)}{h^\\top h}\\big)^2'}</Tex>,
    accent: ACCENT.amber,
  },
]

const hwParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את אמד ה-ML עבור רעש צבעוני $n\\sim N(0,\\Sigma)$.',
    tex: '-2H^\\top\\Sigma^{-1}y+2H^\\top\\Sigma^{-1}H\\theta=0',
    res: <Tex>{'\\hat\\theta=(H^\\top\\Sigma^{-1}H)^{-1}H^\\top\\Sigma^{-1}y'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'הראו שזה שקול ל-LS רגיל אחרי "הלבנה".',
    answer: (
      <>
        עם <Tex>{'A^\\top A=\\Sigma^{-1}'}</Tex> ו-<Tex>{'z=Ay'}</Tex>: אז <Tex>{'z\\sim N(AH\\theta,\\,I)'}</Tex> (רעש לבן). LS רגיל על הנתונים המולבנים
        <Tex>{'\\tilde H=AH'}</Tex> נותן <Tex>{'(\\tilde H^\\top\\tilde H)^{-1}\\tilde H^\\top z=(H^\\top\\Sigma^{-1}H)^{-1}H^\\top\\Sigma^{-1}y'}</Tex> — אותו דבר.
      </>
    ),
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (תרגול · ש.ב · מבחן) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="תרגיל — LS סקלרי ו-ridge" source="תרגול 8 · שאלה 1" parts={q1Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'y_i=\\theta h_i+n_i'}</Tex></span>, <span dir="ltr"><Tex>{'n_i\\sim N(0,\\sigma^2)'}</Tex></span> בלתי-תלויים, <span dir="ltr"><Tex>{'h_i'}</Tex></span> ידועים. מצאו את האמד, ביצועיו, ואת גרסת ה-ridge.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — התאמת קו נומרית" source="תרגול 8 · שאלה 3" parts={q3Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          התאימו <span dir="ltr"><Tex>{'\\hat y=\\theta_0+\\theta_1 x'}</Tex></span> לנתונים <span dir="ltr"><Tex>{'(x_i,y_i)'}</Tex></span> ע״י המשוואות הנורמליות.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — LS עם רעש צבעוני" source="ש.ב 8 · שאלה 1" parts={hwParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'y=H\\theta+n'}</Tex></span> עם <span dir="ltr"><Tex>{'n\\sim N(0,\\Sigma)'}</Tex></span> (קווריאנס כללי). מצאו את אמד ה-ML.
        </p>
      </Problem>

      <Problem titleHe="שאלת מבחן — מודל לינארי גאוסי" source="מבחן 2024 מועד א׳ · שאלה 2" parts={q4Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'y=h\\theta+N(0,\\sigma^2 I)'}</Tex></span>, <span dir="ltr"><Tex>{'h\\in\\mathbb{R}^M'}</Tex></span> ידוע. אמדו את <span dir="ltr"><Tex>{'\\theta'}</Tex></span> ובחנו הטיה ו-MSE.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="למה ריבועים פחותים שקול לנראות מרבית?">
            כי מזעור <Tex>{'\\|y-H\\theta\\|^2'}</Tex> הוא בדיוק מזעור ה-log-נראות השלילית של <Tex>{'y\\sim N(H\\theta,\\sigma^2 I)'}</Tex> — הרעש הגאוסי
            הופך "מרחק ריבועי" ל"נראות".
          </QA>
          <QA q="מתי ridge עוזר, ולמה הוא מוטה?">
            כשיש <b>מעט נתונים</b> ביחס לפרמטרים (ה-LS מתאים-יתר). ה-<Tex>{'\\lambda\\|\\theta\\|^2'}</Tex> מרסן את <Tex>{'\\theta'}</Tex> —
            מזיז אותו מהאופטימום (הטיה) אבל מקטין מאוד את השונות, וכך ה-MSE הכולל קטֵן.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
