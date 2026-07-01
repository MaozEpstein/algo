import { Link } from 'react-router-dom'
import { lecturePath } from '@/core/platform/links'

/** A small "jump to the source lecture+tab" chip used across the synthesis tabs. */
export default function DeepLinkChip({ lectureId, tab, children }: { lectureId: string; tab?: string; children: React.ReactNode }) {
  return (
    <Link
      to={lecturePath('semiconductors', lectureId, tab ? { tab } : undefined)}
      className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
    >
      ↗ {children}
    </Link>
  )
}
