import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import GaussianVectorExplorer from '../../../viz/GaussianVectorExplorer'

const stdProof: ComplexityProof = {
  result: 'f_x(x)=\\tfrac{1}{\\sqrt{|2\\pi I|}}\\,e^{-\\frac12 x^\\top x}',
  claimHe: 'וקטור של גאוסים סטנדרטיים בלתי-תלויים הוא MVN, וצפיפותו היא מכפלת הצפיפויות.',
  steps: [
    { he: 'לינאריות שומרת גאוסיות — סכום שני גאוסים בלתי-תלויים הוא גאוסי (קונבולוציה). הוכחה נקייה עם הפונקציה האופיינית:', tex: '\\varphi_{x_i}(w)=e^{-\\frac12 w^2}\\ \\Rightarrow\\ \\varphi_{x_i+x_j}(w)=e^{-\\frac12\\cdot 2w^2}=\\varphi_{x_i}^2(w)' },
    { he: 'באי-תלות הצפיפות המשותפת היא מכפלה:', tex: 'f_x(x)=\\prod_i \\tfrac{1}{\\sqrt{2\\pi}}e^{-\\frac12 x_i^2}=\\tfrac{1}{\\sqrt{|2\\pi I|}}e^{-\\frac12 x^\\top x}' },
  ],
  intuitionHe: 'כל צירוף לינארי של גאוסים סטנדרטיים הוא גאוסי — לכן וקטור כזה מאופיין לגמרי דרך הצירופים שלו.',
}

const pdfProof: ComplexityProof = {
  result: 'f_x(x)=\\tfrac{1}{\\sqrt{|2\\pi C|}}\\,e^{-\\frac12 (x-m)^\\top C^{-1}(x-m)}',
  claimHe: 'הצפיפות הכללית מתקבלת מהסטנדרטית בשינוי משתנה לינארי.',
  steps: [
    { he: 'לפי "הלבנה" (משפט 4.3) אפשר לכתוב x=Az+b עם z∼N(0,I) ו-AAᵀ=C.', tex: 'x=Az+b,\\quad AA^\\top=C' },
    { he: 'שינוי משתנה z=A⁻¹(x−b); היעקוביאן:', tex: '|J_h|=1/|A|=1/\\sqrt{|C|}' },
    { he: 'מציבים בצפיפות הסטנדרטית ומקבלים:', tex: 'f_x(x)=\\tfrac{1}{\\sqrt{|2\\pi C|}}e^{-\\frac12(x-m)^\\top C^{-1}(x-m)}' },
  ],
  intuitionHe: 'המטריצה A "צובעת" את הענן העגול הסטנדרטי לאליפסה; היעקוביאן 1/√|C| מנרמל את השטח בחזרה.',
}

/** Lesson 4 · Definition & density — the two characterizations + the pdf + the sandbox. */
export default function DefinitionTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="4.2"
        titleHe="הגדרת הנורמלי הרב-ממדי"
        tex="x\ \text{הוא MVN}\iff a^\top x\ \text{גאוסי לכל וקטור קבוע } a"
        meaningHe={
          'ההגדרה הבסיסית אינה דרך הצפיפות אלא דרך <b>הטלות</b>: וקטור הוא נורמלי רב-ממדי אם <b>כל צירוף לינארי</b> ' +
          'של רכיביו הוא גאוסי חד-ממדי. זו הגדרה חזקה — היא מיד גוררת שכל רכיב, וכל טרנספורם לינארי, הם גאוסיים.'
        }
        example={
          <p>
            אם <span dir="ltr"><Tex>{'x'}</Tex></span> הוא MVN, אז גם <span dir="ltr"><Tex>{'x_1+x_2'}</Tex></span>, גם{' '}
            <span dir="ltr"><Tex>{'3x_1-x_2'}</Tex></span>, וכל צירוף אחר — כולם גאוסיים.
          </p>
        }
      />

      <DefinitionCard
        n="משפט 4.1"
        kind="theorem"
        titleHe="הנורמלי הסטנדרטי N(0,I)"
        tex="x\sim N(0,I):\quad f_x(x)=\dfrac{1}{\sqrt{|2\pi I|}}\,e^{-\frac12 x^\top x}"
        meaningHe={'הלבנה הבסיסית: וקטור של גאוסים סטנדרטיים <b>בלתי-תלויים</b>. הצפיפות היא מכפלת הפעמונים, וקווי-הגובה שלה הם <b>מעגלים</b>.'}
        example={<p>ב-2D זה ענן עגול סימטרי סביב הראשית — בסיס שממנו "צובעים" כל גאוסי אחר.</p>}
        proof={stdProof}
      />

      <DefinitionCard
        n="משפט 4.4"
        kind="theorem"
        titleHe="הצפיפות הכללית של MVN"
        tex="f_x(x)=\dfrac{1}{\sqrt{|2\pi C|}}\,e^{-\frac12 (x-m)^\top C^{-1}(x-m)}"
        meaningHe={
          'ההתפלגות נקבעת לגמרי מ<b>וקטור התוחלות</b> $m$ ומ<b>מטריצת הקווריאנס</b> $C$. הביטוי $(x-m)^\\top C^{-1}(x-m)$ ' +
          'הוא "מרחק מהלנוביס" — קווי-גובה קבועים שלו הם <b>אליפסות</b> שצורתן נקבעת מ-$C$.'
        }
        example={
          <p>
            הפונקציה האופיינית מקבילה וקומפקטית: <span dir="ltr"><Tex>{'\\varphi_x(w)=e^{\\,jw^\\top m-\\frac12 w^\\top C w}'}</Tex></span> —
            שוב "גאוסי במעריך".
          </p>
        }
        proof={pdfProof}
      />

      <Panel title="🎛️ ארגז חול — הגאוסי הדו-ממדי">
        <p className="mb-3 leading-relaxed text-slate-600">
          שחקו עם <span dir="ltr"><Tex>{'\\sigma_x,\\sigma_y,\\rho'}</Tex></span> וראו איך מטריצת הקווריאנס קובעת את צורת
          ה<b>אליפסה</b>. הצירים הסגולים הם הכיוונים הראשיים (ה"הלבנה"), והחתך הכתום מראה את <b>ההתניה</b>{' '}
          <span dir="ltr"><Tex>{'X\\mid Y'}</Tex></span>. במצב "דוגמה נגדית" תראו למה שוליים גאוסיים לא מספיקים.
        </p>
        <GaussianVectorExplorer />
      </Panel>
    </div>
  )
}
