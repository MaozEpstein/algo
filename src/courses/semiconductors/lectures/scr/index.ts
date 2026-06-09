import type { LectureModule } from '@/core/engine/types'
import ScrExplainer from './ScrExplainer'

/**
 * Semiconductors — Lesson 4: the SCR (Silicon-Controlled Rectifier / thyristor). A
 * four-layer PNPN latching switch. Understood as two cross-coupled BJTs (PNP+NPN)
 * whose positive feedback latches the device ON once the loop gain α1+α2 reaches 1
 * (⇔ β1·β2≥1) — triggered by a gate pulse (or breakover / dV/dt). The forward I-V is
 * S-shaped with a negative-differential-resistance snapback at the breakover voltage
 * V_BF, an on-state at low voltage, and turn-off only below the holding current I_H.
 */
export const scrLecture: LectureModule = {
  id: 'scr',
  number: 4,
  titleHe: 'תיריסטור (SCR)',
  subtitleEn: 'The Silicon-Controlled Rectifier (Thyristor)',
  views: [],
  algorithms: [],
  summary: ScrExplainer,
  explainer: true,
  glossary: [
    { term: 'תיריסטור / SCR', def: 'מיישר מבוקר — מתג חד-כיווני בעל ארבע שכבות PNPN ושלושה מסופים (A/G/K). חוסם עד שמוצת, ואז ננעל במצב הולכה.' },
    { term: 'שלושת הצמתים', def: '$J_1$ (P₂-N₂), $J_2$ (N₂-P₁), $J_3$ (P₁-N₁). במצב חסימה קדמית $J_2$ נושא את כל המתח.', tex: 'J_1,J_2,J_3' },
    { term: 'מודל שני הטרנזיסטורים', def: 'פיצול ה-PNPN ל-PNP ($P_2N_2P_1$) ול-NPN ($N_2P_1N_1$) מצומדים: הקולט של כל אחד מזין את בסיס השני (משוב חיובי).' },
    { term: 'תנאי הנעילה (latch)', def: 'המכשיר ננעל כש-$\\alpha_1+\\alpha_2\\ge1$, שקול ל-$\\beta_1\\beta_2\\ge1$.', tex: '\\alpha_1+\\alpha_2\\ge1' },
    { term: 'מתח-פריצה $V_{BF}$', def: 'המתח הקדמי שבו ההתקן מוצת ללא שער. יורד ככל שזרם-השער גדל.' },
    { term: 'התנגדות דיפרנציאלית שלילית (NDR)', def: 'אזור באופיין שבו $dV/dI<0$ — המתח קורס כשהזרם עולה; הופך את ה-SCR למתג דו-מצבי.', tex: 'dV/dI<0' },
    { term: 'זרם החזקה $I_H$', def: 'הזרם המינימלי לקיום הנעילה. ירידה מתחתיו מכבה את ההתקן.' },
  ],
  formulas: [
    { name: 'זרם-האנודה (רגנרטיבי)', tex: 'I_A=\\dfrac{\\alpha_2 I_G + I_{leak}}{1-(\\alpha_1+\\alpha_2)}', note: 'מתפרץ כש-$\\alpha_1+\\alpha_2\\to1$ — נעילה.' },
    { name: 'תנאי הנעילה', tex: '\\alpha_1+\\alpha_2\\ge1 \\;\\Leftrightarrow\\; \\beta_1\\beta_2\\ge1' },
    { name: 'מתח-פריצה מול זרם-שער', tex: 'V_{BF}(I_G)\\;\\downarrow\\;\\text{as}\\;I_G\\uparrow' },
  ],
  symbols: [
    { sym: '\\alpha_1,\\alpha_2', he: 'הגברי-הזרם (בסיס משותף) של NPN/PNP', unit: '—' },
    { sym: 'V_{BF}', he: 'מתח-הפריצה (breakover)', unit: 'V' },
    { sym: 'I_H', he: 'זרם ההחזקה (holding)', unit: 'A' },
    { sym: 'I_G', he: 'זרם השער', unit: 'A' },
    { sym: 'J_1,J_2,J_3', he: 'שלושת צמתי ה-PNPN', unit: '—' },
  ],
}
