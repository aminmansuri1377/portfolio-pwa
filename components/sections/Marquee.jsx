import { useTranslations } from 'next-intl';

export default function Marquee() {
  const t = useTranslations('Marquee');
  const items = t.raw('items');
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/5 bg-ink-900/70 py-5">
      <div className="marquee-track flex items-center gap-12 max-md:[animation-duration:22s]">
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex items-center gap-12">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="flex items-center gap-12 whitespace-nowrap font-display text-lg text-muted">
                {item}
                <span className="text-lime">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
