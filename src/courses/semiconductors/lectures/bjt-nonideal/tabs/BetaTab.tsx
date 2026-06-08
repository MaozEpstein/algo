import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import BetaVsIcPlot from '../components/BetaVsIcPlot'
import GummelPlot from '../components/GummelPlot'

/** Lecture 3ג — non-ideal β(I_C) and the Gummel plot. */
export default function BetaTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="β אינו קבוע — תלוי בזרם">
        <p className="leading-relaxed text-slate-700">
          ההגבר <Tex>{'\\beta'}</Tex> שטוח רק בטווח-זרמים בינוני. הוא <b>נופל</b> בשני הקצוות:
        </p>
        <div className="mt-3">
          <BetaVsIcPlot />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border-s-4 border-amber-300 bg-amber-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-amber-700">זרם נמוך</b> — רקומבינציה באזור-המחסור של B-E (רכיב <Tex>{'n=2'}</Tex>) מגדילה את <Tex>{'I_B'}</Tex> ומקטינה את <Tex>{'\\beta'}</Tex>.
          </div>
          <div className="rounded-xl border-s-4 border-rose-300 bg-rose-50/50 p-3 text-sm leading-relaxed text-slate-700">
            <b className="text-rose-700">זרם גבוה</b> — הזרקה-חזקה בבסיס (עודף-המיעוט מתקרב ללִגוּז) מקטינה את <Tex>{'\\gamma'}</Tex> ואת <Tex>{'\\beta'}</Tex>.
          </div>
        </div>
      </Panel>

      <Panel title="עקומת Gummel — מודדים γ ו-β">
        <p className="leading-relaxed text-slate-700">
          מציירים את <Tex>{'\\log I_C'}</Tex> ואת <Tex>{'\\log I_B'}</Tex> מול <Tex>{'V_{BE}'}</Tex>. <Tex>{'I_C'}</Tex> ישר (מעריכי אידיאלי),
          ו-<Tex>{'I_B'}</Tex> מתעקל בזרם נמוך (רכיב הרקומבינציה). ה<b>מרווח האנכי</b> בין שני הישרים הוא <Tex>{'\\log\\beta_F'}</Tex>:
        </p>
        <div className="mt-3">
          <GummelPlot />
        </div>
      </Panel>

      <Panel title="מדוע לא 'לסמם עוד' את הפולט?">
        <p className="leading-relaxed text-slate-600">
          ב-3ב ראינו ש-<Tex>{'\\gamma\\to1'}</Tex> דורש <Tex>{'N_E\\gg N_B'}</Tex>. אבל סימום כבד מאוד <b>מצמצם את פער-האנרגיה</b> בפולט
          (<Tex>{'n_{ie}^2=n_{i0}^2 e^{\\Delta E_g/kT}'}</Tex>), מה שמגדיל בחזרה את הזרקת-החורים הנגדית ו<b>מגביל</b> את <Tex>{'\\beta'}</Tex> —
          יש תקרה מעשית.
        </p>
      </Panel>
    </div>
  )
}
