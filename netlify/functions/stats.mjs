// Netlify adapter — same core as the Vercel handler in api/stats.js.
import { buildStats } from '../../api/stats.js';

export default async (req) => {
  const { status, body } = await buildStats({
    days: new URL(req.url).searchParams.get('days'),
    authHeader: req.headers.get('authorization'),
  });
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
};
