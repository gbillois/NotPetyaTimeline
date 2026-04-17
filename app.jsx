// Main app — timeline hero on top (1/3 height), map + list + detail below.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const App = () => {
  const events = window.TIMELINE_EVENTS;
  const phases = window.PHASES;

  const [currentTime, setCurrentTimeRaw] = useState(() => {
    try {
      const v = parseFloat(localStorage.getItem('notpetya:t') || '0');
      return isFinite(v) ? Math.max(0, Math.min(1, v)) : 0;
    } catch { return 0; }
  });
  const [activeId, setActiveIdRaw] = useState(() => {
    try { return localStorage.getItem('notpetya:active') || 'e01'; }
    catch { return 'e01'; }
  });
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const setCurrentTime = useCallback((t) => {
    setCurrentTimeRaw(t);
    try { localStorage.setItem('notpetya:t', String(t)); } catch {}
  }, []);
  const setActiveId = useCallback((id) => {
    setActiveIdRaw(id);
    try { localStorage.setItem('notpetya:active', id); } catch {}
  }, []);

  useEffect(() => {
    const upcoming = [...events].filter(e => e.t <= currentTime + 0.001);
    if (upcoming.length > 0) {
      const latest = upcoming[upcoming.length - 1];
      if (latest.id !== activeId) setActiveId(latest.id);
    }
  }, [currentTime]);

  useEffect(() => {
    if (!playing) return;
    let raf;
    let last = null;
    const step = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setCurrentTimeRaw(prev => {
        const DURATION = 60;
        const next = prev + (dt / DURATION) * speed;
        if (next >= 1) {
          setPlaying(false);
          try { localStorage.setItem('notpetya:t', '1'); } catch {}
          return 1;
        }
        try { localStorage.setItem('notpetya:t', String(next)); } catch {}
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setPlaying(p => !p);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        const idx = events.findIndex(x => x.id === activeId);
        const next = events[Math.max(0, idx - 1)];
        if (next) { setActiveId(next.id); setCurrentTime(next.t); setPlaying(false); }
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        const idx = events.findIndex(x => x.id === activeId);
        const next = events[Math.min(events.length - 1, idx + 1)];
        if (next) { setActiveId(next.id); setCurrentTime(next.t); setPlaying(false); }
      } else if (e.key === '0' || e.code === 'Home') {
        setCurrentTime(0); setActiveId('e01'); setPlaying(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, events]);

  const active = events.find(e => e.id === activeId);
  const firedCount = events.filter(e => e.t <= currentTime).length;

  const [vw, setVw] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1400);
  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  const compact = vw < 1400;
  const leftW = compact ? 220 : 280;
  const rightW = compact ? 360 : 460; // globe column
  const centerMin = compact ? 380 : 460; // detail column

  const damageTotal = useMemo(() => {
    let total = 0;
    if (currentTime > 0.68) total = Math.min(15000, 10000 + (currentTime - 0.68) * 15000);
    else if (currentTime > 0.44) total = (currentTime - 0.44) * 42000;
    return total;
  }, [currentTime]);

  const currentPhase = phases.find(p => currentTime >= p.start && currentTime < p.end) || phases[phases.length - 1];

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'grid',
      gridTemplateRows: 'auto 36vh 1fr',
      gridTemplateColumns: `${leftW}px 1fr ${rightW}px`,
      gap: 0,
      background: '#0d0b08',
      color: '#e6dcc8',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        gridColumn: '1 / -1',
        borderBottom: '1px solid rgba(230,220,200,0.12)',
        padding: '14px 28px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        background: '#0a0907',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 10, height: 10, background: '#dc3c28', borderRadius: 1,
            animation: 'pulse 1.6s infinite',
          }}/>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10, letterSpacing: '0.2em', color: 'rgba(230,220,200,0.55)',
            textTransform: 'uppercase',
          }}>CLASSIFIED · DOSSIER 2017-27/06</div>
        </div>

        <div style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: '#f6f1e4',
        }}>
          NotPetya <span style={{ color: 'rgba(230,220,200,0.4)', fontStyle: 'italic', fontWeight: 400 }}>— an incident reconstruction</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <Stat label="Records" value={`${firedCount} / ${events.length}`} />
          <Stat label="Cumulative damage" value={formatDamage(damageTotal)} accent={damageTotal > 0} />
          <Stat label="Playhead" value={`${Math.round(currentTime * 100)}%`} mono />
        </div>
      </header>

      {/* ───── TIMELINE HERO ROW (1/3 screen height) ───── */}
      <section style={{
        gridColumn: '1 / -1',
        gridRow: '2 / 3',
        background: 'linear-gradient(180deg, #0a0907 0%, #0d0b08 100%)',
        borderBottom: '1px solid rgba(230,220,200,0.12)',
        padding: '22px 40px 24px',
        display: 'flex', flexDirection: 'column',
        gap: 14,
        overflow: 'hidden',
      }}>
        {/* Phase + playback bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{
            padding: '4px 12px',
            background: currentPhase.id === 'prelude' ? '#d4a03c' : currentPhase.id === 'detonation' ? '#dc3c28' : '#b4afa5',
            color: '#0a0907',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontSize: 10,
          }}>
            ▸ PHASE · {currentPhase.label.split('·')[0].trim()}
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'rgba(230,220,200,0.6)',
          }}>{currentPhase.range}</span>

          {active && (
            <span style={{
              marginLeft: 10,
              fontFamily: "'Fraunces', serif",
              fontSize: 15,
              fontStyle: 'italic',
              color: 'rgba(230,220,200,0.72)',
              fontWeight: 400,
            }}>
              <span style={{ color: 'rgba(230,220,200,0.4)' }}>viewing · </span>
              {active.dateLabel}
            </span>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <PlayButton playing={playing} onClick={() => setPlaying(p => !p)} />
            <button
              onClick={() => { setCurrentTime(0); setActiveId('e01'); setPlaying(false); }}
              style={ctrlBtnStyle}
              title="Reset"
            >⏮</button>
            <SpeedControl speed={speed} setSpeed={setSpeed} />
          </div>
        </div>

        {/* The highlighted timeline */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%' }}>
            <TimelineTrack
              events={events}
              phases={phases}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              activeId={activeId}
              setActiveId={setActiveId}
              playing={playing}
              setPlaying={setPlaying}
            />
          </div>
        </div>

        {/* Hints */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5,
          letterSpacing: '0.14em',
          color: 'rgba(230,220,200,0.38)',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          ← → step events &nbsp;·&nbsp; space play/pause &nbsp;·&nbsp; drag track to scrub &nbsp;·&nbsp; click pins to jump
        </div>
      </section>

      {/* ───── ROW 3: left list / center map / right detail ───── */}
      <aside style={{
        gridRow: '3 / 4',
        gridColumn: '1',
        borderRight: '1px solid rgba(230,220,200,0.12)',
        overflow: 'hidden',
        background: 'rgba(10,9,7,0.6)',
        minHeight: 0,
      }}>
        <EventList
          events={events}
          activeId={activeId}
          onSelect={(e) => { setActiveId(e.id); setCurrentTime(e.t); setPlaying(false); }}
          currentTime={currentTime}
        />
      </aside>

      <main style={{
        gridRow: '3 / 4',
        gridColumn: '2',
        overflow: 'hidden',
        background: 'rgba(10,9,7,0.4)',
        minHeight: 0,
        borderRight: '1px solid rgba(230,220,200,0.12)',
      }}>
        <EventDetail event={active} />
      </main>

      <section style={{
        gridRow: '3 / 4',
        gridColumn: '3',
        padding: '20px 24px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden',
        minWidth: 0,
        minHeight: 0,
        background: 'radial-gradient(ellipse at center, rgba(20,18,15,0.8) 0%, rgba(10,9,7,1) 70%)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(230,220,200,0.55)',
        }}>
          <span>Incident Globe</span>
          {active && <span style={{ color: 'rgba(230,220,200,0.4)' }}>{active.location.split(',')[0]}</span>}
        </div>

        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WorldMap events={events} currentTime={currentTime} activeEvent={active} />
        </div>

        <div style={{
          display: 'flex', gap: 16, justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(230,220,200,0.5)',
        }}>
          <LegendDot color="#d4a03c" label="Prelude" />
          <LegendDot color="#dc3c28" label="Detonation" />
          <LegendDot color="#b4afa5" label="Fallout" />
        </div>
      </section>
    </div>
  );
};

