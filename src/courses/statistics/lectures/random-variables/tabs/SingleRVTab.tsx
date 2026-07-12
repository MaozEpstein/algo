import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import ProofButton from '../../../components/ProofButton'
import DistributionExplorer from '../../../viz/DistributionExplorer'

const expCdfProof: ComplexityProof = {
  result: 'F_X(x)=1-e^{-\\lambda x}',
  claimHe: 'עבור משתנה מעריכי X∼Exp(λ) עם צפיפות f_X(x)=λe^{-λx} על x≥0, פונקציית ההתפלגות היא 1−e^{-λx}.',
  steps: [
    { he: 'לפי ההגדרה, F הוא אינטגרל הצפיפות עד x:', tex: 'F_X(x)=\\int_0^x \\lambda e^{-\\lambda t}\\,dt' },
    { he: 'האינטגרל של מעריכי:', tex: '=\\Big[-e^{-\\lambda t}\\Big]_0^{x}' },
    { he: 'הצבת הגבולות:', tex: '=1-e^{-\\lambda x},\\qquad x\\ge 0' },
  ],
  intuitionHe: 'ככל ש-x גדל, ההסתברות שהאירוע כבר קרה מתקרבת ל-1; הקצב λ קובע כמה מהר זה מטפס.',
}

/** Lesson 1 · Single random variable — RV, CDF, PDF/PMF, and the standard zoo. */
export default function SingleRVTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="1.2"
        titleHe="משתנה מקרי"
        tex="X:\;\Omega\to\mathbb{R}"
        meaningHe={
          'משתנה מקרי הוא פשוט <b>פונקציה שמצמידה מספר לכל תוצאה</b> $\\omega\\in\\Omega$. ' +
          'הדרישה הטכנית: לכל $x$, האוסף $\\{\\omega : X(\\omega)\\le x\\}$ הוא מאורע (אפשר לשאול עליו הסתברות).'
        }
        example={
          <p>
            מטילים מטבע 10 פעמים; <span dir="ltr"><Tex>{'X(\\omega)'}</Tex></span> = מספר ה"עץ". אז{' '}
            <span dir="ltr"><Tex>{'X'}</Tex></span> מקבל ערכים ב-<span dir="ltr"><Tex>{'\\{0,1,\\dots,10\\}'}</Tex></span>,
            והמיר את המרחב הענק של <span dir="ltr"><Tex>{'2^{10}'}</Tex></span> תוצאות למספר אחד.
          </p>
        }
      />

      <DefinitionCard
        n="1.3"
        titleHe="פונקציית ההתפלגות המצטברת (CDF)"
        tex="F_X(x)=\Pr(X\le x)"
        meaningHe={
          'הפונקציה שאוגרת הסתברות: "מה הסיכוי ש-$X$ ייפול עד הערך $x$". היא <b>עולה חלש</b> (לא יורדת), ' +
          'מתחילה ב-$0$ ב-$-\\infty$ ומגיעה ל-$1$ ב-$+\\infty$.'
        }
        example={
          <p>
            אם <span dir="ltr"><Tex>{'F_X(3)=0.7'}</Tex></span>, זה אומר שב-70% מהמקרים{' '}
            <span dir="ltr"><Tex>{'X\\le 3'}</Tex></span>. וגם:{' '}
            <span dir="ltr"><Tex>{'\\Pr(1<X\\le 3)=F_X(3)-F_X(1)'}</Tex></span>.
          </p>
        }
      />

      <DefinitionCard
        n="1.4"
        titleHe="משתנה רציף וצפיפות (PDF)"
        tex="f_X(x)=\dfrac{dF_X(x)}{dx}\;\;\Longleftrightarrow\;\;F_X(x)=\int_{-\infty}^{x} f_X(t)\,dt"
        meaningHe={
          'אם ה-CDF רציפה, $X$ רציף, והנגזרת שלה היא <b>הצפיפות</b> $f_X$. ' +
          'תכונות: $f_X(x)\\ge 0$, השטח הכולל $\\int_{-\\infty}^{\\infty} f_X=1$, וההסתברות לקטע היא השטח מתחת לעקומה: ' +
          '$\\Pr(l\\le X\\le u)=\\int_l^u f_X$. שימו לב — הצפיפות <b>יכולה לעלות מעל 1</b>; רק השטח חייב להיות 1.'
        }
        example={
          <p>
            למשתנה אחיד על <span dir="ltr"><Tex>{'[0,\\tfrac12]'}</Tex></span> הצפיפות היא{' '}
            <span dir="ltr"><Tex>{'f_X=2'}</Tex></span> (גדולה מ-1!), אבל השטח{' '}
            <span dir="ltr"><Tex>{'2\\cdot\\tfrac12=1'}</Tex></span>.
          </p>
        }
      />

      <Panel title="ומה עם משתנה בדיד?">
        <div className="space-y-2 leading-relaxed text-slate-700">
          <p>
            למשתנה בדיד יש <b>פונקציית מסה</b> (PMF): <span dir="ltr"><Tex>{'P_X(x)=\\Pr(X=x)'}</Tex></span>. אפשר
            אפילו לכתוב לו "צפיפות" בעזרת פונקציות דלתא של דיראק — למשל{' '}
            <span dir="ltr"><Tex>{'\\Pr(X=\\pm1)=\\tfrac12'}</Tex></span> נותן{' '}
            <span dir="ltr"><Tex>{'f_X(x)=\\tfrac12\\delta(x-1)+\\tfrac12\\delta(x+1)'}</Tex></span>. כך אותה שפה (CDF/צפיפות) עוטפת
            גם בדיד וגם רציף, ואפילו תערובות שלהם.
          </p>
        </div>
      </Panel>

      <Panel title="🎛️ ארגז חול — לראות את הקשר CDF ↔ צפיפות">
        <p className="mb-3 leading-relaxed text-slate-600">
          בחרו התפלגות, שחקו עם הפרמטרים, וגררו את <b>הסף x</b>: השטח הצבוע מתחת לצפיפות (משמאל) שווה בדיוק
          לגובה ה-CDF (מימין) באותו <span dir="ltr"><Tex>{'x'}</Tex></span> — כי{' '}
          <span dir="ltr"><Tex>{'F(x)=\\int_{-\\infty}^{x} f'}</Tex></span>. זו ההגדרה, לא קישוט.
        </p>
        <DistributionExplorer />
      </Panel>

      <Panel title="ארבע ההתפלגויות שילוו אותנו">
        <div className="grid gap-3 sm:grid-cols-2">
          <ZooCard
            name="אחיד"
            tex="U(a,b)"
            desc="חוסר ידע מלא בתוך קטע — כל ערך שקול."
            pdf="f_X(x)=\dfrac{1}{b-a},\;\; a\le x\le b"
          />
          <ZooCard
            name="מעריכי"
            tex="\mathrm{Exp}(\lambda)"
            desc="זמן המתנה עד לאירוע (חסר-זיכרון)."
            pdf="f_X(x)=\lambda e^{-\lambda x},\;\; x\ge 0"
            proof={expCdfProof}
          />
          <ZooCard
            name="גאוסי (נורמלי)"
            tex="N(m,\sigma^2)"
            desc="ה'פעמון' — סכומים ורעש שואפים אליו."
            pdf="f_X(x)=\dfrac{1}{\sqrt{2\pi\sigma^2}}\,e^{-\frac{(x-m)^2}{2\sigma^2}}"
          />
          <ZooCard
            name="פואסון (בדיד)"
            tex="\mathrm{Pois}(\lambda)"
            desc="מספר אירועים נדירים בפרק זמן (ספירה)."
            pdf="\Pr(X=k)=\dfrac{e^{-\lambda}\lambda^{k}}{k!}"
          />
        </div>
      </Panel>
    </div>
  )
}

function ZooCard({
  name,
  tex,
  desc,
  pdf,
  proof,
}: {
  name: string
  tex: string
  desc: string
  pdf: string
  proof?: ComplexityProof
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-slate-800">{name}</span>
        <span className="text-slate-500" dir="ltr"><Tex>{tex}</Tex></span>
      </div>
      <p className="mt-1 text-sm leading-snug text-slate-500">{desc}</p>
      <div className="mt-2 overflow-x-auto rounded-lg bg-slate-50 px-3 py-2 text-center" dir="ltr">
        <Tex block>{pdf}</Tex>
      </div>
      {proof && (
        <div className="mt-2">
          <ProofButton proof={proof} label="מהי ה-CDF שלו?" titleHe="גזירת ה-CDF של המעריכי" />
        </div>
      )}
    </div>
  )
}
