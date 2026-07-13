import type { ComponentType } from 'react'
import type { LectureModule } from '@/core/engine/types'

/**
 * Lightweight, eagerly-loaded metadata for a course — drives the course picker
 * menu without pulling in the course's (heavy) lectures. Keep this free of any
 * React/lecture imports so it stays cheap.
 */
export interface CourseManifest {
  id: string
  titleHe: string
  subtitleEn: string
  /** Tailwind colour family for the course's accent (e.g. 'sky', 'violet'). */
  accent: string
}

/**
 * The full course payload, loaded lazily (one chunk per course). Resolved by the
 * CourseProvider and consumed by CourseHome / LectureShell / the overview page.
 */
export interface CourseModule {
  manifest: CourseManifest
  LECTURES: Record<string, LectureModule>
  LECTURE_LIST: LectureModule[]
  /** Optional cross-lecture overview page (e.g. the sorting comparison + race). */
  Overview?: ComponentType
  /** Optional course-wide reference (e.g. the formula sheet) — a self-contained
   *  modal mounted once per course (by CourseProvider) so it can be opened from
   *  anywhere via the keyboard shortcut or the OPEN_FORMULA_SHEET window event. */
  formulaSheet?: ComponentType
  /** Optional course roadmap (syllabus) — a self-contained button+modal shown on
   *  the course home next to the formula-sheet button. */
  syllabus?: ComponentType
  /** Optional live-calculator modal (separate from the formula sheet) — a self-contained
   *  modal mounted once per course (by CourseProvider), opened via the OPEN_CALCULATOR event. */
  calculator?: ComponentType
  /** Optional constants-table modal — opened via the OPEN_CONSTANTS event. */
  constants?: ComponentType
  /** Optional bank of past-exam source PDFs — a designed gallery + full-screen
   *  viewer at /c/<course>/exams. The PDFs live in public/docs/exams/<courseId>/.
   *  `revision` docs (lecturer's practice questions) appear as a section on the
   *  same exam-bank page. */
  exams?: ExamEntry[]
  /** Optional lecturer revision/practice-question PDFs, shown as a section inside
   *  the exam bank. The PDFs live in public/docs/revision/<courseId>/. */
  revision?: RevisionDoc[]
  /** Optional taxonomy of exam questions by recurring style/template — surfaced as
   *  a "טבלה לפי קטגוריה" modal on the exam bank. */
  examCategories?: ExamCategory[]
  /** Optional "hot formulas & insights" study guide — a second tab in that modal. */
  examStudyGuide?: ExamStudyGuide
}

/** The most-used formulas + understanding-theorems across the exam solutions. */
export interface ExamStudyGuide {
  /** Ranked most-used → least. `tex` is a KaTeX block; `detailHe` may embed $…$. */
  formulas: { titleHe: string; tex: string; detailHe: string; usageHe: string }[]
  insights: { titleHe: string; detailHe: string; usageHe: string }[]
  /** The universal 3-beat solution flow, shown as an intro banner. */
  masterBeats: { titleHe: string; textHe: string }[]
  /** Per-template step-by-step solution recipes. */
  recipes: SolutionRecipe[]
}

/** One recurring solution procedure (per question-template). */
export interface SolutionRecipe {
  templateId: string
  titleHe: string
  countHe: string
  steps: RecipeStep[]
}

/** One step in a recipe. `kind` colours/labels it; `textHe` may embed $…$; `tex` is an optional KaTeX block. */
export interface RecipeStep {
  kind: 'model' | 'formula' | 'substitute' | 'theorem' | 'result'
  textHe: string
  tex?: string
}

/** One recurring exam-question template (style), with the questions that match it. */
export interface ExamCategory {
  /** Short code, e.g. 'T3'. */
  id: string
  titleHe: string
  /** One line: what characterizes the pattern. */
  markerHe: string
  /** The matching questions across the exam bank. `examId` matches an ExamEntry id. */
  instances: { examId: string; q: string }[]
}

/**
 * One past exam in a course's exam bank. The PDFs are static assets under
 * `public/docs/exams/<courseId>/` (ASCII slugs), rendered in the browser's native
 * viewer by ExamViewer. `moed`: a/b/c = מועד א׳/ב׳/ג׳, s = מועד מיוחד.
 */
export interface ExamEntry {
  /** URL slug + stable key, e.g. '2022-moed-c'. */
  id: string
  year: number
  moed: 'a' | 'b' | 'c' | 's'
  titleHe: string
  /** Exam PDF file name inside public/docs/exams/<courseId>/. */
  examFile: string
  /** Optional solution PDF file name (same folder). */
  solutionFile?: string
}

/**
 * A lecturer revision / practice-question document (שאלות חזרה). Converted to PDF
 * from the source (e.g. Word) and served from `public/docs/revision/<courseId>/`.
 * Shown as a section inside the exam bank.
 */
export interface RevisionDoc {
  /** URL slug + stable key, e.g. 'revision-1'. */
  id: string
  titleHe: string
  /** Question PDF file name inside public/docs/revision/<courseId>/. */
  file: string
  /** Optional solution PDF file name (same folder). */
  solutionFile?: string
}

/**
 * Window event that opens the course formula-sheet modal. The (course-provided)
 * formulaSheet component listens for it; CourseHome's button dispatches it. Using
 * an event keeps CourseHome (core) decoupled from the course-specific modal while
 * still letting both the button and the global keyboard shortcut open the same one.
 */
export const OPEN_FORMULA_SHEET = 'app:open-formula-sheet'

/** Window event: open the course-wide quick-search modal (Ctrl+Shift+F or the header button). */
export const OPEN_COURSE_SEARCH = 'app:open-course-search'

/** Window event: open the global Settings modal (the ⚙️ button on the picker / course-home). */
export const OPEN_SETTINGS = 'app:open-settings'

/** Window event: open the course's live-calculator modal (the 🧮 button on the course-home). */
export const OPEN_CALCULATOR = 'app:open-calculator'

/** Window event: open the course's constants-table modal (the 📌 button on the course-home). */
export const OPEN_CONSTANTS = 'app:open-constants'
