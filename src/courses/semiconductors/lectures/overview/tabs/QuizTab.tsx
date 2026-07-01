import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import QuizEngine from '../components/QuizEngine'
import { QUIZ } from '../data/quiz'

/** Overview · Quiz — an interactive, scored cross-cutting quiz that tests the bridges between lessons. */
export default function QuizTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="אתגר סינתזה — בדקו את הגשרים בין השיעורים">
        <p className="leading-relaxed text-slate-700">
          התרגול בכל שיעור בודק את השיעור עצמו. כאן השאלות <b>חוצות שיעורים</b> — הן בודקות אם חיברתם את
          הקורס לתמונה אחת: <b>Early ≡ התקצרות-תעלה</b>, היכן חוזר <Tex>{'e^{qV/kT}'}</Tex>, מדוע תת-סף
          {' '}"מזכיר BJT", ועוד. ענו, קבלו משוב מיידי והסבר, וקישור לשיעור-המקור.
        </p>
      </Panel>
      <QuizEngine questions={QUIZ} />
    </div>
  )
}
