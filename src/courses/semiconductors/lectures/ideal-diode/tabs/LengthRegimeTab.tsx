import { useMemo, useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import Slider from '../../../components/Slider'
import StepFlow from '../../../components/StepFlow'
import Readout from '../components/Readout'
import LengthRegimeProfile from '../components/LengthRegimeProfile'
import { effectiveLength, shortBaseCurrentFactor } from '../../../lib/junction'

const REGIMES: { icon: string; titleHe: React.ReactNode; body: React.ReactNode; accent: string }[] = [
  {
    icon: '📐',
    titleHe: <>דיודה ארוכה (<Tex>{'W_B \\gg L'}</Tex>)</>,
    body: (
      <>
        הנשאים <b>נעלמים ברקומבינציה</b> בתוך הבסיס הרבה לפני שמגיעים למגע. הפרופיל <b>מעריכי</b>,
        והזרם נקבע מ-<Tex>{'L'}</Tex>: <Tex>{'J_S\\propto D/L'}</Tex>. זו ההנחה הסמויה של הגזירה בלשונית הקודמת.
      </>
    ),
    accent: 'border-slate-200 bg-slate-50/70',
  },
  {
    icon: '📏',
    titleHe: <>דיודה קצרה (<Tex>{'W_B \\ll L'}</Tex>)</>,
    body: (
      <>
        הנשאים <b>מגיעים למגע</b> לפני שמספיקים להתאחות. הפרופיל <b>לינארי</b>, וכמעט אין רקומבינציה בבסיס.
        הזרם נקבע מרוחב הבסיס: <Tex>{'J_S\\propto D/W_B'}</Tex> — <b>גדול יותר</b> כי <Tex>{'W_B<L'}</Tex>.
      </>
    ),
    accent: 'border-violet-200 bg-violet-50/60',
  },
]

/**
 * Lecture 2א — long vs short base diode. The J_S we derived used the diffusion
 * length L, which silently assumed a base much longer than L. This tab makes the
 * geometry explicit: drag the base width and watch the profile morph from
 * exponential (long, recombination-limited) to linear (short, transit-limited),
 * with the boundary slope — hence the current — set by L_eff = L·tanh(W_B/L).
 */
export default function LengthRegimeTab() {
  const [ratio, setRatio] = useState(2) // W_B / L
  const { leff, factor, regime } = useMemo(() => {
    const leff = effectiveLength(ratio, 1) // = tanh(ratio), in units of L
    const factor = shortBaseCurrentFactor(ratio, 1) // = coth(ratio)
    const regime = ratio >= 3 ? 'ארוכה — מוגבלת רקומבינציה' : ratio <= 0.8 ? 'קצרה — מוגבלת מעבר' : 'ביניים'
    return { leff, factor, regime }
  }, [ratio])

  return (
    <div className="flex flex-col gap-5">
      <Panel title="הנחה סמויה — הבסיס ארוך מ-L">
        <p className="leading-relaxed text-slate-600">
          בגזירת זרם הרוויה השתמשנו ב<b>אורך הדיפוזיה</b> <Tex>{'L'}</Tex> — אבל זה הניח בשקט שהאזור הניטרלי{' '}
          <b>ארוך בהרבה</b> מ-<Tex>{'L'}</Tex>, כך שכל נושאי המיעוט המוזרקים מתאחים בתוכו.
          מה קורה כשהבסיס <b>קצר</b> מ-<Tex>{'L'}</Tex>? הקריטריון היחיד הוא היחס <Tex>{'W_B/L'}</Tex>:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {REGIMES.map((r, i) => (
            <div key={i} className={`rounded-xl border p-4 ${r.accent}`}>
              <p className="flex items-center gap-2 font-bold text-slate-800">
                <span aria-hidden>{r.icon}</span> {r.titleHe}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{r.body}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="גררו את רוחב הבסיס">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setRatio(4)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    ratio >= 3 ? 'border-slate-500 bg-slate-700 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  📐 דיודה ארוכה
                </button>
                <button
                  onClick={() => setRatio(0.4)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                    ratio <= 0.8 ? 'border-violet-500 bg-violet-500 text-white shadow' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  📏 דיודה קצרה
                </button>
              </div>
              <Slider
                label={<>רוחב הבסיס · <Tex>{'W_B'}</Tex></>}
                value={ratio}
                min={0.3}
                max={4}
                step={0.1}
                onChange={setRatio}
                display={<Tex>{`${ratio.toFixed(1)}\\,L`}</Tex>}
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                הקו הסגול הוא הפרופיל הממשי; האפור-מקווקו הוא הדעיכה המעריכית (בסיס ארוך). הקו הירוק הוא
                ה<b>שיפוע בקצה</b> — והוא חותך את ציר-ה-<Tex>{'x'}</Tex> בדיוק ב-<Tex>{'L_{eff}=L\\tanh(W_B/L)'}</Tex>,
                האורך שקובע את הזרם.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Readout label="יחס $W_B/L$" value={`×${ratio.toFixed(1)}`} accent="border-slate-100 bg-white" />
              <Readout label="משטר" value={regime} accent="border-sky-100 bg-sky-50" />
              <Readout label="אורך אפקטיבי $L_{eff}/L$" value={leff.toFixed(2)} accent="border-emerald-100 bg-emerald-50" />
              <Readout label="הגברת זרם $L/L_{eff}$" value={`×${factor.toFixed(2)}`} accent="border-violet-100 bg-violet-50" />
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <p className="mb-1 text-center text-xs font-semibold text-slate-400">פרופיל המיעוט בבסיס — מעריכי (ארוך) מול לינארי (קצר)</p>
            <LengthRegimeProfile ratio={ratio} />
          </div>
        </div>
      </Panel>

      <Panel title="מה זה עושה לזרם?">
        <p className="leading-relaxed text-slate-600">
          השיפוע בקצה הוא הזרם, והשיפוע נקבע מ-<Tex>{'L_{eff}'}</Tex> במקום מ-<Tex>{'L'}</Tex>. לכן זרם הרוויה הוא:
        </p>
        <div className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-center">
          <Tex block>{'J_{S,p}=\\frac{qD_p n_i^2}{N_D\\,L_p\\tanh(W_B/L_p)}\\;\\xrightarrow[\\;W_B\\gg L\\;]{}\\;\\frac{qD_p n_i^2}{N_D L_p}\\;,\\quad\\xrightarrow[\\;W_B\\ll L\\;]{}\\;\\frac{qD_p n_i^2}{N_D W_B}'}</Tex>
        </div>
        <ul className="mt-3 list-disc space-y-2 ps-6 leading-relaxed text-slate-600 marker:text-violet-400">
          <li><b>ארוכה</b>: <Tex>{'L_{eff}\\to L'}</Tex> — הזרם <b>מוגבל-רקומבינציה</b> (תלוי בזמן-החיים דרך <Tex>{'L=\\sqrt{D\\tau}'}</Tex>).</li>
          <li><b>קצרה</b>: <Tex>{'L_{eff}\\to W_B<L'}</Tex> — הזרם <b>גדל</b> פי <Tex>{'L/W_B'}</Tex> ו<b>מוגבל-מעבר</b> (כמעט בלי תלות ב-<Tex>{'\\tau'}</Tex>).</li>
        </ul>
      </Panel>

      <Panel title="לאן זה מוביל — הבסיס של הטרנזיסטור">
        <p className="leading-relaxed text-slate-600">
          הדיודה הקצרה אינה רק מקרה-קצה: היא <b>לב פעולת הטרנזיסטור</b> הדו-קוטבי. הבסיס של BJT הוא בדיוק בסיס
          קצר (<Tex>{'W_B\\ll L'}</Tex>), וזו הסיבה שכמעט כל הנשאים המוזרקים חוצים אותו אל האספן <b>בלי להתאחד</b>:
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>בסיס <b>קצר</b> מ-<Tex>{'L'}</Tex></>, body: <>פרופיל לינארי, רקומבינציה זניחה.</> },
            { title: <>הנשאים <b>חוצים מהר</b></>, body: <>מגיעים למגע לפני שמתאחים.</> },
            { title: <>כמעט <b>כולם שורדים</b> את המעבר</>, body: <>שיפוע תלול ⇐ זרם גדול.</> },
          ]}
          outcome={{ label: 'יעילות מעבר גבוהה — עקרון ה-BJT', sub: <>הבסיס הקצר הוא תכונת-תכן, לא תקלה</> }}
        />
      </Panel>
    </div>
  )
}
