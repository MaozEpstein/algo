import Panel from '../../../components/Panel'
import CurrentComponents from '../components/CurrentComponents'

/** Lecture 3ב — the current components and the operational definitions of γ and b. */
export default function ComponentsTab() {
  return (
    <div className="flex flex-col gap-5">
      <Panel title="רכיבי-הזרם בפעיל-קדמי">
        <p className="leading-relaxed text-slate-700">
          זרם-הפולט אינו "חתיכה אחת": הוא מתפצל לרכיבים. הקישו על כל רכיב כדי לראות את תפקידו ולמה הוא חשוב להגבר:
        </p>
        <div className="mt-3">
          <CurrentComponents />
        </div>
      </Panel>
    </div>
  )
}
