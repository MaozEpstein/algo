import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import EnrichmentBadge from '../../../components/EnrichmentBadge'
import MobilityChart from '../components/MobilityChart'

/** Lesson 7ב — mobility degradation in the linear region (surface scattering). */
export default function MobilityTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הדרדרות ניידות (Mobility Degradation)">
        <p className="leading-relaxed text-slate-700">
          בגזירה האידיאלית הנחנו ניידות <b>קבועה</b>. אבל מתח-שער גבוה יוצר <b>שדה אנכי</b> חזק שדוחף את נושאי-הערוץ
          אל שפת-האוקסיד — שם הם סובלים <b>פיזור-שטח</b> (surface scattering) שמוריד את הניידות. ככל ש-<Tex>{'V_{GS}'}</Tex> גדל,
          הניידות האפקטיבית <b>קטֵנה</b>:
        </p>
        <div className="my-3 rounded-xl border-2 border-violet-300 bg-white p-3 text-center">
          <Tex block>{'\\mu_{eff}=\\dfrac{\\mu_0}{1+\\theta\\,(V_{GS}-V_T)}'}</Tex>
        </div>
        <p className="text-sm text-slate-600">
          <Tex>{'\\theta'}</Tex> הוא מקדם-ההדרדרות. התוצאה: הזרם בתחום הלינארי (<Tex>{'I_{DS}=\\tfrac{W}{L}\\mu^*C_{ox}(V_{GS}-V_T)V_{DS}'}</Tex>)
          {' '}גדל <b>לאט יותר</b> מהצפוי עם מתח-השער.
        </p>
      </Panel>

      <Panel title="ראו בעיניים — נפילת הניידות">
        <MobilityChart />
      </Panel>

      <Panel title={<span className="inline-flex items-center gap-2">מודל חלופי <EnrichmentBadge /></span>}>
        <p className="leading-relaxed text-slate-700">
          Neamen מבטא את אותה פיזיקה כפונקציית-חזקה של השדה-האנכי האפקטיבי:
        </p>
        <div className="my-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
          <Tex block>{'\\mu_{eff}=\\mu_0\\left(\\dfrac{E_{eff}}{E_0}\\right)^{-1/3},\\quad E_{eff}=\\dfrac{1}{\\varepsilon_s}\\left(|Q_{D,max}|+\\tfrac{1}{2}Q_n\\right)'}</Tex>
        </div>
        <p className="text-sm text-slate-600">
          שני הביטויים מתארים את אותו אפקט — <b>מודל ה-<Tex>{'\\theta'}</Tex></b> (בו נשתמש) נוח יותר לחישובי-מעגל, ומודל ה-
          {' '}<Tex>{'-1/3'}</Tex> קרוב יותר למדידה. הליבה הנדרשת היא <b>הרעיון האיכותי</b>.
        </p>
      </Panel>
    </div>
  )
}
