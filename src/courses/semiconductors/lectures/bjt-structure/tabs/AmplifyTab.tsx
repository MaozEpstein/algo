import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'

/** Lecture 3א — why the BJT amplifies (qualitative; quantitative γ/b/α/β in 3ב). */
export default function AmplifyTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="למה זרם-בסיס זעיר שולט בזרם-קולט גדול">
        <p className="leading-relaxed text-slate-700">
          ההגבר נשען על שתי האסימטריות שראינו: <b>פולט מסומם בכבדות</b> ו<b>בסיס דק</b>. יחד הן גורמות לכך שכמעט כל
          הזרם שיוצא מהפולט מגיע לקולט, ורק שבריר זעיר "דולף" כזרם-בסיס:
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>פולט <b>מסומם בכבדות</b></>, body: <>נצילות-הזרקה <Tex>{'\\gamma\\to1'}</Tex>: כמעט כל הזרם בצומת ה-BE הוא הזרקת מיעוט מהפולט.</> },
            { title: <>בסיס <b>דק</b></>, body: <>מקדם-מעבר <Tex>{'b\\to1'}</Tex>: כמעט כל המוזרק חוצה את הבסיס לפני שייעלם ברקומבינציה.</> },
            { title: <>קליטה ב<b>קולט</b></>, body: <><Tex>{'I_C=\\alpha I_E'}</Tex>, כאשר <Tex>{'\\alpha=b\\gamma\\approx1'}</Tex>.</> },
          ]}
          outcome={{ label: 'I_B זעיר שולט ב-I_C גדול', sub: <><Tex>{'\\beta=I_C/I_B\\gg1'}</Tex></> }}
        />
      </Panel>

      <Panel title="המספרים בקצרה">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <p className="text-sm font-semibold text-slate-500">שימור זרם</p>
            <p className="mt-1 text-lg" dir="ltr"><Tex>{'I_E=I_C+I_B'}</Tex></p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <p className="text-sm font-semibold text-slate-500">בסיס משותף</p>
            <p className="mt-1 text-lg" dir="ltr"><Tex>{'\\alpha=\\tfrac{I_C}{I_E}\\approx1'}</Tex></p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
            <p className="text-sm font-semibold text-slate-500">פולט משותף</p>
            <p className="mt-1 text-lg" dir="ltr"><Tex>{'\\beta=\\tfrac{\\alpha}{1-\\alpha}\\gg1'}</Tex></p>
          </div>
        </div>
        <p className="mt-3 leading-relaxed text-slate-600">
          לדוגמה, אם <Tex>{'\\alpha=0.99'}</Tex> אז <Tex>{'\\beta=0.99/0.01=99'}</Tex>: שינוי קטן ב-<Tex>{'I_B'}</Tex>{' '}
          גורר שינוי גדול פי-100 ב-<Tex>{'I_C'}</Tex> — זהו ההגבר.
        </p>
        <p className="mt-2 rounded-lg bg-amber-50/70 px-3 py-2 text-sm leading-relaxed text-slate-600">
          הגזירה הכמותית המלאה של <Tex>{'\\gamma'}</Tex> (נצילות הזרקה), <Tex>{'b'}</Tex> (מקדם מעבר) ו-<Tex>{'\\alpha,\\beta'}</Tex>{' '}
          מרכיבי-הזרם — בחלק <b>ב׳ (זרמים והגבר)</b>.
        </p>
      </Panel>
    </div>
  )
}
