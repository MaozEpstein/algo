import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import DefinitionCard from '../../../components/DefinitionCard'
import KalmanFilterExplorer from '../../../viz/KalmanFilterExplorer'

/** Lesson 12 · Kalman — the recursive optimal filter (course capstone). */
export default function KalmanTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מסנן קלמן — LMMSE רקורסיבי (למשל GPS)">
        <p className="leading-relaxed text-slate-700">
          מסנן וינר עובד על <b>אצווה</b> של מדידות בבת-אחת. מסנן <b>קלמן</b> עושה את אותו דבר <b>רקורסיבית</b>: בכל צעד
          <b> מנבאים</b> מהמודל ואז <b>מעדכנים</b> עם המדידה החדשה. המודל: מצב <span dir="ltr"><Tex>{'S_n=aS_{n-1}+Q_n'}</Tex></span>,
          מדידה <span dir="ltr"><Tex>{'X_n=S_n+R_n'}</Tex></span>.
        </p>
      </Panel>

      <DefinitionCard
        kind="theorem"
        titleHe="שלב הניבוי (Predict)"
        tex="\hat S_{n|n-1}=a\,\hat S_{n-1|n-1},\qquad P_{n|n-1}=a^2P_{n-1|n-1}+\sigma_Q^2"
        meaningHe={
          'לפני שרואים מדידה חדשה, <b>מנבאים</b> את המצב מהמודל — ואי-הוודאות <b>גדלה</b> ב-$\\sigma_Q^2$ (רעש התהליך). ' +
          'ככל שהמודל רועש יותר, כך הניבוי פחות בטוח.'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'P_{n|n-1}'}</Tex></span> היא שונות שגיאת ה<b>ניבוי</b> — לפני עדכון המדידה.
          </p>
        }
      />

      <DefinitionCard
        kind="theorem"
        titleHe="שלב העדכון (Update)"
        tex="K_n=\dfrac{P_{n|n-1}}{P_{n|n-1}+\sigma_R^2},\quad \hat S_{n|n}=\hat S_{n|n-1}+K_n\big(X_n-\hat S_{n|n-1}\big),\quad P_{n|n}=P_{n|n-1}(1-K_n)"
        meaningHe={
          'מתקנים את הניבוי לפי ה<b>חדשנות</b> (ההפרש בין המדידה לניבוי), משוקללת ב<b>רווח קלמן</b> $K_n$. ' +
          'זהו בדיוק ה<b>ממוצע המשוקלל</b> של שיעורים 8–9 — רק שמתעדכן צעד-אחר-צעד.'
        }
        example={
          <p>
            רעש מדידה גבוה (<span dir="ltr"><Tex>{'\\sigma_R^2'}</Tex></span> גדול) → <span dir="ltr"><Tex>{'K_n\\to0'}</Tex></span>, סומכים על הניבוי;
            רעש קטן → <span dir="ltr"><Tex>{'K_n\\to1'}</Tex></span>, נצמדים למדידה. אחרי העדכון אי-הוודאות <b>קטנה</b>.
          </p>
        }
      />

      <Panel title="🎛️ ארגז חול — מעקב קלמן">
        <p className="mb-3 leading-relaxed text-slate-600">
          המצב האמיתי (אפור מקווקו) נצפה דרך מדידות רועשות (נקודות). מסנן קלמן (ירוק) עוקב אחריו, ורצועת ה-
          <span dir="ltr"><Tex>{'\\pm\\sqrt{P}'}</Tex></span> מצטמצמת עם הזמן. שחקו ברעש המודל והמדידה וראו איך המשקל בין השניים משתנה.
        </p>
        <KalmanFilterExplorer />
      </Panel>

      <Panel title="🎓 סוף הקורס">
        <p className="leading-relaxed text-slate-600">
          מכאן הכול התחבר: מ<b>הסתברות ומשתנים מקריים</b> (1–4), דרך <b>גילוי ואמידה</b> (5–9), אל <b>תהליכים מקריים</b>
          (10–11), ולבסוף ה<b>מסננים האופטימליים</b> — וינר וקלמן — שמפעילים את כל התיאוריה על אותות אמיתיים לאורך זמן.
          כל הכבוד על הדרך! 🎉
        </p>
      </Panel>
    </div>
  )
}
