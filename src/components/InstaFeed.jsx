import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

const IG_HANDLE = 'fibbi.club';
const PROFILE = `https://www.instagram.com/${IG_HANDLE}/`;
const TAPES = ['tape', 'tape gold', 'tape pink', 'tape lav', 'tape gold'];

const day = (ts) =>
  ts ? new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';

// vite dev doesn't serve /api, so local runs get placeholders instead of an empty section.
const DEMO = [
  { id: '1', permalink: '#', image: '/products/fibbi-crunch-berry.webp', caption: 'batch 001 berry clusters, straight off the tray. 5g fiber a serve.', timestamp: '2026-08-30', isVideo: false },
  { id: '2', permalink: '#', image: '/products/fibbi-og-jar.webp', caption: 'the og jar. micro-cut psyllium + acacia, stirs clean into anything.', timestamp: '2026-08-27', isVideo: true },
  { id: '3', permalink: '#', image: '/products/fibbi-cup-cocoa.webp', caption: 'cocoa cups landed. twist, spoon, done.', timestamp: '2026-08-22', isVideo: false },
  { id: '4', permalink: '#', image: '/products/fibbi-crunch-coffee.webp', caption: 'coffee crunch taste test at the pune bakery.', timestamp: '2026-08-18', isVideo: false },
  { id: '5', permalink: '#', image: '/products/fibbi-cup-berry.webp', caption: 'berry cup, 4pm crash cancelled.', timestamp: '2026-08-14', isVideo: true },
];

export default function InstaFeed() {
  const [posts, setPosts] = useState(import.meta.env.DEV ? DEMO : []);
  const rail = useRef(null);

  useEffect(() => {
    let live = true;
    fetch('/api/instagram')
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => live && setPosts(d.posts || []))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  // No token, API down, or empty account — the section just isn't there.
  if (!posts.length) return null;

  const nudge = (dir) =>
    rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="insta">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="kicker lime">the feed <Icon name="camera" size="1em" /></span>
            <h2 className="sec-title" style={{ marginBottom: 0 }}>Straight from the bakery.</h2>
          </div>
          <div className="ig-tools">
            <button className="ig-arrow" onClick={() => nudge(-1)} aria-label="Previous posts">←</button>
            <button className="ig-arrow" onClick={() => nudge(1)} aria-label="Next posts">→</button>
            <a className="btn btn-sm" href={PROFILE} target="_blank" rel="noopener noreferrer">
              @{IG_HANDLE} →
            </a>
          </div>
        </div>
        <p className="lead">Batch days, taste tests, and the occasional 6am dough failure — live from Instagram.</p>

        <div className="ig-rail" ref={rail}>
          {posts.map((p, i) => (
            <a key={p.id} className="ig-card" href={p.permalink} target="_blank" rel="noopener noreferrer">
              <span className={TAPES[i % TAPES.length]} aria-hidden="true" />
              <span className="ig-shot">
                <img src={p.image} alt={p.caption || 'fibbi on Instagram'} loading="lazy" decoding="async" />
                {p.isVideo && (
                  <span className="ig-play" aria-hidden="true"><Icon name="play" size="0.75em" /></span>
                )}
              </span>
              <span className="ig-foot">
                <span className="ig-cap">{p.caption || 'view post'}</span>
                <span className="ig-date">{day(p.timestamp)}</span>
              </span>
            </a>
          ))}

          <a className="ig-card ig-follow" href={PROFILE} target="_blank" rel="noopener noreferrer">
            <span className="tape lav" aria-hidden="true" />
            <Icon name="camera" size={30} />
            <strong className="if-h">@{IG_HANDLE}</strong>
            <span className="if-s">follow for batch drops →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
