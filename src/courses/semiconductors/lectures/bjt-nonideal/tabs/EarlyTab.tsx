import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import EarlyOutput from '../components/EarlyOutput'

/** Lecture 3ג — the Early effect (base-width modulation). */
export default function EarlyTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אפקט Early — אפנון רוחב-הבסיס">
        <p className="leading-relaxed text-slate-700">
          האזור הפעיל אינו שטוח באמת. כשמגדילים את <Tex>{'V_{CE}'}</Tex>, אזור-המחסור ב-C-B מתרחב אל תוך הבסיס,
          רוחב-הבסיס האפקטיבי <Tex>{'W_B'}</Tex> מצטמצם, השיפוע של פרופיל-המיעוט תלול יותר — ולכן <Tex>{'I_C'}</Tex> עולה מעט.
          קווי האזור-הפעיל, אם מאריכים אותם אחורה, נחתכים כולם בנקודה אחת: <Tex>{'-V_A'}</Tex> (מתח Early). גררו:
        </p>
        <div className="mt-3">
          <EarlyOutput />
        </div>
      </Panel>

      <Panel title="המשמעות המעגלית">
        <p className="leading-relaxed text-slate-600">
          השיפוע נותן <b>התנגדות-מוצא סופית</b> <Tex>{'r_o=V_A/I_C'}</Tex> — הטרנזיסטור אינו מקור-זרם מושלם. <Tex>{'V_A'}</Tex> גבוה
          (בסיס רחב/מסומם יותר) ⇐ <Tex>{'r_o'}</Tex> גבוה ⇐ הגבר-מתח טוב יותר. זהו ה-<Tex>{'r_o'}</Tex> שיופיע במודל אות-הקטן.
        </p>
      </Panel>
    </div>
  )
}
