/** ▶ play / ⏸ pause control for a sandbox auto-sweep (media-control styling). */
export default function PlayButton({ playing, onClick, label = 'הרצה' }: { playing: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={playing}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition ${
        playing ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
      }`}
    >
      <span aria-hidden>{playing ? '⏸' : '▶'}</span>
      {playing ? 'השהה' : label}
    </button>
  )
}
