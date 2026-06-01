import { useState } from 'react'
import type { ReactNode } from 'react'
import Tex from '@/components/Tex'
import Panel from '../components/Panel'
import CostTree, { type CostRow } from '../components/CostTree'
import { classifyMaster, numFmt } from '../logic'

interface Preset {
  nameHe?: string
  a: number
  b: number
  c: number
  k: number
}

// 15 recurrences spanning all three cases (exported for the sanity test).
export const PRESETS: Preset[] = [
  // — case 1 (c < log_b a): leaves dominate —
  { nameHe: 'כפל שלמים (נאיבי)', a: 4, b: 2, c: 1, k: 0 },
  { nameHe: 'קרצובה', a: 3, b: 2, c: 1, k: 0 },
  { nameHe: 'טום-קוק (Toom-3)', a: 5, b: 3, c: 1, k: 0 },
  { nameHe: 'כפל מטריצות (נאיבי)', a: 8, b: 2, c: 2, k: 0 },
  { nameHe: 'שטראסן', a: 7, b: 2, c: 2, k: 0 },
  { nameHe: 'מעבר על עץ בינארי', a: 2, b: 2, c: 0, k: 0 },
  // — case 2 (c = log_b a): balanced across levels —
  { nameHe: 'מיון מיזוג', a: 2, b: 2, c: 1, k: 0 },
  { nameHe: 'חיפוש בינארי', a: 1, b: 2, c: 0, k: 0 },
  { a: 2, b: 2, c: 1, k: 1 },
  // — case 3 (c > log_b a): the root dominates —
  { nameHe: 'בחירה (ממוצע)', a: 1, b: 2, c: 1, k: 0 },
  { nameHe: 'CLRS קלאסי', a: 3, b: 4, c: 1, k: 1 },
  { a: 2, b: 2, c: 2, k: 0 },
  // edge cases for case 3:
  { nameHe: 'חזקה לא-שלמה', a: 2, b: 2, c: 1.5, k: 0 }, // c just above e=1 → Θ(n^1.5)
  { nameHe: 'גורם log נשמר', a: 2, b: 2, c: 2, k: 1 }, // case 3 keeps the log → Θ(n² log n)
  { nameHe: 'סף לא-שלם', a: 2, b: 4, c: 1, k: 0 }, // e=log_4 2=½ → Θ(n)
]

const CASE_LABEL: Record<1 | 2 | 3, string> = {
  1: 'מקרה 1 — שולטים העלים',
  2: 'מקרה 2 — איזון בין הרמות',
  3: 'מקרה 3 — שולט השורש',
}

const GROUP_TITLE: Record<1 | 2 | 3, string> = {
  1: 'מקרה 1',
  2: 'מקרה 2',
  3: 'מקרה 3',
}