const Stat = ({ label, value, accent, mono }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'rgba(230,220,200,0.45)',
    }}>{label}</span>
    <span style={{
      fontFamily: mono !== false ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
      fontSize: 13,
      fontWeight: 600,
      color: accent ? '#dc3c28' : '#f6f1e4',
      fontVariantNumeric: 'tabular-nums',
    }}>{value}</span>
  </div>
);

const formatDamage = (m) => {
  if (!m || m <= 0) return '—';
  if (m >= 1000) return `$${(m/1000).toFixed(1)}B`;
  return `$${Math.round(m)}M`;
};

const LegendDot = ({ color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }}/>
    <span>{label}</span>
  </div>
);

const PlayButton = ({ playing, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: 40, height: 40,
      background: playing ? 'rgba(230,220,200,0.1)' : '#dc3c28',
      border: '1px solid rgba(230,220,200,0.2)',
      color: playing ? '#f6f1e4' : '#0a0907',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 2,
    }}
    title={playing ? 'Pause (space)' : 'Play (space)'}
  >
    {playing ? (
      <svg width="12" height="14" viewBox="0 0 14 16"><rect x="1" y="0" width="4" height="16" fill="currentColor"/><rect x="9" y="0" width="4" height="16" fill="currentColor"/></svg>
    ) : (
      <svg width="12" height="14" viewBox="0 0 14 16"><path d="M1 0 L13 8 L1 16 Z" fill="currentColor"/></svg>
    )}
  </button>
);

const ctrlBtnStyle = {
  width: 34, height: 34,
  background: 'rgba(230,220,200,0.04)',
  border: '1px solid rgba(230,220,200,0.14)',
  color: 'rgba(230,220,200,0.7)',
  cursor: 'pointer',
  fontSize: 14,
  fontFamily: "'JetBrains Mono', monospace",
  borderRadius: 2,
};

const SpeedControl = ({ speed, setSpeed }) => {
  const speeds = [1, 2, 4, 8];
  return (
    <div style={{ display: 'flex', gap: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>
      {speeds.map(s => (
        <button
          key={s}
          onClick={() => setSpeed(s)}
          style={{
            padding: '8px 10px',
            background: speed === s ? '#e6dcc8' : 'rgba(230,220,200,0.04)',
            color: speed === s ? '#0a0907' : 'rgba(230,220,200,0.7)',
            border: '1px solid rgba(230,220,200,0.14)',
            cursor: 'pointer',
            fontWeight: speed === s ? 700 : 500,
            borderRadius: 0,
          }}
        >{s}×</button>
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
