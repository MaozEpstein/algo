import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import JointDensityViewer from '../../../viz/JointDensityViewer'

const bayesProof: ComplexityProof = {
  result: 'f_{X\\mid Y}(x\\mid y)=\\dfrac{f_{Y\\mid X}(y\\mid x)\\,f_X(x)}{f_Y(y)}',
  claimHe: 'נוסחת בייס הופכת את כיוון ההתניה: מ-"y בהינתן x" ל-"x בהינתן y".',
  steps: [
    { he: 'מהגדרת ההתניה בשני הכיוונים:', tex: 'f_{X\\mid Y}=\\dfrac{f_{XY}}{f_Y},\\qquad f_{Y\\mid X}=\\dfrac{f_{XY}}{f_X}' },
    { he: 'מהשנייה נבודד את הצפיפות המשותפת:', tex: 'f_{XY}=f_{Y\\mid X}(y\\mid x)\\,f_X(x)' },
    { he: 'נציב בראשונה:', tex: 'f_{X\\mid Y}(x\\mid y)=\\dfrac{f_{Y\\mid X}(y\\mid x)\\,f_X(x)}{f_Y(y)}' },
  ],
  intuitionHe: 'הצפיפות המשותפת f_{XY} היא הגשר: מחשבים אותה מכיוון אחד (הידע שיש לנו) ומחלקים בשולי של הצד השני.',
}

const convProof: ComplexityProof = {
  result: 'f_Z=f_X*f_Y',
  claimHe: 'אם X,Y בלתי-תלויים ו-Z=X+Y, צפיפות הסכום היא הקונבולוציה של הצפיפויות.',
  steps: [
    { he: 'ה-CDF של הסכום הוא אינטגרל על התחום x+y≤z:', tex: 'F_Z(z)=\\iint_{x+y\\le z} f_{XY}(x,y)\\,dx\\,dy' },
    { he: 'גוזרים לפי z (כלל לייבניץ):', tex: 'f_Z(z)=\\int_{-\\infty}^{\\infty} f_{XY}(z-y,\\,y)\\,dy' },
    { he: 'באי-תלות f_{XY}=f_X f_Y ומתקבלת קונבולוציה:', tex: 'f_Z(z)=\\int_{-\\infty}^{\\infty} f_X(z-y)\\,f_Y(y)\\,dy=(f_X*f_Y)(z)' },
  ],
  intuitionHe: 'כל דרך לפצל את z לשני חלקים x=z−y ו-y תורמת מכפלת צפיפויות; סוכמים (אינטגרל) על כל הפיצולים.',
}

