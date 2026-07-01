import Panel from '../../../components/Panel'
import LawCard, { type LawDevice } from '../components/LawCard'

const JUNCTION_LAW: LawDevice[] = [
  { label: 'דיודה', manifest: 'I=I_S(e^{qV/kT}-1)', lectureId: 'ideal-diode', tab: 'derivation' },
  { label: 'BJT', manifest: 'I_C\\propto e^{qV_{BE}/kT}', lectureId: 'bjt-currents-gain', tab: 'components' },
  { label: 'שוטקי (תרמיוני)', manifest: 'J=J_{ST}(e^{qV/kT}-1)', lectureId: 'schottky-diode', tab: 'thermionic' },
  { label: 'MOSFET · תת-סף', manifest: 'I_D\\propto e^{qV_{GS}/mkT}', lectureId: 'mosfet-nonideal', tab: 'subthreshold' },
]

const POISSON: LawDevice[] = [
  { label: 'צומת PN', manifest: '\\rho\\to E\\to V_{bi},\\ W', lectureId: 'pn-junction-equilibrium' },
  { label: 'שוטקי', manifest: '\\rho\\to E\\to \\varphi_B', lectureId: 'schottky-diode', tab: 'bands' },
  { label: 'קבל MOS', manifest: 'W=\\sqrt{2\\varepsilon_s\\psi_s/qN_A}', lectureId: 'mos-capacitor' },
  { label: 'JFET · צביטה', manifest: '|V_P|=qN_Da^2/2\\varepsilon_s', lectureId: 'jfet', tab: 'operation' },
]

const SMALL_SIGNAL: LawDevice[] = [
  { label: 'BJT (hybrid-π)', manifest: 'g_m=I_C/V_T', lectureId: 'bjt-nonideal', tab: 'hybridpi' },
  { label: 'JFET', manifest: 'g_m=\\tfrac{2I_{DSS}}{|V_P|}(1-\\tfrac{V_{GS}}{V_P})', lectureId: 'jfet', tab: 'transfer' },
  { label: 'MOSFET', manifest: 'g_m=k(V_{GS}-V_T)', lectureId: 'mosfet', tab: 'smallsignal' },
]

/** Overview · One law — the handful of equations that reappear across the whole course. */
export default function OneLawTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="חוק אחד, הרבה התקנים">
        <p className="leading-relaxed text-slate-700">
          למרות שנראה כאילו כל התקן הוא עולם בפני עצמו, <b>קומץ משוואות</b> חוזרות שוב ושוב — רק במסווה שונה.
          מי שמזהה אותן קורא כל התקן חדש כמעט "בחינם".
        </p>
      </Panel>

      <LawCard
        icon="⚖️"
        title="חוק-הצומת — הולכה מעל מחסום"
        equation={'n=n_0\\,e^{qV/kT}\\;\\Rightarrow\\; I\\propto\\left(e^{qV/kT}-1\\right)'}
        idea={'בכל מקום שבו נושאים חוצים מחסום-פוטנציאל, הריכוז (ולכן הזרם) תלוי מעריכית במתח — התפלגות בולצמן. זה המנוע של הדיודה, ה-BJT, הפליטה התרמיונית ב$שוטקי$, ואפילו התת-סף ב-MOSFET.'}
        devices={JUNCTION_LAW}
      />

      <LawCard
        icon="🌐"
        title="אלקטרוסטטיקה — השרשרת ρ→E→V"
        equation={'\\dfrac{dE}{dx}=\\dfrac{\\rho}{\\varepsilon_s},\\quad E=-\\dfrac{dV}{dx}'}
        idea={'כל אזור-מחסור נפתר באותה שרשרת (פואסון): מטען-מרחב $\\rho$ → שדה $E$ → פוטנציאל $V$. משם נגזרים רוחב-המחסור, המתח-הבנוי, וגובה-המחסום — בצומת, בשוטקי, בקבל MOS וב-pinch-off של ה-JFET.'}
        devices={POISSON}
      />

      <LawCard
        icon="📐"
        title="שלד אות-קטן — g_m ו-r_o"
        equation={'i_{out}=g_m\\,v_{in},\\qquad r_o=\\left(\\dfrac{\\partial I_{out}}{\\partial V_{out}}\\right)^{-1}'}
        idea={'כל טרנזיסטור מתנהג לאות-קטן כ$מקור$-זרם מבוקר $g_m v_{in}$ עם התנגדות-מוצא $r_o$. רק הביטוי ל-$g_m$ משתנה בין ההתקנים — המבנה (והמגבר שנבנה ממנו) זהה.'}
        devices={SMALL_SIGNAL}
      />
    </div>
  )
}
