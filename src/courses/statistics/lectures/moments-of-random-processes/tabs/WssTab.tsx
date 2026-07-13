import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import AutocorrExplorer from '../../../viz/AutocorrExplorer'

const boundProof: ComplexityProof = {
  result: '|R_X(\\tau)|\\le R_X(0)',
  claimHe: 'האוטו-קורלציה חסומה ע"י ההספק R_X(0) (משוואות 290–293).',
  steps: [
    { he: 'מתחילים מריבוע אי-שלילי:', tex: '0\\le E\\big[(X(t)-X(0))^2\\big]' },
    { he: 'מפתחים (וב-WSS E[X²(t)]=R_X(0)):', tex: '=2E[X^2(0)]-2E[X(t)X(0)]=2\\big[R_X(0)-R_X(\\tau)\\big]' },
    { he: 'ולכן:', tex: 'R_X(\\tau)\\le R_X(0)' },
    { he: 'באותו אופן מ-E[(X(t)+X(0))²]≥0 מקבלים את הצד השני:', tex: '-R_X(0)\\le R_X(\\tau)\\ \\Rightarrow\\ |R_X(\\tau)|\\le R_X(0)' },
  ],
  intuitionHe: 'שום פיגור לא יכול לתת "מתאם" חזק יותר מהמתאם של הדגימה עם עצמה — לכן השיא תמיד בפיגור אפס, שם R_X שווה להספק.',
}

/** Lesson 11 · WSS — the two conditions, the lag form, properties, and the sandbox. */
export default function WssTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="הגדרה 11.2"
        kind="definition"
        titleHe="סטציונריות במובן הרחב (WSS)"
        tex="\text{(1)}\ \mu_X(t)=\mu_X\quad\text{(2)}\ R_X(t_1,t_2)=R_X(t_1+\tau,t_2+\tau)\ \Rightarrow\ R_X(\tau)"
        meaningHe={
          'תהליך הוא <b>WSS</b> אם (1) התוחלת <b>קבועה</b>, ו-(2) האוטו-קורלציה <b>אינווריאנטית להזזה</b> — ולכן תלויה רק ' +
          'ב<b>פיגור</b> $\\tau=t_1-t_2$. זו דרישה חלשה בהרבה מ-SSS (שדרשה את <b>כל</b> ההתפלגויות), ולכן <b>קלה לבדיקה</b>.'
        }
        example={
          <p>
            מספיק להכיר את האוטו-קורלציה מול <span dir="ltr"><Tex>{'X(0)'}</Tex></span>:{' '}
            <span dir="ltr"><Tex>{'R_X(t_1,t_2)=E[X(0)X(t_1-t_2)]'}</Tex></span>. נדרש גם <span dir="ltr"><Tex>{'R_X(0)<\\infty'}</Tex></span> (שונות סופית).
          </p>
        }
      />

      <DefinitionCard
        kind="property"
        titleHe="תכונות האוטו-קורלציה של תהליך WSS"
        tex="R_X(0)=E[X^2(t)]\ge0,\qquad R_X(\tau)=R_X(-\tau),\qquad |R_X(\tau)|\le R_X(0)"
        meaningHe={
          '<b>הספק:</b> בפיגור אפס האוטו-קורלציה היא המומנט השני (ההספק) — תמיד אי-שלילית. <b>סימטריה:</b> ' +
          '$R_X(\\tau)=R_X(-\\tau)$. <b>חסם:</b> השיא תמיד בפיגור אפס.'
        }
        example={
          <p>
            הקשר לאוטו-קווריאנס: <span dir="ltr"><Tex>{'C_X(\\tau)=R_X(\\tau)-\\mu_X^2'}</Tex></span>. לתהליך מרכזי (<span dir="ltr"><Tex>{'\\mu_X=0'}</Tex></span>) השניים מתלכדים.
          </p>
        }
        proof={boundProof}
      />

      <DefinitionCard
        kind="property"
        titleHe="הקשר בין SSS ל-WSS"
        tex="\text{SSS}\ \Rightarrow\ \text{WSS}\qquad(\text{ההפך: רק בתהליכים גאוסיים})"
        meaningHe={
          'סטציונריות <b>צרה</b> גוררת <b>רחבה</b> — אם כל ההתפלגויות אינווריאנטיות, אז בפרט התוחלת והאוטו-קורלציה. ' +
          'הכיוון ההפוך <b>לא</b> נכון בכלל, אבל <b>כן</b> נכון לתהליך <b>גאוסי</b> (שנקבע לגמרי ע"י שני מומנטים).'
        }
        example={
          <p>
            לכן לתהליך גאוסי מספיק לבדוק WSS (שני מומנטים) כדי לקבל SSS — קיצור דרך רב-עוצמה.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — האוטו-קורלציה כטביעת אצבע">
        <p className="mb-3 leading-relaxed text-slate-600">
          בחרו תהליך וראו את המימוש לצד האוטו-קורלציה <span dir="ltr"><Tex>{'R_X(\\tau)'}</Tex></span>: שימו לב שהשיא תמיד ב-
          <span dir="ltr"><Tex>{'\\tau=0'}</Tex></span> (ההספק), שהיא סימטרית, ושב-AR היא דועכת עם <span dir="ltr"><Tex>{'\\alpha'}</Tex></span> ובקוסינוס מחזורית.
        </p>
        <AutocorrExplorer />
      </Panel>
    </div>
  )
}
