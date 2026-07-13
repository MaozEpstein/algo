import Tex from '@/core/components/Tex'
import RichText from '@/core/components/RichText'
import Panel from '../../../components/Panel'
import DistributionExplorer from '../../../viz/DistributionExplorer'
import DistributionMiniPlot from '../../../viz/DistributionMiniPlot'
import DistributionMap from '../../../viz/DistributionMap'
import { DISTRIBUTIONS, MVN, INCIDENTAL, type DistDatum } from '../data/distributions'

/**
 * The overview's first tab: a framed, course-wide reference of the common
 * distributions — the pretty lesson-1 graphs reused as thumbnails, per-family
 * cards, and a single comparison table of support / PDF-PMF / E[X] / Var /
 * characteristic function. A reference the whole course leans on.
 */
export default function DistributionsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="טבלת השוואה">
        <div className="hide-scrollbar overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              {/* group row */}
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th colSpan={5} className="border-b border-slate-200 bg-emerald-50/70 px-4 py-1.5 text-center text-emerald-700">הגדרה וצפיפות</th>
                <th colSpan={3} className="border-b border-s-2 border-slate-200 bg-amber-50/60 px-4 py-1.5 text-center text-amber-700">מומנטים</th>
                <th className="border-b border-s-2 border-slate-200 bg-violet-50/60 px-4 py-1.5 text-center text-violet-700">טרנספורם</th>
              </tr>
              {/* column row */}
              <tr className="bg-slate-50 text-slate-500">
                <Th>התפלגות</Th>
                <Th>פרמטרים</Th>
                <Th>תומך</Th>
                <Th>PDF / PMF</Th>
                <Th tex="F_X\;(\text{CDF})" divider />
                <Th tex="\mathbb{E}[X]" />
                <Th tex="\mathbb{E}[X^2]" />
                <Th tex="\mathrm{Var}(X)" divider />
                <Th>פונקציה אופיינית</Th>
              </tr>
            </thead>
            <tbody>
              {[...DISTRIBUTIONS, MVN].map((d, i) => (
                <tr key={d.id} className={`border-t border-slate-100 align-middle transition hover:bg-emerald-50/40 ${i % 2 ? 'bg-slate-50/40' : 'bg-white'}`}>
                  <td className="whitespace-nowrap border-e-2 border-e-emerald-100 bg-white/60 px-4 py-3 text-center">
                    <div className="font-bold text-slate-800">{d.nameHe}</div>
                    <div className="text-xs text-slate-400" dir="ltr"><Tex>{d.tex}</Tex></div>
                  </td>
                  <Td tex={d.paramsTex} />
                  <Td tex={d.supportTex} />
                  <Td tex={d.pdfTex} small={d.id === 'gauss' || d.id === 'mvn'} />
                  {d.cdfTex ? (
                    <Td tex={d.cdfTex} divider />
                  ) : (
                    <td className="border-e-2 border-slate-200 px-4 py-3 text-center text-xs italic text-slate-400">{d.kind === 'discrete' ? 'פונקציית מדרגות' : '—'}</td>
                  )}
                  <Td tex={d.meanTex} />
                  <Td tex={d.m2Tex} />
                  <Td tex={d.varTex} divider />
                  <Td tex={d.cfTex} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          הפונקציה האופיינית של הגאוסי נגזרת בסיכום (משפט 2.4); שאר הפונקציות האופייניות והמומנטים של אחיד/מעריכי
          מובאים כערכי-ייחוס סטנדרטיים. ה-CDF של התפלגות בדידה היא פונקציית מדרגות.
        </p>
      </Panel>

      <Panel title="למה הלשונית הזו קיימת">
        <div className="space-y-3 leading-relaxed text-slate-700">
          <p>
            לאורך כל הקורס חוזרות אותן <b>התפלגויות</b> — אחיד, מעריכי, גאוסי, ברנולי, פואסון ועוד — אבל אף שיעור
            לא מלמד אותן כאובייקטים בפני עצמם. הלשונית הזו היא <b>ארגז הכלים</b>: כרטיס לכל התפלגות וטבלת השוואה
            אחת, שאפשר לחזור אליהם מכל שיעור.
          </p>
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
            <b>שימו לב:</b> התוחלת <Tex>{'\\mathbb{E}[X]'}</Tex> והשונות <Tex>{'\\mathrm{Var}(X)'}</Tex> יוגדרו
            רשמית בשיעור 2 (מומנטים); כאן הן מובאות כערכי-ייחוס. הקורס עובד עם ה<b>פונקציה האופיינית</b>{' '}
            <Tex>{'\\varphi_X(w)=\\mathbb{E}[e^{jwX}]'}</Tex> כטרנספורם המרכזי — לא עם ה-MGF (שמוזכר פעם אחת בלבד,
            כ-<Tex>{'\\varphi_X(-jw)'}</Tex>).
          </div>
        </div>
      </Panel>

      <Panel title="🎛️ שחקו איתן — צפיפות מול CDF">
        <p className="mb-3 leading-relaxed text-slate-600">
          אותו ארגז חול משיעור 1: החליפו התפלגות, הזיזו פרמטרים וגררו את הסף כדי לחוש את הצורות.
        </p>
        <DistributionExplorer />
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2">
        {DISTRIBUTIONS.map((d) => (
          <DistCard key={d.id} d={d} />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <DistCard d={MVN} />
        <Panel title="נגזרות ומופעים (לא משפחות נלמדות)">
          <ul className="space-y-2">
            {INCIDENTAL.map((it) => (
              <li key={it.tex} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                <span className="shrink-0 font-semibold text-slate-700" dir="ltr">
                  <Tex>{it.tex}</Tex>
                </span>
                <span>— {it.nameHe}: <RichText>{it.noteHe}</RichText></span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="קשרים בין ההתפלגויות">
        <p className="mb-3 leading-relaxed text-slate-600">
          כל ההתפלגויות קשורות בטרנספורמציות פשוטות. עברו עם העכבר על צומת כדי להאיר את קשריו:
        </p>
        <DistributionMap />
      </Panel>
    </div>
  )
}

function DistCard({ d }: { d: DistDatum }) {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 border-s-4 border-s-emerald-400 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-slate-800">{d.nameHe}</h3>
        <span className="text-slate-500" dir="ltr"><Tex>{d.tex}</Tex></span>
      </div>
      <p className="mt-1 text-sm leading-snug text-slate-500">{d.storyHe}</p>

      {d.plot ? (
        <div className="my-2 rounded-lg bg-slate-50/70 p-1">
          <DistributionMiniPlot kind={d.kind === 'discrete' ? 'discrete' : 'continuous'} {...d.plot} />
        </div>
      ) : (
        <div className="my-2 rounded-lg bg-slate-50/70 px-3 py-2 text-center text-xs text-slate-400">
          התפלגות וקטורית — ראו שיעור 4
        </div>
      )}

      <dl className="mt-1 space-y-1.5 text-sm">
        <Row label="תומך" tex={d.supportTex} />
        <Row label={d.pdfLabel} tex={d.pdfTex} />
        {d.cdfTex && <Row label="CDF" tex={d.cdfTex} />}
        <Row label="E[X]" tex={d.meanTex} />
        <Row label="Var" tex={d.varTex} />
        <Row label="φ(w)" tex={d.cfTex} />
      </dl>
      {d.cfNote && <p className="mt-2 text-xs leading-snug text-slate-400">✔ {d.cfNote}</p>}
    </section>
  )
}

function Row({ label, tex }: { label: string; tex: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <dt className="w-14 shrink-0 text-xs font-semibold text-slate-400">{label}</dt>
      <dd className="hide-scrollbar overflow-x-auto text-slate-700" dir="ltr">
        <Tex>{tex}</Tex>
      </dd>
    </div>
  )
}

function Th({ children, tex, divider = false }: { children?: React.ReactNode; tex?: string; divider?: boolean }) {
  return (
    <th className={`whitespace-nowrap px-4 py-2 text-center text-xs font-bold tracking-wide ${divider ? 'border-e-2 border-slate-200' : ''}`}>
      {tex ? <span dir="ltr"><Tex>{tex}</Tex></span> : children}
    </th>
  )
}
function Td({ tex, divider = false, small = false }: { tex: string; divider?: boolean; small?: boolean }) {
  return (
    <td className={`px-4 py-3 text-center leading-relaxed ${divider ? 'border-e-2 border-slate-200' : ''}`}>
      <span dir="ltr" className={small ? 'text-[0.88em]' : ''}><Tex>{tex}</Tex></span>
    </td>
  )
}
