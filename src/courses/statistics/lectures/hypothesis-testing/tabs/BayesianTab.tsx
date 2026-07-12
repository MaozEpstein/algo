import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const minErrProof: ComplexityProof = {
  result: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\ \\gtrless\\ \\tfrac{P(H_0)}{P(H_1)}',
  claimHe: 'המבחן שממזער את הסתברות השגיאה הכוללת הוא LRT שהסף שלו הוא יחס ההסתברויות המוקדמות.',
  steps: [
    { he: 'הסתברות השגיאה הכוללת:', tex: 'P(\\text{err})=P(R_0\\mid H_1)P(H_1)+P(R_1\\mid H_0)P(H_0)' },
    { he: 'ממזערים על אזור הדחייה R₁ — מכניסים כל x שבו התרומה ל-H₁ גדולה מזו ל-H₀:', tex: 'f(x;H_1)P(H_1)\\ >\\ f(x;H_0)P(H_0)' },
    { he: 'סידור מחדש נותן את ה-LRT עם סף המוקדמות:', tex: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\ \\gtrless\\ \\tfrac{P(H_0)}{P(H_1)}' },
  ],
  intuitionHe: 'זהו בדיוק כלל ה-MAP: בוחרים את ההשערה עם ה-posterior הגבוה יותר — בלי לכייל סף מ-α.',
}

/** Lesson 5 · Bayesian testing — priors, minimum error, MAP. */
export default function BayesianTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="כשיש הסתברויות מוקדמות">
        <p className="leading-relaxed text-slate-700">
          עד כה ההשערה הייתה <b>דטרמיניסטית לא-ידועה</b>, ולכן לא יכולנו למצע על "כמה סביר H₁". הגישה ה<b>בייסיאנית</b>
          מוסיפה <b>הסתברויות מוקדמות</b> <span dir="ltr"><Tex>{'P(H_0)=p,\\ P(H_1)=1-p'}</Tex></span> — ואז אפשר למזער ישירות את
          הסתברות השגיאה.
        </p>
      </Panel>

      <DefinitionCard
        kind="property"
        titleHe="הסתברות השגיאה"
        tex="P(\text{err})=P(x\in R_0\mid H_1)P(H_1)+P(x\in R_1\mid H_0)P(H_0)"
        meaningHe={'ממוצע משוקלל של שני סוגי השגיאה — <b>החמצה</b> (במשקל $P(H_1)$) ו<b>אזעקת שווא</b> (במשקל $P(H_0)$).'}
        example={<p>במצב "בייסיאני" בארגז החול זה בדיוק השטח הצבוע — והסף נבחר כדי למזער אותו.</p>}
      />

      <DefinitionCard
        kind="theorem"
        titleHe="כלל השגיאה המינימלית (MAP)"
        tex="T(x)=\dfrac{f(x;H_1)}{f(x;H_0)}\ \gtrless\ \dfrac{P(H_0)}{P(H_1)}"
        meaningHe={
          'אותו מבחן יחס נראות — אבל עכשיו <b>הסף נקבע מעצמו</b> מיחס המוקדמות, בלי צורך לבחור $\\alpha$. שקול לבחירת ' +
          'ההשערה עם ה-<b>posterior</b> הגבוה יותר.'
        }
        example={
          <p>
            בצורת posterior: <span dir="ltr"><Tex>{'\\dfrac{p(H_1\\mid x)}{p(H_0\\mid x)}=\\dfrac{f(x;H_1)P(H_1)}{f(x;H_0)P(H_0)}\\ \\gtrless\\ 1'}</Tex></span> — בוחרים
            את מה שיותר סביר בדיעבד.
          </p>
        }
        proof={minErrProof}
      />

      <Panel title="חיבור לשיעור 1 והרחבה">
        <div className="space-y-2 leading-relaxed text-slate-700">
          <p>
            <b>נזכרים בסיגמואיד:</b> בשיעור 1 ראינו את ערוץ התקשורת הבינארי, שם ה-posterior{' '}
            <span dir="ltr"><Tex>{'P(X{=}1\\mid y)'}</Tex></span> יצא בצורת סיגמואיד. זו בדיוק בדיקת השערות בייסיאנית — ההכרעה נקבעת מ-log יחס הנראות מול סף המוקדמות.
          </p>
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <b>הרחבה (מעבר לסיכום):</b> אם לשגיאות יש <b>עלויות</b> שונות <span dir="ltr"><Tex>{'C_{ij}'}</Tex></span> (למשל להחמיץ מטרה
            יקר יותר מאזעקת שווא), הסף פשוט מוכפל ביחס העלויות — <span dir="ltr"><Tex>{'T(x)\\gtrless\\tfrac{(C_{10}-C_{00})P(H_0)}{(C_{01}-C_{11})P(H_1)}'}</Tex></span>.
            הסיכום עצמו עוצר בכלל השגיאה המינימלית (עלויות שוות).
          </p>
        </div>
      </Panel>
    </div>
  )
}
