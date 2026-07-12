import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import { Problem, QA, ACCENT, type Part } from '../../../components/practice'

/**
 * Lesson 5 — practice. Every problem is a REAL course item with its citation:
 *   • ש.ב 5 — שאלה 1 (LRT → sufficient statistics), שאלה 2 (Bernoulli detection)
 *   • תרגול 5 — energy detector (χ²)
 *   • מבחן 2025 מועד א׳ — שאלה 2 (χ² energy detector)
 */

// ── ש.ב 5 · שאלה 1 — LRT → sufficient statistics ─────────────────────────────
const q1Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'הזזת תוחלת: $H_0:N(3,1)$ מול $H_1:N(2,1)$.',
    tex: '\\log T=\\textstyle\\sum_i\\big[(x_i-3)^2-(x_i-2)^2\\big]/2',
    res: <Tex>{'\\textstyle\\sum x_i\\ \\gtrless\\ \\gamma'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'הזזת שונות: $H_0:N(2,1)$ מול $H_1:N(2,2)$.',
    tex: '\\log T\\propto \\textstyle\\sum_i (x_i-2)^2',
    res: <Tex>{'\\textstyle\\sum (x_i-2)^2\\ \\gtrless\\ \\gamma'}</Tex>,
    accent: ACCENT.emerald,
    note: <>מבחן שונות — הסטטיסטיקה היא סכום הריבועים סביב התוחלת.</>,
  },
  {
    kind: 'numeric',
    prompt: 'גאוסי מול לפלס: $H_0:N(0,4)$ מול $H_1:\\tfrac14 e^{-|x|/2}$.',
    tex: '\\log T=\\textstyle\\sum_i\\big[\\tfrac{x_i^2}{8}-\\tfrac{|x_i|}{2}\\big]',
    res: <Tex>{'\\textstyle\\sum (x_i^2-4|x_i|)\\ \\gtrless\\ \\gamma'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'הזזת תוחלת דו-ממדית: $H_0:N(0,I)$ מול $H_1:N((-3,1)^\\top,I)$.',
    tex: '\\log T=\\textstyle\\sum_i(2x_{i,2}-6x_{i,1}-10)/...',
    res: <Tex>{'\\textstyle\\sum (x_{i,2}-3x_{i,1})\\ \\gtrless\\ \\gamma'}</Tex>,
    accent: ACCENT.emerald,
  },
]

