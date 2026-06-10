import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import ChannelView from '../components/ChannelView'

/** JFET operation — gate control (depletion → V_P → cutoff) and V_DS pinch-off (→ saturation). */
export default function OperationTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שליטת השער: דלדול התעלה">
        <p className="leading-relaxed text-slate-700">
          הטיית השער אחורה (<Tex>{'V_{GS}<0'}</Tex> בתעלת <Tex>{'n'}</Tex>) <b>מרחיבה</b> את אזור-המחסור של צומת
          שער-תעלה. אזור-המחסור ריק מנושאים ולכן <b>אינו מוליך</b> — התעלה האפקטיבית מצטמצמת וההתנגדות עולה.
        </p>
        <StepFlow
          tone="reverse"
          steps={[
            { title: <><Tex>{'V_{GS}'}</Tex> שלילי יותר</>, body: <>הטיה אחורה חזקה יותר על צומת שער-תעלה</> },
            { title: <>אזור-המחסור מתרחב</>, body: <>חודר עמוק יותר לתעלה</> },
            { title: <>התעלה צרה</>, body: <>פחות נתיב מוליך, התנגדות גבוהה</> },
          ]}
          outcome={{ label: 'התעלה נסגרת — קטעון', sub: <>כש-<Tex>{'|V_{GS}|=|V_P|'}</Tex> אין נתיב מוליך</> }}
        />
        <div className="mt-3 rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'|V_P| = \\dfrac{q\\,N_D\\,a^2}{2\\,\\varepsilon_s}'}</Tex>
          <p className="mt-1 text-sm text-slate-500">מתח-הצביטה תלוי בריכוז הסימום <Tex>{'N_D'}</Tex> וברוחב חצי-התעלה <Tex>{'a'}</Tex>.</p>
        </div>
      </Panel>

      <Panel title={<>צביטה ע״י <Tex>{'V_{DS}'}</Tex> — מאזור אוהמי לרוויה</>}>
        <p className="leading-relaxed text-slate-700">
          גם <Tex>{'V_{DS}'}</Tex> מצר את התעלה — אך <b>לא באופן אחיד</b>. הפוטנציאל בתעלה עולה מהמקור לניקוז, ולכן
          ההטיה האחורית של צומת שער-תעלה <b>גדולה יותר בקצה הניקוז</b>. התוצאה: התעלה <b>מתחדדת</b> לכיוון הניקוז.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">אזור אוהמי</b> (<Tex>{'V_{DS}<V_{Dsat}'}</Tex>): התעלה פתוחה לכל אורכה — ההתקן מתנהג כ<b>נגד נשלט-מתח</b>.
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">רוויה</b> (<Tex>{'V_{DS}\\ge V_{Dsat}'}</Tex>): התעלה <b>נצבטת בקצה הניקוז</b>, ו-<Tex>{'I_D'}</Tex> כמעט <b>קבוע</b>.
          </div>
        </div>
        <div className="mt-3 rounded-xl bg-slate-50 p-4 text-center">
          <Tex block>{'V_{Dsat} = |V_P| - |V_{GS}|'}</Tex>
        </div>
      </Panel>

      <Panel title="התעלה החיה — גררו ובחנו">
        <p className="mb-3 leading-relaxed text-slate-700">
          גררו את <Tex>{'V_{GS}'}</Tex> וצפו בתעלה נחנקת <b>אחיד</b> עד שנסגרת ב-<Tex>{'|V_P|'}</Tex> (קטעון);
          התחילו מ-<Tex>{'V_{GS}=0'}</Tex> והעלו את <Tex>{'V_{DS}'}</Tex> כדי לראות את אזור-המחסור <b>רחב יותר בצד הניקוז</b>
          ואת הצביטה שם — המעבר לרוויה.
        </p>
        <ChannelView />
      </Panel>
    </div>
  )
}
