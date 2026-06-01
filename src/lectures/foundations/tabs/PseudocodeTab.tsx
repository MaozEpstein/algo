import { useState } from 'react'
import Panel from '../components/Panel'
import { insertionSortBlock } from '../pseudocode'

export default function PseudocodeTab() {
  const [lang, setLang] = useState<'pseudo' | 'python'>('pseudo')
  const lines = lang === 'python' ? insertionSortBlock.pythonLines! : insertionSortBlock.lines

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו פסאודו-קוד?">
        <p className="leading-relaxed text-slate-600">
          פסאודו-קוד הוא שיטת כתיבה <b>מופשטת</b> לתיאור אלגוריתם — לא רצה במחשב, אך מיתרגמת בקלות לכל
          שפת תכנות (Python, Java, C…). הוא מאפשר להתרכז ב<b>רעיון</b> ולא בפרטי התחביר.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50 px-4 py-3">
            <span className="text-sm font-semibold text-sky-700">אינדנטציה (הזחה)</span>
            <p className="mt-1 text-sm text-slate-600">
              הזחת שורות מסמנת בלוקים — מה שייך ל-if/else ולתוך לולאות.
            </p>
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-3">
            <span className="text-sm font-semibold text-violet-700">שורות ממוספרות</span>
            <p className="mt-1 text-sm text-slate-600">
              כל שורה ממוספרת — כדי שנוכל להתייחס אליה בקלות בניתוח האלגוריתם.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="דוגמה — מיון הכנסה">
        <div className="mb-3 flex items-center justify-end">
          <div className="flex items-center gap-1 rounded-full bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => setLang('pseudo')}
              className={`rounded-full px-2.5 py-0.5 transition ${lang === 'pseudo' ? 'bg-white text-slate-800 shadow' : 'text-slate-500'}`}
            >
              פסאודו
            </button>
            <button
              onClick={() => setLang('python')}
              className={`rounded-full px-2.5 py-0.5 transition ${lang === 'python' ? 'bg-white text-slate-800 shadow' : 'text-slate-500'}`}
            >
              Python
            </button>
          </div>
        </div>
        <pre className="ltr m-0 overflow-auto rounded-xl bg-slate-50 p-3 font-mono text-[15px] leading-7" dir="ltr">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-3">
              <span className="w-6 shrink-0 select-none text-end text-xs tabular-nums text-slate-400">
                {i + 1}
              </span>
              <span className="whitespace-pre text-slate-700">{line}</span>
            </div>
          ))}
        </pre>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          שימו לב למספור השורות ולהזחה שמתארת את הלולאות. את האלגוריתם הזה רואים רץ בלשונית "מיון הכנסה".
        </p>
      </Panel>
    </div>
  )
}
