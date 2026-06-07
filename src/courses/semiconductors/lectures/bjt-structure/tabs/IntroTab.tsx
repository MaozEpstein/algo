import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import BjtStructure from '../components/BjtStructure'
import BjtSymbol from '../components/BjtSymbol'
import BjtOperationFlow from '../components/BjtOperationFlow'
import DopingBars from '../components/DopingBars'
import TypicalValues from '../components/TypicalValues'

/** Lecture 3א — intro & structure (merged): what a BJT is, what it does (E→B→C),
 *  why it isn't two diodes, the cross-section + symbol, the doping rationale, and a
 *  roadmap. */
export default function IntroTab() {
  const [kind, setKind] = useState<'npn' | 'pnp'>('npn')

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו טרנזיסטור דו-קוטבי?">
        <p className="leading-relaxed text-slate-700">
          הטרנזיסטור הדו-קוטבי (<b>BJT</b>) הוא <b>שלוש שכבות</b> מוליך-למחצה מסוממות לסירוגין — <b>npn</b> או <b>pnp</b> —
          שיוצרות <b>שני צמתי-PN "גב-אל-גב"</b> החולקים אזור אמצעי דק: ה<b>בסיס</b>. שלושת ההדקים הם
          ה<b>פולט</b> (E), ה<b>בסיס</b> (B) וה<b>קולט</b> (C). השם "דו-קוטבי" נובע מכך שבהולכה משתתפים{' '}
          <b>שני סוגי הנושאים</b> — אלקטרונים וגם חורים.
        </p>
      </Panel>

      <Panel title="פעולת הטרנזיסטור — בקצרה">
        <BjtOperationFlow />
      </Panel>

      <Panel title="למה זה לא פשוט שתי דיודות?">
        <p className="leading-relaxed text-slate-700">
          לכאורה npn = שתי דיודות גב-אל-גב. אבל יש פרט מכריע: ה<b>בסיס דק מאוד</b> — קצר בהרבה מאורך-הדיפוזיה{' '}
          <Tex>{'L_B'}</Tex>. לכן נושאי-המיעוט שמוזרקים אל הבסיס דרך צומת ה-<b>BE</b> אינם נעלמים בדרך, אלא{' '}
          <b>חוצים אותו ומגיעים</b> ישירות לצומת ה-<b>CB</b>. <b>שני הצמתים מצומדים</b> — וזה ההבדל המהותי שהופך את
          המבנה למגבר.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-rose-700">שתי דיודות נפרדות</b> (בסיס עבה): המטען המוזרק <b>נעלם ברקומבינציה</b> בדרך. אין צימוד — אין הגבר.
          </div>
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">טרנזיסטור</b> (בסיס דק, <Tex>{'W_B\\ll L_B'}</Tex>): כמעט כל המטען <b>חוצה</b> אל הקולט ← זרם-בסיס זעיר שולט בזרם-קולט גדול.
          </div>
        </div>
      </Panel>

      <Panel title="מבנה וסמל">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">סוג:</span>
          {(['npn', 'pnp'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-full border px-4 py-1 text-sm font-semibold transition ${
                kind === k ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
              dir="ltr"
            >
              {k}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3 lg:items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 lg:col-span-2">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">חתך-רוחב</p>
            <BjtStructure kind={kind} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">סמל-המעגל</p>
            <BjtSymbol kind={kind} />
          </div>
        </div>
      </Panel>

      <Panel title="סימום שלושת האזורים — ולמה דווקא כך">
        <DopingBars kind={kind} />
        <div className="mt-4">
          <TypicalValues />
        </div>
      </Panel>

      <Panel title="מה נלמד בהמשך">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-700">
          <li><b>ממתח ומצבי-פעולה</b> — קטעון / פעיל-קדמי / רוויה / פעיל-הפוך.</li>
          <li><b>דיאגרמת-פסים</b> של שני הצמתים — איך הממתח מנמיך מחסום אחד ומגביה את השני.</li>
          <li><b>פרופיל המיעוט</b> לאורך E-B-C — הירידה הלינארית בבסיס שהיא-היא זרם-הקולט.</li>
          <li><b>למה הטרנזיסטור מגביר</b> — איכותית (הכימות: <Tex>{'\\gamma,b,\\alpha,\\beta'}</Tex> בחלק ב׳).</li>
        </ul>
      </Panel>
    </div>
  )
}
