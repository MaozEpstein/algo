import { useState } from 'react'
import Tex from '@/core/components/Tex'

/**
 * CMOS technology: the n-well cross-section (an NMOS in the p-substrate beside a PMOS in an n-well)
 * and the complementary inverter. Toggle the input to see which transistor conducts and how the
 * output flips — the pair never both conduct in steady state, so static power is ~zero.
 */
export default function CmosDiagram() {
  const [hi, setHi] = useState(false) // input high?
  const out = !hi
  const nOn = hi // NMOS (pull-down) conducts when In=1
  const pOn = !hi // PMOS (pull-up) conducts when In=0

  return (
    <div className="flex flex-col gap-4">
      {/* cross-section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <p className="mb-1 text-center text-xs font-semibold text-slate-500">חתך — NMOS במצע-p ליד PMOS בבאר-n</p>
        <div className="ltr w-full" dir="ltr">
          <svg viewBox="0 0 540 210" className="mx-auto w-full" style={{ maxWidth: 540 }}>
            <rect x={2} y={2} width={536} height={206} rx={12} fill="#fcfdff" stroke="#eef2f7" />
            {/* p-substrate */}
            <rect x={30} y={90} width={480} height={90} rx={5} fill="#fce7f3" stroke="#f9a8d4" strokeWidth={1.25} />
            <text x={70} y={168} style={{ fontSize: 11, fontWeight: 700, fill: '#9d174d' }}>p-type substrate</text>
            {/* n-well (right half) */}
            <path d="M300,90 h200 v90 h-200 a70,70 0 0 1 0,-90 Z" fill="#dbeafe" stroke="#93c5fd" strokeWidth={1.25} />
            <text x={430} y={150} style={{ fontSize: 11, fontWeight: 700, fill: '#1d4ed8' }}>n-well</text>
            {/* NMOS (left): n+ s/d */}
            {[[70, 'n⁺'], [150, 'n⁺']].map(([x], i) => (
              <rect key={i} x={x as number} y={90} width={44} height={30} rx={3} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1.1} />
            ))}
            <text x={92} y={110} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#1d4ed8' }}>n⁺</text>
            <text x={172} y={110} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#1d4ed8' }}>n⁺</text>
            <rect x={112} y={72} width={44} height={9} fill="#cbd5e1" stroke="#64748b" strokeWidth={1} />
            <text x={134} y={66} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#0f172a' }}>NMOS</text>
            {/* PMOS (right): p+ s/d */}
            <rect x={360} y={90} width={44} height={30} rx={3} fill="#fbcfe8" stroke="#f472b6" strokeWidth={1.1} />
            <rect x={440} y={90} width={44} height={30} rx={3} fill="#fbcfe8" stroke="#f472b6" strokeWidth={1.1} />
            <text x={382} y={110} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#be185d' }}>p⁺</text>
            <text x={462} y={110} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#be185d' }}>p⁺</text>
            <rect x={402} y={72} width={44} height={9} fill="#cbd5e1" stroke="#64748b" strokeWidth={1} />
            <text x={424} y={66} textAnchor="middle" style={{ fontSize: 10, fontWeight: 800, fill: '#0f172a' }}>PMOS</text>
          </svg>
        </div>
      </div>

      {/* inverter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="mb-2 flex items-center justify-center gap-3">
          <span className="text-sm font-semibold text-slate-600">כניסה In:</span>
          <button
            onClick={() => setHi((v) => !v)}
            className={`rounded-xl px-4 py-1.5 text-sm font-bold transition ${hi ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
          >
            {hi ? '1 (גבוה)' : '0 (נמוך)'}
          </button>
          <span className="text-sm font-semibold text-slate-600">→ יציאה Out:</span>
          <span className={`rounded-lg px-3 py-1 text-sm font-bold ${out ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{out ? '1' : '0'}</span>
        </div>
        <div className="ltr w-full" dir="ltr">
          <svg viewBox="0 0 300 220" className="mx-auto w-full" style={{ maxWidth: 300 }}>
            {/* VDD rail */}
            <line x1={150} y1={16} x2={150} y2={44} stroke="#334155" strokeWidth={1.5} />
            <text x={150} y={12} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: '#0f172a' }}>V_DD</text>
            {/* PMOS box */}
            <rect x={120} y={44} width={60} height={44} rx={6} fill={pOn ? '#dcfce7' : '#f8fafc'} stroke={pOn ? '#16a34a' : '#94a3b8'} strokeWidth={pOn ? 2 : 1.25} />
            <text x={150} y={70} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: pOn ? '#15803d' : '#64748b' }}>PMOS {pOn ? 'מוליך' : 'סגור'}</text>
            {/* NMOS box */}
            <rect x={120} y={124} width={60} height={44} rx={6} fill={nOn ? '#dcfce7' : '#f8fafc'} stroke={nOn ? '#16a34a' : '#94a3b8'} strokeWidth={nOn ? 2 : 1.25} />
            <text x={150} y={150} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: nOn ? '#15803d' : '#64748b' }}>NMOS {nOn ? 'מוליך' : 'סגור'}</text>
            {/* series connection + output node */}
            <line x1={150} y1={88} x2={150} y2={124} stroke="#334155" strokeWidth={1.5} />
            <line x1={150} y1={106} x2={230} y2={106} stroke={out ? '#16a34a' : '#334155'} strokeWidth={1.75} />
            <circle cx={230} cy={106} r={3.5} fill="#334155" />
            <text x={238} y={110} style={{ fontSize: 11, fontWeight: 800, fill: '#0f172a' }}>Out</text>
            {/* load cap */}
            <line x1={230} y1={109} x2={230} y2={150} stroke="#334155" strokeWidth={1.25} />
            <line x1={220} y1={150} x2={240} y2={150} stroke="#334155" strokeWidth={2} />
            <line x1={222} y1={156} x2={238} y2={156} stroke="#334155" strokeWidth={2} />
            <text x={246} y={156} style={{ fontSize: 9, fill: '#64748b' }}>C_L</text>
            {/* input to both gates */}
            <line x1={70} y1={106} x2={112} y2={106} stroke="#334155" strokeWidth={1.5} />
            <line x1={112} y1={66} x2={112} y2={146} stroke="#334155" strokeWidth={1.25} />
            <line x1={112} y1={66} x2={120} y2={66} stroke="#334155" strokeWidth={1.25} />
            <line x1={112} y1={146} x2={120} y2={146} stroke="#334155" strokeWidth={1.25} />
            <circle cx={70} cy={106} r={3.5} fill="#334155" />
            <text x={44} y={110} textAnchor="middle" style={{ fontSize: 11, fontWeight: 800, fill: '#0f172a' }}>In</text>
            {/* ground */}
            <line x1={150} y1={168} x2={150} y2={190} stroke="#334155" strokeWidth={1.5} />
            <line x1={138} y1={190} x2={162} y2={190} stroke="#334155" strokeWidth={2} />
            <line x1={143} y1={195} x2={157} y2={195} stroke="#334155" strokeWidth={1.5} />
          </svg>
        </div>
        <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-600">
          המהפך בנוי מ-PMOS (משיכה-מעלה) ו-NMOS (משיכה-מטה) עם <b>אותה כניסה</b>. בכל מצב יציב <b>רק אחד מוליך</b> —
          לכן אין נתיב-זרם מ-<Tex>{'V_{DD}'}</Tex> לאדמה, וצריכת-ההספק הסטטית <b>אפסית כמעט</b>. זה הסוד של CMOS.
        </p>
      </div>
    </div>
  )
}
