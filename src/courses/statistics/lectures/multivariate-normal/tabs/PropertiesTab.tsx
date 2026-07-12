import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import DefinitionCard from '../../../components/DefinitionCard'

const affineProof: ComplexityProof = {
  result: 'y=Ax+b\\sim N(Am+b,\\,ACA^\\top)',
  claimHe: 'טרנספורם אפיני של MVN הוא שוב MVN.',
  steps: [
    { he: 'לפי ההגדרה צריך להראות שכל צירוף לינארי a^⊤y הוא גאוסי:', tex: 'a^\\top y=(A^\\top a)^\\top x + a^\\top b' },
    { he: 'זהו צירוף לינארי של x (שהוא MVN) ועוד קבוע — לכן גאוסי, אז y הוא MVN.', tex: '' },
    { he: 'התוחלת והקווריאנס מתקבלים ישירות:', tex: 'E[y]=Am+b,\\qquad \\mathrm{Cov}(y)=ACA^\\top' },
  ],
  intuitionHe: 'הלינאריות היא הלב: היא לעולם לא מוציאה אותנו מהמשפחה הגאוסית.',
}

const whitenProof: ComplexityProof = {
  result: 'x=Az+b,\\ z\\sim N(0,I),\\ AA^\\top=C',
  claimHe: 'כל MVN אפשר לייצר מגאוסי סטנדרטי ("צביעה"), ולהפך — להלבין אותו בחזרה ל-N(0,I).',
  steps: [
    { he: 'למטריצת קווריאנס (PSD) תמיד יש "שורש" — למשל דרך פירוק עצמי C=UDUᵀ:', tex: 'A=U D^{1/2}U^\\top=C^{1/2},\\quad AA^\\top=C' },
    { he: 'אז x=Az+b הוא MVN עם קווריאנס:', tex: '\\mathrm{Cov}(x)=A\\,I\\,A^\\top=C' },
    { he: 'ההפך — "הלבנה" (whitening):', tex: 'z=A^{-1}(x-b)=C^{-1/2}(x-m)\\sim N(0,I)' },
  ],
  intuitionHe: 'A מסובב ומותח את הענן העגול לאליפסה; ההופכי מיישר אותו בחזרה למעגל של רכיבים בלתי-תלויים.',
}

const indepProof: ComplexityProof = {
  result: 'C\\ \\text{אלכסונית}\\iff\\ \\text{אי-תלות}',
  claimHe: 'בנורמלי המשותף, אי-מתאם שקול לאי-תלות — בניגוד למקרה הכללי.',
  steps: [
    { he: 'אם C אלכסונית, המעריך מתפרק לסכום:', tex: '(x-m)^\\top C^{-1}(x-m)=\\sum_i \\tfrac{(x_i-m_i)^2}{\\sigma_i^2}' },
    { he: 'ולכן הצפיפות מתפרקת למכפלת שוליים:', tex: 'f_x(x)=\\prod_i \\tfrac{1}{\\sqrt{2\\pi}\\,\\sigma_i}\\,e^{-\\frac{(x_i-m_i)^2}{2\\sigma_i^2}}' },
    { he: 'מכפלת שוליים = אי-תלות סטטיסטית.', tex: '' },
  ],
  intuitionHe: 'רק בגאוסי המשותף "אין מתאם" מספיק לאי-תלות; בכללי (למשל Y=SX) זה נכשל.',
}

