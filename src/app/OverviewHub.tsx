import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Tex from '@/components/Tex'
import { sortingAlgorithms } from './overview'
import AlgorithmRace from './AlgorithmRace'

interface Row {
  name: string
  ideaHe: string
  worst: string
  average: string
  stableHe: string
  inPlaceHe: string
  whenHe: string
  fromCourse?: boolean
}

/** One-line "what it does" per sort — shown under the name in the table. Keyed
 *  by the spec's titleEn for the auto (interactive) rows. */
const IDEAS: Record<string, string> = {
  HeapSort: 'בונה ערימת-מקסימום ושולף את המקסימום שוב ושוב לסוף המערך.',
  Quicksort: 'מחלק את המערך סביב ציר, וממיין כל צד רקורסיבית.',
  'Randomized-Quicksort': 'כמו מיון מהיר, אך הציר נבחר אקראית — מונע את המקרה הגרוע.',
}

// Curated rows for sorts taught in the course but not (yet) interactive here.
const CURATED: Row[] = [
  {
    name: 'Merge Sort',
    ideaHe: 'מחלק לשניים, ממיין כל מחצית רקורסיבית, וממזג שתי מחציות ממוינות.',
    worst: 'O(n \\log n)',
    average: 'O(n \\log n)',
    stableHe: 'יציב',
    inPlaceHe: 'לא במקום',
    whenHe: 'כשצריך יציבות, או למיון רשימות מקושרות / קבצים גדולים.',
    fromCourse: true,
  },
  {
    name: 'Insertion Sort',
    ideaHe: 'מכניס איבר-איבר למקומו בתוך האזור הממוין שמשמאלו.',
    worst: 'O(n^2)',
    average: 'O(n^2)',
    stableHe: 'יציב',
    inPlaceHe: 'במקום',
    whenHe: 'קלט קטן או כמעט-ממוין (מהיר בפועל על קלטים כאלה).',
    fromCourse: true,
  },
  {
    name: 'Counting Sort',
    ideaHe: 'סופר כמה פעמים מופיע כל ערך, וממקם לפי סכומי-רישא. ללא השוואות.',
    worst: 'O(n + k)',
    average: 'O(n + k)',
    stableHe: 'יציב',
    inPlaceHe: 'לא במקום',
    whenHe: 'מפתחות שלמים בטווח קטן (k = O(n)).',
    fromCourse: true,
  },
  {
    name: 'Radix Sort',
    ideaHe: 'ממיין ספרה-אחר-ספרה, מהפחות-משמעותית, עם מיון יציב בכל מעבר.',
    worst: 'O(d(n + k))',
    average: 'O(d(n + k))',
    stableHe: 'יציב',
    inPlaceHe: 'לא במקום',
    whenHe: 'מספרים/מחרוזות באורך קבוע d (ספרה אחר ספרה).',
    fromCourse: true,
  },
  {
    name: 'Bucket Sort',
    ideaHe: 'מפזר ל-n דליים לפי הערך, ממיין כל דלי (מיון הכנסה) ומשרשר.',
    worst: 'O(n^2)',
    average: 'O(n)',
    stableHe: 'יציב',
    inPlaceHe: 'לא במקום',
    whenHe: 'קלט ממשי פרוש אחיד ב-[0,1). תוחלת לינארית.',
    fromCourse: true,
  },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-start transition hover:bg-slate-50"
      >
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <svg
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default function OverviewHub() {
  const sorts = sortingAlgorithms()
  const rows: Row[] = [
    ...sorts.map((s) => ({
      name: s.spec.titleEn,
      ideaHe: IDEAS[s.spec.titleEn] ?? s.spec.blurbHe,
      worst: s.spec.sortProfile!.worst,
      average: s.spec.sortProfile!.average,
      stableHe: s.spec.sortProfile!.stableHe,
      inPlaceHe: s.spec.sortProfile!.inPlaceHe,
      whenHe: s.spec.sortProfile!.whenHe,
    })),
    ...CURATED,
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6">
      <header>
        <Link
          to="/"
          className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
        >
          <span aria-hidden>←</span>
          כל השיעורים
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          מבט-על · השוואות
          <span className="ms-2 font-mono text-base font-medium text-slate-400">Overview</span>
        </h1>
        <p className="mt-1 text-slate-500">תוכן שמשווה בין השיעורים — מתעדכן אוטומטית עם כל שיעור חדש.</p>
      </header>

      <Card title="טבלת השוואת מיונים">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pe-4 text-start font-semibold">אלגוריתם</th>
                <th className="py-2 pe-4 text-start font-semibold whitespace-nowrap">גרוע</th>
                <th className="py-2 pe-4 text-start font-semibold whitespace-nowrap">ממוצע</th>
                <th className="py-2 pe-4 text-start font-semibold whitespace-nowrap">יציבות</th>
                <th className="py-2 pe-4 text-start font-semibold whitespace-nowrap">זיכרון</th>
                <th className="py-2 text-start font-semibold">מתי להשתמש</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-slate-100 align-top">
                  <td className="py-3 pe-4">
                    <span dir="ltr" className="font-mono font-semibold text-slate-800">
                      {r.name}
                    </span>
                    <p className="mt-0.5 max-w-xs leading-relaxed text-slate-500">{r.ideaHe}</p>
                  </td>
                  <td className="py-3 pe-4 whitespace-nowrap"><Tex>{r.worst}</Tex></td>
                  <td className="py-3 pe-4 whitespace-nowrap"><Tex>{r.average}</Tex></td>
                  <td className="py-3 pe-4 whitespace-nowrap">
                    <span className={r.stableHe === 'יציב' ? 'text-emerald-600' : 'text-slate-500'}>{r.stableHe}</span>
                  </td>
                  <td className="py-3 pe-4 whitespace-nowrap text-slate-600">{r.inPlaceHe}</td>
                  <td className="py-3 leading-relaxed text-slate-600">{r.whenHe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="מירוץ אלגוריתמים">
        <p className="mb-4 leading-relaxed text-slate-600">
          בחרו שני אלגוריתמים והריצו אותם על <b>אותו קלט</b> — ושימו לב למוני ההשוואות וההחלפות.
          נסו את הקלט <b>"ממוין"</b> כדי לראות את Quicksort מתפוצץ ל-<Tex>{'O(n^2)'}</Tex> בעוד
          Heapsort והגרסה האקראית נשארים יעילים.
        </p>
        <AlgorithmRace />
      </Card>
    </div>
  )
}
