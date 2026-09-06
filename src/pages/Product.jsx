import { useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useReveals } from '../lib/useReveals';
import AddButton from '../components/AddButton';
import Icon from '../components/Icon';
import { CATALOG, LINES, skusInLine, FREE_SHIP } from '../data/catalog';
import { Sku } from './Shop';

export default function Product() {
  const { sku } = useParams();
  const ref = useRef(null);
  useReveals(ref);

  const p = CATALOG[sku];
  if (!p) return <Navigate to="/shop" replace />;

  const line = LINES[p.line];
  const also = skusInLine(p.line).filter((id) => id !== sku);
  const off = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

  return (
    <div className="page active" ref={ref}>
      <section>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/shop">Shop</Link> <span aria-hidden="true">/</span>{' '}
            <Link to={`/shop#${line.id}`}>{p.line}</Link> <span aria-hidden="true">/</span>{' '}
            <span aria-current="page">{p.title}</span>
          </nav>

          <div className="pdp">
            <div className="pdp-visual">
              <span className={`tape ${p.tape || ''}`} aria-hidden="true"></span>
              {p.badge && <span className="badge" style={p.badgeTone ? { background: p.badgeTone } : undefined}>{p.badge}</span>}
              <img src={p.img} alt={p.title} width="800" height="1000" decoding="async" />
            </div>

            <div className="pdp-info">
              <span className="kicker lime">{line.title}</span>
              <h1 className="sec-title">
                {p.title}
                {p.titleNote && <span className="mono pdp-note"> · {p.titleNote}</span>}
              </h1>
              <p className="lead">{p.long}</p>

              <div className="s-specs">{p.specs.map((s) => <span key={s}>{s}</span>)}</div>

              <div className="pdp-buy">
                <span className="s-price pdp-price">
                  {p.mrp && <span className="mrp">₹{p.mrp}</span>}₹{p.price}
                  {off > 0 && <span className="pdp-off">{off}% off</span>}
                  <span className="per">{p.per}</span>
                </span>
                <AddButton id={sku} className="add-btn pdp-add">Add to Cart</AddButton>
              </div>

              <p className="dispatch-line">
                <Icon name="check" size="1em" /> dispatch in 24–48h · <Icon name="truck" size="1em" /> free shipping above ₹{FREE_SHIP} · <Icon name="money" size="1em" /> COD available (+₹49)
              </p>

              <ul className="pdp-facts">
                {p.facts.map((f) => <li key={f}><Icon name="check" size="1em" /> {f}</li>)}
              </ul>

              <div className="pdp-nutri">
                <div className="pn-head">
                  <h4>Nutrition</h4>
                  <span>{line.nutrition.serve}</span>
                </div>
                <dl className="pn-rows">
                  {line.nutrition.rows.map(([k, v]) => (
                    <div key={k} className={`pn-row${k.startsWith('of which') ? ' sub' : ''}${k.includes('fiber') ? ' hi' : ''}`}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pn-foot">typical values · batch 001 · no added sugar, no colours, no preservatives</p>
              </div>

              <p className="pdp-line-note">{line.note}</p>
            </div>
          </div>

          {also.length > 0 && (
            <div className="shop-line">
              <div className="line-head">
                <h3>More from {line.title}</h3>
                <Link className="lh-note" to={`/shop#${line.id}`}>See the full drop →</Link>
              </div>
              <div className="sku-grid">
                {also.map((id) => <Sku key={id} id={id} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
