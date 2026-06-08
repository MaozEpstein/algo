import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import BreakdownPlot from '../components/BreakdownPlot'

/** Lecture 3ג — breakdown: BV_CBO vs BV_CEO and avalanche. */
export default function BreakdownTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="פריצה — מתי הטרנזיסטור 'נשבר'">
        <p className="leading-relaxed text-slate-700">
          ב-<Tex>{'V_{CE}'}</Tex> גבוה צומת ה-C-B (האחורי) פורץ. בבסיס משותף זה קורה ב-<Tex>{'BV_{CBO}'}</Tex>, אבל
          ב<b>פולט משותף</b> הטרנזיסטור פורץ ב-מתח <b>נמוך יותר</b>, <Tex>{'BV_{CEO}=BV_{CBO}/\\beta^{1/n}'}</Tex> — כי ההגבר
          מכפיל את נושאי-המפולת. גררו את <Tex>{'\\beta'}</Tex> וראו את <Tex>{'BV_{CEO}'}</Tex> זז:
        </p>
        <div className="mt-3">
          <BreakdownPlot />
        </div>
      </Panel>
    </div>
  )
}
