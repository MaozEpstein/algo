import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import CapacitanceStack from '../components/CapacitanceStack'

const CAPS: { sym: string; sub: string; name: string; what: string; tone: string }[] = [
  { sym: 'C', sub: 'ox', name: 'קיבול האוקסיד', what: 'קבוע — $\\varepsilon_{ox}\\varepsilon_0/t_{ox}$. לוחות הקבל הם השער ופני-המל"מ.', tone: 'border-violet-300 bg-violet-50/60' },
  { sym: 'C', sub: 'dep', name: 'קיבול המחסור', what: '$\\varepsilon_s/W$ — קטֵן ככל ש-$W$ גדל. פעיל במחסור.', tone: 'border-sky-300 bg-sky-50/60' },
  { sym: 'C', sub: 's', name: 'קיבול המל"מ', what: '$-dQ_s/d\\psi_s$ — תגובת מטען פני-השטח לשינוי $\\psi_s$. גדול בהצטברות/היפוך.', tone: 'border-emerald-300 bg-emerald-50/60' },
  { sym: 'C', sub: 'ss', name: 'קיבול מצבי-השטח', what: 'תגובת המלכודות בממשק ($-dQ_{ss}/d\\psi_s$); במקביל ל-$C_s$.', tone: 'border-amber-300 bg-amber-50/60' },
]

/** Lesson 6ג — the MOS capacitances and where the small-signal ΔQ appears in each regime. */
export default function CapacitancesTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="ארבעת הקיבולים">
        <p className="leading-relaxed text-slate-700">
          תגובת המטען לאות-קטן מתחלקת לרכיבים. כל אחד הוא <b>נגזרת מטען לפי מתח/פוטנציאל</b>:
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {CAPS.map((c) => (
            <div key={c.sub} className={`rounded-xl border-s-4 ${c.tone} px-4 py-2.5`}>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-extrabold text-slate-800"><Tex>{`${c.sym}_{${c.sub}}`}</Tex></span>
                <span className="font-bold text-slate-700">{c.name}</span>
              </div>
              <CapWhat text={c.what} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="הצירוף הטורי">
        <p className="leading-relaxed text-slate-700">
          השער "רואה" את <Tex>{'C_{ox}'}</Tex> ב<b>טור</b> עם הקיבול של המל"מ (ש-<Tex>{'C_s'}</Tex> ו-<Tex>{'C_{ss}'}</Tex>
          {' '}שם <b>במקביל</b>):
        </p>
        <div className="my-3 rounded-xl border-2 border-violet-300 bg-violet-50/60 p-4 text-center">
          <Tex block>{'\\dfrac{1}{C} = \\dfrac{1}{C_{ox}} + \\dfrac{1}{C_s + C_{ss}}'}</Tex>
        </div>
        <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-slate-600">
          <li><b>הצטברות:</b> <Tex>{'C_s\\to\\infty'}</Tex> (מטען רב מגיב) → <Tex>{'C\\approx C_{ox}'}</Tex>.</li>
          <li><b>מחסור:</b> <Tex>{'C_s\\approx C_{dep}=\\varepsilon_s/W'}</Tex> קטֵן → <Tex>{'C'}</Tex> יורד מתחת ל-<Tex>{'C_{ox}'}</Tex>.</li>
          <li><b>היפוך (תדר נמוך):</b> שכבת-ההיפוך מגיבה → <Tex>{'C_s'}</Tex> שוב גדול → <Tex>{'C\\to C_{ox}'}</Tex>.</li>
        </ul>
      </Panel>

      <Panel title="היכן מופיע ΔQ — בכל משטר">
        <p className="mb-2 leading-relaxed text-slate-700">
          מטען-השער <Tex>{'\\Delta Q_G'}</Tex> תמיד יושב על האוקסיד; השאלה היא <b>איזה</b> מטען במל"מ מגיב ו<b>היכן</b> —
          וזה מה שקובע את הקיבול:
        </p>
        <div className="grid gap-3 lg:grid-cols-3">
          {(['accumulation', 'depletion', 'inversion'] as const).map((r) => (
            <div key={r} className="rounded-2xl border border-slate-200 bg-white p-2">
              <p className="mb-1 text-center text-xs font-semibold text-slate-500">
                {r === 'accumulation' ? 'הצטברות' : r === 'depletion' ? 'מחסור' : 'היפוך'}
              </p>
              <CapacitanceStack regime={r} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function CapWhat({ text }: { text: string }) {
  // render the description with inline $…$ math
  const parts = text.split('$')
  return (
    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
      {parts.map((seg, i) => (i % 2 === 1 ? <Tex key={i}>{seg}</Tex> : <span key={i}>{seg}</span>))}
    </p>
  )
}
