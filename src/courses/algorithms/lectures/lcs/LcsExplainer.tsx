import Tex from '@/core/components/Tex'
import ComplexityPill from '@/core/components/ComplexityPill'
import Panel from '../linear-sort/components/Panel'
import LcsDemo from './components/LcsDemo'

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'תת-סדרה = תת-מחרוזת (רצף סמוך).', right: 'תת-סדרה שומרת על הסדר אך לא חייבת להיות רציפה: אפשר לדלג על אותיות. "ACE" היא תת-סדרה של "ABCDE".' },
  { wrong: 'כשהאותיות שונות לוקחים את c[i-1,j-1].', right: 'כשאין התאמה לוקחים את המקסימום מ-c[i-1,j] ו-c[i,j-1]. את האלכסון לוקחים (ועוד 1) רק בהתאמה.' },
  { wrong: 'יש בדיוק LCS אחד.', right: 'ייתכנו כמה תת-סדרות באותו אורך מרבי (למשל BCB ו-BDAB). השחזור מחזיר אחת מהן, לפי כלל ההכרעה בתיקו.' },
  { wrong: 'כוח-גס פשוט יותר ולכן עדיף.', right: 'כוח-גס בודק את כל 2^m תת-הסדרות — אקספוננציאלי. התכנון הדינמי פותר כל תת-בעיה פעם אחת ושומר אותה: O(mn).' },
]

/** Lecture 13 page (explainer): DP intro + the LCS recurrence + interactive demo + complexity. */
export default function LcsExplainer() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו תכנון דינמי (Dynamic Programming)?">
        <p className="leading-relaxed text-slate-600">
          שיטה לפתרון בעיות שניתן לתאר רקורסיבית בעזרת פתרונות לתת-בעיות (<b>מבנה אופטימלי</b>), כאשר אותן
          תת-בעיות חוזרות שוב ושוב (<b>תת-בעיות חופפות</b>). במקום לפתור כל תת-בעיה מחדש כמו בכוח-גס, פותרים
          כל אחת <b>פעם אחת</b> ושומרים את התוצאה בטבלה.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          בבעיית ה-LCS, כוח-גס משווה את כל <Tex>{'2^m'}</Tex> תת-הסדרות של <Tex>X</Tex> מול <Tex>Y</Tex> —
          <Tex>{'O(n\\,2^m)'}</Tex>. התכנון הדינמי יפתור אותה ב-<Tex>{'O(mn)'}</Tex> בלבד.
        </p>
      </Panel>

      <Panel title="תת-סדרה משותפת ארוכה ביותר — נוסחת הנסיגה">
        <p className="leading-relaxed text-slate-600">
          מגדירים את <Tex>{'c[i,j]'}</Tex> כאורך ה-LCS של הקידומות <Tex>{'X_i'}</Tex> (i האותיות הראשונות של X)
          ו-<Tex>{'Y_j'}</Tex>. התשובה הסופית היא <Tex>{'c[m,n]'}</Tex>:
        </p>
        <div className="my-3 rounded-xl bg-slate-50 p-4">
          <Tex block>{'c[i,j] = \\begin{cases} 0 & i=0 \\text{ or } j=0 \\\\ c[i-1,j-1]+1 & X_i = Y_j \\\\ \\max(c[i-1,j],\\, c[i,j-1]) & X_i \\neq Y_j \\end{cases}'}</Tex>
        </div>
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>התאמה</b> (<Tex>{'X_i = Y_j'}</Tex>): האות שייכת ל-LCS — לוקחים את <b>האלכסון</b> ומוסיפים 1.</li>
          <li><b>אי-התאמה</b>: מוותרים על אחת האותיות — לוקחים את <b>המקסימום</b> שמלמעלה או משמאל.</li>
        </ul>
      </Panel>

      <Panel title="הדגמה — מילוי הטבלה ושחזור ה-LCS">
        <p className="mb-3 leading-relaxed text-slate-600">
          הטבלה מתמלאת שורה-שורה; כל תא תלוי בשכניו (אלכסון/למעלה/שמאל). בסיום עוקבים אחורה מ-<Tex>{'c[m,n]'}</Tex>
          ואוספים את האותיות שנבחרו — זוהי תת-הסדרה עצמה.
        </p>
        <LcsDemo />
      </Panel>

      <Panel title="סיבוכיות">
        <div className="flex flex-wrap items-center gap-3">
          <ComplexityPill tex={'O(mn)'} />
          <p className="leading-relaxed text-slate-600">
            הטבלה מכילה <Tex>{'(m+1)(n+1)'}</Tex> תאים, וכל תא מחושב בזמן קבוע מתוך שלושת שכניו. לכן המילוי הוא
            <Tex>{'\\Theta(mn)'}</Tex>, והשחזור מוסיף <Tex>{'O(m+n)'}</Tex> בלבד.
          </p>
        </div>
      </Panel>

      <Panel title="טעויות נפוצות">
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m) => (
            <li key={m.wrong} className="flex flex-col gap-1">
              <span className="flex items-baseline gap-2 font-medium text-slate-700">
                <span className="text-rose-500" aria-hidden>✗</span>
                <span className="line-through decoration-rose-300">{m.wrong}</span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>✓</span>
                {m.right}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
