import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

const FORMULAS: { name: string; tex: string; wide?: boolean }[] = [
  { name: 'מטען פני-השטח (מדויק)', tex: '|Q_s| = \\sqrt{2\\varepsilon_s q V_T\\left[N_A(e^{-\\beta\\psi_s}+\\beta\\psi_s-1)+\\tfrac{n_i^2}{N_A}(e^{\\beta\\psi_s}-\\beta\\psi_s-1)\\right]}', wide: true },
  { name: 'מטען מחסור', tex: 'Q_{dep}=\\sqrt{2q\\varepsilon_sN_A\\psi_s}' },
  { name: 'משוואת השער', tex: 'V_G=V_{FB}-\\dfrac{Q_s}{C_{ox}}+\\psi_s' },
  { name: 'מתח-סף', tex: 'V_T=V_{FB}+2\\phi_F+\\dfrac{|Q_{D,\\max}|}{C_{ox}}' },
  { name: 'flat-band ריאלי', tex: 'V_{FB}=\\phi_{MS}-\\dfrac{Q_{ss}}{C_{ox}}' },
  { name: 'הזזת flat-band', tex: '\\Delta V_{FB}=-\\dfrac{qN_{ss}}{C_{ox}}' },
]

const MISTAKES: { wrong: string; right: string }[] = [
  { wrong: 'בהיפוך רוחב-המחסור ממשיך לגדול עם $V_G$.', right: 'לא — הוא ננעל על $W_{max}$ (ב-$\\psi_s=2\\phi_F$); תוספת מטען-השער מאוזנת ע״י אלקטרוני-ההיפוך.' },
  { wrong: 'מתח-הסף נקבע רק ע״י $\\phi_{MS}$.', right: 'לא — $V_T=V_{FB}+2\\phi_F+|Q_{D,\\max}|/C_{ox}$, ו-$V_{FB}$ עצמו זז עם מטעני-תחמוצת.' },
  { wrong: 'מטען-תחמוצת חיובי מעלה את $V_T$.', right: 'להפך — מטען חיובי מזיז את $V_{FB}$ (ולכן $V_T$) ל$שלילה$.' },
]

function DeepLink({ tab, children }: { tab: string; children: React.ReactNode }) {
  return (
    <Link to={lecturePath('semiconductors', 'mos-threshold', { tab })} className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100">
      ↩ {children}
    </Link>
  )
}

/** Lesson 6ב summary — Q_s, V_T and oxide charges. */
export default function SummaryTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="תקציר">
        <ul className="list-inside list-disc space-y-2 leading-relaxed text-slate-700">
          <li><b>מטען פני-השטח <Tex>{'Q_s(\\psi_s)'}</Tex>:</b> פתרון פואסון — מעריכי בהצטברות/היפוך, <Tex>{'\\sqrt{\\psi_s}'}</Tex> במחסור.</li>
          <li><b>מתח-סף <Tex>{'V_T'}</Tex>:</b> סף ההיפוך החזק (<Tex>{'\\psi_s=2\\phi_F'}</Tex>) — תלוי ב-<Tex>{'V_{FB},\\phi_F,N_A,t_{ox}'}</Tex>.</li>
          <li><b>מטעני-תחמוצת:</b> ארבעה סוגים (<Tex>{'Q_{it},Q_f,Q_{ox},Q_m'}</Tex>) מסוכמים ל-<Tex>{'Q_{ss}'}</Tex> ומזיזים את כל האופיין.</li>
        </ul>
      </Panel>

      <Panel title="נוסחאות מפתח">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {FORMULAS.map((f) => (
            <div key={f.name} className={`flex flex-col items-center gap-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-center ${f.wide ? 'sm:col-span-2 lg:col-span-3' : ''}`}>
              <span className="text-xs font-semibold text-slate-500">{f.name}</span>
              <div className="w-full overflow-x-auto"><Tex block>{f.tex}</Tex></div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="ראו בעיניים">
        <div className="flex flex-wrap gap-2">
          <DeepLink tab="surface">מטען פני-השטח <Tex>{'Q_s'}</Tex></DeepLink>
          <DeepLink tab="threshold">מתח-הסף <Tex>{'V_T'}</Tex></DeepLink>
          <DeepLink tab="oxide">מטעני-תחמוצת</DeepLink>
        </div>
      </Panel>

      <Panel title="טעויות נפוצות">
        <ul className="flex flex-col gap-3">
          {MISTAKES.map((m) => (
            <li key={m.wrong} className="flex flex-col gap-1">
              <span className="flex items-baseline gap-2 font-medium text-slate-700">
                <span className="text-rose-500" aria-hidden>✗</span>
                <span className="line-through decoration-rose-300"><RichText>{m.wrong}</RichText></span>
              </span>
              <span className="flex items-baseline gap-2 ps-6 leading-relaxed text-slate-600">
                <span className="text-emerald-500" aria-hidden>✓</span>
                <span><RichText>{m.right}</RichText></span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
