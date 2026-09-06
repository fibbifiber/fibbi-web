import { useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useReveals } from '../lib/useReveals';
import AddButton from '../components/AddButton';
import Icon from '../components/Icon';
import { CATALOG, LINES, skusInLine } from '../data/catalog';

export function Sku({ id }) {
  const p = CATALOG[id];
  return (
    <div className="sku">
      <span className={`tape ${p.tape || ''}`} aria-hidden="true"></span>
      {p.badge && <span className="badge" style={p.badgeTone ? { background: p.badgeTone } : undefined}>{p.badge}</span>}
      <Link className="sku-visual" to={`/shop/${id}`} aria-label={p.title}>
        <img src={p.img} alt={p.title} loading="lazy" decoding="async" />
      </Link>
      <div className="sku-body">
        <h4>
          <Link className="sku-link" to={`/shop/${id}`}>{p.title}</Link>
          {p.titleNote && <span className="mono" style={{ fontSize: 10, color: 'var(--ink-60)' }}> · {p.titleNote}</span>}
        </h4>
        <p className="s-desc">{p.desc}</p>
        <div className="s-specs">{p.specs.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="s-buy">
          <span className="s-price">
            {p.mrp && <span className="mrp">₹{p.mrp}</span>}₹{p.price}
            <span className="per">{p.per}</span>
          </span>
          <AddButton id={id}>Add to Cart</AddButton>
        </div>
      </div>
    </div>
  );
}

export function SkuGrid({ line }) {
  return (
    <div className="sku-grid">
      {skusInLine(line).map((id) => <Sku key={id} id={id} />)}
    </div>
  );
}

export default function Shop() {
  const ref = useRef(null);
  useReveals(ref);
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <div className="page active" ref={ref}>
      <section>
        <div className="wrap">
          <span className="kicker lime">shop <Icon name="cart" size="1em" /></span>
          <h1 className="sec-title">The drop.</h1>
          <p className="lead">Launch pricing for India. Every serve carries 5g of psyllium and a label you can read out loud.</p>
          <p className="dispatch-line" style={{ marginTop: 10 }}>
            <Icon name="check" size="1em" /> dispatch in 24–48h · <Icon name="truck" size="1em" /> free shipping above ₹499 · <Icon name="money" size="1em" /> COD available (+₹49)
          </p>

          <div className="shop-line" id="crunch">
            <div className="line-head">
              <h3><Icon name="star" size="1em" /> {LINES.crunch.title}</h3>
              <span className="lh-note">{LINES.crunch.note}</span>
            </div>
            <SkuGrid line="crunch" />
            <div className="og-note" style={{ borderColor: 'var(--lime-deep)', background: 'rgba(143,182,35,.07)' }}>
              <b style={{ color: 'var(--lime-deep)' }}>Why crunch first:</b> it eats like a snack, ships anywhere in India without a
              cold chain, and 35g on your dahi quietly closes a third of the daily fiber gap. This is the pouch that ends the isabgol joke.
            </div>
          </div>

          <div className="shop-line" id="og">
            <div className="line-head">
              <h3>{LINES.og.title}</h3>
              <span className="lh-note">{LINES.og.note}</span>
            </div>
            <SkuGrid line="og" />
            <div className="og-note">
              <b>Why og costs what it costs:</b> pharma-grade 99% pure psyllium (not tea-cut husk), micro-milled for clean mixing,
              blended with prebiotic acacia so the same scoop also feeds your gut bacteria. Sat-Isabgol it is not — and it doesn't
              drink like it either.
            </div>
          </div>

          <div className="shop-line" id="cups">
            <div className="line-head">
              <h3>{LINES.cups.title}</h3>
              <span className="lh-note">{LINES.cups.note}</span>
            </div>
            <SkuGrid line="cups" />
          </div>
        </div>
      </section>
    </div>
  );
}
