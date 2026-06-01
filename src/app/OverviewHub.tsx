import { Link } from 'react-router-dom'
import Tex from '@/components/Tex'
import { sortingAlgorithms } from './overview'
import AlgorithmRace from './AlgorithmRace'

interface Row {
  name: string
  worst: string
  average: string
  stableHe: string
  inPlaceHe: string
  whenHe: string
  fromCourse?: boolean
}

// Curated rows for sorts taught in the course but not (yet) interactive here.
const CURATED: Row[] = [
  {
    name: 'Merge Sort',
    worst: 'O(n \\log n)',
    average: 'O(n \\log n)',
    stableHe: 'יציב',
    inPlaceHe: 'לא במקום',
    whenHe: 'כשצריך יציבות, או למיון רשימות מקושרות / קבצים גדולים.',
    fromCourse: true,
  },
  {
    name: 'Insertion Sort',
    worst: 'O(n^2)',
    average: 'O(n^2)',
    stableHe: 'יציב',
    inPlaceHe: 'במקום',
    whenHe: 'קלט קטן או כמעט-ממוין (מהיר בפועל על קלטים כאלה).',
    fromCourse: true,
  },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="mb-3 text-lg font-bold text-slate-800">{title}</h2>
      {children}
    </section>
  )
}

export default function OverviewHub() {
  const sorts = sortingAlgorithms()
  const rows: Row[] = [
    ...sorts.map((s) => ({
      name: s.spec.titleEn,
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
        <Link to="/" className="text-sm text-slate-400 transition hover:text-slate-600">
          ← כל השיעורים
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          מבט-על · השוואות
          <span className="ms-2 font-mono text-base font-medium text-slate-400">Overview</span>
        </h1>
        <p className="mt-1 text-slate-500">תוכן שמשווה בין השיעורים — מתעדכן אוטומטית עם כל שיעור חדש.</p>
      </header>

      <Card title="טבלת השוואת מיונים">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="py-2 pe-3 text-start font-semibold">אלגוריתם</th>
                <th className="py-2 pe-3 text-start font-semibold">גרוע</th>
                <th className="py-2 pe-3 text-start font-semibold">ממוצע</th>
                <th className="py-2 pe-3 text-start font-semibold">יציבות</th>
                <th className="py-2 pe-3 text-start font-semibold">זיכרון</th>
                <th className="py-2 text-start font-semibold">מתי להשתמש</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-slate-100 align-top">
                  <td dir="ltr" className="py-2.5 pe-3 text-start font-mono text-sm font-semibold text-slate-800">
                    {r.name}
                    {r.fromCourse && (
                      <span className="ms-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        מהקורס
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pe-3"><Tex>{r.worst}</Tex></td>
                  <td className="py-2.5 pe-3"><Tex>{r.average}</Tex></td>
                  <td className="py-2.5 pe-3 text-sm">
                    <span className={r.stableHe === 'יציב' ? 'text-emerald-600' : 'text-slate-500'}>{r.stableHe}</span>
                  </td>
                  <td className="py-2.5 pe-3 text-sm text-slate-600">{r.inPlaceHe}</td>
                  <td className="py-2.5 text-sm leading-relaxed text-slate-600">{r.whenHe}</td>
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
