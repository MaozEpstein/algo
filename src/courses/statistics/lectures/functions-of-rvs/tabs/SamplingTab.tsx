import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import InverseSamplingExplorer from '../../../viz/InverseSamplingExplorer'

const lotusProof: ComplexityProof = {
  result: 'E[g(X)]=\\int g(x)\\,f_X(x)\\,dx',
  claimHe: 'מחשבים את תוחלת g(X) ישירות מ-f_X — בלי למצוא קודם את f_Y.',
  steps: [
    { he: 'מתחילים מהגדרת התוחלת עם צפיפות היעד:', tex: 'E[Y]=\\int y\\,f_Y(y)\\,dy=\\int y\\,h\'(y)f_X(h(y))\\,dy' },
    { he: 'החלפת משתנה y=g(x), dy=g\'(x)dx:', tex: '=\\int g(x)\\,h\'(g(x))\\,f_X(x)\\,g\'(x)\\,dx' },
    { he: 'לפי כלל הנגזרת ההפוכה h\'(g(x))g\'(x)=1:', tex: '=\\int g(x)\\,f_X(x)\\,dx' },
  ],
  intuitionHe: 'ה"סטטיסטיקאי חסר-ההכרה": לא צריך לגזור את f_Y כדי למצע — פשוט משקללים את g(x) בצפיפות המקורית.',
}

const itsProof: ComplexityProof = {
  result: 'Z=F^{-1}(U)\\ \\Rightarrow\\ F_Z=F',
  claimHe: 'הפעלת ההופכי של ה-CDF על משתנה אחיד נותנת בדיוק את ההתפלגות המבוקשת.',
  steps: [
    { he: 'מחשבים את ה-CDF של Z:', tex: 'F_Z(z)=\\Pr\\big(F^{-1}(U)\\le z\\big)' },
    { he: 'מפעילים F (מונוטונית עולה) על שני האגפים:', tex: '=\\Pr\\big(U\\le F(z)\\big)' },
    { he: 'ו-U אחיד על [0,1], כלומר F_U(u)=u:', tex: '=F(z)' },
  ],
  intuitionHe: 'ה-CDF "מיישר" כל התפלגות לאחידה; ההופכי שלו עושה את הדרך בחזרה — כך מייצרים דגימות מכל צורה.',
}

/** Lesson 3 · Expectation & sampling — LOTUS, inverse-transform sampling, flows. */
export default function SamplingTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 3.3"
        kind="theorem"
        titleHe="תוחלת של פונקציה (LOTUS)"
        tex="E[g(X)]=\int_{-\infty}^{\infty} g(x)\,f_X(x)\,dx"
        meaningHe={'כדי לחשב את $E[g(X)]$ <b>לא צריך</b> את $f_Y$ — פשוט משקללים את $g(x)$ בצפיפות המקורית $f_X$. חוסך עבודה רבה.'}
        example={
          <p>
            <span dir="ltr"><Tex>{'E[X^2]=\\int x^2 f_X(x)\\,dx'}</Tex></span> ישירות — בלי לגזור את התפלגות{' '}
            <span dir="ltr"><Tex>{'X^2'}</Tex></span>.
          </p>
        }
        proof={lotusProof}
      />

      <DefinitionCard
        n="משפט 3.4"
        kind="theorem"
        titleHe="חוק התוחלת השלמה"
        tex="E\big[g(X,Y)\big]=E_Y\Big[\,E_{X\mid Y}\big[g(X,Y)\mid Y\big]\Big]"
        meaningHe={'מחשבים תוחלת בשני שלבים: קודם "פנימה" בהינתן $Y$, ואז ממצעים על $Y$. הבסיס לחוק השונות השלמה משיעור 2.'}
        example={<p>שימושי כשקל לחשב את התוחלת בהינתן משתנה עזר, ואז לשקלל לפי התפלגותו.</p>}
      />

      <DefinitionCard
        n="משפט 3.5–3.6"
        kind="theorem"
        titleHe="דגימה בטרנספורם ההפוך"
        tex="U\sim U[0,1]\ \Rightarrow\ X=F_X^{-1}(U)\ \sim\ F_X\qquad(\text{ולהפך: } F_X(X)\sim U[0,1])"
        meaningHe={
          'כדי לייצר דגימה מכל התפלגות: מגרילים <b>אחיד</b> $U$ ומפעילים את $F_X^{-1}$. וההפך (טרנספורם אינטגרל ההסתברות): ' +
          'הפעלת ה-CDF על משתנה מחזירה תמיד <b>אחיד</b>. זה הבסיס לסימולציות.'
        }
        example={
          <p>
            מעריכי: <span dir="ltr"><Tex>{'F(x)=1-e^{-\\lambda x}'}</Tex></span>, אז{' '}
            <span dir="ltr"><Tex>{'X=-\\tfrac{1}{\\lambda}\\ln(1-U)'}</Tex></span> מייצר דגימות מעריכיות מ-<Tex>{'U'}</Tex>.
          </p>
        }
        proof={itsProof}
      />

      <Panel title="🎛️ ארגז חול — דגימה בטרנספורם ההפוך">
        <p className="mb-3 leading-relaxed text-slate-600">
          משיכות אחידות <span dir="ltr"><Tex>{'U'}</Tex></span> על הציר האנכי עוברות דרך <span dir="ltr"><Tex>{'F^{-1}'}</Tex></span>{' '}
          (קוראים ימינה עד ה-CDF, ואז יורדים) והופכות לדגימות <span dir="ltr"><Tex>{'X'}</Tex></span>. הן <b>נדחסות</b> היכן
          שה-CDF תלולה — כלומר היכן שהצפיפות גבוהה.
        </p>
        <InverseSamplingExplorer />
      </Panel>

      <Panel title="הרחבה — זרימות מנרמלות (Normalizing Flows)">
        <p className="leading-relaxed text-slate-700">
          הרעיון של שינוי-משתנה הוא הבסיס למודלים גנרטיביים מודרניים: מתחילים מרעש פשוט{' '}
          <span dir="ltr"><Tex>{'Z_0\\sim N(0,I)'}</Tex></span>, מעבירים דרך שרשרת פונקציות הפיכות{' '}
          <span dir="ltr"><Tex>{'Z_K=f_K\\circ\\cdots\\circ f_1(Z_0)'}</Tex></span>, ועוקבים אחרי הצפיפות עם היעקוביאן:
        </p>
        <div className="mt-2 overflow-x-auto rounded-lg bg-slate-50 px-3 py-2 text-center" dir="ltr">
          <Tex block>{'\\log p(Z_K)=\\log p_0(Z_0)-\\sum_{k=1}^{K}\\log\\big|\\det \\tfrac{\\partial f_k}{\\partial Z_{k-1}}\\big|'}</Tex>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          כך לומדים לדגום מהתפלגויות מסובכות (תמונות, קול) — אותה נוסחת שינוי-משתנה, בממדים רבים.
        </p>
      </Panel>
    </div>
  )
}