/** Lesson 4 · Properties — affine, whitening, uncorrelated⇔independent, sphere, counterexample. */
export default function PropertiesTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 4.2"
        kind="theorem"
        titleHe="טרנספורם אפיני"
        tex="x\sim N(m,C)\ \Rightarrow\ y=Ax+b\sim N(Am+b,\ ACA^\top)"
        meaningHe={'מתיחה, סיבוב והזזה של גאוסי נותנים <b>שוב גאוסי</b>. התוחלת עוברת דרך $A$ וההזזה $b$; הקווריאנס משתנה ל-$ACA^\\top$ (וההזזה לא משפיעה עליו).'}
        example={<p>סכום רכיבים <span dir="ltr"><Tex>{'a^\\top x'}</Tex></span> הוא מקרה פרטי — תמיד גאוסי חד-ממדי.</p>}
        proof={affineProof}
      />

      <DefinitionCard
        n="משפט 4.3"
        kind="theorem"
        titleHe="הלבנה וצביעה (Whitening/Colorization)"
        tex="x=Az+b,\quad z\sim N(0,I),\quad AA^\top=C"
        meaningHe={
          'כל גאוסי אפשר לייצר מ<b>גאוסי סטנדרטי</b> (עגול) ע״י "צביעה" ב-$A$, ולהפך — <b>להלבין</b> אותו בחזרה לרכיבים ' +
          'בלתי-תלויים ב-$z=C^{-1/2}(x-m)$. זהו הבסיס לדה-קורלציה ולסימולציה של גאוסים.'
        }
        example={
          <p>
            הצירים הסגולים בארגז החול הם בדיוק הכיוונים הראשיים (הווקטורים העצמיים של <span dir="ltr"><Tex>{'C'}</Tex></span>) —
            הכיוונים שבהם הגאוסי "מתלבן".
          </p>
        }
        proof={whitenProof}
      />

      <DefinitionCard
        n="משפט 4.5"
        kind="theorem"
        titleHe="אי-מתאם ⇔ אי-תלות (בגאוסי)"
        tex="x\ \text{MVN}:\quad C\ \text{אלכסונית}\iff x_i\ \text{בלתי-תלויים}"
        meaningHe={'זו התכונה המיוחדת של הגאוסי: כאן <b>אי-מתאם גורר אי-תלות</b>. בכל התפלגות אחרת אי-מתאם חלש יותר מאי-תלות.'}
        example={
          <p>
            שני רכיבי גאוסי עם <span dir="ltr"><Tex>{'\\rho=0'}</Tex></span> הם ממש בלתי-תלויים — ראו שהאליפסה בארגז החול הופכת
            מיושרת-לצירים.
          </p>
        }
        proof={indepProof}
      />

      <DefinitionCard
        n="משפט 4.7"
        kind="property"
        titleHe="ריכוז על הספירה"
        tex="x\sim N(0,I_d)\ \Rightarrow\ \|x\|^2\sim \chi^2_d"
        meaningHe={
          'הנורמה-בריבוע של גאוסי סטנדרטי $d$-ממדי מתפלגת <b>כי-בריבוע</b> עם $d$ דרגות חופש. בממדים גבוהים הגאוסי ' +
          '"מתרכז" על מעטפת כדור ברדיוס $\\sqrt d$ — תופעה חשובה ב-ML.'
        }
        example={
          <p>
            הרחבה של <span dir="ltr"><Tex>{'X^2\\sim\\chi^2_{(1)}'}</Tex></span> משיעור 3 — עכשיו סכום של <span dir="ltr"><Tex>{'d'}</Tex></span> ריבועים.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 19"
        kind="property"
        titleHe="דוגמה נגדית — Y=SX"
        tex="X\sim N(0,1),\ S=\pm1\ (\text{שווה}),\ Y=SX"
        meaningHe={
          'שני המשתנים <b>שוליים גאוסיים</b> $N(0,1)$, והם <b>לא-מתואמים</b>: $\\mathrm{Cov}(X,Y)=E[S]E[X^2]=0$. ובכל זאת הם ' +
          '<b>תלויים</b> ו<b>לא</b> נורמליים במשותף! מסקנה: שוליים גאוסיים + אי-מתאם אינם מספיקים ל-MVN.'
        }
        example={
          <p>
            הפעילו את מצב <b>"דוגמה נגדית"</b> בארגז החול: הענן הוא <b>"X"</b> (שני קווים) — לא אליפסה — למרות ששני השוליים פעמונים.
          </p>
        }
      />
    </div>
  )
}
