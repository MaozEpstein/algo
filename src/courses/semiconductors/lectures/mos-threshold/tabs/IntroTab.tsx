import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'

/** Lesson 6ב intro — goal card: from the qualitative regimes to the quantitative DC theory. */
export default function IntroTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מטרת החלק — מהאיכותי אל הכמותי">
        <div className="rounded-2xl border-s-4 border-violet-400 bg-violet-50/60 p-4 leading-relaxed text-slate-700">
          <p>
            בחלק א׳ ראינו <b>איכותית</b> את שלושת המשטרים (הצטברות / מחסור / היפוך) ואת כיפוף-הפסים. כעת
            {' '}<b>נכמת</b> אותם: נפתור את משוואת פואסון ונקבל את מטען פני-השטח המדויק <Tex>{'Q_s(\\psi_s)'}</Tex>,
            נגזור את <b>מתח-הסף <Tex>{'V_T'}</Tex></b> — סף ההיפוך החזק — ולבסוף נכניס את <b>מטעני-התחמוצת</b>
            {' '}האמיתיים שמסיטים את <Tex>{'V_{FB}'}</Tex> ואת <Tex>{'V_T'}</Tex>.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            כל זה עדיין <b>תמונת DC</b> — מתח-שער קבוע ומצב סטטי. את ההתנהגות הדינמית (קיבול ו-AC) נראה בחלק ג׳.
          </p>
        </div>
      </Panel>

      <Panel title="הקו של שלושת החלקים">
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
            <b className="text-slate-700">חלק א׳ · מבנה ומשטרים</b>
            <p className="mt-1 text-slate-500">DC איכותי — מה קורה בכל משטר.</p>
          </div>
          <div className="rounded-xl border-2 border-violet-300 bg-violet-50/60 p-3 leading-relaxed">
            <b className="text-violet-800">חלק ב׳ · סף ומטענים</b>
            <p className="mt-1 text-slate-600">DC כמותי — <Tex>{'Q_s,\\,V_T'}</Tex>, מטעני-אוקסיד. (כאן)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
            <b className="text-slate-700">חלק ג׳ · קיבול</b>
            <p className="mt-1 text-slate-500">המעבר ל-AC — אופיין <Tex>{'C\\text{-}V'}</Tex>.</p>
          </div>
        </div>
      </Panel>

      <Panel title="מה נלמד כאן">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>מטען פני-השטח המדויק</b> <Tex>{'Q_s(\\psi_s)'}</Tex> — שלושת הענפים (הצטברות / מחסור / היפוך).</li>
          <li><b>מתח-הסף</b> <Tex>{'V_T=V_{FB}+2\\phi_F+|Q_{D,\\max}|/C_{ox}'}</Tex> — גזירה ומשמעות.</li>
          <li><b>מטעני-תחמוצת</b> (<Tex>{'Q_{it},Q_f,Q_{ox},Q_m'}</Tex>) ו-<Tex>{'V_{FB}'}</Tex> הריאלי.</li>
        </ul>
      </Panel>
    </div>
  )
}
