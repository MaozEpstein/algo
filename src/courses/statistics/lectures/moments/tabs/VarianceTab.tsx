import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import CorrelationExplorer from '../../../viz/CorrelationExplorer'

const rhoProof: ComplexityProof = {
  result: '|\\rho|\\le 1',
  claimHe: 'מקדם המתאם תמיד חסום בין −1 ל-1.',
  steps: [
    { he: 'נסמן a=X−E[X], b=Y−E[Y]. אי-שוויון קושי-שוורץ:', tex: '|E[ab]|\\le\\sqrt{E[a^2]\\,E[b^2]}' },
    { he: 'זה בדיוק הקווריאנס והשונויות:', tex: '|\\sigma_{XY}|\\le \\sigma_X\\,\\sigma_Y' },
    { he: 'מחלקים ב-σ_Xσ_Y:', tex: '|\\rho|=\\frac{|\\sigma_{XY}|}{\\sigma_X\\sigma_Y}\\le 1' },
  ],
  intuitionHe: 'שוויון ρ=±1 מתקבל רק כשקיים קשר לינארי מדויק Y=aX+b — קורלציה מלאה.',
}

const psdProof: ComplexityProof = {
  result: 'C_x\\succeq 0',
  claimHe: 'מטריצת הקווריאנס תמיד סימטרית וחצי-מוגדרת חיובית.',
  steps: [
    { he: 'לכל וקטור z נסתכל על הצורה הריבועית:', tex: 'z^\\top C_x z=z^\\top E\\!\\big[(x-\\mu)(x-\\mu)^\\top\\big]z' },
    { he: 'מכניסים את z פנימה (התוחלת לינארית):', tex: '=E\\big[(z^\\top(x-\\mu))^2\\big]' },
    { he: 'תוחלת של ריבוע היא אי-שלילית:', tex: '\\ge 0' },
  ],
  intuitionHe: 'הצורה הריבועית היא תוחלת של גודל בריבוע — לכן לעולם לא שלילית.',
}

const gaussMomentsProof: ComplexityProof = {
  result: 'E[X]=m,\\ \\mathrm{Var}(X)=\\sigma^2',
  claimHe: 'טריק אלגנטי: במקום לחשב אינטגרלים ישירות, גוזרים את תנאי הנרמול לפי הפרמטרים.',
  steps: [
    { he: 'מתחילים מכך שהצפיפות הגאוסית מנורמלת:', tex: '\\int_{-\\infty}^{\\infty} \\tfrac{1}{\\sqrt{2\\pi\\sigma^2}}\\,e^{-\\frac{(x-m)^2}{2\\sigma^2}}\\,dx=1' },
    { he: 'גוזרים את שני האגפים לפי m (מתחת לאינטגרל):', tex: '\\int \\tfrac{(x-m)}{\\sigma^2}\\,f_X(x)\\,dx=0' },
    { he: 'מסדרים ומקבלים את התוחלת:', tex: '\\int x f_X\\,dx=m\\int f_X\\,dx=m\\;\\Rightarrow\\; E[X]=m' },
    { he: 'גזירה דומה לפי σ (על אותו תנאי נרמול) נותנת את השונות:', tex: 'E[(X-m)^2]=\\sigma^2' },
  ],
  intuitionHe: 'הפרמטרים m,σ² של הגאוסי הם בדיוק התוחלת והשונות — הגזירה חושפת זאת בלי אינטגרציה ישירה.',
}

const totalVarProof: ComplexityProof = {
  result: '\\mathrm{Var}(X)=E_Y[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}_Y(E[X\\mid Y])',
  claimHe: 'השונות מתפרקת ל"פיזור בתוך הקבוצות" ועוד "פיזור בין הקבוצות".',
  steps: [
    { he: 'מתחילים מהגדרת השונות:', tex: '\\mathrm{Var}(X)=E[X^2]-E^2[X]' },
    { he: 'לפי חוק התוחלת השלמה, E[X^2]=E_Y[E[X^2\\mid Y]], וכל תנאי מפרק ל-Var+ריבוע התוחלת:', tex: 'E[X^2\\mid Y]=\\mathrm{Var}(X\\mid Y)+E^2[X\\mid Y]' },
    { he: 'מסדרים את האיברים:', tex: '=E_Y[\\mathrm{Var}(X\\mid Y)]+\\big(E_Y[E^2[X\\mid Y]]-E^2[X]\\big)' },
    { he: 'האיבר השני הוא בדיוק השונות של התוחלת המותנית:', tex: '=E_Y[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}_Y(E[X\\mid Y])' },
  ],
  intuitionHe: 'שונות כוללת = ממוצע הפיזור בתוך כל תת-קבוצה + הפיזור של הממוצעים בין הקבוצות.',
}

