import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CATALOG, FREE_SHIP } from '../data/catalog';
import { saveLead, trackEvent } from '../lib/supabase';
import Icon from './Icon';

export default function CartDrawer() {
  const { items, count, subtotal, open, panel, inc, dec, closeCart, checkout, runStockCheck, backToCart } = useCart();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  // last 10 digits, so +91 / 0 prefixes and spaces all work
  const mobile = phone.replace(/\D/g, '').slice(-10);
  const emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
  const phoneOk = /^[6-9]\d{9}$/.test(mobile);
  // a half-typed field must block submit, else it gets stored as a dead contact
  const error = email.trim() && !emailOk
    ? 'that email address looks incomplete'
    : phone.trim() && !phoneOk
      ? 'indian mobiles are 10 digits starting 6–9'
      : '';
  const canSubmit = (emailOk || phoneOk) && !error;

  const submitRestock = async () => {
    if (!canSubmit) return;
    setBusy(true);
    // source stays 'restock' so schema.sql + the README funnel queries keep working;
    // the user-facing copy calls it the launch list.
    // ponytail: leads.email is NOT NULL, so a phone-only lead is keyed by its number.
    const res = await saveLead(emailOk ? email.trim() : `+91${mobile}`, 'restock', {
      email: emailOk ? email.trim() : null,
      phone: phoneOk ? `+91${mobile}` : null,
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

  const submitContact = async () => {
    await submitRestock();
    runStockCheck(); // a failed save must not trap the user in the form
  };

  const fill = Math.min(100, Math.round((subtotal / FREE_SHIP) * 100));

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
                  <div className="sp-t">
                    {subtotal >= FREE_SHIP ? (
                      <><Icon name="party" /> <b>free shipping unlocked</b></>
                    ) : (
                      <>add ₹{FREE_SHIP - subtotal} more for <b>free shipping</b></>
                    )}
                  </div>
                  <div className="sp-bar"><div className="sp-fill" style={{ width: `${fill}%` }} /></div>
                </div>
                <div className="cd-sub"><span>subtotal</span><span>₹{subtotal}</span></div>
                <button className="btn btn-dark cd-checkout" onClick={checkout}><Icon name="lock" size="1em" /> Secure Checkout →</button>
                <div className="pay-chips" style={{ justifyContent: 'center' }}>
                  <span className="upi">UPI</span><span>GPay</span><span>PhonePe</span><span>Paytm</span>
                  <span>VISA</span><span>Mastercard</span><span>RuPay</span><span>COD</span>
                </div>
                <div className="cd-meta"><span><Icon name="receipt" size="1em" /> invoice with every order</span><span><Icon name="lock" size="1em" /> encrypted checkout</span></div>
              </div>
            )}
          </>
        )}

        {panel === 'contact' && (
          <div className="oos show" style={{ justifyContent: 'flex-start', paddingTop: 26, gap: 8 }}>
            <span className="oos-tag" style={{ background: 'var(--ink)', transform: 'none' }}>step 1 of 2 · contact</span>
            <h4>contact details</h4>
            <p>order confirmation, invoice and delivery tracking go here. email or mobile — one is enough.</p>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@gmail.com"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canSubmit && submitContact()}
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
              onKeyDown={(e) => e.key === 'Enter' && canSubmit && submitContact()}
            />
            {error && <p className="mono" role="alert" style={{ fontSize: 11.5, color: 'var(--berry)', marginTop: 2 }}>{error}</p>}
            <div className="cd-sub" style={{ width: '100%', maxWidth: 300, margin: '14px 0 0' }}>
              <span>{count} item{count === 1 ? '' : 's'}</span><span>₹{subtotal}</span>
            </div>
            <div className="cd-sub" style={{ width: '100%', maxWidth: 300, margin: '2px 0 0', fontSize: 13, color: 'var(--ink-60)' }}>
              <span>shipping</span><span>{subtotal >= FREE_SHIP ? 'free' : '₹49'}</span>
            </div>
            <button className="btn btn-dark" style={{ width: '100%', maxWidth: 300 }} onClick={submitContact} disabled={busy || !canSubmit}>
              {busy ? 'saving…' : <><Icon name="lock" size="1em" /> continue to payment →</>}
            </button>
            <div className="pay-chips" style={{ justifyContent: 'center' }}>
              <span className="upi">UPI</span><span>GPay</span><span>PhonePe</span><span>Paytm</span>
              <span>VISA</span><span>Mastercard</span><span>RuPay</span><span>COD</span>
            </div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
              <Icon name="lock" size="1em" /> encrypted · used for this order only · never sold
            </p>
            <button className="reset-btn" style={{ marginTop: 4 }} onClick={backToCart}>← back to cart</button>
          </div>
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
            <span className="oos-tag">out of stock</span>
            <h4>Batch 001 Just Sold Out.</h4>
            <p>
              {saved
                ? "we're not taking orders until it's baked and tested. you're on the launch list — it ships first, at founder pricing."
                : "we're not taking orders until it's baked and tested. drop your email or number — the launch list ships first, at founder pricing."}
            </p>
            <p className="mono" style={{ fontSize: 11, color: 'var(--ink-60)' }}>
              no payment was taken · your cart is saved · we'll email the moment it's ready
            </p>
            {!saved ? (
              <>
                <input
                  type="email"
                  placeholder="you@gmail.com"
                  aria-label="Email for restock"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitRestock()}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={16}
                  placeholder="+91 98765 43210"
                  aria-label="Indian mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitRestock()}
                />
                {error && <p className="mono" role="alert" style={{ fontSize: 11.5, color: 'var(--berry)', marginTop: 2 }}>{error}</p>}
                <button className="btn btn-primary" onClick={submitRestock} disabled={busy || !canSubmit}>
                  {busy ? 'Saving…' : 'Join the Launch List'}
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
