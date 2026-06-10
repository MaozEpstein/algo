import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import MosLayerSchematic from '../components/MosLayerSchematic'
import MosBandDiagram from '../components/MosBandDiagram'
import MosChargeProfile from '../components/MosChargeProfile'
import { REGIME_ACCENT, REGIME_HE, type Regime } from '../components/regime'

const CARDS: { regime: Exclude<Regime, 'flat'>; cond: ReactNode; desc: ReactNode }[] = [
  {
    regime: 'accumulation',
    cond: <Tex>{'V_G < V_{FB}'}</Tex>,
    desc: <>מתח שלילי על השער <b>מושך נושאי-רוב</b> (חורים) אל פני-השטח Si/SiO₂. נוצרת שכבת-הצטברות של חורים, והפסים מתכופפים <b>כלפי מעלה</b> (<Tex>{'E_v'}</Tex> מתקרב ל-<Tex>{'E_F'}</Tex>).</>,
  },
  {
    regime: 'depletion',
    cond: <Tex>{'V_{FB} < V_G < V_T'}</Tex>,
    desc: <>מתח חיובי <b>דוחה את החורים</b> ומשאיר יוני-מקבל שליליים — <b>אזור דלדול</b>. הפסים מתכופפים <b>כלפי מטה</b>; ככל ש-<Tex>{'V_G'}</Tex> גדל, רוחב-הדלדול <Tex>{'W'}</Tex> גדל.</>,
  },
  {
    regime: 'inversion',
    cond: <Tex>{'V_G > V_T'}</Tex>,
    desc: <>מתח גבוה <b>מושך נושאי-מיעוט</b> (אלקטרונים) אל השפה — נוצר <b>ערוץ היפוך</b> מסוג n (הפוך מהמצע). מתחתיו אזור-דלדול בעובי מרבי <Tex>{'W_{max}'}</Tex>. כאן <Tex>{'\\psi_s=2\\phi_F'}</Tex>.</>,
  },
]

function Figure({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-1.5">
      <p className="mb-1 text-center text-[11px] font-semibold text-slate-500">{label}</p>
      {children}
    </div>
  )
}

/** Lesson 6א — the three operating regimes, each with layer schematic, band diagram and ρ(x). */
export default function RegimesTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שלושת משטרי-הפעולה">
        <p className="leading-relaxed text-slate-700">
          מתח-השער קובע את מצב המטען בפני-השטח. לכל משטר אותם שלושה תרשימים — <b>סכמת-שכבות</b>, <b>דיאגרמת-פסים</b>
          ו-<b>צפיפות-מטען</b> — מסודרים זה מתחת לזה כדי לראות את הסימטריה ביניהם.
        </p>
      </Panel>

      {CARDS.map((c) => {
        const acc = REGIME_ACCENT[c.regime]
        return (
          <Panel key={c.regime} title={`${REGIME_HE[c.regime]} — ${c.regime === 'accumulation' ? 'Accumulation' : c.regime === 'depletion' ? 'Depletion' : 'Inversion'}`}>
            <div className={`mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border-s-4 px-4 py-2 text-sm ${acc.border} ${acc.bg} ${acc.text}`}>
              <span className="font-bold">{c.cond}</span>
            </div>
            <p className="mb-3 leading-relaxed text-slate-700">{c.desc}</p>
            <div className="grid gap-3 lg:grid-cols-3">
              <Figure label="סכמת השכבות (היכן המטענים)"><MosLayerSchematic regime={c.regime} /></Figure>
              <Figure label="דיאגרמת פסים"><MosBandDiagram regime={c.regime} /></Figure>
              <Figure label={<>צפיפות מטען <Tex>{'\\rho(x)'}</Tex></>}><MosChargeProfile regime={c.regime} /></Figure>
            </div>
          </Panel>
        )
      })}
    </div>
  )
}