/** Lesson 2 · Variance & correlation — spread, covariance, and the total-variance law. */
export default function VarianceTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="2.2"
        titleHe="שונות (מומנט שני מרכזי)"
        tex="\mathrm{Var}(X)=E\big[(X-E[X])^2\big]=E[X^2]-E^2[X]"
        meaningHe={
          'מדד ה<b>פיזור</b> — כמה רחוק בממוצע נופל $X$ מהתוחלת שלו, בריבוע. השורש שלה הוא <b>סטיית התקן</b> ' +
          '$\\sigma=\\sqrt{\\mathrm{Var}}$, באותן יחידות של $X$.'
        }
        example={
          <p>
            לפואסון <span dir="ltr"><Tex>{'\\mathrm{Pois}(\\lambda)'}</Tex></span>:{' '}
            <span dir="ltr"><Tex>{'E[X^2]=\\lambda+\\lambda^2'}</Tex></span>, ולכן{' '}
            <span dir="ltr"><Tex>{'\\mathrm{Var}=\\lambda+\\lambda^2-\\lambda^2=\\lambda'}</Tex></span> — התוחלת והשונות שוות.
          </p>
        }
      />

      <DefinitionCard
        n="משפט 2.2"
        kind="theorem"
        titleHe="שונות תחת שינוי סקאלה"
        tex="\mathrm{Var}(aX)=a^2\,\mathrm{Var}(X)"
        meaningHe={'מתיחה של $X$ בגורם $a$ מגדילה את השונות ב-$a^2$ (הריבוע!) — ואילו הזזה בקבוע לא משנה שונות כלל.'}
        example={<p>הכפלת משתנה פי 3 מכפילה את השונות פי 9, ואת סטיית התקן פי 3.</p>}
      />

      <DefinitionCard
        kind="property"
        titleHe="המומנטים של הגאוסי"
        tex="\begin{aligned} &E[X]=m,\quad \mathrm{Var}(X)=\sigma^2 \\ &E\big[(X-m)^{2k}\big]=(2k-1)!!\,\sigma^{2k},\quad E\big[(X-m)^{2k-1}\big]=0 \end{aligned}"
        meaningHe={
          'הפרמטרים $m,\\sigma^2$ של הגאוסי הם <b>בדיוק</b> התוחלת והשונות. יתר על כן, כל המומנטים המרכזיים ' +
          'ה<b>אי-זוגיים מתאפסים</b> (סימטריה סביב $m$), וה<b>זוגיים</b> נתונים בפקטוריאל הכפול ' +
          '$(2k-1)!!=1\\cdot3\\cdot5\\cdots(2k-1)$.'
        }
        example={
          <p>
            למשל <span dir="ltr"><Tex>{'E[(X-m)^4]=3\\sigma^4'}</Tex></span> — ולכן "עודף הגבנוניות" (kurtosis) של הגאוסי הוא 0,
            אמת-המידה שאליה משווים התפלגויות אחרות.
          </p>
        }
        proof={gaussMomentsProof}
        proofLabel="גזירת התוחלת והשונות"
      />

      <DefinitionCard
        n="2.3"
        titleHe="שונות משותפת ומתאם"
        tex="\sigma_{XY}=E\big[(X-E[X])(Y-E[Y])\big],\qquad \rho=\frac{\sigma_{XY}}{\sigma_X\,\sigma_Y}"
        meaningHe={
          'הקווריאנס מודד אם $X$ ו-$Y$ נוטים לעלות יחד. ה<b>מתאם</b> $\\rho$ הוא הגרסה המנורמלת שלו, בין $-1$ ל-$1$. ' +
          'שימו לב: $\\rho=0$ (לא-מתואמים) <b>חלש יותר</b> מאי-תלות, והוא מודד קשר <b>לינארי</b> בלבד — מתאם אינו סיבתיות.'
        }
        example={
          <p>
            אם <span dir="ltr"><Tex>{'Y=2X+1'}</Tex></span> אז <span dir="ltr"><Tex>{'\\rho=+1'}</Tex></span> (קשר לינארי מושלם);
            אם <span dir="ltr"><Tex>{'Y=X^2'}</Tex></span> עם $X$ סימטרי סביב 0 — <span dir="ltr"><Tex>{'\\rho=0'}</Tex></span> למרות תלות חזקה.
          </p>
        }
        proof={rhoProof}
        proofLabel="למה |ρ|≤1?"
      />

      <DefinitionCard
        n="2.4"
        titleHe="מטריצת הקווריאנס"
        tex="C_x=E\big[(x-\mu)(x-\mu)^\top\big]=E[xx^\top]-\mu\mu^\top"
        meaningHe={
          'כשיש וקטור משתנים, כל השונויות והקווריאנסים נאספים למטריצה אחת: על האלכסון שונויות, ומחוצה לו קווריאנסים. ' +
          'היא תמיד <b>סימטרית וחצי-מוגדרת חיובית</b>, ותחת טרנספורמציה לינארית $y=Ax+b$ מתקיים $C_y=A\\,C_x\\,A^\\top$.'
        }
        example={
          <p>
            אלכסון אפס-מחוץ-לאלכסון פירושו רכיבים לא-מתואמים; מטריצה <b>סינגולרית</b> מסמנת תלות לינארית בין הרכיבים.
          </p>
        }
        proof={psdProof}
        proofLabel="למה PSD?"
      />

      <DefinitionCard
        kind="property"
        titleHe="חוק השונות השלמה"
        tex="\mathrm{Var}(X)=E_Y\big[\mathrm{Var}(X\mid Y)\big]+\mathrm{Var}_Y\big(E[X\mid Y]\big)"
        meaningHe={
          'כשמפצלים אוכלוסייה לקבוצות (לפי $Y$), השונות הכוללת = <b>ממוצע השונויות בתוך</b> הקבוצות ' +
          '$+$ <b>פיזור הממוצעים בין</b> הקבוצות. כלי מפתח לאמידה ולמודלי-תערובת.'
        }
        example={
          <p>
            תערובת של <span dir="ltr"><Tex>{'N(5,2)'}</Tex></span> (במשקל 0.7) ו-<span dir="ltr"><Tex>{'N(3,1)'}</Tex></span> (0.3):
            {' '}<span dir="ltr"><Tex>{'\\mathrm{Var}=\\underbrace{1.7}_{\\text{בתוך}}+\\underbrace{0.84}_{\\text{בין}}=2.54'}</Tex></span> (ראו בתרגול).
          </p>
        }
        proof={totalVarProof}
      />

      <Panel title="🎛️ ארגז חול — מתאם = ניבוי">
        <p className="mb-3 leading-relaxed text-slate-600">
          מתאם הוא <b>כמה טוב אפשר לנחש את Y מתוך X</b>. גררו את <span dir="ltr"><Tex>{'\\rho'}</Tex></span> וראו איך
          קו-הניבוי <span dir="ltr"><Tex>{'\\hat Y=\\rho x'}</Tex></span> משתפל, ופס אי-הוודאות שנותרה{' '}
          <span dir="ltr"><Tex>{'\\pm\\sqrt{1-\\rho^2}'}</Tex></span> מצטמצם — עד שב-<span dir="ltr"><Tex>{'|\\rho|=1'}</Tex></span>{' '}
          הניבוי מדויק. מצב <b>"פרסה"</b> מראה שמתאם תופס רק קשר <b>לינארי</b>.
        </p>
        <CorrelationExplorer />
      </Panel>
    </div>
  )
}
