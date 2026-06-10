import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import MosSandbox from '../components/MosSandbox'

/** Lesson 6א — interactive MOS-capacitor sandbox. */
export default function SandboxTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארגז-חול: קבל MOS חי">
        <p className="mb-1 leading-relaxed text-slate-700">
          גררו את <Tex>{'V_G'}</Tex> וצפו ב<b>שלושת התרשימים מתעדכנים יחד</b>: סכמת-השכבות, דיאגרמת-הפסים וצפיפות-המטען.
          קו-המספרים מראה היכן יושבים <Tex>{'V_{FB}'}</Tex> ו-<Tex>{'V_T'}</Tex> ובאיזה משטר אתם. שנו גם את הסימום
          <Tex>{'\\,N_A'}</Tex> ואת עובי-האוקסיד <Tex>{'t_{ox}'}</Tex> וראו כיצד <Tex>{'V_T'}</Tex> זז.
        </p>
        <div className="mt-3">
          <MosSandbox />
        </div>
      </Panel>

      <Panel title="מה כדאי לשים לב">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li>מתחת ל-<Tex>{'V_{FB}'}</Tex> — <b>הצטברות</b>: הפסים מתכופפים מעלה, חורים נצברים.</li>
          <li>בין <Tex>{'V_{FB}'}</Tex> ל-<Tex>{'V_T'}</Tex> — <b>דלדול</b>: רוחב-הדלדול <Tex>{'W'}</Tex> ופוטנציאל-השטח <Tex>{'\\psi_s'}</Tex> גדלים.</li>
          <li>מעל <Tex>{'V_T'}</Tex> — <b>היפוך</b>: <Tex>{'\\psi_s'}</Tex> ננעל על <Tex>{'2\\phi_F'}</Tex>, ונוצר ערוץ אלקטרונים.</li>
          <li>אוקסיד דק יותר / סימום גבוה יותר → <Tex>{'V_T'}</Tex> משתנה — נסו.</li>
        </ul>
      </Panel>
    </div>
  )
}
