import type { ComplexityProof } from '@/core/engine/types'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import MeanVsMedian from '../../../viz/MeanVsMedian'

const medianProof: ComplexityProof = {
  result: '\\hat\\theta=\\mathrm{median}(y)',
  claimHe: 'תחת רעש לפלס, אמד הנראות המרבית של פרמטר-מיקום הוא החציון.',
  steps: [
    { he: 'רעש לפלס f(nᵢ)=½e^{−|nᵢ|} נותן log-נראות שהיא סכום ערכים מוחלטים:', tex: '\\hat\\theta=\\arg\\min_\\theta\\sum_i|y_i-\\theta|' },
    { he: 'גוזרים (הנגזרת של |·| היא sign):', tex: '\\sum_i \\mathrm{sign}(y_i-\\theta)=0' },
    { he: 'האיזון בין מספר הנקודות משני הצדדים נותן את החציון:', tex: '\\hat\\theta=\\mathrm{median}(y)' },
  ],
  intuitionHe: 'החציון "מאזן ספירה" ולא "מאזן מסה" — ולכן חריג אחד לא מזיז אותו, בניגוד לממוצע.',
}

/** Lesson 7 · Robust least squares — L1, the median, and outlier robustness. */
export default function RobustTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="כשהרעש אינו גאוסי">
        <p className="leading-relaxed text-slate-700">
          "לריבועים פחותים לא באמת צריך סטטיסטיקה — זו אלגברה לינארית." הכוח האמיתי של הנראות המרבית מתגלה כשהרעש{' '}
          <b>אינו גאוסי</b>. למשל, כשיש <b>חריגים</b> בודדים (sparse outliers), <b>רעש לפלס</b> מתאים יותר מגאוסי —
          וההכרעה משתנה מ<b>ממוצע</b> ל<b>חציון</b>.
        </p>
      </Panel>

      <DefinitionCard
        n="7.6"
        kind="property"
        titleHe="ריבועים חסינים — L1 והחציון"
        tex="n\sim\text{Laplace}:\ \ \hat\theta=\arg\min_\theta\sum_i|y_i-\theta|\ =\ \mathrm{median}(y)"
        meaningHe={
          'רעש <b>גאוסי</b> → מזעור $\\|\\cdot\\|_2^2$ → <b>ממוצע</b> (L2). רעש <b>לפלס</b> → מזעור $\\|\\cdot\\|_1$ (סכום ערכים מוחלטים) → ' +
          '<b>חציון</b> (L1). ה-L1 <b>חסין לחריגים</b> כי הוא לא מעניש מרחקים גדולים בריבוע.'
        }
        example={
          <p>
            שכר חציוני מול שכר ממוצע: מיליארדר בודד מקפיץ את הממוצע אבל כמעט לא נוגע בחציון.
          </p>
        }
        proof={medianProof}
      />

      <Panel title="🎛️ ארגז חול — ממוצע (L2) מול חציון (L1)">
        <p className="mb-3 leading-relaxed text-slate-600">
          הוסיפו <b>חריג</b> וראו: ה<b>ממוצע</b> (כחול) נגרר לעברו, אבל ה<b>חציון</b> (ירוק) נשאר במקומו. זו בדיוק
          החסינות של L1 — ואותה תופעה מטה את קו ה-LS בארגז החול של המשוואות הנורמליות.
        </p>
        <MeanVsMedian />
      </Panel>
    </div>
  )
}
