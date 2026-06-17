import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useMatch, useNavigate } from 'react-router-dom'
import { OPEN_SETTINGS } from './types'
import { FEATURES, settingsStore, isFeatureEnabled, setFeature } from './features'
import { usePrefs, setPref, TEXT_SCALE_HE, DENSITY_HE, FONT_HE, HOME_VIEW_HE, CONTENT_WIDTH_HE, type TextScale, type Density, type FontPref, type HomeView, type ContentWidth } from './prefs'
import { printPath } from './links'

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onClick} className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-emerald-500' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'start-0.5' : 'start-[1.375rem]'}`} />
    </button>
  )
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 rounded-full bg-slate-100 p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)} className={`rounded-full px-3 py-1 text-sm font-semibold transition ${value === o.v ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Row({ title, desc, control }: { title: string; desc?: string; control: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
      <div className="min-w-0">
        <p className="font-bold text-slate-800">{title}</p>
        {desc && <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{desc}</p>}
      </div>
      {control}
    </li>
  )
}

/** Global Settings modal (mounted in App): display/accessibility prefs, feature toggles, course export. */
export default function SettingsModal() {
  const [open, setOpen] = useState(false)
  const overrides = settingsStore.useValue()
  const prefs = usePrefs()
  const navigate = useNavigate()
  const courseMatch = useMatch('/c/:courseId/*')
  const courseId = courseMatch?.params.courseId

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener(OPEN_SETTINGS, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(OPEN_SETTINGS, onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const Heading = ({ children }: { children: React.ReactNode }) => <h4 className="mb-2 mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{children}</h4>

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[6vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl" initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }} onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-l from-slate-50 to-white px-6 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><span aria-hidden>⚙️</span>הגדרות</h3>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="סגירה">✕</button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto p-5">
              <Heading>תצוגה ונגישות</Heading>
              <ul className="mb-4 flex flex-col gap-2.5">
                <Row title="גופן" control={<Segmented<FontPref> value={prefs.font} onChange={(v) => setPref('font', v)} options={(['default', 'assistant', 'rubik', 'serif'] as FontPref[]).map((v) => ({ v, label: FONT_HE[v] }))} />} />
                <Row title="גודל טקסט" control={<Segmented<TextScale> value={prefs.textScale} onChange={(v) => setPref('textScale', v)} options={(['sm', 'base', 'lg', 'xl'] as TextScale[]).map((v) => ({ v, label: TEXT_SCALE_HE[v] }))} />} />
                <Row title="צפיפות" control={<Segmented<Density> value={prefs.density} onChange={(v) => setPref('density', v)} options={(['comfortable', 'compact'] as Density[]).map((v) => ({ v, label: DENSITY_HE[v] }))} />} />
                <Row title="תצוגת שיעורים" desc="עמוד הבית של הקורס — כרטיסים או רשימה מתקפלת." control={<Segmented<HomeView> value={prefs.homeView} onChange={(v) => setPref('homeView', v)} options={(['cards', 'list'] as HomeView[]).map((v) => ({ v, label: HOME_VIEW_HE[v] }))} />} />
                <Row title="רוחב תוכן" desc="כמה מרוחב המסך התוכן ינצל." control={<Segmented<ContentWidth> value={prefs.contentWidth ?? 'wide'} onChange={(v) => setPref('contentWidth', v)} options={(['comfortable', 'wide', 'full'] as ContentWidth[]).map((v) => ({ v, label: CONTENT_WIDTH_HE[v] }))} />} />
                <Row title="הפחתת אנימציה" desc="ביטול מעברים ואנימציות בכל המערכת." control={<Toggle on={prefs.reduceMotion} label="הפחתת אנימציה" onClick={() => setPref('reduceMotion', !prefs.reduceMotion)} />} />
              </ul>

              <Heading>פיצ'רים</Heading>
              <ul className="mb-4 flex flex-col gap-2.5">
                {FEATURES.map((f) => {
                  const onF = isFeatureEnabled(overrides, f.id)
                  return <Row key={f.id} title={f.titleHe} desc={f.descHe} control={<Toggle on={onF} label={f.titleHe} onClick={() => setFeature(f.id, !onF)} />} />
                })}
              </ul>

              {courseId && (
                <>
                  <Heading>ייצוא</Heading>
                  <button
                    onClick={() => {
                      setOpen(false)
                      navigate(printPath(courseId))
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <span aria-hidden>⬇️</span> ייצא את כל הקורס ל-PDF (ספר קורס)
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
