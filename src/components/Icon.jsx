// Themed line-art icons — ink strokes matching the site's hand-drawn borders.
// Usage: <Icon name="cart" /> · sits inline on the text baseline.

const G = {
  check: <path d="M4 12l5 5L20 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  cart: (
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M2 4h2.2l2.3 12a1 1 0 0 0 1 .8h9.1a1 1 0 0 0 1-.8L19.5 8H6" />
    </>
  ),
  truck: (
    <>
      <path d="M2 6h12v10H2zM14 9h3.5L21 12.5V16h-7" />
      <circle cx="6.5" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  box: (
    <>
      <path d="M3 7l9-4 9 4-9 4-9-4z" />
      <path d="M3 7v10l9 4 9-4V7" />
      <path d="M12 11v10" />
    </>
  ),
  sparkle: <path d="M12 2c.9 5.6 3.4 8.1 9 9-5.6.9-8.1 3.4-9 9-.9-5.6-3.4-8.1-9-9 5.6-.9 8.1-3.4 9-9Z" />,
  star: { fill: 'var(--gold)', el: <path d="M12 3l2.6 5.5 6 .8-4.4 4.1 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.3l6-.8z" /> },
  bolt: { fill: 'var(--gold)', el: <path d="M13 2L4 14h6l-1 8 9-12h-6z" /> },
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.4" />
      <path d="M8.5 7l1.3-3h4.4L15.5 7" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C9 4 4 9 4 18c9 0 16-5 16-14Z" />
      <path d="M5 19C9 13 13 10 18 8" />
    </>
  ),
  bowl: (
    <>
      <path d="M3 11h18a9 9 0 0 1-18 0Z" />
      <path d="M8 8c1-1.5 7-1.5 8 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.4-4.4" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  cookie: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="14.5" cy="9" r="1" />
      <circle cx="15" cy="14.5" r="1" />
      <circle cx="9.5" cy="15" r="1" />
    </>
  ),
  spoon: (
    <>
      <ellipse cx="9" cy="7.5" rx="4" ry="5" />
      <path d="M9.5 12.5l3.5 8.5" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L6 21z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  party: (
    <>
      <path d="M4 20l5-13 7 7z" />
      <path d="M15 4c1.6 0 2 1.6 3.5 1.6M17 9c1.6 0 2 1.6 3.5 1.6" />
      <circle cx="19" cy="4" r=".6" />
    </>
  ),
  eyes: (
    <>
      <circle cx="8" cy="12" r="3.4" />
      <circle cx="16" cy="12" r="3.4" />
      <circle cx="8" cy="12.5" r=".9" />
      <circle cx="16" cy="12.5" r=".9" />
    </>
  ),
  gamepad: (
    <>
      <rect x="3" y="8" width="18" height="9" rx="4.5" />
      <path d="M7 11v3M5.5 12.5h3" />
      <circle cx="16" cy="11.5" r=".9" />
      <circle cx="18" cy="14" r=".9" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
      <path d="M8 11h8M8 15h5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M6.5 14.5h4" />
    </>
  ),
  headset: (
    <>
      <path d="M5 13a7 7 0 0 1 14 0" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19a3 3 0 0 1-3 3h-3" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.8" />
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3h4M10.5 3v5.5L5.5 18a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3l-5-9.5V3" />
      <path d="M8 15h8" />
    </>
  ),
  speech: <path d="M4 5h16v10H9l-4 4V5z" />,
  money: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  book: (
    <>
      <path d="M12 5C9 3 4.5 3 3 4v15c1.5-1 6-1 9 1 3-2 7.5-2 9-1V4c-1.5-1-6-1-9 1Z" />
      <path d="M12 6v14" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  return: (
    <>
      <path d="M9 7L4 12l5 5" />
      <path d="M4 12h11a5 5 0 0 1 0 10h-2.5" />
    </>
  ),
  play: { fill: 'var(--ink)', el: <path d="M8 5l11 7-11 7z" /> },
};

export default function Icon({ name, size = '1.05em', color, className, style }) {
  const g = G[name];
  if (!g) return null;
  const filled = g.fill;
  const el = filled ? g.el : g;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? (color || g.fill) : 'none'}
      stroke={filled ? 'none' : color || 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ verticalAlign: '-0.15em', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {el}
    </svg>
  );
}
