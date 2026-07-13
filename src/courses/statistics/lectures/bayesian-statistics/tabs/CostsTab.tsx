import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'

const mapProof: ComplexityProof = {
  result: '\\hat\\theta_{MAP}=\\arg\\max_\\theta f(y\\mid\\theta)f(\\theta)',
  claimHe: 'תחת עלות 0-1, האמד האופטימלי הוא שיא ה-posterior (MAP) — משפט 8.2.',
  steps: [
    { he: 'עלות 0-1: 0 אם צדקנו, אחרת 1. תוחלתה היא הסתברות השגיאה:', tex: 'E[c]=\\Pr(\\hat\\theta\\ne\\theta)' },
    { he: 'מזעור השגיאה = בחירת הערך הכי סביר בהינתן הנתונים:', tex: '\\hat\\theta=\\arg\\max_\\theta f(\\theta\\mid y)' },
    { he: 'לפי בייס (המכנה f(y) לא תלוי ב-θ):', tex: '=\\arg\\max_\\theta f(y\\mid\\theta)\\,f(\\theta)' },
  ],
  intuitionHe: 'MAP = ML "משוקלל ב-prior"; prior אחיד ⇒ MAP=ML — בדיוק כמו הגילוי בשיעור 5.',
}

const medProof: ComplexityProof = {
  result: 'F_{\\theta\\mid Y}(\\hat\\theta\\mid y)=\\tfrac12',
  claimHe: 'תחת עלות ערך-מוחלט, האמד האופטימלי הוא חציון ה-posterior — משפט 8.3.',
  steps: [
    { he: 'מפצלים את האינטגרל של |θ−θ̂| בנקודה θ̂:', tex: '\\int_{-\\infty}^{\\hat\\theta}(\\hat\\theta-\\theta)f\\,d\\theta+\\int_{\\hat\\theta}^{\\infty}(\\theta-\\hat\\theta)f\\,d\\theta' },
    { he: 'גוזרים לפי θ̂ (כלל לייבניץ):', tex: '\\Pr(\\theta<\\hat\\theta\\mid y)-\\Pr(\\theta>\\hat\\theta\\mid y)=0' },
    { he: 'שוויון בין שני הצדדים ⇒ החציון:', tex: 'F_{\\theta\\mid Y}(\\hat\\theta\\mid y)=\\tfrac12' },
  ],
  intuitionHe: 'החציון מאזן מסה משני צדדיו — ולכן חסין לחריגים, בדיוק כמו L1 בשיעור 7.',
}

/** Lesson 8 · Cost functions — MAP (0-1) and median (absolute). */
export default function CostsTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="משפט 8.2"
        kind="theorem"
        titleHe="עלות 0-1 → MAP"
        tex="c(e)=\mathbb{1}\{\hat\theta\ne\theta\}\ \Rightarrow\ \hat\theta_{MAP}=\arg\max_\theta f(\theta\mid y)"
        meaningHe={
          'כשמעניישים רק על "טעות/צדק" (0-1), ממזערים את <b>הסתברות השגיאה</b> — ובוחרים את <b>שיא ה-posterior</b>. ' +
          'זהו ה-ML כפול ה-prior; prior אחיד ⇒ MAP=ML.'
        }
        example={<p>לזיהוי בדיד (איזה סמל שודר?) — MAP הוא הכלל שממזער את הסתברות השגיאה.</p>}
        proof={mapProof}
      />

      <DefinitionCard
        n="משפט 8.3"
        kind="theorem"
        titleHe="עלות ערך מוחלט → חציון"
        tex="c(e)=|\theta-\hat\theta|\ \Rightarrow\ \hat\theta_{med}:\ F_{\theta\mid Y}(\hat\theta\mid y)=\tfrac12"
        meaningHe={'כשהעלות לינארית בשגיאה, האמד האופטימלי הוא <b>חציון ה-posterior</b> — הנקודה שמחלקת את ההסתברות לשני חצאים.'}
        example={<p>כמו החציון החסין בשיעור 7 — אבל כאן על ה-<b>posterior</b>.</p>}
        proof={medProof}
      />

      <Panel title="עלות ⇄ אמד אופטימלי">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[380px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500">
                <th className="px-4 py-2 text-start text-xs font-bold">פונקציית עלות</th>
                <th className="px-4 py-2 text-center text-xs font-bold">אמד אופטימלי</th>
                <th className="px-4 py-2 text-center text-xs font-bold">מ-ה-posterior</th>
              </tr>
            </thead>
            <tbody>
              <Row cost="(\theta-\hat\theta)^2" name="MMSE" post="תוחלת (mean)" />
              <Row cost="\mathbb{1}\{\hat\theta\ne\theta\}" name="MAP" post="שיא (mode)" alt />
              <Row cost="|\theta-\hat\theta|" name="median" post="חציון" />
            </tbody>
          </table>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          שלושתם נגזרים מאותו רעיון — מזעור עלות צפויה על ה-posterior. לגאוסי (סימטרי) שלושתם מתלכדים; לפוסטריור מוטה הם נבדלים.
        </p>
      </Panel>
    </div>
  )
}

function Row({ cost, name, post, alt = false }: { cost: string; name: string; post: string; alt?: boolean }) {
  return (
    <tr className={`border-t border-slate-100 ${alt ? 'bg-slate-50/40' : ''}`}>
      <td className="px-4 py-2.5" dir="ltr"><Tex>{cost}</Tex></td>
      <td className="px-4 py-2.5 text-center font-semibold text-emerald-700" dir="ltr">{name}</td>
      <td className="px-4 py-2.5 text-center text-slate-600">{post}</td>
    </tr>
  )
}
