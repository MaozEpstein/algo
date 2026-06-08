import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import FtPlot from '../components/FtPlot'
import SwitchingExplorer from '../components/SwitchingExplorer'

/** Lecture 3ג — cutoff frequency f_T and switching speed. */
export default function FtTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תדר-חיתוך fₜ — עד כמה מהר">
        <p className="leading-relaxed text-slate-700">
          ההגבר אינו אינסופי בתדר: מעל <Tex>{'f_\\beta'}</Tex> הקיבולים הטפיליים (<Tex>{'C_\\pi,C_\\mu'}</Tex>) מקצרים את האות,
          ו-<Tex>{'|\\beta(f)|'}</Tex> נופל ב-<Tex>{'-20\\,'}</Tex>dB/דקדה עד שמגיע ל-1 בתדר-החיתוך <Tex>{'f_T=g_m/2\\pi(C_\\pi+C_\\mu)'}</Tex>. גררו את <Tex>{'\\beta_0'}</Tex>:
        </p>
        <div className="mt-3">
          <FtPlot />
        </div>
      </Panel>

      <Panel title="מהירות ומיתוג — הקשר לאגירת-המטען">
        <p className="leading-relaxed text-slate-700">
          מה קובע את <Tex>{'f_T'}</Tex>? <b>זמן-המעבר</b> של הנושאים דרך הבסיס, שתלוי ברוחב-הבסיס. גררו את <Tex>{'W_B'}</Tex> וראו
          כיצד בסיס דק מקצר את זמן-המעבר ומאיץ הן את <Tex>{'f_T'}</Tex> והן את המיתוג:
        </p>
        <div className="mt-3">
          <SwitchingExplorer />
        </div>
      </Panel>
    </div>
  )
}
