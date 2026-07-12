import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const momentsProof: ComplexityProof = {
  result: 'E[X^n]=j^{-n}\\varphi_X^{(n)}(0)',
  claimHe: 'הנגזרות של הפונקציה האופיינית באפס שולפות את המומנטים אחד-אחד.',
  steps: [
    { he: 'מפתחים את המעריך לטור:', tex: 'e^{jwX}=\\sum_{i} \\frac{(jwX)^i}{i!}' },
    { he: 'לוקחים תוחלת (לינארית):', tex: '\\varphi_X(w)=\\sum_i \\frac{(jw)^i}{i!}\\,E[X^i]' },
    { he: 'גוזרים n פעמים ומציבים w=0 — רק האיבר ה-n שורד:', tex: '\\varphi_X^{(n)}(0)=j^{n}E[X^n]' },
  ],
  intuitionHe: 'הפונקציה האופיינית "אורזת" את כל המומנטים; גזירה באפס פורשת אותם.',
}

const gaussProof: ComplexityProof = {
  result: '\\varphi_X(w)=e^{\\,jwm-\\frac12 w^2\\sigma^2}',
  claimHe: 'הפונקציה האופיינית של הגאוסי היא שוב "פעמון" (במעריך).',
  steps: [
    { he: 'לפי ההגדרה — התמרת פורייה של הצפיפות:', tex: '\\varphi_X(w)=\\int \\frac{1}{\\sqrt{2\\pi\\sigma^2}}e^{-\\frac{(x-m)^2}{2\\sigma^2}}e^{jwx}\\,dx' },
    { he: '"משלימים לריבוע" במעריך עם \\tilde m=m+jw\\sigma^2:', tex: '-\\frac{(x-\\tilde m)^2}{2\\sigma^2}+jwm-\\tfrac12 w^2\\sigma^2' },
    { he: 'האינטגרל הגאוסי שנותר שווה 1:', tex: '=e^{\\,jwm-\\frac12 w^2\\sigma^2}' },
  ],
  intuitionHe: 'המשפחה נשמרת: התמרת פורייה של פעמון היא פעמון — לכן הגאוסי כה נוח.',
}

/** Lesson 2 · Characteristic function — the transform that packs all the moments. */
export default function CharFuncTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="2.5"
        titleHe="פונקציה אופיינית (CF)"
        tex="\varphi_X(w)=E\big[e^{jwX}\big]=\int_{-\infty}^{\infty} e^{jwx} f_X(x)\,dx"
        meaningHe={
          'ה<b>טרנספורם המרכזי של הקורס</b> — התמרת פורייה של הצפיפות. יתרון גדול: היא <b>תמיד קיימת</b> ' +
          '(כי $|e^{jwX}|=1$), מאפיינת את ההתפלגות באופן מלא, ולרוב נוחה יותר מה-CDF.'
        }
        example={
          <p>
            סכום משתנים בלתי-תלויים הופך למכפלת פונקציות אופייניות — ולכן CF הופך קונבולוציות קשות למכפלות פשוטות.
          </p>
        }
      />

      <DefinitionCard
        kind="property"
        titleHe="מומנטים מתוך הנגזרות"
        tex="E[X^n]=j^{-n}\,\varphi_X^{(n)}(0)"
        meaningHe={'כל המומנטים "יושבים" בפונקציה האופיינית: הנגזרת ה-$n$-ית באפס נותנת את $E[X^n]$ (עד מקדם).'}
        example={
          <p>
            מהגזירה הראשונה מקבלים <span dir="ltr"><Tex>{'E[X]=-j\\,\\varphi_X\'(0)'}</Tex></span>, ומהשנייה את{' '}
            <span dir="ltr"><Tex>{'E[X^2]'}</Tex></span>.
          </p>
        }
        proof={momentsProof}
      />

      <DefinitionCard
        n="משפט 2.3"
        kind="theorem"
        titleHe="אי-תלות ⇔ מכפלה"
        tex="X\perp Y\iff \varphi_{XY}(w_x,w_y)=\varphi_X(w_x)\,\varphi_Y(w_y)"
        meaningHe={'המשתנים בלתי-תלויים אם ורק אם הפונקציה האופיינית המשותפת מתפרקת למכפלה — מקבילה מדויקת לפירוק הצפיפות.'}
        example={<p>לכן הפונקציה האופיינית של סכום בלתי-תלויים היא מכפלת הפונקציות האופייניות.</p>}
      />

      <DefinitionCard
        n="משפט 2.4"
        kind="theorem"
        titleHe="הפונקציה האופיינית של הגאוסי"
        tex="X\sim N(m,\sigma^2)\;\Rightarrow\; \varphi_X(w)=e^{\,jwm-\frac12 w^2\sigma^2}"
        meaningHe={'הפונקציה האופיינית של גאוסי היא שוב גאוסית במעריך — התכונה שהופכת חישובים עם גאוסים לפשוטים כל-כך.'}
        example={
          <p>
            סכום גאוסים בלתי-תלויים: מכפילים <span dir="ltr"><Tex>{'\\varphi'}</Tex></span> ⇒ מחברים תוחלות ושונויות ⇒
            התוצאה גאוסית — הכל מיידית דרך המעריך.
          </p>
        }
        proof={gaussProof}
      />

      <Panel title="הערה — פונקציה אופיינית מול MGF">
        <p className="leading-relaxed text-slate-700">
          קרוב-משפחה הוא ה-<b>MGF</b> (פונקציה יוצרת מומנטים) <span dir="ltr"><Tex>{'M_X(w)=E[e^{wX}]=\\varphi_X(-jw)'}</Tex></span>.
          הקורס מזכיר אותו פעם אחת בלבד ועובד לכל אורכו עם ה<b>פונקציה האופיינית</b>, שקיימת תמיד (ה-MGF עלול להתבדר).
          זו גם העמודה שראיתם בטבלת ההתפלגויות ב<b>מבט-על</b>.
        </p>
      </Panel>
    </div>
  )
}
