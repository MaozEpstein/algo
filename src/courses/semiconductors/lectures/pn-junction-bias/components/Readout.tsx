import RichText from '@/core/components/RichText'

/** A small labeled numeric readout chip (label may contain $…$ math). Shared by
 *  the forward/reverse/sandbox tabs of this lecture. */
export default function Readout({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${accent}`}>
      <span className="block text-xs text-slate-500">
        <RichText>{label}</RichText>
      </span>
      <span className="block font-mono text-base font-bold text-slate-800">{value}</span>
    </div>
  )
}
