import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveals } from '../lib/useReveals';
import { saveLead, trackEvent } from '../lib/supabase';
import Icon from '../components/Icon';
import Marquee from '../components/Marquee';
import TrustStrip from '../components/TrustStrip';
import Quiz from '../components/Quiz';
import Testimonials from '../components/Testimonials';
// import InstaFeed from '../components/InstaFeed';  // re-enable once IG_TOKEN is set
import { POSTS } from './Journal';

const METRO_PREFIX = ['11', '12', '20', '40', '41', '56', '60', '50', '70', '38', '30'];

function PinCheck() {
  const [pin, setPin] = useState('');
  const [msg, setMsg] = useState({ text: 'we deliver to most pincodes across india', ok: false });

  const check = () => {
    const v = pin.trim();
    if (!/^[1-9][0-9]{5}$/.test(v)) {
      setMsg({ text: 'enter a valid 6-digit pincode', ok: false });
      return;
    }
    const metro = METRO_PREFIX.includes(v.slice(0, 2));
    setMsg({ text: `delivering to ${v} — est. ${metro ? '2–4' : '4–7'} days · COD available`, ok: true });
    trackEvent('pin_check', { pin: v, metro });
  };

  return (
    <div className="pin-check">
        <span style={{ fontWeight: 700, fontSize: 13.5 }}><Icon name="pin" size="1.05em" /> Check Delivery:</span>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="pincode"
        aria-label="Delivery pincode"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && check()}
      />
      <button className="pin-go" onClick={check}>Check</button>
      <span className={`pin-msg${msg.ok ? ' ok' : ''}`}>{msg.text}</span>
    </div>
  );
}

