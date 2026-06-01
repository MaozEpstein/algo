import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'
import Tex from '@/core/components/Tex'
import Chart, { type ChartSeries } from '@/core/viz/Chart'
import Panel from '../components/Panel'
import { GROWTH_FNS, sample, fmtValue } from '../growth'

const N_MAX = 16

const NOTATIONS: { sym: string; nameHe: string; tex: string; color: string }[] = [
  { sym: 'O', nameHe: 'חסם עליון', tex: 'f(n) \\le c\\cdot g(n)', color: 'border-sky-300 bg-sky-50' },
  { sym: 'Ω', nameHe: 'חסם תחתון', tex: 'f(n) \\ge c\\cdot g(n)', color: 'border-amber-300 bg-amber-50' },
  { sym: 'Θ', nameHe: 'חסם הדוק', tex: 'c_1 g(n) \\le f(n) \\le c_2 g(n)', color: 'border-emerald-300 bg-emerald-50' },
]

const CHEAT: { tex: string; he: string }[] = [
  { tex: 'O(1)', he: 'גישה לאיבר במערך' },
  { tex: 'O(\\log n)', he: 'חיפוש בינארי' },
  { tex: 'O(n)', he: 'מעבר על מערך / מציאת מינימום' },
  { tex: 'O(n\\log n)', he: 'מיון יעיל (מיזוג / ערימה)' },
  { tex: 'O(n^2)', he: 'מיון הכנסה / בועות' },
  { tex: 'O(2^n)', he: 'פתרון רקורסיבי תמים (פיבונאצ׳י)' },
]

