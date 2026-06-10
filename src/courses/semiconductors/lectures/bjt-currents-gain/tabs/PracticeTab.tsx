import { useState, type ReactNode } from 'react'
import { usePrintMode } from '@/core/platform/printMode'
import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'

function QA({ q, children }: { q: string; children: ReactNode }) {
  const [show, setShow] = useState(usePrintMode())
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

/** Lecture 3ב — conceptual & numeric practice on currents and gain. */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שאלות">
        <div className="flex flex-col gap-3">
          <QA q="1 · נתון $\alpha=0.98$. מהו $\beta$?">
            <Tex>{'\\beta=\\dfrac{\\alpha}{1-\\alpha}=\\dfrac{0.98}{0.02}=49'}</Tex>.
          </QA>
          <QA q="2 · נתונים $\gamma=0.990$ ו-$b=0.995$. חשבו $\alpha$ ו-$\beta$.">
            <Tex>{'\\alpha=\\gamma b=0.990\\times0.995=0.985'}</Tex>; ‏<Tex>{'\\beta=0.985/0.015\\approx66'}</Tex>.
          </QA>
          <QA q="3 · מדוע רוצים שהפולט יהיה מסומם הרבה יותר מהבסיס?">
            כדי שזרם-הפולט יהיה כמעט-כולו <b>הזרקת אלקטרונים מועילה</b> (<Tex>{'I_{nE}'}</Tex>) ולא הזרקה-נגדית של חורים — כלומר נצילות-הזרקה{' '}
            <Tex>{'\\gamma\\to1'}</Tex>. הנוסחה: <Tex>{'\\gamma=1/(1+\\frac{N_B D_E W_B}{N_E D_B W_E})'}</Tex>, ו-<Tex>{'N_E\\gg N_B'}</Tex> מקטין את האיבר.
          </QA>
          <QA q="4 · מדוע $\beta$ רגיש כל-כך לערך של $\alpha$?">
            כי <Tex>{'I_B=(1-\\alpha)I_E'}</Tex> הוא <b>הפרש קטן</b> בין שני זרמים גדולים כמעט-שווים (<Tex>{'I_E,I_C'}</Tex>). שינוי זעיר ב-<Tex>{'\\alpha'}</Tex> משנה את ההפרש באחוזים רבים, ולכן את <Tex>{'\\beta=I_C/I_B'}</Tex> דרמטית.
          </QA>
          <QA q="5 · באופייני המוצא — כיצד מזהים את $\beta$, וכיצד מזהים רוויה?">
            <b><Tex>{'\\beta'}</Tex></b>: המרווח בין עקומות עוקבות (לקפיצות <Tex>{'I_B'}</Tex> שוות) — מרווח גדול = <Tex>{'\\beta'}</Tex> גדול. <b>רוויה</b>: התחום שבו <Tex>{'V_{CE}'}</Tex> קטן (<Tex>{'\\lesssim0.2\\,V'}</Tex>) והעקומות צונחות לאפס.
          </QA>
          <QA q="6 · מהי תכונת ההדדיות של מודל Ebers-Moll?">
            <Tex>{'\\alpha_F I_{ES}=\\alpha_R I_{CS}'}</Tex> — ולכן די בשלושה פרמטרים (<Tex>{'\\alpha_F,\\alpha_R,I_{ES}'}</Tex>) לתיאור מלא של ההתקן.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
