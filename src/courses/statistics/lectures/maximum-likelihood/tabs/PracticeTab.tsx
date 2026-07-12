import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part } from '../../../components/practice'

/**
 * Lesson 6 — practice. Every problem is a REAL course item with its citation:
 *   • ש.ב 7 — שאלה 1 (exponential MLE), שאלה 2 (uniform max)
 *   • תרגול 7 — §4 shrinkage bias-variance
 *   • מבחן 2020 מועד א׳ — שאלה 1 (Poisson MLE)
 */

const q1Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MLE של $\\theta$ עבור $f(t;\\theta)=\\tfrac1\\theta e^{-t/\\theta}$.',
    tex: '\\ln L=-N\\ln\\theta-\\tfrac1\\theta\\textstyle\\sum t_i,\\quad \\partial_\\theta=-\\tfrac N\\theta+\\tfrac{1}{\\theta^2}\\textstyle\\sum t_i=0',
    res: <Tex>{'\\hat\\theta=\\tfrac1N\\textstyle\\sum t_i'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'האם הוא מוטה?',
    tex: 'E[t_i]=\\theta\\ \\Rightarrow\\ E[\\hat\\theta]=\\theta',
    res: <Tex>{'\\mathrm{bias}=0'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את השונות וה-MSE.',
    tex: 'E[t_i^2]=2\\theta^2\\ \\Rightarrow\\ E[\\hat\\theta^2]=\\theta^2+\\tfrac{\\theta^2}{N}',
    res: <Tex>{'\\mathrm{Var}=\\mathrm{MSE}=\\theta^2/N'}</Tex>,
    accent: ACCENT.emerald,
  },
]

const q2Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מהי צפיפות ה-MLE $\\hat\\theta=\\max_i y_i$ עבור $U(0,\\theta)$ ($N$ דגימות)?',
    tex: 'F_{\\hat\\theta}(t)=(t/\\theta)^N\\ \\Rightarrow\\ f_{\\hat\\theta}(t)=\\tfrac{N t^{N-1}}{\\theta^N}',
    res: <Tex>{'f_{\\hat\\theta}(t)=N t^{N-1}/\\theta^N'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את ההטיה.',
    tex: 'E[\\hat\\theta]=\\int_0^\\theta t\\cdot\\tfrac{Nt^{N-1}}{\\theta^N}dt=\\tfrac{N}{N+1}\\theta',
    res: <Tex>{'\\mathrm{bias}=-\\tfrac{\\theta}{N+1}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>מוטה כלפי מטה — <Tex>{'\\max'}</Tex> תמיד קטן מ-<Tex>{'\\theta'}</Tex>.</>,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את ה-MSE, והאם האמד עקבי?',
    tex: '\\mathrm{Var}=\\tfrac{N\\theta^2}{(N+2)(N+1)^2}',
    res: <Tex>{'\\mathrm{MSE}=\\tfrac{2\\theta^2}{(N+2)(N+1)}'}</Tex>,
    accent: ACCENT.emerald,
    note: <>עקבי: גם ההטיה וגם ה-MSE שואפים ל-0 כש-<Tex>{'N\\to\\infty'}</Tex>.</>,
  },
]

const q3Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'חשבו את ההטיה של האמד המכווץ $\\hat\\mu=\\alpha\\cdot\\tfrac1N\\sum X_i$ ($0<\\alpha<1$).',
    tex: 'E[\\hat\\mu]=\\alpha\\mu',
    res: <Tex>{'\\mathrm{bias}=(\\alpha-1)\\mu'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את ה-MSE.',
    tex: '\\mathrm{Var}=\\tfrac{\\alpha^2\\sigma^2}{N}',
    res: <Tex>{'\\mathrm{MSE}=\\tfrac{\\alpha^2\\sigma^2}{N}+(\\alpha-1)^2\\mu^2'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'concept',
    prompt: 'מתי הוא מנצח את ה-MLE?',
    answer: (
      <>
        כאשר <Tex>{'\\mu'}</Tex> קטן. עבור <Tex>{'\\mu=0'}</Tex>: <Tex>{'\\mathrm{MSE}=\\tfrac{\\alpha^2\\sigma^2}{N}<\\tfrac{\\sigma^2}{N}'}</Tex> — טוב יותר מה-ML!
        (אבל עבור <Tex>{'\\mu=1,\\sigma^2=1,N=10,\\alpha=\\tfrac12'}</Tex>: <Tex>{'\\mathrm{MSE}=\\tfrac{11}{40}>\\tfrac1{10}'}</Tex> — גרוע יותר.) זו תמורת ההטיה-שונות.
      </>
    ),
  },
]

