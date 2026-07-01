import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import CmosDiagram from '../components/CmosDiagram'

/** Lesson 7ב — CMOS technology: complementary NMOS+PMOS, the n-well cross-section and the inverter. */
export default function CmosTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="טכנולוגיית CMOS">
        <p className="leading-relaxed text-slate-700">
          <b>CMOS</b> (Complementary MOS) משלב על אותה פרוסה <b>NMOS ו-PMOS</b>. כדי לבנות את שניהם צריך שני סוגי-מצע:
          ה-NMOS יושב במצע-<Tex>{'p'}</Tex>, וה-PMOS ב<b>באר-<Tex>{'n'}</Tex></b> (n-well) שמושתלת בתוך המצע.
        </p>
        <CmosDiagram />
      </Panel>

      <Panel title="למה CMOS ניצח">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>הספק סטטי אפסי:</b> במצב יציב רק אחד מהזוג מוליך — אין נתיב-זרם קבוע מ-<Tex>{'V_{DD}'}</Tex> לאדמה.</li>
          <li><b>מתחי-לוגיקה מלאים:</b> היציאה נמשכת עד <Tex>{'V_{DD}'}</Tex> (דרך ה-PMOS) או עד 0 (דרך ה-NMOS).</li>
          <li><b>שיקול-רוחב:</b> ניידות-החורים נמוכה יותר, לכן ה-PMOS נבנה <b>רחב יותר</b> לאיזון הזרמים.</li>
          <li>זוהי הטכנולוגיה שביסוד <b>כל</b> מעבד/זיכרון ספרתי מודרני.</li>
        </ul>
      </Panel>
    </div>
  )
}
