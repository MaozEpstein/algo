import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import ScrStructure from '../components/ScrStructure'
import ScrSymbol from '../components/ScrSymbol'

/** Lesson 4 — what an SCR is, its 4-layer PNPN structure, junctions and symbol. */
export default function StructureTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="מהו תיריסטור (SCR)?">
        <p className="leading-relaxed text-slate-700">
          ה-<b>SCR</b> (Silicon-Controlled Rectifier) הוא <b>מיישר מבוקר</b> — מתג חד-כיווני בעל ארבע שכבות
          <Tex>{'\\,P\\text{-}N\\text{-}P\\text{-}N'}</Tex> ושלושה מסופים: <b>אנודה</b> (A), <b>קתודה</b> (K) ו<b>שער</b> (G).
          בניגוד לדיודה, הוא <b>חוסם</b> זרם קדמי עד שפולס-שער מצית אותו — ואז הוא <b>ננעל</b> במצב הולכה וממשיך
          להוליך גם אחרי שהשער מתבטל, עד שהזרם יורד מתחת לזרם-ההחזקה.
        </p>
      </Panel>

      <Panel title="מבנה ארבע-השכבות (PNPN)">
        <div className="grid gap-4 lg:grid-cols-2">
          <ScrStructure />
          <div className="flex flex-col justify-center gap-2 text-sm leading-relaxed text-slate-600">
            <p>ארבע השכבות יוצרות <b>שלושה צמתים</b>:</p>
            <ul className="list-inside list-disc space-y-1">
              <li><Tex>{'J_1'}</Tex> (<Tex>{'P_2\\text{-}N_2'}</Tex>) ו-<Tex>{'J_3'}</Tex> (<Tex>{'P_1\\text{-}N_1'}</Tex>) — מוטים <b>קדמית</b> במצב הולכה.</li>
              <li><Tex>{'J_2'}</Tex> (<Tex>{'N_2\\text{-}P_1'}</Tex>) — הצומת ש<b>חוסם</b> את המתח הקדמי במצב כבוי.</li>
            </ul>
            <p>השער מחובר ל-<Tex>{'P_1'}</Tex>, ומזריק אליו זרם כדי להצית את ההתקן.</p>
          </div>
        </div>
      </Panel>

      <Panel title="הסמל הסכמטי">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <ScrSymbol />
          <p className="text-sm leading-relaxed text-slate-600">
            כמו דיודה (A→K), אך עם <b>הדק שער</b> (G) ליד הקתודה. החץ של הדיודה מזכיר שההולכה היא חד-כיוונית;
            השער הוא ה"הדק" שמצית את ההולכה.
          </p>
        </div>
      </Panel>
    </div>
  )
}
