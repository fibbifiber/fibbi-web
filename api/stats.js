// Vercel serverless function: reads events/visits/leads with the service-role key
// (which never reaches the browser) and returns pre-aggregated business metrics.
// Gated by DASH_KEY — send it as `Authorization: Bearer <key>`.
import { timingSafeEqual } from 'node:crypto';

const BASE = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PASS = process.env.DASH_KEY;

const MAX_EVENTS = 50000;
const MAX_VISITS = 20000;
const MAX_LEADS = 2000;
const DAY_MS = 86400000;

function authorized(header) {
  const sent = String(header || '').replace(/^Bearer\s+/i, '');
  if (!PASS || !sent) return false;
  const a = Buffer.from(sent);
  const b = Buffer.from(PASS);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** PostgREST GET. Returns [] instead of throwing so one missing table can't blank the page. */
async function pg(query) {
  try {
    const r = await fetch(`${BASE}/rest/v1/${query}`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (!r.ok) {
      console.error('stats query failed', query, r.status);
      return [];
    }
    return await r.json();
  } catch (e) {
    console.error('stats query error', query, e);
    return [];
  }
}

/* ------------------------------------------------------------------ helpers */

const inc = (m, k, n = 1) => {
  if (k === null || k === undefined || k === '') return;
  m.set(k, (m.get(k) || 0) + n);
};

const topN = (m, n) =>
  [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([key, count]) => ({ key, count }));

const pct = (part, whole) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);
const num = (v) => (Number.isFinite(+v) ? +v : 0);

function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/** Owner sees volume and domains, not inboxes — the key is shared, the list shouldn't be. */
function maskEmail(email) {
  const [user = '', domain = ''] = String(email).split('@');
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}

/* --------------------------------------------------------------------- core */

/** Host-agnostic. The Vercel handler below and netlify/functions/stats.mjs both call this. */
export async function buildStats({ days: rawDays, authHeader }) {
  if (!BASE || !SERVICE_KEY || !PASS) {
    return { status: 503, body: { error: 'dashboard not configured' } };
  }
  if (!authorized(authHeader)) return { status: 401, body: { error: 'unauthorized' } };

  const days = Math.min(365, Math.max(1, parseInt(rawDays, 10) || 30));
  const since = new Date(Date.now() - days * DAY_MS).toISOString();
  const sel = `created_at=gte.${since}&order=created_at.desc`;

  const [rawEvents, visits, leads] = await Promise.all([
    pg(`events?select=created_at,event,path,payload,session_id,visitor_id&${sel}&limit=${MAX_EVENTS}`),
    pg(`visits?select=created_at,visitor_id,session_id,visit_no,referrer,landing,utm,device&${sel}&limit=${MAX_VISITS}`),
    pg(`leads?select=created_at,email,source&${sel}&limit=${MAX_LEADS}`),
  ]);

  // The owner browsing this dashboard must not show up in the owner's numbers.
  const events = rawEvents.filter((e) => !String(e.path || '').startsWith('/dashboard'));

  const visitors = new Set();
  const sessions = new Set();
  const daily = new Map();
  const pages = new Map();
  const clickMap = new Map();
  const products = new Map();
  const hours = Array(24).fill(0);
  const quizGaps = [];
  const abandoned = new Map();
  const viewsPerSession = new Map();

  let pageViews = 0;
  let clicks = 0;
  let addToCarts = 0;
  let checkouts = 0;
  let oosShown = 0;
  let intent = 0;
  let dwellMs = 0;
  let dwellN = 0;
  let scrollSum = 0;
  let scrollN = 0;

  const day = (row) => String(row.created_at).slice(0, 10);
  const bucket = (d) => {
    if (!daily.has(d)) daily.set(d, { day: d, sessions: new Set(), views: 0, atc: 0, checkouts: 0, leads: 0 });
    return daily.get(d);
  };
  const page = (p) => {
    if (!pages.has(p)) pages.set(p, { path: p, views: 0, sessions: new Set(), dwell: 0, dwellN: 0, scroll: 0, scrollN: 0 });
    return pages.get(p);
  };

  for (const e of events) {
    const d = bucket(day(e));
    const p = e.payload || {};
    if (e.visitor_id) visitors.add(e.visitor_id);
    if (e.session_id) {
      sessions.add(e.session_id);
      d.sessions.add(e.session_id);
    }
    hours[new Date(e.created_at).getUTCHours()]++;

    switch (e.event) {
      case 'page_view': {
        pageViews++;
        d.views++;
        const pg_ = page(e.path || '/');
        pg_.views++;
        if (e.session_id) {
          pg_.sessions.add(e.session_id);
          viewsPerSession.set(e.session_id, (viewsPerSession.get(e.session_id) || 0) + 1);
        }
        break;
      }
      case 'click':
        clicks++;
        inc(clickMap, `${p.label || '(unlabelled)'}\u0000${e.path || '/'}\u0000${p.href || ''}`);
        break;
      case 'page_exit': {
        const pg_ = page(e.path || '/');
        if (p.dwell_ms) {
          dwellMs += num(p.dwell_ms);
          dwellN++;
          pg_.dwell += num(p.dwell_ms);
          pg_.dwellN++;
        }
        if (p.max_scroll != null) {
          scrollSum += num(p.max_scroll);
          scrollN++;
          pg_.scroll += num(p.max_scroll);
          pg_.scrollN++;
        }
        break;
      }
      case 'add_to_cart':
        addToCarts++;
        d.atc++;
        if (p.sku) {
          const cur = products.get(p.sku) || { sku: p.sku, adds: 0, value: 0 };
          cur.adds++;
          cur.value += num(p.price);
          products.set(p.sku, cur);
        }
        break;
      case 'checkout_attempt':
        checkouts++;
        d.checkouts++;
        intent += num(p.subtotal);
        break;
      case 'oos_shown':
        oosShown++;
        break;
      case 'quiz_complete':
        if (p.gap != null) quizGaps.push(num(p.gap));
        break;
      case 'field_blur':
        if (p.filled === false) inc(abandoned, p.field);
        break;
    }
  }

  /* ------------------------------------------------------------- visit rows */

  const sources = new Map();
  const landings = new Map();
  const connections = new Map();
  const timezones = new Map();
  let mobile = 0;
  let desktop = 0;
  let returning = 0;

  for (const v of visits) {
    const utm = v.utm || {};
    const dev = v.device || {};
    inc(sources, utm.utm_source || host(v.referrer) || 'direct');
    inc(landings, String(v.landing || '/').split('?')[0]);
    inc(connections, dev.net);
    inc(timezones, dev.tz);
    if (dev.mobile) mobile++;
    else desktop++;
    if (num(v.visit_no) > 1) returning++;
  }

  /* -------------------------------------------------------------- lead rows */

  const leadSources = new Map();
  const leadDomains = new Map();
  for (const l of leads) {
    inc(leadSources, l.source);
    inc(leadDomains, String(l.email).split('@')[1]);
    const d = daily.get(String(l.created_at).slice(0, 10));
    if (d) d.leads++;
  }

  /* ----------------------------------------------------------------- output */

  const sessionCount = sessions.size || visits.length;
  const bounced = [...viewsPerSession.values()].filter((n) => n === 1).length;
  const atcSessions = new Set(events.filter((e) => e.event === 'add_to_cart').map((e) => e.session_id)).size;
  const coSessions = new Set(events.filter((e) => e.event === 'checkout_attempt').map((e) => e.session_id)).size;

  const body = {
    range: { days, since, generated_at: new Date().toISOString(), truncated: events.length >= MAX_EVENTS },
    totals: {
      visitors: visitors.size,
      sessions: sessionCount,
      returning,
      returning_pct: pct(returning, visits.length),
      page_views: pageViews,
      clicks,
      add_to_carts: addToCarts,
      checkout_attempts: checkouts,
      leads: leads.length,
      oos_shown: oosShown,
      quizzes: quizGaps.length,
      intent_value: Math.round(intent),
      avg_dwell_ms: dwellN ? Math.round(dwellMs / dwellN) : 0,
      avg_scroll: scrollN ? Math.round(scrollSum / scrollN) : 0,
      pages_per_session: sessionCount ? Math.round((pageViews / sessionCount) * 10) / 10 : 0,
      bounce_rate: pct(bounced, viewsPerSession.size),
      cvr_atc: pct(atcSessions, sessionCount),
      cvr_checkout: pct(coSessions, sessionCount),
      cvr_lead: pct(leads.length, sessionCount),
    },
    funnel: [
      { step: 'Sessions', count: sessionCount },
      { step: 'Viewed a page', count: viewsPerSession.size },
      { step: 'Added to cart', count: atcSessions },
      { step: 'Tried checkout', count: coSessions },
      { step: 'Left an email', count: leads.length },
    ].map((s) => ({ ...s, pct: pct(s.count, sessionCount) })),
    daily: [...daily.values()]
      .map((d) => ({ ...d, sessions: d.sessions.size }))
      .sort((a, b) => a.day.localeCompare(b.day)),
    pages: [...pages.values()]
      .map((p) => ({
        path: p.path,
        views: p.views,
        sessions: p.sessions.size,
        avg_dwell_ms: p.dwellN ? Math.round(p.dwell / p.dwellN) : 0,
        avg_scroll: p.scrollN ? Math.round(p.scroll / p.scrollN) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 15),
    clicks_top: topN(clickMap, 15).map(({ key, count }) => {
      const [label, path, href] = key.split('\u0000');
      return { label, path, href, count };
    }),
    sources: topN(sources, 10),
    landings: topN(landings, 10),
    devices: {
      mobile,
      desktop,
      mobile_pct: pct(mobile, mobile + desktop),
      connections: topN(connections, 5),
      timezones: topN(timezones, 5),
    },
    products: [...products.values()].sort((a, b) => b.adds - a.adds).slice(0, 10),
    leads: {
      total: leads.length,
      by_source: topN(leadSources, 6),
      by_domain: topN(leadDomains, 6),
      recent: leads.slice(0, 20).map((l) => ({
        created_at: l.created_at,
        email: maskEmail(l.email),
        source: l.source,
      })),
    },
    hours,
    quiz: {
      completions: quizGaps.length,
      avg_gap: quizGaps.length ? Math.round(quizGaps.reduce((s, g) => s + g, 0) / quizGaps.length) : 0,
    },
    friction: { abandoned_fields: topN(abandoned, 6), oos_shown: oosShown },
  };

  return { status: 200, body };
}

/* ------------------------------------------------------------ vercel adapter */

export default async function handler(req, res) {
  const { status, body } = await buildStats({
    days: req.query?.days,
    authHeader: req.headers.authorization,
  });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}
