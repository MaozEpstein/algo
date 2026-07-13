import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import LinearVsMmseExplorer from '../../../viz/LinearVsMmseExplorer'

/** Lesson 9 · Beyond linear — the cubic contrast + the DNN outlook (§9.2). */
export default function BeyondTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        kind="property"
        titleHe="כשלינארי לא מספיק — Y = X³"
        tex="X\sim N(0,\sigma^2),\ Y=X^3:\quad \hat Y_{MMSE}=x^3,\quad \hat Y_{BLE}=3\sigma^2 x"
        meaningHe={
          'כאן הקשר <b>לא-לינארי</b> והמשתנים <b>אינם</b> גאוסיים משותפים. ה-MMSE האמיתי הוא העקומה $x^3$, ' +
          'אבל האמד הלינארי הטוב ביותר הוא קו ישר בשיפוע $3\\sigma^2$ — והם <b>נבדלים</b>.'
        }
        example={
          <p>
            השיפוע נובע מ-<span dir="ltr"><Tex>{'\\sigma_{xy}=E[X\\cdot X^3]=E[X^4]=3\\sigma^4'}</Tex></span>, אז{' '}
            <span dir="ltr"><Tex>{'\\hat Y_{BLE}=\\tfrac{3\\sigma^4}{\\sigma^2}x=3\\sigma^2 x'}</Tex></span>, עם{' '}
            <span dir="ltr"><Tex>{'\\mathrm{MSE}=6\\sigma^6'}</Tex></span>.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — הקו הישר מול העקומה">
        <p className="mb-3 leading-relaxed text-slate-600">
          העקומה הירוקה היא ה-MMSE האמיתי <span dir="ltr"><Tex>{'x^3'}</Tex></span>; הקו הסגול המקווקו הוא ה-BLE הטוב ביותר.
          הגדילו את <span dir="ltr"><Tex>{'\\sigma'}</Tex></span> וראו איך הקו מתחדד — אך לעולם לא "מדביק" את העקומה.
        </p>
        <LinearVsMmseExplorer />
      </Panel>

      <DefinitionCard
        kind="property"
        titleHe="מעבר ללינארי — רשתות עמוקות"
        tex="\min_{\theta}\ \tfrac1N\sum_{i}c\big(\hat x_\theta(y_i)-x_i\big)"
        meaningHe={
          'הצעד הבא אחרי הבייסיאני-לינארי: (1) קובעים מחלקה <b>לא-לינארית</b> של אמדים $\\hat x_\\theta$; ' +
          '(2) מקרבים את תוחלת העלות ב<b>ממוצע אמפירי</b> על הנתונים; (3) ממזערים ב<b>ירידת גרדיאנט</b>. ' +
          '"רשתות נוירונים עמוקות הן הצעד הבא אחרי הבייסיאני-לינארי."'
        }
        example={
          <p>
            אותה פילוסופיה כמו בשיעור 7 (ירידת גרדיאנט על עלות ריבועית), רק שכעת מזעריזים על פני משפחה עשירה ולא-לינארית של פונקציות.
          </p>
        }
      />
    </div>
  )
}
