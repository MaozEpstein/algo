import { useState } from 'react'
import Tex from '@/core/components/Tex'
import BjtModeDiagram from './BjtModeDiagram'

/**
 * Interactive operating-mode selector. Two toggles set the bias of each junction
 * (E-B and B-C, forward/reverse); the matching row of the four-mode table lights up,
 * and a compact npn schematic tints each junction green (forward) / blue (reverse).
 * The four combinations are exactly cutoff / forward-active / saturation / reverse-
 * active. Self-contained (own state).
 */
const ROWS = [
  { beF: false, bcF: false, mode: 'קטעון', en: 'Cut-off', use: 'מפסק פתוח — זרם אפסי' },
  { beF: true, bcF: false, mode: 'פעיל-קדמי', en: 'Forward-Active', use: 'מגבר ליניארי' },
  { beF: true, bcF: true, mode: 'רוויה', en: 'Saturation', use: 'מפסק סגור' },
  { beF: false, bcF: true, mode: 'פעיל-הפוך', en: 'Reverse-Active', use: 'הגבר נמוך מאוד' },
]

function Toggle({ label, on, onLabel, offLabel, set }: { label: string; on: boolean; onLabel: string; offLabel: string; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-sm font-semibold text-slate-600">{label}</span>
      {[
        { v: true, t: onLabel },
        { v: false, t: offLabel },
      ].map((b) => (
        <button
          key={String(b.v)}
          onClick={() => set(b.v)}
          className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
            on === b.v
              ? b.v
                ? 'border-emerald-500 bg-emerald-500 text-white shadow'
                : 'border-blue-500 bg-blue-500 text-white shadow'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
          }`}
        >
          {b.t}
        </button>
      ))}
    </div>
  )
}

export default function BiasModeSelector() {
  const [beF, setBeF] = useState(true)
  const [bcF, setBcF] = useState(false)
  const activeIdx = ROWS.findIndex((r) => r.beF === beF && r.bcF === bcF)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <button
          onClick={() => { setBeF(true); setBcF(false) }}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold transition ${
            beF && !bcF ? 'border-emerald-600 bg-emerald-600 text-white shadow' : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          <span aria-hidden>⚡</span> מצב הולכה
        </button>
        <Toggle label="צומת B-E" on={beF} onLabel="קדמי" offLabel="אחורי" set={setBeF} />
        <Toggle label="צומת C-B" on={bcF} onLabel="קדמי" offLabel="אחורי" set={setBcF} />
        <p className="text-xs leading-relaxed text-slate-500">
          <span className="font-semibold text-emerald-600">ירוק</span> = ממתח קדמי,{' '}
          <span className="font-semibold text-blue-600">כחול</span> = ממתח אחורי. «מצב הולכה» = פעיל-קדמי.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <BjtModeDiagram beF={beF} bcF={bcF} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-600">
              <th className="px-3 py-2 font-semibold">צומת B-E</th>
              <th className="px-3 py-2 font-semibold">צומת C-B</th>
              <th className="px-3 py-2 font-semibold">מצב הפעולה</th>
              <th className="px-3 py-2 font-semibold">שימוש עיקרי</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => {
              const on = i === activeIdx
              return (
                <tr key={i} className={`border-t border-slate-100 transition ${on ? 'bg-violet-50' : 'bg-white'}`}>
                  <td className={`px-3 py-2 font-medium ${r.beF ? 'text-emerald-700' : 'text-blue-700'}`}>{r.beF ? 'קדמי' : 'אחורי'}</td>
                  <td className={`px-3 py-2 font-medium ${r.bcF ? 'text-emerald-700' : 'text-blue-700'}`}>{r.bcF ? 'קדמי' : 'אחורי'}</td>
                  <td className="px-3 py-2">
                    <span className={`font-bold ${on ? 'text-violet-800' : 'text-slate-700'}`}>{r.mode}</span>
                    <span className="ms-1 text-xs text-slate-400" dir="ltr">{r.en}</span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {r.use}
                    {r.mode === 'רוויה' && (
                      <span className="ms-1 text-xs text-slate-400" dir="ltr"><Tex>{'V_{CE,\\mathrm{sat}}\\approx0.2\\,V'}</Tex></span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
