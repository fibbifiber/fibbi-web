import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CATALOG } from '../data/catalog';
import { saveLead, trackEvent } from '../lib/supabase';
import Icon from './Icon';

export default function CartDrawer() {
  const { items, count, subtotal, open, panel, inc, dec, closeCart, checkout, backToCart } = useCart();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  // last 10 digits, so +91 / 0 prefixes and spaces all work
  const mobile = phone.replace(/\D/g, '').slice(-10);
  const emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
  const phoneOk = /^[6-9]\d{9}$/.test(mobile);
  // Both are required: email carries the order/launch mail, mobile is how we
  // reach reservations on WhatsApp. Only complain about a field once it's been
  // typed into, so the form doesn't shout at someone mid-entry.
  const error = email.trim() && !emailOk
    ? 'that email address looks incomplete'
    : phone.trim() && !phoneOk
      ? 'indian mobiles are 10 digits starting 6–9'
      : '';
  const canSubmit = emailOk && phoneOk && !error;

  const submitRestock = async () => {
    if (!canSubmit) return;
    setBusy(true);
    // source stays 'restock' so schema.sql + the README funnel queries keep working;
    // the user-facing copy calls it the launch list.
    // ponytail: leads.email is NOT NULL, so a phone-only lead is keyed by its number.
    const res = await saveLead(email.trim(), 'restock', {
      email: email.trim(),
      phone: `+91${mobile}`,
      subtotal,
      items: items.map((i) => ({ sku: i.id, qty: i.qty })),
    });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      trackEvent('lead_saved', { source: 'restock' });
    }
    return res.ok;
  };



  return (
    <>
      <div className={`cart-backdrop${open ? ' open' : ''}`} onClick={closeCart} />
      <aside className={`cart-drawer${open ? ' open' : ''}`} aria-label="Cart">
        <div className="cd-head">
          <h3>Your Cart <Icon name="cart" /></h3>
          <button className="cd-close" onClick={closeCart}><Icon name="close" size="1em" /></button>
        </div>

        {panel === 'cart' && (
          <>
            <div className="cd-items">
              {count === 0 ? (
                <p className="cd-empty">nothing here yet — your gut is waiting <Icon name="eyes" /></p>
              ) : (
                items.map((i) => {
                  const p = CATALOG[i.id];
                  if (!p) return null; // stale cart entry from a removed SKU
                  return (
                    <div className="ci" key={i.id}>
                      <img className="ci-swatch" src={p.img} alt={p.name} style={{ background: p.sw }} loading="lazy" decoding="async" />
                      <div className="ci-info">
                        <div className="ci-name">{p.name}</div>
                        <div className="ci-price">₹{p.price} each</div>
                      </div>
                      <div className="qty">
                        <button onClick={() => dec(i.id)}>−</button>
                        <span>{i.qty}</span>
                        <button onClick={() => inc(i.id)}>+</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {count > 0 && (
              <div className="cd-foot" style={{ display: 'block' }}>
                <div className="ship-progress">
                  <div className="sp-t"><Icon name="truck" size="1em" /> <b>free shipping</b> on every order · no minimum</div>
                  <div className="sp-bar"><div className="sp-fill" style={{ width: '100%' }} /></div>
                </div>
                <div className="cd-sub"><span>subtotal</span><span>₹{subtotal}</span></div>
                <button className="btn btn-dark cd-checkout" onClick={checkout}><Icon name="lock" size="1em" /> Check Availability →</button>
                <div className="pay-chips" style={{ justifyContent: 'center' }}>
                  <span className="upi">UPI</span><span>Cards</span><span>NetBanking</span><span>COD</span>
                </div>
                <div className="cd-meta"><span><Icon name="receipt" size="1em" /> invoice with every order</span><span><Icon name="lock" size="1em" /> encrypted checkout</span></div>
              </div>
            )}
          </>
        )}

        {panel === 'checking' && (
          <div className="checking show">
            <div className="spinner" aria-hidden="true" />
            <p>checking batch 001 availability…</p>
          </div>
        )}

        {panel === 'oos' && (
          <div className="oos show">
            <span className="oos-emo"><Icon name="box" size={40} /></span>
            <span className="oos-tag">batch 002 · next run</span>
            <h4>Batch 001 is fully allocated.</h4>
            <p>
              {saved
                ? "you're on the list for batch 002 — it ships first, at founder pricing, before we open public stock."
                : "we bake in small batches and only ship what's been lab-checked. leave your email and mobile — batch 002 reaches you first, at founder pricing."}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
              no payment taken · your cart is saved · nothing was charged
            </p>
            {!saved ? (
              <>
                {/* Both fields required — email for the launch mail, mobile for
                    WhatsApp updates on the reservation. */}
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  aria-label="Email to reserve from batch 002"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canSubmit && submitRestock()}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={16}
                  placeholder="+91 98765 43210"
                  aria-label="Indian mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && canSubmit && submitRestock()}
                />
                {error && <p className="mono" role="alert" style={{ fontSize: 11.5, color: 'var(--berry)', marginTop: 2 }}>{error}</p>}
                <button className="btn btn-primary" onClick={submitRestock} disabled={busy || !canSubmit}>
                  {busy ? 'Saving…' : 'Reserve from Batch 002'}
                </button>
              </>
            ) : (
              <span className="oos-done" style={{ display: 'block' }}>you're on the list — we'll be quick <Icon name="check" size="1em" /></span>
            )}
            <button className="reset-btn" style={{ marginTop: 8 }} onClick={backToCart}>← Back to Cart</button>
          </div>
        )}
      </aside>
    </>
  );
}
