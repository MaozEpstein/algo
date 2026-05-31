import { useNavigate } from 'react-router-dom'
import type { LearningMode, LectureModule } from '@/engine/types'

interface ModeDef {
  id: LearningMode
  labelHe: string
  icon: string
}

const MODES: ModeDef[] = [
  { id: 'guided', labelHe: 'ויזואליזציה מודרכת', icon: '🎬' },
  { id: 'summary', labelHe: 'סיכום', icon: '📋' },
]

interface Props {
  lecture: LectureModule
  active: LearningMode
}

export default function ModeSelector({ lecture, active }: Props) {
  const navigate = useNavigate()
  return (
    <div className="no-print flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-card">
      {MODES.map((m) => {
        const isActive = m.id === active
        return (
          <button
            key={m.id}
            onClick={() => navigate(`/lecture/${lecture.id}/${m.id}`)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span aria-hidden>{m.icon}</span>
            {m.labelHe}
          </button>
        )
      })}
    </div>
  )
}
