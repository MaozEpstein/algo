/**
 * A small, muted "beyond the syllabus" badge. Marks quantitative content that goes
 * past the course formula sheet (e.g. the Sze-level tunnelling math: E₀₀, the
 * TE/TFE/FE regimes, the specific contact resistance ρ_c) so exam-prep readers know
 * the course core is the qualitative idea, and this depth is enrichment.
 */
export default function EnrichmentBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ${className}`}
      title="תוכן העשרה — מעבר לדף-הנוסחאות של הקורס (מבוסס Sze)"
    >
      <span aria-hidden>📎</span> מעבר לסילבוס · העשרה
    </span>
  )
}
