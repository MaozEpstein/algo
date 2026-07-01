import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import CompareTable, { type CompareColumn, type CompareRow } from '../components/CompareTable'

const TRANSISTOR_COLS: CompareColumn[] = [
  { key: 'bjt', label: 'BJT', lectureId: 'bjt-structure', accent: 'bg-rose-50' },
  { key: 'jfet', label: 'JFET', lectureId: 'jfet', accent: 'bg-emerald-50' },
  { key: 'mosfet', label: 'MOSFET', lectureId: 'mosfet', accent: 'bg-sky-50' },
]

const TRANSISTOR_ROWS: CompareRow[] = [
  { label: 'משתנה-בקרה', cells: { bjt: <>זרם-בסיס <Tex>{'I_B'}</Tex></>, jfet: <>מתח-שער <Tex>{'V_{GS}'}</Tex></>, mosfet: <>מתח-שער <Tex>{'V_{GS}'}</Tex></> } },
  { label: 'עכבת-כניסה', cells: { bjt: 'נמוכה', jfet: 'גבוהה מאוד', mosfet: <>‎~אינסופית (קיבולית)</> } },
  { label: 'מנגנון-ההולכה', cells: { bjt: 'הזרקת-מיעוט', jfet: 'דלדול תעלה', mosfet: 'היפוך ערוץ' } },
  { label: 'מוליכות-מעבר', cells: { bjt: <Tex>{'g_m=I_C/V_T'}</Tex>, jfet: <Tex>{'\\tfrac{2I_{DSS}}{|V_P|}(1-\\tfrac{V_{GS}}{V_P})'}</Tex>, mosfet: <Tex>{'k(V_{GS}-V_T)'}</Tex> } },
  { label: 'אופיין-מוצא', cells: { bjt: <Tex>{'I_C\\approx\\beta I_B'}</Tex>, jfet: <>אוהמי→רוויה</>, mosfet: <>טריודה→רוויה</> } },
  { label: 'כיבוי', cells: { bjt: <>קטעון (<Tex>{'V_{BE}<V_\\gamma'}</Tex>)</>, jfet: <Tex>{'|V_{GS}|\\ge|V_P|'}</Tex>, mosfet: <Tex>{'V_{GS}\\le V_T'}</Tex> } },
  { label: 'יישום טיפוסי', cells: { bjt: 'מגבר/מיתוג-הספק', jfet: 'מגבר עכבה-גבוהה, RF', mosfet: 'לוגיקה ספרתית (CMOS)' } },
]

const DIODE_COLS: CompareColumn[] = [
  { key: 'pn', label: <>דיודת PN</>, lectureId: 'ideal-diode', accent: 'bg-indigo-50' },
  { key: 'schottky', label: 'שוטקי', lectureId: 'schottky-diode', accent: 'bg-amber-50' },
  { key: 'zener', label: 'Zener', lectureId: 'pn-junction-bias', tab: 'reverse', accent: 'bg-violet-50' },
]
const DIODE_ROWS: CompareRow[] = [
  { label: 'מנגנון', cells: { pn: 'הזרקת-מיעוט', schottky: <>נשאי-רוב (תרמיוני)</>, zener: <>פריצה מבוקרת (מנהור/מפולת)</> } },
  { label: 'מפל-מתח קדמי', cells: { pn: <>‎~0.7 V</>, schottky: <>‎~0.3 V</>, zener: <>‎—</> } },
  { label: 'מהירות-מיתוג', cells: { pn: <>איטית (מטען אגור)</>, schottky: <>מהירה מאוד</>, zener: '—' } },
  { label: 'שימוש', cells: { pn: 'יישור/לוגיקה', schottky: 'מיתוג מהיר, מפל נמוך', zener: 'ייחוס-מתח / הגנה' } },
]

/** Overview · Compare — side-by-side tables of the transistor family and the diode family. */
export default function CompareTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שלושת הטרנזיסטורים במבט אחד">
        <p className="mb-3 leading-relaxed text-slate-700">
          שלושתם מגבירים, אך דרך מנגנונים שונים: <b>BJT</b> נשלט-זרם ובנוי על הזרקת-מיעוט; <b>JFET</b> ו-<b>MOSFET</b>
          {' '}נשלטי-מתח (אפקט-שדה), עם עכבת-כניסה גבוהה. שימו לב שכולם חולקים את שלד ה-<Tex>{'g_m'}</Tex>.
        </p>
        <CompareTable columns={TRANSISTOR_COLS} rows={TRANSISTOR_ROWS} />
      </Panel>

      <Panel title="משפחת הדיודות">
        <p className="mb-3 leading-relaxed text-slate-700">
          גם הדיודות נבדלות במנגנון: הזרקת-מיעוט (PN), נשאי-רוב תרמיוניים (שוטקי — מהיר, מפל נמוך), או פריצה
          מבוקרת (Zener — לייחוס-מתח).
        </p>
        <CompareTable columns={DIODE_COLS} rows={DIODE_ROWS} />
      </Panel>
    </div>
  )
}
