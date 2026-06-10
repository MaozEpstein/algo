import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Brief MESFET extension (not in the class summary; syllabus completeness). */
export default function MesfetTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="MESFET — הרחבה קצרה">
        <div className="mb-3 rounded-xl border-s-4 border-amber-300 bg-amber-50/60 px-4 py-2 text-sm text-amber-800">
          ℹ️ נושא <b>הרחבה</b> — אינו בסיכום-הכיתה, מובא להשלמה.
        </div>
        <p className="leading-relaxed text-slate-700">
          ה-<b>MESFET</b> (Metal-Semiconductor FET) זהה ברעיון ל-JFET — מתח-שער שולט בדלדול התעלה — אך השער הוא
          <b> מחסום שוטקי</b> (מגע מתכת-מל"מ) במקום צומת <Tex>{'p\\text{-}n'}</Tex>. אותה פיזיקה של דלדול,
          <Tex>{'\\,V_P'}</Tex>, ואותם אופייני <Tex>{'I_D'}</Tex> (חוק ריבועי) — רק מנגנון-שער שונה.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="py-2.5 px-3 font-semibold">תכונה</th>
                <th className="py-2.5 px-3 font-semibold text-sky-700">JFET</th>
                <th className="py-2.5 px-3 font-semibold text-violet-700">MESFET</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {([
                ['השער', <>צומת <Tex>{'p\\text{-}n'}</Tex></>, <>מחסום שוטקי (מתכת)</>],
                ['חומר אופייני', 'Si', 'GaAs ומל"מ III-V'],
                ['יתרון', 'פשוט וזול', <>מהיר — תדרי <b>מיקרוגל</b></>],
                ['אופייני I-V', <>חוק ריבועי</>, <>חוק ריבועי (זהה)</>],
              ] as [string, React.ReactNode, React.ReactNode][]).map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  <td className="py-2.5 px-3 font-medium text-slate-600">{r[0]}</td>
                  <td className="py-2.5 px-3">{r[1]}</td>
                  <td className="py-2.5 px-3">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          המחסום השוטקי נלמד בשיעור 2 (דיודת שוטקי): <Tex>{'\\phi_B=\\phi_M-\\chi'}</Tex>.
        </p>
      </Panel>
    </div>
  )
}
