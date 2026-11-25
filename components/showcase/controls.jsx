// Small shared controls used inside the Visual Lab demos.
export function Panel({ children, className = '', ...rest }) {
  return (
    <div className={`glass rounded-2xl p-3 backdrop-blur-xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Label({ children }) {
  return (
    <span className="mb-1.5 block font-mono text-xs uppercase tracking-[0.25em] text-muted">
      {children}
    </span>
  );
}

export function ChipGroup({ label, options, value, onChange, disabled = false }) {
  return (
    <div>
      {label ? <Label>{label}</Label> : null}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            disabled={disabled}
            aria-pressed={value === o.value}
            className={`min-h-[40px] rounded-full border px-3 py-1.5 disabled:cursor-default disabled:opacity-50 font-mono text-sm transition-colors ${
              value === o.value
                ? 'border-lime bg-lime text-ink-950'
                : 'border-white/10 bg-white/5 text-muted hover:border-white/30 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Swatches({ label, colors, value, onChange, disabled = false }) {
  return (
    <div>
      {label ? <Label>{label}</Label> : null}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            disabled={disabled}
            aria-pressed={value === c}
            onClick={() => onChange(c)}
            className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
              value === c ? 'scale-110 border-white' : 'border-white/15'
            }`}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
}

export function RangeField({ label, min, max, step = 1, value, onChange, format, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted">
        <span>{label}</span>
        <span className="text-white">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 w-full cursor-pointer accent-lime disabled:opacity-50"
      />
    </label>
  );
}

export function ActionButton({ children, onClick, className = '', ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[40px] rounded-full border border-white/15 disabled:cursor-default disabled:opacity-50 bg-white/5 px-4 py-2 font-mono text-sm text-white transition-colors hover:border-lime/60 hover:text-lime ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
