import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import TransformExplorer from '../../../viz/TransformExplorer'

const covProof: ComplexityProof = {
  result: 'f_Y(y)=\\big|h\'(y)\\big|\\,f_X(h(y))',
  claimHe: 'נוסחת שינוי המשתנה — נגזרת מתוך ה-CDF, בלי "קסמים".',
  steps: [
    { he: 'מתחילים מה-CDF של Y (למקרה עולה):', tex: 'F_Y(y)=\\Pr(g(X)\\le y)=\\Pr\\big(X\\le h(y)\\big)=F_X(h(y))' },
    { he: 'גוזרים לפי y (כלל השרשרת), עם h=g^{-1}:', tex: 'f_Y(y)=f_X(h(y))\\cdot h\'(y)' },
    { he: 'למקרה יורד הסימן מתהפך; יחד — הערך המוחלט:', tex: 'f_Y(y)=\\big|h\'(y)\\big|\\,f_X(h(y))' },
  ],
  intuitionHe: 'הגורם |h′| הוא "מתיחת הסקאלה": איפה ש-g שטוחה, טווח x גדול נדחס לטווח y קטן — והצפיפות עולה.',
}

/** Lesson 3 · Invertible transforms — change of variables + the sandbox. */
export default function InvertibleTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 3.1"
        kind="theorem"
        titleHe="שינוי משתנה (פונקציה הפיכה)"
        tex="f_Y(y)=\big|h'(y)\big|\,f_X\big(h(y)\big),\qquad h=g^{-1}"
        meaningHe={
          'כדי לקבל את הצפיפות של $Y=g(X)$: מציבים את המקור $x=h(y)$ בצפיפות $f_X$, ומכפילים ב<b>גורם המתיחה</b> ' +
          '$|h\'(y)|$ (שהוא $1/|g\'(x)|$). זה מבטיח שהשטח נשמר — כלומר שהתוצאה עדיין צפיפות תקינה.'
        }
        example={
          <p>
            לינארי <span dir="ltr"><Tex>{'Y=aX+b'}</Tex></span>: כאן <span dir="ltr"><Tex>{'h(y)=(y-b)/a'}</Tex></span> ו-<span dir="ltr"><Tex>{'|h\'|=1/|a|'}</Tex></span>,
            ולכן <span dir="ltr"><Tex>{'f_Y(y)=\\tfrac{1}{|a|}f_X\\!\\big(\\tfrac{y-b}{a}\\big)'}</Tex></span>.
          </p>
        }
        proof={covProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="דוגמה — הסיגמואיד (Example 13)"
        tex="Y=\sigma(X)=\dfrac{1}{1+e^{-X}}\;\in(0,1)"
        meaningHe={
          'הסיגמואיד "דוחס" את כל הישר ל-$(0,1)$ — שימושי להפוך ציון ל<b>הסתברות</b>. ההופכי הוא ה-logit ' +
          '$h(y)=\\ln\\!\\frac{y}{1-y}$, ו-$|h\'(y)|=\\frac{1}{y(1-y)}$.'
        }
        example={
          <p>
            עם <span dir="ltr"><Tex>{'X\\sim N(\\mu,\\sigma^2)'}</Tex></span> מקבלים{' '}
            <span dir="ltr"><Tex>{'f_Y(y)=\\dfrac{1}{\\sqrt{2\\pi}\\,\\sigma\\,y(1-y)}\\,e^{-\\frac{(\\ln\\frac{y}{1-y}-\\mu)^2}{2\\sigma^2}}'}</Tex></span> על{' '}
            <span dir="ltr"><Tex>{'(0,1)'}</Tex></span> — "לוגיט-נורמלי".
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — הצפיפות שמשנה צורה">
        <p className="mb-3 leading-relaxed text-slate-600">
          באמצע רואים את הפונקציה <span dir="ltr"><Tex>{'g'}</Tex></span>; למטה את צפיפות המקור{' '}
          <span dir="ltr"><Tex>{'f_X'}</Tex></span>, ומשמאל את הצפיפות המתקבלת <span dir="ltr"><Tex>{'f_Y'}</Tex></span>.
          החליפו פונקציה וגררו את <span dir="ltr"><Tex>{'x'}</Tex></span> — הצפיפות <b>מצטופפת</b> היכן ש-g שטוחה
          ו<b>מתדללת</b> היכן שהיא תלולה.
        </p>
        <TransformExplorer />
      </Panel>
    </div>
  )
}
