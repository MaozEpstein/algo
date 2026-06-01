import { useState } from 'react'
import Tex from '@/components/Tex'
import Panel from '../components/Panel'
import UnrollStepper, { type UnrollStep } from '../components/UnrollStepper'
import CostTree, { type CostRow } from '../components/CostTree'

interface Preset {
  id: string
  labelHe: string
  recurrenceTex: string
  steps: UnrollStep[]
  resultTex: string
  tree?: { rows: CostRow[]; totalTex: string; noteHe: string }
}

const SIZE = ['n', 'n/2', 'n/4', 'n/8']

const PRESETS: Preset[] = [
  {
    id: 'binary',
    labelHe: 'חיפוש בינארי',
    recurrenceTex: 'T(n) = T(n/2) + c',
    steps: [
      { tex: 'T(n) = T(n/2) + c' },
      { tex: 'T(n) = \\big(T(n/4) + c\\big) + c = T(n/4) + 2c' },
      { tex: 'T(n) = T(n/8) + 3c' },
      { tex: 'T(n) = T(n/2^{\\,i}) + i\\,c', noteHe: 'הדפוס הכללי' },
      { tex: 'T(n) = T(1) + c\\log n', noteHe: 'כש-n/2^{\\,i}=1, כלומר i=\\log n' },
    ],
    resultTex: '\\Theta(\\log n)',
    tree: {
      rows: SIZE.map((s, i) => ({ i, nodes: 1, sizeTex: s, levelCostTex: 'c' })),
      totalTex: 'c(\\log n + 1) = \\Theta(\\log n)',
      noteHe: 'צומת יחיד בכל רמה, ועומק העץ הוא log n — לכן הסכום הוא Θ(log n).',
    },
  },
  {
    id: 'bubble',
    labelHe: 'מיון בועות',
    recurrenceTex: 'T(n) = T(n-1) + c\\,n',
    steps: [
      { tex: 'T(n) = T(n-1) + c\\,n' },
      { tex: 'T(n) = T(n-2) + c(n-1) + c\\,n' },
      { tex: 'T(n) = T(n-3) + c(n-2) + c(n-1) + c\\,n' },
      { tex: 'T(n) = T(0) + c\\big(1 + 2 + \\dots + n\\big)', noteHe: 'סכום סדרה חשבונית' },
      { tex: 'T(n) = c\\cdot\\frac{n(n+1)}{2}', noteHe: '= \\Theta(n^2)' },
    ],
    resultTex: '\\Theta(n^2)',
  },
  {
    id: 'merge',
    labelHe: 'מיון מיזוג',
    recurrenceTex: 'T(n) = 2T(n/2) + c\\,n',
    steps: [
      { tex: 'T(n) = 2T(n/2) + c\\,n' },
      { tex: 'T(n) = 2\\big(2T(n/4) + c\\tfrac{n}{2}\\big) + c\\,n = 4T(n/4) + 2c\\,n' },
      { tex: 'T(n) = 8T(n/8) + 3c\\,n' },
      { tex: 'T(n) = 2^{\\,i}\\,T(n/2^{\\,i}) + i\\,c\\,n', noteHe: 'הדפוס הכללי' },
      { tex: 'T(n) = n\\,T(1) + c\\,n\\log n', noteHe: 'כש-i=\\log n' },
    ],
    resultTex: '\\Theta(n\\log n)',
    tree: {
      rows: SIZE.map((s, i) => ({
        i,
        nodes: 2 ** i,
        sizeTex: s,
        levelCostTex: 'c\\,n',
      })),
      totalTex: 'c\\,n(\\log n + 1) = \\Theta(n\\log n)',
      noteHe: 'הקסם: בכל רמה העלות הכוללת היא cn (יותר צמתים — אך קטנים יותר). יש log n רמות.',
    },
  },
]

export default function IterationTab() {
  const [id, setId] = useState(PRESETS[0].id)
  const preset = PRESETS.find((p) => p.id === id)!

  return (
    <div className="flex flex-col gap-5">
      <Panel title="שיטת האיטרציה (Iteration)">
        <p className="leading-relaxed text-slate-600">
          בשיטת האיטרציה <b>מציבים את הנוסחה בתוך עצמה</b> שוב ושוב, עד שמזהים דפוס ומגיעים לתנאי
          הבסיס. אז סוכמים את העלויות של כל הרמות. אין צורך לנחש מראש — אך לעיתים נדרשת עבודה
          אלגברית.
        </p>
      </Panel>

      <Panel title="בחרו נוסחה ופתחו אותה">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setId(p.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                p.id === id
                  ? 'border-sky-500 bg-sky-500 text-white shadow'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {p.labelHe}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-slate-600">
          <span className="text-sm">הנוסחה:</span>
          <Tex>{preset.recurrenceTex}</Tex>
        </div>
        <div className="mt-3">
          <UnrollStepper key={preset.id} steps={preset.steps} resultTex={preset.resultTex} />
        </div>
      </Panel>

      {preset.tree && (
        <Panel title="עץ הרקורסיה — עלות לפי רמות">
          <CostTree
            rows={preset.tree.rows}
            totalTex={preset.tree.totalTex}
            noteHe={preset.tree.noteHe}
          />
        </Panel>
      )}
    </div>
  )
}
