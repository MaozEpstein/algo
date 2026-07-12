import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import BiasVarianceExplorer from '../../../viz/BiasVarianceExplorer'

const decompProof: ComplexityProof = {
  result: '\\mathrm{MSE}(\\theta)=\\mathrm{bias}^2(\\theta)+\\mathrm{var}(\\theta)',
  claimHe: 'שגיאת הריבוע הממוצעת מתפרקת להטיה בריבוע ועוד שונות (משפט 6.1).',
  steps: [
    { he: 'מהגדרת השונות של השגיאה E=θ̂−θ:', tex: '\\mathrm{var}=E[(E-E[E])^2]=E[E^2]-E^2[E]' },
    { he: 'אבל E[E²]=MSE ו-E[E]=bias, ולכן:', tex: '\\mathrm{var}=\\mathrm{MSE}-\\mathrm{bias}^2' },
    { he: 'מסדרים מחדש:', tex: '\\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{var}' },
  ],
  intuitionHe: 'אמד טוב חייב גם להיות "ממוקם נכון" (הטיה קטנה) וגם "יציב" (שונות קטנה) — אי אפשר להזניח אף אחד.',
}

/** Lesson 6 · Bias, variance, MSE — the framework for judging an estimator. */
export default function BiasVarianceTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        titleHe="הטיה ושונות"
        tex="\mathrm{bias}(\theta)=E[\hat\theta]-\theta,\qquad \mathrm{var}(\theta)=E\big[(E-E[E])^2\big]"
        meaningHe={
          'ה<b>הטיה</b> מודדת עד כמה האמד "מפספס" בממוצע; ה<b>שונות</b> עד כמה הוא "רועד" סביב הממוצע שלו. שני מדדים ' +
          'שונים לגמרי — אמד יכול להיות מדויק בממוצע אבל תנודתי, או יציב אבל מוטה.'
        }
        example={
          <p>
            אמד <b>לא-מוטה</b> (<span dir="ltr"><Tex>{'\\mathrm{bias}=0'}</Tex></span>) פוגע במרכז בממוצע; זה לא אומר שכל אמידה בודדת קרובה.
          </p>
        }
      />

      <DefinitionCard
        n="משפט 6.1"
        kind="theorem"
        titleHe="פירוק הטיה-שונות של ה-MSE"
        tex="\mathrm{MSE}(\theta)=E[E^2]=\mathrm{bias}^2(\theta)+\mathrm{var}(\theta)"
        meaningHe={
          'ה-<b>MSE</b> — התוחלת של השגיאה בריבוע — היא המדד המרכזי, והיא מתפרקת בדיוק ל<b>הטיה בריבוע</b> ועוד ' +
          '<b>שונות</b>. מזעור ה-MSE שוקל את שניהם יחד.'
        }
        example={
          <p>
            לפעמים כדאי "לשלם" קצת הטיה תמורת שונות קטנה בהרבה — וזה מה שראינו בארגז החול (אמד מכווץ).
          </p>
        }
        proof={decompProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="לא-מוטה ועקביות"
        tex="\text{לא-מוטה}:\ \mathrm{bias}=0\qquad \text{עקבי}:\ \hat\theta_N\xrightarrow{\ p\ }\theta"
        meaningHe={
          'אמד <b>לא-מוטה</b> אם הטייתו אפס לכל $\\theta$. אמד <b>עקבי</b> אם הוא <b>מתכנס</b> לערך האמיתי כשמספר הדגימות ' +
          'גדל. תנאי מספיק לעקביות: גם ההטיה וגם השונות שואפות ל-0.'
        }
        example={
          <p>
            ממוצע המדגם של <span dir="ltr"><Tex>{'N(\\mu,\\sigma^2)'}</Tex></span> לא-מוטה ובעל שונות <span dir="ltr"><Tex>{'\\sigma^2/N\\to0'}</Tex></span> — לכן עקבי.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — התפלגות הדגימה של אמד">
        <p className="mb-3 leading-relaxed text-slate-600">
          אומדים <span dir="ltr"><Tex>{'\\mu'}</Tex></span> שוב ושוב ומציירים את <b>התפלגות האומדים</b>. הפער בין מרכז ההיסטוגרמה
          (כתום) ל-<span dir="ltr"><Tex>{'\\mu'}</Tex></span> האמיתי (כחול) הוא ההטיה; הרוחב הוא השונות; ו-<span dir="ltr"><Tex>{'\\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{var}'}</Tex></span>.
          הגדילו את <span dir="ltr"><Tex>{'N'}</Tex></span> וראו התכנסות (עקביות).
        </p>
        <BiasVarianceExplorer />
      </Panel>
    </div>
  )
}
