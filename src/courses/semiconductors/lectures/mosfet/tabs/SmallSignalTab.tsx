import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 7א small-signal — g_m, ideal g_ds=0, the equivalent circuit, and the load line. */
export default function SmallSignalTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מודל אותות-קטנים — מוליכות-המעבר">
        <p className="leading-relaxed text-slate-700">
          סביב נקודת-עבודה, אות-שער קטן <Tex>{'v_{gs}'}</Tex> מייצר אות-זרם <Tex>{'i_{ds}=g_m v_{gs}'}</Tex>. מוליכות-המעבר
          {' '}<Tex>{'g_m=\\partial I_{DS}/\\partial V_{GS}'}</Tex> תלויה במשטר:
        </p>
        <div className="my-3 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-semibold text-slate-500">רוויה</span>
            <div className="mt-1"><Tex block>{'g_m=k(V_{GS}-V_T)=\\sqrt{2k\\,I_{DS}}'}</Tex></div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="text-xs font-semibold text-slate-500">טריודה</span>
            <div className="mt-1"><Tex block>{'g_m=k\\,V_{DS}'}</Tex></div>
          </div>
        </div>
      </Panel>

      <Panel title="המעגל השקול ומוליכות-המוצא">
        <div className="grid items-center gap-4 sm:grid-cols-2">
          <div className="ltr" dir="ltr">
            <svg viewBox="0 0 320 200" className="mx-auto w-full" style={{ maxWidth: 320 }}>
              <rect x={2} y={2} width={316} height={196} rx={12} fill="#fcfdff" stroke="#eef2f7" />
              {/* gate node (open — no gate current) */}
              <line x1={30} y1={60} x2={90} y2={60} stroke="#334155" strokeWidth={1.5} />
              <circle cx={30} cy={60} r={3} fill="#334155" />
              <text x={22} y={54} textAnchor="end" style={{ fontSize: 12, fontWeight: 800, fill: '#0f172a' }}>G</text>
              <text x={60} y={50} textAnchor="middle" style={{ fontSize: 10, fill: '#64748b' }}>v_gs</text>
              {/* controlled source g_m v_gs between D and S */}
              <circle cx={200} cy={95} r={26} fill="#fff" stroke="#0284c7" strokeWidth={1.75} />
              <text x={200} y={99} textAnchor="middle" style={{ fontSize: 11, fontWeight: 700, fill: '#0284c7' }}>g_m·v_gs</text>
              {/* drain */}
              <line x1={200} y1={69} x2={200} y2={40} stroke="#334155" strokeWidth={1.5} />
              <line x1={200} y1={40} x2={280} y2={40} stroke="#334155" strokeWidth={1.5} />
              <circle cx={280} cy={40} r={3} fill="#334155" />
              <text x={288} y={44} style={{ fontSize: 12, fontWeight: 800, fill: '#0f172a' }}>D</text>
              {/* source rail */}
              <line x1={200} y1={121} x2={200} y2={160} stroke="#334155" strokeWidth={1.5} />
              <line x1={30} y1={160} x2={280} y2={160} stroke="#334155" strokeWidth={1.5} />
              <circle cx={280} cy={160} r={3} fill="#334155" />
              <text x={288} y={164} style={{ fontSize: 12, fontWeight: 800, fill: '#0f172a' }}>S</text>
              {/* r_o (dashed — infinite in the ideal device) */}
              <line x1={250} y1={40} x2={250} y2={160} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={258} y={104} style={{ fontSize: 10, fontWeight: 700, fill: '#b45309' }}>r_o</text>
            </svg>
          </div>
          <div className="leading-relaxed text-slate-700">
            <p>
              הכניסה (שער) היא <b>מבודדת</b> — אין זרם-שער. מקור-הזרם המבוקר <Tex>{'g_m v_{gs}'}</Tex> מזרים בין ניקוז למקור.
            </p>
            <p className="mt-2">
              מוליכות-המוצא <Tex>{'g_{ds}=\\partial I_{DS}/\\partial V_{DS}'}</Tex> היא <b>אפס בהתקן האידיאלי</b> ברוויה
              (מישור שטוח) → <Tex>{'r_o\\to\\infty'}</Tex>. בהתקן אמיתי (חלק ב׳) התקצרות-התעלה נותנת <Tex>{'r_o'}</Tex> סופי.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="קו-העומס (NMOS עם נגד-ניקוז)">
        <div className="grid items-center gap-4 sm:grid-cols-2">
          <div className="ltr" dir="ltr">
            <svg viewBox="0 0 320 220" className="mx-auto w-full" style={{ maxWidth: 320 }}>
              <rect x={2} y={2} width={316} height={216} rx={12} fill="#fcfdff" stroke="#eef2f7" />
              {/* axes */}
              <line x1={40} y1={190} x2={300} y2={190} stroke="#cbd5e1" strokeWidth={1.25} />
              <line x1={40} y1={190} x2={40} y2={20} stroke="#cbd5e1" strokeWidth={1.25} />
              <text x={300} y={186} textAnchor="end" style={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}>V_DS →</text>
              <text x={34} y={26} textAnchor="end" style={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}>I_DS</text>
              {/* transistor output curves */}
              {[0.4, 0.62, 0.85].map((f, i) => (
                <path key={i} d={`M40,190 Q ${60 + i * 8},${190 - 150 * f} ${120 + i * 20},${190 - 150 * f} L 300,${190 - 150 * f - 6}`} fill="none" stroke="#93c5fd" strokeWidth={1.75} />
              ))}
              {/* load line: from (V_DD,0) to (0, V_DD/R_D) */}
              <line x1={280} y1={190} x2={40} y2={40} stroke="#059669" strokeWidth={2} />
              <text x={278} y={186} textAnchor="end" style={{ fontSize: 9.5, fontWeight: 700, fill: '#047857' }}>V_DD</text>
              <text x={48} y={44} style={{ fontSize: 9.5, fontWeight: 700, fill: '#047857' }}>V_DD/R_D</text>
              {/* operating point */}
              <circle cx={150} cy={190 - 150 * 0.62} r={4} fill="#e11d48" stroke="#fff" strokeWidth={1.5} />
              <text x={150} y={190 - 150 * 0.62 - 8} textAnchor="middle" style={{ fontSize: 9, fontWeight: 800, fill: '#e11d48' }}>Q</text>
            </svg>
          </div>
          <div className="leading-relaxed text-slate-700">
            <p>
              במעגל מקור-משותף עם נגד-ניקוז <Tex>{'R_D'}</Tex>, חוק קירכהוף נותן <Tex>{'V_{DS}=V_{DD}-I_{DS}R_D'}</Tex> —
              <b>קו-העומס</b> (ירוק). נקודת-העבודה <Tex>{'Q'}</Tex> היא <b>מפגש קו-העומס עם עקומת-המוצא</b> של ה-<Tex>{'V_{GS}'}</Tex> הנבחר.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              הזזת <Tex>{'V_{GS}'}</Tex> מזיזה את <Tex>{'Q'}</Tex> לאורך קו-העומס — כך המגבר עובד.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}
