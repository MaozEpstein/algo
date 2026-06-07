import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import BjtBandDiagram from '../components/BjtBandDiagram'
import SourceSketch from '../components/SourceSketch'

/** Lecture 3א — the two-junction band diagram, equilibrium vs forward-active. */
export default function BandsTab() {
  const [mode, setMode] = useState<'eq' | 'active'>('active')

  return (
    <div className="flex flex-col gap-5">
      <Panel title="דיאגרמת-הפסים של שני הצמתים">
        <p className="leading-relaxed text-slate-700">
          פס-ההולכה <Tex>{'E_c'}</Tex> יוצר <b>גבעה</b> מעל הבסיס ה-p — כלומר <b>מחסום בכל צומת</b>. החליפו בין{' '}
          <b>שיווי-משקל</b> ל-<b>פעיל-קדמי</b> וראו כיצד הממתח משנה את שני המחסומים:
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-slate-600">מצב:</span>
          {([
            { v: 'eq', t: 'שיווי משקל' },
            { v: 'active', t: 'פעיל-קדמי' },
          ] as const).map((b) => (
            <button
              key={b.v}
              onClick={() => setMode(b.v)}
              className={`rounded-full border px-4 py-1 text-sm font-semibold transition ${
                mode === b.v ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {b.t}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:inline-block" />
          <SourceSketch src="docs/bjt-band-diagram-source.png" title="דיאגרמת-הפסים — שרטוט המקור" download="BJT band diagram (source).png" />
        </div>
        <div className="mt-3">
          <BjtBandDiagram mode={mode} />
        </div>
      </Panel>

      <Panel title="מה רואים בפעיל-קדמי">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border-s-4 border-emerald-300 bg-emerald-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-emerald-700">1 · הזרקה</b><br />
            הצומת B-E ב<b>ממתח קדמי</b> <b>מנמיך את המחסום</b> (הפסים בפולט עולים ב-<Tex>{'qV_{BE}'}</Tex>) ← הפולט מזריק אלקטרונים אל הבסיס.
          </div>
          <div className="rounded-xl border-s-4 border-sky-300 bg-sky-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-sky-700">2 · דיפוזיה</b><br />
            הבסיס <b>דק</b> ← האלקטרונים חוצים אותו ב<b>דיפוזיה</b> כמעט בלי אובדן (פרופיל כמעט-לינארי, ירידה קלה).
          </div>
          <div className="rounded-xl border-s-4 border-violet-300 bg-violet-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-violet-700">3 · קליטה</b><br />
            הצומת C-B ב<b>ממתח אחורי</b> <b>מגביה את המחסום</b> — מורד תלול (הפסים בקולט יורדים) ← כל אלקטרון שהגיע <b>נקלט</b> כזרם-הקולט <Tex>{'I_C'}</Tex>.
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          שימו לב לפיצול רמות-פרמי: <Tex>{'E_{FE}'}</Tex> בצד הפולט גבוה ב-<Tex>{'qV_{BE}'}</Tex>, ו-<Tex>{'E_{FC}'}</Tex>{' '}
          בצד הקולט נמוך — בדיוק הממתח הקדמי והאחורי של שני הצמתים.
        </p>
      </Panel>
    </div>
  )
}
