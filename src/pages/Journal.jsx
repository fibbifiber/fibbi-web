import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useReveals } from '../lib/useReveals';
import Icon from '../components/Icon';

export const POSTS = [
  {
    slug: 'why-30g-fiber',
    tag: 'gut health',
    read: '4 min',
    date: 'feb 2026',
    title: 'The 30g number, and why almost nobody hits it',
    dek: 'Your gut asks for about 30g of fiber a day. The average urban Indian plate delivers roughly half. Here is what that gap actually costs you.',
    body: [
      "Fiber is the part of plant food your body cannot digest. That sounds like a flaw until you realise it is the entire point — it survives the small intestine intact and arrives in the colon, where roughly 38 trillion bacteria are waiting to eat it.",
      "The ICMR recommends around 30g of dietary fiber a day for adults. Most urban Indian diets land somewhere between 12g and 18g. Rice and refined wheat have been polished, vegetables have been reduced to a side, and packaged snacks contribute almost nothing — the average namkeen or biscuit carries under 1g per serve.",
      "The shortfall is not dramatic on any single day, which is exactly why it persists. It shows up instead as background noise: irregularity, bloating after meals, the 4pm energy crash, and hunger that returns forty minutes after eating.",
      "Closing a 15g gap with vegetables alone means roughly six extra servings a day. That is a real ask. Closing it with a concentrated source — psyllium husk, oat bran, acacia — takes one deliberate serve. Neither approach is morally superior. One of them you will still be doing in March.",
      "A note on pacing: if you are currently at 12g, do not jump to 30g tomorrow. Add 5g a week and drink more water than feels necessary. Fiber works by holding water; without it you get the discomfort and none of the benefit.",
    ],
  },
  {
    slug: 'psyllium-not-a-punishment',
    tag: 'ingredients',
    read: '5 min',
    date: 'feb 2026',
    title: 'Psyllium husk: the most boring miracle in your kitchen',
    dek: 'It has been in Indian homes for a century, served as slimy water at 6am. The evidence behind it is genuinely excellent. The delivery format was the problem.',
    body: [
      "Psyllium is the husk of the Plantago ovata seed, grown mostly in Gujarat and Rajasthan. India supplies the large majority of the world's crop. Your grandmother called it isabgol and treated it as medicine.",
      "It is a soluble, gel-forming fiber, and that gel is where the effects come from. In water it swells to many times its volume, which slows gastric emptying, softens stool, and gives gut bacteria a slow-release substrate to ferment.",
      "The clinical literature is unusually consistent for a food ingredient. Psyllium has been studied for decades in the context of cholesterol, blood sugar response after meals, and regularity. The US FDA permits a qualified health claim linking soluble fiber from psyllium to reduced risk of coronary heart disease — a bar very few ingredients clear.",
      "So why does nobody under thirty touch it? Because the format never changed. A glass of gritty water at dawn is a punishment, not a habit, and habits are the only thing that matters with fiber. Consistency beats dose.",
      "Our position is simple: keep the ingredient, throw out the ritual. Bake the husk into a cluster with oats and dates, and the gel forms in your gut instead of your glass. Same 5g. No slime.",
      "Standard caveat, said plainly: psyllium is a food, not a medicine. It is not a treatment for any disease. Take it with plenty of water, and if you are on medication, space it a couple of hours apart — gel-forming fiber can slow absorption.",
    ],
  },
  {
    slug: 'fiber-and-the-4pm-crash',
    tag: 'energy',
    read: '4 min',
    date: 'mar 2026',
    title: 'Why fiber fixes the 4pm crash better than coffee does',
    dek: 'The afternoon slump is mostly a blood sugar story. Fiber changes the shape of the curve — coffee just masks the bottom of it.',
    body: [
      "Eat a refined-carb lunch and your blood glucose climbs fast. Insulin responds, sometimes a little too enthusiastically, and an hour or two later you are below where you started. That undershoot is the 4pm crash: foggy, irritable, and hunting for a biscuit.",
      "Soluble fiber blunts the climb. The gel it forms slows how quickly carbohydrate is released and absorbed, so the same meal produces a flatter curve — less peak, and crucially, less trough on the other side.",
      "Coffee does not touch any of this. Caffeine blocks the adenosine receptors that make you feel tired; it removes the signal without changing the cause, and the bill arrives later. Useful tool, wrong problem.",
      "There is a second mechanism worth knowing about. When gut bacteria ferment fiber they produce short-chain fatty acids, primarily butyrate, which the cells lining your colon use as their preferred fuel. This is slow, structural, unglamorous work — it does not feel like anything on day one.",
      "Practically: get some fiber into the meal before the slump, not after it. A fiber-forward breakfast measurably flattens the response to lunch — researchers call it the second-meal effect. Ten grams at 8am is doing more for your 4pm than a fourth espresso.",
    ],
  },
];

function PostCard({ p, delay }) {
  return (
    <Link className="jr-card reveal" data-delay={delay} to={`/journal/${p.slug}`}>
      <span className="jr-tag">{p.tag}</span>
      <h3>{p.title}</h3>
      <p>{p.dek}</p>
      <span className="jr-meta">{p.date} · {p.read} read →</span>
    </Link>
  );
}

export default function Journal() {
  const ref = useRef(null);
  useReveals(ref);
  const { slug } = useParams();
  const post = POSTS.find((p) => p.slug === slug);

  if (slug && !post) {
    return (
      <div className="page active">
        <section>
          <div className="wrap">
            <h2 className="sec-title">That one got eaten.</h2>
            <p className="lead" style={{ marginBottom: 24 }}>We couldn't find this entry.</p>
            <Link className="btn btn-primary" to="/journal">Back to the Journal</Link>
          </div>
        </section>
      </div>
    );
  }

  if (post) {
    return (
      <div className="page active" ref={ref}>
        <section>
          <div className="wrap jr-article">
            <Link className="jr-back" to="/journal">← The Journal</Link>
            <span className="jr-tag">{post.tag}</span>
            <h1 className="jr-title">{post.title}</h1>
            <p className="jr-meta">{post.date} · {post.read} read</p>
            <p className="jr-dek">{post.dek}</p>
            {post.body.map((para, i) => <p key={i}>{para}</p>)}
            <div className="jr-cta">
              <p className="lead" style={{ marginBottom: 18 }}>
                Reading about fiber is the easy part. <b style={{ color: 'var(--ink)' }}>Grams are the hard part.</b>
              </p>
              <Link className="btn btn-primary" to="/shop">Shop the Range</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page active" ref={ref}>
      <section>
        <div className="wrap">
          <span className="kicker lime">the journal <Icon name="sparkle" size="1em" /></span>
          <h1 className="sec-title">Fiber, explained without the lecture.</h1>
          <p className="lead">
            Notes on gut health, ingredients, and the science we build on — written for people who want the reasoning, not the marketing.
          </p>
          <div className="jr-grid">
            {POSTS.map((p, i) => <PostCard key={p.slug} p={p} delay={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
