export const StakeSplitChart = () => {
  // The fixed split: [setting, regular contract, target option, higher-strike option], linear between knots.
  const SPLIT = [
    [1, 1, 0, 0],
    [2, 0.6, 0.4, 0],
    [3, 0.2, 0.8, 0],
    [3.5, 0.15, 0.8, 0.05],
    [4, 0.15, 0.75, 0.1],
    [5, 0.15, 0.6, 0.25],
    [6, 0.15, 0.45, 0.4],
    [7, 0.15, 0.3, 0.55],
    [8, 0.1, 0.2, 0.7],
    [9, 0.05, 0.1, 0.85],
    [10, 0, 0, 1],
  ];
  const PARTS = [
    { cls: "ssc-regular", label: "Regular contract", ink: "#ffffff" },
    { cls: "ssc-target", label: "Target option", ink: "#0b0b0b" },
    { cls: "ssc-higher", label: "Higher-strike option", ink: "#0b0b0b" },
  ];
  const W = 720;
  const H = 336;
  const L = 48;
  const R = 704;
  const T = 12;
  const B = 288;
  const x = (m) => L + ((m - 1) / 9) * (R - L);
  const y = (s) => B - s * (B - T);
  const pct = (v) => `${Math.round(v * 100)}%`;
  const splitAt = (m) => {
    const v = Math.min(10, Math.max(1, m));
    const i = Math.max(1, SPLIT.findIndex((r) => r[0] >= v - 1e-9));
    const a = SPLIT[i - 1];
    const b = SPLIT[i];
    const f = (v - a[0]) / (b[0] - a[0]);
    return [1, 2, 3].map((j) => a[j] + (b[j] - a[j]) * f);
  };

  const [setting, setSetting] = useState(null);

  const bands = [];
  let base = SPLIT.map(() => 0);
  for (let i = 0; i < 3; i++) {
    const top = SPLIT.map((r, j) => base[j] + r[i + 1]);
    const upper = SPLIT.map((r, j) => `${x(r[0]).toFixed(1)},${y(top[j]).toFixed(1)}`);
    const lower = SPLIT.map((r, j) => `${x(r[0]).toFixed(1)},${y(base[j]).toFixed(1)}`).reverse();
    bands.push({ points: upper.concat(lower).join(" "), edge: upper.join(" ") });
    base = top;
  }

  const clamp = (m) => Math.round(Math.min(10, Math.max(1, m)) * 10) / 10;
  const fromPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const m = 1 + ((px - L) / (R - L)) * 9;
    if (m < 0.7 || m > 10.3) return;
    setSetting(clamp(m));
  };
  const onKey = (e) => {
    const step = { ArrowRight: 0.5, ArrowUp: 0.5, ArrowLeft: -0.5, ArrowDown: -0.5 }[e.key];
    if (step == null && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    setSetting((prev) => {
      if (e.key === "Home") return 1;
      if (e.key === "End") return 10;
      return clamp((prev == null ? 1 : prev) + step);
    });
  };

  const shares = setting == null ? null : splitAt(setting);

  const css = `
.ssc-root { --ssc-surface: #ffffff; --ssc-grid: #e1e0d9; --ssc-axis: #c3c2b7; --ssc-muted: #898781;
  --ssc-ink: #0b0b0b; --ssc-ink-2: #52514e; --ssc-regular: #2a78d6; --ssc-target: #eb6834; --ssc-higher: #1baf7a;
  margin: 1.5rem 0; display: grid; gap: 10px; }
.dark .ssc-root { --ssc-surface: #0b0b11; --ssc-grid: #2c2c2a; --ssc-axis: #383835; --ssc-muted: #898781;
  --ssc-ink: #f0efec; --ssc-ink-2: #c3c2b7; --ssc-regular: #3987e5; --ssc-target: #d95926; --ssc-higher: #199e70; }
.ssc-legend { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 14px; color: var(--ssc-ink-2); }
.ssc-legend span { display: inline-flex; align-items: center; gap: 8px; }
.ssc-swatch { width: 12px; height: 12px; border-radius: 3px; display: inline-block; flex: none; }
.ssc-regular { fill: var(--ssc-regular); background: var(--ssc-regular); }
.ssc-target { fill: var(--ssc-target); background: var(--ssc-target); }
.ssc-higher { fill: var(--ssc-higher); background: var(--ssc-higher); }
.ssc-svg { width: 100%; height: auto; display: block; touch-action: pan-y; cursor: crosshair; outline: none; }
.ssc-svg:focus-visible { outline: 2px solid var(--ssc-regular); outline-offset: 4px; border-radius: 4px; }
.ssc-tick { fill: var(--ssc-muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.ssc-band-label { font-size: 13px; font-weight: 600; pointer-events: none; }
.ssc-readout { min-height: 1.6em; font-size: 14px; color: var(--ssc-ink-2); display: flex; flex-wrap: wrap; gap: 4px 16px; align-items: center; font-variant-numeric: tabular-nums; }
.ssc-readout strong { color: var(--ssc-ink); font-weight: 600; }
.ssc-key { display: inline-block; width: 14px; height: 2px; border-radius: 1px; vertical-align: middle; margin-right: 6px; }
.ssc-key.ssc-regular { background: var(--ssc-regular); }
.ssc-key.ssc-target { background: var(--ssc-target); }
.ssc-key.ssc-higher { background: var(--ssc-higher); }
`;

  return (
    <figure className="ssc-root">
      <style>{css}</style>
      <div className="ssc-legend" aria-hidden="true">
        {PARTS.map((p) => (
          <span key={p.cls}>
            <span className={"ssc-swatch " + p.cls} aria-hidden="true" />
            {p.label}
          </span>
        ))}
      </div>
      <svg
        className="ssc-svg"
        viewBox={"0 0 " + W + " " + H}
        role="img"
        tabIndex={0}
        aria-label="Stacked area chart of how a multiplier order's stake is split between the regular contract, the target option, and the higher-strike option, from 1x to 10x. Use the arrow keys to read a setting. The table below lists every value."
        onPointerMove={fromPointer}
        onPointerDown={fromPointer}
        onPointerLeave={(e) => {
          if (e.pointerType !== "touch") setSetting(null);
        }}
        onKeyDown={onKey}
        onBlur={() => setSetting(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((s) => (
          <g key={s}>
            <line x1={L} x2={R} y1={y(s)} y2={y(s)} stroke={s === 0 ? "var(--ssc-axis)" : "var(--ssc-grid)"} strokeWidth={1} />
            <text className="ssc-tick" x={L - 8} y={y(s) + 4} textAnchor="end">
              {`${s * 100}%`}
            </text>
          </g>
        ))}
        {bands.map((b, i) => (
          <polygon key={PARTS[i].cls} className={PARTS[i].cls} points={b.points} />
        ))}
        {bands.slice(0, 2).map((b, i) => (
          <polyline key={`edge-${i}`} points={b.edge} fill="none" stroke="var(--ssc-surface)" strokeWidth={2} strokeLinejoin="round" />
        ))}
        <text className="ssc-band-label" x={L + 10} y={y(0.12)} fill={PARTS[0].ink}>
          Regular contract
        </text>
        <text className="ssc-band-label" x={x(3.2)} y={y(0.6)} textAnchor="middle" fill={PARTS[1].ink}>
          Target option
        </text>
        <text className="ssc-band-label" x={x(8.6)} y={y(0.62)} textAnchor="middle" fill={PARTS[2].ink}>
          Higher-strike option
        </text>
        {Array.from({ length: 10 }, (_, k) => k + 1).map((m) => (
          <text key={m} className="ssc-tick" x={x(m)} y={B + 20} textAnchor="middle">
            {`${m}×`}
          </text>
        ))}
        <text className="ssc-tick" x={(L + R) / 2} y={B + 42} textAnchor="middle">
          Multiplier setting
        </text>
        {setting != null && (
          <line x1={x(setting)} x2={x(setting)} y1={T} y2={B} stroke="var(--ssc-ink)" strokeWidth={1.5} opacity={0.7} />
        )}
      </svg>
      <div className="ssc-readout" aria-live="polite">
        {shares == null ? (
          <span>Hover, tap, or use the arrow keys to read the split at any setting.</span>
        ) : (
          <>
            <span>
              <strong>{`${setting.toFixed(1)}×`}</strong>
            </span>
            {PARTS.map((p, i) => (
              <span key={p.cls}>
                <span className={"ssc-key " + p.cls} aria-hidden="true" />
                <strong>{pct(shares[i])}</strong> {p.label.toLowerCase()}
              </span>
            ))}
          </>
        )}
      </div>
    </figure>
  );
};
