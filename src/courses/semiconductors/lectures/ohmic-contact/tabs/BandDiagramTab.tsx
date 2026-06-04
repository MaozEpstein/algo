import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import OhmicBandDiagram from '../components/OhmicBandDiagram'
import { MATERIALS, METALS } from '../../../lib/junction'

const Si = MATERIALS.Si
const W = METALS.W

/**
 * Lecture 2ד — the band diagram of the two ohmic routes, toggled: 'accumulation'
 * (φ_m<φ_s, bands bend DOWN, no barrier) vs 'tunneling' (n⁺, thin barrier, electrons
 * tunnel through). The Fermi-pinning caveat explains why tunneling is the practical one.
 */
export default function BandDiagramTab() {
  const [mode, setMode] = useState<'accumulation' | 'tunneling'>('tunneling')

  return (
    <div className="flex flex-col gap-5">
      <Panel title="שני המסלולים — דיאגרמת הפסים">
        <p className="leading-relaxed text-slate-600">
          החליפו בין שני המנגנונים שמובילים למגע אוהמי:
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['accumulation', 'tunneling'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                mode === m ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {m === 'accumulation' ? '⬇️ מחסום נמוך / צבירה' : '🚇 מנהור (n⁺)'}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
          <p className="mb-1 text-center text-xs font-semibold text-slate-400">
            <span className="text-slate-500">דיאגרמת פסים · אנרגיה–מיקום</span> ·{' '}
            {mode === 'accumulation' ? 'צבירה — הפסים מתכופפים מטה, אין מחסום' : 'מנהור — מחסום דק, אלקטרונים מנהרים דרכו'}
          </p>
          <OhmicBandDiagram metal={W} mat={Si} Nd={mode === 'tunneling' ? 1e20 : 1e17} mode={mode} />
        </div>
        {mode === 'accumulation' ? (
          <p className="mt-3 rounded-lg bg-emerald-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
            כש-<Tex>{'\\varphi_m<\\varphi_s'}</Tex> אלקטרונים זורמים מהמתכת אל המל"מ, <Tex>{'E_c'}</Tex> צונח אל מתחת ל-<Tex>{'E_F'}</Tex> בממשק
            (<b>צבירה</b>), ואין מחסום — זרימה חופשית דו-כיוונית.
          </p>
        ) : (
          <p className="mt-3 rounded-lg bg-violet-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
            המחסום <Tex>{'\\varphi_B'}</Tex> עדיין קיים, אבל סימום <b>n⁺</b> מצמצם את <Tex>{'W\\propto1/\\sqrt{N_D}'}</Tex> לכדי ננומטרים —
            כך שאלקטרונים <b>מנהרים אופקית</b> דרך המחסום הדק (לא מעליו) ברמת פרמי.
          </p>
        )}
      </Panel>

      <Panel title="למה המנהור הוא הדרך המעשית?">
        <p className="leading-relaxed text-slate-600">
          מסלול ה<b>צבירה</b> דורש מתכת עם <Tex>{'\\varphi_m<\\varphi_s'}</Tex> — אבל על סיליקון <b>קיבוע רמת-פרמי</b>
          (Bardeen, מ-2ג) מקבע את המחסום כמעט בלי-תלות במתכת, כך שקשה מאוד לבטל אותו. לכן בפועל <b>לא</b> מסתמכים על
          התאמת פונקציות-עבודה אלא על <b>סימום כבד (n⁺) + מנהור</b> — וזה עובד עם כל מתכת כמעט.
        </p>
      </Panel>
    </div>
  )
}
