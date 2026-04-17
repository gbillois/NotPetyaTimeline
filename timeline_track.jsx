// Timeline track — three stacked rows:
//   1. Phase labels (top)
//   2. Year ticks
//   3. Track: phase bands + rail + event pins + playhead

const TimelineTrack = ({ events, phases, currentTime, setCurrentTime, activeId, setActiveId, playing, setPlaying }) => {
  const trackRef = React.useRef(null);
  const [hoverT, setHoverT] = React.useState(null);
  const [dragging, setDragging] = React.useState(false);

  const onMove = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (dragging) setCurrentTime(t); else setHoverT(t);
  };

  const onDown = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(t);
    setDragging(true);
    setPlaying(false);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    const move = (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setCurrentTime(t);
    };
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mousemove', move);
    };
  }, [dragging]);

  const ticks = [
    { t: 0, label: '2013' },
    { t: 0.05, label: 'AUG ’16' },
    { t: 0.19, label: 'APR ’17' },
    { t: 0.26, label: 'MAY ’17' },
    { t: 0.44, label: 'JUN 27' },
    { t: 0.76, label: 'JUL ’17' },
    { t: 0.83, label: 'FEB ’18' },
    { t: 0.89, label: 'OCT ’20' },
    { t: 0.93, label: 'JAN ’22' },
    { t: 1, label: 'MAR ’23' },
  ];

  const phaseColorOf = (id) => id === 'prelude' ? '#d4a03c' : id === 'detonation' ? '#dc3c28' : '#b4afa5';

  return (
    <div style={{ width: '100%', padding: '0', position: 'relative' }}>
      {/* ── Row 1: Phase labels ─────────────────────────────── */}
      <div style={{ position: 'relative', height: 18, marginBottom: 4 }}>
        {phases.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.start * 100}%`,
            width: `${(p.end - p.start) * 100}%`,
            top: 0,
            paddingLeft: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: phaseColorOf(p.id),
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            <span>{p.label}</span>
            <span style={{ opacity: 0.55, marginLeft: 8, fontWeight: 500 }}>{p.range}</span>
          </div>
        ))}
      </div>

      {/* ── Row 2: Year ticks ────────────────────────────────── */}
      <div style={{
        position: 'relative', height: 16, marginBottom: 6,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9.5,
        color: 'rgba(230,220,200,0.45)',
        letterSpacing: '0.08em',
      }}>
        {ticks.map(tick => (
          <div key={tick.label} style={{
            position: 'absolute',
            left: `${tick.t * 100}%`,
            transform: tick.t === 1 ? 'translateX(-100%)' : tick.t === 0 ? 'translateX(0)' : 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              display: 'inline-block',
              borderLeft: '1px solid rgba(230,220,200,0.25)',
              paddingLeft: 4,
              paddingTop: 1,
            }}>{tick.label}</span>
          </div>
        ))}
      </div>

      {/* ── Row 3: Main track ────────────────────────────────── */}
      <div
        ref={trackRef}
        onMouseMove={onMove}
        onMouseLeave={() => setHoverT(null)}
        onMouseDown={onDown}
        style={{
          position: 'relative',
          height: 62,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Phase bands */}
        {phases.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.start * 100}%`,
            width: `${(p.end - p.start) * 100}%`,
            top: 22, height: 18,
            background: p.id === 'prelude' ? 'rgba(212,160,60,0.12)'
              : p.id === 'detonation' ? 'rgba(220,60,40,0.18)'
              : 'rgba(180,175,165,0.08)',
            borderLeft: '1px solid rgba(230,220,200,0.15)',
            borderRight: p.id === 'fallout' ? '1px solid rgba(230,220,200,0.15)' : 'none',
          }} />
        ))}

        {/* Progress fill */}
        <div style={{
          position: 'absolute',
          left: 0, width: `${currentTime * 100}%`,
          top: 22, height: 18,
          background: 'linear-gradient(90deg, rgba(212,160,60,0.35) 0%, rgba(220,60,40,0.5) 46%, rgba(180,175,165,0.25) 100%)',
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }} />

        {/* Central rail */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: 30, height: 2,
          background: 'rgba(230,220,200,0.25)',
          pointerEvents: 'none',
        }} />

        {/* Event pins */}
        {events.map(evt => {
          const active = evt.id === activeId;
          const fired = evt.t <= currentTime;
          const color = phaseColorOf(evt.phase);
          const stagger = (parseInt(evt.id.slice(1)) % 2 === 0) ? -1 : 1;
          return (
            <div key={evt.id}
              onClick={(e) => { e.stopPropagation(); setActiveId(evt.id); setCurrentTime(evt.t); setPlaying(false); }}
              style={{
                position: 'absolute',
                left: `${evt.t * 100}%`,
                top: stagger > 0 ? 42 : 10,
                transform: 'translateX(-50%)',
                cursor: 'pointer',
                zIndex: active ? 20 : 10,
              }}
              title={evt.title}
            >
              <div style={{
                width: active ? 12 : 8,
                height: active ? 12 : 8,
                background: fired ? color : 'transparent',
                border: `1.5px solid ${color}`,
                borderRadius: '50%',
                transition: 'all 180ms',
                boxShadow: active ? `0 0 0 4px ${color}33, 0 0 12px ${color}` : 'none',
              }} />
              <div style={{
                position: 'absolute',
                left: '50%',
                top: stagger > 0 ? -12 : 8,
                height: 14,
                width: 1,
                background: fired ? color : 'rgba(230,220,200,0.2)',
                transform: 'translateX(-50%)',
              }} />
            </div>
          );
        })}

        {/* Playhead */}
        <div style={{
          position: 'absolute',
          left: `${currentTime * 100}%`,
          top: 0, bottom: 0,
          width: 2,
          transform: 'translateX(-50%)',
          background: '#f6f1e4',
          pointerEvents: 'none',
          boxShadow: '0 0 12px rgba(246,241,228,0.6)',
        }}>
          <div style={{
            position: 'absolute',
            top: -4, left: '50%',
            transform: 'translateX(-50%)',
            width: 10, height: 10,
            background: '#f6f1e4',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}/>
        </div>

        {hoverT !== null && !dragging && (
          <div style={{
            position: 'absolute',
            left: `${hoverT * 100}%`,
            top: 0, bottom: 0,
            width: 1,
            transform: 'translateX(-50%)',
            background: 'rgba(246,241,228,0.3)',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </div>
  );
};

window.TimelineTrack = TimelineTrack;
