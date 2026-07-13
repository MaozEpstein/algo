import type { ComplexityProof } from '@/core/engine/types'
import Tex from '@/core/components/Tex'
import DefinitionCard from '../../../components/DefinitionCard'

const arProof: ComplexityProof = {
  result: 'R_X(k)=\\tfrac{\\sigma^2}{1-\\alpha^2}\\,\\alpha^{|k|}',
  claimHe: 'האוטו-קורלציה של AR(1) X[n]=αX[n−1]+W[n] (|α|<1) דועכת גאומטרית (דוגמה 44).',
  steps: [
    { he: 'הספק מהריבוע של המשוואה:', tex: 'E[X^2[n]]=\\alpha^2 E[X^2[n-1]]+\\sigma^2' },
    { he: 'ב-WSS E[X²] קבוע ⇒ פותרים ל-R(0):', tex: 'R(0)=\\alpha^2 R(0)+\\sigma^2\\ \\Rightarrow\\ R(0)=\\tfrac{\\sigma^2}{1-\\alpha^2}' },
    { he: 'כופלים ב-X[n−k] ולוקחים תוחלת — נוסחת נסיגה:', tex: 'E[X[n]X[n-k]]=\\alpha E[X[n-1]X[n-k]]\\ \\Rightarrow\\ R(k)=\\alpha R(k-1)' },
    { he: 'פותרים את הנסיגה:', tex: 'R(k)=\\alpha^{|k|}R(0)=\\tfrac{\\sigma^2}{1-\\alpha^2}\\alpha^{|k|}' },
  ],
  intuitionHe: 'הזיכרון דועך גאומטרית: ככל ש-|α| קרוב ל-1 התהליך "זוכר" רחוק יותר וההספק R(0) מתפוצץ. |α|≥1 — לא סטציונרי.',
}

/** Lesson 11 · Examples — cosine, MA, random walk, AR autocorrelations. */
export default function ExamplesTab() {
  return (
    <div className="flex flex-col gap-5">
      <DefinitionCard
        n="דוגמאות 40–41"
        kind="property"
        titleHe="קוסינוס: משרעת אקראית מול פאזה אקראית"
        tex="A\cos(2\pi t):\ \text{לא WSS}\qquad \cos(2\pi t+\Theta),\,\Theta\sim U[-\pi,\pi]:\ R_X(\tau)=\tfrac12\cos(2\pi\tau)"
        meaningHe={
          'עם <b>משרעת</b> אקראית: <span dir="ltr">$R_X=E[A^2]\\cos(2\\pi t_1)\\cos(2\\pi t_2)$</span> — תלוי בזמנים המוחלטים, <b>לא WSS</b>. ' +
          'עם <b>פאזה</b> אקראית אחידה: התוחלת 0 והאוטו-קורלציה תלויה רק בפיגור — <b>WSS</b>.'
        }
        example={
          <p>
            הפאזה האחידה "מוחקת" את התלות בזמן המוחלט: איבר תדר-הסכום מתאפס באינטגרל על <span dir="ltr"><Tex>{'\\Theta'}</Tex></span>, ונשאר{' '}
            <span dir="ltr"><Tex>{'\\tfrac12\\cos(2\\pi(t_1-t_2))'}</Tex></span>.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 42"
        kind="property"
        titleHe="ממוצע נע — MA"
        tex="X[n]=W[n]+W[n-1]\ \Rightarrow\ R_X(k)=\{2:k{=}0,\ 1:|k|{=}1,\ 0:\text{else}\}"
        meaningHe={
          'ממוצע נע הוא <b>WSS</b> עם אוטו-קורלציה בעלת <b>זיכרון סופי</b>: מסדר $K$ מתקיים $R_X(k)=0$ לכל $|k|>K$. ' +
          'כאן $K=1$ ולכן רק פיגורים 0 ו-±1 שונים מאפס.'
        }
        example={
          <p>
            <span dir="ltr"><Tex>{'R_X(0)=2'}</Tex></span> (הספק — שני מחוברים בלתי-תלויים), <span dir="ltr"><Tex>{'R_X(\\pm1)=1'}</Tex></span> (מחובר משותף אחד).
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 43"
        kind="property"
        titleHe="מהלך מקרי — לא WSS"
        tex="X[n]=\sum_{i=1}^{n}W[i]\ \Rightarrow\ R_X(n,m)=\sigma^2\min(n,m)"
        meaningHe={
          'האוטו-קורלציה תלויה ב<b>שני</b> הזמנים (דרך ה-$\\min$), לא רק בפיגור — ולכן התהליך <b>אינו WSS</b>. ' +
          'השונות $\\mathrm{Var}(X[n])=\\sigma^2 n$ <b>גדלה</b> ללא גבול.'
        }
        example={
          <p>
            זהו בדיוק המונה משיעור 10 בגרסה גאוסית: סכום מצטבר של רעש לבן — "הולך ומתפזר" עם הזמן.
          </p>
        }
      />

      <DefinitionCard
        n="דוגמה 44"
        kind="theorem"
        titleHe="אוטו-רגרסיה — AR(1)"
        tex="X[n]=\alpha X[n-1]+W[n],\ |\alpha|<1\ \Rightarrow\ R_X(k)=\dfrac{\sigma^2}{1-\alpha^2}\,\alpha^{|k|}"
        meaningHe={
          'תהליך AR(1) יציב הוא <b>WSS</b> עם אוטו-קורלציה <b>דועכת גאומטרית</b>. ההספק $R(0)=\\sigma^2/(1-\\alpha^2)$ ' +
          'גדל ככל ש-$|\\alpha|\\to1$ (זיכרון ארוך יותר).'
        }
        example={
          <p>
            נסיגה נקייה: <span dir="ltr"><Tex>{'R(k)=\\alpha R(k-1)'}</Tex></span>, בדיוק כמו קשר הצירוף עצמו — הזיכרון "מתכווץ" בגורם{' '}
            <span dir="ltr"><Tex>{'\\alpha'}</Tex></span> בכל צעד.
          </p>
        }
        proof={arProof}
      />
    </div>
  )
}
