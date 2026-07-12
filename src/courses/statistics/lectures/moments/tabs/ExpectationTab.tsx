import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import MomentsExplorer from '../../../viz/MomentsExplorer'

const linearityProof: ComplexityProof = {
  result: 'E[aX+bY]=aE[X]+bE[Y]',
  claimHe: 'התוחלת היא אופרטור לינארי — גם בלי אי-תלות בין X ל-Y.',
  steps: [
    { he: 'לפי ההגדרה התוחלת היא אינטגרל (או סכום):', tex: 'E[aX+bY]=\\iint (ax+by)\\,f_{XY}(x,y)\\,dx\\,dy' },
    { he: 'מפצלים לפי לינאריות האינטגרל:', tex: '=a\\!\\iint x f_{XY}+b\\!\\iint y f_{XY}' },
    { he: 'כל אינטגרל מצטמצם לשולית:', tex: '=a\\,E[X]+b\\,E[Y]' },
  ],
  intuitionHe: 'סכום ואינטגרל לינאריים — לכן גם התוחלת, ותמיד, גם כשהמשתנים תלויים.',
}

/** Lesson 2 · Expectation — the first moment, conditional expectation, linearity. */
export default function ExpectationTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="2.1"
        titleHe="תוחלת (מומנט ראשון)"
        tex="E[X]=\sum_x x\,\Pr(X=x)\;=\;\int_{-\infty}^{\infty} x\,f_X(x)\,dx"
        meaningHe={
          'ה"מרכז" של ההתפלגות — <b>נקודת האיזון</b> (מרכז המסה) שלה. סוכמים כל ערך משוקלל בהסתברות שלו. ' +
          'זה המספר היחיד שהכי מסכם "לאן ההתפלגות נוטה".'
        }
        example={
          <p>
            הטלת קובייה הוגנת: <span dir="ltr"><Tex>{'E[X]=\\tfrac16(1+2+\\dots+6)=3.5'}</Tex></span> — שימו לב שהתוחלת
            עצמה כלל לא ערך אפשרי של הקובייה.
          </p>
        }
      />

      <DefinitionCard
        n="2.1"
        titleHe="תוחלת מותנית"
        tex="E[X\mid Y=y]=\int_{-\infty}^{\infty} x\,f_{X\mid Y}(x\mid y)\,dx"
        meaningHe={
          'התוחלת של $X$ <b>אחרי</b> שנודע ש-$Y=y$. כיוון שהיא תלויה ב-$y$, הביטוי $E[X\\mid Y]$ הוא בעצמו ' +
          '<b>משתנה מקרי</b> (פונקציה של $Y$) — עובדה שתעמוד בבסיס חוק השונות השלמה בהמשך.'
        }
        example={
          <p>
            גובה ממוצע בהינתן קבוצת גיל: <span dir="ltr"><Tex>{'E[\\text{גובה}\\mid \\text{גיל}=y]'}</Tex></span> משתנה עם{' '}
            <span dir="ltr"><Tex>{'y'}</Tex></span> — ולכן הוא משתנה מקרי.
          </p>
        }
      />

      <DefinitionCard
        n="משפט 2.1"
        kind="theorem"
        titleHe="לינאריות התוחלת"
        tex="E[aX+bY]=a\,E[X]+b\,E[Y]"
        meaningHe={'אפשר "להוציא" קבועים ולפצל סכומים מתוך התוחלת. זה נכון <b>תמיד</b> — גם אם $X$ ו-$Y$ תלויים.'}
        example={
          <p>
            אם <span dir="ltr"><Tex>{'E[X]=2'}</Tex></span> ו-<span dir="ltr"><Tex>{'E[Y]=5'}</Tex></span>, אז{' '}
            <span dir="ltr"><Tex>{'E[3X-Y]=3\\cdot2-5=1'}</Tex></span>.
          </p>
        }
        proof={linearityProof}
      />

      <Panel title="🎛️ ארגז חול — התוחלת כנקודת איזון">
        <p className="mb-3 leading-relaxed text-slate-600">
          המשולש השחור יושב על <b>התוחלת</b> — נקודת האיזון של ההתפלגות; הפס הכתום מראה פיזור של{' '}
          <span dir="ltr"><Tex>{'\\pm\\sigma'}</Tex></span> (השונות). החליפו התפלגות ופרמטרים וראו איך שניהם זזים.
        </p>
        <MomentsExplorer />
      </Panel>
    </div>
  )
}