/** Lesson 1 · Multiple RVs — joint, marginal, conditional, Bayes, independence. */
export default function MultipleRVTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="1.5"
        titleHe="התפלגות משותפת (Joint CDF)"
        tex="F_{XY}(x,y)=\Pr(X\le x,\;Y\le y)"
        meaningHe={
          'כשיש שני משתנים יחד, שואלים על <b>שניהם בו-זמנית</b>: מה הסיכוי ש-$X$ קטן מ-$x$ <b>וגם</b> $Y$ קטן מ-$y$. ' +
          'עולה חלש בכל משתנה, מתאפסת ב-$-\\infty$ ומגיעה ל-$1$ בפינה $(\\infty,\\infty)$.'
        }
        example={
          <p>
            הסתברות לכך שגם הגובה וגם המשקל של אדם אקראי נמוכים מסף מסוים — פונקציה של שני הספים יחד.
          </p>
        }
      />

      <DefinitionCard
        n="1.6"
        titleHe="צפיפות משותפת ושוליים (Marginal)"
        tex="f_{XY}(x,y)=\dfrac{\partial^2 F_{XY}}{\partial x\,\partial y}\qquad f_Y(y)=\int_{-\infty}^{\infty} f_{XY}(x,y)\,dx"
        meaningHe={
          'הצפיפות המשותפת היא הנגזרת המעורבת של ה-CDF. כדי לקבל את ה<b>התפלגות השולית</b> של משתנה אחד — ' +
          '"שוכחים" את השני על-ידי <b>אינטגרציה עליו</b>. ההסתברות למלבן היא השטח מעל המלבן.'
        }
        example={
          <p>
            נתונה צפיפות אחידה על ריבוע היחידה, <span dir="ltr"><Tex>{'f_{XY}=1'}</Tex></span>. השולית{' '}
            <span dir="ltr"><Tex>{'f_X(x)=\\int_0^1 1\\,dy=1'}</Tex></span> — כלומר{' '}
            <span dir="ltr"><Tex>{'X\\sim U(0,1)'}</Tex></span>.
          </p>
        }
      />

      <Panel title="הסתברות של מלבן מתוך ה-CDF">
        <p className="leading-relaxed text-slate-700">
          כדי לחשב הסתברות שנופלת בתוך מלבן, מרכיבים ארבע פינות של ה-CDF (הכלה-הדחה):
        </p>
        <div className="mt-2 overflow-x-auto rounded-lg bg-slate-50 px-3 py-2 text-center" dir="ltr">
          <Tex block>{'\\Pr(x_1\\!\\le\\! X\\!\\le\\! x_2,\\;y_1\\!\\le\\! Y\\!\\le\\! y_2)=F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)+F(x_1,y_1)'}</Tex>
        </div>
      </Panel>

      <DefinitionCard
        n="1.7"
        titleHe="התפלגות מותנית (Conditional)"
        tex="f_{X\mid Y}(x\mid y)=\dfrac{f_{XY}(x,y)}{f_Y(y)}\qquad (f_Y(y)>0)"
        meaningHe={
          'ההתפלגות של $X$ <b>אחרי שנודע לנו</b> ש-$Y=y$. מחלקים את המשותף בשולי של $Y$ כדי לנרמל בחזרה לצפיפות תקינה. ' +
          'לכל $y$ קבוע מקבלים צפיפות רגילה של $X$.'
        }
        example={
          <p>
            אזהרה של המרצה: <b>לא</b> משתמשים ב-<span dir="ltr"><Tex>{'F_{X\\mid Y}=F_{XY}/F_Y'}</Tex></span> —
            ההתניה הנכונה היא של הצפיפויות, לא של פונקציות ההתפלגות.
          </p>
        }
      />

      <DefinitionCard
        n="משפט 1.1"
        kind="theorem"
        titleHe="נוסחת בייס"
        tex="f_{X\mid Y}(x\mid y)=\dfrac{f_{Y\mid X}(y\mid x)\,f_X(x)}{f_Y(y)}"
        meaningHe={
          'לב הקורס: הופכים את כיוון ההתניה. אם אנחנו יודעים איך המדידה $Y$ מתנהגת בהינתן הגודל $X$ (מודל), ' +
          'בייס נותן את הידע על $X$ <b>אחרי</b> שראינו את $Y$ (ה-posterior).'
        }
        example={
          <p>
            בדיקה רפואית: מ-"סיכוי לתוצאה חיובית בהינתן חולה" (רגישות הבדיקה) לומדים "סיכוי להיות חולה בהינתן תוצאה חיובית".
          </p>
        }
        proof={bayesProof}
      />

      <DefinitionCard
        n="1.8"
        titleHe="אי-תלות (Independence)"
        tex="X\perp Y\;\Longleftrightarrow\; f_{XY}(x,y)=f_X(x)\,f_Y(y)"
        meaningHe={
          'שני משתנים <b>בלתי-תלויים</b> אם הצפיפות המשותפת מתפרקת למכפלת השוליים — כלומר ידיעת אחד ' +
          '<b>לא משנה</b> את התפלגות השני: $f_{X\\mid Y}=f_X$.'
        }
        example={
          <p>
            שתי הטלות מטבע נפרדות — בלתי-תלויות. לעומת זאת נקודה אחידה בתוך <b>עיגול</b> נותנת{' '}
            <span dir="ltr"><Tex>{'X,Y'}</Tex></span> <b>תלויים</b> (ראו בארגז החול למטה).
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — משותפת, שולית, מותנית ואי-תלות">
        <p className="mb-3 leading-relaxed text-slate-600">
          החום הוא הצפיפות המשותפת <span dir="ltr"><Tex>{'f_{XY}'}</Tex></span>; העקומה למטה היא השולית{' '}
          <span dir="ltr"><Tex>{'f_X'}</Tex></span>; והחתך הכתום בוחר את המותנית{' '}
          <span dir="ltr"><Tex>{'f_{Y\\mid X=x}'}</Tex></span>. עברו בין הריבוע (בלתי-תלויים — החתך קבוע) לעיגול
          (תלויים — החתך מצטמצם בקצוות).
        </p>
        <JointDensityViewer />
      </Panel>

      <DefinitionCard
        titleHe="סכום של משתנים בלתי-תלויים ← קונבולוציה"
        kind="property"
        tex="Z=X+Y,\;\;X\perp Y\;\Longrightarrow\; f_Z=f_X*f_Y"
        meaningHe={
          'צפיפות הסכום של שני משתנים בלתי-תלויים היא ה<b>קונבולוציה</b> של הצפיפויות שלהם — ' +
          'סוכמים על כל הדרכים לפצל את $z$ לשני מחוברים.'
        }
        example={
          <p>
            סכום שני מעריכיים סטנדרטיים בלתי-תלויים נותן{' '}
            <span dir="ltr"><Tex>{'f_Z(z)=z\\,e^{-z}'}</Tex></span> — התפלגות גמא.
          </p>
        }
        proof={convProof}
      />

      <Panel title="לאן זה מוביל — ערוץ תקשורת בינארי">
        <p className="leading-relaxed text-slate-700">
          שולחים <span dir="ltr"><Tex>{'X=\\pm1'}</Tex></span> בהסתברות שווה, ומקבלים{' '}
          <span dir="ltr"><Tex>{'Y=X+Z'}</Tex></span> עם רעש גאוסי <span dir="ltr"><Tex>{'Z\\sim N(0,\\sigma^2)'}</Tex></span>.
          בעזרת בייס מקבלים את ה-posterior <span dir="ltr"><Tex>{'\\Pr(X=1\\mid Y=y)'}</Tex></span> שיוצא בצורת{' '}
          <b>סיגמואיד</b> — כמה ה-y "משכנע", תלוי ב-<span dir="ltr"><Tex>{'\\sigma^2'}</Tex></span>. זה בדיוק הגשר
          לשיעורי הגילוי והאמידה בהמשך הקורס.
        </p>
      </Panel>
    </div>
  )
}
