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
      { label: 'דיודה אידיאלית', desc: 'גזירת אופיין הדיודה $I=I_S(e^{qV/kT}-1)$ וזרם הרוויה $I_S$.' },
      { label: 'דיודה לא-אידיאלית', desc: 'זרם רקומבינציה/גנרציה, הזרקה חזקה, התנגדות טורית, ומקדם אי-אידיאליות $n$.' },
      { label: 'דיודת שוטקי', desc: 'צומת מתכת-מל"מ מיישר — מחסום שוטקי.' },
      { label: 'מגע מתכת-מל"מ (אוהמי)', desc: 'מגע לא-מיישר, לחיבור ההתקן למעגל בלי דיודה טפילית.' },
    ],
  },
]

export default function Syllabus() {
  return <SyllabusButton lessons={LESSONS} />
}
