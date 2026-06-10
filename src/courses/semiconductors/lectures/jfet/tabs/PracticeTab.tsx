import type { ReactNode } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

const QA: { q: ReactNode; a: ReactNode }[] = [
  {
    q: <>מהו מתח-הצביטה <Tex>{'V_P'}</Tex>, וממה הוא מושפע?</>,
    a: <>מתח השער שמדלדל את <b>כל</b> התעלה (<Tex>{'|V_P|=qN_Da^2/2\\varepsilon_s'}</Tex>). גדל עם הסימום <Tex>{'N_D'}</Tex> ועם רוחב חצי-התעלה <Tex>{'a'}</Tex>. מהו תנאי הקטעון? <Tex>{'|V_{GS}|\\ge|V_P|'}</Tex>.</>,
  },
  {
    q: <>למה הזרם <Tex>{'I_D'}</Tex> מגיע לרוויה במקום להמשיך לעלות עם <Tex>{'V_{DS}'}</Tex>?</>,
    a: <>כי בקצה הניקוז התעלה <b>נצבטת</b> (<Tex>{'V_{DS}\\ge V_{Dsat}'}</Tex>); כל תוספת מתח נופלת על אזור-הצביטה הצר, והזרם דרך התעלה כמעט אינו משתנה.</>,
  },
  {
    q: <>למה באזור האוהמי ה-JFET מתנהג כנגד נשלט-מתח?</>,
    a: <>למתחי-ניקוז קטנים <Tex>{'I_D\\propto V_{DS}'}</Tex> — לינארי, והשיפוע (המוליכות) נקבע ע״י <Tex>{'V_{GS}'}</Tex>. לכן זהו נגד שמתח-השער שולט בו.</>,
  },
  {
    q: <>נתון <Tex>{'I_{DSS}=10\\,mA'}</Tex>, <Tex>{'V_P=-4\\,V'}</Tex>. מהו <Tex>{'I_D'}</Tex> ברוויה ב-<Tex>{'V_{GS}=-2\\,V'}</Tex>?</>,
    a: <><Tex>{'I_D=I_{DSS}(1-V_{GS}/V_P)^2=10(1-2/4)^2=2.5\\,mA'}</Tex>. (<Tex>{'I_{DSS}'}</Tex> הוא הזרם המרבי, ב-<Tex>{'V_{GS}=0'}</Tex>.)</>,
  },
  {
    q: <>כיצד מחשבים את <Tex>{'g_m'}</Tex> בנקודת-עבודה, ומתי הוא מרבי?</>,
    a: <><Tex>{'g_m=\\frac{2I_{DSS}}{|V_P|}(1-\\frac{V_{GS}}{V_P})'}</Tex> — השיפוע של אופיין-ההעברה. מרבי ב-<Tex>{'V_{GS}=0'}</Tex> ומתאפס בצביטה.</>,
  },
  {
    q: <>במה שונה ה-JFET מ-BJT, ומהי תצורת המגבר המקבילה ל-CE?</>,
    a: <>ב-JFET <b>מתח</b>-השער שולט (כניסה כמעט ללא זרם — התנגדות-כניסה עצומה); ב-BJT <b>זרם</b>-הבסיס שולט. התצורה המקבילה ל-CE היא <b>מקור-משותף</b>: <Tex>{'A_v=-g_m(r_o\\parallel R_D)'}</Tex> (מהפך).</>,
  },
]

/** JFET — practice Q&A (click to reveal). */
export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="שאלות לתרגול">
        <div className="flex flex-col gap-3">
          {QA.map((item, i) => (
            <details key={i} className="rounded-xl border border-slate-200 bg-white p-3">
              <summary className="cursor-pointer font-semibold text-slate-700">{item.q}</summary>
              <p className="mt-2 leading-relaxed text-slate-600" dir="rtl">{item.a}</p>
            </details>
          ))}
        </div>
      </Panel>
    </div>
  )
}