export default function ComplexityTab() {
  const [logScale, setLogScale] = useState(true)
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [cursor, setCursor] = useState(8)

  const visibleFns = GROWTH_FNS.filter((f) => !hidden.has(f.key))
  const series: ChartSeries[] = visibleFns.map((f) => ({
    label: f.label,
    color: f.color,
    points: sample(f.fn, N_MAX),
  }))

  // O/Θ/Ω "sandwich": f(n)=n²+8n is Θ(n²) — bounded by 1·n² and 2·n² beyond n₀=8.
  const sandwich: ChartSeries[] = [
    { label: '2·n²', color: '#cbd5e1', points: sample((n) => 2 * n * n, 20), dashed: true },
    { label: 'f(n)=n²+8n', color: '#0ea5e9', points: sample((n) => n * n + 8 * n, 20) },
    { label: 'n²', color: '#cbd5e1', points: sample((n) => n * n, 20), dashed: true },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהי סיבוכיות?">
        <p className="leading-relaxed text-slate-600">
          סיבוכיות = <b>כמות העבודה</b> שאלגוריתם מבצע, כפונקציה של <b>גודל הקלט</b> n.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          סופרים <b>פעולות בסיסיות</b> (השוואה, השמה, פעולת חשבון) — כל אחת בזמן קבוע שאינו תלוי בגודל
          הקלט.
        </p>
        <p className="mt-2 leading-relaxed text-slate-600">
          מתרכזים ב<b>מקרה הגרוע</b> וב<b>התנהגות אסימפטוטית</b> (n גדול), ו<b>מתעלמים מקבועים</b> — כי
          הם משתנים בין מחשבים, בעוד קצב הגדילה הוא תכונה של האלגוריתם עצמו.
        </p>
      </Panel>

      <Panel title="סימון אסימפטוטי — O · Θ · Ω">
        <p className="mb-3 leading-relaxed text-slate-600">
          קיימים קבוע <Tex>c &gt; 0</Tex> ו-<Tex>n_0</Tex> כך שלכל <Tex>n &gt; n_0</Tex>:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {NOTATIONS.map((nt) => (
            <div key={nt.sym} className={`rounded-2xl border p-4 ${nt.color}`}>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-slate-800">{nt.sym}</span>
                <span className="text-sm font-semibold text-slate-600">{nt.nameHe}</span>
              </div>
              <div className="mt-2">
                <Tex block>{nt.tex}</Tex>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="קצב גדילה — לראות את ההבדל">
        <p className="mb-3 leading-relaxed text-slate-600">
          ככל ש-n גדל, מחלקות הסיבוכיות מתפצלות דרמטית. שנו את הסקאלה, הדליקו/כבו עקומות, וגררו את הסמן
          כדי לראות את הערך בכל n.
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {GROWTH_FNS.map((f) => {
            const on = !hidden.has(f.key)
            return (
              <button
                key={f.key}
                onClick={() =>
                  setHidden((h) => {
                    const next = new Set(h)
                    if (next.has(f.key)) next.delete(f.key)
                    else next.add(f.key)
                    return next
                  })
                }
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  on ? 'border-slate-300 bg-white text-slate-700' : 'border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: on ? f.color : '#cbd5e1' }} />
                <span dir="ltr" className="ltr">{f.label}</span>
              </button>
            )
          })}
          <button
            onClick={() => setLogScale((v) => !v)}
            className="ms-auto rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-sky-300"
          >
            סקאלה: {logScale ? 'לוגריתמית' : 'לינארית'}
          </button>
        </div>
        <Chart series={series} yScale={logScale ? 'log' : 'linear'} xLabel="n" markers={[{ x: cursor, label: `n=${cursor}` }]} />
        <div dir="ltr" className="ltr mt-3 flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={N_MAX}
            value={cursor}
            onChange={(e) => setCursor(Number(e.target.value))}
            className="scrubber h-3 w-full cursor-pointer appearance-none rounded-full ring-1 ring-slate-200"
            style={{ background: '#e2e8f0' }}
            aria-label="ערך n"
          />
        </div>
        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
          {visibleFns.map((f) => (
            <span key={f.key} className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: f.color }} />
              <span dir="ltr" className="ltr font-mono">
                {f.label} = {fmtValue(f.fn(cursor))}
              </span>
            </span>
          ))}
        </div>
      </Panel>

      <Panel title="המשמעות של Θ — &quot;כלוא בין שני קבועים&quot;">
        <p className="leading-relaxed text-slate-600">
          <Tex>f = \Theta(g)</Tex> אומר שמ-<Tex>n_0</Tex> והלאה, <Tex>f(n)</Tex> כלוא בין{' '}
          <Tex>c_1 g(n)</Tex> ל-<Tex>c_2 g(n)</Tex>.
        </p>
        <p className="mb-3 mt-2 leading-relaxed text-slate-600">
          בדוגמה: <Tex>{'f(n)=n^2+8n=\\Theta(n^2)'}</Tex> — מעבר ל-<Tex>n_0=8</Tex> הוא נשאר בין{' '}
          <Tex>n^2</Tex> ל-<Tex>2n^2</Tex>.
        </p>
        <Chart series={sandwich} yScale="linear" xLabel="n" markers={[{ x: 8, label: 'n₀' }]} />
      </Panel>

      <Panel title="סיבוכיות נפוצות — וזכרון">
        <div className="grid gap-2 sm:grid-cols-2">
          {CHEAT.map((c) => (
            <div key={c.tex} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
              <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-white">
                <Tex>{c.tex}</Tex>
              </span>
              <span className="text-sm text-slate-600">{c.he}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-s-4 border-violet-300 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          <span>💡 איך מנתחים סיבוכיות של אלגוריתם רקורסיבי? בעזרת נוסחאות נסיגה.</span>
          <Link
            to={lecturePath('algorithms', 'recurrences', { tab: 'iteration' })}
            className="shrink-0 rounded-lg border border-violet-300 bg-white px-3 py-1.5 font-semibold text-violet-700 transition hover:bg-violet-100"
          >
            ↪ נוסחאות נסיגה (שיעור 3ב)
          </Link>
        </div>
      </Panel>
    </div>
  )
}
