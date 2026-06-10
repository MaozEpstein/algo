import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'

/** Lesson 5א — how V_GS pinches the channel (depletion control → cutoff at V_P). */
export default function GateControlTab() {
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

      <Panel title="לראות את זה קורה">
        <p className="leading-relaxed text-slate-700">
          באינטראקטיב שבלשונית <b>צביטה ואזורי-פעולה</b> אפשר לגרור את <Tex>{'V_{GS}'}</Tex> ולצפות בתעלה נחנקת
          אחיד עד שנסגרת לגמרי ב-<Tex>{'|V_P|'}</Tex> (קטעון), וגם לראות את הצביטה ע״י <Tex>{'V_{DS}'}</Tex>.
        </p>
        <div className="mt-2">
          <Link
            to={lecturePath('semiconductors', 'jfet-structure', { tab: 'pinchoff' })}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
          >
            ↩ לאינטראקטיב התעלה
          </Link>
        </div>
      </Panel>
    </div>
  )
}
