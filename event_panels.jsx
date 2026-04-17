// Event detail panel — shows the currently selected event's full description
// Also a left-side event list for direct navigation

const phaseLabel = (phase) => ({
  prelude: 'PRELUDE', detonation: 'DETONATION', fallout: 'FALLOUT'
}[phase] || phase.toUpperCase());

const phaseColor = (phase) => ({
  prelude: '#d4a03c', detonation: '#dc3c28', fallout: '#b4afa5'
}[phase] || '#b4afa5');

const kindIcon = (kind) => {
  const map = {
    intelligence: 'INTEL',
    leak: 'LEAK',
    defense: 'PATCH',
    attack: 'STRIKE',
    intrusion: 'BREACH',
    impact: 'IMPACT',
    analysis: 'FORENSIC',
    recovery: 'RECOVERY',
    attribution: 'ATTRIB.',
    insurance: 'LEGAL',
  };
  return map[kind] || kind.toUpperCase();
};

const EventDetail = ({ event }) => {
  if (!event) return (
    <div style={{
      padding: 24,
      color: 'rgba(230,220,200,0.4)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      letterSpacing: '0.04em',
    }}>
      Scrub the timeline or click an event pin to inspect the record.
    </div>
  );

  const color = phaseColor(event.phase);

  return (
    <div style={{
      padding: '28px 32px 36px',
      fontFamily: "'Inter', sans-serif",
      color: '#e6dcc8',
      position: 'relative',
      overflowY: 'auto',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Header band */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 20,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        <span style={{
          padding: '3px 8px',
          background: color,
          color: '#13110e',
          fontWeight: 700,
        }}>
          {phaseLabel(event.phase)}
        </span>
        <span style={{ color: 'rgba(230,220,200,0.5)' }}>{kindIcon(event.kind)}</span>
        <span style={{ color: 'rgba(230,220,200,0.4)', marginLeft: 'auto', fontSize: 10 }}>
          FILE #{event.id.toUpperCase()}
        </span>
      </div>

      {/* Date + location */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        color: 'rgba(230,220,200,0.55)',
        letterSpacing: '0.08em',
        marginBottom: 6,
      }}>
        {event.dateLabel.toUpperCase()} · {event.location.toUpperCase()}
      </div>

      {/* Title */}
      <h2 style={{
        margin: '0 0 18px 0',
        fontFamily: "'Fraunces', 'Times New Roman', serif",
        fontSize: 34,
        fontWeight: 500,
        lineHeight: 1.08,
        letterSpacing: '-0.01em',
        color: '#f6f1e4',
      }}>
        {event.title}
      </h2>

      {/* Severity ticker */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 20,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.1em',
        color: 'rgba(230,220,200,0.6)',
      }}>
        <span>SEVERITY</span>
        <div style={{ display: 'flex', gap: 3 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              width: 14, height: 6,
              background: i <= event.severity ? color : 'rgba(230,220,200,0.12)',
            }}/>
          ))}
        </div>
        <span style={{ color: 'rgba(230,220,200,0.4)', marginLeft: 8 }}>
          {['','LOW','MODERATE','HIGH','SEVERE','CRITICAL'][event.severity]}
        </span>
      </div>

      {/* Lede */}
      <div style={{
        borderLeft: `2px solid ${color}`,
        paddingLeft: 16,
        marginBottom: 22,
        fontFamily: "'Fraunces', serif",
        fontSize: 17,
        lineHeight: 1.45,
        color: '#e6dcc8',
        fontStyle: 'italic',
        fontWeight: 400,
      }}>
        {event.headline}
      </div>

      {/* Body */}
      <div style={{
        fontSize: 14.5,
        lineHeight: 1.65,
        color: 'rgba(230,220,200,0.88)',
        marginBottom: 22,
        textWrap: 'pretty',
      }}>
        {event.body}
      </div>

      {/* Metadata grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 12,
        marginTop: 24,
        paddingTop: 20,
        borderTop: '1px solid rgba(230,220,200,0.12)',
      }}>
        {event.casualties && (
          <MetaRow label="Impact" value={event.casualties} />
        )}
        {event.damageUSD && (
          <MetaRow label="Damage" value={event.damageUSD} highlight={color} />
        )}
        {event.artifacts && event.artifacts.length > 0 && (
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(230,220,200,0.45)',
              marginBottom: 8,
            }}>
              Artifacts
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {event.artifacts.map((a, i) => (
                <span key={i} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  padding: '3px 8px',
                  background: 'rgba(230,220,200,0.06)',
                  border: '1px solid rgba(230,220,200,0.14)',
                  color: '#e6dcc8',
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MetaRow = ({ label, value, highlight }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 16,
    padding: '6px 0',
    borderBottom: '1px dashed rgba(230,220,200,0.1)',
  }}>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'rgba(230,220,200,0.5)',
    }}>{label}</span>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
      color: highlight || '#f6f1e4',
      fontWeight: 600,
      textAlign: 'right',
    }}>{value}</span>
  </div>
);

// Compact event list — left side navigator
const EventList = ({ events, activeId, onSelect, currentTime }) => {
  const listRef = React.useRef(null);
  const activeRef = React.useRef(null);

  // Scroll active item into view within the list (not page)
  React.useEffect(() => {
    if (activeRef.current && listRef.current) {
      const li = activeRef.current;
      const ul = listRef.current;
      const liTop = li.offsetTop - ul.offsetTop;
      const liBottom = liTop + li.offsetHeight;
      if (liTop < ul.scrollTop) {
        ul.scrollTop = liTop - 8;
      } else if (liBottom > ul.scrollTop + ul.clientHeight) {
        ul.scrollTop = liBottom - ul.clientHeight + 8;
      }
    }
  }, [activeId]);

  return (
    <div ref={listRef} style={{
      height: '100%',
      overflowY: 'auto',
      padding: '16px 0',
    }}>
      <div style={{
        padding: '0 20px 12px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(230,220,200,0.4)',
      }}>
        Chronology · {events.length} records
      </div>
      {events.map(evt => {
        const active = evt.id === activeId;
        const fired = evt.t <= currentTime;
        const color = phaseColor(evt.phase);
        return (
          <div
            key={evt.id}
            ref={active ? activeRef : null}
            onClick={() => onSelect(evt)}
            style={{
              padding: '10px 20px 10px 16px',
              borderLeft: `3px solid ${active ? color : fired ? color + '66' : 'transparent'}`,
              background: active ? 'rgba(230,220,200,0.05)' : 'transparent',
              cursor: 'pointer',
              transition: 'background 150ms',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(230,220,200,0.03)'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.08em',
              color: fired ? 'rgba(230,220,200,0.55)' : 'rgba(230,220,200,0.25)',
              width: 54,
              flexShrink: 0,
              paddingTop: 2,
              lineHeight: 1.4,
            }}>
              {evt.dateLabel.split(',')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12.5,
                fontWeight: active ? 600 : 500,
                color: active ? '#f6f1e4' : fired ? '#e6dcc8' : 'rgba(230,220,200,0.45)',
                lineHeight: 1.3,
                letterSpacing: '-0.005em',
              }}>
                {evt.title}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: color + 'bb',
                letterSpacing: '0.12em',
                marginTop: 3,
                textTransform: 'uppercase',
              }}>
                {kindIcon(evt.kind)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

window.EventDetail = EventDetail;
window.EventList = EventList;
window.phaseLabel = phaseLabel;
window.phaseColor = phaseColor;
