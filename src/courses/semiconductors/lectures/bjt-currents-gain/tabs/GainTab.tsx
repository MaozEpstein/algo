import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import GainExplorer from '../components/GainExplorer'

/** Lecture 3ב — common-base α and common-emitter β, and the β explosion. */
export default function GainTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הגבר — α ו-β">
        <p className="leading-relaxed text-slate-700">
          הגבר ה<b>בסיס-המשותף</b> הוא <Tex>{'\\alpha=\\gamma b=I_C/I_E'}</Tex> (תמיד קצת קטן מ-1). הגבר ה<b>פולט-המשותף</b>{' '}
          הוא <Tex>{'\\beta=I_C/I_B=\\alpha/(1-\\alpha)'}</Tex>. גררו את <Tex>{'\\gamma'}</Tex> ו-<Tex>{'b'}</Tex> וראו כיצד <Tex>{'\\beta'}</Tex>{' '}
          <b>מתפוצץ</b> כשמתקרבים ל-<Tex>{'\\alpha=1'}</Tex>:
        </p>
        <div className="mt-3">
          <GainExplorer />
        </div>
      </Panel>

      <Panel title="האינטואיציה">
        <p className="leading-relaxed text-slate-600">
          <Tex>{'I_B=I_E-I_C=(1-\\alpha)I_E'}</Tex> הוא <b>ההפרש הקטן</b> בין שני זרמים גדולים כמעט-שווים. ככל ש-<Tex>{'\\alpha'}</Tex>{' '}
          קרוב יותר ל-1, ההפרש קטן יותר ו-<Tex>{'\\beta=I_C/I_B'}</Tex> גדול יותר. לכן <b>בסיס דק</b> ו<b>פולט מסומם-כבד</b> (שמקרבים את <Tex>{'\\alpha'}</Tex> ל-1) הם שנותנים <Tex>{'\\beta'}</Tex> גבוה.
        </p>
      </Panel>
    </div>
  )
}
