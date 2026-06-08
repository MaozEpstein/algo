import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import EbersMollDiagram from '../components/EbersMollDiagram'

/** Lecture 3ב — the Ebers-Moll model. */
export default function EbersMollTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מודל Ebers-Moll — שתי דיודות שמתארות הכול">
        <p className="leading-relaxed text-slate-700">
          את שני צמתי-הטרנזיסטור אפשר לתאר כ<b>שתי דיודות מצומדות</b>: דיודת הפולט <Tex>{'D_E'}</Tex> ודיודת הקולט{' '}
          <Tex>{'D_C'}</Tex>. כל אחת מזריקה מטען, וחלקו <b>נאסף</b> בצומת השני — וזה מיוצג ב<b>מקורות-זרם תלויים</b>{' '}
          (<Tex>{'\\alpha_F I_F'}</Tex> אל הקולט, <Tex>{'\\alpha_R I_R'}</Tex> אל הפולט):
        </p>
        <div className="mt-3">
          <EbersMollDiagram />
        </div>
      </Panel>

      <Panel title="המודל משחזר את ארבעת המצבים">
        <p className="leading-relaxed text-slate-600">
          לפי הסימן של כל מתח (<Tex>{'V_{BE},V_{BC}'}</Tex>) המשוואות נותנות את הזרמים בכל מצב — <b>פעיל-קדמי</b>{' '}
          (<Tex>{'I_F'}</Tex> שולט), <b>רוויה</b> (שני הזרמים גדולים), <b>קטעון</b> (שניהם ≈0) ו<b>פעיל-הפוך</b> (<Tex>{'I_R'}</Tex> שולט).
          בפעיל-קדמי מתקבל שוב <Tex>{'I_C\\approx\\alpha_F I_E'}</Tex> — בעקביות עם כל מה שגזרנו.
        </p>
      </Panel>
    </div>
  )
}
