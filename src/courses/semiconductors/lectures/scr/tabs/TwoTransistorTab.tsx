import Tex from '@/core/components/Tex'
import Panel from '../../../components/Panel'
import StepFlow from '../../../components/StepFlow'
import TwoTransistorModel from '../components/TwoTransistorModel'

/** Lesson 4 — the two-transistor (regenerative) model. */
export default function TwoTransistorTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="המודל הדו-טרנזיסטורי">
        <p className="leading-relaxed text-slate-700">
          הטריק להבנת ה-SCR: לפצל את ה-PNPN לשני טרנזיסטורים <b>משולבים</b> שחולקים שכבות — <Tex>{'PNP'}</Tex>
          (<Tex>{'P_2N_2P_1'}</Tex>, נקרא <Tex>{'Q_2'}</Tex>) ו-<Tex>{'NPN'}</Tex> (<Tex>{'N_2P_1N_1'}</Tex>, נקרא <Tex>{'Q_1'}</Tex>).
          השכבות האמצעיות <Tex>{'N_2'}</Tex> ו-<Tex>{'P_1'}</Tex> משמשות בו-זמנית בסיס לאחד וקולט לשני.
        </p>
        <div className="mt-3">
          <TwoTransistorModel />
        </div>
      </Panel>

      <Panel title="המשוב החיובי (regeneration)">
        <p className="leading-relaxed text-slate-700">
          הקולט של כל טרנזיסטור מזין את <b>בסיס</b> השני. לכן ברגע שזרם קטן מתחיל לזרום — הוא <b>מזין את עצמו</b>:
        </p>
        <StepFlow
          tone="forward"
          steps={[
            { title: <>פולס שער</>, body: <>מזריק <Tex>{'I_G'}</Tex> לבסיס <Tex>{'Q_1'}</Tex></> },
            { title: <><Tex>{'Q_1'}</Tex> מוליך</>, body: <>הקולט שלו מושך זרם מבסיס <Tex>{'Q_2'}</Tex></> },
            { title: <><Tex>{'Q_2'}</Tex> מוליך</>, body: <>הקולט שלו מזין בחזרה את בסיס <Tex>{'Q_1'}</Tex></> },
          ]}
          outcome={{ label: 'משוב חיובי → נעילה', sub: <>הזרם מתפרץ וההתקן ננעל ON</> }}
        />
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          תוספת הזרם <Tex>{'\\Delta I_B'}</Tex> מכל מחזור גדולה מהקודמת — לולאה מתבדרת. <b>מתי בדיוק זה קורה?</b>
          זה תלוי בהגברים — ראו את תנאי ההצתה.
        </p>
      </Panel>
    </div>
  )
}