function Waitlist() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  // Same validation as the cart reservation form, so one list has one standard.
  const mobile = phone.replace(/\D/g, '').slice(-10);
  const emailOk = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
  const phoneOk = /^[6-9]\d{9}$/.test(mobile);
  const error = email.trim() && !emailOk
    ? 'that email address looks incomplete'
    : phone.trim() && !phoneOk
      ? 'indian mobiles are 10 digits starting 6–9'
      : '';
  const canSubmit = emailOk && phoneOk && !error;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    const res = await saveLead(email.trim(), 'waitlist', {
      email: email.trim(),
      phone: `+91${mobile}`,
    });
    setBusy(false);
    if (res.ok) {
      setDone(true);
      trackEvent('lead_saved', { source: 'waitlist' });
    }
  };

  return (
    <section className="waitlist">
      <div className="wrap">
        <h2 className="sec-title reveal">Batch 001 is small. <Icon name="box" /></h2>
        <p className="lead reveal">
          500 pouches, because that's all our bakery can do at once. The launch list gets first dibs and founder pricing when it's ready.
        </p>
        {!done ? (
          <>
            <div className="wl-form reveal" data-delay="1">
              <input
                type="email"
                autoComplete="email"
                placeholder="you@gmail.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && submit()}
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
                onKeyDown={(e) => e.key === 'Enter' && canSubmit && submit()}
              />
              <button className="btn btn-dark" onClick={submit} disabled={busy || !canSubmit}>
                {busy ? 'Saving…' : 'Get on the List'}
              </button>
            </div>
            {error && <p className="mono reveal" role="alert" style={{ fontSize: 11.5, color: 'var(--berry)', marginTop: 8 }}>{error}</p>}
          </>
        ) : (
          <p className="wl-done" style={{ display: 'block' }}>you're in — first parcel has your name on it <Icon name="check" size="1em" /></p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const ref = useRef(null);
  useReveals(ref);

  return (
    <div className="page active" ref={ref}>
      <div className="hero">
        <div>
          <h1>
            Fiber that <span className="u">snacks back.</span>
          </h1>
          <p className="lead">
            The fiber your grandpa swore by, minus the 6am glass of slime. We baked it into something you'd actually reach for —
            5g a serve, no lecture.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" to="/shop">Shop the Range · From ₹99</Link>
          </div>
          <PinCheck />
          <div className="hero-meta">
            <div className="hm"><div className="n">5g</div><div className="l">fiber per serve</div></div>
            <div className="hm"><div className="n">0g</div><div className="l">added sugar</div></div>
            <div className="hm"><div className="n">6</div><div className="l">ingredients, total</div></div>
          </div>
        </div>
        <Link className="hero-banner" to="/shop" aria-label="Shop the range">
          <video src="/fibbi-banner.mp4" autoPlay muted loop playsInline preload="metadata" />
        </Link>
      </div>

      <Marquee />
      <TrustStrip />

      <section className="home-shop">
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="kicker lime">shop <Icon name="cart" size="1em" /></span>
              <h2 className="sec-title" style={{ marginBottom: 0 }}>Pick your format.</h2>
            </div>
            <Link className="btn btn-sm" to="/shop">See All 10 →</Link>
          </div>
          <p className="lead reveal">
            Same 5g dose, three ways to take it. Start where your routine already is.
          </p>
          <div className="lines">
            {/* Cheapest entry point first — ₹99 is the lowest-friction way in. */}
            <Link className="line-card lc-cups reveal" to="/shop#cups">
              <span className="tape pink" aria-hidden="true"></span>
              <img className="lc-img" src="/the-cup.webp" alt="fibbi cups" loading="lazy" decoding="async" />
              <span className="lc-tag">spoon it</span>
              <h3>Fibbi Cups</h3>
              <p>Twist-top dahi cups with a crunch topper. Nothing to prepare.</p>
              <span className="lc-price">from ₹99 →</span>
            </Link>
            <Link className="line-card lc-crunch reveal" data-delay="1" to="/shop#crunch">
              <span className="tape" aria-hidden="true"></span>
              <img className="lc-img" src="/the-crunch.webp" alt="fibbi crunch" loading="lazy" decoding="async" />
              <span className="lc-tag"><Icon name="star" size="1em" /> snack it</span>
              <h3>Fibbi Crunch</h3>
              <p>Oat-psyllium clusters that snack like granola. Eat them dry, or over dahi.</p>
              <span className="lc-price">from ₹249 →</span>
            </Link>
            <Link className="line-card lc-og reveal" data-delay="2" to="/shop#og">
              <span className="tape gold" aria-hidden="true"></span>
              <img className="lc-img" src="/the-og.webp" alt="fibbi og" loading="lazy" decoding="async" />
              <span className="lc-tag">stir it</span>
              <h3>Fibbi OG</h3>
              <p>Our husk blend — micro-cut psyllium + prebiotic acacia. Stirs clean into anything.</p>
              <span className="lc-price">from ₹399 →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <span className="kicker reveal" style={{ background: 'transparent', color: 'var(--lime)', borderColor: 'var(--lime)' }}>
            the problem
          </span>
          <h2 className="sec-title reveal">You're short on fiber.<br />Today. Again.</h2>
          <div className="gap-big reveal">~15g</div>
          <p className="lead reveal">
            That's the average daily fiber gap for urban Indians — your gut needs ~30g, the average plate delivers about half. The gap
            shows up as bloating, 4pm crashes, and snacking that never satisfies.
          </p>
          <div className="proof-grid">
            <div className="proof reveal"><span className="p-emo"><Icon name="phone" size={30} /></span><div className="p-h">You know the theory</div><p>40 gut-health reels a month. The word "microbiome" lives in your head rent-free. Knowledge isn't the gap — grams are.</p></div>
            <div className="proof reveal" data-delay="1"><span className="p-emo"><Icon name="cookie" size={30} /></span><div className="p-h">Your snacks work against you</div><p>The average packaged snack carries under 1g of fiber and a sugar spike. You snack, you crash, you snack again.</p></div>
            <div className="proof reveal" data-delay="2"><span className="p-emo"><Icon name="spoon" size={30} /></span><div className="p-h">The fix tasted like punishment</div><p>The most proven fiber on earth has been in Indian homes for a century — served as slimy water at 6am. So nobody your age touches it.</p></div>
          </div>
          <Quiz />
        </div>
      </section>

      <Testimonials />

      <section>
        <div className="wrap">
          <div className="sec-head reveal">
            <div>
              <span className="kicker">the journal</span>
              <h2 className="sec-title" style={{ marginBottom: 0 }}>Fiber, explained.</h2>
            </div>
            <Link className="btn btn-sm" to="/journal">Read All →</Link>
          </div>
          <div className="jr-grid">
            {POSTS.map((p, i) => (
              <Link key={p.slug} className="jr-card reveal" data-delay={i} to={`/journal/${p.slug}`}>
                <span className="jr-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.dek}</p>
                <span className="jr-meta">{p.date} · {p.read} read →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* <InstaFeed /> */}

      <Waitlist />
    </div>
  );
}
