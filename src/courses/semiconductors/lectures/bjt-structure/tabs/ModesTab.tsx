import Panel from '../../../components/Panel'
import BiasModeSelector from '../components/BiasModeSelector'
import ConductionSteps from '../components/ConductionSteps'

/** Lecture 3א — biasing & the four operating modes (interactive). */
export default function ModesTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ממתח שני הצמתים קובע את מצב-הפעולה">
        <p className="leading-relaxed text-slate-700">
          לטרנזיסטור <b>שני צמתים</b>, וכל אחד יכול להיות בממתח <b>קדמי</b> או <b>אחורי</b> — סך-הכול{' '}
          <b>ארבעה מצבי-פעולה</b>. גררו את שני הממתחים (או הקישו «מצב הולכה») וראו איזה מצב מתקבל ומה השימוש בו:
        </p>
        <div className="mt-4">
          <BiasModeSelector />
        </div>
      </Panel>

      <Panel title="המצב החשוב — פעיל-קדמי (מצב הולכה)">
        <p className="leading-relaxed text-slate-700">
          מצב ה<b>הגבר</b> (<b>פעיל-קדמי</b>) פועל בשלושה שלבים — הקישו על כל אחד כדי להבין את המנגנון:
        </p>
        <ConductionSteps />
        <p className="mt-3 leading-relaxed text-slate-600">
          את שלושת השלבים האלה נראה בדיוק בדיאגרמת-הפסים שבלשונית הבאה.
        </p>
      </Panel>
    </div>
  )
}
