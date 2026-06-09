import SyllabusButton, { type SyllabusLesson } from '@/core/components/SyllabusButton'

/**
 * Semiconductors course roadmap. Update LESSONS (and the `done` flags) as
 * lessons/parts are added.
 */
const LESSONS: SyllabusLesson[] = [
  {
    n: 'שיעור 1',
    title: 'צומת PN',
    done: true,
    parts: [
      {
        label: 'חלק א׳ · בשיווי משקל',
        desc: 'סוגי מל"מ ו-$n_i$, גנרציה/רקומבינציה, דיאגרמת פסים, אזור המחסור, מתח בנוי $V_{bi}$, ואלקטרוסטטיקה ρ→E→V.',
        done: true,
      },
      {
        label: 'חלק ב׳ · תחת ממתח',
        desc: 'ממתח קדמי/אחורי, גובה המחסום, רוחב המחסור וקיבול הצומת, חוק הצומת והזרקת מיעוט, ופריצות.',
        done: true,
      },
    ],
  },
  {
    n: 'שיעור 2',
    title: 'דיודת PN',
    parts: [
      { label: 'חלק א׳ · דיודה אידיאלית', desc: 'גזירת אופיין הדיודה $I=I_S(e^{qV/kT}-1)$ וזרם הרוויה $I_S$.', done: true },
      { label: 'חלק ב׳ · דיודה לא-אידיאלית', desc: 'זרם רקומבינציה/גנרציה, הזרקה חזקה, התנגדות טורית, ומקדם אי-אידיאליות $n$.', done: true },
      { label: 'חלק ג׳ · דיודת שוטקי', desc: 'צומת מתכת-מל"מ מיישר — מחסום שוטקי.', done: true },
      { label: 'חלק ד׳ · מגע מתכת-מל"מ (אוהמי)', desc: 'מגע לא-מיישר, לחיבור ההתקן למעגל בלי דיודה טפילית.', done: true },
    ],
  },
  {
    n: 'שיעור 3',
    title: 'טרנזיסטור דו-קוטבי (BJT)',
    parts: [
      {
        label: 'חלק א׳ · מבנה ופעולה',
        desc: 'npn/pnp, שלושת האזורים (פולט/בסיס/קולט), הטיית הצמתים (EB קדמי, CB אחורי), שלושת מצבי-הפעולה (פעיל/רוויה/קטעון), ולמה הטרנזיסטור מגביר. דיאגרמת פסים של שני צמתים ופרופיל מיעוט לאורך E-B-C.',
        done: true,
      },
      {
        label: 'חלק ב׳ · זרמים והגבר',
        desc: 'גזירת רכיבי הזרם מהפרופילים, מקדמי ההגבר $\\alpha$ ו-$\\beta$, יעילות ההזרקה ומקדם מעבר הבסיס, תצורות בסיס-משותף ופולט-משותף (CB/CE) ואופייני זרם-מתח שלהן, ומודל Ebers-Moll.',
        done: true,
      },
      {
        label: 'חלק ג׳ · אפקטים לא-אידיאליים ומודלים',
        desc: 'אפקט Early (אפנון רוחב הבסיס), פריצה, הזרקה חזקה ו-$\\beta$ לא-אידיאלי (עקומת Gummel), מודל אות-קטן (hybrid-π) ל-CE ול-CB, תדר-חיתוך $f_T$ ומיתוג.',
        done: true,
      },
    ],
    done: true,
  },
  {
    n: 'שיעור 4',
    title: 'תיריסטור (SCR)',
    done: true,
    desc: 'מתג PNPN ארבע-שכבתי: מבנה וסימול, מודל שני הטרנזיסטורים והמשוב החיובי, תנאי ההצתה $\\alpha_1+\\alpha_2\\ge1$ ($\\Leftrightarrow\\beta_1\\beta_2\\ge1$), ואופיין ה-I-V עם אזור NDR, מתח-פריצה $V_{BF}$ וזרם-החזקה $I_H$.',
  },
]

export default function Syllabus() {
  return <SyllabusButton lessons={LESSONS} />
}
