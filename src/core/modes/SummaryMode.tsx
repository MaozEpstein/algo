import type { LectureModule } from '@/core/engine/types'

export default function SummaryMode({ lecture }: { lecture: LectureModule }) {
  const Summary = lecture.summary
  return <Summary />
}
