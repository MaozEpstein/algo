import Panel from '../components/Panel'

const FACTORS = ['חומרה', 'מערכת ההפעלה', 'שפת התכנות', 'תוכניות אחרות שרצות', 'הקלט הספציפי', 'גודל הקלט']

export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו אלגוריתם?">
        <p className="leading-relaxed text-slate-600">
          אלגוריתם הוא <b>מתכון (recipe) לפתרון בעיה חישובית</b> — סדרת צעדים מדויקת שמובילה מהקלט אל
          הפלט.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          לרוב הבעיות יש כמה אלגוריתמים שונים, והמטרה היא למצוא את ה<b>יעיל</b> ביותר — מהיר בזמן ריצה
          וחסכוני בזיכרון. בקורס נתרכז בעיקר ב<b>זמן הריצה</b>.
        </p>
      </Panel>

      <Panel title="למה אי-אפשר פשוט למדוד בשעון?">
        <p className="mb-3 leading-relaxed text-slate-600">
          זמן הריצה בפועל תלוי בהמון גורמים חיצוניים שאין להם קשר לאיכות האלגוריתם:
        </p>
        <div className="flex flex-wrap gap-2">
          {FACTORS.map((f) => (
            <span key={f} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {f}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-xl border-s-4 border-sky-300 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
          לכן צריך מדד <b>תיאורטי</b> שלא תלוי בסביבה — כזה שמשווה אלגוריתמים לפי כמות העבודה כפונקציה של
          גודל הקלט. זו ה<b>סיבוכיות</b> (בלשונית "סיבוכיות וסימון אסימפטוטי").
        </div>
      </Panel>
    </div>
  )
}
