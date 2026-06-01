import { useState } from 'react'
import Tex from '@/components/Tex'
import Panel from '../components/Panel'
import CostTree, { type CostRow } from '../components/CostTree'
import { classifyMaster, numFmt } from '../logic'

interface Preset {
  labelHe: string
  a: number
  b: number
  c: number
  k: number
}

const PRESETS: Preset[] = [
  { labelHe: 'מיון מיזוג', a: 2, b: 2, c: 1, k: 0 },
  { labelHe: 'חיפוש בינארי', a: 1, b: 2, c: 0, k: 0 },
  { labelHe: 'כפל מטריצות (נאיבי)', a: 8, b: 2, c: 2, k: 0 },
  { labelHe: 'שטראסן', a: 7, b: 2, c: 2, k: 0 },
  { labelHe: 'מקרה 3 (עלים קלים)', a: 2, b: 2, c: 2, k: 0 },
]

const CASE_LABEL: Record<1 | 2 | 3, string> = {
  1: 'מקרה 1 — שולטים העלים',
  2: 'מקרה 2 — איזון בין הרמות',
  3: 'מקרה 3 — שולט השורש',
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
          משווים את <Tex>f(n)</Tex> ל-<b>סף</b> <Tex>{'n^{\\log_b a}'}</Tex> (מספר העלים בעץ
          הרקורסיה). שלושת המקרים: <Tex>f</Tex> קטן ממנו (מקרה 1), שווה לו (מקרה 2), או גדול ממנו
          (מקרה 3).
        </p>
      </Panel>

      <Panel title="מחשבון">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.labelHe}
              onClick={() => applyPreset(p)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:border-sky-300 hover:text-sky-700"
            >
              {p.labelHe}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
          noteHe="בכל רמה i יש aⁱ צמתים בגודל n/bⁱ. סכימת העבודה a^i·f(n/b^i) על פני log_b n הרמות נותנת את התוצאה."
        />
      </Panel>
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
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <input
        type="number"
        dir="ltr"
        value={value}
        min={min}
        step={step ?? 1}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (Number.isFinite(v) && v >= min) onChange(v)
        }}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center font-mono text-sm text-slate-800 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-sm font-semibold text-slate-400">{label}</span>
      <div className="text-slate-700">{children}</div>
    </div>
  )
}
