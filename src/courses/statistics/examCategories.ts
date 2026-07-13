import type { ExamCategory } from '@/core/platform/types'

/**
 * Taxonomy of the statistics final-exam questions by recurring style/template.
 * Built from a systematic pass over all 14 exams (2020–2025, 42 questions).
 * Each instance's `examId` matches an entry in `statisticsExams`, so the modal can
 * link the chip to that exam's PDF. Surfaced via the "טבלה לפי קטגוריה" button.
 */
const i = (examId: string, q: string) => ({ examId, q })

export const statisticsExamCategories: ExamCategory[] = [
  {
    id: 'T1',
    titleHe: 'אמידה קלאסית — MLE + הטיה/שונות',
    markerHe: 'מדגם i.i.d: מוצאים נראות מרבית, בודקים הטיה, ומשווים אמדים לפי MSE.',
    instances: [i('2020-moed-a', 'שאלה 1'), i('2020-moed-b', 'שאלה 1'), i('2021-moed-a', 'שאלה 1'), i('2022-moed-a', 'שאלה 1'), i('2023-moed-b', 'שאלה 1'), i('2025-moed-b', 'שאלה 2')],
  },
  {
    id: 'T2',
    titleHe: 'מודל לינארי — ML / LS / BLUE / LMMSE',
    markerHe: 'מודל $y=h\\theta+w$: אמד לינארי, השוואת LS/WLS/ML, ומול prior בייסיאני.',
    instances: [i('2021-moed-b', 'שאלה 2'), i('2022-moed-b', 'שאלה 1'), i('2023-moed-a', 'שאלה 3'), i('2024-moed-a', 'שאלה 2'), i('2024-moed-b', 'שאלה 3')],
  },
  {
    id: 'T3',
    titleHe: 'אמידה בייסיאנית — אות ברעש, LMMSE מול MMSE',
    markerHe: 'נתון $Y=X+\\text{רעש}$: מחשבים LMMSE ושגיאתו מול MMSE, משווים וגבולות. לרוב עם משתנה חבוי (gain/sign/label).',
    instances: [i('2020-moed-a', 'שאלה 2'), i('2020-moed-b', 'שאלה 2'), i('2021-moed-a', 'שאלה 2'), i('2021-moed-s', 'שאלה 3'), i('2022-moed-c', 'שאלה 2'), i('2023-moed-a', 'שאלה 1'), i('2023-moed-b', 'שאלה 2'), i('2024-moed-a', 'שאלה 3'), i('2024-moed-b', 'שאלה 1'), i('2025-moed-a', 'שאלה 1'), i('2025-moed-b', 'שאלה 1')],
  },
  {
    id: 'T4',
    titleHe: 'תהליך מקרי — תוחלת + אוטו-קורלציה + WSS + ניבוי',
    markerHe: 'מגדירים $X[n]$ (MA / AR / מהלך מקרי): מומנטים, בדיקת WSS, וניבוי LMMSE/MMSE מהעבר.',
    instances: [i('2020-moed-a', 'שאלה 3'), i('2020-moed-b', 'שאלה 3'), i('2021-moed-a', 'שאלה 3'), i('2021-moed-s', 'שאלה 2'), i('2022-moed-a', 'שאלה 3'), i('2022-moed-c', 'שאלה 3'), i('2023-moed-a', 'שאלה 2'), i('2023-moed-b', 'שאלה 3'), i('2025-moed-a', 'שאלה 3'), i('2025-moed-b', 'שאלה 3')],
  },
  {
    id: 'T5',
    titleHe: 'גילוי / בדיקת השערות — LRT + סף + P_D/P_FA',
    markerHe: 'השערות $H_0/H_1$ גאוסיות: יחס נראות, סף לרמת $P_{FA}$ נתונה, ולעיתים GLRT.',
    instances: [i('2022-moed-a', 'שאלה 2'), i('2022-moed-b', 'שאלה 2'), i('2022-moed-c', 'שאלה 1'), i('2024-moed-a', 'שאלה 1'), i('2024-moed-b', 'שאלה 2'), i('2025-moed-a', 'שאלה 2')],
  },
  {
    id: 'T6',
    titleHe: 'תהליך פואסון (מונה)',
    markerHe: 'תהליך מונה, לעיתים לא-הומוגני: התפלגות בזמן $t$ + אוטו-קורלציה (לעיתים עם גילוי).',
    instances: [i('2021-moed-b', 'שאלה 1'), i('2021-moed-s', 'שאלה 1'), i('2022-moed-b', 'שאלה 3')],
  },
  {
    id: 'T7',
    titleHe: 'תיאוריה / הוכחה — עקרון האורתוגונליות',
    markerHe: 'גזירת אמדי LMMSE/MMSE מעקרון האורתוגונליות והוכחת אופטימליות.',
    instances: [i('2021-moed-b', 'שאלה 3')],
  },
]