const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את ה-MLE עבור פואסון $p(y;\\theta)=\\theta^y e^{-\\theta}/y!$.',
    tex: '\\log L=\\textstyle\\sum_i(y_i\\log\\theta-\\theta-\\log y_i!),\\quad \\partial_\\theta=\\textstyle\\sum(\\tfrac{y_i}{\\theta}-1)=0',
    res: <Tex>{'\\hat\\theta=\\tfrac1n\\textstyle\\sum y_i'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'האם הוא מוטה? מהי שונותו?',
    tex: 'E[\\hat\\theta]=\\tfrac1n\\cdot n\\theta=\\theta,\\quad \\mathrm{Var}=\\tfrac1{n^2}\\cdot n\\theta',
    res: <Tex>{'\\text{לא-מוטה},\\ \\mathrm{Var}=\\theta/n'}</Tex>,
    accent: ACCENT.emerald,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (ש.ב · תרגול · מבחן) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="תרגיל — MLE מעריכי" source="ש.ב 7 · שאלה 1" parts={q1Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'t_i\\sim\\mathrm{Exp}(1/\\theta)'}</Tex></span> בלתי-תלויים (<span dir="ltr"><Tex>{'f(t;\\theta)=\\tfrac1\\theta e^{-t/\\theta}'}</Tex></span>). מצאו את האמד, הטייתו ו-MSE.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — MLE אחיד (max)" source="ש.ב 7 · שאלה 2" parts={q2Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'y_i\\sim U(0,\\theta)'}</Tex></span> בלתי-תלויים. ה-MLE הוא <span dir="ltr"><Tex>{'\\hat\\theta=\\max_i y_i'}</Tex></span>. מצאו הטיה, שונות ו-MSE.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — אמד מכווץ ותמורת הטיה-שונות" source="תרגול 7 · §4" parts={q3Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'X_i\\sim N(\\mu,\\sigma^2)'}</Tex></span>, ובמקום ה-MLE משתמשים באמד מכווץ <span dir="ltr"><Tex>{'\\hat\\mu=\\alpha\\cdot\\overline X'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="שאלת מבחן — MLE של פואסון" source="מבחן 2020 מועד א׳ · שאלה 1" parts={examParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'y_i\\sim\\mathrm{Pois}(\\theta)'}</Tex></span> בלתי-תלויים. מצאו את ה-MLE ובדקו הטיה ושונות.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="למה אמד השונות של ה-MLE מוטה?">
            כי הוא מודד פיזור סביב <b>הממוצע המשוערך</b> <Tex>{'\\hat\\mu'}</Tex> ולא סביב <Tex>{'\\mu'}</Tex> האמיתי — וזה תמיד קטן מעט
            יותר. התיקון הוא חלוקה ב-<Tex>{'N-1'}</Tex> במקום <Tex>{'N'}</Tex>.
          </QA>
          <QA q="למה יותר נתונים תמיד מקטינים את ה-MSE של המלה?">
            כי השונות של האמד מתנהגת כ-<Tex>{'\\sim 1/N'}</Tex> וההטיה האסימפטוטית שואפת ל-0 — ולכן <Tex>{'\\mathrm{MSE}\\to0'}</Tex> (עקביות).
          </QA>
        </div>
      </Panel>
    </div>
  )
}
