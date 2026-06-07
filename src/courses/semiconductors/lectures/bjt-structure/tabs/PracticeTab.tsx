import { useState, type ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-800"><RichText>{q}</RichText></p>
        <button
          onClick={() => setShow((s) => !s)}
          aria-expanded={show}
          className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          {show ? 'הסתר תשובה' : 'הצג תשובה'}
        </button>
      </div>
      {show && <p className="mt-2 leading-relaxed text-slate-600">{children}</p>}
    </div>
  )
}

/** Lecture 3א — conceptual practice on structure & operation. */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          שאלות מושגיות על המבנה והפעולה. נסו לענות לבד — ואז «הצג תשובה». זהו חלק <b>איכותי</b>; חישובי הזרם וההגבר
          יגיעו בחלק ב׳.
        </p>
      </Panel>

      <Panel title="שאלות">
        <div className="flex flex-col gap-3">
          <QA q="1 · נתון: צומת BE קדמי וצומת CB קדמי. באיזה מצב-פעולה הטרנזיסטור?">
            ב<b>רוויה</b> (Saturation) — "מפסק סגור", <Tex>{'V_{CE,\\mathrm{sat}}\\approx0.2\\,V'}</Tex>. שני הצמתים קדמיים, ולכן
            שניהם מזריקים והמכשיר אינו מגביר ליניארית.
          </QA>
          <QA q="2 · מדוע הבסיס חייב להיות דק?">
            כדי שכמעט כל המטען המוזרק מהפולט <b>יחצה</b> את הבסיס בדיפוזיה ויגיע לקולט לפני שייעלם ברקומבינציה — כלומר מקדם-המעבר{' '}
            <Tex>{'b=1/\\cosh(W_B/L_B)\\to1'}</Tex>. בסיס עבה = רקומבינציה בדרך = אין הגבר.
          </QA>
          <QA q="3 · מדוע הפולט מסומם בכבדות הרבה יותר מהבסיס?">
            כדי שהזרם בצומת ה-BE יהיה כמעט-כולו <b>הזרקת מיעוט מהפולט</b> ולא הזרקה-נגדית מהבסיס — כלומר נצילות-הזרקה{' '}
            <Tex>{'\\gamma\\to1'}</Tex>. לכן <Tex>{'N_E\\gg N_B'}</Tex>.
          </QA>
          <QA q="4 · בפעיל-קדמי — מי מזריק, ומי קולט?">
            ה<b>פולט מזריק</b> מיעוט אל הבסיס מעל מחסום ה-BE שהונמך (ממתח קדמי). הנושאים חוצים את הבסיס הדק, וה<b>קולט
            קולט</b> אותם במורד מחסום ה-CB שהוגבה (ממתח אחורי).
          </QA>
          <QA q="5 · מה ההבדל בין npn ל-pnp?">
            רק <b>היפוך סוגי הנושאים והקטבים</b>: ב-npn הפולט מזריק <b>אלקטרונים</b> ומפעילים <Tex>{'V_{BE}>0'}</Tex>; ב-pnp
            הפולט מזריק <b>חורים</b> וכל המתחים והזרמים מתהפכים. עקרון הפעולה זהה.
          </QA>
          <QA q="6 · אם α=0.995, כמה β?">
            <Tex>{'\\beta=\\dfrac{\\alpha}{1-\\alpha}=\\dfrac{0.995}{0.005}=199'}</Tex> — זרם-בסיס קטן פי-200 מזרם-הקולט. זהו ההגבר.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
