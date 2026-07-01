import { useState } from 'react'
import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { EFFECT_FAMILIES } from '../data/crossLinks'
import EffectParallelCard from '../components/EffectParallelCard'

/** Overview · Effects — every non-ideal effect in the course, grouped by effect-FAMILY (sub-tabs)
 *  so the cross-device parallels (Early ≡ CLM, the breakdown mechanisms…) stand out. */
export default function EffectsTab() {
  const [active, setActive] = useState(EFFECT_FAMILIES[0].id)
  const family = EFFECT_FAMILIES.find((f) => f.id === active) ?? EFFECT_FAMILIES[0]

  return (
    <div className="flex flex-col gap-5">
      <Panel title="אפקטים לא-אידיאליים — לפי משפחות, לא לפי התקן">
        <p className="leading-relaxed text-slate-700">
          במקום לרשום אפקט לכל התקן בנפרד, כאן הם מאורגנים לפי <b>משפחת-אפקט</b>. כך רואים שאותה פיזיקה
          חוזרת בהתקנים שונים — למשל <b>אפקט Early ב-BJT</b> ו<b>התקצרות-התעלה ב-MOSFET</b> הם אותו דבר בדיוק.
          לחצו על משפחה, וכל חבר מקושר לשיעור-המקור שלו.
        </p>

        {/* effect-family sub-tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {EFFECT_FAMILIES.map((f) => {
            const isActive = f.id === active
            return (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span aria-hidden>{f.icon}</span>
                {f.title}
              </button>
            )
          })}
        </div>
      </Panel>

      <EffectParallelCard family={family} />

      <Panel title="הרעיון הגדול">
        <p className="leading-relaxed text-slate-600">
          כמעט כל האפקטים הלא-אידיאליים הם וריאציה על מוטיב אחד: <b>פרמטר שחשבנו לקבוע — אינו קבוע</b>.
          רוחב-אזור-הפעולה (Early/CLM), גובה-המחסום (שוטקי/מצע), הניידות (שדה-גבוה), או ה"אפס" שמתחת
          לסף (תת-סף). לזהות את המוטיב = להבין את כל ההתקנים יחד.<Tex>{'\\;'}</Tex>
        </p>
      </Panel>
    </div>
  )
}
