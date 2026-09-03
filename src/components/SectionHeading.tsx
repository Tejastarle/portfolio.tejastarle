import Reveal from "./Reveal";

type Props = {
  index: string;
  title: string;
  note?: string;
};

/**
 * The index is a real commit-style ref, not decorative numbering —
 * it maps to the node positions on the spine.
 */
export default function SectionHeading({ index, title, note }: Props) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-baseline gap-4">
        <span className="mono text-xs text-gold">{index}</span>
        <div className="h-px flex-1 bg-line" />
      </div>
      <h2 className="display mt-4 text-[clamp(2rem,5.5vw,4rem)] text-paper">
        {title}
      </h2>
      {note && <p className="mt-3 max-w-lg text-sm text-dim">{note}</p>}
    </Reveal>
  );
}
