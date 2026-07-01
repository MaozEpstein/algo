import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import OutputCharChart from '../components/OutputCharChart'
import TransferChart from '../components/TransferChart'

/** Lesson 7א characteristics — the live output family I_DS–V_DS and the transfer curve I_DS–V_GS. */
export default function CharacteristicsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title={<>אופייני-מוצא <Tex>{'I_{DS}\\text{-}V_{DS}'}</Tex></>}>
        <p className="mb-2 leading-relaxed text-slate-700">
          לכל <Tex>{'V_{GS}'}</Tex> עקומה: עלייה לינארית (טריודה), ברך ב-<Tex>{'V_{DS,sat}=V_{GS}-V_T'}</Tex>, ואז מישור-רוויה.
          קו-המקווקו הוא <b>קו-הצביטה</b> שמחבר את כל הברכיים.
        </p>
        <OutputCharChart />
      </Panel>

      <Panel title={<>אופיין-העברה <Tex>{'I_{DS}\\text{-}V_{GS}'}</Tex> (ברוויה)</>}>
        <p className="mb-2 leading-relaxed text-slate-700">
          תלות הזרם-ברוויה במתח-השער: <b>חוק ריבועי</b> <Tex>{'I_{DS}=\\tfrac{k}{2}(V_{GS}-V_T)^2'}</Tex>. השיפוע בנקודת-העבודה
          הוא מוליכות-המעבר <Tex>{'g_m'}</Tex>.
        </p>
        <TransferChart />
      </Panel>
    </div>
  )
}