// ── ש.ב 5 · שאלה 2 — Bernoulli detection ─────────────────────────────────────
const q2Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'צמצמו את ה-LRT לסטטיסטיקה על $k=\\sum x_i$ ($H_0:\\mathrm{Ber}(\\tfrac12)$, $H_1:\\mathrm{Ber}(\\tfrac1{32})$).',
    tex: 'T=\\dfrac{(1/32)^k(31/32)^{n-k}}{(1/2)^n}',
    res: <Tex>{'k<\\gamma\\ \\Rightarrow\\ H_1'}</Tex>,
    accent: ACCENT.sky,
    note: <>ככל ש-k <b>קטן</b> יותר, סביר יותר ש-<Tex>{'\\theta'}</Tex> נמוך (H₁).</>,
  },
  {
    kind: 'numeric',
    prompt: 'קבעו את הסף מ-$\\alpha=0.5^n$.',
    tex: 'P(k<\\gamma;H_0)=P(k=0;H_0)=(1/2)^n=0.5^n',
    res: <Tex>{'\\gamma=1'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'חשבו את $f_D$.',
    tex: 'f_D=P(k=0;H_1)',
    res: <Tex>{'(31/32)^n'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'כמה דגימות $n$ צריך כדי ש-$f_D<\\tfrac12$?',
    tex: '(31/32)^n<\\tfrac12\\ \\Rightarrow\\ (32/31)^n>2',
    res: <Tex>{'n=22'}</Tex>,
    accent: ACCENT.emerald,
    note: <><Tex>{'n>\\log_{32/31}(2)\\approx21.83'}</Tex>.</>,
  },
]

// ── תרגול 5 · גלאי אנרגיה ─────────────────────────────────────────────────────
const q3Parts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מהי התפלגות $T=\\|x\\|^2$ תחת כל השערה? ($H_0:N(0,\\sigma^2 I)$, $H_1:N(0,(\\sigma_s^2+\\sigma^2)I)$)',
    tex: 'x=\\sigma z\\ (z\\sim N(0,I))\\Rightarrow T=\\sigma^2\\textstyle\\sum z_i^2',
    res: <Tex>{'T;H_0\\sim\\sigma^2\\chi^2_d,\\ \\ T;H_1\\sim(\\sigma_s^2+\\sigma^2)\\chi^2_d'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'קבעו את הסף $\\lambda$ מ-$f_{FA}$.',
    tex: 'f_{FA}=P(\\chi^2_d>\\lambda/\\sigma^2)=1-F_{\\chi^2_d}(\\lambda/\\sigma^2)',
    res: <Tex>{'\\lambda=\\sigma^2 F^{-1}_{\\chi^2_d}(1-f_{FA})'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'כתבו את ה-ROC $f_D(f_{FA})$.',
    tex: 'f_D=1-F_{\\chi^2_d}(\\lambda/(\\sigma_s^2+\\sigma^2))',
    res: <Tex>{'1-F_{\\chi^2_d}\\big(\\tfrac{\\sigma^2}{\\sigma_s^2+\\sigma^2}F^{-1}_{\\chi^2_d}(1-f_{FA})\\big)'}</Tex>,
    accent: ACCENT.emerald,
  },
]

// ── מבחן 2025 מועד א׳ · שאלה 2 — χ² energy detector ──────────────────────────
const examParts: Part[] = [
  {
    kind: 'numeric',
    prompt: 'מצאו את כלל ההכרעה. ($H_0:N(0,I)$ מול $H_1:N(0,(1+\\beta^2)I)$)',
    tex: 'T(x)=\\log\\tfrac{p(x;H_1)}{p(x;H_0)}=-\\tfrac d2\\log(1+\\beta^2)+\\tfrac{\\beta^2}{2(1+\\beta^2)}x^\\top x',
    res: <Tex>{'T=\\|x\\|^2\\ \\gtrless\\ \\lambda'}</Tex>,
    accent: ACCENT.emerald,
  },
  {
    kind: 'numeric',
    prompt: 'קבעו את הסף מ-$P_{FA}=\\alpha$.',
    tex: '\\|x\\|^2;H_0\\sim\\chi^2_d\\ \\Rightarrow\\ P_{FA}=P(\\chi^2_d>\\lambda)',
    res: <Tex>{'\\lambda=F^{-1}_{\\chi^2_d}(1-\\alpha)'}</Tex>,
    accent: ACCENT.sky,
  },
  {
    kind: 'numeric',
    prompt: 'הביעו את $P_D$ כפונקציה של $P_{FA}$.',
    tex: '\\|x\\|^2/(1+\\beta^2);H_1\\sim\\chi^2_d',
    res: <Tex>{'P_D=1-F_{\\chi^2_d}\\big(\\tfrac{F^{-1}_{\\chi^2_d}(1-P_{FA})}{1+\\beta^2}\\big)'}</Tex>,
    accent: ACCENT.emerald,
  },
]

export default function PracticeTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="איך לעבוד עם הלשונית">
        <p className="leading-relaxed text-slate-600">
          כל השאלות נלקחו <b>מחומרי הקורס</b> (ש.ב · תרגול · מבחן) — התגית הכחולה מציינת את המקור. נסו כל סעיף לבד, ואז «פתרון».
        </p>
      </Panel>

      <Problem titleHe="תרגיל — LRT וסטטיסטיקות מספיקות" source="ש.ב 5 · שאלה 1" parts={q1Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          עבור <span dir="ltr"><Tex>{'x_i'}</Tex></span> בלתי-תלויים, חשבו את מבחן יחס הנראות בכל מקרה, וצמצמו לסטטיסטיקה מספיקה (log-LRT).
        </p>
      </Problem>

      <Problem titleHe="תרגיל — גילוי ברנולי וקביעת סף" source="ש.ב 5 · שאלה 2" parts={q2Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'x_i\\sim\\mathrm{Ber}(\\theta)'}</Tex></span> בלתי-תלויים: <span dir="ltr"><Tex>{'H_0:\\theta=\\tfrac12'}</Tex></span> מול{' '}
          <span dir="ltr"><Tex>{'H_1:\\theta=\\tfrac1{32}'}</Tex></span>. מצאו את המבחן, הסף מ-<span dir="ltr"><Tex>{'\\alpha=0.5^n'}</Tex></span>, ואת <span dir="ltr"><Tex>{'n'}</Tex></span> הדרוש.
        </p>
      </Problem>

      <Problem titleHe="תרגיל — גלאי אנרגיה (χ²)" source="תרגול 5 · אות אקראי" parts={q3Parts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          <span dir="ltr"><Tex>{'H_0:\\ x=w'}</Tex></span>, <span dir="ltr"><Tex>{'H_1:\\ x=s+w'}</Tex></span> עם <span dir="ltr"><Tex>{'s\\sim N(0,\\sigma_s^2 I),\\ w\\sim N(0,\\sigma^2 I)'}</Tex></span>. המבחן הוא <span dir="ltr"><Tex>{'T=\\|x\\|^2'}</Tex></span>.
        </p>
      </Problem>

      <Problem titleHe="שאלת מבחן — גלאי אנרגיה χ²" source="מבחן 2025 מועד א׳ · שאלה 2" parts={examParts}>
        <p className="mt-2 leading-relaxed text-slate-700">
          מכריעים בין <span dir="ltr"><Tex>{'H_0:N(0,I_d)'}</Tex></span> ל-<span dir="ltr"><Tex>{'H_1:N(0,(1+\\beta^2)I_d)'}</Tex></span>. מצאו את הכלל, הסף, ואת ה-<span dir="ltr"><Tex>{'P_D(P_{FA})'}</Tex></span>.
        </p>
      </Problem>

      <Panel title="שאלות מהירות">
        <div className="flex flex-col gap-3">
          <QA q="מתי משתמשים במסנן מותאם ומתי בגלאי אנרגיה?">
            <b>מסנן מותאם</b> — כשהאות <Tex>{'s'}</Tex> <b>ידוע</b> (מבחן לינארי <Tex>{'x^\\top\\Sigma^{-1}s'}</Tex>). <b>גלאי אנרגיה</b> —
            כשהאות <b>אקראי/לא ידוע</b> (מבחן ריבועי <Tex>{'\\|x\\|^2'}</Tex>, ביצועים דרך χ²).
          </QA>
          <QA q="למה בגילוי הזזת-תוחלת הסף לא תלוי ב-μ?">
            כי הסף נקבע רק מ-<Tex>{'P_{FA}'}</Tex> (התפלגות תחת <Tex>{'H_0'}</Tex>, שלא תלויה ב-<Tex>{'\\mu'}</Tex>). ה-<Tex>{'\\mu'}</Tex>
            משפיע רק על ה-<Tex>{'P_D'}</Tex> (עד כמה טוב הגילוי), לא על היכן שמים את הסף.
          </QA>
        </div>
      </Panel>
    </div>
  )
}
