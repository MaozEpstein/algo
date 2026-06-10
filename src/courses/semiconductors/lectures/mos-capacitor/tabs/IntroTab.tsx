import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import MosStructure from '../components/MosStructure'

/** Lesson 6א — what the MOS capacitor is and why it matters. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו קבל MOS?">
        <p className="leading-relaxed text-slate-700">
          <b>קבל MOS</b> (Metal-Oxide-Semiconductor) הוא מבנה תלת-שכבתי: <b>מתכת</b> (השער) ← <b>תחמוצת מבודדת</b>
          (SiO₂) ← <b>מוליך-למחצה</b> (כאן p-type). זהו <b>הלב של ה-MOSFET</b> — אותו שער שמושך/דוחה נשאים
          בתעלה. הבנת הקבל הזה היא המפתח לכל ההתקן.
        </p>
        <div className="mt-3">
          <MosStructure />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          מפעילים מתח-שער <Tex>{'V_G'}</Tex> בין המתכת למצע. המתח <b>אינו מזרים זרם</b> (האוקסיד מבודד) — אלא
          <b> משנה את מצב המטען</b> בפני-השטח של המוליך-למחצה. כתלות ב-<Tex>{'V_G'}</Tex> נקבל שלושה משטרים:
          <b> הצטברות</b>, <b>דלדול</b> ו<b>היפוך</b>.
        </p>
      </Panel>

      <Panel title="מה נלמד בשיעור הזה">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li>קבל-MOS כ<b>קבל</b> — השוואה לקבל-לוחות (מבנה, מטען, שדה).</li>
          <li><b>דיאגרמת-הפסים</b>: פונקציות-העבודה, <Tex>{'\\phi_{MS}'}</Tex>, ומתח flat-band <Tex>{'V_{FB}'}</Tex>.</li>
          <li><b>שלושת המשטרים</b> — לכל אחד דיאגרמת-פסים, פרופיל-מטען וסכמת-שכבות.</li>
          <li><b>ארגז-חול אינטראקטיבי</b> — גוררים <Tex>{'V_G'}</Tex> ורואים הכול משתנה.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-500">(מתח-הסף <Tex>{'V_T'}</Tex>, אופיין ה-C-V ומטעני-האוקסיד — בחלק ב׳.)</p>
      </Panel>
    </div>
  )
}
