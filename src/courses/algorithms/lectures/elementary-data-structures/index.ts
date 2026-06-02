import type { LectureModule } from '@/core/engine/types'
import ElementaryDsExplainer from './ElementaryDsExplainer'

/**
 * Lecture 9 — Elementary Data Structures & Hash Tables (CLRS ch. 10–11). An
 * "explainer" lecture with six tabs: stacks & queues, direct addressing, hash
 * functions, chaining (the flagship), open addressing, and a comparison summary.
 * Each interactive demo runs through LocalPlayer + the shared DsView, so it has
 * the full pipeline (floating transport, narration, watched-variables, steps).
 */
export const elementaryDataStructuresLecture: LectureModule = {
  id: 'elementary-data-structures',
  number: 9,
  titleHe: 'מבני נתונים בסיסיים וטבלאות גיבוב',
  subtitleEn: 'Elementary Data Structures & Hash Tables',
  views: [],
  algorithms: [],
  summary: ElementaryDsExplainer,
  explainer: true,
  glossary: [
    { term: 'מחסנית (Stack)', def: 'מבנה LIFO — האחרון שנכנס ראשון יוצא; Push/Pop בראש בלבד.' },
    { term: 'תור (Queue)', def: 'מבנה FIFO — הראשון שנכנס ראשון יוצא; Enqueue ב-rear, Dequeue ב-front.' },
    { term: 'מיעון ישיר', def: 'טבלה T בגודל |U| עם תא לכל מפתח אפשרי; k שמור בתא k. O(1) אך זיכרון Θ(|U|).' },
    { term: 'פונקציית גיבוב', def: 'h שממפה מפתח מהיקום U לתא בטבלה בגודל m.', tex: 'h(k) = k \\bmod m' },
    { term: 'התנגשות', def: 'שני מפתחות שונים שממופים לאותו תא: h(k₁) = h(k₂).' },
    { term: 'שרשור (Chaining)', def: 'כל תא מחזיק רשימה מקושרת של כל המפתחות שמופו אליו.' },
    { term: 'גורם עומס α', def: 'היחס בין מספר המפתחות n למספר התאים m; קובע את עלות החיפוש.', tex: '\\alpha = n/m' },
    { term: 'מיעון פתוח', def: 'אין רשימות — בהתנגשות מגששים תא פנוי לפי סדרת גישושים.' },
    { term: 'גיבוב אוניברסלי', def: 'בחירת h אקראית ממשפחה H כך שלכל k₁≠k₂ ההסתברות להתנגשות ≤ 1/m.' },
  ],
  formulas: [
    { name: 'גיבוב — שיטת החילוק', tex: 'h(k) = k \\bmod m', note: 'בוחרים m ראשוני, רחוק מחזקת 2.' },
    { name: 'גיבוב — שיטת הכפל', tex: 'h(k) = \\lfloor m\\,(kA \\bmod 1)\\rfloor', note: 'A = (\\sqrt5-1)/2 ≈ 0.618.' },
    { name: 'גורם העומס', tex: '\\alpha = n/m' },
    { name: 'חיפוש בשרשור', tex: '\\Theta(1+\\alpha)', note: 'בתוחלת, גיבוב אחיד פשוט.' },
    { name: 'גישוש לא-מוצלח (מיעון פתוח)', tex: '\\le \\dfrac{1}{1-\\alpha}', note: 'בתוחלת, גיבוב אחיד; דורש α<1.' },
  ],
}
