import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveals } from '../lib/useReveals';
import Icon from '../components/Icon';

export default function Story() {
  const ref = useRef(null);
  useReveals(ref);
  return (
    <div className="page active" ref={ref}>
      <section>
        <div className="wrap">
          <span className="kicker lime">our story <Icon name="book" size="1em" /></span>
          <h1 className="sec-title">The most effective fiber on earth had a branding problem.</h1>
          <div className="story-block">
            <p><b>Since the 1970s,</b> Indian households have started mornings with isabgol stirred into warm water. It worked. It always worked. It also became shorthand for "uncle behaviour" — the single most effective fiber on the planet, filed under embarrassing.</p>
            <p><b>Meanwhile,</b> a generation raised on gut-health reels pays premium prices for imported prebiotic sodas carrying a fraction of the fiber, because those come in cans that look good on a shelf.</p>
            <p><b>fibbi exists to close that gap.</b> Same clinically proven ingredient your grandparents trusted, re-engineered — baked into crunchy clusters at a real 5g dose with zero added sugar — and designed like something you'd actually post. Made in Pune. Priced for India. No lectures.</p>
          </div>
          <div className="timeline">
            <div className="tl reveal"><span className="yr">the insight</span><h4>Fiber didn't need reinventing. The experience did.</h4><p>Texture, dose, and design were the three failures. We fixed all three.</p></div>
            <div className="tl reveal" data-delay="1"><span className="yr">the engineering</span><h4>No-slime, for real</h4><p>Months of cluster baking trials to make psyllium crunchy in a bowl and clean in a glass.</p></div>
            <div className="tl reveal" data-delay="2"><span className="yr">up next</span><h4>Batch 001: 500 pouches</h4><p>Crunch will ship pan-India first. Cups follow on quick commerce in Pune &amp; Mumbai. The launch list gets founder pricing.</p></div>
          </div>
          <div className="cta-row" style={{ marginTop: 40 }}>
            <Link className="btn btn-primary" to="/shop">Shop the Drop</Link>
            <Link className="btn" to="/science">Read the Science</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
