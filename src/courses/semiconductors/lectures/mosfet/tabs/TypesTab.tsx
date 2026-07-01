import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 7א NMOS/PMOS + enhancement/depletion classification and the current-law summary. */
const TYPE_ROWS: [React.ReactNode, React.ReactNode, React.ReactNode][] = [
  [<b>ערוץ</b>, <>NMOS — אלקטרונים</>, <>PMOS — חורים</>],
  [<>מצע</>, <Tex>{'p'}</Tex>, <>באר-<Tex>{'n'}</Tex></>],
  [<>נדלק כאשר</>, <Tex>{'V_{GS}>V_T'}</Tex>, <Tex>{'V_{GS}<V_T'}</Tex>],
  [<>מתחים טיפוסיים</>, <Tex>{'V_{GS},V_{DS}>0'}</Tex>, <Tex>{'V_{GS},V_{DS}<0'}</Tex>],
]

const ENH_ROWS: [React.ReactNode, React.ReactNode, React.ReactNode][] = [
  [<b>סוג</b>, <>אנהנסמנט (העשרה)</>, <>דיפלישן (דלדול)</>],
  [<>ערוץ ב-<Tex>{'V_{GS}=0'}</Tex></>, <>אין — כבוי</>, <>קיים — מוליך</>],
  [<><Tex>{'V_T'}</Tex> (NMOS)</>, <Tex>{'V_T>0'}</Tex>, <Tex>{'V_T<0'}</Tex>],
  [<><Tex>{'V_T'}</Tex> (PMOS)</>, <Tex>{'V_T<0'}</Tex>, <Tex>{'V_T>0'}</Tex>],
]

function CompareTable({ rows, headers }: { rows: [React.ReactNode, React.ReactNode, React.ReactNode][]; headers: [string, string, string] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse text-center text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-700">
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-3 py-2.5 font-medium text-slate-600">{r[0]}</td>
              <td className="px-3 py-2.5">{r[1]}</td>
              <td className="px-3 py-2.5">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TypesTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="NMOS מול PMOS">
        <CompareTable headers={['', 'NMOS', 'PMOS']} rows={TYPE_ROWS} />
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          ה-PMOS הוא <b>תמונת-הראי</b> של ה-NMOS: כל הסימנים והמתחים מתהפכים. הניידות של החורים נמוכה יותר, לכן
          לזרם זהה דרוש PMOS <b>רחב יותר</b> — עובדה מרכזית בעיצוב CMOS (חלק ב׳).
        </p>
      </Panel>

      <Panel title="אנהנסמנט מול דיפלישן">
        <CompareTable headers={['', 'אנהנסמנט', 'דיפלישן']} rows={ENH_ROWS} />
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          <b>אנהנסמנט</b> (הנפוץ): צריך <Tex>{'|V_{GS}|>|V_T|'}</Tex> כדי <i>ליצור</i> ערוץ. <b>דיפלישן</b>: הערוץ קיים מראש,
          ומתח-השער <i>מדלל</i> אותו עד קטעון.
        </p>
      </Panel>

      <Panel title="סיכום חוקי-הזרם (אנהנסמנט)">
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-semibold text-slate-500">NMOS · רוויה</span>
            <div className="mt-1"><Tex block>{'I_{DS}=\\dfrac{k}{2}(V_{GS}-V_T)^2'}</Tex></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-semibold text-slate-500">PMOS · רוויה</span>
            <div className="mt-1"><Tex block>{'I_{DS}=\\dfrac{k}{2}(V_{GS}-V_T)^2\\;\\;(|V_{GS}|>|V_T|)'}</Tex></div>
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600"><Tex>{'k=\\dfrac{W}{L}\\mu^*C_{ox}'}</Tex></p>
      </Panel>
    </div>
  )
}
