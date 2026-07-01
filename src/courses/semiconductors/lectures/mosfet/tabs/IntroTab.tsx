import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import MosfetStructure from '../components/MosfetStructure'

/** Lesson 7א intro — from the MOS capacitor to a four-terminal transistor; the NMOS/PMOS anatomy. */
export default function IntroTab() {
  const [type, setType] = useState<'nmos' | 'pmos'>('nmos')

  return (
    <div className="flex flex-col gap-5">
      <Panel title="מקבל MOS לטרנזיסטור — הרעיון">
        <div className="rounded-2xl border-s-4 border-sky-500 bg-sky-50/70 p-4 leading-relaxed text-slate-700">
          <p>
            בקבל ה-MOS ראינו שכאשר <Tex>{'V_G>V_T'}</Tex> נוצרת <b>שכבת-היפוך</b> — שכבת אלקטרונים דקה בשפת המל"מ.
            עכשיו נשתיל שני מגעים <Tex>{'n^+'}</Tex> משני צידי השער — <b>מקור (Source)</b> ו<b>ניקוז (Drain)</b> —
            ושכבת-ההיפוך הופכת ל<b>ערוץ מוליך שמחבר ביניהם</b>.
          </p>
          <p className="mt-2">
            השער שולט ב<b>מוליכות הערוץ</b> דרך אותו אפקט-שדה קיבולי שלמדנו — <b>בלי זרם-שער</b>. מתח-הסף <Tex>{'V_T'}</Tex>
            {' '}של הקבל הוא מתח-הסף של הטרנזיסטור: מתחתיו ההתקן <b>כבוי</b>, מעליו <b>פתוח</b>. זהו ה-<b>MOSFET</b> —
            ההתקן המרכזי של האלקטרוניקה הספרתית.
          </p>
        </div>
      </Panel>

      <Panel title="מבנה — חתך הטרנזיסטור">
        <div className="mb-3 flex justify-center gap-2">
          {(['nmos', 'pmos'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                type === t ? 'bg-slate-800 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'nmos' ? 'NMOS (ערוץ-n)' : 'PMOS (ערוץ-p)'}
            </button>
          ))}
        </div>
        <MosfetStructure type={type} showChannel />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
            <b className="text-slate-700">ארבעה הדקים</b>
            <p className="mt-1 text-slate-600">
              <b>G</b> (שער), <b>S</b> (מקור), <b>D</b> (ניקוז), <b>B</b> (מצע/גוף). המקור והניקוז <b>סימטריים</b> —
              המקור מוגדר כהדק שממנו מגיעים נושאי-הרוב לערוץ.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 leading-relaxed">
            <b className="text-slate-700">{type === 'nmos' ? 'NMOS' : 'PMOS'}</b>
            <p className="mt-1 text-slate-600">
              {type === 'nmos' ? (
                <>מגעי <Tex>{'n^+'}</Tex> במצע <Tex>{'p'}</Tex>; הערוץ הוא <b>אלקטרונים</b>. נדלק ב-<Tex>{'V_{GS}>V_T>0'}</Tex>.</>
              ) : (
                <>מגעי <Tex>{'p^+'}</Tex> בבאר-<Tex>{'n'}</Tex>; הערוץ הוא <b>חורים</b>. נדלק ב-<Tex>{'V_{GS}<V_T<0'}</Tex>.</>
              )}
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="מה נלמד בחלק זה">
        <ul className="list-inside list-disc space-y-1.5 leading-relaxed text-slate-600">
          <li><b>הפעלה</b> — איך נוצר הערוץ, ומהם המשטרים: טריודה → צביטה → רוויה.</li>
          <li><b>גזירת אופיין-הזרם</b> — מ-<Tex>{'Q_n(y)'}</Tex> ועד <Tex>{'I_{DS}(V_{GS},V_{DS})'}</Tex>.</li>
          <li><b>אופיינים</b> — משפחת <Tex>{'I_{DS}\\text{-}V_{DS}'}</Tex> ואופיין-ההעברה <Tex>{'I_{DS}\\text{-}V_{GS}'}</Tex>.</li>
          <li><b>NMOS/PMOS</b> ו<b>אנהנסמנט/דיפלישן</b>.</li>
          <li><b>מודל אותות-קטנים</b> — <Tex>{'g_m'}</Tex>, קו-עומס.</li>
        </ul>
      </Panel>
    </div>
  )
}
