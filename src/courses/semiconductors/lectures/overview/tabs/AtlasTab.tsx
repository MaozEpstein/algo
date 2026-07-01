import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import AtlasTile from '../components/AtlasTile'
import RecitationBandDiagram from '../../pn-junction-equilibrium/components/RecitationBandDiagram'
import MsmBandDiagram from '../../schottky-diode/components/MsmBandDiagram'
import BjtBandDiagram from '../../bjt-structure/components/BjtBandDiagram'
import MosBandDiagram from '../../mos-capacitor/components/MosBandDiagram'

/** Overview · Atlas — every band diagram in the course in one gallery, each with an equilibrium/bias
 *  (or regime) toggle and a deep-link. Band diagrams are the shared visual language of the course. */
export default function AtlasTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אטלס דיאגרמות-פסים">
        <p className="leading-relaxed text-slate-700">
          דיאגרמת-הפסים היא <b>שפת-העל הוויזואלית</b> של הקורס: כל התקן מסופר דרך <Tex>{'E_c,\\,E_v,\\,E_F'}</Tex>
          {' '}וכיפוף-הפסים. כאן כולן במקום אחד — החליפו בין <b>שיווי-משקל</b> ל<b>ממתח</b> וראו איך אותו רעיון
          (יישור <Tex>{'E_F'}</Tex> ← כיפוף-פסים ← מחסום) חוזר בכל מבנה.
        </p>
      </Panel>

      <Panel title="צמתים">
        <div className="grid gap-4 lg:grid-cols-2">
          <AtlasTile
            title="צומת PN"
            lectureId="pn-junction-equilibrium"
            caption="יישור $E_F$ יוצר כיפוף-פסים $qV_{bi}$; בממתח-אחורי רמות-הפרמי הקוואזי נפרדות ב-$qV_R$."
            views={[
              { label: 'שיווי-משקל', node: <RecitationBandDiagram mode="equilibrium" /> },
              { label: 'ממתח אחורי', node: <RecitationBandDiagram mode="reverse" /> },
            ]}
          />
          <AtlasTile
            title="מתכת–מל״מ (שוטקי, MSM)"
            lectureId="schottky-diode"
            tab="bands"
            caption="מחסום שוטקי $\varphi_B$ קבוע מצד-המתכת; ממתח מזיז את הצד המל״מי ($E_F$ נפרד, כיפוף אסימטרי)."
            views={[
              { label: 'שיווי-משקל', node: <MsmBandDiagram mode="eq" /> },
              { label: 'ממתח', node: <MsmBandDiagram mode="bias" /> },
            ]}
          />
        </div>
      </Panel>

      <Panel title="התקנים">
        <div className="grid gap-4 lg:grid-cols-2">
          <AtlasTile
            title="BJT — לאורך E-B-C"
            lectureId="bjt-structure"
            caption="שני מחסומים מעל הבסיס-p; במצב פעיל-קדמי מחסום ה-B-E מונמך → הזרקה, וה-C-B מושך את הנושאים במורד."
            views={[
              { label: 'שיווי-משקל', node: <BjtBandDiagram mode="eq" /> },
              { label: 'פעיל-קדמי', node: <BjtBandDiagram mode="active" /> },
            ]}
          />
          <AtlasTile
            title="קבל MOS — שלושת המשטרים"
            lectureId="mos-capacitor"
            caption="כיפוף-הפסים בפני-השטח ($q\psi_s$) קובע את המשטר: הצטברות, מחסור, או היפוך (יצירת ערוץ)."
            views={[
              { label: 'הצטברות', node: <MosBandDiagram regime="accumulation" /> },
              { label: 'מחסור', node: <MosBandDiagram regime="depletion" /> },
              { label: 'היפוך', node: <MosBandDiagram regime="inversion" /> },
            ]}
          />
        </div>
      </Panel>
    </div>
  )
}
