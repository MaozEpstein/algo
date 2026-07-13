import type { ExamStudyGuide } from '@/core/platform/types'

/**
 * The "hot" formulas and understanding-theorems distilled from a systematic pass
 * over all 14 statistics exam solutions (2020–2025). Ranked by how often each is
 * used across the solutions, most-used first. Each row carries a short explanation
 * so the reader internalizes the principle, not just the symbols. Shown in the
 * second tab of the exam-categories modal.
 */
export const statisticsExamStudyGuide: ExamStudyGuide = {
  formulas: [
    {
      titleHe: 'אמד LMMSE (אפיני) ושגיאתו',
      tex: '\\hat x=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y),\\quad \\mathrm{MSE}=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}',
      detailHe:
        'האמד הלינארי הטוב ביותר: מתחילים מהתוחלת המוקדמת $\\mu_x$ ומתקנים לפי כמה שהמדידה חרגה מהצפוי, ' +
        'משוקלל ב<b>יחס הקווריאנסים</b>. דורש רק מומנטים מסדר 1–2. <b>מלכודת:</b> אם $C_{xy}=0$ האמד קורס לתוחלת ' +
        'המוקדמת — אבל אי-מתאם אינו אי-תלות, אז MMSE עדיין יכול לנצל את המדידה.',
      usageHe: '~15 שאלות · כל T3, ניבוי ב-T4, prior ב-T2',
    },
    {
      titleHe: 'אוטו-קורלציה ותנאי WSS',
      tex: 'R_X(\\tau)=E[X(t)X(t+\\tau)];\\quad \\text{WSS}:\\ m_X=\\text{const},\\ R_X(t_1,t_2)=R_X(\\tau)',
      detailHe:
        'המפתח לכל שאלת תהליך: בודקים <b>שני</b> תנאים — תוחלת קבועה ואוטו-קורלציה שתלויה רק בהפרש הזמנים $\\tau$. ' +
        'אם אחד נכשל — לא WSS. $R_X(0)=E[X^2]$ הוא ההספק והשיא, ותמיד $|R_X(\\tau)|\\le R_X(0)$.',
      usageHe: '~12 שאלות · כל T4 + T6',
    },
    {
      titleHe: 'נראות מרבית (MLE)',
      tex: '\\hat\\theta_{ML}=\\arg\\max_\\theta \\sum_i\\log f(x_i;\\theta)\\ \\Rightarrow\\ \\partial_\\theta(\\cdot)=0',
      detailHe:
        'לוקחים $\\log$ לנראות (הופך מכפלה לסכום), גוזרים לפי הפרמטר ומשווים לאפס. מתאים ל<b>פרמטר קבוע</b> לא-ידוע. ' +
        'תמיד לבדוק אחר-כך אם האמד <b>מוטה</b> (למשל $\\hat\\sigma^2_{ML}$ של הגאוסי מוטה כלפי מטה).',
      usageHe: '~10 שאלות · כל T1, ML ב-T2, MLE של α ב-T4',
    },
    {
      titleHe: 'פירוק הנראות',
      tex: 'L(\\theta)=\\prod_i f(x_i;\\theta);\\qquad \\text{מרקובי:}\\ \\prod_i f(x_i\\mid x_{i-1})',
      detailHe:
        'לפני הכל — כותבים את הנראות. ל-i.i.d זו <b>מכפלת שוליים</b>; לתהליך AR/מרקובי מפרקים ל<b>מכפלת מותנות</b> ' +
        '$f(x_i\\mid x_{i-1})$, שכל אחת גאוסית $N(\\alpha x_{i-1},\\sigma^2)$ — וזה מה שמאפשר MLE של דינמיקת התהליך.',
      usageHe: '~9 שאלות · T1 + תהליכי AR ב-T4',
    },
    {
      titleHe: 'הטיה ופירוק ה-MSE',
      tex: '\\mathrm{bias}=E[\\hat\\theta]-\\theta,\\qquad \\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{Var}(\\hat\\theta)',
      detailHe:
        'הכלי להשוואת אמדים: ה-MSE מתפרק ל<b>הטיה בריבוע ועוד שונות</b>. אמד יכול להיות חסר-הטיה אך עם שונות גדולה — ' +
        'ולהיפך. כששואלים "איזה אמד עדיף" — משווים MSE, לא רק הטיה.',
      usageHe: '~9 שאלות · כל T1 + T2',
    },
    {
      titleHe: 'חוק ההחלקה (התניה על latent)',
      tex: 'E[X]=E\\big[E[X\\mid Y]\\big];\\quad E[X\\mid Y]=E\\big[E[X\\mid Y,A]\\mid Y\\big]',
      detailHe:
        'כשיש משתנה חבוי $A$ (gain/sign/label אקראי) שמסבך: <b>מתנים עליו קודם</b> — המצב נעשה גאוסי ופשוט — ' +
        'ואז ממצעים עליו. גם שונות שלמה $\\mathrm{Var}(X)=E[\\mathrm{Var}(X\\mid Y)]+\\mathrm{Var}(E[X\\mid Y])$.',
      usageHe: '~8 שאלות · מיקסטורות ב-T3 + T4',
    },
    {
      titleHe: 'מבחן יחס הנראות (LRT)',
      tex: 'T(x)=\\dfrac{f(x;H_1)}{f(x;H_0)}\\ \\gtrless_{H_0}^{H_1}\\ \\eta',
      detailHe:
        'כל שאלת גילוי מתחילה כאן: יחס הנראות מול סף. לוקחים $\\log$ כדי לפשט (מבטל מעריכים ומשאיר סטטיסטי לינארי/ריבועי). ' +
        'הסף $\\eta$ נקבע מרמת האזעקת-שווא $P_{FA}$ הדרושה.',
      usageHe: '~7 שאלות · כל T5 + גילוי פואסון',
    },
    {
      titleHe: 'שונות וקווריאנס של צירוף לינארי',
      tex: '\\mathrm{Var}\\Big(\\textstyle\\sum_i a_iX_i\\Big)=\\sum_i\\sum_j a_ia_j\\,\\mathrm{Cov}(X_i,X_j),\\quad \\mathrm{Cov}(Ax)=A\\,C\\,A^\\top',
      detailHe:
        'מנוע החישוב של מומנטים בתהליכים ובמודל הלינארי. לרכיבים <b>בלתי-תלויים</b> האיברים הצולבים מתאפסים. ' +
        'הכלל $ACA^\\top$ מעביר מטריצת קווריאנס דרך טרנספורם לינארי — בסיס גם ל-LMMSE הווקטורי.',
      usageHe: '~7 שאלות · מהלך מקרי, MA, מודל לינארי',
    },
    {
      titleHe: 'AR(1): שונות סטציונרית ואוטו-קורלציה',
      tex: '\\sigma_0^2=\\dfrac{\\sigma^2}{1-\\alpha^2},\\qquad R(k)=\\dfrac{\\sigma^2}{1-\\alpha^2}\\,\\alpha^{|k|}',
      detailHe:
        'לתהליך AR <b>יציב</b> ($|\\alpha|<1$): מאתחלים בשונות הסטציונרית $\\sigma_0^2$ כדי שיהיה WSS כבר מהצעד הראשון, ' +
        'והאוטו-קורלציה <b>דועכת גאומטרית</b>. אם $|\\alpha|\\ge1$ השונות מתפוצצת — לא סטציונרי.',
      usageHe: '~5 שאלות · שאלות AR ב-T4',
    },
    {
      titleHe: 'פונקציית Q וביצועי גילוי',
      tex: 'Q(a)=\\int_a^\\infty\\tfrac{1}{\\sqrt{2\\pi}}e^{-t^2/2}dt,\\qquad P_D=Q\\big(Q^{-1}(P_{FA})-d\\big)',
      detailHe:
        'הזנב של הגאוסי מודד את ביצועי הגלאי: גם $P_{FA}$ וגם $P_D$ מתבטאים דרך $Q$. המרחק $d$ (יחס אות-לרעש) ' +
        'קובע כמה טוב מפרידים בין ההשערות — ככל שגדול, $P_D$ גבוה יותר לאותו $P_{FA}$.',
      usageHe: '~5 שאלות · ביצועי T5',
    },
  ],
  insights: [
    {
      titleHe: 'עקרון האורתוגונליות',
      detailHe:
        'הרעיון המאחד של <b>כל</b> האמידה: האמד האופטימלי הוא ה<b>הטלה</b> של האמת על מרחב המדידות — ולכן השגיאה ' +
        '<b>ניצבת</b> למדידות. ב-LMMSE הניצבות היא לכל פונקציה <b>לינארית</b> של המדידה; ב-MMSE לכל פונקציה. ' +
        'מהתנאי $E[(\\text{שגיאה})\\cdot(\\text{מדידה})]=0$ נגזרות ישירות כל נוסחאות האמידה.',
      usageHe: '~20 שאלות אמידה',
    },
    {
      titleHe: 'גאוסי משותף ⇒ MMSE = LMMSE',
      detailHe:
        'בעולם הגאוסי התוחלת המותנית $E[X\\mid Y]$ יוצאת <b>לינארית</b> — אז האמד הלינארי הפשוט הוא כבר האופטימלי ' +
        'המוחלט, וזה מה שהופך רוב שאלות האמידה לפתירות בנוסחה אחת. ברגע שיש אי-גאוסיות (אחיד, מיקסטורה, $X^3$) — ' +
        'MMSE ו-LMMSE <b>נפרדים</b>, וצריך לחשב את התוחלת המותנית ישירות.',
      usageHe: 'רוב T3 + ניבוי גאוסי ב-T4',
    },
    {
      titleHe: 'קריטריון WSS (סטציונריות רחבה)',
      detailHe:
        'לא צריך את כל ההתפלגות כדי לקבוע יציבות בזמן — מספיק לבדוק <b>שני מומנטים</b>: תוחלת קבועה ואוטו-קורלציה ' +
        'תלוית-פיגור בלבד. זו הדרישה החלשה והקלה-לבדיקה (לעומת SSS). בתהליך <b>גאוסי</b>, WSS אף שקול ל-SSS.',
      usageHe: '10 שאלות תהליכים (T4)',
    },
    {
      titleHe: 'התניה על משתנה חבוי',
      detailHe:
        'כשיש latent אקראי שמסבך (gain/sign אקראי, רעש מעורב) — <b>מתנים עליו</b>, פותרים את המקרה הפשוט (בד"כ גאוסי), ' +
        'ואז <b>ממצעים</b> על ה-latent. זה הופך בעיה "בלתי-אפשרית" לשתי בעיות קלות, ומכניס את הפוסטריור של ה-latent ' +
        'לתמונה — המיקרו-תבנית החוזרת ביותר בשאלות הבייסיאניות.',
      usageHe: '~6 שאלות מיקסטורה ב-T3',
    },
    {
      titleHe: 'ניימן-פירסון — ה-LRT אופטימלי',
      detailHe:
        'מבין <b>כל</b> הגלאים שמקיימים $P_{FA}\\le\\alpha$, מבחן יחס הנראות ממקסם את $P_D$ — הוא ה<b>אופטימלי</b>. ' +
        'לכן בכל שאלת גילוי מתחילים מיחס הנראות ולא ממציאים כלל אד-הוק. זה ה"למה" מאחורי כל תבנית T5.',
      usageHe: '6 שאלות גילוי (T5)',
    },
  ],
  masterBeats: [
    { titleHe: 'אפיין את המודל', textHe: 'כתוב את הצפיפות / הנראות / המומנטים — $\\mu,\\ C,\\ R_X$ או $\\prod f$. כאן טמונה כל ה"קושי".' },
    { titleHe: 'הפעל את נוסחת הכלי', textHe: 'בחר את הכלי המתאים לפי סוג הבעיה — LMMSE / MLE / LRT / אוטו-קורלציה — וכתוב את נוסחתו.' },
    { titleHe: 'הצב, אמור את המשפט, וחשב ביצועים', textHe: 'הצב את המומנטים, נמק במשפט המנחה (אורתוגונליות / גאוסי⇒MMSE=LMMSE / WSS / ניימן-פירסון), וחשב MSE / $P_D$ / הטיה.' },
  ],
  recipes: [
    {
      templateId: 'T3',
      titleHe: 'אמידה בייסיאנית (LMMSE / MMSE)',
      countHe: '11 שאלות',
      steps: [
        { kind: 'model', textHe: 'חשב את המומנטים מהמודל.', tex: '\\mu_x,\\ \\mu_y,\\ C_{xy}=E[XY],\\ C_{yy}' },
        { kind: 'formula', textHe: 'כתוב את אמד ה-LMMSE.', tex: '\\hat x=\\mu_x+C_{xy}C_{yy}^{-1}(y-\\mu_y)' },
        { kind: 'substitute', textHe: 'הצב וחשב את שגיאתו.', tex: '\\mathrm{MSE}=C_{xx}-C_{xy}C_{yy}^{-1}C_{yx}' },
        { kind: 'theorem', textHe: '<b>אמור:</b> אם $x,y$ גאוסיים משותפים ⇒ $\\text{MMSE}=\\text{LMMSE}$ — וסיימת. אחרת חשב $E[X\\mid Y]$ ישירות.' },
        { kind: 'result', textHe: 'אם יש משתנה חבוי $A$ (gain/sign): התנה עליו, פתור את המקרה הגאוסי, ואז מצע ב<b>חוק ההחלקה</b>.', tex: 'E[X\\mid Y]=E\\big[E[X\\mid Y,A]\\mid Y\\big]' },
      ],
    },
    {
      templateId: 'T4',
      titleHe: 'תהליך מקרי (מומנטים + WSS + ניבוי)',
      countHe: '10 שאלות',
      steps: [
        { kind: 'formula', textHe: 'חשב את פונקציית התוחלת (הכנס את הגדרת $X[n]$).', tex: 'm_X(t)=E[X(t)]' },
        { kind: 'substitute', textHe: 'חשב אוטו-קורלציה — פתח את המכפלה והשתמש ב-$E[w_iw_j]=\\sigma^2\\delta_{ij}$.', tex: 'R_X(t_1,t_2)=E[X(t_1)X(t_2)]' },
        { kind: 'theorem', textHe: '<b>אמור את קריטריון WSS:</b> תוחלת קבועה <b>וגם</b> אוטו-קורלציה תלוית-פיגור בלבד. אם אחד נכשל — לא WSS.' },
        { kind: 'result', textHe: 'ניבוי LMMSE מהעבר (עקרון האורתוגונליות).', tex: '\\hat x[n]=\\tfrac{R_X(1)}{R_X(0)}\\,x[n-1]' },
      ],
    },
    {
      templateId: 'T1',
      titleHe: 'אמידה קלאסית (MLE)',
      countHe: '6 שאלות',
      steps: [
        { kind: 'formula', textHe: 'כתוב את הנראות (מכפלת שוליים ל-i.i.d).', tex: 'L(\\theta)=\\prod_i f(x_i;\\theta)' },
        { kind: 'substitute', textHe: 'קח $\\log$, גזור לפי $\\theta$ והשווה לאפס.', tex: '\\partial_\\theta \\textstyle\\sum_i\\log f(x_i;\\theta)=0' },
        { kind: 'result', textHe: 'בודד את $\\hat\\theta_{ML}$.' },
        { kind: 'theorem', textHe: '<b>בדוק הטיה:</b> $\\mathrm{bias}=E[\\hat\\theta]-\\theta$, והשווה אמדים לפי $\\mathrm{MSE}=\\mathrm{bias}^2+\\mathrm{Var}$.' },
      ],
    },
    {
      templateId: 'T5',
      titleHe: 'גילוי / בדיקת השערות',
      countHe: '6 שאלות',
      steps: [
        { kind: 'formula', textHe: 'כתוב את מבחן יחס הנראות.', tex: 'T(x)=\\tfrac{f(x;H_1)}{f(x;H_0)}\\gtrless\\eta' },
        { kind: 'substitute', textHe: 'קח $\\log$ ופשט לסטטיסטי מספיק (לינארי/ריבועי) מול סף $\\gamma$.' },
        { kind: 'substitute', textHe: 'קבע את הסף מרמת האזעקת-שווא הדרושה.', tex: '\\gamma \\Leftarrow P_{FA}=Q(\\gamma/\\sigma)' },
        { kind: 'result', textHe: 'חשב את הסתברות הגילוי.', tex: 'P_D=Q\\big(Q^{-1}(P_{FA})-d\\big)' },
        { kind: 'theorem', textHe: '<b>נמק:</b> ניימן-פירסון — ה-LRT אופטימלי. אם הפרמטר לא-ידוע → GLRT (הצב MLE).' },
      ],
    },
    {
      templateId: 'T2',
      titleHe: 'מודל לינארי (ML / LS / LMMSE)',
      countHe: '5 שאלות',
      steps: [
        { kind: 'model', textHe: 'כתוב את המודל הלינארי ואת פונקציית המטרה.', tex: 'y=H\\theta+w' },
        { kind: 'formula', textHe: 'האמד (ML=LS; עם רעש צבעוני — WLS עם $\\Sigma^{-1}$).', tex: '\\hat\\theta=(H^\\top H)^{-1}H^\\top y' },
        { kind: 'substitute', textHe: 'חשב הטיה וקווריאנס.', tex: '\\mathrm{Cov}(\\hat\\theta)=\\sigma^2(H^\\top H)^{-1}' },
        { kind: 'theorem', textHe: '<b>אמור:</b> עם prior גאוסי → LMMSE, וה-ML הוא הגבול הדיפוזי ($\\sigma_\\theta^2\\to\\infty$).' },
      ],
    },
  ],
}