// Per-case accents, matching the CaseCard / CompareChip colors.
const CASE_COLORS: Record<1 | 2 | 3, { dot: string; hover: string; active: string }> = {
  1: { dot: 'bg-violet-400', hover: 'hover:border-violet-300', active: 'border-violet-400 bg-violet-50 text-violet-800 shadow-sm' },
  2: { dot: 'bg-sky-400', hover: 'hover:border-sky-300', active: 'border-sky-400 bg-sky-50 text-sky-800 shadow-sm' },
  3: { dot: 'bg-amber-400', hover: 'hover:border-amber-300', active: 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm' },
}

function recurrenceTex(a: number, b: number, fTex: string): string {
  const head = a === 1 ? `T(n/${numFmt(b)})` : `${numFmt(a)}\\,T(n/${numFmt(b)})`
  return `${head} + ${fTex}`
}

function sizeTexAt(b: number, i: number): string {
  if (i === 0) return 'n'
  if (i === 1) return `n/${numFmt(b)}`
  return `n/${numFmt(b)}^{${i}}`
}

export default function MasterTab() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(2)
  const [c, setC] = useState(1)
  const [k, setK] = useState(0)

  const r = classifyMaster({ a, b, c, k })

  const rows: CostRow[] = [0, 1, 2, 3].map((i) => ({
    i,
    nodes: Math.round(a ** i),
    sizeTex: sizeTexAt(b, i),
    levelCostTex: i === 0 ? 'f(n)' : `${numFmt(a)}^{${i}}\\,f(${sizeTexAt(b, i)})`,
  }))

  const applyPreset = (p: Preset) => {
    setA(p.a)
    setB(p.b)
    setC(p.c)
    setK(p.k)
  }

  const groups: (1 | 2 | 3)[] = [1, 2, 3]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="שיטת האב (Master Theorem)">
        <p className="leading-relaxed text-slate-600">
          שיטת האב נותנת פתרון "מהיר" לנוסחאות מהצורה הבאה, ללא פיתוח ידני:
        </p>
        <div className="my-3">
          <Tex block>{'T(n) = a\\,T(n/b) + f(n), \\quad a \\ge 1,\\; b > 1'}</Tex>
        </div>
        <p className="leading-relaxed text-slate-600">
          הרעיון: משווים את עלות העבודה ברמה אחת, <Tex>f(n)</Tex>, ל<b>סף</b>{' '}
          <Tex>{'n^{\\log_b a}'}</Tex> — שהוא בדיוק מספר העלים בעץ הרקורסיה.
        </p>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-4">
          <span className="text-sm font-semibold text-slate-700">איך בוחרים מקרה?</span>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            משווים את עלות הרמה <Tex>f(n)</Tex> לסף <Tex>{'n^{\\log_b a}'}</Tex> (מספר העלים בעץ):
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <CompareChip cmpTex="f(n) < n^{\\log_b a}" caseHe="מקרה 1" color="violet" />
            <CompareChip cmpTex="f(n) = n^{\\log_b a}" caseHe="מקרה 2" color="sky" />
            <CompareChip cmpTex="f(n) > n^{\\log_b a}" caseHe="מקרה 3" color="amber" />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            שימו לב: במקרים 1 ו-3 נדרש <b>פער פולינומי</b> — קבוע <Tex>{'\\varepsilon > 0'}</Tex> —
            ולא רק אי-שוויון.
          </p>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <CaseCard
            badge={CASE_LABEL[1]}
            color="violet"
            when={
              <>
                <Tex>f(n)</Tex> קטן מהסף <Tex>{'n^{\\log_b a}'}</Tex>.
              </>
            }
            who="העלים שולטים — רוב העבודה בתחתית העץ."
            resultTex={'\\Theta(n^{\\log_b a})'}
          />
          <CaseCard
            badge={CASE_LABEL[2]}
            color="sky"
            when={
              <>
                <Tex>f(n)</Tex> שווה לסף <Tex>{'n^{\\log_b a}'}</Tex>.
              </>
            }
            who="כל הרמות תורמות עלות שווה — מוסיפים גורם log אחד."
            resultTex={'\\Theta(n^{\\log_b a}\\log^{k+1} n)'}
          />
          <CaseCard
            badge={CASE_LABEL[3]}
            color="amber"
            when={
              <>
                <Tex>f(n)</Tex> גדול מהסף <Tex>{'n^{\\log_b a}'}</Tex>.
              </>
            }
            who="השורש שולט — רוב העבודה בקריאה העליונה."
            resultTex={'\\Theta(f(n))'}
          />
        </div>
      </Panel>

      <Panel title="דוגמאות מוכנות">
        <p className="mb-3 text-sm leading-relaxed text-slate-500">
          לחצו על דוגמה כדי לטעון את הפרמטרים שלה — ואז עקבו אחר הניתוח במחשבון שלמטה. אפשר גם להזין
          פרמטרים ידנית.
        </p>
        <div className="flex flex-col gap-4">
          {groups.map((cn) => {
            const items = PRESETS.filter((p) => classifyMaster(p).caseNo === cn)
            const col = CASE_COLORS[cn]
            return (
              <div key={cn} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-slate-500">
                    {GROUP_TITLE[cn]}
                  </span>
                  <span className="text-xs text-slate-400">· {items.length} דוגמאות</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {items.map((p, i) => {
                    const fTex = classifyMaster(p).fTex
                    const active = p.a === a && p.b === b && p.c === c && p.k === k
                    return (
                      <button
                        key={i}
                        onClick={() => applyPreset(p)}
                        className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-2 transition ${
                          active
                            ? col.active
                            : `border-slate-200 bg-white text-slate-700 ${col.hover}`
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          {p.nameHe ?? ' '}
                        </span>
                        <Tex>{recurrenceTex(p.a, p.b, fTex)}</Tex>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

      </Panel>

      <Panel title="מחשבון">
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800">
          <span aria-hidden>✏️</span>
          <span>הזינו או שנו כל ערך (גם בעזרת + / −) — הניתוח מתעדכן מיד.</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <NumField label="a (תת-בעיות)" value={a} min={1} onChange={setA} />
          <NumField label="b (יחס הקטנה)" value={b} min={2} onChange={setB} />
          <NumField label="c (חזקת n ב-f)" value={c} min={0} step={0.5} onChange={setC} />
          <NumField label="k (חזקת log ב-f)" value={k} min={0} onChange={setK} />
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <Row label="הנוסחה">
            <Tex>{`T(n) = ${numFmt(a)}\\,T(n/${numFmt(b)}) + ${r.fTex}`}</Tex>
          </Row>
          <Row label="הסף">
            <Tex>{`n^{\\log_{${numFmt(b)}} ${numFmt(a)}} = ${r.watershedTex}${r.eApproxTex}`}</Tex>
          </Row>
          <Row label="משווים">
            <span className="flex items-center gap-2">
              <Tex>{`f(n) = ${r.fTex}`}</Tex>
              <span className="text-slate-400">↔</span>
              <Tex>{r.watershedTex}</Tex>
            </span>
          </Row>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-700">
            {CASE_LABEL[r.caseNo]}
          </span>
          <span className="text-sm text-slate-400">⟸</span>
          <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-base text-white">
            <Tex>{`T(n) = ${r.resultTex}`}</Tex>
          </span>
        </div>
        <p className="mt-3 leading-relaxed text-slate-500">{r.reasonHe}</p>
      </Panel>

      <Panel title="עץ הרקורסיה">
        <CostTree
          rows={rows}
          totalTex={`T(n) = ${r.resultTex}`}
          dominant={r.caseNo === 1 ? 'leaves' : r.caseNo === 3 ? 'root' : 'balanced'}
          noteHe={
            r.caseNo === 1
              ? 'מקרה 1: ככל שיורדים, מספר הצמתים גדל מהר יותר מהירידה בעבודה לכל צומת — ולכן רוב העלות מצטברת בעלים (הרמה התחתונה, המודגשת).'
              : r.caseNo === 3
                ? 'מקרה 3: העבודה לכל צומת יורדת מהר יותר ממספר הצמתים שגדל — ולכן רוב העלות מצטברת בשורש (הרמה העליונה, המודגשת).'
                : 'מקרה 2: בכל רמה העלות הכוללת זהה — לכן כל הרמות מודגשות באותה עוצמה, והתוצאה מוכפלת במספר הרמות (log).'
          }
        />
      </Panel>
    </div>
  )
}

function CompareChip({
  cmpTex,
  caseHe,
  color,
}: {
  cmpTex: string
  caseHe: string
  color: 'violet' | 'sky' | 'amber'
}) {
  const cls = {
    violet: 'border-violet-200 bg-violet-50 text-violet-700',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
  }[color]
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 ${cls}`}>
      <span className="text-base">
        <Tex>{cmpTex}</Tex>
      </span>
      <span className="text-xs font-bold">{caseHe}</span>
    </div>
  )
}

function CaseCard({
  badge,
  color,
  when,
  who,
  resultTex,
}: {
  badge: string
  color: 'violet' | 'sky' | 'amber'
  when: ReactNode
  who: string
  resultTex: string
}) {
  const ring = {
    violet: 'border-violet-200 bg-violet-50/40',
    sky: 'border-sky-200 bg-sky-50/40',
    amber: 'border-amber-200 bg-amber-50/40',
  }[color]
  const chip = {
    violet: 'bg-violet-100 text-violet-700',
    sky: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
  }[color]

  return (
    <div className={`flex flex-col gap-2 rounded-2xl border p-4 ${ring}`}>
      <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${chip}`}>{badge}</span>
      <div>
        <span className="text-xs font-semibold text-slate-400">מתי?</span>
        <p className="text-sm leading-relaxed text-slate-600">{when}</p>
      </div>
      <div>
        <span className="text-xs font-semibold text-slate-400">מי שולט?</span>
        <p className="text-sm leading-relaxed text-slate-600">{who}</p>
      </div>
      <div className="mt-auto flex items-center gap-2 pt-1">
        <span className="text-xs font-semibold text-slate-400">תוצאה:</span>
        <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-sm text-white">
          <Tex>{resultTex}</Tex>
        </span>
      </div>
    </div>
  )
}

function NumField({
  label,
  value,
  min,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  step?: number
  onChange: (v: number) => void
}) {
  const s = step ?? 1
  const clamp = (v: number) => Number(Math.max(min, v).toFixed(2))
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div
        dir="ltr"
        className="flex items-stretch overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100"
      >
        <button
          type="button"
          aria-label="הפחתה"
          onClick={() => onChange(clamp(value - s))}
          className="grid w-9 place-items-center text-lg font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-sky-600"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          min={min}
          step={s}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (Number.isFinite(v) && v >= min) onChange(v)
          }}
          className="w-full border-x border-slate-200 bg-transparent py-2 text-center font-mono text-base text-slate-800 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label="הגדלה"
          onClick={() => onChange(clamp(value + s))}
          className="grid w-9 place-items-center text-lg font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-sky-600"
        >
          +
        </button>
      </div>
    </label>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sm font-semibold text-slate-400">{label}</span>
      <div className="text-slate-700">{children}</div>
    </div>
  )
}
