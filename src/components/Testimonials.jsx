import Icon from './Icon';
import FssaiBadge from './FssaiBadge';

/**
 * Pre-launch proof section.
 *
 * This deliberately does NOT show customer reviews. fibbi hasn't shipped, so any
 * review here would be invented — and fabricated testimonials are both a trust
 * killer and a misleading-advertising risk under India's consumer protection
 * rules. Until there are real verified buyers, we show only claims that can be
 * checked: the FSSAI licence, the ingredient deck, and who legally makes it.
 *
 * When real reviews exist, swap this back to a review carousel sourced from
 * verified orders (REVIEWS in data/catalog.js is kept for that future use).
 */

const PROOF = [
  {
    icon: 'check',
    title: 'A registered food business',
    body: 'Licensed, not a hobby kitchen — our FSSAI licence number is on every pack and shown below.',
  },
  {
    icon: 'leaf',
    title: 'Six ingredients',
    body: 'The whole deck fits on one line. No added sugar, no preservatives, nothing you need to look up.',
  },
  {
    icon: 'star',
    title: '5g fiber per serve',
    body: 'Pharma-grade 99% pure psyllium plus prebiotic acacia — a real dose, printed on the pack, not a token sprinkle.',
  },
  {
    icon: 'box',
    title: 'Small-batch, made in Pune',
    body: 'Baked in short runs so nothing sits in a warehouse. Every pack carries its batch code and packing date.',
  },
];

export default function Testimonials() {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="kicker lime reveal">
          receipts, not reviews <Icon name="clipboard" />
        </span>
        <h2 className="sec-title reveal">No reviews yet. Here's what you can check instead.</h2>
        <p className="lead reveal">
          fibbi hasn't shipped, so there are no customer ratings — and we're not going to invent any.
          What we can show you is everything that's verifiable today.
        </p>

        <div className="policy-grid">
          {PROOF.map((p, i) => (
            <div className="policy-card reveal" data-delay={i % 2} key={p.title}>
              <h4>
                <Icon name={p.icon} size="1em" /> {p.title}
              </h4>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>{p.body}</p>
            </div>
          ))}
        </div>

        {/* The single FSSAI display on the site — homepage only, with the official mark. */}
        <div className="reveal" style={{ marginTop: 18 }}>
          <FssaiBadge />
        </div>

        <p className="mono reveal" style={{ marginTop: 12, fontSize: 11.5, color: 'var(--ink-60)' }}>
          psyllium is a food, not a medicine
        </p>
      </div>
    </section>
  );
}
