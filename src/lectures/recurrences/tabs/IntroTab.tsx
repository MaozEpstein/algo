import Tex from '@/components/Tex'
import Panel from '../components/Panel'
import UnrollStepper, { type UnrollStep } from '../components/UnrollStepper'

const EXAMPLES: { titleHe: string; tex: string; baseTex: string }[] = [
  { titleHe: 'פיבונאצ׳י', tex: 'F(n) = F(n-1) + F(n-2)', baseTex: 'F(0)=0,\\; F(1)=1' },
  { titleHe: 'מיון מיזוג', tex: 'T(n) = 2T(n/2) + \\Theta(n)', baseTex: 'T(1)=\\Theta(1)' },
  { titleHe: 'חיפוש בינארי', tex: 'T(n) = T(n/2) + \\Theta(1)', baseTex: 'T(1)=\\Theta(1)' },
  { titleHe: 'עצרת', tex: 'T(n) = T(n-1) + \\Theta(1)', baseTex: 'T(0)=\\Theta(1)' },
]

const STEPS: UnrollStep[] = [
  { tex: 'T(n) = T(n-1) + 1', noteHe: 'נוסחת הנסיגה' },
  { tex: 'T(n) = \\big(T(n-2) + 1\\big) + 1 = T(n-2) + 2', noteHe: 'מציבים שוב' },
  { tex: 'T(n) = T(n-3) + 3', noteHe: 'ושוב…' },
  { tex: 'T(n) = T(n-i) + i', noteHe: 'הדפוס הכללי' },
  { tex: 'T(n) = T(0) + n = n', noteHe: 'עוצרים כש-i=n' },
]

export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהי נוסחת נסיגה?">
        <p className="leading-relaxed text-slate-600">
          נוסחת נסיגה (recurrence) מגדירה איבר בסדרה באמצעות האיברים הקודמים לו. בניתוח אלגוריתמים
          רקורסיביים היא מבטאת את <b>זמן הריצה</b> של בעיה בגודל <Tex>n</Tex> באמצעות זמן הריצה של
          תת-הבעיות הקטנות יותר שהיא יוצרת.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50 px-4 py-3">
            <span className="text-sm font-semibold text-sky-700">תנאי התחלה (בסיס)</span>
            <p className="mt-1 text-sm text-slate-600">
              קובע את האיברים הראשונים — נקודת העצירה של הרקורסיה. למשל <Tex>T(1)=\Theta(1)</Tex>.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-3">
            <span className="text-sm font-semibold text-violet-700">נוסחת הנסיגה (צעד כללי)</span>
            <p className="mt-1 text-sm text-slate-600">
              מגדירה כל איבר לפי הקודמים. למשל <Tex>T(n)=2T(n/2)+\Theta(n)</Tex>.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="דוגמאות מוכרות">
        <div className="grid gap-3 sm:grid-cols-2">
          {EXAMPLES.map((ex) => (
            <div
              key={ex.titleHe}
              className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3"
            >
              <span className="text-sm font-semibold text-slate-700">{ex.titleHe}</span>
              <Tex block>{ex.tex}</Tex>
              <span className="text-xs text-slate-400">
                <Tex>{ex.baseTex}</Tex>
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="לפתור = להפוך לנוסחה מפורשת">
        <p className="mb-4 leading-relaxed text-slate-600">
          הנוסחה הרקורסיבית לא אומרת לנו ישירות מהו קצב הגדילה. <b>פתרון</b> נוסחת הנסיגה הוא המעבר
          ממנה לנוסחה מפורשת — חסם כמו <Tex>\Theta(n)</Tex> או <Tex>\Theta(n\log n)</Tex>. ננסה זאת
          על דוגמה פשוטה: לחצו "הבא" כדי לפתח את הנוסחה צעד-אחר-צעד.
        </p>
        <UnrollStepper
          steps={STEPS}
          resultTex="T(n) = n = \Theta(n)"
          introHe="נפתח את T(n) = T(n-1) + 1 שוב ושוב עד שנגיע לתנאי הבסיס T(0)."
        />
        <p className="mt-4 leading-relaxed text-slate-500">
          זו בדיוק העבודה שעושות שלוש השיטות בלשוניות הבאות — <b>הצבה</b>, <b>איטרציה</b> ו<b>שיטת
          האב</b> — כל אחת בגישה אחרת.
        </p>
      </Panel>
    </div>
  )
}
