import { useCallback, useEffect, useMemo, useState } from 'react';
import '../styles/dashboard.css';

const KEY_STORE = 'fibbi_dash_key';
const RANGES = [7, 30, 90, 365];

const nf = new Intl.NumberFormat('en-IN');
const inr = (n) => '₹' + nf.format(Math.round(n || 0));
const secs = (ms) => (ms >= 60000 ? `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s` : `${Math.round(ms / 1000)}s`);

function Stat({ label, value, sub, tone }) {
  return (
    <div className={`dash-stat${tone ? ' t-' + tone : ''}`}>
      <span className="dash-stat-label">{label}</span>
      <strong className="dash-stat-value">{value}</strong>
      {sub && <span className="dash-stat-sub">{sub}</span>}
    </div>
  );
}

function Bars({ rows, format = nf.format, empty = 'Nothing yet.' }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (!rows.length) return <p className="dash-empty">{empty}</p>;
  return (
    <ul className="dash-bars">
      {rows.map((r, i) => (
        <li key={r.label + i}>
          <span className="dash-bar-label" title={r.title || r.label}>{r.label}</span>
          <span className="dash-bar-track"><span className="dash-bar-fill" style={{ width: `${(r.value / max) * 100}%` }} /></span>
          <span className="dash-bar-value mono">{format(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Multi-series line chart, hand-rolled so the dashboard costs zero extra kb. */
function Trend({ daily }) {
  const series = [
    { key: 'sessions', color: 'var(--ink)' },
    { key: 'views', color: 'var(--lav)' },
    { key: 'atc', color: 'var(--lime-deep)' },
    { key: 'checkouts', color: 'var(--berry)' },
    { key: 'leads', color: 'var(--gold)' },
  ];
  const max = Math.max(1, ...daily.flatMap((d) => series.map((s) => d[s.key] || 0)));
  const W = 720;
  const H = 180;
  const x = (i) => (daily.length < 2 ? W / 2 : (i / (daily.length - 1)) * W);
  const y = (v) => H - (v / max) * (H - 8) - 4;

  if (!daily.length) return <p className="dash-empty">No traffic in this window.</p>;
  return (
    <>
      <svg className="dash-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Daily trend">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--ink-12)" strokeWidth="1" />
        ))}
        {series.map((s) => (
          <polyline
            key={s.key}
            points={daily.map((d, i) => `${x(i)},${y(d[s.key] || 0)}`).join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="dash-legend">
        {series.map((s) => (
          <span key={s.key}><i style={{ background: s.color }} />{s.key}</span>
        ))}
        <span className="dash-legend-max mono">peak {max}/day</span>
      </div>
    </>
  );
}

function Panel({ title, note, children, wide }) {
  return (
    <section className={`dash-panel${wide ? ' wide' : ''}`}>
      <header><h3>{title}</h3>{note && <span className="dash-note">{note}</span>}</header>
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORE) || '');
  const [input, setInput] = useState('');
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!key) return;
    setStatus('loading');
    setError('');
    try {
      const r = await fetch(`/api/stats?days=${days}`, { headers: { Authorization: `Bearer ${key}` } });
      if (r.status === 401) {
        sessionStorage.removeItem(KEY_STORE);
        setKey('');
        throw new Error('That key was rejected.');
      }
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `Request failed (${r.status})`);
      setData(await r.json());
      setStatus('ready');
    } catch (e) {
      setError(e.message);
      setStatus('error');
    }
  }, [key, days]);

  useEffect(() => { load(); }, [load]);

  const t = data?.totals;
  const hourPeak = useMemo(() => Math.max(1, ...(data?.hours || [1])), [data]);

  if (!key) {
    return (
      <div className="page active dash">
        <div className="dash-gate">
          <h1>fibbi insights</h1>
          <p>Private dashboard. Enter the access key.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sessionStorage.setItem(KEY_STORE, input.trim());
              setKey(input.trim());
            }}
          >
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="access key"
              aria-label="Dashboard access key"
              autoFocus
            />
            <button type="submit" className="btn">Unlock</button>
          </form>
          {error && <p className="dash-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="page active dash">
      <div className="dash-head">
        <div>
          <h1>fibbi insights</h1>
          <p className="dash-sub">
            {data ? `${nf.format(t.sessions)} sessions · last ${data.range.days} days` : 'Loading…'}
            {data?.range?.truncated && ' · showing the most recent 50k events'}
          </p>
        </div>
        <div className="dash-controls">
          {RANGES.map((d) => (
            <button key={d} className={`dash-chip${d === days ? ' on' : ''}`} onClick={() => setDays(d)}>
              {d === 365 ? '1y' : `${d}d`}
            </button>
          ))}
          <button className="dash-chip" onClick={load} disabled={status === 'loading'}>
            {status === 'loading' ? '…' : '↻'}
          </button>
          <button
            className="dash-chip"
            onClick={() => { sessionStorage.removeItem(KEY_STORE); setKey(''); setData(null); }}
          >
            lock
          </button>
        </div>
      </div>

      {error && <p className="dash-error">{error}</p>}
      {!data && status === 'loading' && <p className="dash-empty">Crunching numbers…</p>}

      {data && (
        <>
          <div className="dash-stats">
            <Stat label="Visitors" value={nf.format(t.visitors)} sub={`${t.returning_pct}% returning`} tone="lav" />
            <Stat label="Sessions" value={nf.format(t.sessions)} sub={`${t.pages_per_session} pages each`} />
            <Stat label="Page views" value={nf.format(t.page_views)} sub={`${t.bounce_rate}% single-page`} />
            <Stat label="Add to cart" value={nf.format(t.add_to_carts)} sub={`${t.cvr_atc}% of sessions`} tone="lime" />
            <Stat label="Checkout tries" value={nf.format(t.checkout_attempts)} sub={`${t.cvr_checkout}% of sessions`} tone="berry" />
            <Stat label="Emails captured" value={nf.format(t.leads)} sub={`${t.cvr_lead}% of sessions`} tone="gold" />
            <Stat label="Demand value" value={inr(t.intent_value)} sub="attempted checkout subtotal" />
            <Stat label="Avg time on page" value={secs(t.avg_dwell_ms)} sub={`${t.avg_scroll}% avg scroll depth`} />
          </div>

          <Panel title="Daily trend" wide>
            <Trend daily={data.daily} />
          </Panel>

          <div className="dash-grid">
            <Panel title="Funnel" note="share of all sessions">
              <ul className="dash-funnel">
                {data.funnel.map((s) => (
                  <li key={s.step}>
                    <span>{s.step}</span>
                    <span className="dash-bar-track"><span className="dash-bar-fill" style={{ width: `${s.pct}%` }} /></span>
                    <span className="mono">{nf.format(s.count)} · {s.pct}%</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Where they come from" note="utm source, else referrer">
              <Bars rows={data.sources.map((s) => ({ label: s.key, value: s.count }))} />
            </Panel>

            <Panel title="Top pages" note="views · avg scroll">
              <Bars
                rows={data.pages.map((p) => ({
                  label: p.path,
                  value: p.views,
                  title: `${p.path} — ${p.sessions} sessions, ${secs(p.avg_dwell_ms)} avg, ${p.avg_scroll}% scroll`,
                }))}
              />
            </Panel>

            <Panel title="Most-clicked things">
              <Bars
                rows={data.clicks_top.map((c) => ({
                  label: c.label || c.href || '(unlabelled)',
                  value: c.count,
                  title: `${c.label} on ${c.path}${c.href ? ' → ' + c.href : ''}`,
                }))}
              />
            </Panel>

            <Panel title="Product interest" note="add-to-cart by SKU">
              <Bars
                rows={data.products.map((p) => ({ label: p.sku, value: p.adds, title: `${inr(p.value)} of demand` }))}
                empty="No add-to-carts yet."
              />
            </Panel>

            <Panel title="Devices">
              <Bars
                rows={[
                  { label: 'Mobile', value: data.devices.mobile },
                  { label: 'Desktop', value: data.devices.desktop },
                  ...data.devices.connections.map((c) => ({ label: `net: ${c.key}`, value: c.count })),
                ]}
              />
            </Panel>

            <Panel title="Landing pages">
              <Bars rows={data.landings.map((l) => ({ label: l.key, value: l.count }))} />
            </Panel>

            <Panel title="Email list" note={`${data.leads.total} in this window`}>
              <Bars rows={data.leads.by_source.map((s) => ({ label: s.key, value: s.count }))} empty="No signups yet." />
              <ul className="dash-list">
                {data.leads.recent.slice(0, 8).map((l, i) => (
                  <li key={i}>
                    <span className="mono">{l.email}</span>
                    <span className="dash-tag">{l.source}</span>
                    <span className="dash-note">{l.created_at.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel title="Friction" note="what stalls people">
              <Bars
                rows={[
                  { label: 'Out-of-stock seen', value: data.friction.oos_shown },
                  ...data.friction.abandoned_fields.map((f) => ({ label: `left "${f.key}" empty`, value: f.count })),
                ]}
                empty="Nothing blocking anyone."
              />
            </Panel>

            <Panel title="When they visit" note="UTC hour">
              <div className="dash-hours">
                {data.hours.map((n, h) => (
                  <span key={h} title={`${h}:00 UTC · ${n} events`} style={{ '--h': `${(n / hourPeak) * 100}%` }} />
                ))}
              </div>
              <div className="dash-note dash-hours-axis mono"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>
            </Panel>
          </div>

          <p className="dash-foot mono">
            Generated {new Date(data.range.generated_at).toLocaleString()} · emails masked on the server
          </p>
        </>
      )}
    </div>
  );
}
