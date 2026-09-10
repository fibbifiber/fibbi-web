import { useState } from 'react';

/**
 * FSSAI licence mark.
 *
 * Compliance notes (FSSAI Labelling & Display FAQ, 2022):
 *  - The logo and licence number must be shown in a colour that contrasts with
 *    the background — black on white is the example the FAQ gives. That's why
 *    this badge forces its own light background instead of inheriting the
 *    site's cream/ink palette.
 *  - The label must read "FSSAI Lic. No." followed by the exact number issued.
 *  - The regulator is explicit that the logo and licence number must NOT be
 *    used to make promotional or quality claims. So this renders as a plain
 *    statement of registration — no "certified", "approved" or "safe" wording.
 *
 * Uses the official FSSAI artwork from /public when present. If the file is
 * missing or fails to load we fall back to a typographic lockup rather than
 * showing a broken image, so the legally required licence number is never lost.
 *
 * The official mark lives at `public/fssai.png` (transparent PNG, landscape).
 */

export const FSSAI_LICENCE = '10522999000050';
const DEFAULT_LOGO = '/fssai.png';

export default function FssaiBadge({
  licence = FSSAI_LICENCE,
  logoSrc = DEFAULT_LOGO,
  className = '',
  compact = false,
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = Boolean(logoSrc) && !logoFailed;

  return (
    <span
      className={`fssai-badge${compact ? ' fssai-compact' : ''} ${className}`.trim()}
      title={`FSSAI Licence No. ${licence}`}
    >
      {showLogo ? (
        <img
          className="fssai-logo"
          src={logoSrc}
          alt="FSSAI"
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="fssai-mark" aria-hidden="true">
          FSSAI
        </span>
      )}
      <span className="fssai-text">
        <b>FSSAI Lic. No.</b>
        <span className="fssai-num">{licence}</span>
      </span>
    </span>
  );
}
