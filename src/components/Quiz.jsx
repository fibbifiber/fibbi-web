import { useEffect, useState } from 'react';
import AddButton from './AddButton';
import Icon from './Icon';
import { trackEvent } from '../lib/supabase';

const QUESTIONS = [
  { key: 'a', label: '1 · fruits + veggies today?', opts: [['barely any', 3], ['2–3 servings', 8], ["4+ i'm built different", 14]] },
  { key: 'b', label: '2 · whole grains (roti / oats / millets)?', opts: [['mostly maida tbh', 2], ['one proper meal', 6], ['two+ meals', 10]] },
  { key: 'c', label: '3 · dal / beans / chana?', opts: [['rarely', 1], ['few times a week', 3], ['daily, obviously', 6]] },
];

export default function Quiz() {
  const [vals, setVals] = useState({ a: null, b: null, c: null });
  const done = Object.values(vals).every((v) => v !== null);
  const intake = done ? vals.a + vals.b + vals.c : 0;
  const gap = Math.max(0, 30 - intake);
  const pct = gap > 0 ? Math.min(100, Math.round((5 / gap) * 100)) : 100;

  useEffect(() => {
    if (done) trackEvent('quiz_complete', { intake, gap });
  }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="quiz-card reveal" style={{ color: 'var(--ink)' }}>
      <span className="tape" aria-hidden="true"></span>
      <h3>Your 30-Second Fiber Gap Check <Icon name="search" /></h3>
      <p className="q-sub">three taps, no email, brutally honest math.</p>
      {QUESTIONS.map((q) => (
        <div className="q-block" key={q.key}>
          <p className="q">{q.label}</p>
          <div className="chips">
            {q.opts.map(([label, v]) => (
              <button
                key={label}
                className={`chip${vals[q.key] === v ? ' sel' : ''}`}
                onClick={() => setVals((p) => ({ ...p, [q.key]: v }))}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
      {done && (
        <div className="q-result show">
          <div>
            <div className="qr-n">~{gap}g</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>
              your est. daily gap
            </div>
          </div>
          <p className="qr-t">
            {gap <= 2 ? (
              <>honestly? <b>your gut is thriving.</b> keep one crunch pouch around for the days it isn't. <Icon name="leaf" /></>
            ) : (
              <>that's your estimated shortfall <b>today alone</b>. one crunch serve (5g) closes <b>~{pct}%</b> of it — on your dahi, in 10 seconds. <Icon name="bowl" /></>
            )}
          </p>
          <AddButton id="crunch-berry-200" className="btn btn-primary">Close 5g Now · ₹249</AddButton>
        </div>
      )}
    </div>
  );
}
