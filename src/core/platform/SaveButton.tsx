import { useFeature } from './features'
import { useSavedItems, makeId, type SavedKind } from './savedItems'

/**
 * A small ＋ / ✓ toggle that adds an item to "my learning list". Subtle and non-intrusive (faint until
 * hover). Renders nothing when the savedList feature is off. Used on glossary/formula/symbol/search items.
 */
export default function SaveButton(props: {
  courseId: string
  lectureId: string
  kind: SavedKind
  refId: string
  label: string
  tex?: string
  note?: string
  tab?: string
  className?: string
}) {
  const on = useFeature('savedList')
  const saved = useSavedItems()
  if (!on) return null
  const id = makeId(props.courseId, props.lectureId, props.kind, props.refId)
  const isSaved = saved.isSaved(id)
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        saved.toggle({ id, courseId: props.courseId, lectureId: props.lectureId, kind: props.kind, refId: props.refId, label: props.label, tex: props.tex, note: props.note, tab: props.tab, addedAt: Date.now() })
      }}
      title={isSaved ? 'נשמר ללמידה — לחצו להסרה' : 'הוסף ללמידה'}
      aria-label={isSaved ? 'הסר מרשימת הלמידה' : 'הוסף ללמידה'}
      aria-pressed={isSaved}
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-sm font-bold transition ${isSaved ? 'bg-amber-400 text-white shadow-sm' : 'text-slate-300 hover:bg-amber-50 hover:text-amber-500'} ${props.className ?? ''}`}
    >
      {isSaved ? '✓' : '＋'}
    </button>
  )
}
