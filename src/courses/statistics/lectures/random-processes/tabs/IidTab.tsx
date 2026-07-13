import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import ProcessExplorer from '../../../viz/ProcessExplorer'

const countingProof: ComplexityProof = {
  result: 'E[X_n]=np,\\quad \\mathrm{Var}(X_n)=np(1-p)',
  claimHe: 'התהליך המונה Xₙ=ΣWᵢ מתפלג בינומית, ולכן תוחלתו np ושונותו np(1−p).',
  steps: [
    { he: 'סכום של n משתני ברנולי בלתי-תלויים:', tex: 'X_n=\\textstyle\\sum_{i=1}^{n}W_i\\sim\\mathrm{Bin}(n,p)' },
    { he: 'לינאריות התוחלת:', tex: 'E[X_n]=\\textstyle\\sum_i E[W_i]=n\\cdot p' },
    { he: 'שונות של סכום בלתי-תלויים:', tex: '\\mathrm{Var}(X_n)=\\textstyle\\sum_i \\mathrm{Var}(W_i)=n\\,p(1-p)' },
  ],
  intuitionHe: 'למרות שהוא בנוי מ-i.i.d, התהליך המונה עצמו <b>אינו</b> i.i.d — דגימות עוקבות קשורות (Xₙ=Xₙ₋₁+Wₙ), והשונות גדלה עם n.',
}

/** Lesson 10 · i.i.d processes — Bernoulli, counting, XOR + the ensemble sandbox. */
export default function IidTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        titleHe="תהליך i.i.d"
        tex="P(X_{i_1},\dots,X_{i_k})=\prod_{j=1}^{k}P(X_{i_j})"
        meaningHe={
          'תהליך הוא <b>i.i.d</b> אם (1) לכל הדגימות <b>אותה התפלגות שולית</b>, ו-(2) הן <b>בלתי-תלויות הדדית</b> ' +
          '(לא רק בזוגות!). אז ההתפלגות המשותפת היא <b>מכפלת השוליים</b>.'
        }
        example={
          <p>
            אזהרה: <b>אי-תלות בזוגות אינה גוררת אי-תלות הדדית</b>. i.i.d דורש את החזקה — כל תת-קבוצה מתפרקת למכפלה.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 32"
        kind="property"
        titleHe="ברנולי i.i.d"
        tex="W_n\sim\mathrm{Ber}(p):\ W_n=1\ \text{בהסת' } p,\ W_n=0\ \text{בהסת' } 1-p"
        meaningHe={'סדרת הטלות מטבע בלתי-תלויות. זהו התהליך ה-i.i.d הבסיסי ביותר — לבנת הבניין של המונה וה-XOR.'}
        example={
          <p>
            הסתברות משותפת של k דגימות: <span dir="ltr"><Tex>{'\\prod_{j=1}^{k}P(W_{i_j})'}</Tex></span> — מכפלה, בזכות אי-התלות ההדדית.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 33"
        kind="property"
        titleHe="התהליך המונה (Counting)"
        tex="X_n=\sum_{i=1}^{n}W_i=X_{n-1}+W_n,\quad X_n\sim\mathrm{Bin}(n,p)"
        meaningHe={
          'סכום רץ של הטלות ברנולי — "כמה הצלחות עד רגע n". זוהי גם ההגדרה של תהליך <b>אוטו-רגרסיבי</b> ' +
          '($X_n=X_{n-1}+W_n$). התהליך <b>לא</b> i.i.d, ולא-יורד.'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'E[X_n]=np'}</Tex></span>, <span dir="ltr"><Tex>{'\\mathrm{Var}(X_n)=np(1-p)'}</Tex></span>. אם{' '}
            <span dir="ltr"><Tex>{'p=0'}</Tex></span> או <span dir="ltr"><Tex>{'p=1'}</Tex></span> — השונות 0 (דטרמיניסטי).
          </p>
        }
        proof={countingProof}
      />

      <DefinitionCard
        n="דוגמה 34"
        kind="property"
        titleHe="תהליך XOR"
        tex="X_n=\mathrm{mod}_2\!\Big(\sum_{i=1}^{n}W_i\Big)=X_{n-1}\oplus W_n,\quad P(X_n{=}1)=\tfrac12\big[1-(1-2p)^n\big]"
        meaningHe={
          'זוגיות הסכום — "האם ראינו מספר אי-זוגי של הצלחות". השוליים <b>תלויים ב-n</b>, אלא אם $p=\\tfrac12$. ' +
          'זהו שרשרת מרקוב דו-מצבית.'
        }
        example={
          <p>
            אם <span dir="ltr"><Tex>{'p=\\tfrac12'}</Tex></span>: כל <span dir="ltr"><Tex>{'X_n\\sim\\mathrm{Ber}(\\tfrac12)'}</Tex></span> וכולם בלתי-תלויים — התהליך הופך ל-i.i.d.
            אחרת <span dir="ltr"><Tex>{'P(X_n{=}1)\\to\\tfrac12'}</Tex></span> כאשר <span dir="ltr"><Tex>{'n\\to\\infty'}</Tex></span> (נראה בלשונית סטציונריות).
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — אנסמבל מול מימוש">
        <p className="mb-3 leading-relaxed text-slate-600">
          בחרו תהליך וגררו את פרוסת הזמן <span dir="ltr"><Tex>{'t_0'}</Tex></span>: הקווים הירוקים הם <b>מימושים</b>, וההיסטוגרמה
          הסגולה היא ההתפלגות של המשתנה המקרי <span dir="ltr"><Tex>{'X(t_0)'}</Tex></span>. שימו לב איך אצל ה<b>מונה</b> הפיזור גדל עם הזמן,
          ואצל ה-<b>i.i.d</b> ההתפלגות זהה בכל רגע.
        </p>
        <ProcessExplorer />
      </Panel>
    </div>
  )
}
