import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import ArConvergenceExplorer from '../../../viz/ArConvergenceExplorer'

const limitProof: ComplexityProof = {
  result: '\\mathrm{Var}(X_n)\\to\\dfrac{\\sigma_W^2}{1-\\alpha^2}',
  claimHe: 'המומנטים של AR(1) יציב מתכנסים לגבול קבוע (משוואות 325–328).',
  steps: [
    { he: 'פורשים את הרקורסיה:', tex: 'X_n=\\alpha^n X_0+\\sum_{k=0}^{n-1}\\alpha^k W_{n-k}' },
    { he: 'תוחלת (טור הנדסי):', tex: 'E[X_n]=\\mu_W\\frac{1-\\alpha^n}{1-\\alpha}\\ \\longrightarrow\\ \\frac{\\mu_W}{1-\\alpha}' },
    { he: 'שונות (מחוברים בלתי-תלויים):', tex: '\\mathrm{Var}(X_n)=\\sigma_W^2\\frac{1-\\alpha^{2n}}{1-\\alpha^2}\\ \\longrightarrow\\ \\frac{\\sigma_W^2}{1-\\alpha^2}' },
    { he: 'קווריאנס:', tex: '\\mathrm{Cov}(X_n,X_{n+\\tau})\\ \\longrightarrow\\ \\frac{\\sigma_W^2\\,\\alpha^{|\\tau|}}{1-\\alpha^2}' },
  ],
  intuitionHe: 'ה"זנב" α^n·X₀ דועך אקספוננציאלית, אז ההשפעה של תנאי ההתחלה נעלמת והתהליך "שוכח" מאיפה התחיל — ומתייצב על ההתפלגות הסטציונרית.',
}

/** Lesson 12 · Asymptotic — AR moment limits, matched init, Ex 47, sandbox. */
export default function AsymptoticTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משוואות 325–328"
        kind="theorem"
        titleHe="גבולות המומנטים של AR(1) יציב"
        tex="E[X_n]\to\dfrac{\mu_W}{1-\alpha},\quad \mathrm{Var}(X_n)\to\dfrac{\sigma_W^2}{1-\alpha^2},\quad \mathrm{Cov}(X_n,X_{n+\tau})\to\dfrac{\sigma_W^2\,\alpha^{|\tau|}}{1-\alpha^2}"
        meaningHe={
          'עבור <span dir="ltr">$|\\alpha|<1$</span> שני המומנטים <b>מתכנסים לגבול קבוע</b> שאינו תלוי בזמן — ולכן התהליך ' +
          '<b>סטציונרי אסימפטוטית</b> (במובן הרחב). הוא עצמו עדיין לא WSS, כי בזמנים קטנים המומנטים תלויים ב-n.'
        }
        example={
          <p>
            כשהתוחלת <span dir="ltr"><Tex>{'\\mu_W=0'}</Tex></span> — הגבול הוא <span dir="ltr"><Tex>{'E[X_n]\\to0'}</Tex></span>,{' '}
            <span dir="ltr"><Tex>{'\\mathrm{Var}\\to\\sigma_W^2/(1-\\alpha^2)'}</Tex></span> — בדיוק ה-<span dir="ltr"><Tex>{'R_X(0)'}</Tex></span> משיעור 11.
          </p>
        }
        proof={limitProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="תנאי התחלה תואם ⇒ SSS מיד"
        tex="X_0\sim\tilde X_0\ \ (\text{או } \sigma_0^2=\tfrac{\sigma^2}{1-\alpha^2})\ \Rightarrow\ \text{SSS מהצעד הראשון}"
        meaningHe={
          'אם מאתחלים את <span dir="ltr">$X_0$</span> <b>ישר מההתפלגות הסטציונרית</b> — אין "תקופת התייצבות", והתהליך ' +
          'סטציונרי (SSS) כבר מ-<span dir="ltr">$n=1$</span>. אחרת הוא רק אסימפטוטי.'
        }
        example={
          <p>
            להתאמה ב-WSS מספיק להתאים <b>שני מומנטים</b>: <span dir="ltr"><Tex>{'\\overline{X_0}=\\mu_{\\text{stat}}'}</Tex></span> ו-
            <span dir="ltr"><Tex>{'\\overline{X_0^2}=S^2_{\\text{stat}}'}</Tex></span>.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 47"
        kind="property"
        titleHe="AR עם α=½ → אחיד U(0,2)"
        tex="X_n=\tfrac12 X_{n-1}+W_n,\ X_0=0,\ W\in\{0,1\}\ \Rightarrow\ X_n\xrightarrow{d}U(0,2)"
        meaningHe={
          'מתחילים מ-<span dir="ltr">$X_0=0$</span>. אחרי צעד: <span dir="ltr">$\\{0,1\\}$</span>; אחרי שניים: <span dir="ltr">$\\{0,0.5,1,1.5\\}$</span>. ' +
          'בגבול ההתפלגות מתמלאת ל<b>אחידה על</b> <span dir="ltr">$[0,2]$</span>, בלתי-תלויה ב-<span dir="ltr">$X_0$</span>.'
        }
        example={
          <p>
            התהליך <b>אינו</b> SSS כאן, כי <span dir="ltr"><Tex>{'X_0=0'}</Tex></span> אינו מותאם ל-<span dir="ltr"><Tex>{'U(0,2)'}</Tex></span> — רק אסימפטוטית.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — התכנסות השונות">
        <p className="mb-3 leading-relaxed text-slate-600">
          כל המימושים מתחילים ב-<span dir="ltr"><Tex>{'X_0=0'}</Tex></span>. גררו את <span dir="ltr"><Tex>{'\\alpha'}</Tex></span> וראו את השונות
          האמפירית מטפסת ומתייצבת על הקו <span dir="ltr"><Tex>{'\\sigma^2/(1-\\alpha^2)'}</Tex></span>. קרוב ל-1 ההתכנסות איטית והגבול מתפוצץ;
          ב-<span dir="ltr"><Tex>{'|\\alpha|\\ge1'}</Tex></span> אין גבול.
        </p>
        <ArConvergenceExplorer />
      </Panel>
    </div>
  )
}
