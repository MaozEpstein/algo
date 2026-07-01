import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import ChannelDiagram from '../components/ChannelDiagram'

/** Lesson 7א operation — channel formation, the taper along the channel, and pinch-off → saturation. */
export default function OperationTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הפעלה — היווצרות הערוץ ושליטת השער">
        <p className="leading-relaxed text-slate-700">
          מעל הסף (<Tex>{'V_{GS}>V_T'}</Tex>) השער מושך אלקטרונים לפני-השטח ויוצר <b>ערוץ</b> בין המקור לניקוז.
          מתח-ניקוז חיובי <Tex>{'V_{DS}'}</Tex> מסיע את האלקטרונים מהמקור לניקוז — זהו זרם ה-<Tex>{'I_{DS}'}</Tex>.
          שחקו עם המחוונים כדי לראות איך הערוץ <b>מתדקדק לכיוון הניקוז</b> ובסוף <b>נצבט</b>.
        </p>
        <ChannelDiagram />
      </Panel>

      <Panel title="המפתח: עודף-המתח יורד לאורך הערוץ">
        <div className="rounded-2xl border-s-4 border-emerald-500 bg-emerald-50/60 p-4 leading-relaxed text-slate-700">
          <p>
            לאורך הערוץ הפוטנציאל <Tex>{'V(y)'}</Tex> עולה מ-0 במקור עד <Tex>{'V_{DS}'}</Tex> בניקוז. לכן <b>עודף-המתח
            המקומי</b> שמייצר את המטען הוא <Tex>{'V_{GS}-V_T-V(y)'}</Tex> — <b>מרבי במקור, מזערי בניקוז</b>:
          </p>
          <div className="my-3 rounded-xl border-2 border-emerald-300 bg-white p-3 text-center">
            <Tex block>{'Q_{inv}(y)=-C_{ox}\\big[V_{GS}-V_T-V(y)\\big]'}</Tex>
          </div>
          <p className="text-sm text-slate-600">
            לכן צפיפות-המטען יורדת מהמקור לניקוז, והערוץ נראה <b>מתדקדק</b>. כאן טמון כל ההסבר להיווצרות הרוויה.
          </p>
        </div>
      </Panel>

      <Panel title="צביטה (Pinch-off) → רוויה">
        <p className="leading-relaxed text-slate-700">
          כאשר <Tex>{'V_{DS}'}</Tex> מגיע ל-<Tex>{'V_{DS,sat}=V_{GS}-V_T'}</Tex>, עודף-המתח בקצה-הניקוז מתאפס —
          <Tex>{'\\,Q_{inv}\\to0'}</Tex> שם, והערוץ <b>נצבט</b>. מעבר לכך, העודף <Tex>{'V_{DS}-V_{DS,sat}'}</Tex> נופל על
          <b>אזור-מחסור קצר</b> ליד הניקוז, ואילו המתח על הערוץ המוליך נשאר <Tex>{'\\approx V_{DS,sat}'}</Tex> — לכן הזרם
          <b>כמעט אינו משתנה</b>: זו הרוויה.
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <Tex>{'V_{GS}>V_T'}</Tex>, body: 'נוצר ערוץ מוליך' },
            { title: <><Tex>{'V_{DS}'}</Tex> קטן</>, body: 'ערוץ פתוח לכל האורך — טריודה (לינארי)' },
            { title: <><Tex>{'V_{DS}=V_{DS,sat}'}</Tex></>, body: 'צביטה בקצה-הניקוז' },
          ]}
          outcome={{ label: 'רוויה', sub: <>הזרם כמעט קבוע ב-<Tex>{'\\tfrac{k}{2}(V_{GS}-V_T)^2'}</Tex></> }}
        />
      </Panel>
    </div>
  )
}
