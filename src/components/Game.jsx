import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/supabase';

const tierFor = (s) =>
  s >= 30 ? 'gutcore legend' :
  s >= 25 ? 'certified fibermaxxer' :
  s >= 15 ? 'gut apprentice' :
  s >= 8 ? 'fiber curious' : 'still on the reels';

export default function Game() {
  const arenaRef = useRef(null);
  const playerRef = useRef(null);
  const pfillRef = useRef(null);
  const hudScoreRef = useRef(null);
  const hudTimeRef = useRef(null);

  const [phase, setPhase] = useState('start'); // start | running | end
  const [finalScore, setFinalScore] = useState(0);
  const [best, setBest] = useState(0);

  const state = useRef({ running: false, score: 0, timeLeft: 30, items: [], lastSpawn: 0, lastTick: 0, raf: null, timer: null, playerX: 0.5, keyDir: 0 });

  const setPlayer = () => {
    const arena = arenaRef.current, player = playerRef.current;
    if (!arena || !player) return;
    const w = arena.clientWidth;
    if (!w) return;
    const half = player.offsetWidth / 2;
    player.style.left = Math.max(half, Math.min(w - half, state.current.playerX * w)) + 'px';
  };

  const floatScore = (x, y, text, color) => {
    const arena = arenaRef.current;
    const f = document.createElement('div');
    f.className = 'floatscore';
    f.textContent = text;
    f.style.left = x + 'px';
    f.style.top = y + 'px';
    f.style.color = color;
    arena.appendChild(f);
    setTimeout(() => f.remove(), 750);
  };

  const spawn = (now) => {
    const s = state.current, arena = arenaRef.current;
    const isSugar = Math.random() < 0.3;
    const el = document.createElement('div');
    el.className = 'item ' + (isSugar ? 'sugar' : 'gold');
    const w = arena.clientWidth;
    const x = 20 + Math.random() * (w - 60);
    el.style.left = x + 'px';
    el.style.top = '-32px';
    arena.appendChild(el);
    s.items.push({ el, x: x + 14, y: -32, sugar: isSugar, speed: 130 + Math.random() * 110 + (30 - s.timeLeft) * 4 });
    s.lastSpawn = now;
  };

  const loop = (now) => {
    const s = state.current, arena = arenaRef.current, player = playerRef.current;
    if (!s.running || !arena) return;
    if (!s.lastTick) s.lastTick = now;
    const dt = Math.min(0.05, (now - s.lastTick) / 1000);
    s.lastTick = now;
    if (s.keyDir !== 0) {
      s.playerX = Math.max(0, Math.min(1, s.playerX + s.keyDir * dt * 0.9));
      setPlayer();
    }
    const interval = Math.max(320, 560 - (30 - s.timeLeft) * 8);
    if (now - s.lastSpawn > interval) spawn(now);

    const arenaH = arena.clientHeight;
    const pRect = player.getBoundingClientRect();
    const aRect = arena.getBoundingClientRect();
    const pCenter = pRect.left - aRect.left + pRect.width / 2;
    const catchY = arenaH - 60;

    s.items = s.items.filter((it) => {
      it.y += it.speed * dt;
      it.el.style.top = it.y + 'px';
      if (it.y > catchY && it.y < catchY + 42 && Math.abs(it.x - pCenter) < 50) {
        if (it.sugar) {
          s.score = Math.max(0, s.score - 2);
          player.classList.add('hit');
          setTimeout(() => player.classList.remove('hit'), 320);
          floatScore(it.x - 14, it.y - 10, '−2g', '#E8447A');
        } else {
          s.score += 1;
          floatScore(it.x - 12, it.y - 10, '+1g', '#8FB623');
        }
        hudScoreRef.current.textContent = s.score + 'g fiber';
        pfillRef.current.style.height = Math.min(78, 18 + s.score * 2) + '%';
        it.el.remove();
        return false;
      }
      if (it.y > arenaH + 40) {
        it.el.remove();
        return false;
      }
      return true;
    });
    s.raf = requestAnimationFrame(loop);
  };

  const cleanupItems = () => {
    state.current.items.forEach((it) => it.el.remove());
    state.current.items = [];
  };

  const start = () => {
    const s = state.current;
    cleanupItems();
    s.score = 0; s.timeLeft = 30; s.lastSpawn = 0; s.lastTick = 0; s.running = true;
    hudScoreRef.current.textContent = '0g fiber';
    hudTimeRef.current.textContent = '30s';
    pfillRef.current.style.height = '18%';
    setPhase('running');
    s.raf = requestAnimationFrame(loop);
    s.timer = setInterval(() => {
      if (!s.running) { clearInterval(s.timer); return; }
      s.timeLeft -= 1;
      hudTimeRef.current.textContent = s.timeLeft + 's';
      if (s.timeLeft <= 0) { clearInterval(s.timer); end(); }
    }, 1000);
  };

  const end = () => {
    const s = state.current;
    s.running = false;
    cancelAnimationFrame(s.raf);
    cleanupItems();
    setFinalScore(s.score);
    setBest((b) => Math.max(b, s.score));
    setPhase('end');
    trackEvent('game_score', { score: s.score, tier: tierFor(s.score) });
  };

  useEffect(() => {
    const arena = arenaRef.current;
    const s = state.current;
    const onMove = (e) => {
      if (!s.running) return;
      const r = arena.getBoundingClientRect();
      s.playerX = (e.clientX - r.left) / r.width;
      setPlayer();
    };
    const onTouch = (e) => {
      if (!s.running) return;
      e.preventDefault();
      const r = arena.getBoundingClientRect();
      s.playerX = (e.touches[0].clientX - r.left) / r.width;
      setPlayer();
    };
    const onKeyDown = (e) => {
      if (!s.running) return;
      if (e.key === 'ArrowLeft') { s.keyDir = -1; e.preventDefault(); }
      if (e.key === 'ArrowRight') { s.keyDir = 1; e.preventDefault(); }
    };
    const onKeyUp = (e) => {
      if (e.key === 'ArrowLeft' && s.keyDir === -1) s.keyDir = 0;
      if (e.key === 'ArrowRight' && s.keyDir === 1) s.keyDir = 0;
    };
    arena.addEventListener('mousemove', onMove);
    arena.addEventListener('touchmove', onTouch, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', setPlayer);
    return () => {
      s.running = false;
      cancelAnimationFrame(s.raf);
      clearInterval(s.timer);
      cleanupItems();
      arena.removeEventListener('mousemove', onMove);
      arena.removeEventListener('touchmove', onTouch);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', setPlayer);
    };
  }, []);

  return (
    <div className="game-card">
      <span className="tape" aria-hidden="true"></span>
      <div className="game-head">
        <h3>Catch Clusters · Dodge Sugar</h3>
        <span className="game-best">best: {best}g</span>
      </div>
      <div className={`arena${phase !== 'running' ? ' idle' : ''}`} ref={arenaRef}>
        <div className="hud">
          <span className="pill" ref={hudScoreRef}>0g fiber</span>
          <span className="pill" ref={hudTimeRef}>30s</span>
        </div>
        <div className="player" ref={playerRef} style={{ left: '50%' }}>
          <div className="pcup"></div>
          <div className="pfill" ref={pfillRef} style={{ height: '18%' }}></div>
        </div>
        {phase === 'start' && (
          <div className="overlay">
            <h4>Ready to fibermaxx?</h4>
            <p>Move the cup with your mouse, finger, or ← → keys. Clusters +1g. Sugar −2g. 30 seconds on the clock.</p>
            <button className="btn btn-dark" onClick={start}>Start</button>
          </div>
        )}
        {phase === 'end' && (
          <div className="overlay">
            <h4>Time's up.</h4>
            <p>You caught {finalScore}g of fiber{finalScore >= 25 ? ' — daily goal, maxxed.' : '.'}</p>
            <span className="tier">{tierFor(finalScore)}</span>
            <button className="btn btn-dark" onClick={start}>Run It Back ↻</button>
          </div>
        )}
      </div>
      <div className="game-foot">tiers: 8g fiber curious · 15g gut apprentice · 25g certified fibermaxxer · 30g gutcore legend</div>
    </div>
  );
}
