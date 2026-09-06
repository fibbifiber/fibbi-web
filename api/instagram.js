// Vercel serverless function: keeps IG_TOKEN server-side, browser only ever sees public post data.
const FIELDS =
  'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_type,media_url,thumbnail_url}';
const LIMIT = 6;
const MAX_SLIDES = 12;

export default async function handler(req, res) {
  const token = process.env.IG_TOKEN;
  if (!token) return res.status(200).json({ posts: [] });

  try {
    const r = await fetch(
      `https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${LIMIT}&access_token=${encodeURIComponent(token)}`
    );
    const body = await r.json();
    if (!r.ok) {
      console.error('instagram api error', body?.error);
      return res.status(502).json({ posts: [] });
    }

    // Album posts become one slide per child image; single posts stay one slide.
    const posts = (body.data || [])
      .flatMap((p) => {
        const media = p.children?.data?.length ? p.children.data : [p];
        return media.map((m, i) => ({
          id: `${p.id}-${i}`,
          permalink: p.permalink,
          caption: (p.caption || '').slice(0, 140),
          image: m.thumbnail_url || m.media_url,
          isVideo: m.media_type === 'VIDEO',
          timestamp: p.timestamp,
        }));
      })
      .slice(0, MAX_SLIDES);

    // IG media URLs are signed and short-lived, so cache at the CDN for an hour, not forever.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json({ posts });
  } catch (e) {
    console.error('instagram fetch failed', e);
    return res.status(502).json({ posts: [] });
  }
}
