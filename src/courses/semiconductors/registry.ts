import type { LectureModule } from '@/core/engine/types'
import { pnJunctionEqLecture } from '@/courses/semiconductors/lectures/pn-junction-equilibrium'
import { pnJunctionBiasLecture } from '@/courses/semiconductors/lectures/pn-junction-bias'
import { idealDiodeLecture } from '@/courses/semiconductors/lectures/ideal-diode'
import { nonIdealDiodeLecture } from '@/courses/semiconductors/lectures/non-ideal-diode'
import { schottkyDiodeLecture } from '@/courses/semiconductors/lectures/schottky-diode'
import { ohmicContactLecture } from '@/courses/semiconductors/lectures/ohmic-contact'
import { bjtStructureLecture } from '@/courses/semiconductors/lectures/bjt-structure'
import { bjtCurrentsGainLecture } from '@/courses/semiconductors/lectures/bjt-currents-gain'
import { bjtNonidealLecture } from '@/courses/semiconductors/lectures/bjt-nonideal'
import { scrLecture } from '@/courses/semiconductors/lectures/scr'
import { jfetLecture } from '@/courses/semiconductors/lectures/jfet'

/** The single wiring point for the semiconductors course. Adding a lecture =
 *  import it and add it here. */
export const LECTURES: Record<string, LectureModule> = {
  [pnJunctionEqLecture.id]: pnJunctionEqLecture,
  [pnJunctionBiasLecture.id]: pnJunctionBiasLecture,
  [idealDiodeLecture.id]: idealDiodeLecture,
  [nonIdealDiodeLecture.id]: nonIdealDiodeLecture,
  [schottkyDiodeLecture.id]: schottkyDiodeLecture,
  [ohmicContactLecture.id]: ohmicContactLecture,
  [bjtStructureLecture.id]: bjtStructureLecture,
  [bjtCurrentsGainLecture.id]: bjtCurrentsGainLecture,
  [bjtNonidealLecture.id]: bjtNonidealLecture,
  [scrLecture.id]: scrLecture,
  [jfetLecture.id]: jfetLecture,
}

export const LECTURE_LIST: LectureModule[] = Object.values(LECTURES).sort(
  (a, b) => a.number - b.number,
)
