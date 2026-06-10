import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import ChannelView from '../components/ChannelView'

/** Lesson 5א — how V_DS tapers the channel and pinches it at the drain → saturation. */
export default function PinchoffTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title={<>צביטה ע״י <Tex>{'V_{DS}'}</Tex> — מאזור אוהמי לרוויה</>}>
        <p className="leading-relaxed text-slate-700">
          גם <Tex>{'V_{DS}'}</Tex> מצר את התעלה — אך <b>לא באופן אחיד</b>. הפוטנציאל בתעלה עולה מהמקור לניקוז, ולכן
          ההטיה האחורית של צומת שער-תעלה <b>גדולה יותר בקצה הניקוז</b>. התוצאה: התעלה <b>מתחדדת</b> לכיוון הניקוז.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">אזור אוהמי</b> (<Tex>{'V_{DS}<V_{Dsat}'}</Tex>): התעלה פתוחה לכל אורכה — ההתקן מתנהג כ<b>נגד נשלט-מתח</b>, <Tex>{'I_D'}</Tex> עולה כמעט לינארית עם <Tex>{'V_{DS}'}</Tex>.
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">רוויה</b> (<Tex>{'V_{DS}\\ge V_{Dsat}'}</Tex>): התעלה <b>נצבטת בקצה הניקוז</b>. תוספת <Tex>{'V_{DS}'}</Tex> נופלת על אזור-הצביטה, ו-<Tex>{'I_D'}</Tex> כמעט <b>קבוע</b>.
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'V_{Dsat} = |V_P| - |V_{GS}|'}</Tex>
          <p className="mt-1 text-sm text-slate-500">מתח-הניקוז שבו מתחילה הצביטה בקצה הניקוז. ככל ש-<Tex>{'|V_{GS}|'}</Tex> גדול יותר, הצביטה מוקדמת יותר.</p>
        </div>
      </Panel>

      <Panel title="התעלה החיה — גררו ובחנו">
        <p className="mb-3 leading-relaxed text-slate-700">
          גררו את <Tex>{'V_{GS}'}</Tex> וצפו בתעלה נחנקת <b>אחיד</b> עד שנסגרת לגמרי ב-<Tex>{'|V_P|'}</Tex> (קטעון);
          התחילו מ-<Tex>{'V_{GS}=0'}</Tex> והעלו את <Tex>{'V_{DS}'}</Tex> כדי לראות את אזור-המחסור <b>רחב יותר בצד הניקוז</b>,
          ובמתח <Tex>{'V_{DS}=V_{Dsat}'}</Tex> את הצביטה שם — המעבר לרוויה.
        </p>
        <ChannelView />
      </Panel>
    </div>
  )
}
