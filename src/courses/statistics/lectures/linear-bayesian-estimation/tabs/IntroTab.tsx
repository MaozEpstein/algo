import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

/** Lesson 9 · Intro — why restrict to a linear (affine) estimator. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="הבעיה עם ה-MMSE המלא">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            בשיעור 8 ראינו שהאמד האופטימלי לעלות ריבועית הוא התוחלת המותנית{' '}
            <span dir="ltr"><Tex>{'\\hat x_{MMSE}=E[X\\mid Y=y]'}</Tex></span>. יפה — אבל כדי לחשב אותו צריך את{' '}
            <b>ההתפלגות המשותפת המלאה</b>, והאינטגרל לרוב לא סגור. בפועל יש לנו לעיתים קרובות רק{' '}
            <b>מומנטים מסדר ראשון ושני</b> (תוחלות וקווריאנסים).
          </p>
          <p>
            הרעיון: נצמצם את החיפוש ל<b>אמד לינארי (אפיני)</b> בלבד, <span dir="ltr"><Tex>{'\\hat x(y)=Ay+b'}</Tex></span>,
            ונמצא את הטוב ביותר בתוך המשפחה הזו. זהו ה-<b>LMMSE</b> (או <b>BLE</b> — Best Linear Estimator).
          </p>
        </div>
      </Panel>

      <DefinitionCard
        titleHe="למה דווקא לינארי?"
        tex="\hat x(y)=a^\top y\quad(\text{או אפיני } Ay+b)"
        meaningHe={
          'מגבילים את האמד להיות <b>שילוב לינארי של המדידות</b>. שלוש סיבות: (1) <b>פשוט לחשב</b> — נוסחה סגורה; ' +
          '(2) <b>פשוט לממש</b> — מכפלה מטריצית; (3) דורש <b>רק סטטיסטיקה מסדר שני</b> ($\\mu$ ו-$C$), שקל להעריך מנתונים.'
        }
        example={
          <p>
            במקום להכיר את כל <span dir="ltr"><Tex>{'f(x,y)'}</Tex></span>, מספיקות התוחלות והקווריאנסים{' '}
            <span dir="ltr"><Tex>{'\\mu_x,\\mu_y,C_{xy},C_{yy}'}</Tex></span> — וזהו.
          </p>
        }
      />

      <Panel title="המסלול">
        <p className="leading-relaxed text-slate-600">
          קודם ה<b>נוסחה הסגורה</b> וה<b>משוואה הנורמלית</b> עם <b>עקרון האורתוגונליות</b>; אחר-כך ה<b>מקרה הגאוסי</b>{' '}
          שבו LMMSE=MMSE (ושילוב שני חיישנים); ולבסוף <b>מעבר ללינארי</b> — הדוגמה <span dir="ltr"><Tex>{'Y=X^3'}</Tex></span>{' '}
          שבה השניים נבדלים, והקשר לרשתות עמוקות.
        </p>
      </Panel>
    </div>
  )
}
